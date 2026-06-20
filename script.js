// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== Мобильное меню ==========
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Открытие/закрытие мобильного меню
    if (burgerMenu) {
        burgerMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            burgerMenu.classList.toggle('active');
            
            // Анимация бургер-меню
            const spans = burgerMenu.querySelectorAll('span');
            if (burgerMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            burgerMenu.classList.remove('active');
            
            const spans = burgerMenu.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ========== Плавная прокрутка ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== Изменение шапки при прокрутке ==========
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Добавление тени при прокрутке
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // ========== Кнопка "Наверх" ==========
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========== Анимация появления элементов при прокрутке ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Элементы для анимации
    const animatedElements = document.querySelectorAll(
        '.feature-card, .product-card, .delivery-card, .review-card, .stat-item'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ========== Обработка формы контактов ==========
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Получение данных формы
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            // Валидация
            if (!data.name || !data.phone) {
                showNotification('Пожалуйста, заполните обязательные поля', 'error');
                return;
            }

            // Валидация телефона
            const phoneRegex = /^[\d\s\+\-\(\)]+$/;
            if (!phoneRegex.test(data.phone)) {
                showNotification('Пожалуйста, введите корректный номер телефона', 'error');
                return;
            }

            // Валидация email (если заполнен)
            if (data.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    showNotification('Пожалуйста, введите корректный email', 'error');
                    return;
                }
            }

            // Имитация отправки (в реальном проекте здесь был бы AJAX-запрос)
            console.log('Отправка данных:', data);
            
            // Показываем уведомление об успехе
            showNotification('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Очищаем форму
            contactForm.reset();
        });
    }

    // ========== Обработка кнопок "Заказать" ==========
    const orderButtons = document.querySelectorAll('.product-card .btn-primary');

    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;

            // Показываем модальное окно или уведомление
            showOrderModal(productTitle, productPrice);
        });
    });

    // ========== Функция показа уведомлений ==========
    function showNotification(message, type = 'info') {
        // Удаляем предыдущее уведомление, если есть
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Создаём новое уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 350px;
            font-size: 0.95rem;
            line-height: 1.5;
        `;

        document.body.appendChild(notification);

        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // ========== Функция показа модального окна заказа ==========
    function showOrderModal(productTitle, productPrice) {
        // Удаляем предыдущее модальное окно, если есть
        const existingModal = document.querySelector('.order-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Создаём модальное окно
        const modal = document.createElement('div');
        modal.className = 'order-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h3 class="modal-title">Оформление заказа</h3>
                <div class="modal-product">
                    <p><strong>Букет:</strong> ${productTitle}</p>
                    <p><strong>Цена:</strong> ${productPrice}</p>
                </div>
                <form class="modal-form" id="orderForm">
                    <input type="text" name="name" placeholder="Ваше имя *" required class="form-input">
                    <input type="tel" name="phone" placeholder="Телефон *" required class="form-input">
                    <input type="text" name="address" placeholder="Адрес доставки *" required class="form-input">
                    <textarea name="comment" placeholder="Комментарий к заказу" rows="3" class="form-input"></textarea>
                    <button type="submit" class="btn btn-primary btn-full">Оформить заказ</button>
                </form>
            </div>
        `;

        // Стили для модального окна
        const style = document.createElement('style');
        style.textContent = `
            .order-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            }

            .modal-content {
                position: relative;
                background: white;
                padding: 2rem;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                animation: slideInUp 0.3s ease;
            }

            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #666;
                transition: color 0.3s ease;
                line-height: 1;
                padding: 0;
                width: 30px;
                height: 30px;
            }

            .modal-close:hover {
                color: #ff6b9d;
            }

            .modal-title {
                font-size: 1.8rem;
                margin-bottom: 1.5rem;
                color: #2c3e50;
            }

            .modal-product {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 10px;
                margin-bottom: 1.5rem;
            }

            .modal-product p {
                margin: 0.5rem 0;
                color: #333;
            }

            .modal-form {
                display: flex;
                flex-direction: column;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Закрытие модального окна
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

        // Обработка формы заказа
        const orderForm = modal.querySelector('#orderForm');
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(orderForm);
            const orderData = {
                product: productTitle,
                price: productPrice,
                name: formData.get('name'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                comment: formData.get('comment')
            };

            // Валидация
            if (!orderData.name || !orderData.phone || !orderData.address) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }

            // Имитация отправки заказа
            console.log('Заказ оформлен:', orderData);
            
            closeModal();
            showNotification(`Спасибо за заказ! Букет "${productTitle}" будет доставлен по адресу: ${orderData.address}`, 'success');
        });

        // Фокус на первое поле
        setTimeout(() => {
            modal.querySelector('input[name="name"]').focus();
        }, 300);
    }

    // ========== Счётчик для статистики ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const countObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                statNumbers.forEach(stat => {
                    const target = stat.textContent;
                    const number = parseInt(target.replace(/\D/g, ''));
                    const suffix = target.replace(/[\d\s]/g, '');
                    
                    if (!isNaN(number)) {
                        animateCounter(stat, 0, number, suffix, 2000);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    if (statNumbers.length > 0) {
        countObserver.observe(statNumbers[0].closest('.about-stats'));
    }

    function animateCounter(element, start, end, suffix, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    }

    // ========== Эффект параллакса отключен ==========
    // Параллакс эффект убран для статичного отображения

    // ========== Добавление класса для загруженной страницы ==========
    document.body.classList.add('loaded');

    console.log('🌸 Flower Shop - Сайт успешно загружен!');
});
