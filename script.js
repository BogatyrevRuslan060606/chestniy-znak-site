// ============================================
// HEADER SCROLL
// ============================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
    lastScroll = currentScroll;
});

// ============================================
// MOBILE NAV
// ============================================
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
    mobileNav.classList.toggle('mobile-nav--active');
    burger.classList.toggle('active');
});

document.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('mobile-nav--active');
        burger.classList.remove('active');
    });
});

// ============================================
// AOS (Animate on Scroll)
// ============================================
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

initAOS();

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// PHONE MASK
// ============================================
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = value.substring(1);
            }

            let formatted = '+7';
            if (value.length > 0) formatted += ' (' + value.substring(0, 3);
            if (value.length >= 3) formatted += ') ' + value.substring(3, 6);
            if (value.length >= 6) formatted += '-' + value.substring(6, 8);
            if (value.length >= 8) formatted += '-' + value.substring(8, 10);

            e.target.value = formatted;
        }
    });
}

// ============================================
// FORM SUBMIT
// ============================================
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Here you would normally send data to a server
        console.log('Form submitted:', data);

        // Show success
        form.innerHTML = `
            <div class="form-success">
                <div class="form-success__icon">✅</div>
                <h3>Заявка отправлена!</h3>
                <p>Я свяжусь с вами в ближайшее время.</p>
            </div>
        `;
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.hero__stat-number');

    counters.forEach(counter => {
        const text = counter.textContent;
        const isPercent = text.includes('%');
        const isPlus = text.includes('+');
        const num = parseInt(text);

        if (isNaN(num)) return;

        let current = 0;
        const increment = Math.ceil(num / 40);
        const duration = 1500;
        const stepTime = duration / (num / increment);

        const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
                current = num;
                clearInterval(timer);
            }
            counter.textContent = current + (isPlus ? '+' : '') + (isPercent ? '%' : '');
        }, stepTime);
    });
}

// Trigger counter animation when hero is visible
const heroSection = document.querySelector('.hero');
if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            heroObserver.disconnect();
        }
    }, { threshold: 0.3 });

    heroObserver.observe(heroSection);
}
