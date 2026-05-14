# Sandwi4 SMP Website

A complete, modern, and fully functional Minecraft SMP server website built with HTML, CSS, and JavaScript. Professional design with animations, responsive layout, and a hidden admin panel for managing server content.

## Features

### Public Website
- **Home Page**: Hero section, features showcase, latest news, server statistics, and call-to-action
- **About Page**: Server mission, features, and history
- **Rules Page**: Complete server rules with dynamic management
- **Team Page**: Server staff organized by role (Owners, Admins, Helpers)
- **Donate Page**: Donation packages with exclusive privileges
- **Contacts Page**: Contact information and message form

### Design & UX
- Modern dark theme with Minecraft aesthetic
- Smooth animations and transitions
- Fully responsive design (mobile, tablet, desktop)
- Custom fonts with professional typography
- Gradient effects and modern card design
- Hover effects and interactive elements
- Animated counters and floating elements

### Hidden Admin Panel
- Secure login system at `/admin.html`
- Manage news and announcements
- Update server status
- Manage team members
- Manage server rules
- Manage donation packages
- All data persisted to browser localStorage

## File Structure

```
sandwi4-smp-website/
├── index.html              # Home page
├── admin.html              # Admin panel (access point)
├── css/
│   └── styles.css          # All styling (2000+ lines)
├── js/
│   └── app.js              # All functionality
├── pages/
│   ├── about.html          # About page
│   ├── rules.html          # Rules page
│   ├── team.html           # Team page
│   ├── donate.html         # Donation page
│   └── contacts.html       # Contacts page
└── README.md               # This file
```

## Getting Started

### Local Development

1. Clone or download the repository
2. Open `index.html` in your web browser
3. No server setup required - works entirely in the browser

### Accessing Admin Panel

1. Go to `admin.html` (or navigate to `/admin` if deployed)
2. Login with default credentials:
   - **Username**: `admin`
   - **Password**: `sandwi4admin`
3. Change these credentials in production!

## Admin Panel Features

### News Management
- Add new news articles with date and category
- View all existing news
- Edit or delete news articles

### Server Status
- Update server online/offline status
- Set custom status messages

### Team Management
- Add new team members
- Assign roles (Owner, Admin, Helper)
- Delete team members

### Rules Management
- Add new server rules
- Delete existing rules
- Organize rules by priority

### Donation Packages
- Create new donation packages
- Set prices and features
- Delete packages

## Customization

### Team Members
Edit `js/app.js` to change team members:
```javascript
let teamData = [
    { id: 1, name: 'MitachetoTW', role: 'Owner', desc: 'Founder and Lead Developer', avatar: 'O' },
    { id: 2, name: 'Kraskata1407', role: 'Owner', desc: 'Server Manager', avatar: 'K' },
    // Add more members...
];
```

### Server IP
Change the IP address in `index.html` (line with "sandwi4.example.com") to your actual server IP.

### Colors & Theme
Edit CSS variables at the top of `css/styles.css`:
```css
:root {
    --primary-color: #1aa700;
    --secondary-color: #ff6b35;
    --accent-color: #ffd700;
    /* ... more colors ... */
}
```

### Admin Credentials
Change in `js/app.js` function `adminLogin()`:
```javascript
if (username === 'YOUR_USERNAME' && password === 'YOUR_PASSWORD') {
    // Allow login
}
```

## Deployment

### GitHub Pages
1. Create a new repository
2. Push all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch"
5. Choose `main` branch and `/root` folder
6. Your site will be live at `https://yourusername.github.io/repository-name/`

### Traditional Hosting (cPanel, etc.)
1. Upload all files via FTP
2. Ensure `.htaccess` is properly configured for URL routing
3. Create a `.htaccess` file with:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^admin/?$ admin.html [L]
    RewriteRule ^pages/(.+)/?$ pages/$1.html [L]
</IfModule>
```

### Shared Hosting
- Most standard hostings work out of the box
- Ensure JavaScript is enabled
- LocalStorage should be accessible

## Features Explained

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Flexible grid layouts
- Touch-friendly buttons

### Animations
- Page load animations
- Hover effects on cards
- Smooth transitions
- Animated counters
- Floating elements

### Data Persistence
- All admin changes saved to browser localStorage
- Data persists across sessions
- No database required
- Perfect for small to medium communities

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance
- Optimized CSS and JavaScript
- No external dependencies
- Fast load times
- Smooth 60fps animations

## Security Notes
- Admin credentials are stored in code (change for production)
- Consider using proper authentication system
- LocalStorage is not encrypted
- For sensitive data, use server-side storage

## Customization Guide

### Adding a New Page
1. Create new HTML file in `pages/` folder
2. Copy structure from existing page
3. Add link to navbar
4. Update `js/app.js` if needed

### Changing Colors
All colors are defined as CSS variables in `styles.css`:
- Primary Green: `#1aa700`
- Secondary Orange: `#ff6b35`
- Accent Gold: `#ffd700`

### Modifying Animations
Animation definitions start around line 200 in `styles.css`:
```css
@keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-50px); }
    to { opacity: 1; transform: translateX(0); }
}
```

## Troubleshooting

### Admin Panel Not Loading
- Clear browser cache
- Check if JavaScript is enabled
- Verify `admin.html` is in root directory

### Styles Not Applied
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check CSS file path
- Verify CSS file is not blocked

### Mobile Menu Not Working
- JavaScript must be enabled
- Check browser compatibility

### Data Not Saving
- Ensure localStorage is enabled
- Check browser's storage settings
- Some browsers restrict localStorage in private mode

## Future Enhancements
- Server-side database integration
- Email notifications for messages
- Payment gateway integration
- Discord bot integration
- Mobile app
- Multi-language support

## License
Free to use and modify for your Minecraft server.

## Credits
Designed and built with attention to modern web design principles and Minecraft aesthetics.

## Support
For questions or issues with the website, contact the development team through the Contacts page.

---

**Last Updated**: May 2026
**Version**: 1.0.0
**Status**: Production Ready
