document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------
       1. HAMBURGER / MOBILE DRAWER NAV
       ------------------------------------------------------------ */
    const hamburgerBtn = document.getElementById('hamburgerToggle');
    const navMenu = document.getElementById('navLinksMenu');
    const navLinks = document.querySelectorAll('.nav-item');

    const openMenu = () => {
        hamburgerBtn.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('mobile-active');
        document.body.classList.add('no-scroll');
    };

    const closeMenu = () => {
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('mobile-active');
        document.body.classList.remove('no-scroll');
    };

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.contains('mobile-active') ? closeMenu() : openMenu();
        });

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('mobile-active') &&
                !navMenu.contains(e.target) &&
                !hamburgerBtn.contains(e.target)) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            closeMenu();
        });
    });

    /* ------------------------------------------------------------
       2. HERO PHOTO STACK ROTATOR
       ------------------------------------------------------------ */
    const deckTrack = document.getElementById('heroDeckSlider');

    if (deckTrack) {
        const cards = Array.from(deckTrack.children);
        let currentIndex = 0;
        let autoplay;

        const updatePositions = () => {
            cards.forEach((card, i) => {
                card.classList.remove('pos-center', 'pos-left', 'pos-right', 'pos-hidden');
                let offset = i - currentIndex;

                if (offset < -Math.floor(cards.length / 2)) offset += cards.length;
                if (offset > Math.floor(cards.length / 2)) offset -= cards.length;

                if (offset === 0) card.classList.add('pos-center');
                else if (offset === 1) card.classList.add('pos-right');
                else if (offset === -1) card.classList.add('pos-left');
                else card.classList.add('pos-hidden');
            });
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updatePositions();
        };

        const startAutoplay = () => {
            clearInterval(autoplay);
            autoplay = setInterval(nextSlide, 3500);
        };

        updatePositions();
        startAutoplay();

        deckTrack.addEventListener('mouseenter', () => clearInterval(autoplay));
        deckTrack.addEventListener('mouseleave', startAutoplay);
    }

    /* ------------------------------------------------------------
       3. SCROLL REVEAL
       ------------------------------------------------------------ */
    const revealEls = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window && revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in-view'));
    }

    /* ------------------------------------------------------------
       4. ACTIVE NAV LINK ON SCROLL
       ------------------------------------------------------------ */
    const sections = document.querySelectorAll('main > section[id]');

    if ('IntersectionObserver' in window && sections.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => navObserver.observe(section));
    }
});