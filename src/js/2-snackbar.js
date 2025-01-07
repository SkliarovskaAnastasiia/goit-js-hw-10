import iziToast from 'izitoast';
import iconOk from '../img/svg/ok.svg';
import iconError from '../img/svg/error.svg';

const formEl = document.querySelector('.js-form');

const promise = {
  createPromise: ({ delay, state }) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (state === 'fulfilled') {
          res(delay);
        } else {
          rej(delay);
        }
      }, delay);
    });
  },

  fulfilled: value =>
    iziToast.show({
      iconUrl: iconOk,
      title: 'OK',
      message: ` Fulfilled promise in ${value}ms`,
      position: 'topRight',
      backgroundColor: '#59a10d',
      theme: 'dark',
    }),

  rejected: value =>
    iziToast.show({
      iconUrl: iconError,
      title: 'Error',
      message: ` Rejected promise in ${value}ms`,
      position: 'topRight',
      backgroundColor: '#ef4040',
      theme: 'dark',
    }),
};

const onFormSubmit = event => {
  event.preventDefault();

  const {
    delay: { value: delay },
    state: { value: state },
  } = formEl.elements;

  promise
    .createPromise({ delay, state })
    .then(value => promise.fulfilled(value))
    .catch(value => promise.rejected(value));

  formEl.reset();
};

formEl.addEventListener('submit', onFormSubmit);
