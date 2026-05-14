/*
 * SANDWI4 SMP WEBSITE - CONFIGURATION FILE
 * 
 * This file contains all the configuration options for easy customization.
 * Copy these values to js/app.js and modify as needed.
 */

// ==================== SERVER INFORMATION ====================

// Server IP - Update this to your actual server IP/domain
const SERVER_IP = 'sandwi4.example.com';

// Server Status - 'Online', 'Offline', 'Maintenance'
const SERVER_STATUS = 'Online';

// Server Status Message
const SERVER_STATUS_MESSAGE = 'Server is running smoothly!';

// ==================== SITE INFORMATION ====================

const SITE_CONFIG = {
    siteName: 'Sandwi4 SMP',
    tagline: 'A Premium Survival Multiplayer Experience',
    description: 'Join our thriving Minecraft SMP community',
    
    // Contact Information
    contact: {
        email: 'admin@sandwi4.com',
        supportEmail: 'support@sandwi4.com',
        discord: 'sandwi4.gg',
        discordUrl: 'https://discord.gg/sandwi4'
    },
    
    // Social Links (optional)
    social: {
        discord: 'https://discord.gg/sandwi4',
        youtube: 'https://youtube.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com'
    }
};

// ==================== TEAM MEMBERS ====================

const TEAM_MEMBERS = {
    owners: [
        {
            id: 1,
            name: 'MitachetoTW',
            role: 'Owner',
            desc: 'Founder and Lead Developer',
            avatar: 'O',
            discord: 'MitachetoTW#0000',
            youtube: 'https://youtube.com'
        },
        {
            id: 2,
            name: 'Kraskata1407',
            role: 'Owner',
            desc: 'Server Manager',
            avatar: 'K',
            discord: 'Kraskata1407#0000',
            youtube: 'https://youtube.com'
        },
        {
            id: 3,
            name: 'FlameBanan4o',
            role: 'Owner',
            desc: 'Community Manager',
            avatar: 'F',
            discord: 'FlameBanan4o#0000',
            youtube: 'https://youtube.com'
        }
    ],
    
    admins: [
        {
            id: 4,
            name: 'Patika126',
            role: 'Admin',
            desc: 'Moderator and Builder',
            avatar: 'P',
            discord: 'Patika126#0000'
        }
    ],
    
    helpers: [
        {
            id: 5,
            name: 'MrHamster',
            role: 'Helper',
            desc: 'Support Staff',
            avatar: 'M',
            discord: 'MrHamster#0000'
        }
    ]
};

// ==================== SERVER RULES ====================

const SERVER_RULES = [
    {
        id: 1,
        title: 'Be Respectful',
        content: 'Treat all players with respect. Harassment, discrimination, and hate speech are strictly forbidden.'
    },
    {
        id: 2,
        title: 'No Griefing',
        content: 'Destroying or modifying other players\' builds without permission is prohibited.'
    },
    {
        id: 3,
        title: 'No Cheating',
        content: 'Using hacks, exploits, or mods that provide unfair advantages is not allowed.'
    },
    {
        id: 4,
        title: 'No Spam',
        content: 'Excessive chat messages, advertisements, and flooding are forbidden.'
    },
    {
        id: 5,
        title: 'English in Chat',
        content: 'Use English in public chat for everyone to understand. Private chat is flexible.'
    },
    {
        id: 6,
        title: 'Follow Admin Decisions',
        content: 'Respect admin decisions and appeals can be made through proper channels.'
    }
];

// ==================== DONATION PACKAGES ====================

const DONATION_PACKAGES = [
    {
        id: 1,
        name: 'Supporter',
        price: '$4.99',
        period: '/month',
        features: [
            'Custom Prefix',
            '10 Days VIP',
            'Vote Rewards'
        ],
        popular: false,
        paymentUrl: 'https://payment.example.com/supporter'
    },
    {
        id: 2,
        name: 'VIP',
        price: '$9.99',
        period: '/month',
        features: [
            'Custom Prefix',
            'Priority Queue',
            '30 Days VIP',
            'Exclusive Items',
            'Monthly Rewards'
        ],
        popular: true,
        paymentUrl: 'https://payment.example.com/vip'
    },
    {
        id: 3,
        name: 'Premium',
        price: '$24.99',
        period: '/month',
        features: [
            'All VIP Features',
            'Custom Skin',
            'Admin Shop Access',
            'Lifetime VIP',
            'Special Cosmetics'
        ],
        popular: false,
        paymentUrl: 'https://payment.example.com/premium'
    }
];

// ==================== COLOR SCHEME ====================

const COLOR_SCHEME = {
    primary: '#1aa700',           // Main green
    primaryDark: '#0d5c00',        // Dark green
    secondary: '#ff6b35',          // Orange
    accent: '#ffd700',             // Gold
    success: '#4CAF50',            // Green
    warning: '#FFB74D',            // Orange
    danger: '#f44336',             // Red
    
    // Backgrounds
    bgDark: '#0a0e27',
    bgDarker: '#050810',
    cardBg: '#1a2332',
    
    // Text
    textLight: '#e0e0e0',
    textDark: '#1a1a1a',
    textMuted: '#a0a0a0',
    
    // Borders
    borderColor: '#2a3f5f'
};

// ==================== ADMIN CREDENTIALS ====================

const ADMIN_CONFIG = {
    // Change these to your desired admin credentials
    username: 'admin',
    password: 'sandwi4admin',
    
    // Session timeout in milliseconds (30 minutes)
    sessionTimeout: 30 * 60 * 1000,
    
    // Maximum failed login attempts before lockout
    maxLoginAttempts: 5,
    
    // Lockout duration in milliseconds (15 minutes)
    lockoutDuration: 15 * 60 * 1000
};

// ==================== FEATURE FLAGS ====================

const FEATURES = {
    // Enable/disable various features
    showNews: true,
    showTeam: true,
    showRules: true,
    showDonate: true,
    showContacts: true,
    
    // Admin features
    allowNewsEditing: true,
    allowTeamManagement: true,
    allowRuleManagement: true,
    allowDonationManagement: true,
    
    // External integrations
    googleAnalytics: false,
    discordIntegration: false,
    emailNotifications: false
};

// ==================== NEWS ARTICLES ====================

const INITIAL_NEWS = [
    {
        id: 1,
        date: 'May 2026',
        title: 'Season 2 Launch',
        content: 'Welcome to Sandwi4 SMP Season 2! Fresh world, new possibilities, and exciting events await. Join us for the grand opening server events this month.',
        tag: 'Announcement'
    },
    {
        id: 2,
        date: 'April 2026',
        title: 'Admin Team Expansion',
        content: 'We are excited to welcome new team members to the Sandwi4 SMP family. Our growing community deserves even more support and engagement.',
        tag: 'Update'
    },
    {
        id: 3,
        date: 'March 2026',
        title: 'Building Competition Results',
        content: 'Congratulations to all participants in our Spring Building Competition! Amazing creations were showcased throughout the server.',
        tag: 'Event'
    }
];

// ==================== PAGINATION ====================

const PAGINATION = {
    newsPerPage: 10,
    teamPerPage: 20,
    itemsPerPage: 25
};

// ==================== ANIMATION SETTINGS ====================

const ANIMATION_CONFIG = {
    // Animation durations in milliseconds
    fast: 200,
    normal: 300,
    slow: 500,
    
    // Enable/disable animations
    enabled: true,
    
    // Easing functions
    easing: 'ease-out'
};

// ==================== API ENDPOINTS (for future integration) ====================

const API_CONFIG = {
    // Base URL for API calls
    baseUrl: 'https://api.sandwi4.com',
    
    // Endpoints
    endpoints: {
        news: '/api/news',
        team: '/api/team',
        rules: '/api/rules',
        donations: '/api/donations',
        contact: '/api/contact',
        stats: '/api/stats'
    },
    
    // Timeouts
    timeout: 10000
};

// ==================== EMAIL CONFIGURATION ====================

const EMAIL_CONFIG = {
    // Email service (e.g., 'mailgun', 'sendgrid', 'custom')
    service: 'custom',
    
    // Sender email
    fromEmail: 'noreply@sandwi4.com',
    
    // Reply-to email
    replyToEmail: 'admin@sandwi4.com',
    
    // Email templates
    templates: {
        contactForm: {
            subject: 'New Contact Form Submission',
            to: 'admin@sandwi4.com'
        },
        donation: {
            subject: 'Thank You for Your Donation!',
            to: 'player@example.com'
        }
    }
};

// ==================== STORAGE CONFIGURATION ====================

const STORAGE_CONFIG = {
    // Storage type: 'localStorage', 'sessionStorage', 'indexedDB'
    type: 'localStorage',
    
    // Prefix for stored keys
    prefix: 'sandwi4_',
    
    // Auto-save interval (milliseconds)
    autoSaveInterval: 60000,
    
    // Enable data encryption (future feature)
    encryptData: false
};

// ==================== LOGGING CONFIGURATION ====================

const LOGGING_CONFIG = {
    // Enable detailed logging
    enabled: true,
    
    // Log level: 'error', 'warn', 'info', 'debug'
    level: 'info',
    
    // Log to console
    console: true,
    
    // Log to local storage (for debugging)
    storage: false,
    
    // Maximum logs to store
    maxLogs: 100
};

// ==================== EXPORT CONFIGURATION ====================

// Export all configurations for use in the application
const SANDWI4_CONFIG = {
    SERVER_IP,
    SERVER_STATUS,
    SERVER_STATUS_MESSAGE,
    SITE_CONFIG,
    TEAM_MEMBERS,
    SERVER_RULES,
    DONATION_PACKAGES,
    COLOR_SCHEME,
    ADMIN_CONFIG,
    FEATURES,
    INITIAL_NEWS,
    PAGINATION,
    ANIMATION_CONFIG,
    API_CONFIG,
    EMAIL_CONFIG,
    STORAGE_CONFIG,
    LOGGING_CONFIG
};

// Usage in your application:
// Import this configuration and use the values throughout your app
// Example: SANDWI4_CONFIG.SERVER_IP, SANDWI4_CONFIG.ADMIN_CONFIG.username

// ==================== CUSTOM FUNCTIONS ====================

/**
 * Load configuration from external JSON file (for future use)
 * Allows configuration without editing this file
 */
async function loadConfigFromFile(url) {
    try {
        const response = await fetch(url);
        const config = await response.json();
        Object.assign(SANDWI4_CONFIG, config);
        console.log('Configuration loaded from:', url);
    } catch (error) {
        console.error('Failed to load configuration:', error);
    }
}

/**
 * Validate configuration
 * Ensures all required fields are present
 */
function validateConfig() {
    const required = ['SERVER_IP', 'SITE_CONFIG', 'TEAM_MEMBERS', 'ADMIN_CONFIG'];
    for (const field of required) {
        if (!SANDWI4_CONFIG[field]) {
            console.warn(`Missing required configuration: ${field}`);
        }
    }
}

/**
 * Reset configuration to defaults
 */
function resetConfig() {
    localStorage.removeItem('sandwi4_newsData');
    localStorage.removeItem('sandwi4_teamData');
    localStorage.removeItem('sandwi4_rulesData');
    localStorage.removeItem('sandwi4_donationData');
    location.reload();
}

/**
 * Export current admin data
 */
function exportAdminData() {
    const data = {
        news: localStorage.getItem('newsData'),
        team: localStorage.getItem('teamData'),
        rules: localStorage.getItem('rulesData'),
        donations: localStorage.getItem('donationData'),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', `sandwi4-backup-${Date.now()}.json`);
    exportLink.click();
}

/**
 * Import admin data from backup
 */
function importAdminData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.news) localStorage.setItem('newsData', data.news);
            if (data.team) localStorage.setItem('teamData', data.team);
            if (data.rules) localStorage.setItem('rulesData', data.rules);
            if (data.donations) localStorage.setItem('donationData', data.donations);
            console.log('Data imported successfully');
            location.reload();
        } catch (error) {
            console.error('Failed to import data:', error);
        }
    };
    reader.readAsText(file);
}

/*
 * TO USE THIS CONFIGURATION FILE:
 * 
 * 1. Copy relevant values to the top of js/app.js
 * 2. Or integrate this file directly into your project
 * 3. Update values for your specific server
 * 4. Change ADMIN_CONFIG credentials immediately
 * 5. Validate configuration with validateConfig()
 * 
 * CUSTOMIZATION CHECKLIST:
 * ✓ Change SERVER_IP to your actual server address
 * ✓ Update SITE_CONFIG with your information
 * ✓ Update TEAM_MEMBERS with your staff
 * ✓ Update SERVER_RULES as needed
 * ✓ Update DONATION_PACKAGES with your prices
 * ✓ Change ADMIN_CONFIG credentials
 * ✓ Update contact information
 * ✓ Configure color scheme if desired
 * ✓ Enable/disable features as needed
 */
