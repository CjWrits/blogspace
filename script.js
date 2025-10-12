const API_URL = 'http://localhost:5001/api';
let currentUser = null;
let token = localStorage.getItem('token');
let blogs = [];


const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const mainContent = document.getElementById('home');


document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadBlogs();
    loadPeerSuggestions();
    checkTheme();
    createSpaceElements();
    setupEasterEggs();
});

function setupEventListeners() {

    authBtn.addEventListener('click', () => authModal.style.display = 'block');
    document.querySelector('.close').addEventListener('click', () => authModal.style.display = 'none');
    
    // Social button handlers
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('OAuth integration coming soon! 🚀\nFor now, please use email registration.');
        });
    });
    

    themeToggle.addEventListener('click', toggleTheme);
    

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('href').substring(1);
            showPage(page);
            updateActiveNav(link);
        });
    });
    

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchAuthTab(btn.dataset.tab));
    });
    

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('blogForm').addEventListener('submit', handleBlogSubmit);
    

    document.getElementById('searchInput').addEventListener('input', handleSearch);
}

// Easter Eggs for Dark Mode
function setupEasterEggs() {
    // Triple-click theme toggle for neon pulse
    let themeClickCount = 0;
    let themeClickTimer;
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) return;
        
        themeClickCount++;
        clearTimeout(themeClickTimer);
        
        if (themeClickCount === 3) {
            activateNeonPulse();
            themeClickCount = 0;
        }
        
        themeClickTimer = setTimeout(() => {
            themeClickCount = 0;
        }, 800);
    });
    
    // Double-click EE
    const brandName = document.querySelector('.nav-brand h2');
    let clickCount = 0;
    brandName.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) return;
        
        clickCount++;
        if (clickCount === 2) {
            activateRainbowMode();
            clickCount = 0;
        }
        setTimeout(() => clickCount = 0, 500);
    });
    
    //'space' EE
    let typedKeys = '';
    document.addEventListener('keypress', (e) => {
        if (document.body.classList.contains('light-mode')) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        typedKeys += e.key.toLowerCase();
        if (typedKeys.includes('space')) {
            activateCosmicExplosion();
            typedKeys = '';
        }
        setTimeout(() => typedKeys = '', 2000);
    });
}

function activateNeonPulse() {
    // Neon pulse all elements
    document.body.classList.add('neon-pulse');
    setTimeout(() => document.body.classList.remove('neon-pulse'), 4000);
}

function activateRainbowMode() {
    // Rainbow on all elements
    document.body.classList.add('rainbow-mode');
    setTimeout(() => document.body.classList.remove('rainbow-mode'), 3000);
}

function activateCosmicExplosion() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'cosmic-particle';
            particle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'vw');
            particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'vh');
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 2000);
        }, i * 30);
    }
}

function showPage(pageId) {

    pages.forEach(page => page.classList.add('hidden'));
    mainContent.classList.add('hidden');
    
    if (pageId === 'home') {
        mainContent.classList.remove('hidden');
    } else {
        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.remove('hidden');
    }
}

function updateActiveNav(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function toggleTheme() {
    setTimeout(() => {
        const isLightMode = document.body.classList.toggle('light-mode');
        themeToggle.textContent = isLightMode ? '☀️' : '🌙';
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        
        const floatingElements = document.querySelectorAll('.floating-icon, .rocket, .shooting-star, .planet');
        floatingElements.forEach(el => {
            el.style.display = isLightMode ? 'none' : 'block';
        });
    }, 100);
}

function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '☀️';
        // Hide planets light mode
        setTimeout(() => {
            const floatingElements = document.querySelectorAll('.floating-icon, .rocket, .shooting-star, .planet');
            floatingElements.forEach(el => el.style.display = 'none');
        }, 100);
    } else {
        themeToggle.textContent = '🌙';
    }
}

function switchAuthTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
}

async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            token = data.token;
            currentUser = data.user;
            localStorage.setItem('token', token);
            authModal.style.display = 'none';
            authBtn.textContent = 'Logout';
            authBtn.onclick = logout;
            loadBlogs();
            updateProfile();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (err) {
        alert('Server error. Please try again.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const university = inputs[2].value;
    const password = inputs[3].value;
    
    if (!name || !email || !university || !password) {
        alert('Please fill all fields');
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, university, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            token = data.token;
            currentUser = data.user;
            localStorage.setItem('token', token);
            authModal.style.display = 'none';
            authBtn.textContent = 'Logout';
            authBtn.onclick = logout;
            e.target.reset();
            loadBlogs();
            updateProfile();
            alert('Account created successfully! Welcome to Blogspace! 🚀');
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (err) {
        console.error('Registration error:', err);
        alert('Server error. Make sure the server is running on port 5000.');
    }
}

function logout() {
    currentUser = null;
    token = null;
    localStorage.removeItem('token');
    authBtn.textContent = 'Login';
    authBtn.onclick = () => authModal.style.display = 'block';
    loadBlogs();
    updateProfile();
}

async function updateProfile() {
    const profileName = document.getElementById('profileName');
    const profileBio = document.getElementById('profileBio');
    const userPosts = document.getElementById('userPosts');
    
    if (currentUser && token) {
        try {
            const res = await fetch(`${API_URL}/users/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (res.ok) {
                profileName.textContent = data.user.name;
                profileBio.textContent = `${data.user.email} • ${data.user.university}`;
                
                if (data.blogs.length > 0) {
                    userPosts.innerHTML = data.blogs.map(blog => `
                        <div class="blog-post" onclick="showBlogDetail('${blog._id}')">
                            <h4>${blog.title}</h4>
                            <p>${blog.content.substring(0, 150)}...</p>
                            <div class="blog-meta">
                                <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div class="blog-tags">
                                ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    `).join('');
                } else {
                    userPosts.innerHTML = '<div class="empty-state"><p>No posts yet. Start writing!</p></div>';
                }
            }
        } catch (err) {
            console.error('Profile load error:', err);
        }
    } else {
        profileName.textContent = 'Your Profile';
        profileBio.textContent = 'Student at University';
        userPosts.innerHTML = '<div class="empty-state"><p>Please login to view your profile</p></div>';
    }
}

async function handleBlogSubmit(e) {
    e.preventDefault();
    if (!token) {
        alert('Please login to create a blog post');
        return;
    }
    
    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;
    const tags = document.getElementById('blogTags').value.split(',').map(tag => tag.trim()).filter(t => t);
    
    try {
        const res = await fetch(`${API_URL}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content, tags })
        });
        
        if (res.ok) {
            loadBlogs();
            updateProfile();
            showPage('home');
            e.target.reset();
        } else {
            alert('Failed to create blog');
        }
    } catch (err) {
        alert('Server error. Please try again.');
    }
}

async function loadBlogs() {
    try {
        const res = await fetch(`${API_URL}/blogs`);
        const data = await res.json();
        
        if (res.ok) {
            blogs = data;
            const blogContainer = document.getElementById('blogPosts');
            blogContainer.innerHTML = blogs.map(blog => `
                <div class="blog-post" onclick="showBlogDetail('${blog._id}')">
                    <h4>${blog.title}</h4>
                    <p>${blog.content.substring(0, 150)}...</p>
                    <div class="blog-meta">
                        <span class="blog-author">By ${blog.author.name}</span>
                        <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="blog-tags">
                        ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Failed to load blogs:', err);
    }
}

async function showBlogDetail(blogId) {
    try {
        const res = await fetch(`${API_URL}/blogs/${blogId}`);
        const blog = await res.json();
        
        if (res.ok) {
            document.getElementById('blogDetailContent').innerHTML = `
                <h1>${blog.title}</h1>
                <div class="blog-meta">
                    <span class="blog-author">By ${blog.author.name}</span>
                    <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="blog-content">${blog.content}</div>
                <div class="blog-tags">
                    ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;
            showPage('blogDetail');
        }
    } catch (err) {
        console.error('Failed to load blog:', err);
    }
}

function loadPeerSuggestions() {

    document.getElementById('peerSuggestions').innerHTML = `
        <div class="empty-state">
            <p>Connect with peers when you join the platform</p>
        </div>
    `;
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    if (!query) {
        loadBlogs();
        return;
    }
    
    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query) ||
        blog.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    const blogContainer = document.getElementById('blogPosts');
    blogContainer.innerHTML = filteredBlogs.map(blog => `
        <div class="blog-post" onclick="showBlogDetail('${blog._id}')">
            <h4>${blog.title}</h4>
            <p>${blog.content.substring(0, 150)}...</p>
            <div class="blog-meta">
                <span class="blog-author">By ${blog.author.name}</span>
                <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="blog-tags">
                ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Create floating elements
function createSpaceElements() {
    // Planets
    const planets = ['🪐', '🌍', '🌙', '⭐','🌕','☄️','🌌'];
    planets.forEach((planet, index) => {
        const element = document.createElement('div');
        element.className = 'floating-icon';
        element.textContent = planet;
        element.style.top = Math.random() * 70 + 10 + '%';
        element.style.left = Math.random() * 80 + 10 + '%';
        element.style.animationDelay = index * 1.5 + 's';
        element.addEventListener('click', () => animateSpaceElement(element));
        document.body.appendChild(element);
    });

    // Rockets
    const rockets = ['🚀', '🛸'];
    rockets.forEach((rocket, index) => {
        const element = document.createElement('div');
        element.className = 'rocket';
        element.textContent = rocket;
        element.style.top = Math.random() * 70 + 15 + '%';
        element.style.left = Math.random() * 70 + 15 + '%';
        element.style.animationDelay = index * 3 + 's';
        element.addEventListener('click', () => animateSpaceElement(element));
        document.body.appendChild(element);
    });

    // Shooting stars
    setInterval(() => {
        if (Math.random() < 0.3) {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            star.style.top = Math.random() * 50 + '%';
            star.style.left = '0px';
            document.body.appendChild(star);
            
            setTimeout(() => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            }, 3000);
        }
    }, 2000);
}

// Animate space elements on click
function animateSpaceElement(element) {
    element.style.transform = 'scale(1.5)';
    element.style.transition = 'transform 0.3s ease';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 300);
}

// Check if user is logged in on page load
if (token) {
    fetch(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data.user) {
            currentUser = data.user;
            authBtn.textContent = 'Logout';
            authBtn.onclick = logout;
        } else {
            localStorage.removeItem('token');
            token = null;
        }
    })
    .catch(() => {
        localStorage.removeItem('token');
        token = null;
    });
}

window.showPage = showPage;
window.showBlogDetail = showBlogDetail;
window.setupEasterEggs = setupEasterEggs;