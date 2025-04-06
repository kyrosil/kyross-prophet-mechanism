// Top-level script execution starts here
console.log("Kyros's Prophet Mechanism script loaded!");

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false; // Specific state for level 1 logic
let lastSymbolClicked = null; // State for level 1 logic
let level2Attempts = 5; // Default attempts for level 2

// --- LocalStorage Keys ---
const LEVEL_STORAGE_KEY = 'kyrosMechanismLevel';
const L2_ATTEMPTS_STORAGE_KEY = 'kyrosMechanismL2Attempts';

// --- DOM References ---
let mechanismDiv; // Ana container

// --- Core Functions ---

function saveGame(level) {
    try {
        localStorage.setItem(LEVEL_STORAGE_KEY, level);
        console.log(`Game saved at level: ${level}`);
        // Deneme hakkını burada değil, handleLevel2Submit içinde kaydediyoruz.
    } catch (e) { console.error("Could not save game level!", e); alert("Warning: Could not save game progress."); }
}

function saveLevel2Attempts(attempts) {
     try {
        // Sadece mevcut seviye 2 ise kaydetmek mantıklı
        if (currentLevel === 2) {
            localStorage.setItem(L2_ATTEMPTS_STORAGE_KEY, attempts);
            console.log(`Level 2 attempts saved: ${attempts}`);
        }
     } catch (e) { console.error("Could not save L2 attempts", e); }
}

function loadGame() {
    try {
        const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
        currentLevel = savedLevel ? parseInt(savedLevel, 10) : 1;
        console.log(savedLevel ? `Game loaded at level: ${currentLevel}` : "No saved game found, starting at Level 1.");

        // Reset level-specific states based on loaded level
        level1Passed = (currentLevel > 1);
        lastSymbolClicked = null;
        level2Attempts = (currentLevel === 2) ? loadLevel2Attempts() : 5; // Load attempts only if starting on L2

        displayLevel(currentLevel);
    } catch (e) {
        console.error("Could not load game state!", e);
        alert("Warning: Could not load saved game state. Starting from Level 1.");
        currentLevel = 1;
        displayLevel(currentLevel); // Fallback
    }
}

function loadLevel2Attempts() {
     try {
        const savedLevel = parseInt(localStorage.getItem(LEVEL_STORAGE_KEY) || '1', 10);
        if (savedLevel !== 2) return 5; // If not saved as level 2, reset attempts
        const savedAttempts = localStorage.getItem(L2_ATTEMPTS_STORAGE_KEY);
        if (savedAttempts === null) {
            console.log("No saved L2 attempts found, defaulting to 5.");
            return 5;
        }
        const attempts = parseInt(savedAttempts, 10);
        console.log(`Loaded L2 attempts: ${attempts}`);
        return attempts;
     } catch (e) {
        console.error("Could not load L2 attempts", e);
        return 5; // Default on error
     }
}

function displayLevel(levelNumber) {
    try { // Hata yakalama ekleyelim
        console.log(`Displaying Level ${levelNumber}`);
        mechanismDiv = document.getElementById('mechanism');
        if (!mechanismDiv) {
            console.error("Mechanism container div not found!");
            return;
        }
        mechanismDiv.innerHTML = ''; // Clear previous level content

        const mainTitle = document.querySelector('h1');
        if (mainTitle) mainTitle.textContent = `Kyros's Prophet Mechanism - Level ${levelNumber}`;

        if (levelNumber === 1) {
            // Seviye 1 HTML ve Listener'ları (Değişiklik Yok)
            console.log("Setting up Level 1 HTML and listeners...");
            mechanismDiv.innerHTML = `
                <div id="mechanism-symbols">
                    <button id="symbol-triangle">△</button>
                    <button id="symbol-square">□</button>
                    <button id="symbol-circle">○</button>
                </div>
                <div id="indicator"></div>
                <p>Level 1: Discover the primary functions.</p>
            `;
            attachLevel1Listeners();
            updateIndicator('');

        } else if (levelNumber === 2) {
            // ***** SEVİYE 2 İÇERİĞİNİ GERİ YÜKLÜYORUZ *****
            console.log("Setting up Level 2 HTML and listeners...");
            level2Attempts = loadLevel2Attempts(); // Ensure attempts are fresh
            const targetWord = "REVROSYKCESI";
            const initialFeedback = '_ '.repeat(targetWord.length).trim(); // Her zaman başta boş göster

            mechanismDiv.innerHTML = `
                <h2>Level 2: Unscramble the Letters</h2>
                <p class="level2-instructions">Use the letters from KYROSERVICES (K, Y, R(2), O, S(2), E(2), V, I, C) to form the target 11-letter word: <strong>${targetWord}</strong>.</p> <div class="available-letters">Available letters: C, E(2), I, K, O, R(2), S(2), V, Y</div> <div id="level2-feedback">${initialFeedback}</div>
                <input type="text" id="level2-input" maxlength="11" placeholder="Enter your 11-letter guess..." autocomplete="off" autocapitalize="characters" style="text-transform:uppercase"> <button id="level2-submit">Submit Guess</button>
                <p id="level2-message">
                    Attempts remaining: <span id="level2-attempts">${level2Attempts}</span>
                </p>
            `;
            // Olay dinleyicilerini bağla (HTML oluştuktan sonra!)
            attachLevel2Listeners(targetWord);

            // Eğer haklar zaten bitmişse arayüzü kilitle
            if (level2Attempts <= 0) {
                const inputEl = document.getElementById('level2-input');
                const submitBtn = document.getElementById('level2-submit');
                const messageEl = document.getElementById('level2-message');
                const feedbackEl = document.getElementById('level2-feedback');

                if(inputEl) inputEl.disabled = true;
                if(submitBtn) submitBtn.disabled = true;
                if(messageEl) messageEl.textContent += " No attempts remaining.";
                if(feedbackEl) feedbackEl.textContent = '_ '.repeat(targetWord.length).trim(); // Sıfırlamayı garantile
            }

        } else {
            // Placeholder for Level 3 and beyond
             console.log(`Displaying placeholder for Level ${levelNumber}.`);
             mechanismDiv.innerHTML = `<p>Level ${levelNumber} - Coming Soon!</p>`;
        }
    } catch(error) {
         console.error("Error during displayLevel:", error);
         alert("Error displaying level: " + error.message); // Hata olursa kullanıcıya göster
         mechanismDiv.innerHTML = `<p style="color:red; font-weight:bold;">Error loading level content!</p>`; // Hata mesajı göster
    }
}

// --- Level 1 Specific Functions --- (Değişiklik yok)
function attachLevel1Listeners() { /* ... önceki kod ... */ }
function handleSymbolClick(symbol) { /* ... önceki kod ... */ }
function updateIndicator(color) { /* ... önceki kod ... */ }

// --- Level 2 Specific Functions --- (Tamamen geri yüklendi)
function attachLevel2Listeners(target) {
    try { // Hata yakalama ekleyelim
        const inputEl = document.getElementById('level2-input');
        const submitBtn = document.getElementById('level2-submit');
        if (!inputEl || !submitBtn) {
             console.error("Could not find L2 input or submit button to attach listeners.");
             return;
        }
        console.log("Attaching Level 2 listeners...");
        submitBtn.addEventListener('click', () => handleLevel2Submit(target));
        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                // Enter tuşu için kontrol ekleyelim, disabled ise çalışmasın
                 if (!submitBtn.disabled) {
                    handleLevel2Submit(target);
                 }
            }
        });
    } catch(error) {
        console.error("Error attaching Level 2 listeners:", error);
        alert("Error setting up Level 2 interactions: " + error.message);
    }
}

function handleLevel2Submit(target) {
    try { // Hata yakalama ekleyelim
        const inputEl = document.getElementById('level2-input');
        const feedbackEl = document.getElementById('level2-feedback');
        const messageEl = document.getElementById('level2-message');
        const attemptsEl = document.getElementById('level2-attempts');
        const submitBtn = document.getElementById('level2-submit'); // submitBtn referansı lazım

        if (!inputEl || !feedbackEl || !messageEl || !attemptsEl || !submitBtn || level2Attempts <= 0) {
            console.error("Missing elements or no attempts left for L2 submit.");
            return;
        }

        let guess = inputEl.value.toUpperCase().trim();
        messageEl.textContent = ''; // Clear previous messages

        if (guess.length !== target.length) {
            messageEl.textContent = `Guess must be ${target.length} letters long.`;
            inputEl.focus(); // Hatalı girişte input'a odaklan
            return; // No attempt used for wrong length
        }

        // --- Optional: Anagram Validation --- (Hala eklemedik)

        level2Attempts--; // Use an attempt
        saveLevel2Attempts(level2Attempts); // Save remaining attempts immediately
        attemptsEl.textContent = level2Attempts; // Update display

        let feedback = '';
        let correct = true;
        for (let i = 0; i < target.length; i++) {
            if (guess[i] === target[i]) {
                feedback += target[i] + ' ';
            } else {
                feedback += '_ ';
                correct = false;
            }
        }
        feedbackEl.textContent = feedback.trim();

        if (correct) {
            messageEl.textContent = "Correct!";
            inputEl.disabled = true;
            submitBtn.disabled = true;
            // Başarı durumunda deneme hakkı sayısını kaydetmek gereksiz olabilir ama zararı yok.
            setTimeout(() => goToLevel(3), 1000); // Win!
            return;
        }

        if (level2Attempts <= 0) {
            messageEl.textContent = "Incorrect. No attempts remaining!";
            inputEl.disabled = true;
            submitBtn.disabled = true;
            feedbackEl.textContent = '_ '.repeat(target.length).trim(); // Reset feedback on final fail
            return;
        }

        messageEl.textContent = "Incorrect, try again.";
        inputEl.value = ''; // Clear input for next guess
        inputEl.focus(); // Focus input for convenience

    } catch(error) {
        console.error("Error during handleLevel2Submit:", error);
        alert("Error processing your guess: " + error.message);
    }
}

// --- Navigation --- (Değişiklik yok)
function goToLevel(levelNumber) { /* ... önceki kod ... */ }

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadGame); // Değişiklik yok
