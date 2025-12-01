const statusDiv = document.getElementById('network-status');
const fetchBtn = document.getElementById('fetch-btn');
const userList = document.getElementById('user-list');
const errorMsg = document.getElementById('error-msg');

// 1. Handle Online/Offline Events
function updateOnlineStatus() {
    if (navigator.onLine) {
        statusDiv.classList.remove('visible');
    } else {
        statusDiv.classList.add('visible');
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Initial check
updateOnlineStatus();

// 2. Data Fetching Logic
fetchBtn.addEventListener('click', async () => {
    errorMsg.textContent = '';
    userList.innerHTML = 'Loading...';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Network response was not ok');

        const users = await response.json();

        userList.innerHTML = users.map(user =>
            `<div class="user-card"><strong>${user.name}</strong> (${user.email})</div>`
        ).join('');
    } catch (error) {
        console.error('Fetch error:', error);
        userList.innerHTML = '';
        errorMsg.textContent = 'Error: Failed to fetch data. Please check your connection.';
    }
});
