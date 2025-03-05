/**
 * Huawei Band Switcher
 * Script untuk mengalihkan band secara otomatis antara B1, B3, dan B8
 * pada router Huawei B310
 */

// Konfigurasi waktu dalam milidetik
const CONFIG = {
    BAND_INTERVAL: 500000, // 10 menit
    CONFIRMATION_DELAY: 5000, // 5 detik
    ERROR_RETRY_DELAY: 5000 // 5 detik
};

// Urutan perpindahan band: B1 → B3 → B8
const BAND_SEQUENCE = ["B1", "B3", "B8"];
let currentBandIndex = 0;

/**
 * Fungsi utama untuk mengalihkan band
 * Berjalan dalam loop tak terbatas sampai tab browser ditutup
 */
async function switchBands() {
    while (true) {
        try {
            let nextBand = BAND_SEQUENCE[currentBandIndex];

            console.log(`🔄 Step: Uncheck semua band dan mengaktifkan ${nextBand}`);

            // Uncheck semua pilihan band LTE
            document.querySelectorAll("input[name='LTE_Band']").forEach(checkbox => checkbox.checked = false);

            // Aktifkan band berikutnya
            let bandCheckbox = document.getElementById(`LTE_${nextBand}`);
            if (bandCheckbox) {
                bandCheckbox.click();
                console.log(`✅ Berhasil memilih LTE ${nextBand}.`);
            } else {
                console.error(`❌ Band ${nextBand} tidak ditemukan di halaman.`);
                return;
            }

            // Tekan tombol Apply jika ditemukan
            let applyButton = document.getElementById("mobilensetting_apply");
            if (applyButton) {
                console.log("⏳ Menekan tombol Apply...");
                setTimeout(() => {
                    applyButton.click();
                    console.log("✅ Tombol Apply ditekan!");
                }, 1000);
            } else {
                console.error("❌ Tombol Apply tidak ditemukan.");
                return;
            }

            // Tunggu dialog konfirmasi dan tekan OK jika ada
            await new Promise(resolve => setTimeout(resolve, CONFIG.CONFIRMATION_DELAY));
            let confirmButton = document.getElementById("pop_confirm");
            if (confirmButton) {
                confirmButton.click();
            }

            console.log(`🕒 Menunggu ${CONFIG.BAND_INTERVAL / 60000} menit sebelum berpindah ke band berikutnya...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.BAND_INTERVAL));

            // Pindah ke band berikutnya dalam urutan
            currentBandIndex = (currentBandIndex + 1) % BAND_SEQUENCE.length;

            console.log("🔄 Memulai siklus baru...");

        } catch (error) {
            console.error("❌ Terjadi error:", error);
            console.error(`⏳ Mencoba lagi dalam ${CONFIG.ERROR_RETRY_DELAY / 1000} detik...`);
            await new Promise(resolve => setTimeout(resolve, CONFIG.ERROR_RETRY_DELAY));
        }
    }
}

// Jalankan fungsi dalam loop terpisah
(async function () {
    console.log("🚀 Band Switcher dimulai...");
    console.log("⚡ Script akan bergantian antara Band 1 (FDD 2100), Band 3 (FDD 1800), dan Band 8 (FDD 900)");
    console.log(`🔁 Interval perpindahan: ${CONFIG.BAND_INTERVAL / 60000} menit`);
    while (true) {
        await switchBands();
    }
})();
