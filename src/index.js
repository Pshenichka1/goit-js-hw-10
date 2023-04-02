import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import {fetchCountries} from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
let inputSearchCountry = "";

input.addEventListener('input', debounce(handleSearchCountry, DEBOUNCE_DELAY));

function handleSearchCountry(event) {
    event.preventDefault();
    inputSearchCountry = input.value.trim();
    if (inputSearchCountry === "") {
        clearAll();
        return;
    } else {
        fetchCountries(inputSearchCountry).then(countryNames => {
            if (countryNames.length < 2) {
                makeCardCountry(countryNames);
                
            } else if (countryNames.length >= 2 && countryNames.length < 10) {
                makeListCountry(countryNames);
            } else {
                clearAll();
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    }
        }).catch(() => {
            clearAll();
            Notiflix.Notify.failure('Oops, there is no country with that name');
        })
    }
}

function makeListCountry(country) {
    clearAll();
    const nameCountry = country[0];
    const inputList = country.map((nameCountry) => 
        `<li class = "country_item">
        <img class="flags_item" src="${nameCountry.flags.svg}" alt="" width = "40" height = "30">
        <h3 class = "country_item_name">${nameCountry.name.official}</h3>
        </li>`
    ).join('');
    countryList.insertAdjacentHTML('beforeend', inputList);
};

function makeCardCountry(country) {
    clearAll();
    const nameCountry = country[0];
    const cardCountry = `
    <div class card_country>
        <img class="flags_item" src="${nameCountry.flags.svg}" alt="" width = "40" height = "30">
        <h2 class = "country_card_name">${nameCountry.name.official}</h2>
        <p class= "field_card_country>Capital: ${nameCountry.capital}</p>
        <p class= "field_card_country>Population: ${nameCountry.population}</p>
        <p class= "field_card_country>Languages: ${Object.values(nameCountry.languages).join(',')}</p>
    </div>`
    countryInfo.innerHTML = cardCountry
}

function clearAll() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}