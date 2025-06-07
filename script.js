// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Theme Management
class ThemeManager {
  constructor() {
    this.themeToggle = $('#theme-toggle');
    this.body = document.body;
    this.themeIcon = this.themeToggle.querySelector('i');
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    
    this.init();
  }
  
  init() {
    this.setTheme(this.currentTheme);
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
  }
  
  setTheme(theme) {
    if (theme === 'light') {
      this.body.setAttribute('data-theme', 'light');
      this.themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
      this.body.removeAttribute('data-theme');
      this.themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.nav = $('.nav');
    this.navMenu = $('.nav__menu');
    this.navToggle = $('.nav__toggle');
    this.navLinks = $$('.nav__link');
    this.header = $('.header');
    
    this.init();
  }
  
  init() {
    this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });
    
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('scroll', () => this.updateActiveLink());
  }
  
  toggleMobileMenu() {
    this.navMenu.classList.toggle('active');
    this.navToggle.classList.toggle('active');
  }
  
  closeMobileMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
  }
  
  handleScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      this.header.style.background = 'rgba(10, 10, 10, 0.95)';
      if (document.body.getAttribute('data-theme') === 'light') {
        this.header.style.background = 'rgba(255, 255, 255, 0.95)';
      }
    } else {
      this.header.style.background = 'rgba(10, 10, 10, 0.8)';
      if (document.body.getAttribute('data-theme') === 'light') {
        this.header.style.background = 'rgba(255, 255, 255, 0.8)';
      }
    }
  }
  
  updateActiveLink() {
    const sections = $$('section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos <= bottom) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// // Custom Cursor
// class CustomCursor {
//   constructor() {
//     this.cursorDot = $('[data-cursor-dot]');
//     this.cursorOutline = $('[data-cursor-outline]');
//     this.init();
//   }
  
//   init() {
//     if (window.innerWidth > 768) {
//       document.addEventListener('mousemove', (e) => this.updateCursor(e));
      
//       // Hide cursor on touch devices
//       document.addEventListener('touchstart', () => {
//         this.cursorDot.style.display = 'none';
//         this.cursorOutline.style.display = 'none';
//       });
//     } else {
//       this.cursorDot.style.display = 'none';
//       this.cursorOutline.style.display = 'none';
//     }
//   }
  
//   updateCursor(e) {
//     const posX = e.clientX;
//     const posY = e.clientY;
    
//     this.cursorDot.style.left = `${posX}px`;
//     this.cursorDot.style.top = `${posY}px`;
    
//     this.cursorOutline.style.left = `${posX}px`;
//     this.cursorOutline.style.top = `${posY}px`;
//   }
// }

// Smooth Scrolling
class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = $(anchor.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Intersection Observer for Animations
class AnimationObserver {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    }, this.observerOptions);
    
    // Observe sections
    $$('section').forEach(section => observer.observe(section));
    
    // Observe cards
    $$('.project-card, .timeline-item, .skill-item').forEach(item => {
      observer.observe(item);
    });
  }
}

// Typing Effect
class TypingEffect {
  constructor(element, text, speed = 100) {
    this.element = element;
    this.text = text;
    this.speed = speed;
    this.index = 0;
    
    this.init();
  }
  
  init() {
    this.element.innerHTML = '';
    this.type();
  }
  
  type() {
    if (this.index < this.text.length) {
      this.element.innerHTML += this.text.charAt(this.index);
      this.index++;
      setTimeout(() => this.type(), this.speed);
    }
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.init();
  }
  
  init() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      $$('img[data-src]').forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    this.preloadCriticalResources();
  }
  
  preloadCriticalResources() {
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];
    
    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font;
      link.as = 'style';
      document.head.appendChild(link);
    });
  }
}

// Contact Form Handler
class ContactFormHandler {
  constructor() {
    this.init();
  }
  
  init() {
    // Since we don't have a form in this version, we'll handle contact methods
    $$('.contact-method').forEach(method => {
      method.addEventListener('click', (e) => {
        const href = method.getAttribute('href');
        if (href && href.startsWith('mailto:')) {
          // Show notification for email
          this.showNotification('Opening your email client...', 'info');
        } else if (href && href.startsWith('tel:')) {
          // Show notification for phone
          this.showNotification('Initiating phone call...', 'info');
        }
      });
    });
  }
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'info' ? 'var(--color-primary)' : 'var(--color-success)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-xl)',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Project Card Interactions
class ProjectCardManager {
  constructor() {
    this.init();
  }
  
  init() {
    $$('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => this.handleCardHover(card));
      card.addEventListener('mouseleave', () => this.handleCardLeave(card));
    });
  }
  
  handleCardHover(card) {
    const techTags = card.querySelectorAll('.project-card__tech span');
    techTags.forEach((tag, index) => {
      setTimeout(() => {
        tag.style.transform = 'translateY(-2px)';
        tag.style.boxShadow = '0 4px 8px rgba(0, 212, 255, 0.2)';
      }, index * 50);
    });
  }
  
  handleCardLeave(card) {
    const techTags = card.querySelectorAll('.project-card__tech span');
    techTags.forEach(tag => {
      tag.style.transform = 'translateY(0)';
      tag.style.boxShadow = 'none';
    });
  }
}

// Parallax Effects
class ParallaxManager {
  constructor() {
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => this.handleParallax());
  }
  
  handleParallax() {
    const scrolled = window.pageYOffset;
    const hero = $('.hero');
    
    if (hero && window.innerWidth > 768) {
      const rate = scrolled * -0.3;
      hero.style.transform = `translateY(${rate}px)`;
    }
  }
}

// Initialize Everything
class App {
  constructor() {
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    // Initialize all components
    new ThemeManager();
    new NavigationManager();
    // new CustomCursor();
    new SmoothScroll();
    new AnimationObserver();
    new PerformanceMonitor();
    new ContactFormHandler();
    new ProjectCardManager();
    new ParallaxManager();
    
    // Initialize typing effect for hero
    const heroName = $('.hero__name');
    if (heroName) {
      const originalText = heroName.textContent;
      new TypingEffect(heroName, originalText, 80);
    }
    
    // Add loading complete class
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
    
    // Console message for developers
    console.log(`
    🚀 Portfolio loaded successfully!
    
    Built with:
    - Vanilla JavaScript (ES6+)
    - Modern CSS (Grid, Flexbox, Custom Properties)
    - Intersection Observer API
    - Performance optimizations
    
    Developer: Ayush Maddhesiya
    Email: ayushkumarmaddhesiya@gmail.com
    `);
  }
}

// Error Handling
window.addEventListener('error', (e) => {
  console.error('Portfolio Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
});

// Initialize the application
new App();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, ThemeManager, NavigationManager };
}