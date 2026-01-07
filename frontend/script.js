/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║     ੴ GURBANI RADIO - FIXED VERSION v6.2 ੴ                                   ║
 * ║     ALL BUGS FIXED - NOTES & SHABAD WORKING                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════════════
   MOBILE PERFORMANCE SYSTEM
   ═══════════════════════════════════════════════════════════════════════ */

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                 || window.innerWidth < 768;
const isSlowDevice = navigator.deviceMemory ? navigator.deviceMemory < 4 : isMobile;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const shouldReduceAnimations = isMobile || isSlowDevice || prefersReducedMotion;

console.log(`📱 Device: ${isMobile ? 'Mobile' : 'Desktop'}`);
console.log(`⚡ Performance mode: ${shouldReduceAnimations ? 'POWER SAVING' : 'FULL'}`);

if (isMobile) {
    document.documentElement.classList.add('is-mobile');
    document.body.classList.add('mobile-device');
}

if (shouldReduceAnimations) {
    document.documentElement.classList.add('reduce-motion');
}

// ═══════════════════════════════════════════════════════════════
// AUDIO CONFIG
// ═══════════════════════════════════════════════════════════════
const AUDIO_CONFIG = {
    baseUrl: '/audio',
    
    audioFiles: Array.from({ length: 40 }, (_, i) => `day-${i + 1}.webm`),
    
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
// UTILITY FUNCTIONS
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

    createRipple(element, event) {
        if (isMobile) {
            element.style.opacity = '0.7';
            setTimeout(() => element.style.opacity = '1', 150);
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
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT EMITTER
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
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIRTUAL LIVE MANAGER
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
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIO ENGINE
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

        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this._handleTrackEnded();
        });

        this.audio.addEventListener('error', () => {
            this._handleError(this.audio?.error);
        });

        this.audio.addEventListener('timeupdate', this._onTimeUpdate);
        
        this.audio.addEventListener('volumechange', () => {
            this.emit('volumechange', { volume: this.audio?.volume || 0 });
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

    getFrequencyData() {
        if (this.analyser && this.frequencyData && this.isPlaying && this.corsEnabled) {
            this.analyser.getByteFrequencyData(this.frequencyData);
            return this.frequencyData;
        }
        return new Uint8Array(128).fill(0);
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
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALIZER ENGINE (Mobile Optimized)
// ═══════════════════════════════════════════════════════════════════════════════

class VisualizerEngine {
    constructor(audioEngine, options = {}) {
        this.audioEngine = audioEngine;
        this.options = {
            barCount: options.barCount || 12,
            sensitivity: options.sensitivity || 1.8,
            smoothing: options.smoothing || 0.75,
            minHeight: options.minHeight || 6,
            maxHeight: options.maxHeight || 45
        };

        this.bars = [];
        this.previousHeights = [];
        this.isActive = false;
        this.animationId = null;

        this.init();
    }

    init() {
        const container = document.querySelector('.sacred-visualizer');
        if (container) {
            this.bars = Array.from(container.querySelectorAll('.viz-bar'));
            this.previousHeights = new Array(this.bars.length).fill(this.options.minHeight);
        }

        this.audioEngine.on('playing', () => this.start());
        this.audioEngine.on('paused', () => this.stop());
        this.audioEngine.on('stopped', () => this.stop());
    }

    start() {
        if (isMobile || shouldReduceAnimations) return;
        if (this.isActive) return;
        this.isActive = true;
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        this.bars.forEach((bar) => {
            bar.style.height = `${this.options.minHeight}px`;
        });
    }

    animate() {
        if (!this.isActive) return;

        const frequencyData = this.audioEngine.getFrequencyData();
        const dataLength = frequencyData.length;
        
        this.bars.forEach((bar, index) => {
            const start = Math.floor(index * dataLength / this.bars.length);
            const end = Math.floor((index + 1) * dataLength / this.bars.length);
            
            let sum = 0;
            for (let i = start; i < end; i++) sum += frequencyData[i];
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
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        this.stop();
        this.bars = [];
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARTICLE SYSTEM (Disabled on Mobile)
// ═══════════════════════════════════════════════════════════════════════════════

class ParticleSystem {
    constructor(container, options = {}) {
        if (isMobile || shouldReduceAnimations) {
            this.particles = [];
            this.isActive = false;
            return;
        }
        
        this.container = typeof container === 'string' 
            ? document.getElementById(container) 
            : container;
        
        this.options = {
            count: options.count || 40,
            colors: options.colors || ['#FFD700', '#FFA500', '#FF8C00', '#DAA520'],
            minSize: options.minSize || 2,
            maxSize: options.maxSize || 7
        };

        this.particles = [];
        this.isActive = false;

        if (this.container) this.init();
    }

    init() {
        if (this.container) this.container.innerHTML = '';
        this.particles = [];

        for (let i = 0; i < this.options.count; i++) {
            this.createParticle();
        }
        this.isActive = true;
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Utils.random(this.options.minSize, this.options.maxSize);
        const duration = Utils.random(12, 30);
        const delay = Utils.random(0, duration);
        const x = Utils.random(0, 100);
        const drift = Utils.random(-30, 30);
        const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];

        Object.assign(particle.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}%`,
            bottom: '-20px',
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            borderRadius: '50%',
            opacity: '0',
            animation: `particle-float ${duration}s ease-in-out ${delay}s infinite`,
            '--drift': `${drift}px`,
            pointerEvents: 'none',
            zIndex: '1'
        });

        if (this.container) {
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    pause() {
        this.particles.forEach(p => p.style.animationPlayState = 'paused');
    }

    resume() {
        if (shouldReduceAnimations) return;
        this.particles.forEach(p => p.style.animationPlayState = 'running');
    }

    destroy() {
        this.particles.forEach(p => p.remove());
        this.particles = [];
        this.isActive = false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI CONTROLLER - COMPLETELY FIXED
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
        
        // Notes state
        this.notesOriginalContent = '';
        this.notesModified = false;
        
        // Shabad state
        this.currentShabad = null;
        this.shabadBookmarked = false;

        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupProgressBar();
        this.setupKeyboardShortcuts();
        this.setupAudioEventListeners();
        this.loadSavedState();
        this.hideLoadingScreen();
        this.setupLiveButton();
        this.startListenerSimulation();
        this.injectStyles();
    }

    cacheElements() {
        const ids = [
            'playBtn', 'playIcon', 'prevBtn', 'nextBtn',
            'volumeBtn', 'volumeSlider', 'volumeValue', 'volumePopup', 'volumeFill',
            'currentTime', 'totalTime', 'progressFill', 'progressScrubber', 'progressTrack',
            'loadingScreen', 'toast',
            'scheduleBtn', 'scheduleModal', 'closeScheduleModal',
            'shareBtn', 'shareModal', 'closeShareModal',
            'favoriteBtn', 'copyLinkBtn', 'liveBtn', 'listenerCount',
            'shareWhatsapp', 'shareTelegram', 'shareFacebook', 'shareTwitter',
            // Notes
            'notesCard', 'notesOverlay', 'notesClose', 
            'notesTextarea', 'notesCharCount',
            'saveNotesBtn', 'downloadNotesBtn', 'clearNotesBtn',
            'notesConfirmOverlay', 'confirmSaveBtn', 'confirmDiscardBtn', 'confirmCancelBtn',
            'notesToast', 'notesToastMessage',
            // Shabad
            'randomShabadCard', 'shabadOverlay', 'shabadClose', 
            'shabadLoading', 'shabadContent', 'shabadError',
            'shabadAngNumber', 'shabadGurmukhi', 
            'shabadTransliteration', 'shabadTranslation', 'shabadSource',
            'newShabadBtn', 'copyShabadBtn', 'shareShabadBtn', 'bookmarkShabadBtn',
            'shabadTooltip', 'shabadRetryBtn',
            // Bento cards
            'DailyHukamnamaCard', 'nitnemCard'
        ];

        ids.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });

        // Query selectors
        this.elements.statusLive = document.querySelector('.status-item--live');
        this.elements.playerCard = document.querySelector('.player__card');
        this.elements.calendarCard = document.querySelector('.bento-card--calendar');
    }

    injectStyles() {
        if (document.getElementById('ui-controller-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'ui-controller-styles';
        style.textContent = `
            @keyframes ripple-expand {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(4); opacity: 0; }
            }
            
            @keyframes particle-float {
                0% { transform: translateY(0) translateX(0) scale(0); opacity: 0; }
                10% { opacity: 0.8; transform: translateY(-10vh) translateX(calc(var(--drift) * 0.3)) scale(1); }
                90% { opacity: 0.4; }
                100% { transform: translateY(-100vh) translateX(var(--drift)) scale(0.5); opacity: 0; }
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
                transition: all 0.3s ease;
                text-transform: uppercase;
            }

            .live-btn:hover {
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.2));
                transform: scale(1.05);
            }

            .live-btn--active { box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); }
            .live-btn--inactive { background: rgba(100, 100, 100, 0.15); border-color: rgba(100, 100, 100, 0.3); color: #888; }

            .live-btn__pulse {
                width: 8px;
                height: 8px;
                background: #ef4444;
                border-radius: 50%;
                animation: live-pulse 1.5s ease-in-out infinite;
            }

            .live-btn--inactive .live-btn__pulse { display: none; }

            @keyframes live-pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.4); opacity: 0.6; }
            }
            
            /* Notes & Shabad Overlays */
            .notes-overlay.active,
            .shabad-overlay.active {
                display: flex !important;
                opacity: 1 !important;
                visibility: visible !important;
            }
            
            .notes-toast.show,
            .shabad-tooltip.show {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .notes-confirm-overlay.active {
                display: flex !important;
            }
        `;
        document.head.appendChild(style);
    }

    startListenerSimulation() {
        const updateInterval = isMobile ? 15000 : 5000;
        
        this.listenerUpdateInterval = setInterval(() => {
            const change = Math.floor(Utils.random(-5, 8));
            this.listenerCount = Math.max(100, this.listenerCount + change);
            
            const listenerEl = this.elements.listenerCount || document.querySelector('.status-item__value');
            if (listenerEl) {
                listenerEl.textContent = Utils.formatNumber(this.listenerCount);
            }
        }, updateInterval);
    }

    setupLiveButton() {
        let liveBtn = this.elements.liveBtn;
        
        if (!liveBtn) {
            liveBtn = document.createElement('button');
            liveBtn.id = 'liveBtn';
            liveBtn.className = 'live-btn live-btn--active';
            liveBtn.innerHTML = `<span class="live-btn__pulse"></span><span class="live-btn__text">LIVE</span>`;
            
            const progressTime = document.querySelector('.progress-time');
            const liveIndicator = document.querySelector('.progress-time__live');
            if (progressTime && liveIndicator) {
                liveIndicator.parentNode.replaceChild(liveBtn, liveIndicator);
            }
            
            this.elements.liveBtn = liveBtn;
        }

        if (this.elements.liveBtn) {
            this.elements.liveBtn.addEventListener('click', async () => {
                Utils.haptic('medium');
                await this.audio.goLive();
                this.showToast('🔴 Jumped to LIVE', 'success');
            });
        }
    }

    updateLiveStatus(isLive) {
        const { liveBtn, statusLive } = this.elements;

        if (liveBtn) {
            liveBtn.classList.toggle('live-btn--active', isLive);
            liveBtn.classList.toggle('live-btn--inactive', !isLive);
        }

        if (statusLive) {
            const dot = statusLive.querySelector('.status-item__dot');
            if (dot) {
                dot.style.background = isLive ? '#ef4444' : '#888';
            }
        }
    }

    setupEventListeners() {
        // ═══════════════════════════════════════════════════════════════
        // PLAYER CONTROLS
        // ═══════════════════════════════════════════════════════════════
        
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

        this.addClickHandler('prevBtn', () => {
            Utils.haptic('light');
            this.audio.previous();
        });

        this.addClickHandler('nextBtn', () => {
            Utils.haptic('light');
            this.audio.next();
        });

        // Volume
        this.addClickHandler('volumeBtn', (e) => {
            e.stopPropagation();
            this.toggleVolumePopup();
        });

        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.addEventListener('input', (e) => {
                const value = e.target.value / 100;
                this.audio.setVolume(value);
                this.updateVolumeUI(value);
            });
        }

        document.addEventListener('click', (e) => {
            const volumePopup = this.elements.volumePopup;
            const volumeBtn = this.elements.volumeBtn;
            if (volumePopup && !volumePopup.contains(e.target) && !volumeBtn?.contains(e.target)) {
                volumePopup.setAttribute('data-visible', 'false');
            }
        });

        // Favorite
        this.addClickHandler('favoriteBtn', () => {
            Utils.haptic('success');
            this.toggleFavorite();
        });

        // Modals
        this.addClickHandler('scheduleBtn', () => this.openModal('scheduleModal'));
        this.addClickHandler('closeScheduleModal', () => this.closeModal('scheduleModal'));
        this.addClickHandler('shareBtn', () => this.openModal('shareModal'));
        this.addClickHandler('closeShareModal', () => this.closeModal('shareModal'));

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

        // ═══════════════════════════════════════════════════════════════
        // BENTO CARDS - NAVIGATION
        // ═══════════════════════════════════════════════════════════════
        
        this.addClickHandler('DailyHukamnamaCard', () => {
            console.log('[UI] ✅ Daily Hukamnama clicked');
            window.location.href = 'Dialy-Hukamnama.html';
        });
        
        this.addClickHandler('nitnemCard', () => {
            console.log('[UI] ✅ Nitnem card clicked');
            window.location.href = 'nitnem/indexbani.html';
        });
        
        if (this.elements.calendarCard) {
            this.elements.calendarCard.addEventListener('click', () => {
                console.log('[UI] ✅ Calendar card clicked');
                window.location.href = 'Gurupurab-Calendar.html';
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // NOTES MODAL
        // ═══════════════════════════════════════════════════════════════
        
        this.addClickHandler('notesCard', () => {
            console.log('[UI] ✅ Notes card clicked');
            this.openNotesModal();
        });

        this.addClickHandler('notesClose', () => this.tryCloseNotes());

        if (this.elements.notesOverlay) {
            this.elements.notesOverlay.addEventListener('click', (e) => {
                if (e.target === this.elements.notesOverlay) {
                    this.tryCloseNotes();
                }
            });
        }

        this.addClickHandler('saveNotesBtn', () => {
            this.saveNotes();
            this.showNotesToast('Notes saved!');
        });

        this.addClickHandler('downloadNotesBtn', () => this.downloadNotes());
        this.addClickHandler('clearNotesBtn', () => this.clearNotes());

        if (this.elements.notesTextarea) {
            this.elements.notesTextarea.addEventListener('input', () => {
                this.updateNotesCharCount();
                this.notesModified = (this.elements.notesTextarea.value !== this.notesOriginalContent);
            });
        }

        this.addClickHandler('confirmSaveBtn', () => {
            this.saveNotes();
            this.hideNotesConfirm();
            this.closeNotesModal();
            this.showNotesToast('Notes saved!');
        });

        this.addClickHandler('confirmDiscardBtn', () => {
            this.hideNotesConfirm();
            this.closeNotesModal();
        });

        this.addClickHandler('confirmCancelBtn', () => this.hideNotesConfirm());

        // ═══════════════════════════════════════════════════════════════
        // RANDOM SHABAD MODAL
        // ═══════════════════════════════════════════════════════════════
        
        this.addClickHandler('randomShabadCard', () => {
            console.log('[UI] ✅ Random Shabad card clicked');
            this.openShabadModal();
        });

        this.addClickHandler('shabadClose', () => this.closeShabadModal());

        if (this.elements.shabadOverlay) {
            this.elements.shabadOverlay.addEventListener('click', (e) => {
                if (e.target === this.elements.shabadOverlay) {
                    this.closeShabadModal();
                }
            });
        }

        this.addClickHandler('newShabadBtn', () => {
            const icon = this.elements.newShabadBtn?.querySelector('i');
            if (icon) icon.classList.add('fa-spin');
            this.fetchRandomShabad();
        });

        this.addClickHandler('copyShabadBtn', () => this.copyShabad());
        this.addClickHandler('shareShabadBtn', () => this.shareShabad());
        this.addClickHandler('bookmarkShabadBtn', () => this.toggleShabadBookmark());
        this.addClickHandler('shabadRetryBtn', () => this.fetchRandomShabad());

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.elements.notesOverlay?.classList.contains('active')) {
                    this.tryCloseNotes();
                }
                if (this.elements.shabadOverlay?.classList.contains('active')) {
                    this.closeShabadModal();
                }
                document.querySelectorAll('.modal.modal--open').forEach(modal => {
                    this.closeModal(modal.id);
                });
            }
        });

        // Share buttons
        this.setupShareButtons();

        // Modal backdrop
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // NOTES FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    openNotesModal() {
        console.log('[UI] Opening Notes Modal');
        const { notesOverlay } = this.elements;
        if (notesOverlay) {
            document.body.style.overflow = 'hidden';
            notesOverlay.classList.add('active');
            this.loadNotes();
            setTimeout(() => this.elements.notesTextarea?.focus(), 100);
        }
    }

    closeNotesModal() {
        console.log('[UI] Closing Notes Modal');
        const { notesOverlay } = this.elements;
        if (notesOverlay) {
            document.body.style.overflow = '';
            notesOverlay.classList.remove('active');
            this.notesModified = false;
        }
    }

    tryCloseNotes() {
        if (this.notesModified) {
            this.showNotesConfirm();
        } else {
            this.closeNotesModal();
        }
    }

    showNotesConfirm() {
        const { notesConfirmOverlay } = this.elements;
        if (notesConfirmOverlay) notesConfirmOverlay.classList.add('active');
    }

    hideNotesConfirm() {
        const { notesConfirmOverlay } = this.elements;
        if (notesConfirmOverlay) notesConfirmOverlay.classList.remove('active');
    }

    loadNotes() {
        const { notesTextarea } = this.elements;
        if (notesTextarea) {
            const savedNotes = Utils.storage.get('userNotes', '');
            notesTextarea.value = savedNotes;
            this.notesOriginalContent = savedNotes;
            this.notesModified = false;
            this.updateNotesCharCount();
        }
    }

    saveNotes() {
        const { notesTextarea } = this.elements;
        if (notesTextarea) {
            Utils.storage.set('userNotes', notesTextarea.value);
            this.notesOriginalContent = notesTextarea.value;
            this.notesModified = false;
            Utils.haptic('success');
        }
    }

    clearNotes() {
        const { notesTextarea } = this.elements;
        if (notesTextarea && confirm('Are you sure you want to clear all notes?')) {
            notesTextarea.value = '';
            Utils.storage.remove('userNotes');
            this.notesOriginalContent = '';
            this.notesModified = false;
            this.updateNotesCharCount();
            Utils.haptic('warning');
            this.showNotesToast('Notes cleared');
        }
    }

    downloadNotes() {
        const { notesTextarea } = this.elements;
        if (!notesTextarea || !notesTextarea.value.trim()) {
            this.showNotesToast('No notes to download');
            return;
        }
        
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        
        const content = `GURBANI RADIO - SACRED NOTES\nDate: ${date}\n================================\n\n${notesTextarea.value}\n\n================================\nWaheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gurbani-Notes-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Utils.haptic('success');
        this.showNotesToast('Notes downloaded!');
    }

    updateNotesCharCount() {
        const { notesTextarea, notesCharCount } = this.elements;
        if (notesTextarea && notesCharCount) {
            notesCharCount.textContent = `${notesTextarea.value.length} / 5000`;
        }
    }

    showNotesToast(message) {
        const { notesToast, notesToastMessage } = this.elements;
        if (notesToast && notesToastMessage) {
            notesToastMessage.textContent = message;
            notesToast.classList.add('show');
            setTimeout(() => notesToast.classList.remove('show'), 2500);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SHABAD FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    openShabadModal() {
        console.log('[UI] Opening Shabad Modal');
        const { shabadOverlay } = this.elements;
        if (shabadOverlay) {
            document.body.style.overflow = 'hidden';
            shabadOverlay.classList.add('active');
            setTimeout(() => this.elements.shabadClose?.focus(), 100);
            this.fetchRandomShabad();
        }
    }

    closeShabadModal() {
        console.log('[UI] Closing Shabad Modal');
        const { shabadOverlay } = this.elements;
        if (shabadOverlay) {
            document.body.style.overflow = '';
            shabadOverlay.classList.remove('active');
            const icon = this.elements.newShabadBtn?.querySelector('i');
            if (icon) icon.classList.remove('fa-spin');
        }
    }

    async fetchRandomShabad() {
        console.log('[UI] Fetching Random Shabad...');
        const { shabadLoading, shabadContent, shabadError, newShabadBtn } = this.elements;
        
        if (shabadLoading) shabadLoading.style.display = 'flex';
        if (shabadContent) shabadContent.style.display = 'none';
        if (shabadError) shabadError.style.display = 'none';
        
        try {
            const response = await fetch('https://api.banidb.com/v2/random/1');
            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            console.log('[UI] ✅ Shabad data received');
            
            if (shabadLoading) shabadLoading.style.display = 'none';
            const icon = newShabadBtn?.querySelector('i');
            if (icon) icon.classList.remove('fa-spin');
            
            this.displayShabad(data);
            
        } catch (error) {
            console.error('[Shabad] Fetch error:', error);
            if (shabadLoading) shabadLoading.style.display = 'none';
            if (shabadError) shabadError.style.display = 'flex';
            const icon = newShabadBtn?.querySelector('i');
            if (icon) icon.classList.remove('fa-spin');
        }
    }

    displayShabad(data) {
        const { shabadContent, shabadAngNumber, shabadGurmukhi, 
                shabadTransliteration, shabadTranslation, shabadSource, shabadError } = this.elements;
        
        if (!data || !data.shabadInfo) {
            if (shabadError) shabadError.style.display = 'flex';
            return;
        }
        
        const shabadInfo = data.shabadInfo;
        const verses = data.verses || [];
        
        let gurmukhiText = '';
        let translitText = '';
        let translationText = '';
        
        verses.forEach(verse => {
            if (verse.verse?.unicode) gurmukhiText += verse.verse.unicode + ' ';
            if (verse.translation?.en?.bdb) translationText += verse.translation.en.bdb + ' ';
            if (verse.transliteration?.english) translitText += verse.transliteration.english + ' ';
        });
        
        if (shabadAngNumber) shabadAngNumber.textContent = shabadInfo.pageNo || '---';
        if (shabadGurmukhi) shabadGurmukhi.textContent = gurmukhiText.trim() || 'ਵਾਹਿਗੁਰੂ';
        if (shabadTransliteration) shabadTransliteration.textContent = translitText.trim() || '';
        if (shabadTranslation) shabadTranslation.textContent = translationText.trim() || 'May the Divine bless you.';
        
        if (shabadSource) {
            let raag = shabadInfo.raag?.unicode || shabadInfo.raag?.english || 'ਰਾਗ';
            let writer = shabadInfo.writer?.unicode || shabadInfo.writer?.english || 'ਗੁਰੂ ਸਾਹਿਬ';
            if (!raag || raag === 'null') raag = 'ਰਾਗ';
            if (!writer || writer === 'null') writer = 'ਗੁਰੂ ਸਾਹਿਬ';
            
            shabadSource.innerHTML = `
                <span><i class="fas fa-music"></i> ${raag}</span>
                <span><i class="fas fa-feather"></i> ${writer}</span>
            `;
        }
        
        this.currentShabad = {
            gurmukhi: gurmukhiText.trim(),
            transliteration: translitText.trim(),
            translation: translationText.trim(),
            ang: shabadInfo.pageNo,
            raag: shabadInfo.raag?.english || 'Unknown',
            writer: shabadInfo.writer?.english || 'Unknown'
        };
        
        this.shabadBookmarked = false;
        this.updateBookmarkButton();
        
        if (shabadContent) shabadContent.style.display = 'flex';
    }

    copyShabad() {
        if (!this.currentShabad) {
            this.showToast('❌ No shabad to copy', 'error');
            return;
        }
        
        const textToCopy = `🙏 RANDOM SHABAD - Ang ${this.currentShabad.ang}\n\n${this.currentShabad.gurmukhi}\n\n${this.currentShabad.transliteration}\n\n${this.currentShabad.translation}\n\n— From Gurbani Live Radio`;
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                Utils.haptic('success');
                this.showToast('📋 Shabad copied!', 'success');
                const icon = this.elements.copyShabadBtn?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-copy');
                    icon.classList.add('fa-check');
                    setTimeout(() => {
                        icon.classList.remove('fa-check');
                        icon.classList.add('fa-copy');
                    }, 2000);
                }
            })
            .catch(() => this.showToast('❌ Copy failed', 'error'));
    }

    async shareShabad() {
        if (!this.currentShabad) {
            this.showToast('❌ No shabad to share', 'error');
            return;
        }
        
        const shareData = {
            title: 'Divine Shabad - Gurbani Live Radio',
            text: `${this.currentShabad.translation}\n\n— Ang ${this.currentShabad.ang}`,
            url: window.location.href
        };
        
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                Utils.haptic('success');
            } catch (error) {
                if (error.name !== 'AbortError') this.copyShabad();
            }
        } else {
            this.copyShabad();
        }
    }

    toggleShabadBookmark() {
        this.shabadBookmarked = !this.shabadBookmarked;
        this.updateBookmarkButton();
        
        if (this.shabadBookmarked && this.currentShabad) {
            const bookmarks = Utils.storage.get('shabadBookmarks', []);
            bookmarks.push({ ...this.currentShabad, savedAt: new Date().toISOString() });
            Utils.storage.set('shabadBookmarks', bookmarks);
            Utils.haptic('success');
            this.showToast('❤️ Shabad saved!', 'success');
        } else {
            this.showToast('💔 Shabad removed', 'info');
        }
    }

    updateBookmarkButton() {
        const btn = this.elements.bookmarkShabadBtn;
        if (!btn) return;
        
        const icon = btn.querySelector('i');
        if (this.shabadBookmarked) {
            icon?.classList.remove('far');
            icon?.classList.add('fas');
            btn.classList.add('active');
        } else {
            icon?.classList.remove('fas');
            icon?.classList.add('far');
            btn.classList.remove('active');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SHARE & MODALS
    // ═══════════════════════════════════════════════════════════════════════════════

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
            });
        });
    }

    addClickHandler(elementId, handler) {
        const element = this.elements[elementId];
        if (element) {
            element.addEventListener('click', handler);
        } else {
            console.warn(`[UI] Element not found: ${elementId}`);
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (typeof modal.showModal === 'function') modal.showModal();
            modal.classList.add('modal--open');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('modal--open');
            if (typeof modal.close === 'function') modal.close();
            document.body.style.overflow = '';
        }
    }

    toggleVolumePopup() {
        const { volumePopup } = this.elements;
        if (volumePopup) {
            const isVisible = volumePopup.getAttribute('data-visible') === 'true';
            volumePopup.setAttribute('data-visible', !isVisible);
        }
    }

    toggleFavorite() {
        const { favoriteBtn } = this.elements;
        if (!favoriteBtn) return;

        const isFavorited = favoriteBtn.classList.toggle('control-btn--favorited');
        const icon = favoriteBtn.querySelector('i');
        if (icon) icon.className = isFavorited ? 'fas fa-heart' : 'far fa-heart';
        this.showToast(isFavorited ? '❤️ Added to favorites' : '💔 Removed', 'success');
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PROGRESS BAR
    // ═══════════════════════════════════════════════════════════════════════════════

    setupProgressBar() {
        const progressContainer = this.elements.progressTrack;
        if (!progressContainer) return;

        const { progressFill, progressScrubber } = this.elements;
        let isDragging = false;

        const updateProgressFromEvent = (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const percent = Utils.clamp((clientX - rect.left) / rect.width * 100, 0, 100);
            if (progressFill) progressFill.style.width = `${percent}%`;
            if (progressScrubber) progressScrubber.style.left = `${percent}%`;
            return percent;
        };

        const handleStart = (e) => {
            isDragging = true;
            this.isDraggingProgress = true;
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
        };

        progressContainer.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        progressContainer.addEventListener('touchstart', handleStart, { passive: false });
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);

        progressContainer.addEventListener('click', (e) => {
            if (!isDragging) {
                const rect = progressContainer.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                this.audio.seek(Utils.clamp(percent, 0, 100));
                Utils.haptic('light');
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    this.audio.toggle();
                    break;
                case 'arrowright':
                    e.preventDefault();
                    if (e.shiftKey) this.audio.next();
                    else this.audio.seek(this.audio.currentTime + 10, true);
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    if (e.shiftKey) this.audio.previous();
                    else this.audio.seek(this.audio.currentTime - 10, true);
                    break;
                case 'm':
                    e.preventDefault();
                    this.audio.toggleMute();
                    break;
                case 'g':
                    e.preventDefault();
                    this.audio.goLive();
                    break;
            }
        });
    }

    setupAudioEventListeners() {
        this.audio.on('timeupdate', (data) => {
            if (!this.isDraggingProgress) {
                this.updateProgress(data.progress);
                this.updateTimeDisplay(data.currentTime, data.duration);
            }
        });

        this.audio.on('playing', (info) => {
            this.updatePlayButton(true);
            this.activatePlayerGlow();
        });

        this.audio.on('paused', () => {
            this.updatePlayButton(false);
            this.deactivatePlayerGlow();
        });

        this.audio.on('stopped', () => {
            this.updatePlayButton(false);
            this.updateProgress(0);
            this.updateTimeDisplay(0, 0);
            this.deactivatePlayerGlow();
        });

        this.audio.on('loading', () => this.setLoadingState(true));
        this.audio.on('canplay', () => this.setLoadingState(false));
        this.audio.on('buffering', () => this.setLoadingState(true));
        this.audio.on('volumechange', (data) => this.updateVolumeUI(data.volume));
        this.audio.on('liveStatusChange', (data) => this.updateLiveStatus(data.isLive));

        this.audio.on('error', (error) => {
            this.setLoadingState(false);
            if (error.type !== 'permission') {
                this.showToast(`⚠️ ${error.message}`, 'error');
            }
        });
    }

    loadSavedState() {
        const savedVolume = Utils.storage.get('volume', 0.8);
        this.audio.setVolume(savedVolume);
        this.updateVolumeUI(savedVolume);
        this.audio.currentTrackIndex = Utils.storage.get('lastTrackIndex', 0);
    }

    updatePlayButton(isPlaying) {
        const { playBtn, playIcon } = this.elements;
        if (playBtn) playBtn.classList.toggle('control-btn--playing', isPlaying);
        if (playIcon) {
            playIcon.classList.remove('fa-play', 'fa-pause');
            playIcon.classList.add(isPlaying ? 'fa-pause' : 'fa-play');
        }
    }

    updateProgress(percent) {
        const { progressFill, progressScrubber } = this.elements;
        const clamped = Utils.clamp(percent, 0, 100);
        if (progressFill) progressFill.style.width = `${clamped}%`;
        if (progressScrubber) progressScrubber.style.left = `${clamped}%`;
    }

    updateTimeDisplay(current, duration) {
        const { currentTime, totalTime } = this.elements;
        if (currentTime) currentTime.textContent = Utils.formatTime(current);
        if (totalTime) totalTime.textContent = Utils.formatTime(duration);
    }

    updateVolumeUI(volume) {
        const { volumeSlider, volumeValue, volumeFill, volumeBtn } = this.elements;
        const percent = Math.round(volume * 100);
        if (volumeSlider) volumeSlider.value = percent;
        if (volumeValue) volumeValue.textContent = `${percent}%`;
        if (volumeFill) volumeFill.style.width = `${percent}%`;
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

    setLoadingState(isLoading) {
        const { playBtn, playIcon } = this.elements;
        if (playBtn) playBtn.classList.toggle('control-btn--loading', isLoading);
        if (playIcon && isLoading) {
            playIcon.classList.remove('fa-play', 'fa-pause');
            playIcon.classList.add('fa-spinner', 'fa-spin');
        } else if (playIcon) {
            playIcon.classList.remove('fa-spinner', 'fa-spin');
            playIcon.classList.add(this.audio.isPlaying ? 'fa-pause' : 'fa-play');
        }
    }

    activatePlayerGlow() {
        const { playerCard } = this.elements;
        if (playerCard) playerCard.classList.add('player__card--playing');
    }

    deactivatePlayerGlow() {
        const { playerCard } = this.elements;
        if (playerCard) playerCard.classList.remove('player__card--playing');
    }

    showToast(message, type = 'info', duration = 3000) {
        this.toastQueue.push({ message, type, duration });
        if (!this.isShowingToast) this.processToastQueue();
    }

    processToastQueue() {
        if (this.toastQueue.length === 0) {
            this.isShowingToast = false;
            return;
        }

        this.isShowingToast = true;
        const { message, type, duration } = this.toastQueue.shift();
        const { toast } = this.elements;
        if (!toast) {
            this.isShowingToast = false;
            return;
        }

        const toastMessage = toast.querySelector('.toast__message');
        const toastIcon = toast.querySelector('.toast__icon i');
        
        if (toastMessage) toastMessage.textContent = message;
        if (toastIcon) {
            const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
            toastIcon.className = `fas ${icons[type] || icons.info}`;
        }

        toast.className = `toast toast--${type}`;
        requestAnimationFrame(() => toast.classList.add('toast--visible'));

        setTimeout(() => {
            toast.classList.remove('toast--visible');
            setTimeout(() => this.processToastQueue(), 300);
        }, duration);
    }

    hideLoadingScreen() {
        const { loadingScreen } = this.elements;
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            loadingScreen.style.display = 'none';
        }
    }

    destroy() {
        if (this.listenerUpdateInterval) clearInterval(this.listenerUpdateInterval);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════════════════════

class GurbaniRadioApp {
    constructor() {
        this.stateManager = new StateManager({
            isReady: false,
            isPlaying: false,
            volume: 0.8,
            isLive: true
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

            this.audioEngine = new AudioEngine({
                autoPlay: true,
                virtualLive: true,
                fftSize: 256
            });

            this.uiController = new UIController(this.audioEngine, this.stateManager);

            this.visualizer = new VisualizerEngine(this.audioEngine, {
                barCount: 12,
                sensitivity: 1.8
            });

            const particleContainer = document.getElementById('particles');
            if (particleContainer) {
                this.particles = new ParticleSystem(particleContainer, { count: 40 });
            }

            this.setupHandlers();

            this.isInitialized = true;
            this.stateManager.setState({ isReady: true });

            console.log('[GurbaniRadio] ✅ Application initialized successfully');

        } catch (error) {
            console.error('[GurbaniRadio] ❌ Initialization failed:', error);
        }
    }

    setupHandlers() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.particles) this.particles.pause();
            } else {
                if (this.particles) this.particles.resume();
            }
        });

        window.addEventListener('online', () => {
            this.uiController?.showToast('🌐 Back online!', 'success');
        });

        window.addEventListener('offline', () => {
            this.uiController?.showToast('📡 Connection lost', 'warning');
        });
    }

    destroy() {
        this.audioEngine?.destroy();
        this.visualizer?.destroy();
        this.particles?.destroy();
        this.uiController?.destroy();
        this.isInitialized = false;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

let gurbaniRadio = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Init] DOM Ready - Starting app...');
    
    try {
        gurbaniRadio = new GurbaniRadioApp();
        await gurbaniRadio.init();

        window.gurbaniRadio = gurbaniRadio;
        window.AUDIO_CONFIG = AUDIO_CONFIG;

    } catch (error) {
        console.error('[Init] Critical error:', error);
    }
});

window.addEventListener('beforeunload', () => {
    if (gurbaniRadio) {
        Utils.storage.set('lastVolume', gurbaniRadio.audioEngine?.volume);
        Utils.storage.set('lastTrackIndex', gurbaniRadio.audioEngine?.currentTrackIndex);
    }
});

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

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                        ੴ GURBANI RADIO v6.2 FIXED ੴ                          ║
 * ║                     Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh              ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */