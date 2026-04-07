// Audio Context setup (Browser ka sound engine)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Function: Sound generate karne ke liye
function playNote(frequency) {
    if (!frequency) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Harmonium jaisi reedy sound ke liye 'sawtooth' sabse best hai
    oscillator.type = 'sawtooth'; 
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Sound ko thoda smooth banane ke liye (Attack & Release)
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1.5);
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

// Computer Keyboard Event (A, S, D, etc.)
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
