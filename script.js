// Audio Context setup
let audioCtx;

// Function: Sound Engine ko start karne ke liye
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Agar engine soya hua (suspended) hai, toh use jagayein
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Function: Sound generate karne ke liye
function playNote(frequency) {
    initAudio(); // Har baar check karega ki audio on hai ya nahi
    
    if (!frequency) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sawtooth'; 
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Fade in/out taaki kaano ko chubhe nahi
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.2);
}

// Mouse Click Event
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', () => {
        const freq = parseFloat(key.dataset.note);
        playNote(freq);
        key.classList.add('active');
    });

    key.addEventListener('mouseup', () => {
        key.classList.remove('active');
    });
});

// Keyboard Support
window.addEventListener('keydown', (e) => {
    const keyElement = document.querySelector(`.key[data-key="${e.key.toLowerCase()}"]`);
    if (keyElement && !e.repeat) {
        const freq = parseFloat(keyElement.dataset.note);
        playNote(freq);
        keyElement.classList.add('active');
    }
});

window.addEventListener('keyup', (e) => {
    const keyElement = document.querySelector(`.key[data-key="${e.key.toLowerCase()}"]`);
    if (keyElement) {
        keyElement.classList.remove('active');
    }
});

// Click anywhere to Resume Audio (Zaroori Step)
document.body.addEventListener('click', () => {
    initAudio();
}, { once: true });
