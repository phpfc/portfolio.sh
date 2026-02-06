/**
 * MODERN PORTFOLIO - MAIN JAVASCRIPT
 * Smooth interactions, mobile menu, and navigation enhancements
 */

(function() {
    'use strict';

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    const initMobileNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = navMenu.querySelectorAll('.nav-link');

        if (!navToggle || !navMenu) return;

        // Toggle mobile menu
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');

            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            if (!isExpanded) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');

                // Reset hamburger icon
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');

                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    };

    // ============================================
    // SMOOTH SCROLL WITH OFFSET
    // ============================================
    const initSmoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 16;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without triggering scroll
                    history.pushState(null, null, href);
                }
            });
        });
    };

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const initActiveNav = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (sections.length === 0 || navLinks.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');

                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    };

    // ============================================
    // NAV BACKGROUND ON SCROLL
    // ============================================
    const initNavScroll = () => {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > scrollThreshold) {
                nav.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            } else {
                nav.style.backgroundColor = 'rgba(10, 10, 10, 0.85)';
            }

            lastScroll = currentScroll;
        });
    };

    // ============================================
    // FADE IN ON SCROLL ANIMATION
    // ============================================
    const initScrollAnimations = () => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should fade in
        const animatedElements = document.querySelectorAll(
            '.timeline-item, .project-card, .article-card, .education-item'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };

    // ============================================
    // EXTERNAL LINK SECURITY
    // ============================================
    const initExternalLinks = () => {
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(link => {
            if (!link.hasAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    };

    // ============================================
    // KEYBOARD NAVIGATION IMPROVEMENTS
    // ============================================
    const initKeyboardNav = () => {
        // Add visible focus styles for keyboard users
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    };

    // ============================================
    // PERFORMANCE: REDUCE MOTION FOR ACCESSIBILITY
    // ============================================
    const respectReducedMotion = () => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            document.documentElement.style.scrollBehavior = 'auto';

            // Disable scroll animations
            const animatedElements = document.querySelectorAll(
                '.timeline-item, .project-card, .article-card'
            );
            animatedElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }
    };

    // ============================================
    // INITIALIZE ALL
    // ============================================
    const init = () => {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize all modules
        initMobileNav();
        initSmoothScroll();
        initActiveNav();
        initNavScroll();
        initScrollAnimations();
        initExternalLinks();
        initKeyboardNav();
        respectReducedMotion();

        // Log initialization (remove in production)
        console.log('Portfolio initialized');
    };

    // Start initialization
    init();

    // ============================================
    // MOBILE MENU STYLES (INJECTED)
    // ============================================
    const injectMobileMenuStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 767px) {
                .nav-menu {
                    position: fixed;
                    top: var(--nav-height);
                    left: 0;
                    right: 0;
                    background-color: rgba(10, 10, 10, 0.98);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--color-border);
                    padding: var(--space-lg);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                    transform: translateY(-100%);
                    opacity: 0;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                    pointer-events: none;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }

                .nav-menu.active {
                    transform: translateY(0);
                    opacity: 1;
                    pointer-events: all;
                }

                .nav-menu li {
                    text-align: center;
                }

                .nav-link {
                    font-size: var(--text-base);
                    display: block;
                    padding: var(--space-sm);
                }

                body.nav-open {
                    overflow: hidden;
                }
            }

            /* Keyboard navigation focus styles */
            body.keyboard-nav *:focus {
                outline: 2px solid var(--color-accent);
                outline-offset: 2px;
            }

            body:not(.keyboard-nav) *:focus {
                outline: none;
            }

            /* Active nav link indicator */
            .nav-link.active {
                color: var(--color-accent);
            }
        `;
        document.head.appendChild(style);
    };

    injectMobileMenuStyles();

})();
