import './css/styles.css';
import Notiflix from 'notiflix';
import API from './fetchCountries.js';
import debounce from 'lodash.debounce';
import counterCardTpl from '../src/templates/counterCard.hbs';
import counterCardAll from '../src/templates/counterCardAll.hbs';
import { trim } from 'lodash';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();
  const input = e.target.value.trim();

  if (!input) return (countryList.innerHTML = ''), (countryInfoRef.innerHTML = '');
  API.fetchCountries(input).then(renderCountryList).catch(onFetchError);
}

function renderCountryList(country) {
  const markUp = counterCardTpl(country);
  const markUpList = counterCardAll(country);
  countryList.innerHTML = markUp;

  if (country.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    countryList.innerHTML = '';
  } else if (country.length === 1) {
    countryInfoRef.innerHTML = markUpList;
  } else if (country.length >= 2 && country.length <= 10) {
    countryInfoRef.innerHTML = '';
  }
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
