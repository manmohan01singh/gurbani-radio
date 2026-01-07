/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║     ੴ GURBANI RADIO - ULTRA PREMIUM EDITION v6.0 ੴ                          ║
 * ║     Enhanced Design - Audio Backend Preserved                                 ║
 * ║     MOBILE OPTIMIZED VERSION                                                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════════════
   MOBILE PERFORMANCE SYSTEM - ENHANCED VERSION
   ═══════════════════════════════════════════════════════════════════════ */

// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                 || window.innerWidth < 768;

// Detect slow device (low memory or old phone)
const isSlowDevice = navigator.deviceMemory ? navigator.deviceMemory < 4 : isMobile;

// Detect if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Should we disable heavy features?
const shouldReduceAnimations = isMobile || isSlowDevice || prefersReducedMotion;

// Update intervals - SLOWER on mobile
const UPDATE_INTERVAL = isMobile ? 2000 : 500;
const VISUALIZER_THROTTLE = isMobile ? 100 : 16;  // 10fps on mobile, 60fps on desktop
const PARTICLE_COUNT = isMobile ? 10 : 40;        // Fewer particles on mobile

console.log(`📱 Device: ${isMobile ? 'Mobile' : 'Desktop'}`);
console.log(`⚡ Performance mode: ${shouldReduceAnimations ? 'POWER SAVING' : 'FULL'}`);

// Apply mobile class immediately
if (isMobile) {
    document.documentElement.classList.add('is-mobile');
    document.body.classList.add('mobile-device');
}

// Disable animations if needed
if (shouldReduceAnimations) {
    document.documentElement.classList.add('reduce-motion');
}

// ═══════════════════════════════════════════════════════════════
// AUDIO CONFIG - UNTOUCHED (Keep your original)
// ═══════════════════════════════════════════════════════════════
const AUDIO_CONFIG = {
    baseUrl: '/audio',
    
    audioFiles: [
        'day-1.webm', 'day-2.webm', 'day-3.webm', 'day-4.webm', 'day-5.webm',
        'day-6.webm', 'day-7.webm', 'day-8.webm', 'day-9.webm', 'day-10.webm',
        'day-11.webm', 'day-12.webm', 'day-13.webm', 'day-14.webm', 'day-15.webm',
        'day-16.webm', 'day-17.webm', 'day-18.webm', 'day-19.webm', 'day-20.webm',
        'day-21.webm', 'day-22.webm', 'day-23.webm', 'day-24.webm', 'day-25.webm',
        'day-26.webm', 'day-27.webm', 'day-28.webm', 'day-29.webm', 'day-30.webm',
        'day-31.webm', 'day-32.webm', 'day-33.webm', 'day-34.webm', 'day-35.webm',
        'day-36.webm', 'day-37.webm', 'day-38.webm', 'day-39.webm', 'day-40.webm'
    ],
    
    trackInfo: Array.from({ length: 40 }, (_, i) => ({
        title: `Day ${i + 1} - Gurbani Kirtan`,
        artist: 'Divine Shabad',
        estimatedDuration: 3600
    })),
    
    getAudioUrl(filename) {
        return `${this.baseUrl}/${filename}`;
    },
    
    getTrack(index) {
        const safeIndex = ((index % this.audioFiles.length) + this.audioFiles.length) % this.audioFiles.length;
        return {
            url: this.getAudioUrl(this.audioFiles[safeIndex]),
            info: this.trackInfo[safeIndex],
            index: safeIndex,
            filename: this.audioFiles[safeIndex]
        };
    },
    
    getRandomIndex(currentIndex = -1) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.audioFiles.length);
        } while (newIndex === currentIndex && this.audioFiles.length > 1);
        return newIndex;
    },
    
    get totalTracks() {
        return this.audioFiles.length;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const Utils = {
    debounce(fn, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    throttle(fn, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    animateValue(element, start, end, duration, suffix = '') {
        const range = end - start;
        const startTime = performance.now();
        const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutExpo(progress);
            const current = Math.round(start + (range * eased));
            
            if (element) element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    },

    formatTime(seconds) {
        if (!isFinite(seconds) || seconds < 0) return '0:00';
        
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },

    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    mapRange(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },

    generateId() {
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    haptic(style = 'light') {
        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30],
                success: [10, 50, 10],
                error: [50, 30, 50, 30, 50],
                warning: [30, 50, 30]
            };
            navigator.vibrate(patterns[style] || patterns.light);
        }
    },

    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('[Storage] Failed to save:', e);
                return false;
            }
        },
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('[Storage] Failed to remove:', e);
            }
        }
    },

    // NEW: Enhanced animation helpers
    // NEW: Enhanced animation helpers
    createRipple(element, event) {
        // ═══ DISABLE RIPPLE ON MOBILE ═══
        if (isMobile) {
            // Just do a simple opacity flash instead
            element.style.opacity = '0.7';
            setTimeout(() => {
                element.style.opacity = '1';
            }, 150);
            return;
        }
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(247, 198, 52, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-expand 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    },

    // NEW: Smooth counter animation
    animateCounter(element, targetValue, duration = 1500) {
        const startValue = parseInt(element.textContent) || 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startValue + (targetValue - startValue) * eased);
            
            element.textContent = this.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED EVENT EMITTER
// ═══════════════════════════════════════════════════════════════════════════════

class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
        }
    }

    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`[EventEmitter] Error in ${event}:`, e);
                }
            });
        }
    }

    once(event, callback) {
        const onceCallback = (data) => {
            this.off(event, onceCallback);
            callback(data);
        };
        this.on(event, onceCallback);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

class StateManager extends EventEmitter {
    constructor(initialState = {}) {
        super();
        this._state = new Proxy(initialState, {
            set: (target, property, value) => {
                const oldValue = target[property];
                target[property] = value;
                if (oldValue !== value) {
                    this.emit('change', { property, value, oldValue });
                    this.emit(`change:${property}`, { value, oldValue });
                }
                return true;
            }
        });
    }

    get state() {
        return this._state;
    }

    setState(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this._state[key] = value;
        });
    }

    subscribe(property, callback) {
        return this.on(`change:${property}`, callback);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIRTUAL LIVE MANAGER (AUDIO BACKEND - UNTOUCHED)
// ═══════════════════════════════════════════════════════════════════════════════

class VirtualLiveManager extends EventEmitter {
    constructor() {
        super();
        this.broadcastStartTime = this.loadBroadcastStart();
        this.trackDurations = new Map();
        this.defaultDuration = 3600;
        this.pausedAt = null;
        this.isLive = true;
        this.liveThreshold = 5;
        console.log('[VirtualLive] Initialized');
    }

    loadBroadcastStart() {
        let startTime = Utils.storage.get('broadcastStartTime');
        if (!startTime) {
            const now = new Date();
            startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
            Utils.storage.set('broadcastStartTime', startTime);
        }
        return startTime;
    }

    setTrackDuration(trackIndex, duration) {
        if (duration && isFinite(duration) && duration > 0) {
            this.trackDurations.set(trackIndex, duration);
        }
    }

    getTrackDuration(trackIndex) {
        return this.trackDurations.get(trackIndex) || 
               AUDIO_CONFIG.trackInfo[trackIndex]?.estimatedDuration || 
               this.defaultDuration;
    }

    getTotalPlaylistDuration() {
        let total = 0;
        for (let i = 0; i < AUDIO_CONFIG.totalTracks; i++) {
            total += this.getTrackDuration(i);
        }
        return total;
    }

    getCurrentLivePosition() {
        const now = Date.now();
        const elapsedSeconds = (now - this.broadcastStartTime) / 1000;
        const totalPlaylistDuration = this.getTotalPlaylistDuration();
        const positionInPlaylist = elapsedSeconds % totalPlaylistDuration;
        
        let accumulatedTime = 0;
        for (let i = 0; i < AUDIO_CONFIG.totalTracks; i++) {
            const trackDuration = this.getTrackDuration(i);
            if (accumulatedTime + trackDuration > positionInPlaylist) {
                return {
                    trackIndex: i,
                    position: positionInPlaylist - accumulatedTime,
                    totalElapsed: elapsedSeconds
                };
            }
            accumulatedTime += trackDuration;
        }
        
        return { trackIndex: 0, position: 0, totalElapsed: elapsedSeconds };
    }

    getPositionAfterElapsed(currentTrackIndex, currentPosition, elapsedSeconds) {
        let remainingSeconds = elapsedSeconds;
        let trackIndex = currentTrackIndex;
        let position = currentPosition;
        
        while (remainingSeconds > 0) {
            const trackDuration = this.getTrackDuration(trackIndex);
            const timeLeftInTrack = trackDuration - position;
            
            if (remainingSeconds < timeLeftInTrack) {
                position += remainingSeconds;
                remainingSeconds = 0;
            } else {
                remainingSeconds -= timeLeftInTrack;
                trackIndex = (trackIndex + 1) % AUDIO_CONFIG.totalTracks;
                position = 0;
            }
        }
        
        return { trackIndex, position };
    }

    onPause(currentTrackIndex, currentPosition) {
        this.pausedAt = {
            time: Date.now(),
            trackIndex: currentTrackIndex,
            position: currentPosition
        };
        this.isLive = false;
        this.emit('liveStatusChange', { isLive: false });
    }

    getResumePosition() {
        if (!this.pausedAt) return this.getCurrentLivePosition();
        
        const elapsedSeconds = (Date.now() - this.pausedAt.time) / 1000;
        const newPosition = this.getPositionAfterElapsed(
            this.pausedAt.trackIndex,
            this.pausedAt.position,
            elapsedSeconds
        );
        
        this.pausedAt = null;
        this.isLive = true;
        this.emit('liveStatusChange', { isLive: true });
        
        return newPosition;
    }

    goToLive() {
        this.pausedAt = null;
        this.isLive = true;
        this.emit('liveStatusChange', { isLive: true });
        return this.getCurrentLivePosition();
    }

    checkIfLive(currentTrackIndex, currentPosition) {
        const livePos = this.getCurrentLivePosition();
        if (currentTrackIndex !== livePos.trackIndex) {
            this.isLive = false;
        } else {
            const diff = Math.abs(currentPosition - livePos.position);
            this.isLive = diff < this.liveThreshold;
        }
        return this.isLive;
    }

    resetBroadcast() {
        this.broadcastStartTime = Date.now();
        Utils.storage.set('broadcastStartTime', this.broadcastStartTime);
        this.pausedAt = null;
        this.isLive = true;
        this.emit('broadcastReset');
        this.emit('liveStatusChange', { isLive: true });
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIO ENGINE (BACKEND - COMPLETELY UNTOUCHED)
// ═══════════════════════════════════════════════════════════════════════════════

class AudioEngine extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            autoPlay: config.autoPlay !== false,
            shuffle: config.shuffle || false,
            repeat: config.repeat || 'all',
            fftSize: config.fftSize || 256,
            virtualLive: config.virtualLive !== false,
            ...config
        };

        this.audio = null;
        this.audioContext = null;
        this.analyser = null;
        this.gainNode = null;
        this.sourceNode = null;
        this.frequencyData = null;
        this.timeDomainData = null;
        this.currentTrackIndex = 0;
        this.playlist = [...Array(AUDIO_CONFIG.totalTracks).keys()];
        this.playHistory = [];
        this.isPlaying = false;
        this.isBuffering = false;
        this.isLoading = false;
        this.isMuted = false;
        this.volume = Utils.storage.get('volume', 0.8);
        this.currentTime = 0;
        this.duration = 0;
        this.shuffle = Utils.storage.get('shuffle', false);
        this.repeat = Utils.storage.get('repeat', 'all');
        this.virtualLive = new VirtualLiveManager();
        this.isLive = true;
        this.corsEnabled = false;
        this.corsAttempted = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.retryDelay = 2000;

        this._onTimeUpdate = this._onTimeUpdate.bind(this);
        
        this.virtualLive.on('liveStatusChange', (data) => {
            this.isLive = data.isLive;
            this.emit('liveStatusChange', data);
        });
    }

    async initialize() {
        if (this.audioContext) return;

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContextClass();

            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.config.fftSize;
            this.analyser.smoothingTimeConstant = 0.8;

            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this.volume;

            this.gainNode.connect(this.audioContext.destination);
            this.analyser.connect(this.gainNode);

            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
            this.timeDomainData = new Uint8Array(this.analyser.fftSize);

            this.emit('initialized');
        } catch (error) {
            console.error('[AudioEngine] Failed to initialize:', error);
        }
    }

    _onTimeUpdate() {
        if (!this.audio) return;
        this.currentTime = this.audio.currentTime;
        const progress = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
        
        if (this.config.virtualLive && this.isPlaying) {
            this.virtualLive.checkIfLive(this.currentTrackIndex, this.currentTime);
        }
        
        this.emit('timeupdate', { 
            currentTime: this.currentTime, 
            duration: this.duration,
            progress,
            formattedCurrent: Utils.formatTime(this.currentTime),
            formattedDuration: Utils.formatTime(this.duration),
            isLive: this.isLive
        });
    }

    createAudioElement(useCORS = false) {
        this.destroyAudioElement();

        this.audio = new Audio();
        this.audio.preload = 'auto';
        this.audio.volume = this.volume;
        
        if (useCORS) {
            this.audio.crossOrigin = 'anonymous';
            this.corsEnabled = true;
        } else {
            this.corsEnabled = false;
        }

        this._attachAudioEvents();
        return this.audio;
    }

    destroyAudioElement() {
        if (this.audio) {
            this.audio.pause();
            this.audio.removeEventListener('timeupdate', this._onTimeUpdate);
            this.audio.removeAttribute('src');
            this.audio.load();
            
            if (this.sourceNode) {
                try { this.sourceNode.disconnect(); } catch (e) {}
                this.sourceNode = null;
            }

            this.audio = null;
        }
    }

    _connectToWebAudio() {
        if (!this.audioContext || !this.audio || this.sourceNode) return;
        if (!this.corsEnabled) return;

        try {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
            this.sourceNode.connect(this.analyser);
        } catch (error) {
            console.warn('[AudioEngine] Web Audio connection failed:', error);
        }
    }

    _attachAudioEvents() {
        if (!this.audio) return;

        this.audio.addEventListener('loadstart', () => {
            this.isLoading = true;
            this.emit('loading');
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.audio.duration;
            this.virtualLive.setTrackDuration(this.currentTrackIndex, this.duration);
            this.emit('durationchange', { duration: this.duration });
        });

        this.audio.addEventListener('loadeddata', () => {
            this._connectToWebAudio();
        });

        this.audio.addEventListener('canplay', () => {
            this.isBuffering = false;
            this.isLoading = false;
            this.emit('canplay');
        });

        this.audio.addEventListener('playing', () => {
            this.isPlaying = true;
            this.isLoading = false;
            this.isBuffering = false;
            this.retryCount = 0;
            this.emit('playing', this.getCurrentTrackInfo());
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            if (this.config.virtualLive && this.audio) {
                this.virtualLive.onPause(this.currentTrackIndex, this.audio.currentTime);
            }
            this.emit('paused');
        });

        this.audio.addEventListener('waiting', () => {
            this.isBuffering = true;
            this.emit('buffering');
        });

        this.audio.addEventListener('seeking', () => this.emit('seeking'));
        this.audio.addEventListener('seeked', () => this.emit('seeked'));

        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this._handleTrackEnded();
        });

        this.audio.addEventListener('error', (e) => {
            this._handleError(this.audio?.error);
        });

        this.audio.addEventListener('timeupdate', this._onTimeUpdate);
        this.audio.addEventListener('volumechange', () => {
            this.emit('volumechange', { volume: this.audio?.volume || 0 });
        });

        this.audio.addEventListener('progress', () => {
            if (this.audio?.buffered.length > 0) {
                const bufferedEnd = this.audio.buffered.end(this.audio.buffered.length - 1);
                const bufferedPercent = (bufferedEnd / this.audio.duration) * 100;
                this.emit('bufferprogress', { percent: bufferedPercent, bufferedEnd });
            }
        });
    }

    _handleTrackEnded() {
        this.emit('ended');
        if (this.config.virtualLive) {
            this.next();
            return;
        }
        switch (this.repeat) {
            case 'one': this.play(); break;
            case 'all': this.next(); break;
            case 'none':
                if (this.hasNext()) this.next();
                else this.emit('playlistEnded');
                break;
        }
    }

    getCurrentTrackInfo() {
        const track = AUDIO_CONFIG.getTrack(this.currentTrackIndex);
        return {
            ...track.info,
            index: this.currentTrackIndex,
            total: AUDIO_CONFIG.totalTracks,
            url: track.url,
            filename: track.filename,
            isLive: this.isLive
        };
    }

    async loadTrack(index, autoPlay = true, seekPosition = 0) {
        try {
            await this.initialize();

            const track = AUDIO_CONFIG.getTrack(index);
            this.currentTrackIndex = track.index;

            this.playHistory.push(track.index);
            if (this.playHistory.length > 50) this.playHistory.shift();

            Utils.storage.set('lastTrackIndex', track.index);

            this.createAudioElement(false);
            this.audio.src = track.url;
            this.audio.load();

            this.emit('trackchange', this.getCurrentTrackInfo());

            if (seekPosition > 0) {
                await new Promise((resolve) => {
                    const onLoaded = () => {
                        this.audio.removeEventListener('loadedmetadata', onLoaded);
                        this.audio.currentTime = Math.min(seekPosition, this.audio.duration - 1);
                        resolve();
                    };
                    this.audio.addEventListener('loadedmetadata', onLoaded);
                });
            }

            if (autoPlay) await this.audio.play();
        } catch (error) {
            this._handleError(error);
        }
    }

    async play() {
        if (this.config.virtualLive && this.virtualLive.pausedAt) {
            const resumePos = this.virtualLive.getResumePosition();
            
            if (resumePos.trackIndex !== this.currentTrackIndex) {
                await this.loadTrack(resumePos.trackIndex, true, resumePos.position);
            } else if (this.audio) {
                this.audio.currentTime = Math.min(resumePos.position, this.duration - 1);
                await this.audio.play();
            } else {
                await this.loadTrack(resumePos.trackIndex, true, resumePos.position);
            }
            
            this.isLive = true;
            this.emit('liveStatusChange', { isLive: true });
            return;
        }

        if (this.audio && this.audio.src) {
            try {
                if (this.audioContext?.state === 'suspended') {
                    await this.audioContext.resume();
                }
                await this.audio.play();
            } catch (error) {
                await this.loadTrack(this.currentTrackIndex, true);
            }
        } else {
            await this.loadTrack(this.currentTrackIndex, true);
        }
    }

    async startLive() {
        const livePos = this.virtualLive.getCurrentLivePosition();
        this.isLive = true;
        await this.loadTrack(livePos.trackIndex, true, livePos.position);
        this.emit('liveStatusChange', { isLive: true });
    }

    async goLive() {
        const livePos = this.virtualLive.goToLive();
        
        if (livePos.trackIndex !== this.currentTrackIndex) {
            await this.loadTrack(livePos.trackIndex, true, livePos.position);
        } else if (this.audio) {
            this.audio.currentTime = Math.min(livePos.position, this.duration - 1);
            if (!this.isPlaying) await this.audio.play();
        }
        
        this.isLive = true;
        this.emit('liveStatusChange', { isLive: true });
    }

    pause() {
        if (this.audio) this.audio.pause();
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        this.isPlaying = false;
        this.isLoading = false;
        this.isBuffering = false;
        this.currentTime = 0;
        this.virtualLive.pausedAt = null;
        this.emit('stopped');
    }

    async toggle() {
        if (this.isPlaying) this.pause();
        else await this.play();
    }

    async next() {
        let nextIndex = this.shuffle 
            ? AUDIO_CONFIG.getRandomIndex(this.currentTrackIndex)
            : (this.currentTrackIndex + 1) % AUDIO_CONFIG.totalTracks;
        
        this.virtualLive.pausedAt = null;
        this.isLive = true;
        await this.loadTrack(nextIndex, true);
    }

    async previous() {
        if (this.currentTime > 3) {
            this.seek(0);
            return;
        }

        let prevIndex;
        if (this.playHistory.length > 1) {
            this.playHistory.pop();
            prevIndex = this.playHistory.pop();
        } else if (this.shuffle) {
            prevIndex = AUDIO_CONFIG.getRandomIndex(this.currentTrackIndex);
        } else {
            prevIndex = (this.currentTrackIndex - 1 + AUDIO_CONFIG.totalTracks) % AUDIO_CONFIG.totalTracks;
        }
        
        this.virtualLive.pausedAt = null;
        await this.loadTrack(prevIndex, true);
    }

    hasNext() {
        if (this.repeat === 'all' || this.shuffle) return true;
        return this.currentTrackIndex < AUDIO_CONFIG.totalTracks - 1;
    }

    hasPrevious() {
        if (this.repeat === 'all' || this.shuffle) return true;
        return this.currentTrackIndex > 0 || this.currentTime > 3;
    }

    seek(value, isSeconds = false) {
        if (!this.audio || !this.duration) return;

        let seekTime = isSeconds ? Utils.clamp(value, 0, this.duration) : (value / 100) * this.duration;
        this.audio.currentTime = seekTime;
        
        if (this.config.virtualLive) {
            this.isLive = false;
            this.virtualLive.isLive = false;
            this.emit('liveStatusChange', { isLive: false });
        }
    }

    setVolume(value) {
        this.volume = Utils.clamp(value, 0, 1);
        if (this.audio) this.audio.volume = this.volume;
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        }
        Utils.storage.set('volume', this.volume);
        this.emit('volumechange', { volume: this.volume });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.audio) this.audio.muted = this.isMuted;
        this.emit('mutechange', { muted: this.isMuted });
        return this.isMuted;
    }

    toggleShuffle() {
        this.shuffle = !this.shuffle;
        Utils.storage.set('shuffle', this.shuffle);
        this.emit('shufflechange', { shuffle: this.shuffle });
        return this.shuffle;
    }

    cycleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeat);
        this.repeat = modes[(currentIndex + 1) % modes.length];
        Utils.storage.set('repeat', this.repeat);
        this.emit('repeatchange', { repeat: this.repeat });
        return this.repeat;
    }

    setRepeat(mode) {
        if (['none', 'all', 'one'].includes(mode)) {
            this.repeat = mode;
            Utils.storage.set('repeat', this.repeat);
            this.emit('repeatchange', { repeat: this.repeat });
        }
    }

    getFrequencyData() {
        if (this.analyser && this.frequencyData && this.isPlaying && this.corsEnabled) {
            this.analyser.getByteFrequencyData(this.frequencyData);
            return this.frequencyData;
        }
        return new Uint8Array(128).fill(0);
    }

    getTimeDomainData() {
        if (this.analyser && this.timeDomainData && this.isPlaying && this.corsEnabled) {
            this.analyser.getByteTimeDomainData(this.timeDomainData);
            return this.timeDomainData;
        }
        return new Uint8Array(128).fill(128);
    }

    getAverageFrequency() {
        const data = this.getFrequencyData();
        return data.reduce((acc, val) => acc + val, 0) / data.length;
    }

    getBassLevel() {
        const data = this.getFrequencyData();
        const bassRange = Math.floor(data.length * 0.1);
        let sum = 0;
        for (let i = 0; i < bassRange; i++) sum += data[i];
        return sum / bassRange / 255;
    }

    _handleError(error) {
        this.isPlaying = false;
        this.isLoading = false;

        let errorInfo = { type: 'unknown', message: 'Unknown error', recoverable: true };

        if (error instanceof MediaError) {
            switch (error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    errorInfo = { type: 'aborted', message: 'Playback aborted', recoverable: false };
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    errorInfo = { type: 'network', message: 'Network error', recoverable: true };
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    errorInfo = { type: 'decode', message: 'Cannot decode audio', recoverable: true };
                    break;
                                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorInfo = { type: 'source', message: 'Format not supported', recoverable: false };
                    break;
            }
        } else if (error?.name === 'NotAllowedError') {
            errorInfo = { type: 'permission', message: 'Click play to start', recoverable: false };
        } else if (error?.name === 'NotSupportedError') {
            errorInfo = { type: 'unsupported', message: 'Audio could not load', recoverable: true };
        }

        this.emit('error', errorInfo);

        if (errorInfo.recoverable && this.retryCount < this.maxRetries) {
            this.retryCount++;
            setTimeout(() => this.loadTrack(this.currentTrackIndex, true), this.retryDelay * this.retryCount);
        }
    }

    destroy() {
        this.stop();
        this.destroyAudioElement();
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.analyser = null;
        this.gainNode = null;
        this.frequencyData = null;
        this.timeDomainData = null;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED VISUALIZER ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED VISUALIZER ENGINE - MOBILE OPTIMIZED
// ═══════════════════════════════════════════════════════════════════════════════

class VisualizerEngine {
    constructor(audioEngine, options = {}) {
        this.audioEngine = audioEngine;
        this.options = {
            barCount: options.barCount || 12,
            sensitivity: options.sensitivity || 1.8,
            smoothing: options.smoothing || 0.75,
            minHeight: options.minHeight || 6,
            maxHeight: options.maxHeight || 45,
            glowIntensity: options.glowIntensity || 1,
            ...options
        };

        this.bars = [];
        this.previousHeights = [];
        this.isActive = false;
        this.animationId = null;
        this.beatThreshold = 0.55;
        this.lastBeat = 0;
        this.beatCooldown = 120;
        this.colorPhase = 0;
        
        // ═══ MOBILE OPTIMIZATION ═══
        this.lastAnimationTime = 0;
        this.frameSkip = isMobile ? 3 : 0;  // Skip frames on mobile
        this.frameCount = 0;

        this.init();
    }

    init() {
        const container = document.getElementById('visualizer') || document.querySelector('.sacred-visualizer');
        if (container) {
            this.bars = Array.from(container.querySelectorAll('.viz-bar'));
            this.previousHeights = new Array(this.bars.length).fill(this.options.minHeight);
        }

        this.audioEngine.on('playing', () => this.start());
        this.audioEngine.on('paused', () => this.stop());
        this.audioEngine.on('stopped', () => this.stop());
    }

start() {
    // ═══ COMPLETELY DISABLE ON MOBILE ═══
    if (isMobile || shouldReduceAnimations) {
        // Don't animate anything on mobile
        return;
    }
    
    if (this.isActive) return;
    
    this.isActive = true;
    this.animate();
}

    // ═══ NEW: Static bars for mobile (no animation, no lag!) ═══
    setStaticBars() {
        this.bars.forEach((bar, index) => {
            const height = this.options.minHeight + (index % 3) * 8;
            bar.style.height = `${height}px`;
            bar.style.transition = 'none';
            bar.style.animation = 'none';
            bar.style.boxShadow = '0 0 10px rgba(247, 198, 52, 0.3)';
        });
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        this.bars.forEach((bar) => {
            bar.style.height = `${this.options.minHeight}px`;
            bar.style.boxShadow = 'none';
            bar.style.background = '';
        });
    }

    animate() {
        if (!this.isActive) return;

        // ═══ FRAME THROTTLING FOR MOBILE ═══
        const now = performance.now();
        
        // Skip frames on mobile to reduce CPU usage
        if (isMobile) {
            this.frameCount++;
            if (this.frameCount % (this.frameSkip + 1) !== 0) {
                this.animationId = requestAnimationFrame(() => this.animate());
                return;
            }
            
            // Also limit by time (minimum 50ms between frames on mobile = 20fps max)
            if (now - this.lastAnimationTime < 50) {
                this.animationId = requestAnimationFrame(() => this.animate());
                return;
            }
        }
        
        this.lastAnimationTime = now;

        const frequencyData = this.audioEngine.getFrequencyData();
        const dataLength = frequencyData.length;
        this.colorPhase += 0.01;
        
        this.bars.forEach((bar, index) => {
            const start = Math.floor(index * dataLength / this.bars.length);
            const end = Math.floor((index + 1) * dataLength / this.bars.length);
            
            let sum = 0;
            for (let i = start; i < end; i++) {
                sum += frequencyData[i];
            }
            const average = sum / (end - start);
            
            const normalized = (average / 255) * this.options.sensitivity;
            
            const targetHeight = Utils.mapRange(
                normalized, 0, 1,
                this.options.minHeight,
                this.options.maxHeight
            );
            
            const smoothedHeight = Utils.lerp(
                this.previousHeights[index],
                targetHeight,
                1 - this.options.smoothing
            );
            
            this.previousHeights[index] = smoothedHeight;
            
            bar.style.height = `${smoothedHeight}px`;
            
            // ═══ SIMPLER EFFECTS ON MOBILE ═══
            if (isMobile) {
                // Simple glow, no color shift (saves CPU)
                bar.style.boxShadow = `0 0 ${normalized * 15}px rgba(247, 198, 52, 0.5)`;
            } else {
                // Full effects on desktop
                const intensity = normalized * this.options.glowIntensity;
                const hue = (40 + Math.sin(this.colorPhase + index * 0.3) * 15) % 360;
                bar.style.boxShadow = `0 0 ${intensity * 25}px hsla(${hue}, 80%, 55%, ${intensity * 0.7})`;
                bar.style.background = `linear-gradient(to top, hsl(${hue}, 70%, 45%), hsl(${hue + 10}, 80%, 60%))`;
            }
        });

        // ═══ SKIP BEAT DETECTION ON MOBILE ═══
        if (!isMobile) {
            this.detectBeat();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    detectBeat() {
        const now = performance.now();
        if (now - this.lastBeat < this.beatCooldown) return;

        const bassLevel = this.audioEngine.getBassLevel();
        
        if (bassLevel > this.beatThreshold) {
            this.lastBeat = now;
            this.onBeat(bassLevel);
        }
    }

    onBeat(intensity) {
        // ═══ SKIP BEAT EFFECTS ON MOBILE ═══
        if (isMobile) return;
        
        this.audioEngine.emit('beat', { intensity });

        const sacredImage = document.querySelector('.sacred-image');
        const sacredFrame = document.querySelector('.sacred-frame');
        
        if (sacredImage && !prefersReducedMotion) {
            sacredImage.style.transform = `scale(${1 + intensity * 0.05})`;
            setTimeout(() => {
                sacredImage.style.transform = 'scale(1)';
            }, 120);
        }

        if (sacredFrame && !prefersReducedMotion) {
            sacredFrame.style.boxShadow = `0 0 ${50 + intensity * 30}px rgba(247, 198, 52, ${0.5 + intensity * 0.3})`;
            setTimeout(() => {
                sacredFrame.style.boxShadow = '';
            }, 150);
        }
    }

    setOptions(options) {
        this.options = { ...this.options, ...options };
    }

    destroy() {
        this.stop();
        this.bars = [];
        this.previousHeights = [];
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED PARTICLE SYSTEM - MOBILE OPTIMIZED
// ═══════════════════════════════════════════════════════════════════════════════

class ParticleSystem {
    constructor(container, options = {}) {
    // ═══ COMPLETELY DISABLE ON MOBILE ═══
    if (isMobile || shouldReduceAnimations) {
        console.log('[Particles] Disabled for mobile performance');
        this.particles = [];
        this.isActive = false;
        return;
    }
    
    this.container = typeof container === 'string' 
        ? document.getElementById(container) 
        : container;
    
    const particleCount = options.count || 40;
   
        
        this.options = {
            count: particleCount,
            colors: options.colors || ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#F4E04D'],
            minSize: isMobile ? 3 : (options.minSize || 2),  // Slightly larger on mobile (fewer but visible)
            maxSize: isMobile ? 5 : (options.maxSize || 7),
            minDuration: isMobile ? 20 : (options.minDuration || 12),  // Slower on mobile
            maxDuration: isMobile ? 40 : (options.maxDuration || 30),
            glowEnabled: isMobile ? false : (options.glowEnabled !== false),  // No glow on mobile
            ...options
        };

        this.particles = [];
        this.isActive = false;

        // ═══ COMPLETELY DISABLE ON VERY SLOW DEVICES ═══
        if (shouldReduceAnimations) {
            console.log('[Particles] Disabled for performance');
            return;
        }

        if (this.container) {
            this.init();
        }
    }

    init() {
        if (shouldReduceAnimations) return;
        
        // Clear existing
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.particles = [];

        for (let i = 0; i < this.options.count; i++) {
            this.createParticle();
        }

        this.isActive = true;
    }

    createParticle() {
        if (shouldReduceAnimations) return;
        
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Utils.random(this.options.minSize, this.options.maxSize);
        const duration = Utils.random(this.options.minDuration, this.options.maxDuration);
        const delay = Utils.random(0, duration);
        const x = Utils.random(0, 100);
        const drift = Utils.random(-30, 30);
        const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];

        // ═══ SIMPLER STYLES ON MOBILE ═══
        const boxShadow = this.options.glowEnabled ? `0 0 ${size * 3}px ${color}` : 'none';
        
        Object.assign(particle.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}%`,
            bottom: '-20px',
            background: isMobile ? color : `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            borderRadius: '50%',
            opacity: '0',
            boxShadow: boxShadow,
            animation: `particle-float ${duration}s ease-in-out ${delay}s infinite`,
            '--drift': `${drift}px`,
            pointerEvents: 'none',
            zIndex: '1',
            willChange: isMobile ? 'auto' : 'transform, opacity'  // Disable willChange on mobile
        });

        if (this.container) {
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    setIntensity(intensity) {
        // ═══ DISABLE INTENSITY CHANGES ON MOBILE ═══
        if (isMobile) return;
        
        const targetCount = Math.floor(this.options.count * (0.5 + intensity * 0.7));
        
        while (this.particles.length < targetCount && this.particles.length < this.options.count * 2) {
            this.createParticle();
        }
    }

    pause() {
        this.particles.forEach(p => {
            p.style.animationPlayState = 'paused';
        });
    }

    resume() {
        if (shouldReduceAnimations) return;
        
        this.particles.forEach(p => {
            p.style.animationPlayState = 'running';
        });
    }

    destroy() {
        this.particles.forEach(p => p.remove());
        this.particles = [];
        this.isActive = false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENHANCED UI CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════════

class UIController extends EventEmitter {
    constructor(audioEngine, stateManager) {
        super();
        
        this.audio = audioEngine;
        this.state = stateManager;
        
        this.elements = {};
        this.isDraggingProgress = false;
        this.toastQueue = [];
        this.isShowingToast = false;
        this.firstPlay = true;
        this.listenerCount = 1247;
        this.listenerUpdateInterval = null;

        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupProgressBar();
        this.setupMagneticButtons();
        this.setupKeyboardShortcuts();
        this.setupAudioEventListeners();
        this.loadSavedState();
        this.hideLoadingScreen();
        this.setupLiveButton();
        this.startListenerSimulation();
        this.setupEnhancedAnimations();
    }

    cacheElements() {
        const ids = [
            'playBtn', 'playIcon', 'prevBtn', 'nextBtn', 'shuffleBtn', 'repeatBtn',
            'volumeBtn', 'volumeSlider', 'volumeValue', 'volumePopup', 'volumeFill',
            'shabadTitle', 'shabadArtist', 'trackNumber',
            'currentTime', 'totalTime', 'progressContainer', 'progressFill', 'progressGlow', 'progressScrubber',
            'loadingScreen', 'toast', 'toastMessage', 'toastIcon',
            'scheduleBtn', 'scheduleModal', 'closeScheduleModal',
            'shareBtn', 'shareModal', 'closeShareModal',
            'favoriteBtn', 'infoBtn', 'copyLinkBtn', 'liveBtn',
            'visualizer', 'albumArt', 'sacredImage', 'listenerCount',
            'shareWhatsapp', 'shareTelegram', 'shareFacebook', 'shareTwitter',
'notesCard', 'notesModal', 'closeNotesModal', 'notesTextarea', 'saveNotesBtn', 'clearNotesBtn',
'randomShabadCard', 'shabadModal', 'closeShabadModal', 'shabadContainer', 'shabadLoading', 
'shabadContent', 'shabadError', 'shabadAng', 'shabadGurmukhi', 'shabadTransliteration', 
'shabadTranslation', 'shabadSource', 'newShabadBtn', 'copyShabadBtn'
        ];

        ids.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });

        // Query selectors for elements without IDs
        this.elements.statusLive = document.querySelector('.status-item--live');
        this.elements.statusListeners = document.querySelector('.status-item--listeners');
        this.elements.playerCard = document.querySelector('.player__card');
        this.elements.sacredFrame = document.querySelector('.sacred-frame');
        this.elements.sacredGlow = document.querySelector('.sacred-image-glow');
        this.elements.trackInfoWaveform = document.querySelector('.track-info__waveform');
        this.elements.qualityBars = document.querySelectorAll('.quality-bars span');
    }
    
    startListenerSimulation() {
        // ═══ SLOWER UPDATES ON MOBILE ═══
        const updateInterval = isMobile ? 15000 : 5000;  // 15 seconds on mobile, 5 on desktop
        
        this.listenerUpdateInterval = setInterval(() => {
            const change = Math.floor(Utils.random(-5, 8));
            this.listenerCount = Math.max(100, this.listenerCount + change);
            
            const listenerEl = this.elements.listenerCount || document.querySelector('.status-item__value');
            if (listenerEl) {
                listenerEl.textContent = Utils.formatNumber(this.listenerCount);
            }
        }, updateInterval);
    }

    setupEnhancedAnimations() {
        // Add ripple styles if not present
        if (!document.getElementById('enhanced-ui-styles')) {
            const style = document.createElement('style');
            style.id = 'enhanced-ui-styles';
            style.textContent = `
                @keyframes ripple-expand {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(4); opacity: 0; }
                }
                
                @keyframes particle-float {
                    0% {
                        transform: translateY(0) translateX(0) scale(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.8;
                        transform: translateY(-10vh) translateX(calc(var(--drift) * 0.3)) scale(1);
                    }
                    90% {
                        opacity: 0.4;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(var(--drift)) scale(0.5);
                        opacity: 0;
                    }
                }

                @keyframes toast-slide-in {
                    0% { transform: translateX(-50%) translateY(100px); opacity: 0; }
                    100% { transform: translateX(-50%) translateY(0); opacity: 1; }
                }

                @keyframes toast-slide-out {
                    0% { transform: translateX(-50%) translateY(0); opacity: 1; }
                    100% { transform: translateX(-50%) translateY(100px); opacity: 0; }
                }

                @keyframes button-press {
                    0% { transform: scale(1); }
                    50% { transform: scale(0.92); }
                    100% { transform: scale(1); }
                }

                @keyframes glow-pulse-active {
                    0%, 100% { opacity: 0.6; filter: blur(25px); }
                    50% { opacity: 1; filter: blur(35px); }
                }

                .btn-press-animation {
                    animation: button-press 0.2s ease-out;
                }

                .live-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1));
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    border-radius: 20px;
                    color: #ef4444;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    text-transform: uppercase;
                }

                .live-btn:hover {
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.2));
                    transform: scale(1.05);
                    box-shadow: 0 0 25px rgba(239, 68, 68, 0.3);
                }

                .live-btn--active {
                    box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
                }

                .live-btn--inactive {
                    background: rgba(100, 100, 100, 0.15);
                    border-color: rgba(100, 100, 100, 0.3);
                    color: #888;
                }

                .live-btn__pulse {
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    animation: live-pulse 1.5s ease-in-out infinite;
                    box-shadow: 0 0 10px #ef4444;
                }

                .live-btn--inactive .live-btn__pulse {
                    display: none;
                }

                @keyframes live-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0.6; }
                }

                /* Enhanced hover effects */
                .control-btn--secondary:hover .control-btn__bg {
                    background: rgba(247, 198, 52, 0.12) !important;
                    border-color: rgba(247, 198, 52, 0.35) !important;
                    box-shadow: 0 0 25px rgba(247, 198, 52, 0.2) !important;
                }

                .bento-card:hover .bento-card__icon {
                    animation: icon-bounce 0.5s ease;
                }

                @keyframes icon-bounce {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.15) rotate(-3deg); }
                    75% { transform: scale(1.15) rotate(3deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupLiveButton() {
        // Create Live button if not in HTML
        let liveBtn = this.elements.liveBtn;
        
        if (!liveBtn) {
            liveBtn = document.createElement('button');
            liveBtn.id = 'liveBtn';
            liveBtn.className = 'live-btn live-btn--active';
            liveBtn.innerHTML = `
                <span class="live-btn__pulse"></span>
                <span class="live-btn__text">LIVE</span>
            `;
            liveBtn.title = 'Go to Live';
            liveBtn.setAttribute('aria-label', 'Go to Live broadcast');
            
            // Insert into progress time section
            const progressTime = document.querySelector('.progress-time');
            const liveIndicator = document.querySelector('.progress-time__live');
            if (progressTime && liveIndicator) {
                liveIndicator.parentNode.replaceChild(liveBtn, liveIndicator);
            }
            
            this.elements.liveBtn = liveBtn;
        }

        if (this.elements.liveBtn) {
            this.elements.liveBtn.addEventListener('click', async () => {
                this.elements.liveBtn.classList.add('btn-press-animation');
                Utils.haptic('medium');
                await this.audio.goLive();
                this.showToast('🔴 Jumped to LIVE', 'success');
                setTimeout(() => {
                    this.elements.liveBtn.classList.remove('btn-press-animation');
                }, 200);
            });
        }
    }

    updateLiveStatus(isLive) {
        const { liveBtn, statusLive } = this.elements;

        if (liveBtn) {
            liveBtn.classList.toggle('live-btn--active', isLive);
            liveBtn.classList.toggle('live-btn--inactive', !isLive);
            liveBtn.title = isLive ? 'Currently Live' : 'Click to go Live';
        }

        if (statusLive) {
            const dot = statusLive.querySelector('.status-item__dot');
            const label = statusLive.querySelector('.status-item__label');
            if (dot) {
                dot.style.background = isLive ? '#ef4444' : '#888';
                dot.style.boxShadow = isLive ? '0 0 10px #ef4444' : 'none';
            }
            if (label) {
                label.style.color = isLive ? '#ef4444' : '#888';
            }
        }
    }

    setupEventListeners() {
        // Play Button
        this.addClickHandler('playBtn', async (e) => {
            Utils.createRipple(this.elements.playBtn, e);
            Utils.haptic('medium');
            
            if (this.firstPlay && !this.audio.isPlaying) {
                this.firstPlay = false;
                await this.audio.startLive();
            } else {
                await this.audio.toggle();
            }
        });

        // Previous Button
        this.addClickHandler('prevBtn', (e) => {
            Utils.createRipple(e.currentTarget, e);
            Utils.haptic('light');
            this.audio.previous();
        });

        // Next Button
        this.addClickHandler('nextBtn', (e) => {
            Utils.createRipple(e.currentTarget, e);
            Utils.haptic('light');
            this.audio.next();
        });

                // Shuffle Button
        this.addClickHandler('shuffleBtn', (e) => {
            Utils.createRipple(e.currentTarget, e);
            Utils.haptic('light');
            const isShuffled = this.audio.toggleShuffle();
            this.updateShuffleButton(isShuffled);
            this.showToast(isShuffled ? '🔀 Shuffle On' : '🔀 Shuffle Off', 'info');
        });

        // Repeat Button
        this.addClickHandler('repeatBtn', (e) => {
            Utils.createRipple(e.currentTarget, e);
            Utils.haptic('light');
            const mode = this.audio.cycleRepeat();
            this.updateRepeatButton(mode);
            const messages = { none: '➡️ Repeat Off', all: '🔁 Repeat All', one: '🔂 Repeat One' };
            this.showToast(messages[mode], 'info');
        });

        // Volume Button
        this.addClickHandler('volumeBtn', (e) => {
            e.stopPropagation();
            this.toggleVolumePopup();
        });

        // Volume Slider
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.addEventListener('input', (e) => {
                const value = e.target.value / 100;
                this.audio.setVolume(value);
                this.updateVolumeUI(value);
            });
        }

        // Click outside to close volume popup
        document.addEventListener('click', (e) => {
            const volumePopup = this.elements.volumePopup;
            const volumeBtn = this.elements.volumeBtn;
             if (volumePopup && !volumePopup.contains(e.target) && !volumeBtn?.contains(e.target)) {
            volumePopup.setAttribute('data-visible', 'false');
            volumePopup.classList.remove('volume-popup--visible');
        }
        });

        // Favorite Button
        this.addClickHandler('favoriteBtn', (e) => {
            Utils.createRipple(e.currentTarget, e);
            Utils.haptic('success');
            this.toggleFavorite();
        });

        // Info Button
        this.addClickHandler('infoBtn', (e) => {
            Utils.createRipple(e.currentTarget, e);
            this.showTrackInfo();
        });

        // Schedule Modal
        this.addClickHandler('scheduleBtn', () => {
            this.openModal('scheduleModal');
        });

        this.addClickHandler('closeScheduleModal', () => {
            this.closeModal('scheduleModal');
        });

        // Share Modal
        this.addClickHandler('shareBtn', () => {
            this.openModal('shareModal');
        });

        this.addClickHandler('closeShareModal', () => {
            this.closeModal('shareModal');
        });

        // Notes Modal
this.addClickHandler('notesCard', () => {
    this.openModal('notesModal');
    this.loadNotes();
});

this.addClickHandler('closeNotesModal', () => {
    this.closeModal('notesModal');
});

this.addClickHandler('saveNotesBtn', () => {
    this.saveNotes();
});

this.addClickHandler('clearNotesBtn', () => {
    this.clearNotes();
});
// Random Shabad Modal
this.addClickHandler('randomShabadCard', () => {
    this.openModal('shabadModal');
    this.fetchRandomShabad();
});

this.addClickHandler('closeShabadModal', () => {
    this.closeModal('shabadModal');
});

this.addClickHandler('newShabadBtn', () => {
    this.fetchRandomShabad();
});

this.addClickHandler('copyShabadBtn', () => {
    this.copyShabad();
});

        // Copy Link
        this.addClickHandler('copyLinkBtn', async () => {
            try {
                await navigator.clipboard.writeText(window.location.href);
                Utils.haptic('success');
                this.showToast('🔗 Link copied!', 'success');
            } catch (e) {
                this.showToast('❌ Copy failed', 'error');
            }
        });

        // Share buttons
        this.setupShareButtons();

        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        

        // Close modals on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.modal--open').forEach(modal => {
                    this.closeModal(modal.id);
                });
            }
        });
    }
    loadNotes() {
    const { notesTextarea } = this.elements;
    if (notesTextarea) {
        const savedNotes = Utils.storage.get('userNotes', '');
        notesTextarea.value = savedNotes;
    }
}

saveNotes() {
    const { notesTextarea } = this.elements;
    if (notesTextarea) {
        Utils.storage.set('userNotes', notesTextarea.value);
        Utils.haptic('success');
        this.showToast('📝 Notes saved!', 'success');
    }
}

clearNotes() {
    const { notesTextarea } = this.elements;
    if (notesTextarea) {
        if (confirm('Are you sure you want to clear all notes?')) {
            notesTextarea.value = '';
            Utils.storage.remove('userNotes');
            Utils.haptic('warning');
            this.showToast('🗑️ Notes cleared', 'info');
        }
    }
}
async fetchRandomShabad() {
    const { shabadLoading, shabadContent, shabadError } = this.elements;
    
    // Show loading, hide others
    if (shabadLoading) shabadLoading.style.display = 'flex';
    if (shabadContent) shabadContent.style.display = 'none';
    if (shabadError) shabadError.style.display = 'none';
    
    try {
        // BaniDB API for random shabad
        const response = await fetch('https://api.banidb.com/v2/random/1');
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        // Hide loading
        if (shabadLoading) shabadLoading.style.display = 'none';
        
        // Display the shabad
        this.displayShabad(data);
        
    } catch (error) {
        console.error('[Shabad] Fetch error:', error);
        
        // Show error
        if (shabadLoading) shabadLoading.style.display = 'none';
        if (shabadError) shabadError.style.display = 'flex';
    }
}

displayShabad(data) {
    const { shabadContent, shabadAng, shabadGurmukhi, shabadTransliteration, shabadTranslation, shabadSource } = this.elements;
    
    if (!data || !data.shabadInfo) {
        if (this.elements.shabadError) this.elements.shabadError.style.display = 'flex';
        return;
    }
    
    const shabadInfo = data.shabadInfo;
    const verses = data.verses || [];
    
    // Combine all lines of the shabad
    let gurmukhiText = '';
    let translitText = '';
    let translationText = '';
    
    verses.forEach(verse => {
        // Use UNICODE field for proper Punjabi script (not gurmukhi field)
        if (verse.verse && verse.verse.unicode) {
            gurmukhiText += verse.verse.unicode + ' ';
        }
        
        // English translation
        if (verse.translation && verse.translation.en && verse.translation.en.bdb) {
            translationText += verse.translation.en.bdb + ' ';
        }
        
        // Transliteration
        if (verse.transliteration && verse.transliteration.english) {
            translitText += verse.transliteration.english + ' ';
        }
    });
    
    // Update Ang number
    if (shabadAng) {
        const angNum = shabadAng.querySelector('.shabad-ang__number');
        if (angNum) {
            angNum.textContent = shabadInfo.pageNo || '---';
        }
    }
    
    // Update Gurmukhi (now in proper Punjabi Unicode)
    if (shabadGurmukhi) {
        shabadGurmukhi.textContent = gurmukhiText.trim() || 'ਵਾਹਿਗੁਰੂ';
    }
    
    // Update Transliteration
    if (shabadTransliteration) {
        shabadTransliteration.textContent = translitText.trim() || '';
    }
    
    // Update Translation
    if (shabadTranslation) {
        shabadTranslation.textContent = translationText.trim() || 'May the Divine bless you.';
    }
    
    // Update Source
// Update Source
if (shabadSource) {
    // Raag with fallbacks
    let raag = 'Unknown';
    if (shabadInfo.raag) {
        raag = shabadInfo.raag.unicode || shabadInfo.raag.english || shabadInfo.raag.gurmukhi || 'Unknown';
    }
    
    // Writer with fallbacks
    let writer = 'Unknown';
    if (shabadInfo.writer) {
        writer = shabadInfo.writer.unicode || shabadInfo.writer.english || shabadInfo.writer.gurmukhi || 'Unknown';
    }
    
    // If still null or "null" string, set default
    if (!raag || raag === 'null' || raag === null) {
        raag = 'ਰਾਗ';
    }
    if (!writer || writer === 'null' || writer === null) {
        writer = 'ਗੁਰੂ ਸਾਹਿਬ';
    }
    
    shabadSource.innerHTML = `
        <span><i class="fas fa-music"></i> ${raag}</span>
        <span><i class="fas fa-feather"></i> ${writer}</span>
        <span><i class="fas fa-book"></i> ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ</span>
    `;
}
    // Store for copy function
    this.currentShabad = {
        gurmukhi: gurmukhiText.trim(),
        transliteration: translitText.trim(),
        translation: translationText.trim(),
        ang: shabadInfo.pageNo
    };
    
    // Show content
    if (shabadContent) shabadContent.style.display = 'flex';
}

copyShabad() {
    if (!this.currentShabad) {
        this.showToast('❌ No shabad to copy', 'error');
        return;
    }
    
    const textToCopy = `
═══════════════════════════
🙏 RANDOM SHABAD 🙏
Ang: ${this.currentShabad.ang}
═══════════════════════════

${this.currentShabad.gurmukhi}

${this.currentShabad.transliteration}

${this.currentShabad.translation}

═══════════════════════════
Source: Sri Guru Granth Sahib Ji
From: Gurbani Live Radio
═══════════════════════════
    `.trim();
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            Utils.haptic('success');
            this.showToast('📋 Shabad copied!', 'success');
        })
        .catch(() => {
            this.showToast('❌ Copy failed', 'error');
        });
}

    setupShareButtons() {
        const shareUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent('🙏 Listen to Divine Gurbani Radio - 24/7 Sacred Kirtan');

        const shareLinks = {
            shareWhatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
            shareTelegram: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
            shareFacebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
            shareTwitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`
        };

        Object.entries(shareLinks).forEach(([id, url]) => {
            this.addClickHandler(id, () => {
                window.open(url, '_blank', 'width=600,height=400');
                Utils.haptic('light');
                this.showToast('📤 Opening share...', 'info');
            });
        });
    }

    addClickHandler(elementId, handler) {
        const element = this.elements[elementId];
        if (element) {
            element.addEventListener('click', handler);
        }
    }

    setupProgressBar() {
        const { progressContainer, progressFill, progressGlow, progressScrubber } = this.elements;
        if (!progressContainer) return;

        let isDragging = false;
        let wasPlaying = false;

        const updateProgressFromEvent = (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const percent = Utils.clamp((clientX - rect.left) / rect.width * 100, 0, 100);
            
            if (progressFill) progressFill.style.width = `${percent}%`;
            if (progressGlow) progressGlow.style.left = `${percent}%`;
            if (progressScrubber) progressScrubber.style.left = `${percent}%`;
            
            return percent;
        };

        const handleStart = (e) => {
            isDragging = true;
            this.isDraggingProgress = true;
            wasPlaying = this.audio.isPlaying;
            progressContainer.classList.add('progress--dragging');
            if (progressScrubber) progressScrubber.classList.add('progress-scrubber--visible');
            Utils.haptic('light');
            updateProgressFromEvent(e);
        };

        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            updateProgressFromEvent(e);
        };

        const handleEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            this.isDraggingProgress = false;
            
            const percent = updateProgressFromEvent(e.changedTouches ? e.changedTouches[0] : e);
            this.audio.seek(percent);
            
            progressContainer.classList.remove('progress--dragging');
            setTimeout(() => {
                if (progressScrubber) progressScrubber.classList.remove('progress-scrubber--visible');
            }, 200);
        };

        // Mouse events
        progressContainer.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);

        // Touch events
        progressContainer.addEventListener('touchstart', handleStart, { passive: false });
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);

        // Click to seek
        progressContainer.addEventListener('click', (e) => {
            if (!isDragging) {
                const rect = progressContainer.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                this.audio.seek(Utils.clamp(percent, 0, 100));
                Utils.haptic('light');
            }
        });

        // Hover effects
        progressContainer.addEventListener('mouseenter', () => {
            if (progressScrubber) progressScrubber.classList.add('progress-scrubber--visible');
        });

        progressContainer.addEventListener('mouseleave', () => {
            if (!isDragging && progressScrubber) {
                progressScrubber.classList.remove('progress-scrubber--visible');
            }
        });
    }

    setupMagneticButtons() {
        // ═══ COMPLETELY DISABLE ON MOBILE ═══
        if (isMobile || Utils.isTouchDevice() || Utils.prefersReducedMotion()) {
            console.log('[UI] Magnetic buttons disabled on mobile');
            return;
        }

        const magneticButtons = document.querySelectorAll('.control-btn');
        
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = 0.15;
                btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    this.audio.toggle();
                    break;
                case 'arrowright':
                case 'l':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.audio.next();
                    } else {
                        this.audio.seek(this.audio.currentTime + 10, true);
                    }
                    break;
                case 'arrowleft':
                case 'j':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.audio.previous();
                    } else {
                        this.audio.seek(this.audio.currentTime - 10, true);
                    }
                    break;
                case 'arrowup':
                    e.preventDefault();
                    this.audio.setVolume(Math.min(1, this.audio.volume + 0.1));
                    this.updateVolumeUI(this.audio.volume);
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    this.audio.setVolume(Math.max(0, this.audio.volume - 0.1));
                    this.updateVolumeUI(this.audio.volume);
                    break;
                case 'm':
                    e.preventDefault();
                    this.audio.toggleMute();
                    break;
                case 's':
                    e.preventDefault();
                    this.audio.toggleShuffle();
                    this.updateShuffleButton(this.audio.shuffle);
                    break;
                case 'r':
                    e.preventDefault();
                    const mode = this.audio.cycleRepeat();
                    this.updateRepeatButton(mode);
                    break;
                case 'f':
                    e.preventDefault();
                    this.toggleFavorite();
                    break;
                case 'g':
                    e.preventDefault();
                    this.audio.goLive();
                    break;
                case '0':
                case 'home':
                    e.preventDefault();
                    this.audio.seek(0);
                    break;
            }
        });
    }

    setupAudioEventListeners() {
        // Time updates
        this.audio.on('timeupdate', (data) => {
            if (!this.isDraggingProgress) {
                this.updateProgress(data.progress);
                this.updateTimeDisplay(data.currentTime, data.duration);
            }
        });

        // Track changes
        this.audio.on('trackchange', (info) => {
            this.updateTrackInfo(info);
            this.updateAlbumArt(info.index);
        });

        // Playing state
        this.audio.on('playing', (info) => {
            this.updatePlayButton(true);
            this.updateTrackInfo(info);
            this.activatePlayerGlow();
            
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing';
            }
        });

        // Paused state
        this.audio.on('paused', () => {
            this.updatePlayButton(false);
            this.deactivatePlayerGlow();
            
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'paused';
            }
        });

        // Stopped
        this.audio.on('stopped', () => {
            this.updatePlayButton(false);
            this.updateProgress(0);
            this.updateTimeDisplay(0, 0);
            this.deactivatePlayerGlow();
        });

        // Loading states
        this.audio.on('loading', () => {
            this.setLoadingState(true);
        });

        this.audio.on('canplay', () => {
            this.setLoadingState(false);
        });

        this.audio.on('buffering', () => {
            this.setLoadingState(true);
        });

        // Volume changes
        this.audio.on('volumechange', (data) => {
            this.updateVolumeUI(data.volume);
        });

        // Mute changes
        this.audio.on('mutechange', (data) => {
            this.updateMuteButton(data.muted);
        });

        // Shuffle changes
        this.audio.on('shufflechange', (data) => {
            this.updateShuffleButton(data.shuffle);
        });

        // Repeat changes
        this.audio.on('repeatchange', (data) => {
            this.updateRepeatButton(data.repeat);
        });

        // Live status
        this.audio.on('liveStatusChange', (data) => {
            this.updateLiveStatus(data.isLive);
        });

        // Errors
        this.audio.on('error', (error) => {
            this.setLoadingState(false);
            if (error.type !== 'permission') {
                this.showToast(`⚠️ ${error.message}`, 'error');
            }
        });

        // Beat detection for visual feedback
        this.audio.on('beat', (data) => {
            this.onBeat(data.intensity);
        });

        // Buffer progress
        this.audio.on('bufferprogress', (data) => {
            this.updateBufferProgress(data.percent);
        });
    }

    loadSavedState() {
        // Volume
        const savedVolume = Utils.storage.get('volume', 0.8);
        this.audio.setVolume(savedVolume);
        this.updateVolumeUI(savedVolume);

        // Shuffle
        const savedShuffle = Utils.storage.get('shuffle', false);
        this.audio.shuffle = savedShuffle;
        this.updateShuffleButton(savedShuffle);

        // Repeat
        const savedRepeat = Utils.storage.get('repeat', 'all');
        this.audio.repeat = savedRepeat;
        this.updateRepeatButton(savedRepeat);

        // Last track
        const lastTrack = Utils.storage.get('lastTrackIndex', 0);
        this.audio.currentTrackIndex = lastTrack;
    }

    updatePlayButton(isPlaying) {
        const { playBtn, playIcon } = this.elements;
        
        if (playBtn) {
            playBtn.classList.toggle('control-btn--playing', isPlaying);
            playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
            playBtn.setAttribute('aria-pressed', isPlaying);
        }

        if (playIcon) {
            playIcon.classList.remove('fa-play', 'fa-pause');
            playIcon.classList.add(isPlaying ? 'fa-pause' : 'fa-play');
        }
    }

    updateProgress(percent) {
        const { progressFill, progressGlow, progressScrubber } = this.elements;
        const clampedPercent = Utils.clamp(percent, 0, 100);
        
        if (progressFill) progressFill.style.width = `${clampedPercent}%`;
        if (progressGlow) progressGlow.style.left = `${clampedPercent}%`;
        if (progressScrubber) progressScrubber.style.left = `${clampedPercent}%`;
    }

    updateBufferProgress(percent) {
        const bufferBar = document.querySelector('.progress-buffer');
        if (bufferBar) {
            bufferBar.style.width = `${percent}%`;
        }
    }

    updateTimeDisplay(current, duration) {
        const { currentTime, totalTime } = this.elements;
        
        if (currentTime) currentTime.textContent = Utils.formatTime(current);
        if (totalTime) totalTime.textContent = Utils.formatTime(duration);
    }

    updateTrackInfo(info) {
        const { shabadTitle, shabadArtist, trackNumber } = this.elements;
        
        if (shabadTitle) {
            shabadTitle.textContent = info.title || 'Divine Shabad';
            shabadTitle.classList.add('track-info--updated');
            setTimeout(() => shabadTitle.classList.remove('track-info--updated'), 500);
        }
        
        if (shabadArtist) {
            shabadArtist.textContent = info.artist || 'Sacred Kirtan';
        }
        
        if (trackNumber) {
            trackNumber.textContent = `${info.index + 1} / ${info.total}`;
        }

        // Update document title
        document.title = `${info.title} | Gurbani Radio`;

        // Update Media Session
        this.updateMediaSession(info);
    }

    updateMediaSession(info) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: info.title,
                artist: info.artist,
                album: 'Gurbani Radio - 24/7 Kirtan',
                artwork: [
                    { src: '/images/icon-96.png', sizes: '96x96', type: 'image/png' },
                    { src: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/images/icon-512.png', sizes: '512x512', type: 'image/png' }
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => this.audio.play());
            navigator.mediaSession.setActionHandler('pause', () => this.audio.pause());
            navigator.mediaSession.setActionHandler('previoustrack', () => this.audio.previous());
            navigator.mediaSession.setActionHandler('nexttrack', () => this.audio.next());
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.seekTime) this.audio.seek(details.seekTime, true);
            });
        }
    }

    updateAlbumArt(trackIndex) {
        const { sacredImage, sacredGlow } = this.elements;
        
        // Animate on track change
        if (sacredImage) {
            sacredImage.style.transform = 'scale(0.95)';
            sacredImage.style.opacity = '0.7';
            
            setTimeout(() => {
                sacredImage.style.transform = 'scale(1)';
                sacredImage.style.opacity = '1';
            }, 200);
        }

        // Pulse the glow
        if (sacredGlow) {
            sacredGlow.style.opacity = '1';
            sacredGlow.style.transform = 'translate(-50%, -50%) scale(1.2)';
            
            setTimeout(() => {
                sacredGlow.style.opacity = '';
                sacredGlow.style.transform = '';
            }, 400);
        }
    }

    updateVolumeUI(volume) {
        const { volumeSlider, volumeValue, volumeFill, volumeBtn } = this.elements;
        const percent = Math.round(volume * 100);
        
        if (volumeSlider) volumeSlider.value = percent;
        if (volumeValue) volumeValue.textContent = `${percent}%`;
        if (volumeFill) volumeFill.style.width = `${percent}%`;

        // Update volume icon
        if (volumeBtn) {
            const icon = volumeBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas ' + (
                    volume === 0 ? 'fa-volume-mute' :
                    volume < 0.3 ? 'fa-volume-off' :
                    volume < 0.7 ? 'fa-volume-down' : 'fa-volume-up'
                );
            }
        }
    }

    updateMuteButton(isMuted) {
        const { volumeBtn } = this.elements;
        if (volumeBtn) {
            volumeBtn.classList.toggle('control-btn--muted', isMuted);
            const icon = volumeBtn.querySelector('i');
            if (icon && isMuted) {
                icon.className = 'fas fa-volume-mute';
            }
        }
    }

    updateShuffleButton(isShuffled) {
        const { shuffleBtn } = this.elements;
        if (shuffleBtn) {
            shuffleBtn.classList.toggle('control-btn--active', isShuffled);
            shuffleBtn.setAttribute('aria-pressed', isShuffled);
        }
    }

    updateRepeatButton(mode) {
        const { repeatBtn } = this.elements;
        if (repeatBtn) {
            repeatBtn.classList.remove('control-btn--active', 'control-btn--repeat-one');
            
            if (mode === 'all') {
                repeatBtn.classList.add('control-btn--active');
            } else if (mode === 'one') {
                repeatBtn.classList.add('control-btn--active', 'control-btn--repeat-one');
            }

            const icon = repeatBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas ' + (mode === 'one' ? 'fa-repeat-1' : 'fa-repeat');
            }
            
            repeatBtn.setAttribute('aria-label', `Repeat: ${mode}`);
        }
    }

    toggleVolumePopup() {
    const { volumePopup } = this.elements;
    if (volumePopup) {
        const isVisible = volumePopup.getAttribute('data-visible') === 'true';
        volumePopup.setAttribute('data-visible', !isVisible);
        volumePopup.classList.toggle('volume-popup--visible', !isVisible);
    }
}
    toggleFavorite() {
        const { favoriteBtn } = this.elements;
        if (!favoriteBtn) return;

        const isFavorited = favoriteBtn.classList.toggle('control-btn--favorited');
        const icon = favoriteBtn.querySelector('i');
        
        if (icon) {
            icon.className = isFavorited ? 'fas fa-heart' : 'far fa-heart';
        }

        // Save to favorites
        const favorites = Utils.storage.get('favorites', []);
        const currentTrack = this.audio.currentTrackIndex;
        
        if (isFavorited) {
            if (!favorites.includes(currentTrack)) {
                favorites.push(currentTrack);
            }
            this.showToast('❤️ Added to favorites', 'success');
        } else {
            const idx = favorites.indexOf(currentTrack);
            if (idx > -1) favorites.splice(idx, 1);
            this.showToast('💔 Removed from favorites', 'info');
        }
        
        Utils.storage.set('favorites', favorites);
    }

    showTrackInfo() {
        const info = this.audio.getCurrentTrackInfo();
        const message = `🎵 Track ${info.index + 1}/${info.total}\n${info.title}`;
        this.showToast(message, 'info', 4000);
    }

    setLoadingState(isLoading) {
        const { playBtn, playIcon } = this.elements;
        
        if (playBtn) {
            playBtn.classList.toggle('control-btn--loading', isLoading);
        }

        if (playIcon && isLoading) {
            playIcon.classList.remove('fa-play', 'fa-pause');
            playIcon.classList.add('fa-spinner', 'fa-spin');
        } else if (playIcon) {
            playIcon.classList.remove('fa-spinner', 'fa-spin');
            playIcon.classList.add(this.audio.isPlaying ? 'fa-pause' : 'fa-play');
        }
    }

    activatePlayerGlow() {
        const { sacredGlow, playerCard, sacredFrame } = this.elements;
        
        if (sacredGlow) {
            sacredGlow.style.animation = 'glow-pulse-active 3s ease-in-out infinite';
        }

        if (playerCard) {
            playerCard.classList.add('player__card--playing');
        }

        if (sacredFrame) {
            sacredFrame.classList.add('sacred-frame--playing');
        }
    }

    deactivatePlayerGlow() {
        const { sacredGlow, playerCard, sacredFrame } = this.elements;
        
        if (sacredGlow) {
            sacredGlow.style.animation = '';
        }

        if (playerCard) {
            playerCard.classList.remove('player__card--playing');
        }

        if (sacredFrame) {
            sacredFrame.classList.remove('sacred-frame--playing');
        }
    }

    onBeat(intensity) {
        // Quality bars beat animation
        if (this.elements.qualityBars) {
            this.elements.qualityBars.forEach((bar, i) => {
                bar.style.transform = `scaleY(${1 + intensity * (0.3 + i * 0.1)})`;
                setTimeout(() => {
                    bar.style.transform = '';
                }, 100);
            });
        }
    }
    openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
        modal.classList.add('modal--open');
        document.body.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            modal.querySelector('.modal__container')?.classList.add('modal__container--visible');
        });
    }
}
    closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.querySelector('.modal__container')?.classList.remove('modal__container--visible');
        
        setTimeout(() => {
            modal.classList.remove('modal--open');
            if (typeof modal.close === 'function') {
                modal.close();
            }
            document.body.style.overflow = '';
        }, 300);
    }
}
    showToast(message, type = 'info', duration = 3000) {
        this.toastQueue.push({ message, type, duration });
        
        if (!this.isShowingToast) {
            this.processToastQueue();
        }
    }

    processToastQueue() {
        if (this.toastQueue.length === 0) {
            this.isShowingToast = false;
            return;
        }

        this.isShowingToast = true;
        const { message, type, duration } = this.toastQueue.shift();

        const { toast, toastMessage, toastIcon } = this.elements;
        
        if (!toast) {
            this.isShowingToast = false;
            return;
        }

        // Set content
        if (toastMessage) toastMessage.textContent = message;
        
        // Set icon based on type
        if (toastIcon) {
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };
            toastIcon.className = `fas ${icons[type] || icons.info}`;
        }

        // Set type class
        toast.className = `toast toast--${type}`;
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('toast--visible');
        });

        // Auto hide
        setTimeout(() => {
            toast.classList.remove('toast--visible');
            setTimeout(() => {
                this.processToastQueue();
            }, 300);
        }, duration);
    }

hideLoadingScreen() {
    const { loadingScreen } = this.elements;
    
    if (loadingScreen) {
        // Immediately hide - no delay
        loadingScreen.classList.add('hidden');
        loadingScreen.style.display = 'none';
    }
}

    destroy() {
        if (this.listenerUpdateInterval) {
            clearInterval(this.listenerUpdateInterval);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APPLICATION CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class GurbaniRadioApp {
    constructor() {
        this.stateManager = new StateManager({
            isReady: false,
            isPlaying: false,
            currentTrack: null,
            volume: 0.8,
            isLive: true,
            theme: 'dark'
        });

        this.audioEngine = null;
        this.visualizer = null;
        this.particles = null;
        this.uiController = null;
        this.isInitialized = false;

        console.log('[GurbaniRadio] ੴ Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh ੴ');
    }

    async init() {
        if (this.isInitialized) return;

        try {
            console.log('[GurbaniRadio] Initializing application...');

            // Initialize Audio Engine
            this.audioEngine = new AudioEngine({
                autoPlay: true,
                virtualLive: true,
                fftSize: 256
            });

            // Initialize UI Controller
            this.uiController = new UIController(this.audioEngine, this.stateManager);

            // Initialize Visualizer
            this.visualizer = new VisualizerEngine(this.audioEngine, {
                barCount: 12,
                sensitivity: 1.8,
                smoothing: 0.75
            });

            // Initialize Particles
            const particleContainer = document.getElementById('particles');
            if (particleContainer) {
                this.particles = new ParticleSystem(particleContainer, {
                    count: 40,
                    colors: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#F4E04D'],
                    glowEnabled: true
                });
            }

            // Setup resize handler
            this.setupResizeHandler();

            // Setup visibility change handler
            this.setupVisibilityHandler();

            // Setup offline handler
            this.setupOfflineHandler();

            // Mark as initialized
            this.isInitialized = true;
            this.stateManager.setState({ isReady: true });

            console.log('[GurbaniRadio] ✅ Application initialized successfully');

        } catch (error) {
            console.error('[GurbaniRadio] ❌ Initialization failed:', error);
            this.handleInitError(error);
        }
    }

    setupResizeHandler() {
        const debouncedResize = Utils.debounce(() => {
            // Handle responsive adjustments
            const isMobile = window.innerWidth < 768;
            document.body.classList.toggle('is-mobile', isMobile);
        }, 250);

        window.addEventListener('resize', debouncedResize);
    }

    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause particles when tab is hidden
                if (this.particles) this.particles.pause();
            } else {
                // Resume particles when tab is visible
                if (this.particles) this.particles.resume();
            }
        });
    }

    setupOfflineHandler() {
        window.addEventListener('online', () => {
            this.uiController?.showToast('🌐 Back online!', 'success');
        });

        window.addEventListener('offline', () => {
            this.uiController?.showToast('📡 Connection lost', 'warning');
        });
    }

    handleInitError(error) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'init-error';
        errorContainer.innerHTML = `
            <div class="init-error__content">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Unable to Initialize</h2>
                <p>${error.message || 'An unexpected error occurred'}</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
        errorContainer.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(13, 6, 24, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            color: white;
            text-align: center;
            font-family: system-ui, sans-serif;
        `;
        document.body.appendChild(errorContainer);
    }

    async play() {
        await this.audioEngine?.play();
    }

    pause() {
        this.audioEngine?.pause();
    }

    async toggle() {
        await this.audioEngine?.toggle();
    }

    destroy() {
        console.log('[GurbaniRadio] Destroying application...');
        
        this.audioEngine?.destroy();
        this.visualizer?.destroy();
        this.particles?.destroy();
        this.uiController?.destroy();
        
        this.isInitialized = false;
        console.log('[GurbaniRadio] Application destroyed');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

// Create global app instance
let gurbaniRadio = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        gurbaniRadio = new GurbaniRadioApp();
        await gurbaniRadio.init();

        // Expose to global scope for debugging
        window.gurbaniRadio = gurbaniRadio;
        window.AUDIO_CONFIG = AUDIO_CONFIG;

    } catch (error) {
        console.error('[Init] Critical error:', error);
    }
});

// Handle before unload
window.addEventListener('beforeunload', () => {
    if (gurbaniRadio) {
        // Save current state
        Utils.storage.set('lastVolume', gurbaniRadio.audioEngine?.volume);
        Utils.storage.set('lastTrackIndex', gurbaniRadio.audioEngine?.currentTrackIndex);
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('[SW] Registered:', registration.scope);
        } catch (error) {
            console.warn('[SW] Registration failed:', error);
        }
    });
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GurbaniRadioApp,
        AudioEngine,
        VisualizerEngine,
        ParticleSystem,
        UIController,
        Utils,
        AUDIO_CONFIG
    };
}

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                        ੴ END OF GURBANI RADIO v6.0 ੴ                        ║
 * ║                     Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh              ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */