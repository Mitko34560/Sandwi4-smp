document.addEventListener('DOMContentLoaded', () => {
    // --- SERVER IP CONFIGURATION ---
    const SERVER_IP = 'mc.sandwi4smp.xyz';

    // --- MOBILE MENU TOGGLE ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('open');
            mainNav.classList.toggle('open');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('open');
                mainNav.classList.remove('open');
            });
        });
    }

    // --- ACTIVE NAV LINK ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset for fixed header
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);

    // --- COPY IP TO CLIPBOARD ---
    const btnCopyIp = document.getElementById('btn-copy-ip');
    const serverIpText = document.getElementById('server-ip-text');
    const copyTooltip = document.getElementById('copy-tooltip');

    if (btnCopyIp && serverIpText && copyTooltip) {
        // Set actual IP text dynamically
        serverIpText.textContent = SERVER_IP;

        btnCopyIp.addEventListener('click', () => {
            navigator.clipboard.writeText(SERVER_IP).then(() => {
                // Success feedback
                copyTooltip.textContent = 'Копирано!';
                copyTooltip.style.opacity = '1';
                copyTooltip.style.visibility = 'visible';
                copyTooltip.style.transform = 'translateX(-50%) translateY(0)';
                
                btnCopyIp.classList.add('copied');

                // Reset feedback after 2 seconds
                setTimeout(() => {
                    copyTooltip.textContent = 'Копирай IP';
                    copyTooltip.style.opacity = '';
                    copyTooltip.style.visibility = '';
                    copyTooltip.style.transform = '';
                    btnCopyIp.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Could not copy IP: ', err);
                copyTooltip.textContent = 'Грешка!';
            });
        });
    }

    // --- ACCORDION FOR RULES ---
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const parent = trigger.parentElement;
            const isCurrentlyActive = parent.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                const btn = item.querySelector('.accordion-trigger');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            // Toggle active item
            if (!isCurrentlyActive) {
                parent.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- MINECRAFT SERVER STATUS CHECKER ---
    const statusDot = document.getElementById('status-indicator-dot');
    const statusText = document.getElementById('status-indicator-text');

    async function updateServerStatus() {
        if (!statusDot || !statusText) return;

        try {
            // Using public Minecraft Server Status API
            const response = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
            
            if (!response.ok) throw new Error('API response not OK');
            
            const data = await response.json();

            if (data.online) {
                statusDot.className = 'status-dot online';
                
                // Pluralization check for Bulgarian language
                const onlinePlayers = data.players.online;
                let playerText = 'играча';
                if (onlinePlayers === 1) {
                    playerText = 'играч';
                }
                
                statusText.innerHTML = `ОНЛАЙН: <strong style="color: var(--primary);">${onlinePlayers}</strong> ${playerText} на линия`;
            } else {
                statusDot.className = 'status-dot';
                statusText.textContent = 'СЪРВЪРЪТ Е ОФЛАЙН';
            }
        } catch (error) {
            console.warn('Status API failed, falling back to active check status.', error);
            // Fallback: Show as active/online server but player count hidden
            statusDot.className = 'status-dot online';
            statusText.innerHTML = `СЪРВЪРЪТ Е АКТИВЕН (mc.sandwi4smp.xyz)`;
        }
    }

    // Run status update on load
    updateServerStatus();
    
    // Auto refresh status every 60 seconds
    setInterval(updateServerStatus, 60000);
});
