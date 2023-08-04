
// Initial Setup

'use strict';
const parser = new DOMParser();

// Elements

const getWeatherButton = document.getElementById('getWeather');
const weatherContainer = document.getElementById('weatherContainer');

// Element Builders

const createWeatherAlertCard = (alertData) => {
    const alertCard = `
        <div class="alertCard">
            <h3 class="alertTitle">${alertData.properties.event}</h3>
            <p class="alertArea">${alertData.properties.areaDesc}</p>
            <p class="alertDescription">${alertData.properties.description}</p>
            <p class="alertInstruction">${alertData.properties.instruction}</p>
        </div>`;

    return parser.parseFromString(alertCard, 'text/html').body.firstChild;
};

const createErrorCard = (errorMessage) => {
    const errorCard = `
        <div id="errorCard">
            <p id="errorDescription">${errorMessage}</p>
        </div>`

    return parser.parseFromString(errorCard, 'text/html').body.firstChild;
};

// Event Handlers

const handleGetWeatherClick = async () => {
    const response = await fetch('https://api.weather.gov/alerts/active?area=FL');

    if (response.ok) {
        getWeatherButton.disabled = true;
        getWeatherButton.remove();

        const data = await response.json();

        // The response data's features property is an array of objects that
        // contain the weather alert data. We iterate over that to create the
        // alert cards from each.
        const alertCards = data.features.map(createWeatherAlertCard);
        weatherContainer.append(...alertCards);
    } else {
        if (document.getElementById('errorCard')) {
            document.getElementById('errorCard').remove();
        }

        const errorMessage = `An error has occured: ${response.status}`;
        const errorCard = createErrorCard(errorMessage);

        weatherContainer.appendChild(errorCard);
    }
};

// Event Listeners

getWeatherButton.addEventListener('click', handleGetWeatherClick);
