// ==========================================
// 1. Lenis Smooth Scrolling Setup
// ==========================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


// ==========================================
// 2. Sound Generator (Subtle Soft UI Tick)
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let soundEnabled = true;

function playUiTick() {
    if (!soundEnabled || audioCtx.state === 'suspended') return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.03);
    
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
}

document.querySelectorAll('.hover-sound').forEach(el => {
    el.addEventListener('mouseenter', playUiTick);
    el.addEventListener('click', playUiTick);
});

const soundToggleBtn = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');
soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if(soundEnabled) {
        soundIcon.classList.remove('fa-volume-mute');
        soundIcon.classList.add('fa-volume-up');
        if (audioCtx.state === 'suspended') audioCtx.resume();
    } else {
        soundIcon.classList.remove('fa-volume-up');
        soundIcon.classList.add('fa-volume-mute');
    }
});

document.body.addEventListener('click', () => {
    if (audioCtx.state === 'suspended' && soundEnabled) {
        audioCtx.resume();
    }
}, { once: true });


// ==========================================
// 3. Terminal Boot Sequence
// ==========================================
const bootScreen = document.getElementById('terminal-boot');
const lines = [
    document.getElementById('term-1'),
    document.getElementById('term-2'),
    document.getElementById('term-3'),
    document.getElementById('term-4'),
    document.getElementById('term-5')
];

function runBootSequence() {
    let delay = 0;
    lines.forEach((line) => {
        setTimeout(() => {
            line.classList.remove('hidden');
            if(soundEnabled) playUiTick();
        }, delay);
        delay += 300 + Math.random() * 200; 
    });

    setTimeout(() => {
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
            initGSAPAnimations(); // Start GSAP after boot
        }, 800);
    }, delay + 500);
}

document.body.style.overflow = 'hidden';
window.addEventListener('load', runBootSequence);


// ==========================================
// 4. GSAP Animations & Magnetic Buttons
// ==========================================
gsap.registerPlugin(ScrollTrigger);

function initGSAPAnimations() {
    // 4.1 Split Text Hero Title Fake (Without Club Plugin)
    const title = document.querySelector('.gsap-split-text');
    if (title) {
        const text = title.innerText;
        title.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.innerText = char;
            span.style.display = 'inline-block';
            if(char === ' ') span.innerHTML = '&nbsp;';
            title.appendChild(span);
        });
        
        gsap.fromTo(title.querySelectorAll('span'), 
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.05, ease: "back.out(1.7)" }
        );
    }

    // 4.2 Standard Fade Ups
    gsap.utils.toArray('.gsap-fade-up').forEach(element => {
        gsap.fromTo(element, 
            { y: 50, autoAlpha: 0 },
            { 
                y: 0, 
                autoAlpha: 1, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                }
            }
        );
    });

    // 4.3 Side Fades
    gsap.fromTo('.gsap-fade-right', 
        { x: -50, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: '.about-grid', start: "top 80%" }}
    );
    gsap.fromTo('.gsap-fade-left', 
        { x: 50, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: '.about-grid', start: "top 80%" }}
    );

    // 4.4 Staggered Lists (Timeline)
    const staggerContainers = ['.timeline'];
    staggerContainers.forEach(containerSelector => {
        const container = document.querySelector(containerSelector);
        if(!container) return;
        const elements = container.querySelectorAll('.gsap-stagger');
        
        gsap.fromTo(elements,
            { y: 50, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top 85%"
                }
            }
        );
    });

    // 4.5 Horizontal Marquee Scrub
    const marquee = document.querySelector('.gsap-marquee');
    if (marquee) {
        gsap.to(marquee, {
            xPercent: -50, // Move left
            ease: "none",
            scrollTrigger: {
                trigger: ".marquee-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 1 // Link to scroll position with slight momentum
            }
        });
    }

    // 4.6 Bento Box Parallax Physics
    gsap.utils.toArray('.bento-item').forEach((item, i) => {
        gsap.to(item, {
            yPercent: -15 * (i % 2 === 0 ? 1 : 0.5), // Subtle offset speeds based on index
            ease: "none",
            scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
}

// 4.7 Magnetic Buttons (Micro-interactions)
const magneticButtons = document.querySelectorAll('.magnetic-btn');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        const v = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - v;

        // Pull button towards cursor
        gsap.to(btn, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.4,
            ease: "power3.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        // Snap back
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
    });
});


// ==========================================
// 5. Typing Effect for Hero
// ==========================================
const phrases = ["Secure Systems", "Trading Algorithms", "Data Pipelines", "Fintech Solutions"];
let phraseIndex = 0;
let letterIndex = 0;
let currentPhrase = "";
let isDeleting = false;
const typingElement = document.querySelector('.typing-text');

function typeEffect() {
    if(!typingElement) return;
    currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, letterIndex - 1);
        letterIndex--;
    } else {
        typingElement.textContent = currentPhrase.substring(0, letterIndex + 1);
        letterIndex++;
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && letterIndex === currentPhrase.length) {
        speed = 2000; 
        isDeleting = true;
    } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 500; 
    }

    setTimeout(typeEffect, speed);
}
setTimeout(typeEffect, 3000);


// ==========================================
// 6. Mobile Menu & Navbar Links
// ==========================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileCloseBtn = document.querySelector('.mobile-close-btn');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

if(mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.toggle('active');
    });
}

if(mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
    });
}

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
    });
});

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});


// ==========================================
// 7. Interactive Terminal Digital Rain (Canvas)
// ==========================================
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let cw = window.innerWidth;
let ch = window.innerHeight;

canvas.width = cw;
canvas.height = ch;

window.addEventListener('resize', () => {
    cw = window.innerWidth;
    ch = window.innerHeight;
    canvas.width = cw;
    canvas.height = ch;
    initDrops();
});

const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const fontSize = 14;
let columns = cw / fontSize;
let drops = [];

function initDrops() {
    columns = cw / fontSize;
    drops = [];
    for(let x = 0; x < columns; x++) {
        drops[x] = Math.random() * ch;
    }
}
initDrops();

function drawRain() {
    // Elegant fade effect for trail
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
    ctx.fillRect(0, 0, cw, ch);
    
    // Pure White color for monochromatic theme
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = fontSize + 'px "JetBrains Mono", monospace';
    
    for(let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if(drops[i] * fontSize > ch && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Draw frame every 33ms (approx 30fps for smooth but retro feel)
setInterval(drawRain, 33);

// ==========================================
// 8. Terminal Uplink Game Logic & Controls
// ==========================================
const words = ["REACT", "PYTHON", "WEBSOCKETS", "FINTECH", "ENCRYPTION", "SECURITY", "NODEJS", "ALGORITHM", "DATABASE", "FRONTEND"];
let currentWord = "";
let typedWord = "";
let wpm = 0;
let isPlaying = false;
let startTime = 0;
let wordsCompleted = 0;

const targetWordEl = document.getElementById('target-word');
const typedWordEl = document.getElementById('typed-word');
const wpmDisplay = document.getElementById('wpm-display');
const gameStatus = document.querySelector('.game-status');
const keys = document.querySelectorAll('.key');

// Registration UI Elements
const gameRegistration = document.getElementById('game-registration');
const gameActiveUI = document.getElementById('game-active-ui');
const playerNameInput = document.getElementById('player-name-input');
const beginUplinkBtn = document.getElementById('begin-uplink-btn');
let playerName = "";

if (beginUplinkBtn) {
    beginUplinkBtn.addEventListener('click', () => {
        if(playerNameInput.value.trim() !== "") {
            playerName = playerNameInput.value.trim().toUpperCase();
            gameRegistration.style.display = 'none';
            gameActiveUI.style.display = 'block';
            gameStatus.textContent = `> AWAITING_INPUT [USER: ${playerName}]`;
            if(soundEnabled) playHoverSound();
            startNewWord();
        }
    });
}

function startNewWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    typedWord = "";
    targetWordEl.textContent = currentWord;
    typedWordEl.textContent = typedWord;
}

// Core Game Logic Handler
function handleGameKey(keyChar) {
    // Block input if game hasn't started yet
    if(!playerName) return;

    if (keyChar === "backspace") {
        typedWord = typedWord.slice(0, -1);
        typedWordEl.textContent = typedWord;
        return;
    }

    if (keyChar.length === 1 && keyChar.match(/[a-z]/i)) {
        if (!isPlaying) {
            isPlaying = true;
            startTime = Date.now();
            gameStatus.textContent = `> HACK_IN_PROGRESS [USER: ${playerName}]`;
            gameStatus.style.color = "var(--term-yellow)";
        }

        const expectedChar = currentWord[typedWord.length]?.toLowerCase();
        
        if (keyChar === expectedChar) {
            typedWord += keyChar.toUpperCase();
            typedWordEl.textContent = typedWord;
            typedWordEl.style.color = "var(--accent-blue)";
            
            if (typedWord === currentWord) {
                wordsCompleted++;
                const timeElapsedMinutes = (Date.now() - startTime) / 60000;
                const totalCharsTyped = wordsCompleted * 6;
                wpm = Math.floor((totalCharsTyped / 5) / timeElapsedMinutes);
                
                wpmDisplay.textContent = wpm;
                typedWordEl.style.color = "var(--term-green)";
                
                // EASTER EGG: MAINFRAME HACKED
                if (wordsCompleted === 5) {
                    triggerMainframeHack();
                } else {
                    setTimeout(startNewWord, 300);
                }
            }
        } else {
            typedWordEl.style.color = "var(--term-red)";
        }
    }
}

function triggerMainframeHack() {
    isPlaying = false;
    const glitchOverlay = document.getElementById('glitch-overlay');
    const rewardContainer = document.getElementById('reward-container');
    
    // 1. Violent Glitch
    glitchOverlay.classList.add('active');
    gameStatus.textContent = "> SYSTEM_FAILURE...";
    gameStatus.style.color = "var(--term-red)";
    if(soundEnabled) playHoverSound(); // harsh sound
    
    setTimeout(() => {
        // 2. Override Theme to Cyber Hacker
        document.documentElement.setAttribute('data-theme', 'cyber');
        localStorage.setItem('portfolio-theme', 'cyber');
        
        // 3. Remove Glitch, Show Reward
        glitchOverlay.classList.remove('active');
        gameStatus.textContent = "> ACCESS GRANTED.";
        gameStatus.style.color = "var(--term-green)";
        
        targetWordEl.textContent = `YOU ARE AN ARTIST`;
        typedWordEl.textContent = `${playerName}`;
        targetWordEl.style.fontSize = "2rem"; // shrink slightly to fit
        
        rewardContainer.style.display = "flex";
    }, 1500); // Shortened duration for eye comfort
}

// Restart Game Button Logic
const restartGameBtn = document.getElementById('restart-game-btn');
if (restartGameBtn) {
    restartGameBtn.addEventListener('click', () => {
        document.getElementById('reward-container').style.display = "none";
        wordsCompleted = 0;
        wpm = 0;
        wpmDisplay.textContent = wpm;
        gameStatus.textContent = `> AWAITING_INPUT [USER: ${playerName}]`;
        gameStatus.style.color = "var(--text-muted)";
        targetWordEl.style.fontSize = ""; // reset size
        startNewWord();
    });
}

// Exit Game Button Logic
const exitGameBtn = document.getElementById('exit-game-btn');
if (exitGameBtn) {
    exitGameBtn.addEventListener('click', () => {
        document.getElementById('reward-container').style.display = "none";
        wordsCompleted = 0;
        wpm = 0;
        wpmDisplay.textContent = wpm;
        playerName = "";
        document.getElementById('player-name-input').value = "";
        document.getElementById('game-active-ui').style.display = 'none';
        document.getElementById('game-registration').style.display = 'flex';
        targetWordEl.style.fontSize = ""; // reset size
    });
}

// Physical Keyboard Listener
window.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

    const keyChar = e.key.toLowerCase();
    const virtualKey = document.querySelector(`.key[data-key="${keyChar}"]`);
    
    if (virtualKey) {
        virtualKey.classList.add('active');
        if(soundEnabled) playUiTick();
    }
    
    handleGameKey(keyChar);
});

window.addEventListener('keyup', (e) => {
    const keyChar = e.key.toLowerCase();
    const virtualKey = document.querySelector(`.key[data-key="${keyChar}"]`);
    if (virtualKey) {
        virtualKey.classList.remove('active');
    }
});

// On-Screen Keyboard Listener (Click & Touch)
keys.forEach(key => {
    // Mouse Events
    key.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent text selection
        const keyChar = key.getAttribute('data-key');
        key.classList.add('active');
        if(soundEnabled) playUiTick();
        handleGameKey(keyChar);
    });
    
    key.addEventListener('mouseup', () => {
        key.classList.remove('active');
    });
    
    key.addEventListener('mouseleave', () => {
        key.classList.remove('active');
    });

    // Touch Events (Mobile)
    key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const keyChar = key.getAttribute('data-key');
        key.classList.add('active');
        if(soundEnabled) playUiTick();
        handleGameKey(keyChar);
    });
    
    key.addEventListener('touchend', () => {
        key.classList.remove('active');
    });
});

// ==========================================
// 9. Theme Switcher Engine
// ==========================================
const themeOptions = document.querySelectorAll('.theme-option');
themeOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        const selectedTheme = e.target.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', selectedTheme);
        
        // Save preference
        localStorage.setItem('portfolio-theme', selectedTheme);
        
        // UI Feedback
        if(soundEnabled) playHoverSound();
    });
});

// Load saved theme on boot
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// ==========================================
// 10. 3D Stacked Card Deck (Swiper.js)
// ==========================================
if (typeof Swiper !== 'undefined') {
    const projectSwiper = new Swiper('.project-swiper', {
        effect: 'cards',
        grabCursor: true,
        cardsEffect: {
            perSlideOffset: 12, // Space between cards in the stack
            perSlideRotate: 4,  // Rotation of cards
            rotate: true,
            slideShadows: true,
        },
    });
}


