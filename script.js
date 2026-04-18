(function() {
  'use strict';

  // ========== МОБИЛЬНОЕ МЕНЮ ==========
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (burger && mobileMenu) {
    let backdrop = document.querySelector('.mobile-menu-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-menu-backdrop';
      document.body.appendChild(backdrop);
    }
    
    function toggleMenu(force) {
      const isOpen = force ?? !mobileMenu.classList.contains('active');
      mobileMenu.classList.toggle('active', isOpen);
      burger.classList.toggle('active', isOpen);
      backdrop.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      burger.setAttribute('aria-expanded', isOpen);
    }
    
    burger.addEventListener('click', () => toggleMenu());
    backdrop.addEventListener('click', () => toggleMenu(false));
    document.addEventListener('keydown', (e) => e.key === 'Escape' && toggleMenu(false));
    
    document.querySelectorAll('.mobile-menu__list a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // ========== FAQ ==========
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // ========== ПЛАВНЫЙ СКРОЛЛ ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ========== СЛАЙДЕР ==========
  const slider = document.getElementById('featuresSlider');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const pagination = document.getElementById('sliderPagination');
  
  if (slider && prevBtn && nextBtn && pagination) {
    const slides = slider.querySelectorAll('.feature-slide');
    const getSlideWidth = () => slides[0]?.offsetWidth + 18 || 0;
    
    function updatePagination() {
      const slideWidth = getSlideWidth();
      const activeIndex = Math.round(slider.scrollLeft / slideWidth);
      
      pagination.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `slider-dot${i === activeIndex ? ' active' : ''}`;
        dot.addEventListener('click', () => slider.scrollTo({ left: i * slideWidth, behavior: 'smooth' }));
        pagination.appendChild(dot);
      });
    }
    
    prevBtn.addEventListener('click', () => slider.scrollBy({ left: -getSlideWidth(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => slider.scrollBy({ left: getSlideWidth(), behavior: 'smooth' }));
    slider.addEventListener('scroll', updatePagination);
    window.addEventListener('resize', updatePagination);
    setTimeout(updatePagination, 100);
  }

  // ========== МОДАЛКА ==========
  const modal = document.getElementById('requestModal');
  const modalOpenBtns = document.querySelectorAll('[data-open-modal]');
  const modalClose = document.getElementById('closeModalBtn');
  const modalOverlay = modal?.querySelector('.modal__overlay');
  
  // Добавляем кнопке "Смотреть больше работ" атрибут для открытия модалки
  const showMoreBtn = document.querySelector('.works-more .btn');
  if (showMoreBtn && !showMoreBtn.hasAttribute('data-open-modal')) {
    showMoreBtn.setAttribute('data-open-modal', 'true');
    modalOpenBtns.push(showMoreBtn);
  }
  
  function openModal() { modal?.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function closeModal() { modal?.classList.remove('active'); document.body.style.overflow = ''; }
  
  modalOpenBtns.forEach(btn => btn.addEventListener('click', openModal));
  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && modal?.classList.contains('active') && closeModal());

  // ========== ФОРМА ==========
  const form = document.getElementById('requestForm');
  if (form) {
    const phoneInput = form.querySelector('input[type="tel"]');
    
    // Маска телефона
    phoneInput?.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      if (value.startsWith('7') || value.startsWith('8')) {
        let formatted = '+7';
        if (value.length > 1) formatted += ` (${value.slice(1, 4)}`;
        if (value.length > 4) formatted += `) ${value.slice(4, 7)}`;
        if (value.length > 7) formatted += `-${value.slice(7, 9)}`;
        if (value.length > 9) formatted += `-${value.slice(9, 11)}`;
        e.target.value = formatted;
      }
    });
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = phoneInput?.value.replace(/\D/g, '');
      if (!phone || phone.length < 10) {
        alert('Пожалуйста, введите корректный номер телефона');
        return;
      }
      alert('Спасибо! Ваша заявка отправлена. Я скоро свяжусь с вами.');
      closeModal();
      form.reset();
    });
  }

  // ========== АНИМАЦИЯ ПРИ СКРОЛЛЕ ==========
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.service-card, .feature-card, .step, .review-card')
    .forEach(el => observer.observe(el));
})();