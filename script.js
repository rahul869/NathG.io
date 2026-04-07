// Audio Context setup
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Function: Desi Folk Harmonium Sound Generator
function playNote(frequency) {
    initAudio(); 
    
    if (!frequency) return;

    // Master Volume aur Envelope (Bellows/Phookni ka effect)
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1); // Attack
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5); // Release
    masterGain.connect(audioCtx.destination);

    // Filter: Lakdi ke dabbe (Wooden box) ka effect laane ke liye (Sharp digital noise hatane ke liye)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000; // Muffles the harsh high frequencies
    filter.Q.value = 1;
    filter.connect(masterGain);

    // --------------------------------------------------------
    // REED 1: Main Patti (Male Voice)
    // --------------------------------------------------------
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc1.connect(filter);
    osc1.start();
    osc1.stop(audioCtx.currentTime + 1.5);

    // --------------------------------------------------------
    // REED 2: Kharaj/Bass Patti (Ek Octave Niche) - Desi Touch
    // --------------------------------------------------------
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'square'; // Thodi alag wave 'body' dene ke liye
    osc2.frequency.setValueAtTime(frequency / 2, audioCtx.currentTime); // Aadhi frequency = Bass
    
    const gain2 = audioCtx.createGain();
    gain2.gain.value = 0.6; // Bass thoda control mein
    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start();
    osc2.stop(audioCtx.currentTime + 1.5);

    // --------------------------------------------------------
    // REED 3: Detuned Patti (Vibration / Jhanjhnaahat ke liye)
    // --------------------------------------------------------
    const osc3 = audioCtx.createOscillator();
    osc3.type = 'sawtooth';
    osc3.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc3.detune.value = 15; // Halka sa besura (detune) effect asliyat laata hai
    
    const gain3 = audioCtx.createGain();
    gain3.gain.value = 0.3;
    osc3.connect(gain3);
    gain3.connect(filter);
    osc3.start();
    osc3.stop(audioCtx.currentTime + 1.5);
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

// Click anywhere to Resume Audio
document.body.addEventListener('click', () => {
    initAudio();
}, { once: true });
