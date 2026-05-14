// ==================== GLOBAL VARIABLES ====================
let currentUser = null;
let newsData = JSON.parse(localStorage.getItem('newsData')) || [
    { id: 1, date: 'May 2026', title: 'Season 2 Launch', content: 'Welcome to Sandwi4 SMP Season 2! Fresh world, new possibilities, and exciting events await. Join us for the grand opening server events this month.', tag: 'Announcement' },
    { id: 2, date: 'April 2026', title: 'Admin Team Expansion', content: 'We are excited to welcome new team members to the Sandwi4 SMP family. Our growing community deserves even more support and engagement.', tag: 'Update' },
    { id: 3, date: 'March 2026', title: 'Building Competition Results', content: 'Congratulations to all participants in our Spring Building Competition! Amazing creations were showcased throughout the server.', tag: 'Event' }
];

let serverStatus = 'Online';
let serverStatusText = JSON.parse(localStorage.getItem('serverStatus')) || 'Server is running smoothly!';
let teamData = JSON.parse(localStorage.getItem('teamData')) || [
    { id: 1, name: 'MitachetoTW', role: 'Owner', desc: 'Founder and Lead Developer', avatar: 'O' },
    { id: 2, name: 'Kraskata1407', role: 'Owner', desc: 'Server Manager', avatar: 'K' },
    { id: 3, name: 'FlameBanan4o', role: 'Owner', desc: 'Community Manager', avatar: 'F' },
    { id: 4, name: 'Patika126', role: 'Admin', desc: 'Moderator and Builder', avatar: 'P' },
    { id: 5, name: 'MrHamster', role: 'Helper', desc: 'Support Staff', avatar: 'M' }
];

let donationData = JSON.parse(localStorage.getItem('donationData')) || [
    { id: 1, name: 'Supporter', price: '$4.99', features: ['Custom Prefix', '10 Days VIP', 'Vote Rewards'], popular: false },
    { id: 2, name: 'VIP', price: '$9.99', features: ['Custom Prefix', 'Priority Queue', '30 Days VIP', 'Exclusive Items', 'Monthly Rewards'], popular: true },
    { id: 3, name: 'Premium', price: '$24.99', features: ['All VIP Features', 'Custom Skin', 'Admin Shop Access', 'Lifetime VIP', 'Special Cosmetics'] }
];

let rulesData = JSON.parse(localStorage.getItem('rulesData')) || [
    { id: 1, title: 'Be Respectful', content: 'Treat all players with respect. Harassment, discrimination, and hate speech are strictly forbidden.' },
    { id: 2, title: 'No Griefing', content: 'Destroying or modifying other players\' builds without permission is prohibited.' },
    { id: 3, title: 'No Cheating', content: 'Using hacks, exploits, or mods that provide unfair advantages is not allowed.' },
    { id: 4, title: 'No Spam', content: 'Excessive chat messages, advertisements, and flooding are forbidden.' },
    { id: 5, title: 'English in Chat', content: 'Use English in public chat for everyone to understand. Private chat is flexible.' },
    { id: 6, title: 'Follow Admin Decisions', content: 'Respect admin decisions and appeals can be made through proper channels.' }
];

// ==================== NAVIGATION ====================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ==================== HOME PAGE ====================
function initHomePage() {
    // Update stats
    const playerCount = Math.floor(Math.random() * 45) + 15;
    const playersTotal = Math.floor(Math.random() * 200) + 100;
    const uptime = Math.floor(Math.random() * 120) + 30;
    const chunks = Math.floor(Math.random() * 5000) + 1000;

    if (document.getElementById('playerCount')) {
        animateCounter(document.getElementById('playerCount'), playerCount);
        animateCounter(document.getElementById('playersTotal'), playersTotal);
        animateCounter(document.getElementById('uptime'), uptime);
        animateCounter(document.getElementById('chunks'), chunks);
    }

    // Load news
    const newsList = document.getElementById('newsList');
    if (newsList) {
        newsList.innerHTML = '';
        newsData.forEach((news, index) => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            newsCard.style.animationDelay = `${index * 0.1}s`;
            newsCard.innerHTML = `
                <div class="news-date">${news.date}</div>
                <h3>${news.title}</h3>
                <p>${news.content}</p>
                <span class="news-tag">${news.tag}</span>
            `;
            newsList.appendChild(newsCard);
        });
    }
}

function animateCounter(element, target) {
    let current = 0;
    const step = target / 30;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

function copyIP() {
    const ip = 'sandwi4.example.com';
    navigator.clipboard.writeText(ip).then(() => {
        showToast('IP copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy IP', 'error');
    });
}

// ==================== PAGE LOADER ====================
function loadPage(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const mainContent = doc.querySelector('main');
            const currentMain = document.querySelector('main');
            if (currentMain && mainContent) {
                currentMain.innerHTML = mainContent.innerHTML;
                window.scrollTo(0, 0);
                initPage();
            }
        })
        .catch(error => console.error('Error loading page:', error));
}

function initPage() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'home':
            initHomePage();
            break;
        case 'about':
            initAboutPage();
            break;
        case 'rules':
            initRulesPage();
            break;
        case 'team':
            initTeamPage();
            break;
        case 'donate':
            initDonatePage();
            break;
        case 'contacts':
            initContactsPage();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('about')) return 'about';
    if (path.includes('rules')) return 'rules';
    if (path.includes('team')) return 'team';
    if (path.includes('donate')) return 'donate';
    if (path.includes('contacts')) return 'contacts';
    return 'home';
}

// ==================== ABOUT PAGE ====================
function initAboutPage() {
    console.log('About page loaded');
}

// ==================== RULES PAGE ====================
function initRulesPage() {
    const rulesList = document.querySelector('.rules-list');
    if (rulesList) {
        rulesList.innerHTML = '';
        rulesData.forEach((rule, index) => {
            const ruleCard = document.createElement('div');
            ruleCard.className = 'rule-card';
            ruleCard.style.animationDelay = `${index * 0.05}s`;
            ruleCard.innerHTML = `
                <h3>
                    <span class="rule-number">${index + 1}</span>
                    ${rule.title}
                </h3>
                <p>${rule.content}</p>
            `;
            rulesList.appendChild(ruleCard);
        });
    }
}

// ==================== TEAM PAGE ====================
function initTeamPage() {
    const teamGrid = document.querySelector('.team-grid');
    if (teamGrid) {
        teamGrid.innerHTML = '';
        teamData.forEach((member, index) => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';
            teamCard.style.animationDelay = `${index * 0.1}s`;
            teamCard.innerHTML = `
                <div class="team-avatar">${member.avatar}</div>
                <div class="team-name">${member.name}</div>
                <div class="team-role">${member.role}</div>
                <div class="team-desc">${member.desc}</div>
                <div class="team-social">
                    <a href="#" class="social-icon">DC</a>
                    <a href="#" class="social-icon">YT</a>
                </div>
            `;
            teamGrid.appendChild(teamCard);
        });
    }
}

// ==================== DONATE PAGE ====================
function initDonatePage() {
    const packagesGrid = document.querySelector('.packages-grid');
    if (packagesGrid) {
        packagesGrid.innerHTML = '';
        donationData.forEach((pkg, index) => {
            const packageCard = document.createElement('div');
            packageCard.className = `package-card ${pkg.popular ? 'featured' : ''}`;
            packageCard.style.animationDelay = `${index * 0.1}s`;
            packageCard.innerHTML = `
                ${pkg.popular ? '<div class="package-badge">Most Popular</div>' : ''}
                <div class="package-name">${pkg.name}</div>
                <div class="package-price">${pkg.price}<small>/month</small></div>
                <div class="package-description">All features included</div>
                <ul class="package-features">
                    ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <button class="package-button" onclick="purchasePackage('${pkg.name}')">Purchase Now</button>
            `;
            packagesGrid.appendChild(packageCard);
        });
    }
}

function purchasePackage(packageName) {
    showToast(`Thank you! You're being redirected to payment for ${packageName}...`, 'success');
    setTimeout(() => {
        showToast('Payment link would open in a real implementation', 'success');
    }, 1500);
}

// ==================== CONTACTS PAGE ====================
function initContactsPage() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const form = contactForm.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                // In a real app, this would be sent to a server
                showToast('Message sent! We will respond soon.', 'success');
                form.reset();
            });
        }
    }
}

// ==================== ADMIN PANEL ====================
function checkAdminAuth() {
    const path = window.location.pathname;
    if (path.includes('/admin') || path.includes('admin.html')) {
        const token = sessionStorage.getItem('adminToken');
        const loginForm = document.getElementById('adminLoginForm');
        const dashboard = document.getElementById('adminDashboard');

        if (!token) {
            if (loginForm) loginForm.style.display = 'block';
            if (dashboard) dashboard.style.display = 'none';
        } else {
            if (loginForm) loginForm.style.display = 'none';
            if (dashboard) dashboard.style.display = 'block';
            initAdminPanel();
        }
    }
}

function adminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername')?.value;
    const password = document.getElementById('adminPassword')?.value;

    // Demo credentials (change in production!)
    if (username === 'admin' && password === 'sandwi4admin') {
        sessionStorage.setItem('adminToken', 'valid');
        document.getElementById('adminLoginForm').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        initAdminPanel();
    } else {
        showToast('Invalid credentials', 'error');
    }
}

function adminLogout() {
    sessionStorage.removeItem('adminToken');
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminLoginForm').style.display = 'block';
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
}

function initAdminPanel() {
    const navButtons = document.querySelectorAll('.admin-nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const sections = document.querySelectorAll('.admin-section');
            sections.forEach(s => s.classList.remove('active'));
            
            const sectionId = btn.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) section.classList.add('active');

            // Load content for the section
            loadAdminSection(sectionId);
        });
    });

    // Load first section by default
    const firstBtn = navButtons[0];
    if (firstBtn) firstBtn.click();
}

function loadAdminSection(sectionId) {
    switch(sectionId) {
        case 'news':
            loadAdminNews();
            break;
        case 'server':
            loadAdminServer();
            break;
        case 'team':
            loadAdminTeam();
            break;
        case 'rules':
            loadAdminRules();
            break;
        case 'donations':
            loadAdminDonations();
            break;
    }
}

// ==================== ADMIN - NEWS ====================
function loadAdminNews() {
    const container = document.getElementById('newsContent');
    if (!container) return;

    container.innerHTML = `
        <div class="admin-card">
            <h3>Add New News</h3>
            <form class="admin-form" onsubmit="saveAdminNews(event)">
                <div class="admin-form-group">
                    <label>Date</label>
                    <input type="text" id="newsDate" placeholder="May 2026" required>
                </div>
                <div class="admin-form-group">
                    <label>Title</label>
                    <input type="text" id="newsTitle" placeholder="News title" required>
                </div>
                <div class="admin-form-group">
                    <label>Content</label>
                    <textarea id="newsContent" placeholder="News content" required></textarea>
                </div>
                <div class="admin-form-group">
                    <label>Tag</label>
                    <select id="newsTag">
                        <option>Announcement</option>
                        <option>Update</option>
                        <option>Event</option>
                    </select>
                </div>
                <div class="admin-form-buttons">
                    <button type="submit" class="admin-btn admin-btn-save">Save News</button>
                    <button type="button" class="admin-btn admin-btn-cancel" onclick="clearAdminNewsForm()">Clear</button>
                </div>
            </form>
        </div>

        <div class="admin-card">
            <h3>All News</h3>
            <div class="admin-list" id="newsList"></div>
        </div>
    `;

    renderAdminNewsList();
}

function renderAdminNewsList() {
    const container = document.getElementById('newsList');
    if (!container) return;

    container.innerHTML = newsData.map((news, index) => `
        <div class="admin-item">
            <div class="admin-item-content">
                <div class="admin-item-title">${news.title}</div>
                <div class="admin-item-text">Date: ${news.date}</div>
                <div class="admin-item-text">${news.content}</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-btn-small admin-btn-edit" onclick="editAdminNews(${index})">Edit</button>
                <button class="admin-btn-small admin-btn-delete" onclick="deleteAdminNews(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function saveAdminNews(e) {
    e.preventDefault();
    const date = document.getElementById('newsDate').value;
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    const tag = document.getElementById('newsTag').value;

    const newNews = {
        id: newsData.length + 1,
        date,
        title,
        content,
        tag
    };

    newsData.unshift(newNews);
    localStorage.setItem('newsData', JSON.stringify(newsData));
    showToast('News added successfully!', 'success');
    clearAdminNewsForm();
    renderAdminNewsList();
}

function clearAdminNewsForm() {
    document.getElementById('newsDate').value = '';
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
}

function editAdminNews(index) {
    const news = newsData[index];
    document.getElementById('newsDate').value = news.date;
    document.getElementById('newsTitle').value = news.title;
    document.getElementById('newsContent').value = news.content;
    document.getElementById('newsTag').value = news.tag;
}

function deleteAdminNews(index) {
    if (confirm('Are you sure you want to delete this news?')) {
        newsData.splice(index, 1);
        localStorage.setItem('newsData', JSON.stringify(newsData));
        showToast('News deleted successfully!', 'success');
        renderAdminNewsList();
    }
}

// ==================== ADMIN - SERVER ====================
function loadAdminServer() {
    const container = document.getElementById('serverContent');
    if (!container) return;

    container.innerHTML = `
        <div class="admin-card">
            <h3>Server Status</h3>
            <form class="admin-form" onsubmit="saveAdminServer(event)">
                <div class="admin-form-group">
                    <label>Server Status</label>
                    <select id="serverStatusSelect">
                        <option value="Online" ${serverStatus === 'Online' ? 'selected' : ''}>Online</option>
                        <option value="Offline" ${serverStatus === 'Offline' ? 'selected' : ''}>Offline</option>
                        <option value="Maintenance" ${serverStatus === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                    </select>
                </div>
                <div class="admin-form-group">
                    <label>Status Message</label>
                    <textarea id="serverStatusText" placeholder="Enter server status message">${serverStatusText}</textarea>
                </div>
                <div class="admin-form-buttons">
                    <button type="submit" class="admin-btn admin-btn-save">Update Status</button>
                </div>
            </form>
        </div>
    `;
}

function saveAdminServer(e) {
    e.preventDefault();
    serverStatus = document.getElementById('serverStatusSelect').value;
    serverStatusText = document.getElementById('serverStatusText').value;
    
    localStorage.setItem('serverStatus', JSON.stringify(serverStatusText));
    showToast('Server status updated!', 'success');
}

// ==================== ADMIN - TEAM ====================
function loadAdminTeam() {
    const container = document.getElementById('teamContent');
    if (!container) return;

    container.innerHTML = `
        <div class="admin-card">
            <h3>Add Team Member</h3>
            <form class="admin-form" onsubmit="saveAdminTeamMember(event)">
                <div class="admin-form-group">
                    <label>Name</label>
                    <input type="text" id="teamName" placeholder="Player name" required>
                </div>
                <div class="admin-form-group">
                    <label>Role</label>
                    <select id="teamRole">
                        <option>Owner</option>
                        <option>Admin</option>
                        <option>Helper</option>
                    </select>
                </div>
                <div class="admin-form-group">
                    <label>Description</label>
                    <input type="text" id="teamDesc" placeholder="Role description" required>
                </div>
                <div class="admin-form-group">
                    <label>Avatar Letter</label>
                    <input type="text" id="teamAvatar" placeholder="Single letter" maxlength="1" required>
                </div>
                <div class="admin-form-buttons">
                    <button type="submit" class="admin-btn admin-btn-save">Add Member</button>
                    <button type="button" class="admin-btn admin-btn-cancel" onclick="clearAdminTeamForm()">Clear</button>
                </div>
            </form>
        </div>

        <div class="admin-card">
            <h3>Team Members</h3>
            <div class="admin-list" id="teamList"></div>
        </div>
    `;

    renderAdminTeamList();
}

function renderAdminTeamList() {
    const container = document.getElementById('teamList');
    if (!container) return;

    container.innerHTML = teamData.map((member, index) => `
        <div class="admin-item">
            <div class="admin-item-content">
                <div class="admin-item-title">${member.name}</div>
                <div class="admin-item-text">Role: ${member.role}</div>
                <div class="admin-item-text">${member.desc}</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-btn-small admin-btn-delete" onclick="deleteAdminTeamMember(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function saveAdminTeamMember(e) {
    e.preventDefault();
    const name = document.getElementById('teamName').value;
    const role = document.getElementById('teamRole').value;
    const desc = document.getElementById('teamDesc').value;
    const avatar = document.getElementById('teamAvatar').value.toUpperCase();

    const newMember = {
        id: teamData.length + 1,
        name,
        role,
        desc,
        avatar
    };

    teamData.push(newMember);
    localStorage.setItem('teamData', JSON.stringify(teamData));
    showToast('Team member added!', 'success');
    clearAdminTeamForm();
    renderAdminTeamList();
}

function clearAdminTeamForm() {
    document.getElementById('teamName').value = '';
    document.getElementById('teamDesc').value = '';
    document.getElementById('teamAvatar').value = '';
}

function deleteAdminTeamMember(index) {
    if (confirm('Are you sure?')) {
        teamData.splice(index, 1);
        localStorage.setItem('teamData', JSON.stringify(teamData));
        showToast('Team member removed!', 'success');
        renderAdminTeamList();
    }
}

// ==================== ADMIN - RULES ====================
function loadAdminRules() {
    const container = document.getElementById('rulesContent');
    if (!container) return;

    container.innerHTML = `
        <div class="admin-card">
            <h3>Add New Rule</h3>
            <form class="admin-form" onsubmit="saveAdminRule(event)">
                <div class="admin-form-group">
                    <label>Rule Title</label>
                    <input type="text" id="ruleTitle" placeholder="Rule title" required>
                </div>
                <div class="admin-form-group">
                    <label>Rule Content</label>
                    <textarea id="ruleContent" placeholder="Rule description" required></textarea>
                </div>
                <div class="admin-form-buttons">
                    <button type="submit" class="admin-btn admin-btn-save">Add Rule</button>
                    <button type="button" class="admin-btn admin-btn-cancel" onclick="clearAdminRuleForm()">Clear</button>
                </div>
            </form>
        </div>

        <div class="admin-card">
            <h3>All Rules</h3>
            <div class="admin-list" id="rulesList"></div>
        </div>
    `;

    renderAdminRulesList();
}

function renderAdminRulesList() {
    const container = document.getElementById('rulesList');
    if (!container) return;

    container.innerHTML = rulesData.map((rule, index) => `
        <div class="admin-item">
            <div class="admin-item-content">
                <div class="admin-item-title">${rule.title}</div>
                <div class="admin-item-text">${rule.content}</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-btn-small admin-btn-delete" onclick="deleteAdminRule(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function saveAdminRule(e) {
    e.preventDefault();
    const title = document.getElementById('ruleTitle').value;
    const content = document.getElementById('ruleContent').value;

    const newRule = {
        id: rulesData.length + 1,
        title,
        content
    };

    rulesData.push(newRule);
    localStorage.setItem('rulesData', JSON.stringify(rulesData));
    showToast('Rule added!', 'success');
    clearAdminRuleForm();
    renderAdminRulesList();
}

function clearAdminRuleForm() {
    document.getElementById('ruleTitle').value = '';
    document.getElementById('ruleContent').value = '';
}

function deleteAdminRule(index) {
    if (confirm('Are you sure?')) {
        rulesData.splice(index, 1);
        localStorage.setItem('rulesData', JSON.stringify(rulesData));
        showToast('Rule deleted!', 'success');
        renderAdminRulesList();
    }
}

// ==================== ADMIN - DONATIONS ====================
function loadAdminDonations() {
    const container = document.getElementById('donationsContent');
    if (!container) return;

    container.innerHTML = `
        <div class="admin-card">
            <h3>Add Donation Package</h3>
            <form class="admin-form" onsubmit="saveAdminDonation(event)">
                <div class="admin-form-group">
                    <label>Package Name</label>
                    <input type="text" id="donationName" placeholder="e.g., VIP" required>
                </div>
                <div class="admin-form-group">
                    <label>Price</label>
                    <input type="text" id="donationPrice" placeholder="e.g., $9.99" required>
                </div>
                <div class="admin-form-group">
                    <label>Features (one per line)</label>
                    <textarea id="donationFeatures" placeholder="Custom Prefix&#10;Priority Queue&#10;VIP Access" required></textarea>
                </div>
                <div class="admin-form-buttons">
                    <button type="submit" class="admin-btn admin-btn-save">Add Package</button>
                    <button type="button" class="admin-btn admin-btn-cancel" onclick="clearAdminDonationForm()">Clear</button>
                </div>
            </form>
        </div>

        <div class="admin-card">
            <h3>All Packages</h3>
            <div class="admin-list" id="donationsList"></div>
        </div>
    `;

    renderAdminDonationsList();
}

function renderAdminDonationsList() {
    const container = document.getElementById('donationsList');
    if (!container) return;

    container.innerHTML = donationData.map((pkg, index) => `
        <div class="admin-item">
            <div class="admin-item-content">
                <div class="admin-item-title">${pkg.name} - ${pkg.price}</div>
                <div class="admin-item-text">Features: ${pkg.features.join(', ')}</div>
            </div>
            <div class="admin-item-actions">
                <button class="admin-btn-small admin-btn-delete" onclick="deleteAdminDonation(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function saveAdminDonation(e) {
    e.preventDefault();
    const name = document.getElementById('donationName').value;
    const price = document.getElementById('donationPrice').value;
    const features = document.getElementById('donationFeatures').value.split('\n').filter(f => f.trim());

    const newDonation = {
        id: donationData.length + 1,
        name,
        price,
        features,
        popular: false
    };

    donationData.push(newDonation);
    localStorage.setItem('donationData', JSON.stringify(donationData));
    showToast('Donation package added!', 'success');
    clearAdminDonationForm();
    renderAdminDonationsList();
}

function clearAdminDonationForm() {
    document.getElementById('donationName').value = '';
    document.getElementById('donationPrice').value = '';
    document.getElementById('donationFeatures').value = '';
}

function deleteAdminDonation(index) {
    if (confirm('Are you sure?')) {
        donationData.splice(index, 1);
        localStorage.setItem('donationData', JSON.stringify(donationData));
        showToast('Package deleted!', 'success');
        renderAdminDonationsList();
    }
}

// ==================== UTILITIES ====================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    initPage();

    // Add smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Update active nav link
window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        const currentPage = getCurrentPage();
        if (page === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
