console.log("Attempting EXTREME simplification test...");

try {
    // Tüm oyun mantığını, seviyeleri, kaydetmeyi unutalım şimdilik.
    // Sadece DOM hazır olduğunda H1 başlığını değiştirebiliyor muyuz, ona bakalım.
    document.addEventListener('DOMContentLoaded', function() {
        console.log("DOM Ready! Trying to modify elements...");
        try {
            const titleElement = document.querySelector('h1');
            if (titleElement) {
                titleElement.textContent = "SCRIPT IS RUNNING!"; // Başlığı değiştir
                console.log("Title changed successfully!");
            } else {
                console.error("H1 title element not found!");
                alert("Hata: Ana başlık (h1) bulunamadı!"); // Hata varsa uyar
            }

            // Mekanizma div'ini bulup içine yazı yazmayı deneyelim
            const mechDiv = document.getElementById('mechanism');
            if (mechDiv) {
                 mechDiv.innerHTML = '<p style="color: green; font-weight: bold;">Mechanism div found and modified by simple script.</p>'; // İçeriği değiştir
                 console.log("Mechanism div updated successfully!");
            } else {
                 console.error("Mechanism div not found!");
                 alert("Hata: Mekanizma alanı (id=mechanism) bulunamadı!"); // Hata varsa uyar
            }
            console.log("Simple script execution finished without throwing errors inside DOMContentLoaded.");
            // alert("Test script finished without known errors."); // İsteğe bağlı: Başarı uyarısı

        } catch (innerError) {
             console.error("Error inside DOMContentLoaded:", innerError);
             alert("Sayfa içeriği değiştirilirken hata oluştu: " + innerError.message);
        }
    });

} catch (outerError) {
     // Bu bloğun çalışması pek olası değil ama her ihtimale karşı
     console.error("GLOBAL ERROR:", outerError);
     alert("Kod çalıştırılırken genel bir hata oluştu: " + outerError.message);
}
