// API endpoints
const API_URL = 'http://localhost:5000/api/auth';

// Make handleLogin globally available
window.handleLogin = async function() {
    console.log('Login button clicked');
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    console.log('Login values:', { email, password });

    try {
        console.log('Sending login request to:', `${API_URL}/login`);
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
            mode: 'cors'
        });

        console.log('Login response status:', response.status);
        const data = await response.json();
        console.log('Login response data:', data);

        if (response.ok) {
            // Login successful
            console.log('Login successful, storing user data:', data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('Redirecting to garage2.html');
            window.location.href = 'garage2.html';
        } else {
            // Show error message
            console.error('Login failed:', data.message);
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
}

// Handle signup form submission
async function handleSignup(event) {
    event.preventDefault();
    console.log('Signup form submitted');
    
    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const birthday = document.getElementById('birthday').value;
    
    console.log('Form values:', { username, phone, email, password, birthday });
    
    // Get selected gender
    const genderRadios = document.querySelectorAll('input[name="option"]');
    let gender = '';
    genderRadios.forEach(radio => {
        if (radio.checked) {
            gender = radio.value;
            console.log('Selected gender:', gender);
        }
    });

    if (!username || !phone || !email || !password || !birthday || !gender) {
        alert('All fields are required');
        return;
    }

    try {
        console.log('Sending signup request to:', `${API_URL}/signup`);
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                phone,
                email,
                password,
                birthday,
                gender
            }),
            credentials: 'include',
            mode: 'cors'
        });

        console.log('Signup response status:', response.status);
        const data = await response.json();
        console.log('Signup response data:', data);

        if (response.ok) {
            // Signup successful
            console.log('Signup successful, storing user data:', data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('Redirecting to garage2.html');
            window.location.href = 'garage2.html';
        } else {
            // Show error message
            console.error('Signup failed:', data.message);
            alert(data.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An error occurred during signup. Please try again.');
    }
}

// Check if user is logged in
function checkAuthStatus() {
    const user = localStorage.getItem('user');
    if (user) {
        // User is logged in
        const userData = JSON.parse(user);
        // Update UI to show logged-in state
        updateUIForLoggedInUser(userData);
    }
}

// Update UI for logged-in user
function updateUIForLoggedInUser(userData) {
    // Add logout button
    const nav = document.querySelector('nav');
    if (nav) {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = handleLogout;
        nav.appendChild(logoutBtn);
    }

    // Update user-specific elements
    const userElements = document.querySelectorAll('.user-name');
    userElements.forEach(element => {
        element.textContent = userData.username;
    });
}

// Handle logout
async function handleLogout() {
    try {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        // Clear local storage
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/form.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up event listeners');
    
    // Setup signup form handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        console.log('Signup form found, adding submit handler');
        signupForm.addEventListener('submit', handleSignup);
    } else {
        console.log('Signup form not found');
    }

    // Check authentication status
    checkAuthStatus();
}); 