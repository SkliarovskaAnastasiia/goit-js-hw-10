import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

const inputEl = document.querySelector('#datetime-picker');
const startBtnEl = document.querySelector('button[data-start]');
startBtnEl.setAttribute('disabled', 'true');

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < Date.now()) {
      startBtnEl.setAttribute('disabled', 'true');
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topCenter',
        timeout: 7000,
      });
    } else {
      startBtnEl.removeAttribute('disabled');

      userSelectedDate = selectedDates[0];
    }
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  if (String(value).length === 1) {
    return String(value).padStart(2, '0');
  }
  return value;
}

const daysEl = document.querySelector('span[data-days]');
const hoursEl = document.querySelector('span[data-hours]');
const minutesEl = document.querySelector('span[data-minutes]');
const secondsEl = document.querySelector('span[data-seconds]');

const updateTimeIhfo = ({ days, hours, minutes, seconds }) => {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
};

const onBtnClick = () => {
  inputEl.setAttribute('disabled', 'true');
  startBtnEl.setAttribute('disabled', 'true');

  const intervalId = setInterval(() => {
    const timeDifference = userSelectedDate - Date.now();

    if (timeDifference <= 0) {
      clearInterval(intervalId);

      inputEl.removeAttribute('disabled');

      return;
    }

    const timeObj = convertMs(timeDifference);
    updateTimeIhfo(timeObj);
  }, 1000);
};

startBtnEl.addEventListener('click', onBtnClick);
