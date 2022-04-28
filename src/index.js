import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import { makeInfo, markupListCountries } from './js/markupCountries';
import { refs } from './js/refs';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const emptyField = () => {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
};

const moreThenTen = () => {
  emptyField();
  Notify.info('Too many matches found. Please enter a more specific name.');
};

const onError = () => {
  emptyField();
  Notify.failure('Oops, there is no country with that name');
};

const lessThenTen = country => {
  emptyField();
  markupListCountries(country);
};

const oneCountry = country => {
  emptyField();
  makeInfo(country[0]);
};

const afterFeatch = res => {
  if (res.length > 10) {
    moreThenTen();
  } else if (res.length > 1 && res.length < 11) {
    lessThenTen(res);
  } else if (res.length === 1) {
    oneCountry(res);
  }
};

const onInput = e => {
  const query = e.target.value.trim();

  if (!query) {
    emptyField();
  } else {
    fetchCountries(query)
      .then(afterFeatch)
      .catch(onError);
  }
};

refs.searcBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
