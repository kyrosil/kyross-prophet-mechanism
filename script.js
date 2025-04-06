alert("Alert 1: Script start"); // Keep alerts for now

try {
    document.addEventListener('DOMContentLoaded', function() {
        alert("Alert 2: DOM Ready, calling loadGame...");
        loadGame();
        alert("Alert 8: loadGame call finished (potentially)."); // If it completes
    });

    // --- Global Variables ---
    let currentLevel = 1;
    let level1Passed = false;
    let lastSymbolClicked = null;
    let level2Attempts = 5;
    let mechanismDiv;
    const LEVEL_STORAGE_KEY = 'kyrosMechanismLevel';
    const L2_ATTEMPTS_STORAGE_KEY = 'kyrosMechanismL2Attempts';
    // ----------------------------------------------------

    function saveGame(level) {
        try {
            localStorage.setItem(LEVEL_STORAGE_KEY, level);
            console.log(`Game saved at level: ${level}`);
        } catch (e) { console.error("Could not save game level!", e); alert("Warning: Could not save game progress."); }
    }

    function saveLevel2Attempts(attempts) {
         try { if (currentLevel === 2) { localStorage.setItem(L2_ATTEMPTS_STORAGE_KEY, attempts); console.log(`Level 2 attempts saved: ${attempts}`); }
         } catch (e) { console.error("Could not save L2 attempts", e); }
    }


    function loadGame() {
        alert("Alert 3: loadGame started...");
        try {
            const savedLevel = localStorage.getItem(LEVEL_STORAGE_KEY);
            currentLevel = savedLevel ? parseInt(savedLevel, 10) : 1;
            alert(`Alert 4: loadGame: Level determined as ${currentLevel}`);

            level1Passed = (currentLevel > 1);
            lastSymbolClicked = null;
            level2Attempts = (currentLevel === 2) ? loadLevel2Attempts() : 5;
            alert("Alert 5: loadGame: States reset, calling displayLevel...");

            displayLevel(currentLevel);
            alert("Alert 7: loadGame: displayLevel call finished (potentially).");

        } catch (e) { console.error("Error in loadGame:", e); alert("ERROR inside loadGame: " + e.message); }
    }

    function loadLevel2Attempts() { /* ... önceki kod (değişiklik yok) ... */ }

    function displayLevel(levelNumber) {
        alert(`Alert 6: displayLevel started for Level ${levelNumber}...`);
        try {
            mechanismDiv = document.getElementById('mechanism');
            if (!mechanismDiv) { alert("ERROR: mechanismDiv not found!"); return; }
            mechanismDiv.innerHTML = '';

            const mainTitle = document.querySelector('h1');
            if (mainTitle) mainTitle.textContent = `Kyros's ... Level ${levelNumber}`;

            // Add reset button placeholder (will be populated below)
            let resetButtonHTML = `<p><button onclick="resetToLevel1()">Reset to Level 1</button></p>`;

            if (levelNumber === 1) {
                 alert("displayLevel: Setting up Level 1 HTML...");
                 mechanismDiv.innerHTML = `
                    <div id="mechanism-symbols">
                        <button id="symbol-triangle">△</button>
                        <button id="symbol-square">□</button>
                        <button id="symbol-circle">○</button>
                    </div>
                    <div id="indicator" style="width:100px; height:100px; border: 1px solid black; background-color: #ddd; margin:auto;"></div>
                    <p>Level 1: Discover the primary functions.</p>
                 `;
                 alert("displayLevel: Level 1 HTML set. Attaching listeners...");
                 // ***** SEVİYE 1 DİNLEYİCİLERİNİ GERİ GETİR *****
                 attachLevel1Listeners();
                 updateIndicator(''); // Reset indicator on display
                 alert("displayLevel: Level 1 listeners attached.");
            } else { // Level 2 ve sonrası için placeholder + reset butonu
                 alert(`displayLevel: Displaying placeholder for Level ${levelNumber}...`);
                 mechanismDiv.innerHTML = `<p>Placeholder for Level ${levelNumber}</p>` + resetButtonHTML; // Add reset button
                 alert(`displayLevel: Placeholder set for Level ${levelNumber}.`);
            }
        } catch (error) { console.error("Error in displayLevel:", error); alert("ERROR inside displayLevel: " + error.message); }
    }

    // --- Level 1 Specific Functions --- (Tamamen geri yüklendi)
    function attachLevel1Listeners() {
        alert("attachLevel1Listeners called..."); // Test alert
        const triangleBtn = document.getElementById('symbol-triangle');
        const squareBtn = document.getElementById('symbol-square');
        const circleBtn = document.getElementById('symbol-circle');
        if (!triangleBtn || !squareBtn || !circleBtn) {
            alert("ERROR: Could not find Level 1 buttons to attach listeners!"); return;
        }
        console.log("Attaching Level 1 listeners..."); // Keep console log
        triangleBtn.addEventListener('click', () => handleSymbolClick('triangle'));
        squareBtn.addEventListener('click', () => handleSymbolClick('square'));
        circleBtn.addEventListener('click', () => handleSymbolClick('circle'));
         alert("attachLevel1Listeners finished."); // Test alert
    }

    function handleSymbolClick(symbol) {
         // Alert'ı buraya da ekleyebiliriz ama çok fazla olur, şimdilik kalsın.
         if (currentLevel !== 1) return;
         console.log(`${symbol} clicked in Level 1`);

         let colorToSet = '';
         if (symbol === 'triangle') { /* ... önceki kod ... */ }
         else if (symbol === 'square') { /* ... önceki kod ... */ }
         else if (symbol === 'circle') { /* ... önceki kod ... */ }
         updateIndicator(colorToSet);
    }

    function updateIndicator(color) { /* ... önceki kod ... */ }

    // --- Level 2 Specific Functions --- (Hala çağrılmıyorlar)
    function attachLevel2Listeners(target){}
    function handleLevel2Submit(target){}

    // --- Navigation & Reset ---
    function goToLevel(levelNumber) {
        const passedLevel = levelNumber - 1;
        alert(`Congratulations! Level ${passedLevel} Passed!\nMoving to Level ${levelNumber}...`); // Keep this alert
        currentLevel = levelNumber;
        saveGame(currentLevel);
        displayLevel(currentLevel);
    }

    function resetToLevel1() {
        alert("Resetting progress to Level 1..."); // Reset alert
        try {
            localStorage.removeItem(LEVEL_STORAGE_KEY);
            localStorage.removeItem(L2_ATTEMPTS_STORAGE_KEY); // Clear L2 attempts too
            alert("Progress reset. Reloading page...");
            window.location.reload(); // Reload the page
        } catch(e) {
            alert("Error resetting progress: " + e.message);
        }
    }

} catch(outerError) {
    console.error("Global script error:", outerError);
    alert("GLOBAL ERROR before DOM Ready: " + outerError.message);
}
