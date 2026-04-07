/* ============================================
   Prime Clinical Nursing — Interactive Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar scroll effect ──
    const navbar = document.getElementById('navbar');
    const hero = document.querySelector('.hero'); // Check if page has a dark hero
    const observeScroll = () => {
        if (!hero) {
            navbar.classList.add('scrolled'); // Force solid navbar on subpages
        } else {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }
    };
    window.addEventListener('scroll', observeScroll, { passive: true });
    observeScroll();

    // ── Mobile nav toggle ──
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile nav on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ── Hero particles ──
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.classList.add('hero-particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (8 + Math.random() * 12) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
            particlesContainer.appendChild(particle);
        }
    }

    // ── Stat counter animation ──
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    let statsCounted = false;

    const countUp = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const tick = () => {
            current += step;
            if (current >= target) {
                el.textContent = target;
                return;
            }
            el.textContent = Math.floor(current);
            requestAnimationFrame(tick);
        };
        tick();
    };

    // ── Scroll-triggered reveal ──
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger reveals slightly
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // Stat counter observer
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsCounted) {
                statsCounted = true;
                statNumbers.forEach(el => countUp(el));
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // ── FAQ Accordion ──
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked if it was closed
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ── Contact Form ──
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate submit
            const btn = document.getElementById('submitBtn');
            btn.disabled = true;
            btn.innerHTML = '<span>Sending...</span>';

            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.classList.add('show');
            }, 1200);
        });
    }

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
