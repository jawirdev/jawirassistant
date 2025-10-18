/* global Chart */ // Memberitahu linter bahwa Chart.js ada secara global

document.addEventListener('DOMContentLoaded', () => {

    // ==================================
    // SELEKTOR ELEMEN (VARIABEL)
    // ==================================
    const themeToggle = document.getElementById('theme-toggle');
    const cursorLight = document.querySelector('.cursor-light');
    
    // (BARU) Navigasi Sidenav
    const menuToggle = document.getElementById('menu-toggle');
    const sidenav = document.getElementById('sidenav');
    const overlay = document.getElementById('overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // Halaman
    const pages = document.querySelectorAll('.page');
    const btnMulai = document.getElementById('btn-mulai');
    
    // Halaman Menu
    const menuHeaders = document.querySelectorAll('.menu-header');
    const btnCoba = document.querySelectorAll('.btn-coba');
    
    // Halaman Fitur (Umum)
    const btnBack = document.querySelectorAll('.btn-back');

    // Halaman 1 (Info Device)
    const infoTime = document.getElementById('info-time');
    const infoDevice = document.getElementById('info-device');
    const infoBattery = document.getElementById('info-battery');
    const infoIp = document.getElementById('info-ip');
    const infoLocation = document.getElementById('info-location');
    const infoNetwork = document.getElementById('info-network');

    // Halaman 3 (TikTok)
    const btnPetunjukTiktok = document.getElementById('btn-petunjuk-tiktok');
    const modalPetunjukTiktok = document.getElementById('modal-petunjuk-tiktok');
    const btnTutupPetunjuk = document.getElementById('btn-tutup-petunjuk');
    const tiktokUrlInput = document.getElementById('tiktok-url');
    const btnDownloadTiktok = document.getElementById('btn-download-tiktok');
    const loadingSpinner = document.getElementById('loading-spinner');
    const tiktokResults = document.getElementById('tiktok-results');

    // (BARU) Variabel untuk Chart (agar tidak dibuat ulang)
    let visitorsChartInstance = null;
    let featuresChartInstance = null;


    // ==================================
    // (BARU) FUNGSI NAVIGASI SIDENAV
    // ==================================
    function toggleMenu() {
        sidenav.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah link default
            const targetPageId = e.currentTarget.getAttribute('data-target');
            if (targetPageId) {
                showPage(targetPageId);
                toggleMenu(); // Tutup menu setelah klik
            }
        });
    });


    // ==================================
    // FUNGSI GANTI HALAMAN
    // ==================================
    function showPage(pageId) {
        pages.forEach(page => {
            if (page.id === pageId) {
                setTimeout(() => {
                    page.classList.add('active');
                    // (BARU) Jika halaman analitik, muat grafiknya
                    if (pageId === 'page-analytics') {
                        loadAnalyticsCharts();
                    }
                }, 100);
            } else {
                page.classList.remove('active');
            }
        });
    }

    // Navigasi: Halaman 1 -> Halaman 2
    btnMulai.addEventListener('click', () => {
        showPage('page-menu');
    });

    // Navigasi: Halaman 2 -> Halaman 3 (Fitur)
    btnCoba.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetPageId = e.target.getAttribute('data-target');
            if (targetPageId) {
                showPage(targetPageId);
            }
        });
    });

    // Navigasi: Halaman 3/4 (Fitur) -> Halaman 2
    btnBack.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // (BERUBAH) Ambil target dari currentTarget (tombol)
            const targetPageId = e.currentTarget.getAttribute('data-target');
            if (targetPageId) {
                showPage(targetPageId);
            }
        });
    });

    // ==================================
    // FUNGSI MODE GELAP / TERANG
    // ==================================
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        // (BARU) Muat ulang grafik jika di halaman analitik agar warna update
        if (document.getElementById('page-analytics').classList.contains('active')) {
            loadAnalyticsCharts(true); // 'true' berarti paksa muat ulang
        }
    });

    // ==================================
    // FUNGSI EFEK VISUAL
    // ==================================
    // (BERUBAH) Efek Kuas/Cahaya
    document.addEventListener('mousemove', (e) => {
        // Penyesuaian agar posisi lebih pas di tengah kuas
        cursorLight.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
    });
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        cursorLight.style.transform = `translate(${touch.clientX - 250}px, ${touch.clientY - 250}px)`;
    });


    // ==================================
    // FUNGSI HALAMAN 1: INFO DEVICE
    // ==================================
    function loadDeviceInfo() {
        // ... (Fungsi ini tidak berubah, tetap sama)
        function updateTime() {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            infoTime.textContent = now.toLocaleDateString('id-ID', options);
        }
        updateTime();
        setInterval(updateTime, 1000);
        infoDevice.textContent = navigator.userAgentData?.platform || navigator.platform || 'Tidak diketahui';
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                function updateBatteryStatus() {
                    const level = (battery.level * 100).toFixed(0);
                    const charging = battery.charging ? '(Mengisi daya)' : '(Tidak mengisi)';
                    infoBattery.textContent = `${level}% ${charging}`;
                }
                updateBatteryStatus();
                battery.addEventListener('levelchange', updateBatteryStatus);
                battery.addEventListener('chargingchange', updateBatteryStatus);
            });
        } else { infoBattery.textContent = 'Tidak didukung'; }
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) { infoNetwork.textContent = connection.effectiveType ? `${connection.effectiveType.toUpperCase()}` : 'Tidak diketahui';
        } else { infoNetwork.textContent = 'Tidak didukung'; }
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                infoIp.textContent = data.ip || 'Gagal memuat';
                infoLocation.textContent = `${data.city}, ${data.region}, ${data.country_name}`;
            })
            .catch(error => {
                console.error('Error fetching IP info:', error);
                infoIp.textContent = 'Gagal memuat';
                infoLocation.textContent = 'Gagal memuat';
            });
    }
    loadDeviceInfo();

    // ==================================
    // FUNGSI HALAMAN 2: MENU
    // ==================================
    menuHeaders.forEach(header => {
        // ... (Fungsi ini tidak berubah, tetap sama)
        header.addEventListener('click', () => {
            const item = header.closest('.menu-item');
            item.classList.toggle('active');
            document.querySelectorAll('.menu-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });


    // ==================================
    // FUNGSI HALAMAN 3: TIKTOK
    // ==================================
    // ... (Semua fungsi TikTok (petunjuk, download, displayResults) tetap sama)
    btnPetunjukTiktok.addEventListener('click', () => modalPetunjukTiktok.classList.add('active'));
    btnTutupPetunjuk.addEventListener('click', () => modalPetunjukTiktok.classList.remove('active'));
    btnDownloadTiktok.addEventListener('click', () => {
        const url = tiktokUrlInput.value.trim();
        if (!url) { alert('Silakan masukkan URL TikTok terlebih dahulu.'); return; }
        tiktokResults.innerHTML = '';
        loadingSpinner.style.display = 'flex';
        const apiUrl = `https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(url)}`;
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
                return response.json();
            })
            .then(data => {
                loadingSpinner.style.display = 'none';
                if (data.status === true && data.data) { displayTikTokResults(data.data); }
                else { displayError(data.message || 'Gagal mendapatkan data dari API.'); }
            })
            .catch(error => {
                loadingSpinner.style.display = 'none';
                console.error('Error fetching TikTok data:', error);
                displayError('Terjadi kesalahan. Cek konsol (F12) untuk detail.');
            });
    });
    function displayTikTokResults(data) {
        // ... (fungsi sama persis)
        const metadata = data.metadata;
        const downloads = data.download;
        tiktokResults.innerHTML = '';
        const resultElement = document.createElement('div');
        resultElement.classList.add('tiktok-result-item');
        let title = metadata.title || metadata.description || 'Video TikTok';
        if (title.length > 100) { title = title.substring(0, 100) + '...'; }
        let downloadLinksHTML = '';
        if (downloads.video && downloads.video.length > 0) {
            downloads.video.forEach((videoUrl, index) => {
                let qualityLabel = `Video ${index + 1}`;
                if (videoUrl.includes('original')) qualityLabel = 'Video Original (HD)';
                downloadLinksHTML += `<a href="${videoUrl}" target="_blank" download>Unduh ${qualityLabel}</a>`;
            });
        } else { downloadLinksHTML = '<p>Tidak ada link video yang ditemukan.</p>'; }
        resultElement.innerHTML = `
            <h4>${title}</h4>
            <p>
                <i class="bi bi-play-circle"></i> ${metadata.stats.playCount.toLocaleString('id-ID')} views | 
                <i class="bi bi-heart"></i> ${metadata.stats.likeCount.toLocaleString('id-ID')} likes
            </p>
            <div class="download-links">${downloadLinksHTML}</div>`;
        tiktokResults.appendChild(resultElement);
    }
    function displayError(message) {
        tiktokResults.innerHTML = `<div class="error-message">${message}</div>`;
    }

    // ==================================
    // (BARU) FUNGSI HALAMAN 4: ANALITIK
    // ==================================
    function loadAnalyticsCharts(forceReload = false) {
        // Ambil warna dari CSS Variables
        const isDarkMode = document.body.classList.contains('dark-mode');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDarkMode ? '#e0e9f5' : '#1a1a1a';
        const primaryColor = isDarkMode ? '#00bfff' : '#007aff';
        
        // Hancurkan chart lama jika ada (untuk ganti tema)
        if (forceReload) {
            if (visitorsChartInstance) visitorsChartInstance.destroy();
            if (featuresChartInstance) featuresChartInstance.destroy();
            visitorsChartInstance = null;
            featuresChartInstance = null;
        }

        // --- Grafik Pengunjung ---
        if (!visitorsChartInstance) {
            const ctxVisitors = document.getElementById('visitors-chart').getContext('2d');
            // (Data Placeholder)
            const visitorData = {
                labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                datasets: [{
                    label: 'Pengunjung',
                    data: [150, 230, 180, 210, 250, 300, 280], // Data dummy
                    fill: true,
                    backgroundColor: primaryColor + '33', // Transparan
                    borderColor: primaryColor,
                    tension: 0.4, // Membuat garis melengkung
                    pointBackgroundColor: primaryColor,
                }]
            };
            visitorsChartInstance = new Chart(ctxVisitors, {
                type: 'line',
                data: visitorData,
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: textColor },
                            grid: { color: gridColor }
                        },
                        x: {
                            ticks: { color: textColor },
                            grid: { color: gridColor }
                        }
                    }
                }
            });
        }

        // --- Grafik Fitur ---
        if (!featuresChartInstance) {
            const ctxFeatures = document.getElementById('features-chart').getContext('2d');
            // (Data Placeholder)
            const featureData = {
                labels: ['TikTok Downloader', 'YouTube Downloader (Segera)', 'Lainnya'],
                datasets: [{
                    label: 'Penggunaan Fitur',
                    data: [450, 0, 120], // Data dummy
                    backgroundColor: [
                        primaryColor,
                        '#8e8e93', // Abu-abu
                        isDarkMode ? '#1a2940' : '#e0e0e0'
                    ],
                    borderColor: 'transparent',
                }]
            };
            featuresChartInstance = new Chart(ctxFeatures, {
                type: 'doughnut', // Tipe Donat
                data: featureData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: textColor }
                        }
                    }
                }
            });
        }
    }

});
