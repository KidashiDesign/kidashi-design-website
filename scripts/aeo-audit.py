#!/usr/bin/env python3
"""
AEO/GEO objective audit script for the Kidashi Design site.

Checks only objective, automatable facts about each indexable page —
title/H1/meta description/canonical presence, word count, H2 count, FAQ
presence, JSON-LD types found, internal link count, images missing alt,
and whether a direct-answer paragraph immediately follows the H1.

This script does NOT assign a content-quality score. It reports facts;
editorial judgment (is the content actually good, does it really answer
the question) belongs in docs/aeo-audit.md and docs/aeo-implementation.md,
written by a human/reviewer reading the page — not graded by the same
code that generated the content.

Usage:
    python3 scripts/aeo-audit.py            # table to stdout
    python3 scripts/aeo-audit.py --json     # machine-readable JSON
"""

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# The canonical, indexable pages (excludes iframe/animation embeds,
# archive/, 404.html, and noindex pages datenschutz/impressum, and the
# canonicalized duplicate artista/).
PAGES = [
    "index.html",
    "about/index.html",
    "services/index.html",
    "services/web-design/index.html",
    "services/brand-identity/index.html",
    "services/print/index.html",
    "services/social-media-management/index.html",
    "portfolio/index.html",
    "portfolio/art-gerecht-modular/index.html",
    "portfolio/artista-magazin/index.html",
    "portfolio/artista-artista/index.html",
    "portfolio/cafe-mira/index.html",
    "portfolio/hideout-georgia/index.html",
    "portfolio/rohyma-jet/index.html",
    "portfolio/seestern/index.html",
    "portfolio/selvoma/index.html",
    "portfolio/social-media-content/index.html",
    "portfolio/tm-studio/index.html",
    "portfolio/woofles/index.html",
    "portfolio/x-commerce/index.html",
    "gallery/index.html",
    "contact/index.html",
]

SITE_PREFIX = "https://www.kidashidesign.com"


class PageParser(HTMLParser):
    """Single-pass parser collecting the objective facts we care about."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = None
        self.canonical = None
        self.meta_description = None
        self.og_tags = set()
        self.h1s = []
        self.h2_count = 0
        self.jsonld_blocks = []
        self.internal_link_count = 0
        self.imgs_missing_alt = []
        self.faq_item_count = 0
        self.details_count = 0

        self._in_title = False
        self._title_buf = []
        self._in_h1 = False
        self._h1_buf = []
        self._in_jsonld = False
        self._jsonld_buf = []

        # DOM-order event log used to compute "direct answer after H1"
        # and word count without needing a full tree.
        self.events = []  # list of ("h1open"|"h1close"|"p_text"|..., data)
        self._in_p = False
        self._p_buf = []
        self._text_buf = []  # all visible text, for word count
        self._skip_text_tags = {"script", "style"}
        self._skip_depth = 0

    # -- tag handling -----------------------------------------------
    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        if tag in self._skip_text_tags:
            self._skip_depth += 1
        if tag == "title":
            self._in_title = True
            self._title_buf = []
        elif tag == "link" and attrs_d.get("rel") == "canonical":
            self.canonical = attrs_d.get("href")
        elif tag == "meta":
            name = attrs_d.get("name")
            prop = attrs_d.get("property")
            if name == "description":
                self.meta_description = attrs_d.get("content", "")
            if prop and prop.startswith("og:"):
                self.og_tags.add(prop)
        elif tag == "h1":
            self._in_h1 = True
            self._h1_buf = []
            self.events.append(("h1open", None))
        elif tag == "h2":
            self.h2_count += 1
        elif tag == "p":
            self._in_p = True
            self._p_buf = []
        elif tag == "script" and attrs_d.get("type") == "application/ld+json":
            self._in_jsonld = True
            self._jsonld_buf = []
        elif tag == "a":
            href = attrs_d.get("href", "")
            if href and not href.startswith(("http://", "https://", "mailto:", "tel:", "#")):
                self.internal_link_count += 1
            elif href.startswith(SITE_PREFIX):
                self.internal_link_count += 1
        elif tag == "img":
            if "alt" not in attrs_d:
                self.imgs_missing_alt.append(attrs_d.get("src", "(no src)"))
        elif tag == "div" and "faq-item" in (attrs_d.get("class") or "").split():
            self.faq_item_count += 1
        elif tag == "details":
            self.details_count += 1

    def handle_endtag(self, tag):
        if tag in self._skip_text_tags:
            self._skip_depth = max(0, self._skip_depth - 1)
        if tag == "title":
            self._in_title = False
            self.title = "".join(self._title_buf).strip()
        elif tag == "h1":
            self._in_h1 = False
            self.h1s.append("".join(self._h1_buf).strip())
            self.events.append(("h1close", None))
        elif tag == "p":
            self._in_p = False
            text = "".join(self._p_buf).strip()
            self.events.append(("p", text))
        elif tag == "script" and self._in_jsonld:
            self._in_jsonld = False
            raw = "".join(self._jsonld_buf)
            self.jsonld_blocks.append(raw)

    def handle_data(self, data):
        if self._in_jsonld:
            self._jsonld_buf.append(data)
            return
        if self._skip_depth:
            return
        if self._in_title:
            self._title_buf.append(data)
        if self._in_h1:
            self._h1_buf.append(data)
        if self._in_p:
            self._p_buf.append(data)
        self._text_buf.append(data)

    # -- derived facts ------------------------------------------------
    def word_count(self):
        text = " ".join(self._text_buf)
        text = re.sub(r"\s+", " ", text)
        words = [w for w in text.split(" ") if w.strip()]
        return len(words)

    def jsonld_types(self):
        types = []
        for raw in self.jsonld_blocks:
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                types.append("INVALID_JSON")
                continue
            types.extend(_extract_types(data))
        return types

    def faq_pair_count(self):
        # native <details> or the site's .faq-item accordion component
        return self.faq_item_count + self.details_count

    def direct_answer_present(self):
        """
        Heuristic, objective and cheap: is there a non-empty <p> that
        appears before the next heading and before any FAQ/process
        section, immediately following the (first) H1 in document order?
        This does not judge whether the sentence is a *good* answer —
        only whether a lead paragraph exists right after the H1, which
        is the structural precondition the brief's template requires
        ("H1 -> 1-2 factual sentences immediately after the heading").
        """
        seen_h1_close = False
        for kind, data in self.events:
            if kind == "h1close":
                seen_h1_close = True
                continue
            if seen_h1_close and kind == "p":
                return bool(data)
            if seen_h1_close and kind == "h1open":
                break
        return False


def _extract_types(node):
    types = []
    if isinstance(node, dict):
        t = node.get("@type")
        if isinstance(t, str):
            types.append(t)
        elif isinstance(t, list):
            types.extend(t)
        for v in node.values():
            types.extend(_extract_types(v))
    elif isinstance(node, list):
        for item in node:
            types.extend(_extract_types(item))
    return types


def audit_page(rel_path: str) -> dict:
    path = REPO_ROOT / rel_path
    html = path.read_text(encoding="utf-8")
    p = PageParser()
    p.feed(html)

    return {
        "page": rel_path,
        "title": p.title,
        "title_len": len(p.title) if p.title else 0,
        "canonical": p.canonical,
        "meta_description_present": bool(p.meta_description),
        "meta_description_len": len(p.meta_description) if p.meta_description else 0,
        "og_tag_count": len(p.og_tags),
        "h1_count": len(p.h1s),
        "h1_text": p.h1s[0] if p.h1s else None,
        "h2_count": p.h2_count,
        "word_count": p.word_count(),
        "jsonld_types": p.jsonld_types(),
        "faq_pair_count": p.faq_pair_count(),
        "internal_link_count": p.internal_link_count,
        "images_missing_alt": p.imgs_missing_alt,
        "direct_answer_present": p.direct_answer_present(),
    }


def main():
    as_json = "--json" in sys.argv
    results = [audit_page(rel) for rel in PAGES]

    if as_json:
        print(json.dumps(results, indent=2))
        return

    # Compact table to stdout.
    headers = ["page", "h1", "title_len", "desc_len", "canon", "og", "h2",
               "words", "faq", "links", "no_alt", "direct_ans", "jsonld"]
    rows = []
    for r in results:
        rows.append([
            r["page"],
            str(r["h1_count"]),
            str(r["title_len"]),
            str(r["meta_description_len"]),
            "Y" if r["canonical"] else "N",
            str(r["og_tag_count"]),
            str(r["h2_count"]),
            str(r["word_count"]),
            str(r["faq_pair_count"]),
            str(r["internal_link_count"]),
            str(len(r["images_missing_alt"])),
            "Y" if r["direct_answer_present"] else "N",
            ",".join(sorted(set(r["jsonld_types"]))) or "-",
        ])

    widths = [max(len(h), *(len(row[i]) for row in rows)) for i, h in enumerate(headers)]
    def fmt_row(vals):
        return "  ".join(v.ljust(widths[i]) for i, v in enumerate(vals))

    print(fmt_row(headers))
    print(fmt_row(["-" * w for w in widths]))
    for row in rows:
        print(fmt_row(row))

    # Flag anything objectively off, without scoring it.
    print("\nFlags:")
    flagged = False
    for r in results:
        if r["h1_count"] != 1:
            print(f"  - {r['page']}: {r['h1_count']} H1 tags (expected 1)")
            flagged = True
        if not r["canonical"]:
            print(f"  - {r['page']}: missing canonical")
            flagged = True
        if not r["meta_description_present"]:
            print(f"  - {r['page']}: missing meta description")
            flagged = True
        if r["og_tag_count"] < 4:
            print(f"  - {r['page']}: only {r['og_tag_count']} OG tags (expected >=4)")
            flagged = True
        if r["images_missing_alt"]:
            print(f"  - {r['page']}: {len(r['images_missing_alt'])} image(s) missing alt: "
                  f"{', '.join(r['images_missing_alt'][:3])}")
            flagged = True
        if not r["direct_answer_present"]:
            print(f"  - {r['page']}: no paragraph immediately follows the H1")
            flagged = True
        if "INVALID_JSON" in r["jsonld_types"]:
            print(f"  - {r['page']}: invalid JSON-LD block")
            flagged = True
    if not flagged:
        print("  (none)")


if __name__ == "__main__":
    main()
