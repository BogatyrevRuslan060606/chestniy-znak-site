document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // THEME TOGGLE
    // ============================================
    var themeToggle = document.getElementById('themeToggle');
    var root = document.documentElement;

    function getPreferredTheme() {
        var saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
    }

    applyTheme(getPreferredTheme());

    themeToggle.addEventListener('click', function () {
        var current = root.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });

    // ============================================
    // HEADER SCROLL
    // ============================================
    const header = document.getElementById('header');

    function handleScroll() {
        if (window.scrollY > 40) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ============================================
    // MOBILE NAV
    // ============================================
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobileNav');

    burger.addEventListener('click', function () {
        mobileNav.classList.toggle('mobile-nav--active');
        this.classList.toggle('active');
    });

    document.querySelectorAll('.mobile-nav__link, .header__nav .nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileNav.classList.remove('mobile-nav--active');
            burger.classList.remove('active');
        });
    });

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // STATS COUNTER ANIMATION
    // ============================================
    var statNumbers = document.querySelectorAll('.stat-number[data-target]');
    var statsAnimated = false;

    function animateStats() {
        statNumbers.forEach(function (stat) {
            var target = parseInt(stat.getAttribute('data-target'));
            var duration = 2000;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                stat.textContent = Math.floor(eased * target).toLocaleString('ru-RU');
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    stat.textContent = target.toLocaleString('ru-RU');
                }
            }

            requestAnimationFrame(step);
        });
    }

    var statsSection = document.querySelector('.stats');
    if (statsSection) {
        var statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // ============================================
    // AOS (Animate on Scroll)
    // ============================================
    function initAOS() {
        var elements = document.querySelectorAll('[data-aos]');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        elements.forEach(function (el) { observer.observe(el); });
    }
    initAOS();

    // ============================================
    // PRICING TABS
    // ============================================
    var pricingTabs = document.querySelectorAll('.pricing__tab');
    var pricingGrids = document.querySelectorAll('.pricing__grid');

    pricingTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            pricingTabs.forEach(function (t) { t.classList.remove('active'); });
            this.classList.add('active');

            var tabId = this.getAttribute('data-tab');
            pricingGrids.forEach(function (grid) {
                if (grid.id === tabId) {
                    grid.classList.remove('hidden');
                } else {
                    grid.classList.add('hidden');
                }
            });
        });
    });

    // ============================================
    // PHONE MASK
    // ============================================
    var phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            var value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                var formatted = '+7';
                if (value.length > 0) formatted += ' (' + value.substring(0, 3);
                if (value.length >= 3) formatted += ') ' + value.substring(3, 6);
                if (value.length >= 6) formatted += '-' + value.substring(6, 8);
                if (value.length >= 8) formatted += '-' + value.substring(8, 10);
                e.target.value = formatted;
            }
        });
    }

    // ============================================
    // FORM SUBMIT → Telegram via Google Apps Script
    // ============================================
    var form = document.getElementById('contactForm');
    var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx53FkSj7GXkuW316y7bs3hCHY_fHFxQHq0rtNnd-_iShQ0L47sZk3_OehBHFAO7J7C/exec';

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var submitBtn = form.querySelector('button[type="submit"]');
            var originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Отправка...</span>';
            submitBtn.disabled = true;

            var formData = new FormData(form);
            var data = {};
            formData.forEach(function (value, key) { data[key] = value; });

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).then(function () {
                var wrapper = form.closest('.contacts__form-wrapper') || form.parentElement;
                wrapper.innerHTML =
                    '<div class="form-success">' +
                        '<div class="form-success__icon">✅</div>' +
                        '<h3>Заявка отправлена!</h3>' +
                        '<p>Я свяжусь с вами в ближайшее время.</p>' +
                    '</div>';
            }).catch(function () {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                alert('Ошибка отправки. Попробуйте ещё раз.');
            });
        });
    }

});
