// Extract listing details from the HTML map element's data attributes
const mapElement = document.getElementById('map');
const listing = {
    title: mapElement.dataset.title,
    location: mapElement.dataset.location,
    country: mapElement.dataset.country
};

// Initialize Leaflet map with default global coordinates
const map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Check if listing object exists and geocode the address
if (listing && (listing.location || listing.country)) {
    const query = `${listing.location}, ${listing.country}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                // Set map view to the geocoded coordinates
                map.setView([lat, lon], 12);

                // Custom FontAwesome location pin icon
                const customIcon = L.divIcon({
                    html: '<i class="fa-solid fa-location-dot fa-3x"></i>',
                    iconSize: [30, 42],
                    iconAnchor: [15, 42],
                    popupAnchor: [0, -40],
                    className: 'custom-leaflet-icon'
                });

                // Add marker to the map
                const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);

                // Bind a modern popup style
                const popupContent = `
                    <h5>${listing.title}</h5>
                    <p>${listing.location}, ${listing.country}</p>
                    <small><i class="fa-solid fa-circle-info me-1"></i>Exact location provided after booking</small>
                `;

                marker.bindPopup(popupContent).openPopup();
            } else {
                console.warn("Geocoding returned no results for location: ", query);
            }
        })
        .catch(error => {
            console.error("Error fetching geocoding data from Nominatim: ", error);
        });
}