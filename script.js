alert("Alert 1: Script start"); // Keep alerts

try {
    document.addEventListener('DOMContentLoaded', function() {
        alert("Alert 2: DOM Ready, calling loadGame...");
        loadGame();
        alert("Alert 8: loadGame call finished (potentially).");
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

    function saveGame(level) { /* ... önceki kod ... */ }
    function saveLevel2Attempts(attempts) { /* ... önceki kod ... */ }
    function loadGame() { /* ... önceki kod ... */ }
    function loadLevel2Attempts() { /* ... önceki kod ... */ }

    function displayLevel(levelNumber) {
        alert(`Alert 6: displayLevel started for Level ${levelNumber}...`);
        try {
            mechanismDiv = document.getElementById('mechanism');
            if (!mechanismDiv) { alert("ERROR: mechanismDiv not found!"); return; }
            mechanismDiv.innerHTML = '';

            const mainTitle = document.querySelector('h1');
            if (mainTitle) mainTitle.textContent = `Kyros's ... Level ${levelNumber}`;

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
                 alert("displayLevel: Level 1 HTML set. Calling attachListeners with setTimeout...");
                 // ***** DİNLEYİCİLERİ setTimeout İLE EKLE *****
                 attachLevel1Listeners();
                 updateIndicator('');
                 alert("displayLevel: attachLevel1Listeners call finished (may run later).");
            } else {
                 alert(`displayLevel: Displaying placeholder for Level ${levelNumber}...`);
                 mechanismDiv.innerHTML = `<p>Placeholder for Level ${levelNumber}</p>` + resetButtonHTML;
                 alert(`displayLevel: Placeholder set for Level ${levelNumber}.`);
            }
        } catch (error) { console.error("Error in displayLevel:", error); alert("ERROR inside displayLevel: " + error.message); }
    }

    // --- Level 1 Specific Functions ---
    function attachLevel1Listeners() {
        alert("attachLevel1Listeners called...");
        // ***** setTimeout KULLAN *****
        setTimeout(() => {
            alert("Inside setTimeout for attaching listeners..."); // Bu alert önemli
            const triangleBtn = document.getElementById('symbol-triangle');
            const squareBtn = document.getElementById('symbol-square');
            const circleBtn = document.getElementById('symbol-circle');
            if (!triangleBtn || !squareBtn || !circleBtn) {
                alert("ERROR: Could not find Level 1 buttons INSIDE setTimeout!"); return;
            }
            console.log("Attaching Level 1 listeners inside setTimeout..."); // Keep console log
            triangleBtn.addEventListener('click', () => handleSymbolClick('triangle'));
            squareBtn.addEventListener('click', () => handleSymbolClick('square'));
            circleBtn.addEventListener('click', () => handleSymbolClick('circle'));
            alert("attachLevel1Listeners finished inside setTimeout."); // Bu alert de önemli
        }, 0); // 0ms gecikme, DOM güncellemesinden sonra çalıştırır
    }

    function handleSymbolClick(symbol) {
         // ***** TIKLAMA OLDU MU KONTROL ET *****
         alert(`handleSymbolClick called for: ${symbol}`); // Bu alert çok önemli!
         if (currentLevel !== 1) return;
         console.log(`${symbol} clicked in Level 1`);

         let colorToSet = '';
         if (symbol === 'triangle') {
            colorToSet = 'red';
            lastSymbolClicked = 'triangle';
         } else if (symbol === 'square') {
             if (lastSymbolClicked === 'triangle') {
                 colorToSet = 'green';
                 lastSymbolClicked = null;
             } else {
                 colorToSet = 'blue';
                 if (!level1Passed) {
                     level1Passed = true;
                     console.log("Level 1 Pass Condition Met!");
                     updateIndicator(colorToSet);
                     setTimeout(() => goToLevel(2), 500);
                     return;
                 }
                 lastSymbolClicked = null;
             }
         } else if (symbol === 'circle') {
             colorToSet = '';
             lastSymbolClicked = null;
         }
         updateIndicator(colorToSet);
    }

    function updateIndicator(color) {
         const indicatorEl = document.getElementById('indicator');
         if (indicatorEl) {
             indicatorEl.style.backgroundColor = color || '#ddd';
             console.log(`Indicator color set to: ${color || 'default(#ddd)'}`);
         }
    }

    // --- Level 2 Specific Functions --- (Hala boş/çağrılmıyor)
    function attachLevel2Listeners(target){}
    function handleLevel2Submit(target){}

    // --- Navigation & Reset ---
    function goToLevel(levelNumber) { /* ... önceki kod ... */ }
    function resetToLevel1() { /* ... önceki kod ... */ }

} catch(outerError) {
    console.error("Global script error:", outerError);
    alert("GLOBAL ERROR before DOM Ready: " + outerError.message);
}
