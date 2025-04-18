// Kyros's Prophet Mechanism - FINAL Version (Stateless, Start Screen, L1 Stable, L2 3-Q Fixed, Reward)

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false; // Tracks L1 pass within the current session
let lastSymbolClicked = null; // State for L1 logic
let level2QuestionNumber = 1; // State for L2 logic (current question)

// --- DOM References ---
let mechanismDiv; // Main game container
let mainTitle;    // Main H1 title
let startScreen;  // Start screen container

// --- Discount Codes ---
const SWISS_CODE = "KYROSILEU20";
const THY_CODE = "MERHABAKYROSILEU";

// --- Initial Setup on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Ready. Setting up initial screen.");
    try {
        // Get references to main layout elements
        startScreen = document.getElementById('start-screen');
        mainTitle = document.querySelector('h1#main-title');
        mechanismDiv = document.getElementById('mechanism');
        const startGameButton = document.getElementById('start-game-button');

        // Check if all essential elements exist
        if (!startScreen || !mainTitle || !mechanismDiv || !startGameButton) {
            console.error("Initial setup error: One or more essential layout elements not found! Check index.html IDs.");
            if(document.body) document.body.innerHTML = "<h1 style='color:red;'>Page Load Error! Essential elements missing (start-screen, main-title, mechanism, start-game-button).</h1>";
            return;
        }

        // Set initial visibility: Show start screen, hide game
        startScreen.style.display = 'flex';
        mainTitle.style.display = 'none';
        mechanismDiv.style.display = 'none';

        // Attach listener to the start button
        startGameButton.addEventListener('click', startGame);
        console.log("Initial screen setup complete. Waiting for Start button.");

    } catch (error) {
        console.error("Error during initial DOM setup:", error);
        // Display a user-friendly error if setup fails
        if(document.body) document.body.innerHTML = `<h1 style='color:red;'>Page Load Error! ${error.message}</h1>`;
    }
});

// --- Function to Start the Game ---
function startGame() {
    console.log("Start button clicked. Starting game...");
    try {
        // Ensure references are valid before hiding/showing
        startScreen = document.getElementById('start-screen');
        mainTitle = document.querySelector('h1#main-title');
        mechanismDiv = document.getElementById('mechanism');

        if (startScreen) startScreen.style.display = 'none';   // Hide start screen
        if (mainTitle) mainTitle.style.display = 'block';    // Show game title
        if (mechanismDiv) mechanismDiv.style.display = 'block'; // Show game area

        // Use setTimeout for stability before rendering Level 1 content
        setTimeout(() => {
            console.log("Deferred call to displayLevel(1) from startGame");
            // Initialize game state for Level 1 start
            currentLevel = 1;
            level1Passed = false;
            lastSymbolClicked = null;
            level2QuestionNumber = 1;
            // Display the first level
            displayLevel(1);
        }, 0); // Use setTimeout 0 to ensure display changes render first

    } catch(error) {
        console.error("Error in startGame function:", error);
        if(mechanismDiv) mechanismDiv.innerHTML = `<p style='color:red;'>Error starting game: ${error.message}</p>`;
    }
}


// --- Core Display Function (Handles all levels/screens) ---
function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    try {
        mechanismDiv = document.getElementById('mechanism');
        if (!mechanismDiv) { console.error("Mechanism container div not found!"); return; }
        mechanismDiv.innerHTML = ''; // Clear previous level content safely

        mainTitle = document.querySelector('h1#main-title'); // Ensure reference is fresh
        if (mainTitle) {
             mainTitle.style.display = 'block'; // Ensure title is visible
             // Set title based on level/screen
             if (levelNumber <= 2) { mainTitle.textContent = `Kyros's Prophet Mechanism - Level ${levelNumber}`; }
             else { mainTitle.textContent = `Kyros's Prophet Mechanism - Reward / Ödül`; }
        }

        // Define Reset button HTML (only added for levels > 1)
        let resetButtonHTML = (levelNumber > 1) ? `<p style="margin-top: 30px;"><button onclick="resetGame()">Reset to Start</button></p>` : '';

        // --- Level 1 Display ---
        if (levelNumber === 1) {
            console.log("Setting up Level 1 HTML...");
            mechanismDiv.innerHTML = `
                <h2>Level 1 / Seviye 1</h2>
                <div id="mechanism-symbols">
                    <button id="symbol-triangle" title="Triangle / Üçgen">△</button>
                    <button id="symbol-square" title="Square / Kare">□</button>
                    <button id="symbol-circle" title="Circle / Daire">○</button>
                </div>
                <div id="indicator"></div>
                <p>Discover the primary functions. / Temel fonksiyonları keşfedin.</p>
                ${resetButtonHTML} `;
            attachLevel1Listeners(); // Attach L1 interactive elements listeners
            updateIndicator(''); // Set initial indicator state

        // --- Level 2 Display ---
        } else if (levelNumber === 2) {
            console.log(`Setting up Level 2 HTML for Q${level2QuestionNumber}...`);
            let questionTextTR = ""; let questionTextEN = "";
            // Define questions based on the current question number state
            if (level2QuestionNumber === 1) { questionTextTR = "Soru 1: Kyrosil'in ana sponsoru kimdir?"; questionTextEN = "Q1: Who is the main sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 2) { questionTextTR = "Soru 2: Kyrosil'in son sponsoru kimdir?"; questionTextEN = "Q2: Who is the latest sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 3) { questionTextTR = "Soru 3: Bu iki sponsorun (Swiss Air & Turkish Airlines) ortak bağlı olduğu havayolu ittifakı hangisidir?"; questionTextEN = "Q3: What airline alliance do these two sponsors (Swiss Air & Turkish Airlines) belong to?"; }
            else { questionTextTR = "Hata: Geçersiz soru durumu. Başa dönülüyor."; questionTextEN = "Error: Invalid question state. Resetting."; level2QuestionNumber = 1; } // Fallback

            mechanismDiv.innerHTML = `
                <h2>Level 2 / Seviye 2: Bilgi Kontrolü / Knowledge Check (${level2QuestionNumber}/3)</h2>
                <p class="level2-instructions">${questionTextTR}<br><em>(${questionTextEN})</em></p>
                <input type="text" id="level2-answer-input" placeholder="Cevabınızı girin / Enter your answer..." autocomplete="off" style="text-transform:uppercase">
                <button id="level2-answer-submit">Cevabı Gönder / Submit Answer</button>
                <p id="level2-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p>
                ${resetButtonHTML} `;
            attachLevel2AnswerListeners(); // Attach L2 interactive elements listeners

        // --- Reward Screen Display (Level 3+) ---
        } else {
             console.log(`Displaying Reward Screen (Level ${levelNumber}).`);
             mechanismDiv.innerHTML = `
                <h2>Tebrikler! Seviyeler Tamamlandı! / Congratulations! Levels Completed!</h2>
                <p class="reward-instructions" style="color:red; font-weight:bold;">
                    KESİNLİKLE havayolu şirketine kayıtlı E-POSTA ADRESİNİZİ ilgili alana girin. İndirim kodunuz bu e-posta ile eşleştirilecektir! (En az birini doldurmanız zorunludur.)<br>
                    <span style="font-size:0.9em; opacity:0.8;">(Please enter the E-MAIL ADDRESS registered with the airline company in the relevant field. Your discount code will be matched with this e-mail! Filling in at least one is mandatory.)</span>
                </p>
                <div style="margin-top: 15px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
                    <label for="swiss-email" style="display: block; margin-bottom: 2px;">Swiss Air'e kayıtlı mail / Email registered with Swiss Air:</label>
                    <input type="email" id="swiss-email" placeholder="swiss_email@example.com" style="margin-bottom: 10px; width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;"><br>
                    <label for="thy-email" style="display: block; margin-bottom: 2px;">Turkish Airlines/Miles&Smiles kayıtlı mail / Email registered with Turkish Airlines/Miles&Smiles:</label>
                    <input type="email" id="thy-email" placeholder="thy_email@example.com" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <button id="get-code-button" style="margin-top: 20px; padding: 10px 20px; font-size: 1.1em; line-height: 1.3;">İndirim Kod(lar)ımı Göster / Get My Discount Code(s)</button>
                <p id="reward-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p> <div id="discount-code-area" style="margin-top: 20px; text-align: left; font-weight: normal; font-size: 1em; display: none; border: 1px solid #2ecc71; padding: 20px; background-color: #eafaf1; line-height: 1.7; border-radius: 6px;">
                    </div>
                 ${resetButtonHTML} `;
             attachRewardScreenListeners(); // Attach reward screen listeners
        }
        console.log(`displayLevel for Level ${levelNumber} finished setup.`);
    } catch(error) {
        console.error("Error during displayLevel execution:", error);
        if(mechanismDiv) mechanismDiv.innerHTML = `<p style="color:red; font-weight:bold;">Error loading level content! Please try refreshing. Error: ${error.message}</p>`;
    }
}


// --- Level 1 Specific Functions ---
function attachLevel1Listeners() {
    setTimeout(() => { // Keep setTimeout fix
        try {
            const triangleBtn = document.getElementById('symbol-triangle'); const squareBtn = document.getElementById('symbol-square'); const circleBtn = document.getElementById('symbol-circle');
            if (!triangleBtn || !squareBtn || !circleBtn) { console.error("Could not find L1 buttons!"); return; }
            console.log("Attaching L1 listeners...");
            triangleBtn.addEventListener('click', () => handleSymbolClick('triangle')); squareBtn.addEventListener('click', () => handleSymbolClick('square')); circleBtn.addEventListener('click', () => handleSymbolClick('circle'));
        } catch (error) { console.error("Error attaching L1 listeners:", error); }
    }, 0);
}

function handleSymbolClick(symbol) {
    if (currentLevel !== 1) return; // Safety check
    console.log(`handleSymbolClick: ${symbol}`);
    try {
        let colorToSet = '';
        if (symbol === 'triangle') { colorToSet = 'red'; lastSymbolClicked = 'triangle'; }
        else if (symbol === 'square') {
            if (lastSymbolClicked === 'triangle') { colorToSet = 'green'; lastSymbolClicked = null; }
            else { colorToSet = 'blue'; lastSymbolClicked = null; // Reset sequence attempt state
                 // Check if already passed only *after* determining color
                 if (!level1Passed) {
                     level1Passed = true; // Mark L1 as passed for this session
                     console.log("Level 1 Pass Condition Met (BLUE)!");
                     updateIndicator(colorToSet); // Update color visually FIRST
                     setTimeout(() => goToLevel(2), 500); // Then transition
                     return; // Important: Exit after triggering transition
                 }
            }
        } else if (symbol === 'circle') { colorToSet = ''; lastSymbolClicked = null; }
        updateIndicator(colorToSet); // Update color for non-passing moves
    } catch (error) { console.error("Error in handleSymbolClick:", error); }
}

function updateIndicator(color) {
    try { const indicatorEl = document.getElementById('indicator'); if (indicatorEl) { indicatorEl.style.backgroundColor = color || '#ddd'; } }
    catch (error) { console.error("Error updating indicator:", error); }
}

// --- Level 2 Specific Functions ---
function attachLevel2AnswerListeners() {
    setTimeout(() => { // Keep setTimeout fix
        try {
            const inputEl = document.getElementById('level2-answer-input'); const submitBtn = document.getElementById('level2-answer-submit');
            if (!inputEl || !submitBtn) { console.error("L2 Listener Error: Elements not found!"); return; }
            console.log("Attaching L2 Answer listeners...");
            // Ensure listeners are fresh if displayLevel re-renders
            const newSubmitBtn = submitBtn.cloneNode(true);
            inputEl.parentNode.replaceChild(newSubmitBtn, submitBtn); // Replace old button with clone
            const newInputEl = inputEl.cloneNode(true);
            inputEl.parentNode.replaceChild(newInputEl, inputEl); // Replace old input with clone

            newSubmitBtn.addEventListener('click', handleLevel2AnswerSubmit);
            newInputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !newSubmitBtn.disabled) { handleLevel2AnswerSubmit(); } });
        } catch(error) { console.error("Error attaching L2 listeners", error); }
    }, 0);
}

function handleLevel2AnswerSubmit() {
    console.log("handleLevel2AnswerSubmit called for Q" + level2QuestionNumber);
    try {
        // Re-select elements within the handler to be safe
        const inputEl = document.getElementById('level2-answer-input'); const messageEl = document.getElementById('level2-message'); const submitBtn = document.getElementById('level2-answer-submit');
        if (!inputEl || !messageEl || !submitBtn || submitBtn.disabled) { console.log("L2 Submit stopped: elements missing or button disabled."); return; }

        let answer = inputEl.value.trim().toUpperCase(); messageEl.textContent = '';
        if (!answer) { messageEl.textContent = "Lütfen bir cevap girin. / Please enter an answer."; return; }

        let correctAnswers = []; let currentQ = level2QuestionNumber;
        // Correct Answer Order
        if (currentQ === 1) { correctAnswers = ["THY", "TÜRK HAVA YOLLARI", "TK", "TURKISH AIRLINES"]; }
        else if (currentQ === 2) { correctAnswers = ["SWISS AIR", "SWISSAIR"]; }
        else if (currentQ === 3) { correctAnswers = ["STAR ALLIANCE"]; }
        else { console.error("Invalid question number:", currentQ); messageEl.textContent = "Question Error."; return; }

        submitBtn.disabled = true; inputEl.disabled = true; // Disable during processing

        if (correctAnswers.includes(answer)) { // CORRECT
            console.log(`Correct answer for Q${currentQ}`); level2QuestionNumber++;
            // No need to save stateless progress
            if (level2QuestionNumber > 3) { // Passed Level 2
                messageEl.textContent = "Doğru! Seviye 2 tamamlandı! / Correct! Level 2 completed!"; setTimeout(() => goToLevel(3), 1500);
            } else { // Go to next question
                messageEl.textContent = `Doğru! Sonraki soruya geçiliyor (${level2QuestionNumber}/3)... / Correct! Moving to the next question (${level2QuestionNumber}/3)...`; setTimeout(() => displayLevel(2), 1500);
            }
        } else { // INCORRECT - Reset to Q1
            console.log(`Incorrect answer for Q${currentQ}. Resetting to Q1.`); level2QuestionNumber = 1;
            messageEl.textContent = "Yanlış cevap! İlk soruya geri dönülüyor... / Incorrect! Returning to the first question...";
            setTimeout(() => displayLevel(2), 2000); // Reload L2 display (shows Q1, controls are re-enabled by displayLevel calling attachListeners)
        }
    } catch(error) { console.error("Error during handleLevel2AnswerSubmit:", error); if(messageEl) messageEl.textContent = "Cevap işlenirken hata oluştu. / Error processing answer."; /* Re-enable controls on error */ const submitBtn = document.getElementById('level2-answer-submit'); const inputEl = document.getElementById('level2-answer-input'); if(submitBtn) submitBtn.disabled = false; if(inputEl) inputEl.disabled = false;}
}


// --- Reward Screen Functions ---
function attachRewardScreenListeners() {
    setTimeout(() => { // Keep setTimeout fix
        try {
            const getCodeBtn = document.getElementById('get-code-button');
            if (!getCodeBtn) { console.error("Reward Listener Error!"); return; }
            console.log("Attaching Reward Screen listeners...");
            // Ensure fresh listener
            const newGetCodeBtn = getCodeBtn.cloneNode(true);
            getCodeBtn.parentNode.replaceChild(newGetCodeBtn, getCodeBtn);
            newGetCodeBtn.addEventListener('click', handleGetCodeClick);
        } catch(error) { console.error("Error attaching reward listeners", error); }
    }, 0);
}

function handleGetCodeClick() {
    console.log("handleGetCodeClick called");
    try {
        const swissInput = document.getElementById('swiss-email'); const thyInput = document.getElementById('thy-email'); const codeArea = document.getElementById('discount-code-area'); const messageEl = document.getElementById('reward-message'); const getCodeBtn = document.getElementById('get-code-button');
        if (!swissInput || !thyInput || !codeArea || !messageEl || !getCodeBtn) { console.error("Reward Error: Missing elements."); if (messageEl) messageEl.textContent="Interface Error."; return; }

        const swissEmail = swissInput.value.trim(); const thyEmail = thyInput.value.trim();
        messageEl.textContent = '';

        if (swissEmail === '' && thyEmail === '') { messageEl.textContent = "Lütfen en az bir alana e-postanızı girin. / Please enter your email in at least one field."; return; }

        let codeOutput = '<h3>İndirim Kod(lar)ınız / Your Discount Code(s):</h3>'; let addedCode = false;
        if (swissEmail !== '') { codeOutput += `<p>Swiss Air Discount (%20): <strong style="color:blue; font-size: 1.2em;">${SWISS_CODE}</strong></p>`; addedCode = true; }
        if (thyEmail !== '') { if (addedCode && swissEmail !== '') codeOutput += '<br>'; codeOutput += `<p>Turkish Airlines Discount (%25): <strong style="color:red; font-size: 1.2em;">${THY_CODE}</strong></p>`; addedCode = true; }

        if(addedCode){
            codeOutput += `<hr style="margin: 15px 0; border-top: 1px dashed #ccc;">`;
            codeOutput += `<p style="font-size: 0.9em; color: #555;"><strong>Detaylar & Koşullar / Details & Conditions:</strong><br>- Business Class dahildir / Business Class included.<br>- İndirim vergi ve harçlar hariç ana ücrete uygulanır / Discount applies to base fare (excludes taxes and fees).<br>- Son Geçerlilik Tarihi / Valid until: <strong>April 30, 2025</strong>.</p>`;
        } else { codeOutput = "<p>No code to display.</p>"; }

        codeArea.innerHTML = codeOutput; codeArea.style.display = 'block';
        swissInput.disabled = true; thyInput.disabled = true; getCodeBtn.disabled = true; getCodeBtn.textContent = "Kod(lar) Gösterildi / Code(s) Revealed!";
        console.log("Discount code(s) and details displayed.");

    } catch (error) { console.error("Error in handleGetCodeClick:", error); if(messageEl) messageEl.textContent = "Error retrieving code: " + error.message; }
}


// --- Navigation ---
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    if (passedLevel > 0 && levelNumber <= 2 ) { // Alert only after L1 pass
       alert(`Tebrikler! Seviye ${passedLevel} Geçildi!\nSeviye ${levelNumber}'e ilerleniyor... / Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`);
    } else { console.log(`Moving to Level ${levelNumber}...`); }
    currentLevel = levelNumber;
    level1Passed = (currentLevel > 1);
    level2QuestionNumber = 1; // Always reset L2 Q# when moving levels
    displayLevel(currentLevel);
}

// --- Reset Functionality (Stateless: Reloads page) ---
function resetGame() {
    console.warn("Resetting game by reloading page!");
    try {
        // Add confirmation dialog for user experience
        if (confirm("Tüm ilerlemeyi sıfırlayıp başlangıç ekranına dönmek istediğinizden emin misiniz? / Are you sure you want to reset all progress and return to the start screen?")) {
            window.location.reload(); // Simple reload resets stateless game
        }
    } catch(e) { console.error("Error resetting progress:", e); alert("Error resetting progress: " + e.message); }
}
