/* ═══════════════════════════════════════════════════════════════════════════════
   READER.JS — Nitnem Module
   ═══════════════════════════════════════════════════════════════════════════════
   
   Purpose: Complete functionality for Nitnem reading experience
   Author: Gurbani Live
   Version: 1.0.0
   
   Features:
   ─────────────────────────────────────────────────────────────────────────────
   ✓ Theme Management (Day/Night with persistence)
   ✓ Settings Panel (Accessible overlay)
   ✓ Font Size Controls (With persistence)
   ✓ Keyboard Navigation (Full accessibility)
   ✓ Focus Management (Trap & restore)
   ✓ Mobile Optimizations
   ✓ Reduced Motion Support
   ✓ Cross-page Persistence
   
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════════
     CONFIGURATION
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const CONFIG = {
    // Storage keys
    STORAGE_KEYS: {
      THEME: 'nitnem-theme',
      FONT_SIZE: 'nitnem-font-size',
      LINE_SPACING: 'nitnem-line-spacing'
    },
    
    // Theme options
    THEMES: {
      DAY: 'day',
      NIGHT: 'night'
    },
    
    // Font size limits (percentage)
    FONT_SIZE: {
      MIN: 75,
      MAX: 150,
      DEFAULT: 100,
      STEP: 10
    },
    
    // Animation timing
    TIMING: {
      PANEL_ANIMATION: 400,
      THEME_TRANSITION: 400,
      DEBOUNCE: 150
    },
    
    // Meta theme colors for mobile browser chrome
    META_COLORS: {
      day: '#FBF7F0',
      night: '#0F0F0F'
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     UTILITY FUNCTIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const Utils = {
    /**
     * Safe localStorage getter with fallback
     * @param {string} key - Storage key
     * @param {*} fallback - Default value if not found
     * @returns {*} Stored value or fallback
     */
    getStorage(key, fallback = null) {
      try {
        const item = localStorage.getItem(key);
        return item !== null ? item : fallback;
      } catch (e) {
        console.warn('localStorage not available:', e);
        return fallback;
      }
    },

    /**
     * Safe localStorage setter
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success status
     */
    setStorage(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.warn('localStorage not available:', e);
        return false;
      }
    },

    /**
     * Debounce function for performance
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Check if user prefers reduced motion
     * @returns {boolean}
     */
    prefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announce(message, priority = 'polite') {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.setAttribute('class', 'sr-only');
      announcer.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `;
      document.body.appendChild(announcer);
      
      // Small delay to ensure screen reader catches it
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
      
      // Clean up
      setTimeout(() => {
        announcer.remove();
      }, 1000);
    },

    /**
     * Get all focusable elements within a container
     * @param {HTMLElement} container - Container element
     * @returns {Array<HTMLElement>} Focusable elements
     */
    getFocusableElements(container) {
      const focusableSelectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(', ');
      
      return Array.from(container.querySelectorAll(focusableSelectors));
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     THEME MANAGER
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const ThemeManager = {
    currentTheme: null,
    
    /**
     * Initialize theme system
     */
    init() {
      // Get saved theme or detect system preference
      const savedTheme = Utils.getStorage(CONFIG.STORAGE_KEYS.THEME);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Priority: saved > system > default (day)
      if (savedTheme) {
        this.currentTheme = savedTheme;
      } else if (systemPrefersDark) {
        this.currentTheme = CONFIG.THEMES.NIGHT;
      } else {
        this.currentTheme = CONFIG.THEMES.DAY;
      }
      
      // Apply theme immediately (before DOM fully loaded to prevent flash)
      this.applyTheme(this.currentTheme, false);
      
      // Listen for system theme changes
      this.watchSystemTheme();
      
      console.log(`[Nitnem] Theme initialized: ${this.currentTheme}`);
    },

    /**
     * Apply theme to document
     * @param {string} theme - Theme name ('day' or 'night')
     * @param {boolean} announce - Whether to announce to screen readers
     */
    applyTheme(theme, announce = true) {
      // Validate theme
      if (!Object.values(CONFIG.THEMES).includes(theme)) {
        console.warn(`[Nitnem] Invalid theme: ${theme}`);
        return;
      }
      
      // Update document
      document.documentElement.setAttribute('data-theme', theme);
      this.currentTheme = theme;
      
      // Update meta theme-color for mobile browsers
      this.updateMetaThemeColor(theme);
      
      // Save preference
      Utils.setStorage(CONFIG.STORAGE_KEYS.THEME, theme);
      
      // Update toggle buttons
      this.updateToggleButtons();
      
      // Announce to screen readers
      if (announce) {
        const themeName = theme === CONFIG.THEMES.DAY ? 'Day theme' : 'Night theme';
        Utils.announce(`${themeName} activated`);
      }
      
      // Dispatch custom event for other scripts to listen
      window.dispatchEvent(new CustomEvent('themechange', { 
        detail: { theme } 
      }));
    },

    /**
     * Toggle between day and night themes
     */
    toggle() {
      const newTheme = this.currentTheme === CONFIG.THEMES.DAY 
        ? CONFIG.THEMES.NIGHT 
        : CONFIG.THEMES.DAY;
      
      this.applyTheme(newTheme);
    },

    /**
     * Set specific theme
     * @param {string} theme - Theme name
     */
    setTheme(theme) {
      this.applyTheme(theme);
    },

    /**
     * Update meta theme-color for mobile browser chrome
     * @param {string} theme - Current theme
     */
    updateMetaThemeColor(theme) {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
      }
      
      metaThemeColor.content = CONFIG.META_COLORS[theme] || CONFIG.META_COLORS.day;
    },

    /**
     * Update theme toggle button states
     */
    updateToggleButtons() {
      const dayBtn = document.getElementById('themeDayBtn');
      const nightBtn = document.getElementById('themeNightBtn');
      
      if (dayBtn) {
        dayBtn.setAttribute('aria-pressed', this.currentTheme === CONFIG.THEMES.DAY);
      }
      
      if (nightBtn) {
        nightBtn.setAttribute('aria-pressed', this.currentTheme === CONFIG.THEMES.NIGHT);
      }
    },

    /**
     * Watch for system theme preference changes
     */
    watchSystemTheme() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const savedTheme = Utils.getStorage(CONFIG.STORAGE_KEYS.THEME);
        
        if (!savedTheme) {
          const newTheme = e.matches ? CONFIG.THEMES.NIGHT : CONFIG.THEMES.DAY;
          this.applyTheme(newTheme);
        }
      });
    },

    /**
     * Get current theme
     * @returns {string} Current theme name
     */
    getTheme() {
      return this.currentTheme;
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     FONT SIZE MANAGER
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const FontSizeManager = {
    currentSize: CONFIG.FONT_SIZE.DEFAULT,
    
    /**
     * Initialize font size system
     */
    init() {
      // Get saved font size
      const savedSize = Utils.getStorage(CONFIG.STORAGE_KEYS.FONT_SIZE);
      
      if (savedSize) {
        const parsedSize = parseInt(savedSize, 10);
        if (parsedSize >= CONFIG.FONT_SIZE.MIN && parsedSize <= CONFIG.FONT_SIZE.MAX) {
          this.currentSize = parsedSize;
        }
      }
      
      // Apply saved font size
      this.applySize(this.currentSize, false);
      
      console.log(`[Nitnem] Font size initialized: ${this.currentSize}%`);
    },

    /**
     * Apply font size to document
     * @param {number} size - Font size percentage
     * @param {boolean} announce - Whether to announce to screen readers
     */
    applySize(size, announce = true) {
      // Clamp to valid range
      size = Math.max(CONFIG.FONT_SIZE.MIN, Math.min(CONFIG.FONT_SIZE.MAX, size));
      
      // Apply to root element
      document.documentElement.style.setProperty('--font-size-scale', size / 100);
      document.documentElement.style.fontSize = `${size}%`;
      
      this.currentSize = size;
      
      // Save preference
      Utils.setStorage(CONFIG.STORAGE_KEYS.FONT_SIZE, size.toString());
      
      // Update display
      this.updateDisplay();
      
      // Announce to screen readers
      if (announce) {
        Utils.announce(`Font size ${size} percent`);
      }
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('fontsizechange', { 
        detail: { size } 
      }));
    },

    /**
     * Increase font size by one step
     */
    increase() {
      const newSize = this.currentSize + CONFIG.FONT_SIZE.STEP;
      
      if (newSize <= CONFIG.FONT_SIZE.MAX) {
        this.applySize(newSize);
      } else {
        Utils.announce('Maximum font size reached');
      }
    },

    /**
     * Decrease font size by one step
     */
    decrease() {
      const newSize = this.currentSize - CONFIG.FONT_SIZE.STEP;
      
      if (newSize >= CONFIG.FONT_SIZE.MIN) {
        this.applySize(newSize);
      } else {
        Utils.announce('Minimum font size reached');
      }
    },

    /**
     * Reset font size to default
     */
    reset() {
      this.applySize(CONFIG.FONT_SIZE.DEFAULT);
    },

    /**
     * Update font size display
     */
    updateDisplay() {
      const display = document.getElementById('fontSizeValue');
      if (display) {
        display.textContent = `${this.currentSize}%`;
      }
      
      // Update button states
      const decreaseBtn = document.getElementById('fontDecrease');
      const increaseBtn = document.getElementById('fontIncrease');
      
      if (decreaseBtn) {
        decreaseBtn.disabled = this.currentSize <= CONFIG.FONT_SIZE.MIN;
        decreaseBtn.setAttribute('aria-disabled', this.currentSize <= CONFIG.FONT_SIZE.MIN);
      }
      
      if (increaseBtn) {
        increaseBtn.disabled = this.currentSize >= CONFIG.FONT_SIZE.MAX;
        increaseBtn.setAttribute('aria-disabled', this.currentSize >= CONFIG.FONT_SIZE.MAX);
      }
    },

    /**
     * Get current font size
     * @returns {number} Current font size percentage
     */
    getSize() {
      return this.currentSize;
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     SETTINGS PANEL MANAGER
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const SettingsPanel = {
    panel: null,
    backdrop: null,
    content: null,
    toggleBtn: null,
    closeBtn: null,
    isOpen: false,
    previousActiveElement: null,
    focusableElements: [],
    
    /**
     * Initialize settings panel
     */
    init() {
      // Get DOM elements
      this.panel = document.getElementById('settingsPanel');
      this.toggleBtn = document.getElementById('settingsToggle');
      this.closeBtn = document.getElementById('settingsClose');
      
      if (!this.panel) {
        console.warn('[Nitnem] Settings panel not found');
        return;
      }
      
      this.backdrop = this.panel.querySelector('.settings-panel__backdrop');
      this.content = this.panel.querySelector('.settings-panel__content');
      
      // Bind event handlers
      this.bindEvents();
      
      console.log('[Nitnem] Settings panel initialized');
    },

    /**
     * Bind all event handlers
     */
    bindEvents() {
      // Toggle button
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => this.open());
      }
      
      // Close button
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }
      
      // Backdrop click
      if (this.backdrop) {
        this.backdrop.addEventListener('click', () => this.close());
      }
      
      // Keyboard events
      document.addEventListener('keydown', (e) => this.handleKeydown(e));
      
      // Theme toggle buttons
      const dayBtn = document.getElementById('themeDayBtn');
      const nightBtn = document.getElementById('themeNightBtn');
      
      if (dayBtn) {
        dayBtn.addEventListener('click', () => ThemeManager.setTheme(CONFIG.THEMES.DAY));
      }
      
      if (nightBtn) {
        nightBtn.addEventListener('click', () => ThemeManager.setTheme(CONFIG.THEMES.NIGHT));
      }
      
      // Font size buttons
      const increaseBtn = document.getElementById('fontIncrease');
      const decreaseBtn = document.getElementById('fontDecrease');
      
      if (increaseBtn) {
        increaseBtn.addEventListener('click', () => FontSizeManager.increase());
      }
      
      if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => FontSizeManager.decrease());
      }
    },

    /**
     * Open settings panel
     */
    open() {
      if (this.isOpen) return;
      
      // Store currently focused element
      this.previousActiveElement = document.activeElement;
      
      // Update state
      this.isOpen = true;
      this.panel.setAttribute('aria-hidden', 'false');
      this.toggleBtn?.setAttribute('aria-expanded', 'true');
      
      // Lock body scroll
      document.body.classList.add('settings-open');
      document.body.style.overflow = 'hidden';
      
      // Get focusable elements for focus trap
      this.focusableElements = Utils.getFocusableElements(this.content);
      
      // Focus first element (close button)
      setTimeout(() => {
        if (this.closeBtn) {
          this.closeBtn.focus();
        } else if (this.focusableElements.length > 0) {
          this.focusableElements[0].focus();
        }
      }, Utils.prefersReducedMotion() ? 0 : CONFIG.TIMING.PANEL_ANIMATION);
      
      // Announce to screen readers
      Utils.announce('Settings panel opened');
      
      console.log('[Nitnem] Settings panel opened');
    },

    /**
     * Close settings panel
     */
    close() {
      if (!this.isOpen) return;
      
      // Update state
      this.isOpen = false;
      this.panel.setAttribute('aria-hidden', 'true');
      this.toggleBtn?.setAttribute('aria-expanded', 'false');
      
      // Unlock body scroll
      document.body.classList.remove('settings-open');
      document.body.style.overflow = '';
      
      // Restore focus
      if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
        this.previousActiveElement.focus();
      }
      
      // Announce to screen readers
      Utils.announce('Settings panel closed');
      
      console.log('[Nitnem] Settings panel closed');
    },

    /**
     * Toggle settings panel
     */
    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    /**
     * Handle keyboard events
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeydown(e) {
      // Only handle when panel is open
      if (!this.isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          this.close();
          break;
          
        case 'Tab':
          this.handleTabKey(e);
          break;
      }
    },

    /**
     * Handle Tab key for focus trapping
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleTabKey(e) {
      if (this.focusableElements.length === 0) return;
      
      const firstElement = this.focusableElements[0];
      const lastElement = this.focusableElements[this.focusableElements.length - 1];
      
      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } 
      // Tab
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     SCROLL PROGRESS INDICATOR (Optional Enhancement)
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const ScrollProgress = {
    indicator: null,
    
    /**
     * Initialize scroll progress indicator
     */
    init() {
      // Create progress indicator if it doesn't exist
      this.createIndicator();
      
      // Bind scroll event
      window.addEventListener('scroll', Utils.debounce(() => {
        this.update();
      }, 10), { passive: true });
    },

    /**
     * Create progress indicator element
     */
    createIndicator() {
      // Check if already exists
      if (document.getElementById('scrollProgress')) {
        this.indicator = document.getElementById('scrollProgress');
        return;
      }
      
      // Create element
      this.indicator = document.createElement('div');
      this.indicator.id = 'scrollProgress';
      this.indicator.setAttribute('role', 'progressbar');
      this.indicator.setAttribute('aria-label', 'Reading progress');
      this.indicator.setAttribute('aria-valuemin', '0');
      this.indicator.setAttribute('aria-valuemax', '100');
      
      // Style it
      this.indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--color-accent-primary), var(--color-sacred-gold));
        z-index: 9999;
        transition: width 0.1s ease-out;
        pointer-events: none;
      `;
      
      document.body.appendChild(this.indicator);
    },

    /**
     * Update progress indicator
     */
    update() {
      if (!this.indicator) return;
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      this.indicator.style.width = `${progress}%`;
      this.indicator.setAttribute('aria-valuenow', Math.round(progress).toString());
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     KEYBOARD SHORTCUTS
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const KeyboardShortcuts = {
    /**
     * Initialize keyboard shortcuts
     */
    init() {
      document.addEventListener('keydown', (e) => this.handleKeydown(e));
      
      console.log('[Nitnem] Keyboard shortcuts initialized');
    },

    /**
     * Handle keydown events
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeydown(e) {
      // Ignore if typing in input
      if (e.target.matches('input, textarea, select')) return;
      
      // Ignore if settings panel is open (handled separately)
      if (SettingsPanel.isOpen) return;
      
      // Ctrl/Cmd + shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '+':
          case '=':
            e.preventDefault();
            FontSizeManager.increase();
            break;
            
          case '-':
            e.preventDefault();
            FontSizeManager.decrease();
            break;
            
          case '0':
            e.preventDefault();
            FontSizeManager.reset();
            break;
        }
      }
      
      // Standalone shortcuts
      switch (e.key) {
        case 't':
        case 'T':
          // Toggle theme
          if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            ThemeManager.toggle();
          }
          break;
          
        case ',':
          // Open settings
          if (!e.ctrlKey && !e.metaKey) {
            SettingsPanel.open();
          }
          break;
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     BACK TO TOP BUTTON (Optional Enhancement)
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const BackToTop = {
    button: null,
    threshold: 300,
    
    /**
     * Initialize back to top button
     */
    init() {
      this.createButton();
      this.bindEvents();
    },

    /**
     * Create back to top button
     */
    createButton() {
      // Check if already exists
      if (document.getElementById('backToTop')) {
        this.button = document.getElementById('backToTop');
        return;
      }
      
      this.button = document.createElement('button');
      this.button.id = 'backToTop';
      this.button.setAttribute('aria-label', 'Back to top');
      this.button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      `;
      
      this.button.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-accent-primary);
        color: var(--color-text-inverse);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 100;
      `;
      
      document.body.appendChild(this.button);
    },

    /**
     * Bind events
     */
    bindEvents() {
      // Scroll event
      window.addEventListener('scroll', Utils.debounce(() => {
        this.updateVisibility();
      }, 100), { passive: true });
      
      // Click event
      this.button?.addEventListener('click', () => this.scrollToTop());
    },

    /**
     * Update button visibility based on scroll position
     */
    updateVisibility() {
      if (!this.button) return;
      
      if (window.scrollY > this.threshold) {
        this.button.style.opacity = '1';
        this.button.style.visibility = 'visible';
        this.button.style.transform = 'translateY(0)';
      } else {
        this.button.style.opacity = '0';
        this.button.style.visibility = 'hidden';
        this.button.style.transform = 'translateY(20px)';
      }
    },

    /**
     * Scroll to top of page
     */
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: Utils.prefersReducedMotion() ? 'auto' : 'smooth'
      });
      
      Utils.announce('Scrolled to top');
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     BANI CARD ENHANCEMENTS
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const BaniCards = {
    /**
     * Initialize bani card enhancements
     */
    init() {
      const cards = document.querySelectorAll('.bani-card__link');
      
      cards.forEach((card, index) => {
        // Add entrance animation delay
        card.style.setProperty('--card-index', index.toString());
        
        // Add keyboard enhancement
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
          }
        });
      });
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     PAGE VISIBILITY HANDLER
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const PageVisibility = {
    /**
     * Initialize page visibility handler
     */
    init() {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          // Sync theme when tab becomes visible (in case changed in another tab)
          this.syncSettings();
        }
      });
      
      // Also sync on focus
      window.addEventListener('focus', () => {
        this.syncSettings();
      });
    },

    /**
     * Sync settings from localStorage
     */
    syncSettings() {
      const savedTheme = Utils.getStorage(CONFIG.STORAGE_KEYS.THEME);
      const savedFontSize = Utils.getStorage(CONFIG.STORAGE_KEYS.FONT_SIZE);
      
      // Sync theme if different
      if (savedTheme && savedTheme !== ThemeManager.currentTheme) {
        ThemeManager.applyTheme(savedTheme, false);
      }
      
      // Sync font size if different
      if (savedFontSize) {
        const size = parseInt(savedFontSize, 10);
        if (size !== FontSizeManager.currentSize) {
          FontSizeManager.applySize(size, false);
        }
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     TOUCH GESTURES (Mobile Enhancement)
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const TouchGestures = {
    startX: 0,
    startY: 0,
    threshold: 100,
    
    /**
     * Initialize touch gestures
     */
    init() {
      // Only on touch devices
      if (!('ontouchstart' in window)) return;
      
      document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    },

    /**
     * Handle touch start
     * @param {TouchEvent} e - Touch event
     */
    handleTouchStart(e) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    },

    /**
     * Handle touch end
     * @param {TouchEvent} e - Touch event
     */
    handleTouchEnd(e) {
      if (!e.changedTouches.length) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - this.startX;
      const deltaY = endY - this.startY;
      
      // Only horizontal swipes, and only if not scrolling vertically
      if (Math.abs(deltaX) > this.threshold && Math.abs(deltaY) < 50) {
        // Swipe left to open settings (from right edge)
        if (deltaX < 0 && this.startX > window.innerWidth - 50) {
          SettingsPanel.open();
        }
        
        // Swipe right to close settings (when panel is open)
        if (deltaX > 0 && SettingsPanel.isOpen) {
          SettingsPanel.close();
        }
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     PRINT HANDLER
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const PrintHandler = {
    /**
     * Initialize print handler
     */
    init() {
      window.addEventListener('beforeprint', () => this.beforePrint());
      window.addEventListener('afterprint', () => this.afterPrint());
    },

    /**
     * Before print - optimize for printing
     */
    beforePrint() {
      // Close settings panel if open
      if (SettingsPanel.isOpen) {
        SettingsPanel.close();
      }
      
      // Reset font size for print
      document.documentElement.style.fontSize = '100%';
    },

    /**
     * After print - restore settings
     */
    afterPrint() {
      // Restore font size
      FontSizeManager.applySize(FontSizeManager.currentSize, false);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     MAIN APPLICATION
     ═══════════════════════════════════════════════════════════════════════════ */
  
  const NitnemApp = {
    /**
     * Initialize the entire application
     */
    init() {
      console.log('[Nitnem] Initializing application...');
      
      // Core features
      ThemeManager.init();
      FontSizeManager.init();
      SettingsPanel.init();
      KeyboardShortcuts.init();
      
      // Enhancements
      BaniCards.init();
      PageVisibility.init();
      TouchGestures.init();
      PrintHandler.init();
      
      // Optional features (uncomment to enable)
      // ScrollProgress.init();
      // BackToTop.init();
      
      // Mark as initialized
      document.documentElement.setAttribute('data-nitnem-ready', 'true');
      
      console.log('[Nitnem] Application initialized successfully!');
      console.log('[Nitnem] Keyboard shortcuts: T = Toggle theme, , = Open settings, Ctrl+/- = Font size');
    },

    /**
     * Get current settings
     * @returns {Object} Current settings
     */
    getSettings() {
      return {
        theme: ThemeManager.getTheme(),
        fontSize: FontSizeManager.getSize()
      };
    },

    /**
     * Update settings
     * @param {Object} settings - Settings to update
     */
    updateSettings(settings) {
      if (settings.theme) {
        ThemeManager.setTheme(settings.theme);
      }
      
      if (settings.fontSize) {
        FontSizeManager.applySize(settings.fontSize);
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     INITIALIZATION
     ═══════════════════════════════════════════════════════════════════════════ */
  
  // Initialize theme immediately (before DOM ready) to prevent flash
  ThemeManager.init();
  
  // Initialize rest when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NitnemApp.init());
  } else {
    // DOM already loaded
    NitnemApp.init();
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     GLOBAL EXPORTS
     ═══════════════════════════════════════════════════════════════════════════ */
  
  // Expose to global scope for debugging and external access
  window.Nitnem = {
    theme: ThemeManager,
    fontSize: FontSizeManager,
    settings: SettingsPanel,
    app: NitnemApp,
    
    // Convenience methods
    toggleTheme: () => ThemeManager.toggle(),
    setTheme: (theme) => ThemeManager.setTheme(theme),
    openSettings: () => SettingsPanel.open(),
    closeSettings: () => SettingsPanel.close(),
    getSettings: () => NitnemApp.getSettings(),
    
    // Version
    version: '1.0.0'
  };

})();


/* ═══════════════════════════════════════════════════════════════════════════════
   END OF READER.JS
   ═══════════════════════════════════════════════════════════════════════════════
   
   Usage Examples:
   ─────────────────────────────────────────────────────────────────────────────
   
   // Toggle theme
   Nitnem.toggleTheme();
   
   // Set specific theme
   Nitnem.setTheme('night');
   
   // Open settings panel
   Nitnem.openSettings();
   
   // Get current settings
   console.log(Nitnem.getSettings());
   // Output: { theme: 'day', fontSize: 100 }
   
   // Listen for theme changes
   window.addEventListener('themechange', (e) => {
     console.log('Theme changed to:', e.detail.theme);
   });
   
   // Listen for font size changes
   window.addEventListener('fontsizechange', (e) => {
     console.log('Font size changed to:', e.detail.size);
   });
   
   ═══════════════════════════════════════════════════════════════════════════════ */