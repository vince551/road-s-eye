let isLoginMode = false;
window.currentUser = null;

// --- AUTHENTICATION LOGIC ---
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const toggle = document.querySelector('.toggle-text');
    const nameField = document.getElementById('reg-name');
    const catField = document.getElementById('reg-category');
    
    if (isLoginMode) {
        title.innerText = "THE ROAD’S EYE: LOGIN";
        toggle.innerHTML = "New driver? <span class='neon-text'>Register</span>";
        nameField.style.display = 'none';
        catField.style.display = 'none';
    } else {
        title.innerText = "THE ROAD’S EYE: JOIN";
        toggle.innerHTML = "Already a member? <span class='neon-text'>Login</span>";
        nameField.style.display = 'block';
        catField.style.display = 'block';
    }
}

function handleAuth() {
    const name = document.getElementById('reg-name').value;
    const nationalID = document.getElementById('reg-id').value;
    const category = document.getElementById('reg-category').value;

    if (!nationalID) {
        alert("National ID is required for authentication.");
        return;
    }

    // Set Global User Data
    window.currentUser = {
        name: name || "Vince",
        id: nationalID,
        category: category || "B"
    };

    // Update UI Elements
    document.querySelector('.user-name').innerText = window.currentUser.name;
    document.querySelector('.user-cat').innerText = `Category ${window.currentUser.category}`;

    // Hide Login Overlay & Remove Blur
    document.getElementById('auth-overlay').style.display = 'none';
    const wrapper = document.querySelector('.app-wrapper');
    wrapper.classList.remove('locked'); // Essential fix
    wrapper.style.filter = 'none';
    wrapper.style.pointerEvents = 'auto';
}

// --- REPORTING LOGIC ---
function toggleReport() {
    const modal = document.getElementById('report-modal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

function submitReport() {
    const plate = document.getElementById('plate-num').value;
    const type = document.getElementById('violation-type').value;

    if(plate === "") {
        alert("Please enter a vehicle number plate.");
        return;
    }

    alert(`Incident Logged: ${type} for Vehicle ${plate}`);
    toggleReport();
}

// --- ANIMATION ---
let carPos = 10;
setInterval(() => {
    const car = document.querySelector('.car');
    if (car) {
        carPos += 0.5;
        if(carPos > 90) carPos = 0;
        car.style.left = carPos + "%";
    }
}, 50);

let isEditingProfile = false;

function toggleProfileEdit() {
    isEditingProfile = !isEditingProfile;
    const display = document.getElementById('profile-display');
    const actions = document.getElementById('profile-edit-actions');
    const editBtn = document.getElementById('edit-profile-btn');

    if (isEditingProfile) {
        editBtn.style.display = 'none';
        actions.style.display = 'flex';
display.innerHTML = `
        <p><strong>Name</strong> <input type="text" id="edit-name" class="profile-edit-input" value="${window.currentUser.name}"></p>
        <p><strong>National ID</strong> <span>${window.currentUser.id} (Locked)</span></p> 
        <p><strong>Vehicle</strong> 
            <select id="edit-category" class="profile-edit-input">
                <option value="A" ${window.currentUser.category === 'A' ? 'selected' : ''}>Category A</option>
                <option value="B" ${window.currentUser.category === 'B' ? 'selected' : ''}>Category B</option>
                <option value="C" ${window.currentUser.category === 'C' ? 'selected' : ''}>Category C</option>
            </select>
        </p>
    `;
    } 
    else {
        editBtn.style.display = 'block';
        actions.style.display = 'none';
        showSection('profile'); // Re-render static view
    }
}

function saveProfile() {
    const newName = document.getElementById('edit-name').value;
    const newCat = document.getElementById('edit-category').value;

    if (newName.trim() === "") {
        alert("Name cannot be empty.");
        return;
    }

    // Update global data
    window.currentUser.name = newName;
    window.currentUser.category = newCat;

    // Sync Sidebar
    document.querySelector('.user-name').innerText = newName;
    document.querySelector('.user-cat').innerText = `Category ${newCat}`;

    alert("Profile updated successfully.");
    isEditingProfile = false;
    showSection('profile');
    document.getElementById('edit-profile-btn').style.display = 'block';
    document.getElementById('profile-edit-actions').style.display = 'none';
}

// Updated showSection to handle static rendering
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.style.display = 'none');
    
    const visualEngine = document.querySelector('.visual-engine');
    if (visualEngine) visualEngine.style.display = 'none';

    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    if(sectionId === 'dashboard') {
        if (visualEngine) visualEngine.style.display = 'flex';
    } else {
        const targetView = document.getElementById(sectionId + '-view');
        if (targetView) targetView.style.display = 'block';

if(sectionId === 'profile' && window.currentUser && !isEditingProfile) {
    const profileCard = document.getElementById('profile-display');
    profileCard.innerHTML = `
        <p><strong>Name</strong> <span>${window.currentUser.name}</span></p>
        <p><strong>National ID / Password</strong> <span>${window.currentUser.id}</span></p> 
        <p><strong>Vehicle Category</strong> <span>Category ${window.currentUser.category}</span></p>
        <p><strong>Account Status</strong> <span>Active Driver</span></p>
    `;
}
}
    // Set active button
    if (event && event.currentTarget && event.currentTarget.classList) {
        event.currentTarget.classList.add('active');
    }
    }

function toggleReport() {
    const modal = document.getElementById('report-modal');
    // Change 'block' to 'flex' to maintain the centering
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
    }
}

function updateGPS() {
    const destination = document.getElementById('destination-input').value;
    if (!destination) {
        alert("Please enter a destination to begin tracking.");
        return;
    }

    const mapIframe = document.getElementById('google-map');
    
    // This URL format triggers the Google Directions mode
    // 'origin=My+Location' uses the device's GPS
    const navUrl = `https://www.google.com/maps?q=My+Location+to+${encodeURIComponent(destination)}&output=embed`;
    
    mapIframe.src = navUrl;
    
    console.log("Navigation initialized to: " + destination);
}

let miniPos1 = 0;
let miniPos2 = 50;

setInterval(() => {
    // Mini Player Car
    const pMini = document.querySelector('.player-mini');
    if (pMini) {
        miniPos1 += 0.5;
        if(miniPos1 > 110) miniPos1 = -20;
        pMini.style.left = miniPos1 + "%";
    }

    // Mini Traffic Car
    const tMini = document.querySelector('.traffic-mini');
    if (tMini) {
        miniPos2 += 0.8;
        if(miniPos2 > 110) miniPos2 = -20;
        tMini.style.left = miniPos2 + "%";
    }
}, 30);