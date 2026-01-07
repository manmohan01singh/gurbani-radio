// ═══════════════════════════════════════════════════════════════
// SETTINGS PANEL CONTROLLER - ENHANCED VERSION
// Supports 12 Themes + All Visual Customizations
// ═══════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // DEFAULT SETTINGS
  // ═══════════════════════════════════════════════════════════════
  
  const DEFAULTS = {
    gurmukhiSize: 28,
    transliterationSize: 18,
    translationSize: 16,
    punjabiSize: 16,
    theme: 'dark',
    spacing: 'normal'
  };

  // Size limits
  const SIZE_LIMITS = {
    gurmukhi: { min: 18, max: 52 },
    transliteration: { min: 12, max: 32 },
    translation: { min: 12, max: 28 },
    punjabi: { min: 12, max: 28 }
  };

  // Available themes
  const THEMES = [
    'dark',
    'light', 
    'sepia',
    'deep-blue',
    'indigo',
    'amber',
    'purple',
    'green',
    'saffron',
    'teal',
    'rose',
    'midnight'
  ];

  // ═══════════════════════════════════════════════════════════════
  // DOM ELEMENTS
  // ═══════════════════════════════════════════════════════════════
  
  let settingsBtn;
  let settingsPanel;
  let settingsOverlay;
  let settingsClose;
  let resetSettings;
  let gurmukhiSizeDisplay;
  let transliterationSizeDisplay;
  let translationSizeDisplay;
  let punjabiSizeDisplay;

  // ═══════════════════════════════════════════════════════════════
  // CURRENT SETTINGS STATE
  // ═══════════════════════════════════════════════════════════════
  
  let settings = { ...DEFAULTS };

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZE DOM REFERENCES
  // ═══════════════════════════════════════════════════════════════

  function initDOMReferences() {
    settingsBtn = document.getElementById('settingsBtn');
    settingsPanel = document.getElementById('settingsPanel');
    settingsOverlay = document.getElementById('settingsOverlay');
    settingsClose = document.getElementById('settingsClose');
    resetSettings = document.getElementById('resetSettings');
    
    gurmukhiSizeDisplay = document.getElementById('gurmukhiSize');
    transliterationSizeDisplay = document.getElementById('transliterationSize');
    translationSizeDisplay = document.getElementById('translationSize');
    punjabiSizeDisplay = document.getElementById('punjabiSize');
  }

  // ═══════════════════════════════════════════════════════════════
  // PANEL TOGGLE
  // ═══════════════════════════════════════════════════════════════
  
  function openSettings() {
    if (settingsPanel) settingsPanel.classList.add('visible');
    if (settingsOverlay) settingsOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSettings() {
    if (settingsPanel) settingsPanel.classList.remove('visible');
    if (settingsOverlay) settingsOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // ═══════════════════════════════════════════════════════════════
  // APPLY SETTINGS TO CSS
  // ═══════════════════════════════════════════════════════════════
  
  function applySettings() {
    const root = document.documentElement;
    
    // Apply font sizes as CSS custom properties
    root.style.setProperty('--font-gurmukhi', `${settings.gurmukhiSize}px`);
    root.style.setProperty('--font-transliteration', `${settings.transliterationSize}px`);
    root.style.setProperty('--font-translation', `${settings.translationSize}px`);
    root.style.setProperty('--font-punjabi', `${settings.punjabiSize || settings.translationSize}px`);
    
    // Apply theme to body
    document.body.setAttribute('data-theme', settings.theme);
    
    // Apply spacing to body
    document.body.setAttribute('data-spacing', settings.spacing);
    
    // Update size displays
    if (gurmukhiSizeDisplay) gurmukhiSizeDisplay.textContent = settings.gurmukhiSize;
    if (transliterationSizeDisplay) transliterationSizeDisplay.textContent = settings.transliterationSize;
    if (translationSizeDisplay) translationSizeDisplay.textContent = settings.translationSize;
    if (punjabiSizeDisplay) punjabiSizeDisplay.textContent = settings.punjabiSize || settings.translationSize;
    
    // Update active buttons
    updateActiveButtons();
    
    console.log('⚙️ Settings applied:', settings);
  }

  function updateActiveButtons() {
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      const isActive = btn.dataset.theme === settings.theme;
      btn.classList.toggle('active', isActive);
    });
    
    // Spacing buttons
    document.querySelectorAll('.spacing-btn').forEach(btn => {
      const isActive = btn.dataset.spacing === settings.spacing;
      btn.classList.toggle('active', isActive);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SAVE/LOAD FROM LOCAL STORAGE
  // ═══════════════════════════════════════════════════════════════
  
  function saveSettings() {
    try {
      localStorage.setItem('baniSettings', JSON.stringify(settings));
      console.log('💾 Settings saved');
    } catch (e) {
      console.warn('Could not save settings:', e);
    }
  }

  function loadSettings() {
    try {
      const saved = localStorage.getItem('baniSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate theme exists
        if (parsed.theme && !THEMES.includes(parsed.theme)) {
          parsed.theme = DEFAULTS.theme;
        }
        settings = { ...DEFAULTS, ...parsed };
        console.log('📂 Settings loaded:', settings);
      }
    } catch (e) {
      console.warn('Could not load settings:', e);
      settings = { ...DEFAULTS };
    }
    applySettings();
  }

  // ═══════════════════════════════════════════════════════════════
  // SIZE ADJUSTMENT
  // ═══════════════════════════════════════════════════════════════
  
  function adjustSize(target, action) {
    const key = `${target}Size`;
    const limits = SIZE_LIMITS[target];
    
    if (!limits || settings[key] === undefined) {
      console.warn('Unknown size target:', target);
      return;
    }
    
    const step = 2;
    
    if (action === 'increase' && settings[key] < limits.max) {
      settings[key] = Math.min(settings[key] + step, limits.max);
    } else if (action === 'decrease' && settings[key] > limits.min) {
      settings[key] = Math.max(settings[key] - step, limits.min);
    }
    
    applySettings();
    saveSettings();
  }

  // ═══════════════════════════════════════════════════════════════
  // THEME CHANGE
  // ═══════════════════════════════════════════════════════════════

  function setTheme(themeName) {
    if (THEMES.includes(themeName)) {
      settings.theme = themeName;
      applySettings();
      saveSettings();
      
      // Add transition effect
      document.body.style.transition = 'background 0.5s ease, color 0.3s ease';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 500);
      
      console.log('🎨 Theme changed to:', themeName);
    } else {
      console.warn('Unknown theme:', themeName);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SPACING CHANGE
  // ═══════════════════════════════════════════════════════════════

  function setSpacing(spacingName) {
    const validSpacing = ['compact', 'normal', 'relaxed'];
    if (validSpacing.includes(spacingName)) {
      settings.spacing = spacingName;
      applySettings();
      saveSettings();
      console.log('📏 Spacing changed to:', spacingName);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // RESET TO DEFAULTS
  // ═══════════════════════════════════════════════════════════════
  
  function resetToDefaults() {
    settings = { ...DEFAULTS };
    applySettings();
    saveSettings();
    
    // Visual feedback
    if (resetSettings) {
      const originalHTML = resetSettings.innerHTML;
      resetSettings.innerHTML = '<i class="fas fa-check"></i> Reset Complete!';
      resetSettings.style.background = 'var(--success-color)';
      resetSettings.style.borderColor = 'var(--success-color)';
      resetSettings.style.color = '#fff';
      
      setTimeout(() => {
        resetSettings.innerHTML = originalHTML;
        resetSettings.style.background = '';
        resetSettings.style.borderColor = '';
        resetSettings.style.color = '';
      }, 1500);
    }
    
    console.log('🔄 Settings reset to defaults');
  }

  // ═══════════════════════════════════════════════════════════════
  // EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════════
  
  function setupEventListeners() {
    // Open/Close panel
    if (settingsBtn) {
      settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSettings();
      });
    }
    
    if (settingsClose) {
      settingsClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeSettings();
      });
    }
    
    if (settingsOverlay) {
      settingsOverlay.addEventListener('click', closeSettings);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && settingsPanel && settingsPanel.classList.contains('visible')) {
        closeSettings();
      }
    });
    
    // Size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        const target = btn.dataset.target;
        if (action && target) {
          adjustSize(target, action);
          
          // Add click animation
          btn.style.transform = 'scale(0.9)';
          setTimeout(() => {
            btn.style.transform = '';
          }, 100);
        }
      });
    });
    
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const theme = btn.dataset.theme;
        if (theme) {
          setTheme(theme);
        }
      });
    });
    
    // Spacing buttons
    document.querySelectorAll('.spacing-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const spacing = btn.dataset.spacing;
        if (spacing) {
          setSpacing(spacing);
        }
      });
    });
    
    // Reset button
    if (resetSettings) {
      resetSettings.addEventListener('click', (e) => {
        e.preventDefault();
        resetToDefaults();
      });
    }

    console.log('🎛️ Event listeners attached');
  }

  // ═══════════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS (Optional)
  // ═══════════════════════════════════════════════════════════════

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + , to open settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        if (settingsPanel && settingsPanel.classList.contains('visible')) {
          closeSettings();
        } else {
          openSettings();
        }
      }
      
      // Ctrl/Cmd + 0 to reset zoom
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        resetToDefaults();
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // PUBLIC API (for external access if needed)
  // ═══════════════════════════════════════════════════════════════

  window.BaniSettings = {
    open: openSettings,
    close: closeSettings,
    setTheme: setTheme,
    setSpacing: setSpacing,
    reset: resetToDefaults,
    getSettings: () => ({ ...settings }),
    getThemes: () => [...THEMES]
  };

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZE
  // ═══════════════════════════════════════════════════════════════
  
  function init() {
    initDOMReferences();
    loadSettings();
    setupEventListeners();
    setupKeyboardShortcuts();
    console.log('⚙️ Settings panel initialized with theme:', settings.theme);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();