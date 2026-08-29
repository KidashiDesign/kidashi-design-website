/* ============================================================
   CONTACT PAGE — Appointment scheduling calendar
   Vanilla JS, no dependencies. Opens a date/time picker and
   writes the selection into hidden fields on the contact form.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const trigger = document.getElementById('schedule-trigger');
  const modal = document.getElementById('schedule-modal');
  if (!trigger || !modal) return;

  const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MONTH_NAMES_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const WEEKDAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const WEEKDAYS_DE = ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'];

  function isDe() {
    return document.documentElement.getAttribute('data-lang') === 'de';
  }
  function MONTH_NAMES() { return isDe() ? MONTH_NAMES_DE : MONTH_NAMES_EN; }
  function WEEKDAYS() { return isDe() ? WEEKDAYS_DE : WEEKDAYS_EN; }

  const triggerText = document.getElementById('schedule-trigger-text');
  const monthBtn = document.getElementById('schedule-month-year');
  const monthLabel = document.getElementById('schedule-month-label');
  const prevBtn = document.getElementById('schedule-prev');
  const nextBtn = document.getElementById('schedule-next');
  const closeBtn = document.getElementById('schedule-close');
  const backdrop = modal.querySelector('.schedule-modal__backdrop');
  const weekdaysEl = document.getElementById('schedule-weekdays');
  const daysEl = document.getElementById('schedule-days');
  const picker = document.getElementById('schedule-picker');
  const yearLabel = document.getElementById('schedule-year-label');
  const yearPrev = document.getElementById('schedule-year-prev');
  const yearNext = document.getElementById('schedule-year-next');
  const monthsEl = document.getElementById('schedule-months');
  const hourInput = document.getElementById('schedule-hour');
  const minuteInput = document.getElementById('schedule-minute');
  const ampmBtns = modal.querySelectorAll('.schedule-modal__ampm button');
  const confirmBtn = document.getElementById('schedule-confirm');
  const dateField = document.getElementById('appointment_date');
  const timeField = document.getElementById('appointment_time');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDay = null;
  let hour = 10;
  let minute = 0;
  let ampm = 'AM';
  let lastFocused = null;

  function renderWeekdays() {
    weekdaysEl.innerHTML = WEEKDAYS().map(function (d) { return '<span>' + d + '</span>'; }).join('');
  }
  renderWeekdays();
  document.addEventListener('kd:langchange', function () {
    renderWeekdays();
    renderDays();
    if (!picker.hidden) renderMonths();
    if (selectedDay && trigger.classList.contains('has-value')) {
      const dateObj = new Date(selectedDay.y, selectedDay.m, selectedDay.d);
      const weekday = WEEKDAYS()[dateObj.getDay()];
      const timeStr = pad(hour || 12) + ':' + pad(minute) + ' ' + ampm;
      triggerText.textContent = weekday + ', ' + MONTH_NAMES()[selectedDay.m].slice(0, 3) + ' ' + selectedDay.d + ', ' + selectedDay.y + ' · ' + timeStr;
    }
  });

  function pad(n) { return String(n).padStart(2, '0'); }

  function isPast(y, m, d) {
    const date = new Date(y, m, d);
    return date < today;
  }

  function renderDays() {
    monthLabel.textContent = MONTH_NAMES()[viewMonth] + ' ' + viewYear;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    let html = '';
    for (let i = 0; i < firstDay; i++) {
      html += '<span></span>';
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isPast(viewYear, viewMonth, day);
      const isSelected = selectedDay && selectedDay.y === viewYear && selectedDay.m === viewMonth && selectedDay.d === day;
      html += '<button type="button" class="schedule-modal__day' + (isSelected ? ' is-selected' : '') + '" data-day="' + day + '"' + (disabled ? ' disabled' : '') + '>' + day + '</button>';
    }
    daysEl.innerHTML = html;
  }

  function renderMonths() {
    yearLabel.textContent = viewYear;
    let html = '';
    MONTH_NAMES().forEach(function (m, idx) {
      const isSelected = idx === viewMonth;
      html += '<button type="button" data-month="' + idx + '" class="' + (isSelected ? 'is-selected' : '') + '">' + m.slice(0, 3) + '</button>';
    });
    monthsEl.innerHTML = html;
  }

  function updateConfirmState() {
    confirmBtn.disabled = !selectedDay;
  }

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    renderDays();
    updateConfirmState();
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    picker.hidden = true;
    monthBtn.setAttribute('aria-expanded', 'false');
    if (lastFocused) lastFocused.focus();
  }

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  monthBtn.addEventListener('click', function () {
    const willShow = picker.hidden;
    picker.hidden = !willShow;
    monthBtn.setAttribute('aria-expanded', String(willShow));
    if (willShow) renderMonths();
  });

  prevBtn.addEventListener('click', function () {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    renderDays();
  });
  nextBtn.addEventListener('click', function () {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    renderDays();
  });

  yearPrev.addEventListener('click', function () { viewYear -= 1; renderMonths(); });
  yearNext.addEventListener('click', function () { viewYear += 1; renderMonths(); });

  monthsEl.addEventListener('click', function (e) {
    const btn = e.target.closest('button[data-month]');
    if (!btn) return;
    viewMonth = parseInt(btn.dataset.month, 10);
    picker.hidden = true;
    monthBtn.setAttribute('aria-expanded', 'false');
    renderDays();
  });

  daysEl.addEventListener('click', function (e) {
    const btn = e.target.closest('button[data-day]');
    if (!btn || btn.disabled) return;
    selectedDay = { y: viewYear, m: viewMonth, d: parseInt(btn.dataset.day, 10) };
    renderDays();
    updateConfirmState();
  });

  hourInput.addEventListener('input', function () {
    let val = hourInput.value.replace(/\D/g, '').slice(0, 2);
    if (val && parseInt(val, 10) > 12) val = '12';
    hourInput.value = val;
    hour = val ? parseInt(val, 10) : 0;
  });
  hourInput.addEventListener('blur', function () {
    hourInput.value = pad(hour || 12);
  });

  minuteInput.addEventListener('input', function () {
    let val = minuteInput.value.replace(/\D/g, '').slice(0, 2);
    if (val && parseInt(val, 10) > 59) val = '59';
    minuteInput.value = val;
    minute = val ? parseInt(val, 10) : 0;
  });
  minuteInput.addEventListener('blur', function () {
    minuteInput.value = pad(minute);
  });

  ampmBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      ampm = btn.dataset.ampm;
      ampmBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
    });
  });

  confirmBtn.addEventListener('click', function () {
    if (!selectedDay) return;
    const dateObj = new Date(selectedDay.y, selectedDay.m, selectedDay.d);
    const isoDate = selectedDay.y + '-' + pad(selectedDay.m + 1) + '-' + pad(selectedDay.d);
    const timeStr = pad(hour || 12) + ':' + pad(minute) + ' ' + ampm;

    if (dateField) dateField.value = isoDate;
    if (timeField) timeField.value = timeStr;

    const weekday = WEEKDAYS()[dateObj.getDay()];
    triggerText.textContent = weekday + ', ' + MONTH_NAMES()[selectedDay.m].slice(0, 3) + ' ' + selectedDay.d + ', ' + selectedDay.y + ' · ' + timeStr;
    trigger.classList.add('has-value');

    closeModal();
  });
});
