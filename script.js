const container = document.getElementById('places-container');
const searchInput = document.getElementById('search');
const filter = document.getElementById('filter');

let allPlaces = [];

/* LOAD DEFAULT JSON */
fetch('places.json')
.then(res => res.json())
.then(data => {
    allPlaces = data;
    displayPlaces(data);
});

/* DISPLAY FUNCTION */
function displayPlaces(data) {
    container.innerHTML = '';

    data.forEach(place => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <img src="${place.image}">
            <h2>${place.name}</h2>
            <p>${place.description}</p>
            <p><b>Special:</b> ${place.special}</p>
            <p><b>Category:</b> ${place.category || 'Global'}</p>
        `;

        container.appendChild(card);
    });
}

/* SEARCH USING WIKIPEDIA API */
async function searchPlace() {
    const query = searchInput.value;
    if (!query) return;

    container.innerHTML = "<p>Loading...</p>";

    try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`);
        const data = await res.json();

        if (data.title && data.extract) {
            displayPlaces([{
                name: data.title,
                description: data.extract,
                special: "Live data from Wikipedia",
                category: "Global",
                image: data.thumbnail ? data.thumbnail.source : "https://via.placeholder.com/300"
            }]);
        } else {
            container.innerHTML = "<p>No results found</p>";
        }

    } catch {
        container.innerHTML = "<p>Error fetching data</p>";
    }
}

/* BUTTON SEARCH */
document.getElementById('searchBtn').addEventListener('click', searchPlace);

/* ENTER KEY SEARCH */
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPlace();
    }
});

/* FILTER */
filter.addEventListener('change', function() {
    if (this.value === "all") {
        displayPlaces(allPlaces);
    } else {
        const filtered = allPlaces.filter(p => p.category === this.value);
        displayPlaces(filtered);
    }
});

/* DARK MODE */
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
});