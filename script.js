// Place Explorer - Interactive Destination Discovery App

// Sample places database
const placesData = [
    {
        id: 1,
        name: "Santorini",
        country: "Greece",
        category: "beach",
        description: "Famous for its white-washed buildings, blue domes, and stunning sunsets over the Aegean Sea.",
        rating: 4.8,
        explored: 12450,
        imageIcon: "🏝️",
        bestTime: "April to October"
    },
    {
        id: 2,
        name: "Swiss Alps",
        country: "Switzerland",
        category: "mountain",
        description: "Breathtaking mountain range offering world-class skiing, hiking, and picturesque villages.",
        rating: 4.9,
        explored: 9870,
        imageIcon: "⛰️",
        bestTime: "December to March (skiing), June to September (hiking)"
    },
    {
        id: 3,
        name: "Tokyo",
        country: "Japan",
        category: "city",
        description: "Vibrant metropolis blending ultramodern with traditional, from neon-lit skyscrapers to historic temples.",
        rating: 4.7,
        explored: 15680,
        imageIcon: "🗼",
        bestTime: "March to April (cherry blossoms), October to November"
    },
    {
        id: 4,
        name: "Machu Picchu",
        country: "Peru",
        category: "historical",
        description: "Ancient Incan citadel set high in the Andes Mountains, one of the New Seven Wonders.",
        rating: 4.9,
        explored: 8760,
        imageIcon: "🏛️",
        bestTime: "May to September (dry season)"
    },
    {
        id: 5,
        name: "Maldives",
        country: "Maldives",
        category: "beach",
        description: "Tropical paradise of overwater bungalows, crystal clear waters, and vibrant coral reefs.",
        rating: 4.9,
        explored: 11230,
        imageIcon: "🌊",
        bestTime: "November to April"
    },
    {
        id: 6,
        name: "Banff National Park",
        country: "Canada",
        category: "mountain",
        description: "Stunning Canadian Rockies with turquoise lakes, glaciers, and abundant wildlife.",
        rating: 4.8,
        explored: 6540,
        imageIcon: "🏔️",
        bestTime: "June to August, December to March"
    },
    {
        id: 7,
        name: "New York City",
        country: "USA",
        category: "city",
        description: "The city that never sleeps, with iconic landmarks like Times Square, Central Park, and Broadway.",
        rating: 4.6,
        explored: 18920,
        imageIcon: "🗽",
        bestTime: "April to June, September to November"
    },
    {
        id: 8,
        name: "Great Wall of China",
        country: "China",
        category: "historical",
        description: "Ancient series of fortifications stretching thousands of miles across northern China.",
        rating: 4.7,
        explored: 14300,
        imageIcon: "🧱",
        bestTime: "May to October"
    },
    {
        id: 9,
        name: "Bora Bora",
        country: "French Polynesia",
        category: "beach",
        description: "Luxury island destination with crystal-clear lagoon and overwater villas.",
        rating: 4.9,
        explored: 5430,
        imageIcon: "🐠",
        bestTime: "May to October"
    },
    {
        id: 10,
        name: "Kyoto",
        country: "Japan",
        category: "historical",
        description: "Cultural heart of Japan with thousands of temples, shrines, and traditional gardens.",
        rating: 4.8,
        explored: 11200,
        imageIcon: "⛩️",
        bestTime: "March to April, October to November"
    },
    {
        id: 11,
        name: "Paris",
        country: "France",
        category: "city",
        description: "Romantic city of lights with iconic Eiffel Tower, Louvre Museum, and charming cafes.",
        rating: 4.7,
        explored: 16780,
        imageIcon: "🗼",
        bestTime: "April to June, September to October"
    },
    {
        id: 12,
        name: "Himalayas",
        country: "Nepal/Tibet",
        category: "mountain",
        description: "World's highest mountain range, home to Mount Everest and incredible trekking routes.",
        rating: 4.9,
        explored: 4320,
        imageIcon: "🏔️",
        bestTime: "March to May, September to November"
    }
];

// Global variables
let currentPlaces = [...placesData];
let currentCategory = "all";
let currentSearchTerm = "";

// DOM elements
const placesGrid = document.getElementById("placesGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const modal = document.getElementById("placeModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.querySelector(".close-modal");
const totalPlacesSpan = document.getElementById("totalPlaces");
const exploredCountSpan = document.getElementById("exploredCount");
const avgRatingSpan = document.getElementById("avgRating");

// Navigation links
const navLinks = document.querySelectorAll(".nav-link");

// Initialize the app
function init() {
    displayPlaces();
    updateStats();
    attachEventListeners();
}

// Attach all event listeners
function attachEventListeners() {
    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch();
    });
    
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
    
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            currentCategory = category;
            
            // Update active class
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            
            // Reset search input
            searchInput.value = "";
            currentSearchTerm = "";
            
            applyFilters();
        });
    });
}

// Handle search
function handleSearch() {
    currentSearchTerm = searchInput.value.trim().toLowerCase();
    applyFilters();
}

// Apply both category and search filters
function applyFilters() {
    let filtered = [...placesData];
    
    // Apply category filter
    if (currentCategory !== "all") {
        filtered = filtered.filter(place => place.category === currentCategory);
    }
    
    // Apply search filter
    if (currentSearchTerm) {
        filtered = filtered.filter(place => 
            place.name.toLowerCase().includes(currentSearchTerm) ||
            place.country.toLowerCase().includes(currentSearchTerm) ||
            place.description.toLowerCase().includes(currentSearchTerm)
        );
    }
    
    currentPlaces = filtered;
    displayPlaces();
    updateStats();
}

// Display places in grid
function displayPlaces() {
    if (!placesGrid) return;
    
    if (currentPlaces.length === 0) {
        placesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No places found</h3>
                <p>Try a different search or category</p>
            </div>
        `;
        return;
    }
    
    placesGrid.innerHTML = currentPlaces.map(place => `
        <div class="place-card" data-id="${place.id}">
            <div class="place-image">
                ${place.imageIcon}
            </div>
            <div class="place-info">
                <div class="place-name">${place.name}</div>
                <div class="place-location">
                    📍 ${place.country}
                </div>
                <div class="place-description">
                    ${place.description.substring(0, 100)}${place.description.length > 100 ? '...' : ''}
                </div>
                <div class="place-details">
                    <div class="place-rating">
                        ⭐ ${place.rating} (${formatNumber(place.explored)})
                    </div>
                    <button class="explore-btn" data-id="${place.id}">Explore</button>
                </div>
            </div>
        </div>
    `).join("");
    
    // Add click events to cards and explore buttons
    document.querySelectorAll(".place-card").forEach(card => {
        const id = parseInt(card.dataset.id);
        card.addEventListener("click", (e) => {
            // Don't open modal if clicking on the explore button
            if (!e.target.classList.contains("explore-btn")) {
                showPlaceDetails(id);
            }
        });
        
        const exploreBtn = card.querySelector(".explore-btn");
        if (exploreBtn) {
            exploreBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                showPlaceDetails(id);
            });
        }
    });
}

// Show place details in modal
function showPlaceDetails(placeId) {
    const place = placesData.find(p => p.id === placeId);
    if (!place) return;
    
    modalBody.innerHTML = `
        <div class="modal-image">
            ${place.imageIcon}
        </div>
        <div class="modal-info">
            <h2 class="modal-title">${place.name}</h2>
            <div class="modal-location">📍 ${place.country}</div>
            <div class="modal-description">${place.description}</div>
            <div class="modal-stats">
                <div class="modal-stat">
                    <div class="modal-stat-value">⭐ ${place.rating}</div>
                    <div class="modal-stat-label">Rating</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${formatNumber(place.explored)}</div>
                    <div class="modal-stat-label">Explored by</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${place.bestTime}</div>
                    <div class="modal-stat-label">Best Time</div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = "block";
}

// Update statistics
function updateStats() {
    totalPlacesSpan.textContent = currentPlaces.length;
    
    const totalExplored = currentPlaces.reduce((sum, place) => sum + place.explored, 0);
    exploredCountSpan.textContent = formatNumber(totalExplored);
    
    const avgRating = currentPlaces.length > 0 
        ? (currentPlaces.reduce((sum, place) => sum + place.rating, 0) / currentPlaces.length).toFixed(1)
        : 0;
    avgRatingSpan.textContent = avgRating;
}

// Format number with commas
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
}

// Start the app
init();