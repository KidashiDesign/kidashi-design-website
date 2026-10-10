#!/usr/bin/env python3
"""Erzeugt die statische deutsche Seite (/de/...) aus den englischen Seiten.

Quelle der Wahrheit sind die ENGLISCHEN Seiten. Jeder deutsche Text steht dort
bereits neben dem englischen in den Attributen data-de, data-de-html und
data-de-<attribut>. Dieses Skript setzt diese Texte fest in eine eigene
HTML-Datei unter /de/ ein, damit Suchmaschinen und KI-Crawler (die keinen
Sprachumschalter per JavaScript bedienen) beide Sprachen als eigene URLs sehen.

Aufruf (im Projektordner):   python3 scripts/build-de.py --lastmod 2026-10-10

Das Skript ist idempotent und
  * schreibt den Ordner de/ komplett neu,
  * schreibt sitemap.xml neu (beide Sprachen, mit hreflang-Alternativen),
  * stellt in den englischen Seiten Sprachumschalter, hreflang- und
    og:locale-Markup sicher (nur die Zeilen zwischen den i18n-Markern).

Wichtig: Nach jeder inhaltlichen Aenderung an einer englischen Seite (oder an
deren data-de-Texten) muss das Skript erneut laufen und das Ergebnis mit
committet werden. Die Dateien unter de/ nicht von Hand bearbeiten.
"""
import argparse
import html
import json
import posixpath
import re
import shutil
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.kidashidesign.com"

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}
TRANSLATABLE_ATTRS = {"placeholder", "content", "alt", "aria-label", "title",
                      "value", "data-label"}
URL_ATTRS = {"href", "src", "poster", "data-src", "action"}

M_START = "<!-- i18n:start -->"
M_END = "<!-- i18n:end -->"

# Deutsche Fassungen fuer Schema-Texte, die keine sichtbare Entsprechung auf der
# Seite haben. Exakte Treffer zuerst, danach Praefix-Treffer (fuer lange Texte).
DE_EXACT = {
    "Worldwide": "Weltweit",
    "Germany": "Deutschland",
    "Austria": "Österreich",
    "Switzerland": "Schweiz",
    "Georgia": "Georgien",
    "Tbilisi": "Tiflis",
    "Tbilisi, Georgia": "Tiflis, Georgien",
    "Bavaria, Germany": "Bayern, Deutschland",
    "Graphic Design": "Grafikdesign",
    "Logo Design": "Logodesign",
    "Web Design": "Webdesign",
    "Print Design": "Printdesign",
    "Social Media Design": "Social-Media-Design",
    "Visual Identity": "Visuelle Identität",
    "Brand Identity": "Markenidentität",
    "Brand Identity Design": "Markenidentität",
    "Social Media Management": "Social-Media-Management",
    "Graphic Designer and Web Designer": "Grafik- und Webdesignerin",
    "customer service": "Kundenservice",
    "English": "Englisch",
    "German": "Deutsch",
}
DE_PREFIX = [
    ("Kidashi Design is a freelance design studio",
     "Kidashi Design ist ein freiberufliches Designstudio, gegründet von Nicole "
     "Szatkowski, und gestaltet Markenidentitäten, Websites, Printdesign und "
     "Social-Media-Inhalte für Unternehmen, Startups und kreative Projekte."),
    ("Nicole Szatkowski is a freelance graphic and web designer",
     "Nicole Szatkowski ist freiberufliche Grafik- und Webdesignerin, "
     "ursprünglich aus Bayern und derzeit in Tiflis, Georgien, ansässig. Mit "
     "rund fünf Jahren Erfahrung entwickelt sie visuelle Identitäten, Websites, "
     "Printmaterialien und Social-Media-Design für Unternehmen und kreative "
     "Projekte international."),
    ("Logo design, color palette, typography system and brand guidelines",
     "Logodesign, Farbpalette, Typografie-System und Brand Guidelines — ein "
     "konsistenter Auftritt über digital, Print und Social Media hinweg."),
    ("Business cards, flyers, brochures and packaging design",
     "Visitenkarten, Flyer, Broschüren und Packaging-Design — produktionsreife "
     "Dateien, abgestimmt auf deine Marke."),
    ("Content calendars, post templates and profile design",
     "Content-Kalender, Post-Templates und Profil-Design für konsistentes, "
     "organisches Social-Media-Wachstum."),
    ("Custom website design and development",
     "Individuelles Website-Design und -Entwicklung — schnell, mobil optimiert "
     "und bei Google auffindbar."),
]


# --------------------------------------------------------------------------
# Hilfen
# --------------------------------------------------------------------------
def norm(s):
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s).replace(" ", " ")
    return re.sub(r"\s+", " ", s).strip()


def de_path(path):
    return "/de" + path


def page_file(path):
    return ROOT / path.lstrip("/") / "index.html"


class Scanner(HTMLParser):
    """Merkt sich Position, Rohtext und Inhaltsbereich jedes Tags."""

    def __init__(self, text):
        super().__init__(convert_charrefs=False)
        self.text = text
        self.line_starts = [0] + [m.end() for m in re.finditer("\n", text)]
        self.tags = []
        self.stack = []
        self.feed(text)
        self.close()

    def _offset(self):
        line, col = self.getpos()
        return self.line_starts[line - 1] + col

    def _record(self, tag):
        start = self._offset()
        raw = self.get_starttag_text()
        assert self.text[start:start + len(raw)] == raw, (tag, start)
        rec = {"name": tag, "start": start, "end": start + len(raw),
               "raw": raw, "inner_end": None, "close_end": None}
        self.tags.append(rec)
        return rec

    def handle_starttag(self, tag, attrs):
        rec = self._record(tag)
        if tag not in VOID:
            self.stack.append(rec)

    def handle_startendtag(self, tag, attrs):
        self._record(tag)

    def handle_endtag(self, tag):
        start = self._offset()
        m = re.compile(r"</\s*%s\s*>" % re.escape(tag), re.I).match(self.text, start)
        close_end = m.end() if m else start
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i]["name"] == tag:
                rec = self.stack[i]
                rec["inner_end"] = start
                rec["close_end"] = close_end
                del self.stack[i:]
                break


ATTR_RE = re.compile(
    r"""\s+([^\s"'<>/=]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?""")


class Tag:
    """Zerlegter Start-Tag; unveraenderte Attribute bleiben Byte fuer Byte."""

    def __init__(self, raw):
        m = re.match(r"<([a-zA-Z][^\s/>]*)", raw)
        self.name = m.group(1)
        self.selfclose = raw.rstrip().endswith("/>")
        self.attrs = []  # [name, raw_value|None, segment|None]
        for am in ATTR_RE.finditer(raw, m.end()):
            v = am.group(2)
            if v is not None and v[0] in "\"'":
                v = v[1:-1]
            self.attrs.append([am.group(1), v, am.group(0)])

    def get(self, name):
        for n, v, _ in self.attrs:
            if n == name:
                return v
        return None

    def has(self, name):
        return any(n == name for n, _, _ in self.attrs)

    def set(self, name, raw_value):
        for a in self.attrs:
            if a[0] == name:
                a[1], a[2] = raw_value, None
                return
        self.attrs.append([name, raw_value, None])

    def delete(self, name):
        self.attrs = [a for a in self.attrs if a[0] != name]

    def build(self):
        out = ["<" + self.name]
        for n, v, seg in self.attrs:
            if seg is not None:
                out.append(seg)
            elif v is None:
                out.append(" " + n)
            else:
                q = "'" if ('"' in v and "'" not in v) else '"'
                if q == '"':
                    v = v.replace('"', "&quot;")
                out.append(f" {n}={q}{v}{q}")
        out.append("/>" if self.selfclose else ">")
        return "".join(out)


# --------------------------------------------------------------------------
# Seiten und Pfade
# --------------------------------------------------------------------------
def read_sitemap_entries():
    xml = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    entries = []
    for m in re.finditer(r"<url>(.*?)</url>", xml, re.S):
        blk = m.group(1)
        loc = re.search(r"<loc>(.*?)</loc>", blk).group(1).strip()
        if not loc.startswith(SITE):
            continue
        path = loc[len(SITE):] or "/"
        if path.startswith("/de/"):
            continue
        prio = re.search(r"<priority>(.*?)</priority>", blk)
        entries.append((path, prio.group(1) if prio else "0.7"))
    return entries


def make_url_fixer(page_path, translated):
    page_dir = page_path if page_path.endswith("/") else posixpath.dirname(page_path) + "/"

    def to_root(val):
        """Relativen Pfad zu einem root-absoluten machen; Seitenlinks -> /de/."""
        raw = html.unescape(val).strip()
        if not raw or re.match(r"^([a-z][a-z0-9+.-]*:|//|#)", raw, re.I):
            return None
        u = urlsplit(raw)
        if u.path == "":
            return None
        trailing = u.path.endswith("/")
        p = u.path if u.path.startswith("/") else posixpath.join(page_dir, u.path)
        p = posixpath.normpath(p)
        if trailing and not p.endswith("/"):
            p += "/"
        if p.endswith("/index.html"):
            p = p[: -len("index.html")]
        if p == "/index.html":
            p = "/"
        if p in translated:
            p = de_path(p)
        return urlunsplit(("", "", p, u.query, u.fragment))

    return to_root


TAG_RE = re.compile(
    r"""<[a-zA-Z][^\s/>]*(?:\s+[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*\s*/?>""")


def fix_fragment(fragment, to_root):
    """HTML-Schnipsel aus data-de-html: Links umschreiben, data-de* entfernen."""
    def rep(m):
        tg = Tag(m.group(0))
        changed = False
        for n in URL_ATTRS:
            v = tg.get(n)
            if v is None:
                continue
            new = to_root(v)
            if new is not None:
                tg.set(n, html.escape(new, quote=False).replace('"', "&quot;"))
                changed = True
        for n in [a[0] for a in tg.attrs]:
            if n == "data-de" or n.startswith("data-de-"):
                tg.delete(n)
                changed = True
        return tg.build() if changed else m.group(0)
    return TAG_RE.sub(rep, fragment)


def fix_css_urls(css, to_root):
    def rep(m):
        q, u = m.group(1), m.group(2)
        new = to_root(u)
        return f"url({q}{new}{q})" if new else m.group(0)
    return re.sub(r"url\(\s*(['\"]?)([^)'\"]+)\1\s*\)", rep, css)


def fix_js_imports(js, to_root):
    def rep(m):
        new = to_root(m.group(3))
        return f"{m.group(1)}{m.group(2)}{new}{m.group(2)}" if new else m.group(0)
    return re.sub(r"""(\bfrom\s*|\bimport\s*\(?\s*)(["'])(\.{1,2}/[^"']+)\2""", rep, js)


# --------------------------------------------------------------------------
# Schema (JSON-LD) ins Deutsche
# --------------------------------------------------------------------------
SKIP_KEYS = {"@context", "@type", "@id", "logo", "image", "sameAs", "email",
             "telephone", "foundingDate", "position", "width", "height",
             "addressCountry", "contentUrl", "inLanguage", "alternateName"}


def translate_jsonld(node, pairs, translated, report, id_map, parent_type=None):
    if isinstance(node, list):
        return [translate_jsonld(n, pairs, translated, report, id_map, parent_type) for n in node]
    if isinstance(node, dict):
        t = node.get("@type")
        out = {}
        for k, v in node.items():
            if k == "@id" and isinstance(v, str):
                out[k] = id_map.get(v, v)
            elif k in SKIP_KEYS:
                out[k] = v
            elif k in ("url", "item") and isinstance(v, str):
                path = v[len(SITE):] if v.startswith(SITE) else None
                if (path in translated and t != "Organization"):
                    out[k] = SITE + de_path(path)
                else:
                    out[k] = v
            else:
                out[k] = translate_jsonld(v, pairs, translated, report, id_map, t)
        return out
    if isinstance(node, str):
        n = norm(node)
        if n in pairs:
            return pairs[n]
        if node in DE_EXACT:
            return DE_EXACT[node]
        for pre, de in DE_PREFIX:
            if node.startswith(pre):
                return de
        if re.search(r"[A-Za-z]{4,} [A-Za-z]{3,} [A-Za-z]{3,}", node) and not node.startswith("http"):
            report.append(node)
        return node
    return node


# --------------------------------------------------------------------------
# Markup fuer beide Sprachen
# --------------------------------------------------------------------------
def alternates_block(path, lang):
    en = SITE + path
    de = SITE + de_path(path)
    loc, alt = ("en_US", "de_DE") if lang == "en" else ("de_DE", "en_US")
    return (f"{M_START}\n"
            f'  <link rel="alternate" hreflang="en" href="{en}">\n'
            f'  <link rel="alternate" hreflang="de" href="{de}">\n'
            f'  <link rel="alternate" hreflang="x-default" href="{en}">\n'
            f'  <meta property="og:locale" content="{loc}">\n'
            f'  <meta property="og:locale:alternate" content="{alt}">\n'
            f"  {M_END}")


def switcher_inner(path, lang):
    en = path
    de = de_path(path)

    def a(code, href, label, active):
        cls = "nav__lang-btn active" if active else "nav__lang-btn"
        cur = ' aria-current="true"' if active else ""
        return (f'<a href="{href}" class="{cls}" data-lang-btn="{code}" '
                f'hreflang="{code}" lang="{code}"{cur}>{label}</a>')

    return (a("en", en, "EN", lang == "en") + '<span class="nav__lang-sep">/</span>'
            + a("de", de, "DE", lang == "de"))


SWITCH_RE = re.compile(
    r'(<div class="(?:nav__lang|nav__mobile-lang)" role="group" '
    r'aria-label="Language / Sprache">)(.*?)(</div>)', re.S)


def apply_language_markup(text, path, lang):
    """Umschalter, hreflang, og:locale und html-Attribute fuer eine Sprache."""
    text = SWITCH_RE.sub(lambda m: m.group(1) + switcher_inner(path, lang) + m.group(3), text)
    text = re.sub(r"[ \t]*" + re.escape(M_START) + r".*?" + re.escape(M_END) + r"[ \t]*\n?",
                  "", text, flags=re.S)
    block = alternates_block(path, lang)
    new, n = re.subn(r'(<link rel="canonical"[^>]*>)', lambda m: m.group(1) + "\n  " + block,
                     text, count=1)
    if n != 1:
        raise SystemExit(f"Kein canonical-Link in {path}")
    text = new
    text = re.sub(r"<html\b[^>]*>", f'<html lang="{lang}" data-lang="{lang}">', text, count=1)
    return text


# --------------------------------------------------------------------------
# Deutsche Seite erzeugen
# --------------------------------------------------------------------------
def build_german(text_en, path, translated, warnings):
    sc = Scanner(text_en)
    to_root = make_url_fixer(path, translated)

    # EN -> DE Paare der Seite (fuer Schema-Texte)
    pairs = {}
    for rec in sc.tags:
        tg = Tag(rec["raw"])
        if rec["inner_end"] is None:
            continue
        for attr, is_html in (("data-de", False), ("data-de-html", True)):
            v = tg.get(attr)
            if v is not None:
                pairs[norm(text_en[rec["end"]:rec["inner_end"]])] = norm(v)

    # Seitenbezogene Schema-IDs (FAQ, Breadcrumb, WebPage) bekommen in der deutschen
    # Fassung eigene IDs; Entitaeten (Organization, Person, Service) bleiben gleich.
    id_map = {}
    for rec in sc.tags:
        if rec["name"] == "script" and rec["inner_end"] is not None \
                and "ld+json" in (Tag(rec["raw"]).get("type") or "").lower():
            obj = json.loads(text_en[rec["end"]:rec["inner_end"]])
            for node in (obj if isinstance(obj, list) else obj.get("@graph", [obj])):
                if isinstance(node, dict) and node.get("@type") in ("FAQPage", "BreadcrumbList", "WebPage") \
                        and isinstance(node.get("@id"), str) and node["@id"].startswith(SITE + "/"):
                    id_map[node["@id"]] = SITE + de_path(node["@id"][len(SITE):])

    de_title_raw = None
    for rec in sc.tags:
        if rec["name"] == "title":
            de_title_raw = Tag(rec["raw"]).get("data-de")
            break

    edits = []  # (start, end, text, kind)
    for rec in sc.tags:
        tg = Tag(rec["raw"])
        changed = False
        name = tg.name.lower()

        # Meta-Tags: deutscher Titel als Fallback fuer og:title, Warnung bei fehlender Beschreibung
        if name == "meta":
            if tg.get("property") == "og:title" and not tg.has("data-de-content"):
                if de_title_raw:
                    tg.set("content", de_title_raw)
                    changed = True
                else:
                    warnings.append(f"{path}: og:title ohne deutsche Fassung")
            if tg.get("name") == "description" and not tg.has("data-de-content"):
                warnings.append(f"{path}: Meta-Description ohne deutsche Fassung")
            if tg.get("property") == "og:description" and not tg.has("data-de-content"):
                warnings.append(f"{path}: og:description ohne deutsche Fassung")

        # data-de-<attr> -> <attr>
        for n, v, _ in list(tg.attrs):
            if n.startswith("data-de-") and n != "data-de-html":
                target = n[len("data-de-"):]
                if target in TRANSLATABLE_ATTRS:
                    tg.set(target, v)
                elif target == "scramble-words":
                    tg.set("data-scramble-words", v)
                else:
                    warnings.append(f"{path}: unbekanntes Attribut {n}")
                changed = True

        # Inhalt ersetzen
        inner = None
        if tg.has("data-de") or tg.has("data-de-html"):
            if rec["inner_end"] is None:
                raise SystemExit(f"{path}: <{name}> mit data-de hat keinen Schlusstag ({rec['raw'][:80]})")
            if tg.has("data-de-html"):
                inner = fix_fragment(html.unescape(tg.get("data-de-html") or ""), to_root)
            else:
                inner = html.escape(html.unescape(tg.get("data-de") or ""), quote=False)
            edits.append((rec["end"], rec["inner_end"], inner, "inner"))
            changed = True

        for n in [a[0] for a in tg.attrs]:
            if n == "data-de" or n.startswith("data-de-"):
                tg.delete(n)
                changed = True

        # canonical / og:url
        if name == "link" and tg.get("rel") == "canonical":
            tg.set("href", SITE + de_path(path))
            changed = True
        if name == "meta" and tg.get("property") == "og:url":
            tg.set("content", SITE + de_path(path))
            changed = True

        # relative URLs -> absolute (und Seitenlinks -> /de/)
        for n in URL_ATTRS:
            v = tg.get(n)
            if v is None:
                continue
            if name == "link" and n == "href" and tg.get("rel") in ("canonical", "alternate"):
                continue
            new = to_root(v)
            if new is not None:
                tg.set(n, html.escape(new, quote=False).replace('"', "&quot;"))
                changed = True
        if tg.has("style"):
            st = tg.get("style")
            ns = fix_css_urls(st, to_root)
            if ns != st:
                tg.set("style", ns)
                changed = True

        if changed:
            edits.append((rec["start"], rec["end"], tg.build(), "tag"))

        # Inhalte von <style> und <script>
        if rec["inner_end"] is not None:
            body = text_en[rec["end"]:rec["inner_end"]]
            if name == "style":
                nb = fix_css_urls(body, to_root)
                if nb != body:
                    edits.append((rec["end"], rec["inner_end"], nb, "inner"))
            elif name == "script":
                typ = (tg.get("type") or "").lower()
                if "ld+json" in typ:
                    obj = json.loads(body)
                    rep = []
                    obj = translate_jsonld(obj, pairs, translated, rep, id_map)
                    for s in rep:
                        warnings.append(f"{path}: Schema-Text ohne deutsche Fassung: {s[:70]}")
                    dumped = json.dumps(obj, indent=2, ensure_ascii=False)
                    edits.append((rec["end"], rec["inner_end"], "\n" + dumped + "\n", "inner"))
                elif not tg.has("src"):
                    nb = fix_js_imports(body, to_root)
                    if nb != body:
                        edits.append((rec["end"], rec["inner_end"], nb, "inner"))

    # Ueberlappungen: Edits innerhalb ersetzter Inhaltsbereiche verwerfen
    inner_ranges = [(s, e) for s, e, _, k in edits if k == "inner"]
    final = []
    for s, e, t, k in edits:
        if any(rs <= s and e <= re_ and (rs, re_) != (s, e) for rs, re_ in inner_ranges):
            continue
        final.append((s, e, t))
    final.sort(key=lambda x: x[0], reverse=True)
    out = text_en
    for s, e, t in final:
        out = out[:s] + t + out[e:]

    out = apply_language_markup(out, path, "de")
    out = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + SITE + de_path(path) + m.group(2), out, count=1)
    return out


def write_sitemap(entries, lastmod):
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
             'xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for path, prio in entries:
        en, de = SITE + path, SITE + de_path(path)
        for loc in (en, de):
            lines += ["  <url>",
                      f"    <loc>{loc}</loc>",
                      f"    <lastmod>{lastmod}</lastmod>",
                      f"    <priority>{prio}</priority>",
                      f'    <xhtml:link rel="alternate" hreflang="en" href="{en}"/>',
                      f'    <xhtml:link rel="alternate" hreflang="de" href="{de}"/>',
                      f'    <xhtml:link rel="alternate" hreflang="x-default" href="{en}"/>',
                      "  </url>"]
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lastmod", required=True, help="Datum fuer die Sitemap, z. B. 2026-10-10")
    args = ap.parse_args()

    entries = read_sitemap_entries()
    translated = {p for p, _ in entries}
    warnings = []

    shutil.rmtree(ROOT / "de", ignore_errors=True)
    for path, _ in entries:
        src = page_file(path)
        text = src.read_text(encoding="utf-8")
        en_text = apply_language_markup(text, path, "en")
        if en_text != text:
            src.write_text(en_text, encoding="utf-8")
        de_text = build_german(en_text, path, translated, warnings)
        dst = ROOT / "de" / path.lstrip("/") / "index.html"
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(de_text, encoding="utf-8")

    write_sitemap(entries, args.lastmod)
    print(f"{len(entries)} Seiten -> {len(entries)} deutsche Seiten unter de/, Sitemap mit {2 * len(entries)} URLs")
    for w in warnings:
        print("WARNUNG:", w)
    return 0


if __name__ == "__main__":
    sys.exit(main())
