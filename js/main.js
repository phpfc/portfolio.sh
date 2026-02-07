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
    // ANCHOR SMOOTH SCROLL WITH OFFSET
    // ============================================
    const initAnchorSmoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') {
                    e.preventDefault();
                    if (window.smoothScrollSystem) {
                        window.smoothScrollSystem.scrollTo(0);
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 16;

                    if (window.smoothScrollSystem) {
                        window.smoothScrollSystem.scrollTo(targetPosition);
                    } else {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }

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

        const scrollThreshold = 50;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > scrollThreshold) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
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
    // SMOOTH INERTIA SCROLLING
    // ============================================
    const initSmoothInertiaScroll = () => {
        // Skip on touch devices - they have native smooth scrolling
        if ('ontouchstart' in window) return;

        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Configuration
        const SCROLL_SPEED = 1.2;       // Multiplier for scroll amount
        const SMOOTHNESS = 0.08;        // Lower = smoother (0.05 - 0.15 range)
        const MIN_DELTA = 0.5;          // Stop animating below this threshold

        let targetScroll = window.pageYOffset;
        let currentScroll = window.pageYOffset;
        let isAnimating = false;
        let rafId = null;

        // Disable native smooth scroll to avoid conflicts
        document.documentElement.style.scrollBehavior = 'auto';

        // Animation loop using lerp (linear interpolation)
        const animate = () => {
            const diff = targetScroll - currentScroll;

            // Stop if we're close enough
            if (Math.abs(diff) < MIN_DELTA) {
                currentScroll = targetScroll;
                window.scrollTo(0, currentScroll);
                isAnimating = false;
                return;
            }

            // Lerp towards target
            currentScroll += diff * SMOOTHNESS;
            window.scrollTo(0, currentScroll);

            rafId = requestAnimationFrame(animate);
        };

        // Start animation if not running
        const startAnimation = () => {
            if (!isAnimating) {
                isAnimating = true;
                rafId = requestAnimationFrame(animate);
            }
        };

        // Clamp target to document bounds
        const clampTarget = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
        };

        // Handle wheel events
        const handleWheel = (e) => {
            e.preventDefault();

            // Sync current position in case of external scroll changes
            if (!isAnimating) {
                currentScroll = window.pageYOffset;
            }

            // Add to target with speed multiplier
            // Normalize deltaY for consistent behavior across browsers/devices
            const delta = e.deltaMode === 1 ? e.deltaY * 20 : e.deltaY;
            targetScroll += delta * SCROLL_SPEED;

            clampTarget();
            startAnimation();
        };

        // Handle keyboard scroll
        const handleKeyboard = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            let delta = 0;
            const pageStep = window.innerHeight * 0.85;

            switch (e.key) {
                case 'ArrowDown':
                    delta = 100;
                    break;
                case 'ArrowUp':
                    delta = -100;
                    break;
                case 'PageDown':
                case ' ':
                    if (!e.shiftKey) delta = pageStep;
                    break;
                case 'PageUp':
                    delta = -pageStep;
                    break;
                default:
                    return;
            }

            if (delta !== 0) {
                e.preventDefault();

                if (!isAnimating) {
                    currentScroll = window.pageYOffset;
                }

                targetScroll += delta;
                clampTarget();
                startAnimation();
            }
        };

        // Sync on resize
        const handleResize = () => {
            clampTarget();
        };

        // Allow programmatic scrollTo to work
        const originalScrollTo = window.scrollTo.bind(window);
        window.smoothScrollTo = (y, instant = false) => {
            if (instant) {
                if (rafId) cancelAnimationFrame(rafId);
                isAnimating = false;
                currentScroll = y;
                targetScroll = y;
                originalScrollTo(0, y);
            } else {
                targetScroll = y;
                clampTarget();
                startAnimation();
            }
        };

        // Listen for wheel with passive: false to allow preventDefault
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeyboard);
        window.addEventListener('resize', handleResize);

        // Expose for other modules
        window.smoothScrollSystem = {
            scrollTo: (y) => {
                targetScroll = y;
                clampTarget();
                if (!isAnimating) {
                    currentScroll = window.pageYOffset;
                }
                startAnimation();
            },
            stop: () => {
                if (rafId) cancelAnimationFrame(rafId);
                isAnimating = false;
                targetScroll = window.pageYOffset;
                currentScroll = window.pageYOffset;
            }
        };
    };

    // ============================================
    // SCROLL HELPERS WITH EDGE SNAPPING
    // ============================================
    const initScrollHelpers = () => {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const heroSection = document.querySelector('.hero');
        if (heroSection) sections.unshift(heroSection);

        if (sections.length === 0) return;

        // Configuration
        const MAGNETIC_ZONE = 250; // px - snap when within this distance of section top
        const SCROLL_IDLE_DELAY = 150; // ms to wait after scroll stops

        const navHeight = () => document.querySelector('.nav')?.offsetHeight || 64;

        let isSnapping = false;
        let scrollTimeout = null;

        // Create scroll-to-top button
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-to-top';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        scrollTopBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15"/>
            </svg>
        `;
        document.body.appendChild(scrollTopBtn);

        // Create scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        // Create section navigation dots
        const dotsContainer = document.createElement('nav');
        dotsContainer.className = 'section-dots';
        dotsContainer.setAttribute('aria-label', 'Section navigation');

        sections.forEach((section, index) => {
            const dot = document.createElement('button');
            dot.className = 'section-dot';
            const sectionId = section.id || 'hero';
            const sectionName = section.id ?
                section.id.charAt(0).toUpperCase() + section.id.slice(1) :
                'Home';
            dot.setAttribute('aria-label', `Go to ${sectionName}`);
            dot.setAttribute('data-section', sectionId);

            dot.addEventListener('click', () => {
                scrollToSection(index);
            });

            dotsContainer.appendChild(dot);
        });
        document.body.appendChild(dotsContainer);

        // Get the scroll target position for a section
        const getSectionTop = (index) => {
            const section = sections[index];
            if (!section) return null;

            const offset = section.classList.contains('hero') ? 0 : navHeight() + 16;
            return section.offsetTop - offset;
        };

        // Scroll to section helper
        const scrollToSection = (index) => {
            const targetTop = getSectionTop(index);
            if (targetTop === null) return;

            isSnapping = true;

            // Use smooth scroll system if available, otherwise fallback
            if (window.smoothScrollSystem) {
                window.smoothScrollSystem.scrollTo(targetTop);
            } else {
                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });
            }

            // Reset snapping flag after animation completes
            setTimeout(() => {
                isSnapping = false;
            }, 800);
        };

        // Find if we're in a magnetic zone near any section top
        const findMagneticTarget = () => {
            const scrollY = window.pageYOffset;

            for (let i = 0; i < sections.length; i++) {
                const sectionTop = getSectionTop(i);
                if (sectionTop === null) continue;

                const distance = Math.abs(scrollY - sectionTop);

                // If within magnetic zone, snap to this section
                if (distance > 0 && distance <= MAGNETIC_ZONE) {
                    return { index: i, top: sectionTop };
                }
            }

            return null;
        };

        // Handle scroll end - check for magnetic snapping
        const handleScrollEnd = () => {
            if (isSnapping) return;

            // Respect reduced motion preference
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return;

            const target = findMagneticTarget();
            if (target) {
                scrollToSection(target.index);
            }
        };

        // Get current section index for dot highlighting
        const getCurrentSectionIndex = () => {
            const scrollPosition = window.pageYOffset + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
                const sectionTop = getSectionTop(i);
                if (sectionTop !== null && scrollPosition >= sectionTop) {
                    return i;
                }
            }
            return 0;
        };

        // Update active dot
        const updateActiveDot = () => {
            const currentIndex = getCurrentSectionIndex();
            const dots = dotsContainer.querySelectorAll('.section-dot');

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        // Update scroll progress
        const updateScrollProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        };

        // Show/hide scroll-to-top button
        const updateScrollTopButton = () => {
            const scrollTop = window.pageYOffset;
            scrollTopBtn.classList.toggle('visible', scrollTop > 400);
        };

        // Scroll-to-top click handler
        scrollTopBtn.addEventListener('click', () => {
            scrollToSection(0);
        });

        // Keyboard navigation for section jumping (Home/End only)
        // Arrow keys and Page keys are handled by smooth scroll system
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const currentIndex = getCurrentSectionIndex();

            if (e.key === 'Home') {
                e.preventDefault();
                scrollToSection(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                scrollToSection(sections.length - 1);
            }
        });

        // Scroll event handler
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            // Clear existing timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            if (!scrollTicking) {
                window.requestAnimationFrame(() => {
                    updateActiveDot();
                    updateScrollProgress();
                    updateScrollTopButton();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }

            // Schedule magnetic snap check after scroll stops
            scrollTimeout = setTimeout(handleScrollEnd, SCROLL_IDLE_DELAY);
        });

        // Initial state
        updateActiveDot();
        updateScrollProgress();
        updateScrollTopButton();
    };

    // ============================================
    // PARALLAX EFFECT FOR BACKLIGHT ORBS
    // ============================================
    const initParallax = () => {
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;

                    sections.forEach(section => {
                        const rect = section.getBoundingClientRect();
                        const sectionTop = rect.top + scrolled;
                        const sectionHeight = rect.height;

                        // Only apply parallax when section is in viewport
                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            const relativeScroll = scrolled - sectionTop;
                            const parallaxAmount = relativeScroll * 0.15; // Very subtle

                            // Apply to pseudo-elements via CSS custom property
                            section.style.setProperty('--parallax-y', `${parallaxAmount}px`);
                        }
                    });

                    ticking = false;
                });

                ticking = true;
            }
        });
    };

    // ============================================
    // THEME TOGGLE
    // ============================================
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        }

        // Toggle theme on button click
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        });
    };

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
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
        initSmoothInertiaScroll();
        initAnchorSmoothScroll();
        initActiveNav();
        initNavScroll();
        initScrollAnimations();
        initExternalLinks();
        initKeyboardNav();
        initParallax();
        initScrollHelpers();
        respectReducedMotion();
        initThemeToggle();

        // Initialize language module if available
        if (window.LanguageModule) {
            window.LanguageModule.init();
        }

        // Log initialization (remove in production)
        console.log('Portfolio initialized');
    };

    // Start initialization
    init();

})();
