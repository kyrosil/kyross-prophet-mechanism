// Kyros's Prophet Mechanism - Final Corrected Script (Added Robust Checks for L2 Submit)

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false;
let lastSymbolClicked = null;
let level2Attempts = 5;

// --- LocalStorage Keys ---
const LEVEL_STORAGE_KEY = 'kyrosMechanismLevel';
const L2_ATTEMPTS_STORAGE_KEY = 'kyrosMechanismL2Attempts';

// --- DOM References ---
let mechanismDiv;

// --- Core Functions ---

function saveGame(level) {
    try { localStorage.setItem(LEVEL_STORAGE_KEY, level); console.log(`Game saved at level: ${level}`); }
    catch (e) { console.error("Could not save game level!", e); }
}

function saveLevel2Attempts(attempts) {
     try { if (currentLevel === 2) { localStorage.setItem(L2_ATTEMPTS_STORAGE_KEY, attempts); console.log(`Level 2 attempts saved: ${attempts}`); } }
     catch (e) { console.error("Could not save L2 attempts", e); }
}

function loadGame() {
    console.log("loadGame started...");
    try {
        const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
        currentLevel = savedLevel ? parseInt(savedLevel, 10) : 1;
        console.log(savedLevel ? `Game loaded at level: ${currentLevel}` : "No saved game found, starting at Level 1.");
        level1Passed = (currentLevel > 1);
        lastSymbolClicked = null;
        level2Attempts = (currentLevel === 2) ? loadLevel2Attempts() : 5;
        displayLevel(currentLevel);
    } catch (e) { console.error("Could not load game state!", e); currentLevel = 1; displayLevel(currentLevel); }
}

function loadLevel2Attempts() {
     try {
        const savedLevel = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
        if (savedLevel !== 2) return 5;
        const savedAttempts = localStorage.getItem(L2_ATTEMPTS_STORAGE_KEY);
        if (savedAttempts === null) return 5;
        const attempts = parseInt(savedAttempts, 10); console.log(`Loaded L2 attempts: ${attempts}`); return attempts;
     } catch (e) { console.error("Could not load L2 attempts", e); return 5; }
}

function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    try {
        mechanismDiv = document.getElementById('mechanism');
        if (!mechanismDiv) { console.error("Mechanism container div not found!"); return; }
        mechanismDiv.innerHTML = '';

        const mainTitle = document.querySelector('h1');
        if (mainTitle) mainTitle.textContent = `Kyros's Prophet Mechanism - Level ${levelNumber}`;

        let resetButtonHTML = (levelNumber > 1) ? `<p style="margin-top: 30px;"><button onclick="resetToLevel1()">Reset Progress to Level 1</button></p>` : '';

        if (levelNumber === 1) {
            console.log("Setting up Level 1 HTML and listeners...");
            mechanismDiv.innerHTML = `...`; // Seviye 1 HTML'i (Değişiklik yok)
            attachLevel1Listeners();
            updateIndicator('');

        } else if (levelNumber === 2) {
            console.log("Setting up Level 2 HTML and listeners...");
            level2Attempts = loadLevel2Attempts();
            const targetWord = "REVROSYKCESI";
            const sourceWordInfo = "KYROSERVICES (12 letters: K,Y,R(2),O,S(2),E(2),V,I,C)";
            const availableLettersDisplay = "C, E(2), I, K, O, R(2), S(2), V, Y";
            const initialFeedback = '_ '.repeat(targetWord.length).trim();

            mechanismDiv.innerHTML = `...`; // Seviye 2 HTML'i (Değişiklik yok - maxlength="12")

            attachLevel2Listeners(targetWord);

            if (level2Attempts <= 0) { /* ... Kilitleme kodu (Değişiklik yok) ... */ }

        } else {
             console.log(`Displaying placeholder for Level ${levelNumber}.`);
             mechanismDiv.innerHTML = `<p>Level ${levelNumber} - Coming Soon!</p>${resetButtonHTML}`;
        }
    } catch(error) { console.error("Error during displayLevel:", error); mechanismDiv.innerHTML = `<p style="color:red; font-weight:bold;">Error loading level content! Please try resetting.</p>${resetButtonHTML}`; }
}

// --- Level 1 Specific Functions ---
function attachLevel1Listeners() { /* ... Önceki çalışan kod ... */ }
function handleSymbolClick(symbol) { /* ... Önceki çalışan kod ... */ }
function updateIndicator(color) { /* ... Önceki çalışan kod ... */ }

// --- Level 2 Specific Functions ---
function attachLevel2Listeners(target) {
    setTimeout(() => { // Keep setTimeout for safety
        try {
            const inputEl = document.getElementById('level2-input');
            const submitBtn = document.getElementById('level2-submit');
            if (!inputEl || !submitBtn) { console.error("L2 Listener Error: Input or Submit button not found!"); return; }
            console.log("Attaching Level 2 listeners...");
            submitBtn.addEventListener('click', () => handleLevel2Submit(target));
            inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !submitBtn.disabled) { handleLevel2Submit(target); } });
        } catch(error) { console.error("Error attaching L2 listeners", error); }
    }, 0);
}

function handleLevel2Submit(target) {
    console.log("handleLevel2Submit called"); // Log entry
    try {
        const inputEl = document.getElementById('level2-input');
        const feedbackEl = document.getElementById('level2-feedback');
        const messageEl = document.getElementById('level2-message');
        const attemptsEl = document.getElementById('level2-attempts');
        const submitBtn = document.getElementById('level2-submit');

        // ***** DAHA SAĞLAM KONTROLLER *****
        if (!inputEl || !feedbackEl || !messageEl || !attemptsEl || !submitBtn) {
             console.error("L2 Submit Error: One or more required elements missing!");
             if(messageEl) messageEl.textContent = "Interface error. Please Reset."; // Show error if possible
             return;
        }
         if (level2Attempts <= 0 && !submitBtn.disabled) { // Prevent accidental runs if already 0
              console.warn("L2 Submit called with 0 attempts, should be disabled.");
              inputEl.disabled = true; submitBtn.disabled = true; // Ensure disabled
              return;
         }
        // ***** KONTROLLER SONU *****

        let guess = inputEl.value.toUpperCase().trim();
        messageEl.textContent = ''; // Clear message

        // Uzunluk kontrolü (12 harf)
        if (guess.length !== target.length) {
            messageEl.textContent = `Guess must be ${target.length} letters long.`;
            return; // No attempt used
        }

        // Deneme hakkını kullan
        console.log(`Attempting guess. Attempts left (before): ${level2Attempts}`);
        level2Attempts--;
        saveLevel2Attempts(level2Attempts); // Kaydet
        attemptsEl.textContent = level2Attempts; // Göster
        console.log(`Attempts left (after): ${level2Attempts}`);


        // Geri bildirimi hesapla ve göster
        let feedback = '';
        let correct = true;
        for (let i = 0; i < target.length; i++) {
            if (guess[i] === target[i]) { feedback += target[i] + ' '; }
            else { feedback += '_ '; correct = false; }
        }
        feedbackEl.textContent = feedback.trim();
        console.log(`Feedback updated: ${feedback.trim()}`);


        // Kazanma durumunu kontrol et
        if (correct) {
            console.log("Correct guess!");
            messageEl.textContent = "Correct!";
            inputEl.disabled = true;
            submitBtn.disabled = true;
            setTimeout(() => goToLevel(3), 1000); // Kazan!
            return;
        }

        // Kaybetme durumunu kontrol et
        if (level2Attempts <= 0) {
            console.log("No attempts remaining.");
            messageEl.textContent = "Incorrect. No attempts remaining!";
            inputEl.disabled = true;
            submitBtn.disabled = true;
            feedbackEl.textContent = '_ '.repeat(target.length).trim(); // Geri bildirimi sıfırla
            return;
        }

        // Yanlış ama hak varsa
        console.log("Incorrect guess, attempts remaining.");
        messageEl.textContent = "Incorrect, try again.";
        inputEl.value = ''; // Girdiyi temizle
        // inputEl.focus(); // Odaklanmayı kaldırdık

    } catch(error) {
        console.error("Error during handleLevel2Submit:", error);
        // Try to display error to user if message element exists
        try {
            const messageEl = document.getElementById('level2-message');
            if (messageEl) messageEl.textContent = "Error processing guess: " + error.message;
            else { alert("Error processing guess and cannot display message."); } // Fallback alert
        } catch (e) {} // Ignore errors trying to show the error
    }
     console.log("handleLevel2Submit finished."); // Log exit
}


// --- Navigation & Reset ---
function goToLevel(levelNumber) { /* ... önceki kod (alert'li hali) ... */ }
function resetToLevel1() { /* ... önceki kod ... */ }

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadGame);
