# Sandwi4 SMP Website - Deployment Guide

Complete instructions for deploying the website to various hosting platforms.

## Quick Deployment Checklist

- [ ] Verify all files are in correct directories
- [ ] Test locally in browser first
- [ ] Update server IP address
- [ ] Change admin credentials
- [ ] Test all pages and links
- [ ] Test admin panel
- [ ] Enable HTTPS
- [ ] Set up domain

## Platform-Specific Guides

### 1. GitHub Pages (Recommended for Free Hosting)

#### Setup
1. Create a GitHub account (if you don't have one)
2. Create a new repository named `sandwi4-smp` (or your preferred name)
3. Clone the repository to your local machine
4. Copy all website files to the cloned directory
5. Commit and push files:
   ```bash
   git add .
   git commit -m "Initial website deployment"
   git push origin main
   ```

#### Configuration
1. Go to repository Settings
2. Navigate to Pages section
3. Select "Deploy from a branch"
4. Choose `main` branch and `/root` folder
5. Your site will be live at: `https://username.github.io/sandwi4-smp`

#### Custom Domain
1. In Pages settings, enter your domain (e.g., `sandwi4.com`)
2. Update your domain's DNS settings:
   - Add A records pointing to GitHub's IP addresses
   - Or use GitHub's CNAME record
3. Enable HTTPS enforcement

#### File Structure for GitHub Pages
```
repository/
├── index.html
├── admin.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── pages/
    ├── about.html
    ├── rules.html
    ├── team.html
    ├── donate.html
    └── contacts.html
```

### 2. Traditional Web Hosting (cPanel)

#### FTP Upload
1. Connect to your hosting via FTP client (FileZilla, etc.)
2. Use credentials provided by your hosting company
3. Upload all files to `public_html` folder:
   ```
   public_html/
   ├── index.html
   ├── admin.html
   ├── .htaccess
   ├── css/
   ├── js/
   └── pages/
   ```
4. Ensure proper permissions:
   - Files: 644
   - Directories: 755

#### cPanel Configuration
1. Go to cPanel dashboard
2. Enable Mod Rewrite in Apache Modules (if needed)
3. For .htaccess support:
   - Ensure AllowOverride is enabled
   - File should be readable by server
4. Set up SSL certificate:
   - Go to AutoSSL or Let's Encrypt
   - Enable free SSL certificate
   - Force HTTPS redirect

#### Domain Setup
1. In cPanel > Addon Domains
2. Add your domain pointing to `public_html`
3. Configure DNS records if needed

#### URL Rewriting
The included `.htaccess` file handles:
- Admin panel routing (`/admin` → `admin.html`)
- Gzip compression
- Cache control
- Security headers

### 3. Netlify

#### Method 1: GitHub Integration
1. Sign in to Netlify
2. Click "New site from Git"
3. Connect GitHub account
4. Select repository
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
6. Deploy

#### Method 2: Drag and Drop
1. Create a folder with all website files
2. Go to Netlify
3. Drag and drop folder to deploy
4. Site goes live immediately

#### Configuration
1. Go to Site settings
2. Set custom domain
3. Enable HTTPS (automatic)
4. Configure redirects in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/admin"
     to = "/admin.html"
     status = 200
   ```

### 4. Vercel

#### Setup
1. Push files to GitHub
2. Go to Vercel dashboard
3. Click "New Project"
4. Import GitHub repository
5. Deploy

#### Configuration
1. Create `vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/admin", "destination": "/admin.html" }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "X-Content-Type-Options", "value": "nosniff" },
           { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
         ]
       }
     ]
   }
   ```
2. Add to repository and redeploy

### 5. AWS S3 + CloudFront

#### S3 Setup
1. Create new S3 bucket
2. Upload all files
3. Enable static website hosting:
   - Index document: `index.html`
   - Error document: `index.html`
4. Set permissions:
   - Enable public read access
   - Create bucket policy for public access

#### CloudFront Distribution
1. Create new CloudFront distribution
2. Set S3 bucket as origin
3. Configure behaviors:
   - Path pattern: `/admin`
   - Forward to: `admin.html`
4. Enable HTTPS
5. Set custom domain

### 6. Docker Deployment

#### Dockerfile
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY .htaccess /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3'
services:
  web:
    image: nginx:alpine
    volumes:
      - ./:/usr/share/nginx/html
    ports:
      - "80:80"
    environment:
      NGINX_HOST: sandwi4.com
      NGINX_PORT: 80
```

#### Deploy
```bash
docker build -t sandwi4-smp .
docker run -p 80:80 sandwi4-smp
```

## Pre-Deployment Checklist

### Content Updates
- [ ] Update server IP address
- [ ] Verify all contact information
- [ ] Check Discord server link
- [ ] Verify team members list
- [ ] Confirm donation packages and prices

### Security
- [ ] Change admin username and password
- [ ] Review .htaccess for security headers
- [ ] Enable HTTPS
- [ ] Set Content-Security-Policy headers
- [ ] Check for exposed sensitive information

### Testing
- [ ] Test all pages load correctly
- [ ] Verify responsive design on mobile
- [ ] Test admin panel login
- [ ] Test admin panel functionality
- [ ] Verify all links work
- [ ] Test contact form
- [ ] Check navigation menu
- [ ] Test copy IP button
- [ ] Verify animations work

### Performance
- [ ] Test page load speed
- [ ] Verify CSS and JS files load
- [ ] Check browser console for errors
- [ ] Test on multiple browsers
- [ ] Test on mobile devices

## Post-Deployment

### Monitoring
1. Set up Google Analytics
2. Enable error tracking
3. Monitor page performance
4. Check server logs regularly

### Updates
1. Keep admin credentials secure
2. Regularly update content
3. Monitor localStorage usage
4. Back up admin data periodically

### Optimization
1. Monitor page load times
2. Optimize images if needed
3. Review and update caching strategy
4. Monitor admin panel usage

## SSL Certificate Setup

### Let's Encrypt (Automatic)
Most modern hosting includes auto-SSL:
1. cPanel: AutoSSL or Let's Encrypt
2. Netlify: Automatic
3. Vercel: Automatic
4. GitHub Pages: Automatic

### Manual Setup
1. Generate SSL certificate
2. Upload to server
3. Configure web server
4. Force HTTPS redirect

## Domain Configuration

### DNS Records
For custom domain, set these DNS records:
```
Type: A
Name: @
Value: [Your hosting IP]

Type: A
Name: www
Value: [Your hosting IP]

Type: MX (if using email)
Name: @
Value: [Your email provider]
```

### Subdomain Setup
To use `www.sandwi4.com`:
```
Type: CNAME
Name: www
Value: sandwi4.com
```

## Troubleshooting

### 404 Errors
- Verify file names and paths
- Check .htaccess configuration
- Ensure proper URL rewriting
- Verify directory permissions

### Admin Panel Not Working
- Check localStorage is enabled
- Verify JavaScript is enabled
- Check browser console for errors
- Ensure admin.html is at root level

### Styling Not Appearing
- Clear browser cache
- Check CSS file path
- Verify CSS file uploaded
- Check file permissions

### Images Not Loading
- Verify image paths are correct
- Check file permissions
- Ensure images are uploaded
- Check server MIME types

## Rollback Procedure

If deployment has issues:
1. Keep backup of previous version
2. Revert files via FTP or Git
3. Test before going live
4. Keep version history

## Performance Tips

1. **Caching**
   - Enable browser caching
   - Set Cache-Control headers
   - Use CDN for static files

2. **Compression**
   - Enable gzip compression
   - Minify CSS and JS (optional)
   - Optimize images

3. **Monitoring**
   - Use Google PageSpeed Insights
   - Check with GTmetrix
   - Monitor Core Web Vitals

## Support

For deployment issues:
- Check platform documentation
- Review error logs
- Test locally first
- Contact hosting support

---

**Last Updated**: May 2026
**Version**: 1.0.0
