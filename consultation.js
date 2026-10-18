const calendarGrid = document.querySelector('#calendar-grid');
const monthLabel = document.querySelector('#month-label');
const selectedDateLabel = document.querySelector('#selected-date');
const selectedTimeLabel = document.querySelector('#selected-time');
const timeSlots = document.querySelector('#time-slots');
const previousMonth = document.querySelector('#previous-month');
const nextMonth = document.querySelector('#next-month');
const bookingForm = document.querySelector('#booking-form');
const bookingError = document.querySelector('#booking-error');
const bookingSuccess = document.querySelector('#booking-success');
const successCopy = document.querySelector('#success-copy');

const now = new Date();
let visibleMonth = new Date(now.getFullYear(), now.getMonth(), 1);
let chosenDate = null;
let chosenTime = null;
const times = ['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'];

const dateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

function renderCalendar() {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  monthLabel.textContent = visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  calendarGrid.innerHTML = '';
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

  for (let i = 0; i < firstDay; i += 1) {
    const spacer = document.createElement('span');
    spacer.className = 'calendar-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    calendarGrid.appendChild(spacer);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = dateKey(year, month, day);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'calendar-day';
    button.textContent = day;
    button.setAttribute('aria-label', new Date(year, month, day).toLocaleDateString(undefined, { dateStyle: 'full' }));
    if (key < todayKey) button.disabled = true;
    if (key === todayKey) button.classList.add('today');
    if (key === chosenDate) button.classList.add('selected');
    button.addEventListener('click', () => selectDate(key, year, month, day));
    calendarGrid.appendChild(button);
  }
  previousMonth.disabled = visibleMonth <= new Date(now.getFullYear(), now.getMonth(), 1);
}

function selectDate(key, year, month, day) {
  chosenDate = key;
  chosenTime = null;
  selectedDateLabel.textContent = new Date(year, month, day).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  selectedTimeLabel.textContent = 'Choose an available time below';
  renderCalendar();
  renderTimeSlots();
}

function renderTimeSlots() {
  timeSlots.innerHTML = '';
  if (!chosenDate) { timeSlots.innerHTML = '<p class="empty-slots">Pick a date to see available times.</p>'; return; }
  times.forEach((time) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `time-slot${time === chosenTime ? ' selected' : ''}`;
    button.textContent = time;
    button.addEventListener('click', () => {
      chosenTime = time;
      selectedTimeLabel.textContent = `${time} · 30 minutes`;
      renderTimeSlots();
    });
    timeSlots.appendChild(button);
  });
}

previousMonth.addEventListener('click', () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1); renderCalendar(); });
nextMonth.addEventListener('click', () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1); renderCalendar(); });

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  bookingError.textContent = '';
  const name = document.querySelector('#booking-name').value.trim();
  const email = document.querySelector('#booking-email').value.trim();
  if (!chosenDate || !chosenTime) { bookingError.textContent = 'Choose a date and time before requesting an appointment.'; return; }
  if (!name || !email || !email.includes('@')) { bookingError.textContent = 'Add your name and a valid email address so Shyam can reply.'; return; }
  const readableDate = new Date(`${chosenDate}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  successCopy.textContent = `Thanks, ${name}. Your request for ${readableDate} at ${chosenTime} has been saved for confirmation.`;
  bookingForm.hidden = true;
  bookingSuccess.hidden = false;
});

document.querySelector('#timezone-label').textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local time';
renderCalendar();
renderTimeSlots();
