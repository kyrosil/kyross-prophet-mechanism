console.log("Kyros's Prophet Mechanism script loaded!");

// HTML elemanlarını seçelim
const triangleButton = document.getElementById('symbol-triangle');
const squareButton = document.getElementById('symbol-square');
const circleButton = document.getElementById('symbol-circle');
const indicator = document.getElementById('indicator');

// Durum değişkeni (State variable)
let lastSymbolClicked = null; // Son tıklanan sembolün türünü tutar ('triangle', 'square', 'circle')

// Gösterge rengini güncelleyen fonksiyon
function updateIndicator(color) {
    if (indicator) {
        indicator.style.backgroundColor = color || '#ddd'; // Renk boşsa varsayılan renge dön
        console.log(`Indicator color set to: ${color || 'default'}`);
    }
}

// Olay dinleyicileri (Event Listeners)
if (triangleButton && squareButton && circleButton && indicator) {

    triangleButton.addEventListener('click', () => {
        console.log("Triangle clicked");
        updateIndicator('red');
        lastSymbolClicked = 'triangle'; // Üçgen tıklandı olarak hatırla
    });

    squareButton.addEventListener('click', () => {
        console.log("Square clicked");
        if (lastSymbolClicked === 'triangle') {
            // Sıra doğru: Üçgen -> Kare
            updateIndicator('green');
            lastSymbolClicked = null; // Sıra tamamlandı, sıfırla
        } else {
            // Normal kare tıklaması (sıra dışı)
            updateIndicator('blue');
            lastSymbolClicked = null; // Sıra bozuldu, sıfırla
        }
    });

    circleButton.addEventListener('click', () => {
        console.log("Circle clicked");
        updateIndicator(''); // Rengi sıfırla (varsayılan renge döner)
        lastSymbolClicked = null; // Sırayı sıfırla
    });

} else {
    console.error("Could not find all mechanism elements!");
}
