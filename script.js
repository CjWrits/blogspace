const API_URL = 'https://blogspace-u1d3.onrender.com/api';
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
    
    // Social button 
    document.querySelector('.social-btn:first-child').addEventListener('click', () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    });
    
    document.querySelector('.social-btn:last-child').addEventListener('click', () => {
        window.location.href = 'http://localhost:5000/api/auth/github';
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

// EE
function setupEasterEggs() {
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

function activateRainbowMode() {
    // Rainbow
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

function toggleFloatingElements(show) {
    const floatingElements = document.querySelectorAll('.floating-icon, .rocket, .shooting-star, .planet');
    floatingElements.forEach(el => {
        el.style.display = show ? 'block' : 'none';
    });
}

function toggleTheme() {
    setTimeout(() => {
        const isLightMode = document.body.classList.toggle('light-mode');
        themeToggle.textContent = isLightMode ? '☀️' : '🌙';
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        toggleFloatingElements(!isLightMode);
    }, 100);
}

function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeToggle.textContent = '🌙';
    } else {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '☀️';
        setTimeout(() => toggleFloatingElements(false), 100);
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
            setAuthState(data.token, data.user);
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
            setAuthState(data.token, data.user);
            e.target.reset();
            alert('Account created successfully! Welcome to Blogspace! ');
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (err) {
        console.error('Registration error:', err);
        alert('Server error. Make sure the server is running on port 5000.');
    }
}

function setAuthState(newToken, user) {
    token = newToken;
    currentUser = user;
    localStorage.setItem('token', token);
    authModal.style.display = 'none';
    authBtn.textContent = 'Logout';
    authBtn.onclick = logout;
    loadBlogs();
    updateProfile();
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
                const joinDate = new Date(data.user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'long' 
                });
                const totalWords = data.blogs.reduce((sum, blog) => sum + blog.content.split(' ').length, 0);
                const uniqueTags = [...new Set(data.blogs.flatMap(blog => blog.tags))].length;
                
                profileName.textContent = data.user.name;
                profileBio.innerHTML = `
                    <div class="profile-details">
                        <span class="profile-email"> ${data.user.email}</span>
                        <span class="profile-university"> ${data.user.university}</span>
                        <span class="profile-joined"> Joined ${joinDate}</span>
                    </div>
                    <div class="profile-stats">
                        <div class="stat">
                            <span class="stat-number">${data.blogs.length}</span>
                            <span class="stat-label">Posts</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${totalWords}</span>
                            <span class="stat-label">Words</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${uniqueTags}</span>
                            <span class="stat-label">Tags</span>
                        </div>
                    </div>
                `;
                
                if (data.blogs.length > 0) {
                    userPosts.innerHTML = `
                        <div class="posts-header">
                            <h4>Recent Posts (${data.blogs.length})</h4>
                            <button class="btn-primary" onclick="showPage('create')"> Write New Post</button>
                        </div>
                        ${data.blogs.map(blog => `
                            <div class="blog-post" onclick="showBlogDetail('${blog._id}')">
                                <h4>${blog.title}</h4>
                                <p>${formatContent(blog.content.substring(0, 150))}...</p>
                                <div class="blog-meta">
                                    <span> ${new Date(blog.createdAt).toLocaleDateString()}</span>
                                    <span> ${blog.content.split(' ').length} words</span>
                                </div>
                                <div class="blog-tags">
                                    ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    `;
                } else {
                    userPosts.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon">✍️</div>
                            <h4>Start Your Blogging Journey!</h4>
                            <p>Share your thoughts, experiences, and knowledge with the campus community.</p>
                            <button class="btn-primary" onclick="showPage('create')">Write Your First Post</button>
                        </div>
                    `;
                }
            }
        } catch (err) {
            console.error('Profile load error:', err);
        }
    } else {
        profileName.textContent = 'Your Profile';
        profileBio.innerHTML = `
            <div class="profile-details">
                <span class="profile-placeholder"> Student at University</span>
            </div>
        `;
        userPosts.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔐</div>
                <h4>Login to View Your Profile</h4>
                <p>Sign in to see your posts, stats, and manage your content.</p>
                <button class="btn-primary" onclick="document.getElementById('authBtn').click()">Login Now</button>
            </div>
        `;
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

function formatContent(content) {
    return content.replace(/\n/g, '<br>');
}

function renderBlogCard(blog) {
    return `
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
    `;
}

async function loadBlogs() {
    try {
        const res = await fetch(`${API_URL}/blogs`);
        const data = await res.json();
        
        if (res.ok) {
            blogs = data;
            document.getElementById('blogPosts').innerHTML = blogs.map(renderBlogCard).join('');
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
                <div class="blog-content">${formatContent(blog.content)}</div>
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
    
    document.getElementById('blogPosts').innerHTML = filteredBlogs.map(renderBlogCard).join('');
}

// floating elements
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

//oauth callback adn existing login 
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('token')) {
    setAuthState(urlParams.get('token'), JSON.parse(decodeURIComponent(urlParams.get('user'))));
    window.history.replaceState({}, document.title, window.location.pathname);
} else if (token && !currentUser) {
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
            logout();
        }
    })
    .catch(() => logout());
}

window.showPage = showPage;
window.showBlogDetail = showBlogDetail;