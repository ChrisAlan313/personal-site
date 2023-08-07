/**
 * Initial Setup
 */

'use strict';
const parser = new DOMParser();

/**
 * Elements
 */

const elements = {
    getWeatherButton: document.getElementById('getWeather'),
    weatherCardContainer: document.getElementById('weatherCardContainer'),
};

/**
 * Element Builders
 */

const createWeatherAlertCard = (alertData, index) => {
    const alertCard = `
        <div id="alertCard-${index}" class="alertCard">
            <h3 class="alertTitle">${alertData.properties.event}</h3>
            <p class="alertArea">${alertData.properties.areaDesc}</p>
            <button type="button" id="expandDetailsButton-${index}">Expand details</button>
            <div class="alertDetails" hidden>
                <p class="alertDescription">${alertData.properties.description}</p>
                <p class="alertInstruction">${alertData.properties.instruction}</p>
            </div>
        </div>`;

    return parser.parseFromString(alertCard, 'text/html').body.firstChild;
};

const createErrorCard = (errorMessage) => {
    const errorCard = `
        <div id="errorCard">
            <p id="errorDescription">${errorMessage}</p>
        </div>`;

    return parser.parseFromString(errorCard, 'text/html').body.firstChild;
};

/**
 * Event Handlers
 */

const handleExpandDetailsClick = (event) => {
    const currentBook = event.target.nextElementSibling.hidden;
    event.target.nextElementSibling.hidden = !currentBook;
};

const handleGetWeatherClick = async () => {
    const response = await fetch(
        'https://api.weather.gov/alerts/active?area=FL'
    );

    if (response.ok) {
        elements.getWeatherButton.disabled = true;
        elements.getWeatherButton.remove();

        const data = await response.json();

        // The response data's features property is an array of objects that
        // contain the weather alert data. We iterate over that to create the
        // alert cards from each.
        const alertCards = data.features.map(createWeatherAlertCard);
        alertCards.map((alertCard, index) => {
            elements.weatherCardContainer.append(alertCard);
            document
                .getElementById(`expandDetailsButton-${index}`)
                .addEventListener('click', handleExpandDetailsClick);
        });
    } else {
        if (document.getElementById('errorCard')) {
            document.getElementById('errorCard').remove();
        }

        const errorMessage = `An error has occured: ${response.status}`;
        const errorCard = createErrorCard(errorMessage);

        elements.weatherCardContainer.appendChild(errorCard);
    }
};

/**
 * Event Listeners
 */

elements.getWeatherButton.addEventListener('click', handleGetWeatherClick);
