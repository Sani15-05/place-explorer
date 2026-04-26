const container = document.getElementById('places-container');
const searchInput = document.getElementById('search');
const loader = document.getElementById('loader');
const favoritesDiv = document.getElementById('favorites');

let favorites = [];

/* MAP INIT */
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

/* DISPLAY */
function displayPlace(place) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
        <img src="${place.image}">
        <h3>${place.name}</h3>
        <p>${place.description}</p>
        <button onclick='addFavorite(${JSON.stringify(place)})'>❤️</button>
    `;

    container.appendChild(card);

    /* MAP MARKER */
    if(place.lat && place.lng){
        L.marker([place.lat, place.lng]).addTo(map)
        .bindPopup(place.name);
    }
}

/* SEARCH API */
async function searchPlace() {
    loader.style.display = "block";
    container.innerHTML = "";

    const query = searchInput.value;

    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`);
    const data = await res.json();

    loader.style.display = "none";

    displayPlace({
        name: data.title,
        description: data.extract,
        image: data.thumbnail ? data.thumbnail.source : "https://via.placeholder.com/300"
    });
}

/* FAVORITES */
function addFavorite(place) {
    favorites.push(place);
    renderFavorites();
}

function renderFavorites() {
    favoritesDiv.innerHTML = "";
    favorites.forEach(p => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<h3>${p.name}</h3>`;
        favoritesDiv.appendChild(div);
    });
}

/* EVENTS */
document.getElementById('searchBtn').onclick = searchPlace;

searchInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') searchPlace();
});

/* DARK MODE */
document.getElementById('themeToggle').onclick = () => {
    document.body.classList.toggle('dark');
};