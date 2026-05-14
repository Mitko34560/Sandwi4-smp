# Sandwi4 SMP Website - Quick Start Guide

Get your Minecraft SMP website live in minutes!

## 5-Minute Setup

### Step 1: Download Files
1. Download all files from the package
2. Keep the folder structure intact:
   ```
   sandwi4-smp/
   ├── index.html
   ├── admin.html
   ├── css/styles.css
   ├── js/app.js
   └── pages/
   ```

### Step 2: Customize Content
Edit `index.html` and update:
- Server IP address (line ~170): Change `sandwi4.example.com`
- Discord link (footer): Change `sandwi4.gg`
- Email address (footer): Change `admin@sandwi4.com`

### Step 3: Test Locally
1. Open `index.html` in your browser
2. Test all pages work
3. Test admin panel at `admin.html`
4. Default login: `admin` / `sandwi4admin`

### Step 4: Change Admin Password
1. Open `js/app.js`
2. Find the `adminLogin()` function (around line 255)
3. Change credentials:
   ```javascript
   if (username === 'YOUR_USERNAME' && password === 'YOUR_PASSWORD') {
   ```
4. Save file

### Step 5: Deploy
Choose your preferred platform:

**GitHub Pages** (Easiest, Free)
1. Create GitHub account
2. Upload files to repository
3. Enable GitHub Pages in settings
4. Done! Site is live

**Traditional Hosting** (cPanel)
1. Connect via FTP
2. Upload files to `public_html`
3. Upload `.htaccess` file
4. Done! Site is live

**Netlify** (Simple, Free)
1. Create Netlify account
2. Connect GitHub repository
3. Deploy with one click
4. Done! Site is live

## Key Features Overview

### Pages
- **Home**: Server showcase and latest news
- **About**: Server mission and features
- **Rules**: Server rules management
- **Team**: Staff roster
- **Donate**: Donation packages
- **Contacts**: Contact information and form
- **Admin**: Hidden admin panel

### Admin Panel Features
Access at `/admin.html` or `/admin`

Login and manage:
- News and announcements
- Server status
- Team members
- Server rules
- Donation packages

All changes saved automatically to browser!

## Customization Quick Tips

### Change Colors
Edit `css/styles.css`, top section:
```css
:root {
    --primary-color: #1aa700;      /* Main green */
    --secondary-color: #ff6b35;    /* Orange accent */
    --accent-color: #ffd700;       /* Gold accent */
}
```

### Change Team Members
Edit `js/app.js` around line 20:
```javascript
let teamData = [
    { name: 'YOUR_NAME', role: 'Owner', desc: 'Your role', avatar: 'Y' },
];
```

### Change Donation Packages
Edit `js/app.js` around line 45:
```javascript
let donationData = [
    { name: 'Your Package', price: '$X.99', features: ['Feature 1', 'Feature 2'] },
];
```

### Change Server Rules
Edit `js/app.js` around line 65:
```javascript
let rulesData = [
    { title: 'Your Rule', content: 'Your rule description' },
];
```

## Admin Panel Guide

### Login
1. Open `admin.html` in your browser
2. Default credentials:
   - Username: `admin`
   - Password: `sandwi4admin`
3. **IMPORTANT**: Change these immediately!

### News Section
- Add news articles with date and category
- Edit or delete existing news
- Changes appear on home page immediately

### Server Status
- Update online/offline status
- Set custom status message
- Changes persist across sessions

### Team Management
- Add new team members
- Assign roles (Owner, Admin, Helper)
- Add member descriptions
- Delete members

### Rules Management
- Add new server rules
- Delete rules
- Reorder rules (delete and re-add)

### Donation Management
- Create new packages
- Set prices and features
- Delete packages
- Popular badge auto-applied to second package

## Browser Testing

Test in these browsers:
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile Safari (Latest)
- Chrome Mobile

## Deployment Comparison

| Platform | Cost | Ease | Domain | SSL |
|----------|------|------|--------|-----|
| GitHub Pages | Free | Very Easy | Free | Yes |
| Netlify | Free | Easy | Free | Yes |
| Vercel | Free | Easy | Free | Yes |
| Traditional Hosting | $$ | Medium | Yes | Usually |
| AWS | Pay-as-you-go | Complex | Yes | Yes |

## Common Tasks

### Change Logo Text
Edit `index.html` line ~20:
```html
<span class="logo-text">Sandwi4</span>
<span class="logo-smp">SMP</span>
```

### Update Server IP
Edit `index.html` line ~170:
```javascript
const ip = 'your-server-ip.com';
```

### Change Page Title
Edit `<title>` tag in each HTML file

### Add Social Links
Edit team member's social icons in team page

### Update Footer
Edit footer section in all pages

## Troubleshooting

**Admin panel login not working?**
- Clear browser cache (Ctrl+F5)
- Ensure JavaScript is enabled
- Check credentials in admin login form

**Pages not loading correctly?**
- Check file paths are correct
- Verify CSS and JS files are loading
- Open browser console (F12) for errors

**Changes not saving?**
- Ensure localStorage is enabled
- Not available in private browsing
- Some browsers restrict in incognito mode

**Styling looks wrong?**
- Clear browser cache completely
- Try different browser
- Check CSS file is uploaded
- Verify file permissions

**Mobile menu not working?**
- JavaScript must be enabled
- Try clearing browser cache
- Test on different mobile browser

## Next Steps

1. ✅ Test website locally
2. ✅ Customize content
3. ✅ Change admin credentials
4. ✅ Choose hosting platform
5. ✅ Deploy website
6. ✅ Set up custom domain
7. ✅ Share with your community!

## Getting Help

### Resources
- See `README.md` for complete documentation
- See `DEPLOYMENT.md` for deployment guides
- Check `js/app.js` for all available features
- Review `css/styles.css` for styling

### Common Questions

**Q: Can I run this without internet?**
A: Yes! Works offline. Just open index.html locally.

**Q: Is there a database included?**
A: No, uses browser localStorage. Perfect for small communities.

**Q: Can I use this with a Minecraft server plugin?**
A: This is a website only. Integrate with your server plugin separately.

**Q: How do I make donations actually work?**
A: Connect to a payment processor like PayPal in the donation buttons.

**Q: Can I host this on my own server?**
A: Yes! Upload to any web hosting or self-hosted server.

**Q: How often should I update content?**
A: Update news weekly, team info as needed, rules when changed.

## Pro Tips

1. **Backup Your Data**: Periodically export admin data
2. **Keep It Updated**: Add news regularly to keep site fresh
3. **Monitor Analytics**: Use Google Analytics to track visitors
4. **Engage Community**: Link to Discord and other platforms
5. **Mobile First**: Always test on mobile devices
6. **Keep Contact Info**: Make it easy for players to reach you

## Security Reminders

- Change admin credentials immediately
- Don't share login credentials
- Disable admin access if not in use
- Regularly review server logs
- Keep backups of admin data
- Use HTTPS when deployed

## Performance Checklist

- ✅ Page loads quickly
- ✅ Mobile responsive
- ✅ Animations smooth
- ✅ No console errors
- ✅ All links working
- ✅ Forms functional
- ✅ Admin panel responsive
- ✅ Images optimized

## What's Included

- ✅ 6 public pages
- ✅ Hidden admin panel
- ✅ Full data management
- ✅ Responsive design
- ✅ Dark theme
- ✅ Animations
- ✅ Forms
- ✅ Mobile menu
- ✅ Footer
- ✅ Analytics ready

## What You Need to Add

- 🔧 Payment gateway (for donations)
- 🔧 Email service (for contact form)
- 🔧 Discord bot (optional)
- 🔧 Google Analytics (optional)
- 🔧 Custom domain name
- 🔧 Server hosting

## Ready to Launch?

1. Customize your content
2. Test everything works
3. Deploy to your chosen platform
4. Share with your community
5. Watch it grow!

---

**Questions?** Check the README.md or DEPLOYMENT.md files for more detailed information.

**Good luck with your Sandwi4 SMP community!**

Last Updated: May 2026
