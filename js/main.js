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
    // PHONE MASK (both forms)
    // ============================================
    function setupPhoneMask(inputId) {
        var phoneInput = document.getElementById(inputId);
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
    }
    setupPhoneMask('phone');
    setupPhoneMask('modalPhone');

    // ============================================
    // MODAL
    // ============================================
    var modalOverlay = document.getElementById('modalOverlay');
    var modalClose = document.getElementById('modalClose');
    var modalTariff = document.getElementById('modalTariff');

    document.querySelectorAll('.open-modal').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var tariff = this.getAttribute('data-tariff');
            if (modalTariff) modalTariff.value = tariff;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', function () {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // FILE UPLOAD
    // ============================================
    var fileUpload = document.getElementById('fileUpload');
    var modalFiles = document.getElementById('modalFiles');
    var fileList = document.getElementById('fileList');
    var selectedFiles = [];

    if (fileUpload && modalFiles) {
        fileUpload.addEventListener('click', function () {
            modalFiles.click();
        });

        fileUpload.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.style.borderColor = 'var(--c-primary)';
            this.style.background = 'var(--c-primary-light)';
        });

        fileUpload.addEventListener('dragleave', function () {
            this.style.borderColor = '';
            this.style.background = '';
        });

        fileUpload.addEventListener('drop', function (e) {
            e.preventDefault();
            this.style.borderColor = '';
            this.style.background = '';
            handleFiles(e.dataTransfer.files);
        });

        modalFiles.addEventListener('change', function () {
            handleFiles(this.files);
        });
    }

    function handleFiles(files) {
        Array.from(files).forEach(function (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('Файл ' + file.name + ' превышает 10 МБ');
                return;
            }
            selectedFiles.push(file);
        });
        renderFileList();
    }

    function renderFileList() {
        if (!fileList) return;
        fileList.innerHTML = '';
        selectedFiles.forEach(function (file, index) {
            var item = document.createElement('div');
            item.className = 'file-upload__item';
            item.innerHTML = '<span class="file-upload__item-name">' + file.name + '</span>' +
                '<button type="button" class="file-upload__item-remove" data-index="' + index + '">&times;</button>';
            fileList.appendChild(item);
        });

        fileList.querySelectorAll('.file-upload__item-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var idx = parseInt(this.getAttribute('data-index'));
                selectedFiles.splice(idx, 1);
                renderFileList();
            });
        });
    }

    // ============================================
    // FORM SUBMITS → Telegram via Google Apps Script
    // ============================================
    var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx53FkSj7GXkuW316y7bs3hCHY_fHFxQHq0rtNnd-_iShQ0L47sZk3_OehBHFAO7J7C/exec';

    function readFileAsBase64(file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                resolve({
                    name: file.name,
                    mimeType: file.type,
                    data: reader.result.split(',')[1]
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function submitToTelegram(data, files, successCallback, errorCallback) {
        var filesPromises = [];
        if (files && files.length > 0) {
            files.forEach(function (file) {
                filesPromises.push(readFileAsBase64(file));
            });
        }

        Promise.all(filesPromises).then(function (filesData) {
            data.files = filesData;
            return fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }).then(function () {
            successCallback();
        }).catch(function () {
            errorCallback();
        });
    }

    // Contact form
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Отправка...</span>';
            submitBtn.disabled = true;

            var formData = new FormData(contactForm);
            var data = {};
            formData.forEach(function (value, key) { data[key] = value; });

            submitToTelegram(data, [], function () {
                var wrapper = contactForm.closest('.contacts__form-wrapper') || contactForm.parentElement;
                wrapper.innerHTML =
                    '<div class="form-success">' +
                        '<div class="form-success__icon">✅</div>' +
                        '<h3>Заявка отправлена!</h3>' +
                        '<p>Я свяжусь с вами в ближайшее время.</p>' +
                    '</div>';
            }, function () {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                alert('Ошибка отправки. Попробуйте ещё раз.');
            });
        });
    }

    // Modal form
    var modalForm = document.getElementById('modalForm');
    var modalSuccess = document.getElementById('modalSuccess');

    if (modalForm) {
        modalForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var submitBtn = modalForm.querySelector('button[type="submit"]');
            var originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Отправка...</span>';
            submitBtn.disabled = true;

            var formData = new FormData(modalForm);
            var data = {};
            formData.forEach(function (value, key) {
                if (key !== 'files') data[key] = value;
            });

            submitToTelegram(data, selectedFiles, function () {
                modalForm.style.display = 'none';
                modalSuccess.style.display = 'block';
                selectedFiles = [];
                renderFileList();
            }, function () {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                alert('Ошибка отправки. Попробуйте ещё раз.');
            });
        });
    }

});
