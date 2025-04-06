// Kyros's Prophet Mechanism - Added Start Screen

// --- Global Variables ---
let currentLevel = 1; // Starts at 1, but game doesn't show until started
let level1Passed = false;
let lastSymbolClicked = null;
let level2QuestionNumber = 1;

// --- DOM References ---
let mechanismDiv;
let mainTitle; // Keep reference to main H1 title
let startScreen; // Reference to the start screen

// --- Discount Codes ---
const SWISS_CODE = "KYROSILEU20";
const THY_CODE = "MERHABAKYROSILEU";

// --- Initial Setup on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Ready. Setting up initial screen.");

    startScreen = document.getElementById('start-screen');
    mainTitle = document.querySelector('h1#main-title'); // More specific selector for H1
    mechanismDiv = document.getElementById('mechanism');
    const startGameButton = document.getElementById('start-game-button');

    // Ensure initial visibility state is correct
    if (startScreen) startScreen.style.display = 'flex'; // Show start screen (use flex)
    if (mainTitle) mainTitle.style.display = 'none';   // Hide game title initially
    if (mechanismDiv) mechanismDiv.style.display = 'none'; // Hide game area initially

    // Attach listener to the start button
    if (startGameButton) {
        startGameButton.addEventListener('click', startGame);
    } else {
        console.error("Start Game button not found!");
        // Fallback: If no start button, maybe start game directly? Or show error.
        // For now, just log error. If start screen exists, game won't start.
    }
});

// --- Function to Start the Game ---
function startGame() {
    console.log("Starting game...");

    // Hide start screen, show game elements
    if (startScreen) startScreen.style.display = 'none';
    if (mainTitle) mainTitle.style.display = 'block'; // Show game title
    if (mechanismDiv) mechanismDiv.style.display = 'block'; // Show game area

    // Initialize game state and display Level 1
    currentLevel = 1;
    level1Passed = false;
    lastSymbolClicked = null;
    level2QuestionNumber = 1;
    displayLevel(1); // Start by displaying level 1
}


// --- Core Functions (Display, Level Logic, etc.) ---

function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    try {
        // mechanismDiv should be valid if startGame was called, but check anyway
        mechanismDiv = document.getElementById('mechanism');
        if (!mechanismDiv) { console.error("Mechanism container div not found!"); return; }
        mechanismDiv.innerHTML = ''; // Clear previous content

        // Update H1 title (ensure it's visible now)
        mainTitle = document.querySelector('h1#main-title');
        if (mainTitle) {
             mainTitle.style.display = 'block'; // Ensure title is visible
             if (levelNumber <= 2) {
                 mainTitle.textContent = `Kyros's Prophet Mechanism - Level ${levelNumber}`;
             } else {
                 mainTitle.textContent = `Kyros's Prophet Mechanism - Reward`;
             }
        }

        // No reset button in stateless version
        // let resetButtonHTML = (levelNumber > 1) ? `<p><button onclick="resetToLevel1()">Reset</button></p>` : '';

        if (levelNumber === 1) {
            console.log("Setting up Level 1 HTML...");
            mechanismDiv.innerHTML = `
                <div id="mechanism-symbols">
                    <button id="symbol-triangle" title="Triangle">△</button>
                    <button id="symbol-square" title="Square">□</button>
                    <button id="symbol-circle" title="Circle">○</button>
                </div>
                <div id="indicator"></div>
                <p>Level 1: Discover the primary functions.</p>
            `;
            attachLevel1Listeners();
            updateIndicator('');

        } else if (levelNumber === 2) {
            console.log(`Setting up Level 2 HTML for Q${level2QuestionNumber}...`);
            let questionText = "";
            if (level2QuestionNumber === 1) { questionText = "Q1: Who is the main sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 2) { questionText = "Q2: Who is the latest sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 3) { questionText = "Q3: What airline alliance do these two sponsors (Swiss Air & Turkish Airlines) belong to?"; }
            else { questionText = "Error loading question."; level2QuestionNumber = 1; }

            mechanismDiv.innerHTML = `
                <h2>Level 2: Knowledge Check (${level2QuestionNumber}/3)</h2>
                <p class="level2-instructions">${questionText}</p>
                <input type="text" id="level2-answer-input" placeholder="Enter your answer..." autocomplete="off" style="text-transform:uppercase">
                <button id="level2-answer-submit">Submit Answer</button>
                <p id="level2-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p>
                `;
            attachLevel2AnswerListeners();

        } else { // Level 3 or higher IS the Reward Screen
             console.log(`Displaying Reward Screen (Level ${levelNumber}).`);
             mechanismDiv.innerHTML = `
                <h2>Congratulations! Levels Completed!</h2>
                <p class="reward-instructions" style="color:red; font-weight:bold;">
                    KESİNLİKLE havayolu şirketine kayıtlı E-POSTA ADRESİNİZİ ilgili alana girin. İndirim kodunuz bu e-posta ile eşleştirilecektir! (En az birini doldurmanız zorunludur.)<br>
                    <span style="font-size:0.9em; opacity:0.8;">(Please enter the E-MAIL ADDRESS registered with the airline company in the relevant field. Your discount code will be matched with this e-mail! Filling in at least one is mandatory.)</span>
                </p>
                <div style="margin-top: 15px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
                    <label for="swiss-email" style="display: block; margin-bottom: 2px;">Swiss Air'e kayıtlı mail / Email registered with Swiss Air:</label>
                    <input type="email" id="swiss-email" placeholder="swiss_email@example.com" style="margin-bottom: 10px; width: 100%; padding: 5px; box-sizing: border-box;"><br>

                    <label for="thy-email" style="display: block; margin-bottom: 2px;">Turkish Airlines/Miles&Smiles kayıtlı mail / Email registered with Turkish Airlines/Miles&Smiles:</label>
                    <input type="email" id="thy-email" placeholder="thy_email@example.com" style="width: 100%; padding: 5px; box-sizing: border-box;">
                </div>
                <button id="get-code-button" style="margin-top: 20px; padding: 10px 20px; font-size: 1.1em;">İndirim Kod(lar)ımı Göster / Get My Discount Code(s)</button>
                <p id="reward-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p> <div id="discount-code-area" style="margin-top: 20px; text-align: left; font-weight: bold; font-size: 1.1em; display: none; border: 1px solid green; padding: 15px; background-color: #e9f5e9; line-height: 1.6;">
                    </div>
                 `;
             attachRewardScreenListeners();
        }
    } catch(error) { console.error("Error during displayLevel:", error); if(mechanismDiv) mechanismDiv.innerHTML = `<p style="color:red;">Error loading level content!</p>`; }
}


// --- Level 1 Specific Functions ---
function attachLevel1Listeners() { /* ... Önceki çalışan kod ... */ }
function handleSymbolClick(symbol) { /* ... Önceki çalışan kod ... */ }
function updateIndicator(color) { /* ... Önceki çalışan kod ... */ }

// --- Level 2 Specific Functions ---
function attachLevel2AnswerListeners() { /* ... Önceki çalışan kod (setTimeout'lu) ... */ }
function handleLevel2AnswerSubmit() { /* ... Önceki çalışan kod (Reset on fail) ... */ }

// --- Reward Screen Functions ---
function attachRewardScreenListeners() { /* ... Önceki çalışan kod (setTimeout'lu) ... */ }
function handleGetCodeClick() { /* ... Önceki çalışan kod (Bilingual details dahil) ... */ }

// --- Navigation ---
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    // No alert needed for smoother flow now? User might prefer it. Keep it for now.
    if (passedLevel > 0) { // Show alert only after passing L1 or L2
       alert(`Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`);
    }
    currentLevel = levelNumber;
    level1Passed = (currentLevel > 1); // Update L1 status
    level2QuestionNumber = 1; // Always reset L2 progress when moving levels
    // No saving needed
    displayLevel(currentLevel);
}

// --- No Reset Function needed ---

// --- Initial Load (Sets up Start Screen) ---
// (Moved to top)
