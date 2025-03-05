/**
 * Huawei Band Switcher
 * Script untuk mengalihkan band secara otomatis antara B3 dan B8
 * pada router Huawei B310
 */

// Konfigurasi waktu dalam milidetik
const CONFIG = {
    BAND_INTERVAL: 600000, // 10 menit
    CONFIRMATION_DELAY: 5000, // 5 detik
    ERROR_RETRY_DELAY: 5000 // 5 detik
};

/**
 * Fungsi utama untuk mengalihkan band
 * Berjalan dalam loop tak terbatas sampai tab browser ditutup
 */
async function switchBands() {
    while (true) {
        try {
            console.log("🔄 Step 1: Uncheck B8 dan mengaktifkan B3");
            // Pastikan B8 uncheck terlebih dahulu
            document.getElementById('LTE_B8').checked = false;

            // Kemudian klik B3 (FDD 1800)
            document.getElementById('LTE_B3').click();
            document.getElementById('mobilensetting_apply').click();

            // Tunggu dialog konfirmasi muncul dan klik OK
            await new Promise(resolve => setTimeout(resolve, CONFIG.CONFIRMATION_DELAY));
            let confirmButton = document.getElementById('pop_confirm');
            if (confirmButton) {
                confirmButton.click();
            }

            console.log(`🕒 Menunggu ${CONFIG.BAND_INTERVAL / 60000} menit sebelum berpindah ke Band 8...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.BAND_INTERVAL));

            console.log("🔄 Step 2: Uncheck B3 dan mengaktifkan B8");
            // Uncheck B3 dan klik B8 (FDD 900)
            document.getElementById('LTE_B3').checked = false;
            document.getElementById('LTE_B8').click();
            document.getElementById('mobilensetting_apply').click();

            // Tunggu dialog konfirmasi muncul dan klik OK
            await new Promise(resolve => setTimeout(resolve, CONFIG.CONFIRMATION_DELAY));
            confirmButton = document.getElementById('pop_confirm');
            if (confirmButton) {
                confirmButton.click();
            }

            console.log(`🕒 Menunggu ${CONFIG.BAND_INTERVAL / 60000} menit sebelum kembali ke Band 3...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.BAND_INTERVAL));

            console.log("🔄 Memulai siklus baru...");

        } catch (error) {
            console.error("❌ Terjadi error:", error);
            console.error(`⏳ Mencoba lagi dalam ${CONFIG.ERROR_RETRY_DELAY / 1000} detik...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.ERROR_RETRY_DELAY));
        }
    }
}

// Jalankan fungsi dalam loop terpisah
(async function() {
    console.log("🚀 Band Switcher dimulai...");
    console.log("⚡ Script akan bergantian antara Band 3 (FDD 1800) dan Band 8 (FDD 900)");
    console.log(`🔁 Interval perpindahan: ${CONFIG.BAND_INTERVAL / 60000} menit`);
    while (true) {
        await switchBands();
    }
})();
