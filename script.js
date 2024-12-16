const videoContainer = document.getElementById('video-container');
const searchInput = document.getElementById('search');
const sortDropdown = document.getElementById('sort');
const filterBrand = document.getElementById('filter-brand');
const filterType = document.getElementById('filter-type');

let videoData = [];

// Fetch and initialize data
fetch('data.txt')
    .then(response => response.text())
    .then(text => {
        videoData = text.trim().split('\n').map(line => {
            const [filename, brand, type, views, igLink] = line.split(',');
            return { filename, brand, type, views: parseInt(views), igLink };
        });
        populateFilters();
        displayVideos(videoData);
    });

// Populate filters dynamically
function populateFilters() {
    const brands = [...new Set(videoData.map(v => v.brand))];
    const types = [...new Set(videoData.map(v => v.type))];

    brands.forEach(brand => {
        filterBrand.innerHTML += `<option value="${brand}">${brand}</option>`;
    });
    types.forEach(type => {
        filterType.innerHTML += `<option value="${type}">${type}</option>`;
    });
}

// Display videos
function displayVideos(videos) {
    videoContainer.innerHTML = '';
    videos.forEach(video => {
        videoContainer.innerHTML += `
            <div class="video-panel">
                <p><strong>${video.brand}</strong></p>
                <p>${video.type}</p>
                <video src="videos/${video.filename}" controls></video>
                <p>Views: ${video.views}</p>
                <a href="${video.igLink}" target="_blank">Link to IG Reel</a>
            </div>
        `;
    });
}

// Event Listeners for sorting, searching, and filtering
sortDropdown.addEventListener('change', () => {
    let sorted = [...videoData];
    const value = sortDropdown.value;
    if (value === 'views-asc') sorted.sort((a, b) => a.views - b.views);
    if (value === 'views-desc') sorted.sort((a, b) => b.views - a.views);
    if (value === 'alphabet-asc') sorted.sort((a, b) => a.brand.localeCompare(b.brand));
    if (value === 'alphabet-desc') sorted.sort((a, b) => b.brand.localeCompare(a.brand));
    displayVideos(sorted);
});

searchInput.addEventListener('input', () => {
    const filtered = videoData.filter(video =>
        video.brand.toLowerCase().includes(searchInput.value.toLowerCase()) ||
        video.type.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    displayVideos(filtered);
});

filterBrand.addEventListener('change', () => {
    filterVideos();
});

filterType.addEventListener('change', () => {
    filterVideos();
});

function filterVideos() {
    let filtered = videoData;
    if (filterBrand.value !== 'all') {
        filtered = filtered.filter(video => video.brand === filterBrand.value);
    }
    if (filterType.value !== 'all') {
        filtered = filtered.filter(video => video.type === filterType.value);
    }
    displayVideos(filtered);
}
