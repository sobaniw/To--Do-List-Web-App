// DOM Elements
const authContainer = document.getElementById('authContainer');
const appContainer = document.getElementById('appContainer');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const signupMessage = document.getElementById('signupMessage');
const loginMessage = document.getElementById('loginMessage');
const userDisplay = document.getElementById('userDisplay');
const signoutBtn = document.getElementById('signoutBtn');

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// State
let currentUser = null;
let tasks = [];

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        loadUserTasks();
        showApp();
    } else {
        showAuth();
    }
});

// ============ AUTH FUNCTIONS ============

function toggleAuthForms(event) {
    event.preventDefault();
    signupForm.classList.toggle('active');
    loginForm.classList.toggle('active');
    signupMessage.className = 'message';
    loginMessage.className = 'message';
}

function handleSignUp(event) {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    signupMessage.className = 'message';
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showMessage(signupMessage, 'All fields are required', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage(signupMessage, 'Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage(signupMessage, 'Password must be at least 6 characters', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        showMessage(signupMessage, 'Email already registered', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: hashPassword(password) // Basic hashing (not secure for production)
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage(signupMessage, 'Sign up successful! Please login.', 'success');
    
    // Clear form
    document.getElementById('signupForm').reset();
    
    // Switch to login after 2 seconds
    setTimeout(() => {
        toggleAuthForms(event);
    }, 2000);
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    loginMessage.className = 'message';
    
    // Validation
    if (!email || !password) {
        showMessage(loginMessage, 'Email and password are required', 'error');
        return;
    }
    
    // Check user credentials
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === hashPassword(password));
    
    if (!user) {
        showMessage(loginMessage, 'Invalid email or password', 'error');
        return;
    }
    
    // Login successful
    currentUser = { id: user.id, username: user.username, email: user.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showMessage(loginMessage, 'Login successful!', 'success');
    
    // Redirect after 1 second
    setTimeout(() => {
        loadUserTasks();
        showApp();
    }, 1000);
}

function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('currentUser');
        currentUser = null;
        tasks = [];
        document.getElementById('loginForm').reset();
        document.getElementById('signupForm').reset();
        toggleToSignup();
        showAuth();
    }
}

// ============ UI FUNCTIONS ============

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
}

function toggleToSignup() {
    if (loginForm.classList.contains('active')) {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

function showAuth() {
    authContainer.style.display = 'flex';
    appContainer.style.display = 'none';
}

function showApp() {
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';
    userDisplay.textContent = `Welcome, ${currentUser.username}!`;
    renderTasks();
}

// ============ TO-DO FUNCTIONS ============

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

signoutBtn.addEventListener('click', handleSignOut);

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(task);
    saveUserTasks();
    taskInput.value = '';
    renderTasks();
    taskInput.focus();
}

function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<li style="text-align: center; padding: 30px; color: #999;">No tasks yet. Add one to get started!</li>';
        return;
    }
    
    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        taskList.appendChild(li);
    });
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveUserTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveUserTasks();
    renderTasks();
}

// ============ STORAGE FUNCTIONS ============

function saveUserTasks() {
    const userTasksKey = `tasks_${currentUser.id}`;
    localStorage.setItem(userTasksKey, JSON.stringify(tasks));
}

function loadUserTasks() {
    const userTasksKey = `tasks_${currentUser.id}`;
    tasks = JSON.parse(localStorage.getItem(userTasksKey)) || [];
}

// ============ UTILITY FUNCTIONS ============

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function hashPassword(password) {
    // Basic hash function (NOT SECURE - for demo only)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}