import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import iconError from '../img/svg/error.svg';

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
      iziToast.show({
        iconUrl: iconError,
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#ef4040',
        theme: 'dark',
        timeout: 7000,
      });
    } else {
      startBtnEl.removeAttribute('disabled');

      userSelectedDate = selectedDates[0];
    }
  },
};

flatpickr('#datetime-picker', options);

const convertMs = ms => {
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
};

const addLeadingZero = value => String(value).padStart(2, '0');

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
  document.querySelector('#datetime-picker').setAttribute('disabled', 'true');
  startBtnEl.setAttribute('disabled', 'true');

  const intervalId = setInterval(() => {
    const timeDifference = userSelectedDate - Date.now();

    if (timeDifference <= 0) {
      clearInterval(intervalId);

      inputEl.removeAttribute('disabled');

      return;
    }

    const timeElements = convertMs(timeDifference);
    updateTimeIhfo(timeElements);
  }, 1000);
};

startBtnEl.addEventListener('click', onBtnClick);
