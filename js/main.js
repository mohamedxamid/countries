const elThemeToggler = document.querySelector('.js-theme-toggler'),
elCountriesList = document.querySelector('.index-countries-list'),
elSelectRegion = document.querySelector('select.filters-region-select'),
elSearchInput = document.querySelector('input.filters-search-input'),
elCountryPageInfo = document.querySelector('.country-page-flag-info'),
elFormFilters = document.querySelector('form.filters');

let countriesList = [];
let countryInfo = localStorage.getItem("countryName") || "";


if (elCountriesList) {
    fetch('https://restcountries.com/v3.1/all?fields=flags,name,population,region,subregion,capital,tld,currencies,languages,borders')
    .then(res => res.json())
    .then(countries => {
        countriesList = countries
        const renderedItems = countries.map((item) => {
            return renderCountry(item)
        })
        elCountriesList.replaceChildren(...renderedItems)
        return countries
    })
}


if (elCountryPageInfo) {
    fetch(`https://restcountries.com/v3.1/name/${countryInfo}`)
    .then(res => res.json())
    .then(data => {        
        elCountryPageInfo.innerHTML = renderCountryInfo(data[0])
        elCountryPageInfo.addEventListener('click', (evt) => {
            if (evt.target && evt.target.matches('a.country-page-border-countries-link')) {
                evt.preventDefault()
                fetch(`https://restcountries.com/v3.1/alpha/${evt.target.textContent.trim()}`)
                .then(res => res.json())
                .then(data => {
                    elCountryPageInfo.innerHTML = renderCountryInfo(data[0])
                })
            }
        })
    })
}



if (elSearchInput) {
    elSearchInput.addEventListener('input', (evt) => {
        const filteredData = countriesList.filter(({name}) => {
            if(!((name.common.toLowerCase().indexOf(evt.target.value.toLowerCase())) < 0)) {
                return true
            }
        })
        const renderedItems = filteredData.map((item) => {
            return renderCountry(item)
        })
        elCountriesList.replaceChildren(...renderedItems)
    })
}



if (elSelectRegion) {
    elSelectRegion.addEventListener('change', (evt) => {
        elSearchInput.value = '';
        if (evt.target.value === "allRegions") {
            fetch('https://restcountries.com/v3.1/all?fields=flags,name,population,region,subregion,capital,tld,currencies,languages,borders')
            .then(res => res.json())
            .then(countries => {
                countriesList = countries;
                const renderedItems = countries.map((item) => {
                    return renderCountry(item)
                })
                elCountriesList.replaceChildren(...renderedItems)
            })
        } else {
            fetch(`https://restcountries.com/v3.1/region/${evt.target.value}`)
            .then(res => res.json())
            .then(countries => {
                countriesList = countries;
                const renderedItems = countries.map((item) => {
                    return renderCountry(item)
                })
                elCountriesList.replaceChildren(...renderedItems)
            })
        }
    })
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    elThemeToggler.textContent = "Light Mode";
}

if (elThemeToggler) {
    elThemeToggler.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            elThemeToggler.textContent = "Light Mode";
        } else {
            localStorage.setItem("theme", "light");
            elThemeToggler.textContent = "Dark Mode";
        }
    });
}


if (elFormFilters) {
    elFormFilters.addEventListener('submit', (evt) => {
        evt.preventDefault()
    })
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function renderCountryInfo({flags, name, population, region, subregion, capital, tld, currencies, languages, borders}) {
    const arrLanguages = Object.values(languages)
    const languagesText = arrLanguages.reduce((item, nextItem) => {
        let text = '';
        text += `${item}, ${nextItem}`;
        return text;
    })
    
    function renderBorders(arr) {
        let text = ''
        arr.forEach(border => {
            text += `
            <a class="country-page-border-countries-link" href="country.html">
            ${border}
            </a>
            `
        })
        return text
    }
    
    let text = `
    <img class="country-page-flag" src="${flags.png}" alt="${flags.alt}" width="560" height="400">
    <div class="country-page-info">
    <h1 class="country-page-title">${name.common}</h1>
    
    <div class="country-page-dls-wrapper">
    <dl class="country-page-details">
    <div class="country-page-details-item">
    <dt class="country-page-details-title">Native Name:</dt>
    <dd class="country-page-details-value">${name.nativeName[`${(Object.keys(name.nativeName))[0]}`].common}</dd>
    </div>
    <div class="country-page-details-item">
    <dt class="country-page-details-title">Population:</dt>
    <dd class="country-page-details-value">${numberWithCommas(population)}</dd>
    </div>
    <div class="country-page-details-item">
    <dt class="country-page-details-title">Region:</dt>
    <dd class="country-page-details-value">${region}</dd>
    </div>
    <div class="country-page-details-item">
    <dt class="country-page-details-title">Sub Region:</dt>
    <dd class="country-page-details-value">${subregion}</dd>
    </div>
    <div class="country-page-details-item">
    <dt class="country-page-details-title">Capital:</dt>
    <dd class="country-page-details-value">${capital}</dd>
    </div>
    </dl>
    
    <dl class="country-page-details-details">
    <div class="country-page-details-item">
    <dt class="country-page-details-title">Top Level Domain:</dt>
    <dd class="country-page-details-value">
    ${tld.reduce((item, nextItem) => {
        let text = '';
        text += `${item}, ${nextItem}`
        return text
    })}
    </dd>
    </div>
    <div class="country-page-details-item">
    <dt class="country-page-details-title">Currencies:</dt>
    <dd class="country-page-details-value">${currencies[Object.keys(currencies)[0]].name}</dd>
    </div>
    <div class="country-page-details-item">
    <dt class="country-page-details-title">Languages:</dt>
    <dd class="country-page-details-value">${languagesText}</dd>
    </div>
    </dl>
    </div>
    
    <section class="country-page-border-countries">
    <h2 class="country-page-border-countries-heading">Boder Countries:</h2>
    <div class="country-page-border-countries-list">
    ${borders ? renderBorders(borders) : "None border countries"}
    </div>
    </section>
    
    </div>
    `
    return text;
}


function renderCountry({flags, name, population, region, capital}) {
    const elLi = document.createElement('li');
    elLi.classList.add('index-countries-item', 'index-country')
    elLi.innerHTML =  `
    <img class="index-country-flag" src="${flags.png}" alt="${flags.alt}" width="264" height="160">
    <div class="index-country-info">
    <h3 class="index-country-name">
    <a class="index-country-link" href="country.html">
    ${name.common}
    </a>
    </h3>
    <dl class="index-country-details">
    <div class="index-country-details-item">
    <dt class="index-country-details-title">Population:</dt>
    <dd class="index-country-details-value">${numberWithCommas(population)}</dd>
    </div>
    <div class="index-country-details-item">
    <dt class="index-country-details-title">Region:</dt>
    <dd class="index-country-details-value">${region}</dd>
    </div>
    <div class="index-country-details-item">
    <dt class="index-country-details-title">Capital:</dt>
    <dd class="index-country-details-value">${capital}</dd>
    </div>
    </dl>
    </div>
    `
    
    elLi.addEventListener('click', (evt) => {
        if (evt.target && evt.target.matches('.index-country-link')) {
            localStorage.setItem("countryName", name.common)
        }
    })
    
    return elLi;
}