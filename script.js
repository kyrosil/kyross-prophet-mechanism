// Kyros's Prophet Mechanism - Final Script (Stateless, Bilingual Text, Visual Fixes Applied)

// --- Global Variables ---
let currentLevel = 1;
let level1Passed = false;
let lastSymbolClicked = null;
let level2QuestionNumber = 1;

// --- DOM References ---
let mechanismDiv;
let mainTitle;
let startScreen; // Added for start screen logic

// --- Discount Codes ---
const SWISS_CODE = "KYROSILEU20";
const THY_CODE = "MERHABAKYROSILEU";

// --- Initial Setup on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Ready. Setting up initial screen.");
    try {
        startScreen = document.getElementById('start-screen');
        mainTitle = document.querySelector('h1#main-title');
        mechanismDiv = document.getElementById('mechanism');
        const startGameButton = document.getElementById('start-game-button');

        if (!startScreen || !mainTitle || !mechanismDiv || !startGameButton) {
            console.error("Initial setup error: Essential elements not found!");
            if(document.body) document.body.innerHTML = "<h1 style='color:red;'>Page Load Error! Essential elements missing. Reload might fix.</h1>";
            return;
        }

        startScreen.style.display = 'flex';
        mainTitle.style.display = 'none';
        mechanismDiv.style.display = 'none';

        startGameButton.addEventListener('click', startGame);

    } catch (error) {
        console.error("Error during initial setup:", error);
        if(document.body) document.body.innerHTML = `<h1 style='color:red;'>Page Load Error! ${error.message}</h1>`;
    }
});

// --- Function to Start the Game ---
function startGame() {
    console.log("Start button clicked. Starting game...");
    try {
        if (startScreen) startScreen.style.display = 'none';
        if (mainTitle) mainTitle.style.display = 'block';
        if (mechanismDiv) mechanismDiv.style.display = 'block';

        setTimeout(() => { // Keep setTimeout fix for stability
            console.log("Deferred call to displayLevel(1) from startGame");
            currentLevel = 1; level1Passed = false; lastSymbolClicked = null; level2QuestionNumber = 1;
            displayLevel(1);
        }, 0);

    } catch(error) { console.error("Error in startGame function:", error); if(mechanismDiv) mechanismDiv.innerHTML = `<p style='color:red;'>Error starting game: ${error.message}</p>`; }
}


// --- Core Display Function ---
function displayLevel(levelNumber) {
    console.log(`Displaying Level ${levelNumber}`);
    try {
        mechanismDiv = document.getElementById('mechanism');
        if (!mechanismDiv) { console.error("Mechanism container div not found!"); return; }
        mechanismDiv.innerHTML = '';

        mainTitle = document.querySelector('h1#main-title');
        if (mainTitle) {
            mainTitle.style.display = 'block';
            if (levelNumber <= 2) { mainTitle.textContent = `Kyros's Prophet Mechanism - Level ${levelNumber}`; }
            else { mainTitle.textContent = `Kyros's Prophet Mechanism - Reward / Ödül`; } // Bilingual Title
        }

        // No Reset button needed in stateless version

        if (levelNumber === 1) {
            console.log("Setting up Level 1 HTML...");
            mechanismDiv.innerHTML = `
                <h2>Level 1 / Seviye 1</h2> <div id="mechanism-symbols">
                    <button id="symbol-triangle" title="Triangle / Üçgen">△</button>
                    <button id="symbol-square" title="Square / Kare">□</button>
                    <button id="symbol-circle" title="Circle / Daire">○</button>
                </div>
                <div id="indicator"></div>
                <p>Discover the primary functions. / Temel fonksiyonları keşfedin.</p> `;
            attachLevel1Listeners();
            updateIndicator('');

        } else if (levelNumber === 2) {
            console.log(`Setting up Level 2 HTML for Q${level2QuestionNumber}...`);
            let questionTextTR = "";
            let questionTextEN = "";
            // Determine which question to display
            if (level2QuestionNumber === 1) { questionTextTR = "Soru 1: Kyrosil'in ana sponsoru kimdir?"; questionTextEN = "Q1: Who is the main sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 2) { questionTextTR = "Soru 2: Kyrosil'in son sponsoru kimdir?"; questionTextEN = "Q2: Who is the latest sponsor of Kyrosil?"; }
            else if (level2QuestionNumber === 3) { questionTextTR = "Soru 3: Bu iki sponsorun (Swiss Air & Turkish Airlines) ortak bağlı olduğu havayolu ittifakı hangisidir?"; questionTextEN = "Q3: What airline alliance do these two sponsors (Swiss Air & Turkish Airlines) belong to?"; }
            else { questionTextTR = "Hata: Geçersiz soru durumu."; questionTextEN = "Error: Invalid question state."; level2QuestionNumber = 1; }

            mechanismDiv.innerHTML = `
                <h2>Level 2 / Seviye 2: Bilgi Kontrolü / Knowledge Check (${level2QuestionNumber}/3)</h2> <p class="level2-instructions">${questionTextTR}<br><em>(${questionTextEN})</em></p> <input type="text" id="level2-answer-input" placeholder="Cevabınızı girin / Enter your answer..." autocomplete="off" style="text-transform:uppercase">
                <button id="level2-answer-submit">Cevabı Gönder / Submit Answer</button> <p id="level2-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p>
                `;
            attachLevel2AnswerListeners();

        } else { // Level 3 or higher IS the Reward Screen
             console.log(`Displaying Reward Screen (Level ${levelNumber}).`);
             mechanismDiv.innerHTML = `
                <h2>Tebrikler! Seviyeler Tamamlandı! / Congratulations! Levels Completed!</h2> <p class="reward-instructions" style="color:red; font-weight:bold;">
                    KESİNLİKLE havayolu şirketine kayıtlı E-POSTA ADRESİNİZİ ilgili alana girin. İndirim kodunuz bu e-posta ile eşleştirilecektir! (En az birini doldurmanız zorunludur.)<br>
                    <span style="font-size:0.9em; opacity:0.8;">(Please enter the E-MAIL ADDRESS registered with the airline company in the relevant field. Your discount code will be matched with this e-mail! Filling in at least one is mandatory.)</span>
                </p>
                <div style="margin-top: 15px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
                    <label for="swiss-email" style="display: block; margin-bottom: 2px;">Swiss Air'e kayıtlı mail / Email registered with Swiss Air:</label>
                    <input type="email" id="swiss-email" placeholder="swiss_email@example.com" style="margin-bottom: 10px; width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;"><br>

                    <label for="thy-email" style="display: block; margin-bottom: 2px;">Turkish Airlines/Miles&Smiles kayıtlı mail / Email registered with Turkish Airlines/Miles&Smiles:</label>
                    <input type="email" id="thy-email" placeholder="thy_email@example.com" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
                </div>
                <button id="get-code-button" style="margin-top: 20px; padding: 10px 20px; font-size: 1.1em; line-height: 1.3;">İndirim Kod(lar)ımı Göster / Get My Discount Code(s)</button> <p id="reward-message" style="min-height: 1.2em; color: #d9534f; font-weight: bold;"></p>
                <div id="discount-code-area" style="margin-top: 20px; text-align: left; font-weight: normal; font-size: 1em; display: none; border: 1px solid #2ecc71; padding: 20px; background-color: #eafaf1; line-height: 1.7; border-radius: 6px;">
                    </div>
                 `;
             attachRewardScreenListeners();
        }
    } catch(error) { console.error("Error during displayLevel:", error); if(mechanismDiv) mechanismDiv.innerHTML = `<p style="color:red;">Error loading level content!</p>`; }
}


// --- Level 1 Specific Functions ---
function attachLevel1Listeners() { /* ... Önceki kod ... */ }
function handleSymbolClick(symbol) { /* ... Önceki kod ... */ }
function updateIndicator(color) { /* ... Önceki kod ... */ }

// --- Level 2 Specific Functions ---
function attachLevel2AnswerListeners() { /* ... Önceki kod ... */ }

function handleLevel2AnswerSubmit() {
    console.log("handleLevel2AnswerSubmit called for Q" + level2QuestionNumber);
    try {
        const inputEl = document.getElementById('level2-answer-input');
        const messageEl = document.getElementById('level2-message');
        const submitBtn = document.getElementById('level2-answer-submit');
        if (!inputEl || !messageEl || !submitBtn || submitBtn.disabled) { return; }

        let answer = inputEl.value.trim().toUpperCase();
        messageEl.textContent = '';
        if (!answer) { messageEl.textContent = "Lütfen bir cevap girin. / Please enter an answer."; return; } // Bilingual message

        let correctAnswers = [];
        let currentQ = level2QuestionNumber;

        if (currentQ === 1) { correctAnswers = ["THY", "TÜRK HAVA YOLLARI", "TK", "TURKISH AIRLINES"]; }
        else if (currentQ === 2) { correctAnswers = ["SWISS AIR", "SWISSAIR"]; }
        else if (currentQ === 3) { correctAnswers = ["STAR ALLIANCE"]; }
        else { console.error("Invalid question number:", currentQ); return; }

        submitBtn.disabled = true; inputEl.disabled = true;

        if (correctAnswers.includes(answer)) { // CORRECT
            console.log(`Correct answer for Q${currentQ}`);
            level2QuestionNumber++;
            if (level2QuestionNumber > 3) { // Passed Level 2
                messageEl.textContent = "Doğru! Seviye 2 tamamlandı! / Correct! Level 2 completed!"; setTimeout(() => goToLevel(3), 1500);
            } else { // Go to next question
                messageEl.textContent = `Doğru! Sonraki soruya geçiliyor (${level2QuestionNumber}/3)... / Correct! Moving to the next question (${level2QuestionNumber}/3)...`; setTimeout(() => displayLevel(2), 1500);
            }
        } else { // INCORRECT - Reset to Q1
            console.log(`Incorrect answer for Q${currentQ}. Resetting to Q1.`);
            level2QuestionNumber = 1;
            messageEl.textContent = "Yanlış cevap! İlk soruya geri dönülüyor... / Incorrect! Returning to the first question...";
            setTimeout(() => displayLevel(2), 2000);
        }
    } catch(error) { console.error("Error during handleLevel2AnswerSubmit:", error); if(messageEl) messageEl.textContent = "Cevap işlenirken hata oluştu. / Error processing answer."; /* Re-enable controls on error */ const submitBtn = document.getElementById('level2-answer-submit'); const inputEl = document.getElementById('level2-answer-input'); if(submitBtn) submitBtn.disabled = false; if(inputEl) inputEl.disabled = false;}
}


// --- Reward Screen Functions ---
function attachRewardScreenListeners() { /* ... Önceki kod ... */ }

function handleGetCodeClick() {
    console.log("handleGetCodeClick called");
    try {
        const swissInput = document.getElementById('swiss-email');
        const thyInput = document.getElementById('thy-email');
        const codeArea = document.getElementById('discount-code-area');
        const messageEl = document.getElementById('reward-message');
        const getCodeBtn = document.getElementById('get-code-button');

        if (!swissInput || !thyInput || !codeArea || !messageEl || !getCodeBtn) { console.error("Reward Error: Missing elements."); if (messageEl) messageEl.textContent="Arayüz hatası. / Interface Error."; return; }

        const swissEmail = swissInput.value.trim();
        const thyEmail = thyInput.value.trim();
        messageEl.textContent = '';

        if (swissEmail === '' && thyEmail === '') {
            messageEl.textContent = "Lütfen en az bir alana e-postanızı girin. / Please enter your email in at least one field."; return;
        }

        let codeOutput = '<h3>İndirim Kod(lar)ınız / Your Discount Code(s):</h3>'; let addedCode = false;
        if (swissEmail !== '') { codeOutput += `<p>Swiss Air Discount (%20): <strong style="color:blue; font-size: 1.2em;">${SWISS_CODE}</strong></p>`; addedCode = true; }
        if (thyEmail !== '') { if (addedCode && swissEmail !== '') codeOutput += '<br>'; codeOutput += `<p>Turkish Airlines Discount (%25): <strong style="color:red; font-size: 1.2em;">${THY_CODE}</strong></p>`; addedCode = true; }

        if(addedCode){
            codeOutput += `<hr style="margin: 15px 0; border-top: 1px dashed #ccc;">`;
            codeOutput += `<p style="font-size: 0.9em; color: #555;">`;
            codeOutput += `<strong>Detaylar & Koşullar / Details & Conditions:</strong><br>`;
            codeOutput += `- Business Class dahildir / Business Class included.<br>`;
            codeOutput += `- İndirim vergi ve harçlar hariç ana ücrete uygulanır / Discount applies to base fare (excludes taxes and fees).<br>`;
            codeOutput += `- Son Geçerlilik Tarihi / Valid until: <strong>April 30, 2025</strong>.`;
            codeOutput += `</p>`;
        } else { codeOutput = "<p>No code to display.</p>"; }


        codeArea.innerHTML = codeOutput; codeArea.style.display = 'block';
        swissInput.disabled = true; thyInput.disabled = true; getCodeBtn.disabled = true; getCodeBtn.textContent = "Kod(lar) Gösterildi / Code(s) Revealed!";
        console.log("Discount code(s) and details displayed.");

    } catch (error) { console.error("Error in handleGetCodeClick:", error); if(messageEl) messageEl.textContent = "Kod alınırken hata oluştu. / Error retrieving code."; }
}


// --- Navigation ---
function goToLevel(levelNumber) {
    const passedLevel = levelNumber - 1;
    // Show alert only after L1 or L2 pass
    if (passedLevel === 1 || passedLevel === 2) {
       alert(`Tebrikler! Seviye ${passedLevel} Geçildi!\nSeviye ${levelNumber}'e ilerleniyor... / Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`);
    } else { console.log(`Moving to Level ${levelNumber}...`); }
    currentLevel = levelNumber;
    level1Passed = (currentLevel > 1);
    level2QuestionNumber = 1; // Always reset L2 Q# when moving levels
    displayLevel(currentLevel);
}


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
     console.log("DOM Ready, setting up initial screen visibility.");
    try {
        startScreen = document.getElementById('start-screen');
        mainTitle = document.querySelector('h1#main-title');
        mechanismDiv = document.getElementById('mechanism');
        const startGameButton = document.getElementById('start-game-button');

        if (!startScreen || !mainTitle || !mechanismDiv || !startGameButton) { console.error("Essential elements missing!"); return; }

        startScreen.style.display = 'flex'; mainTitle.style.display = 'none'; mechanismDiv.style.display = 'none';
        startGameButton.addEventListener('click', startGame);
    } catch (error) { console.error("Error during initial setup:", error); }
});
