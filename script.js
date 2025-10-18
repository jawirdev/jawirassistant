/* global Chart */

document.addEventListener('DOMContentLoaded', () => {

    // ==================================
    // (BARU) PRELOADER
    // ==================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }

    // ==================================
    // SELEKTOR ELEMEN
    // ==================================
    const themeToggle = document.getElementById('theme-toggle');
    const cursorLight = document.querySelector('.cursor-light');
    const toastContainer = document.getElementById('toast-container');
    
    // Navigasi Sidenav
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

    // Halaman 1 (Info Device) - Tetap
    const infoTime = document.getElementById('info-time');
    const infoDevice = document.getElementById('info-device');
    const infoBattery = document.getElementById('info-battery');
    const infoIp = document.getElementById('info-ip');
    const infoLocation = document.getElementById('info-location');
    const infoNetwork = document.getElementById('info-network');

    // Halaman 3 (TikTok)
    const tiktokUrlInput = document.getElementById('tiktok-url');
    const btnDownloadTiktok = document.getElementById('btn-download-tiktok');
    const loadingSpinnerTiktok = document.getElementById('loading-spinner-tiktok');

    // Halaman 4 (YT Play)
    const ytPlayQueryInput = document.getElementById('yt-play-query');
    const btnSearchYtPlay = document.getElementById('btn-search-yt-play');
    const loadingSpinnerYtPlay = document.getElementById('loading-spinner-yt-play');

    // Halaman 5 (YT Transcript)
    const ytTranscriptUrlInput = document.getElementById('yt-transcript-url');
    const btnGetYtTranscript = document.getElementById('btn-get-yt-transcript');
    const loadingSpinnerYtTranscript = document.getElementById('loading-spinner-yt-transcript');

    // Halaman 6 (YT Summary)
    const ytSummaryUrlInput = document.getElementById('yt-summary-url');
    const btnGetYtSummary = document.getElementById('btn-get-yt-summary');
    const loadingSpinnerYtSummary = document.getElementById('loading-spinner-yt-summary');

    // Halaman 7 (Analitik)
    let visitorsChartInstance = null;
    let featuresChartInstance = null;

    // (BARU) Selektor Petunjuk
    const btnsPetunjuk = document.querySelectorAll('.btn-petunjuk');
    const btnsTutupPetunjuk = document.querySelectorAll('.btn-tutup-petunjuk');


    // ==================================
    // (BARU) FUNGSI TOAST NOTIFICATION
    // ==================================
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Hapus toast setelah 3 detik
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==================================
    // FUNGSI NAVIGASI (Tetap)
    // ==================================
    function toggleMenu() {
        sidenav.classList.toggle('active');
        overlay.classList.toggle('active');
    }
    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = e.currentTarget.getAttribute('data-target');
            if (targetPageId) { showPage(targetPageId); toggleMenu(); }
        });
    });

    function showPage(pageId) {
        pages.forEach(page => {
            if (page.id === pageId) {
                setTimeout(() => {
                    page.classList.add('active');
                    if (pageId === 'page-analytics') loadAnalyticsCharts();
                }, 100);
            } else {
                page.classList.remove('active');
            }
        });
    }
    btnMulai.addEventListener('click', () => showPage('page-menu'));
    btnCoba.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetPageId = e.target.getAttribute('data-target');
            if (targetPageId) showPage(targetPageId);
        });
    });
    btnBack.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetPageId = e.currentTarget.getAttribute('data-target');
            if (targetPageId) showPage(targetPageId);
        });
    });

    // ==================================
    // FUNGSI MODE GELAP / TERANG (Tetap)
    // ==================================
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        if (document.getElementById('page-analytics').classList.contains('active')) {
            loadAnalyticsCharts(true);
        }
    });

    // ==================================
    // FUNGSI EFEK VISUAL (Tetap)
    // ==================================
    document.addEventListener('mousemove', (e) => {
        cursorLight.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
    });
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        cursorLight.style.transform = `translate(${touch.clientX - 250}px, ${touch.clientY - 250}px)`;
    });

    // ==================================
    // FUNGSI HALAMAN 1: INFO DEVICE (Tetap)
    // ==================================
    function loadDeviceInfo() {
        // ... (Fungsi ini tidak berubah, tetap sama)
        function updateTime() {
            const now = new Date();
            infoTime.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
        updateTime(); setInterval(updateTime, 1000);
        infoDevice.textContent = navigator.userAgentData?.platform || navigator.platform || 'Tidak diketahui';
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                function updateBatteryStatus() {
                    const level = (battery.level * 100).toFixed(0);
                    infoBattery.textContent = `${level}% ${battery.charging ? '(Mengisi daya)' : '(Tidak mengisi)'}`;
                }
                updateBatteryStatus();
                battery.addEventListener('levelchange', updateBatteryStatus);
                battery.addEventListener('chargingchange', updateBatteryStatus);
            });
        } else { infoBattery.textContent = 'Tidak didukung'; }
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        infoNetwork.textContent = connection ? (connection.effectiveType ? `${connection.effectiveType.toUpperCase()}` : 'Tidak diketahui') : 'Tidak didukung';
        fetch('https://ipapi.co/json/').then(response => response.json()).then(data => {
            infoIp.textContent = data.ip || 'Gagal memuat';
            infoLocation.textContent = `${data.city}, ${data.region}, ${data.country_name}`;
        }).catch(() => { infoIp.textContent = 'Gagal memuat'; infoLocation.textContent = 'Gagal memuat'; });
    }
    loadDeviceInfo();

    // ==================================
    // FUNGSI HALAMAN 2: MENU (Tetap)
    // ==================================
    menuHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.menu-item');
            item.classList.toggle('active');
            document.querySelectorAll('.menu-item').forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
        });
    });

    // ==================================
    // (BARU) FUNGSI PETUNJUK
    // ==================================
    btnsPetunjuk.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Cari modal yang sesuai dengan tombol
            const modalId = e.currentTarget.id.replace('btn-petunjuk-', 'modal-petunjuk-');
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add('active');
        });
    });

    btnsTutupPetunjuk.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.currentTarget.getAttribute('data-target');
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.remove('active');
        });
    });


    // ==================================
    // FUNGSI API (UMUM) - (DIUBAH)
    // ==================================
    async function fetchApi(url, resultsContainerId, spinnerElement, displayFunction) {
        const resultsContainer = document.getElementById(resultsContainerId);
        resultsContainer.innerHTML = '';
        spinnerElement.style.display = 'flex';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Tangkap error HTTP (spt 404, 500)
                throw new Error(`Error Jaringan: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            
            let success = false;
            let responseData = null;

            if (data.success === true && data.data) { // Format ZenzzXD
                success = true;
                responseData = data.data;
            } else if (data.status === true && data.data) { // Format Siputzx
                success = true;
                responseData = data.data;
            }

            if (success) {
                displayFunction(responseData, resultsContainerId);
                showToast('Berhasil dimuat!', 'success'); // (BARU) Notifikasi sukses
            } else {
                // Jika API mengembalikan status 200 tapi 'success: false'
                throw new Error(data.message || data.msg || 'API mengembalikan data, tapi gagal.');
            }
        } catch (error) {
            console.error('Error fetching API:', error);
            // (DIUBAH) Pesan error lebih jelas
            let userMessage = 'Terjadi kesalahan.';
            if (error.message.includes('Failed to fetch')) {
                userMessage = 'Gagal terhubung ke API. (Kemungkinan error CORS atau API offline)';
            } else {
                userMessage = `Gagal: ${error.message}`;
            }
            
            displayError(userMessage, resultsContainerId);
            showToast(userMessage, 'error'); // (BARU) Notifikasi error
        } finally {
            spinnerElement.style.display = 'none';
        }
    }

    function displayError(message, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }


    // ==================================
    // FUNGSI HALAMAN 3: TIKTOK (DIUBAH)
    // ==================================
    btnDownloadTiktok.addEventListener('click', () => {
        const url = tiktokUrlInput.value.trim();
        if (!url) {
            showToast('Silakan masukkan URL TikTok.', 'error');
            return;
        }
        const apiUrl = `https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(url)}`;
        fetchApi(apiUrl, 'tiktok-results', loadingSpinnerTiktok, displayTikTokResults);
    });

    function displayTikTokResults(data, containerId) {
        // ... (Fungsi ini tidak berubah, tetap sama)
        const container = document.getElementById(containerId);
        const metadata = data.metadata;
        const downloads = data.download;
        let title = metadata.title || metadata.description || 'Video TikTok';
        if (title.length > 100) title = title.substring(0, 100) + '...';
        let downloadLinksHTML = '';
        if (downloads.video && downloads.video.length > 0) {
            downloads.video.forEach((videoUrl, index) => {
                let qualityLabel = `Video ${index + 1}`;
                if (videoUrl.includes('original')) qualityLabel = 'Video Original (HD)';
                downloadLinksHTML += `<a href="${videoUrl}" target="_blank" download>Unduh ${qualityLabel}</a>`;
            });
        } else { downloadLinksHTML = '<p>Tidak ada link video yang ditemukan.</p>'; }
        container.innerHTML = `<div class="result-item"><h4>${title}</h4><p><i class="bi bi-play-circle"></i> ${metadata.stats.playCount.toLocaleString('id-ID')} | <i class="bi bi-heart"></i> ${metadata.stats.likeCount.toLocaleString('id-ID')}</p><div class="download-links">${downloadLinksHTML}</div></div>`;
    }

    // ==================================
    // FUNGSI HALAMAN 4: YT PLAY (DIUBAH)
    // ==================================
    btnSearchYtPlay.addEventListener('click', () => {
        const query = ytPlayQueryInput.value.trim();
        if (!query) {
            showToast('Silakan masukkan judul video.', 'error');
            return;
        }
        const apiUrl = `https://api.zenzxz.my.id/api/search/play?query=${encodeURIComponent(query)}`;
        fetchApi(apiUrl, 'yt-play-results', loadingSpinnerYtPlay, displayYouTubePlayResults);
    });

    function displayYouTubePlayResults(data, containerId) {
        // ... (Fungsi ini tidak berubah, tetap sama)
        const container = document.getElementById(containerId);
        const metadata = data.metadata;
        container.innerHTML = `<div class="result-item"><h4>${metadata.title}</h4><p><i class="bi bi-person-circle"></i> ${metadata.channel || 'Tidak diketahui'} | <i class="bi bi-clock-history"></i> ${metadata.duration || 'N/A'}</p><div class="download-links"><a href="${data.dl_mp3}" target="_blank" download>Unduh MP3</a><a href="${data.dl_mp4}" target="_blank" download>Unduh MP4</a></div></div>`;
    }

    // ==================================
    // FUNGSI HALAMAN 5: YT TRANSCRIPT (DIUBAH)
    // ==================================
    btnGetYtTranscript.addEventListener('click', () => {
        const url = ytTranscriptUrlInput.value.trim();
        if (!url) {
            showToast('Silakan masukkan URL YouTube.', 'error');
            return;
        }
        const apiUrl = `https://api.zenzxz.my.id/api/tools/ytranscript?url=${encodeURIComponent(url)}`;
        fetchApi(apiUrl, 'yt-transcript-results', loadingSpinnerYtTranscript, displayTranscriptResults);
    });

    function displayTranscriptResults(data, containerId) {
        // ... (Fungsi ini tidak berubah, tetap sama)
        const container = document.getElementById(containerId);
        container.innerHTML = `<div class="transcript-box"><h4>${data.title}</h4><p>${data.transcript}</p></div>`;
    }

    // ==================================
    // FUNGSI HALAMAN 6: YT SUMMARY (DIUBAH)
    // ==================================
    btnGetYtSummary.addEventListener('click', () => {
        const url = ytSummaryUrlInput.value.trim();
        if (!url) {
            showToast('Silakan masukkan URL YouTube.', 'error');
            return;
        }
        const apiUrl = `https://api.zenzxz.my.id/api/tools/ytsummarizer?url=${encodeURIComponent(url)}&lang=id`;
        fetchApi(apiUrl, 'yt-summary-results', loadingSpinnerYtSummary, displaySummaryResults);
    });

    function displaySummaryResults(data, containerId) {
        // ... (Fungsi ini tidak berubah, tetap sama)
        const container = document.getElementById(containerId);
        let content = data.content.replace(/<br\s*\/?>/gi, '\n');
        content = content.replace(/<\/?(h1|h2|h3|h4|h5|b|strong|p|ul|li|ol)>/gi, '');
        if (content.includes('Poin Kunci:')) {
            content = content.replace('Poin Kunci:', '<h5>Poin Kunci:</h5><ul>') + '</ul>';
            content = content.replace(/\*\* (.*?)\n/g, '<li><strong>$1</strong></li>');
        }
        container.innerHTML = `<div class="summary-box">${content}</div>`;
    }

    // ==================================
    // FUNGSI HALAMAN 7: ANALITIK (Tetap)
    // ==================================
    function loadAnalyticsCharts(forceReload = false) {
        // ... (Fungsi ini tidak berubah, tetap sama)
        const isDarkMode = document.body.classList.contains('dark-mode');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDarkMode ? '#e0e9f5' : '#1a1a1a';
        const primaryColor = isDarkMode ? '#00bfff' : '#007aff';
        if (forceReload) { if (visitorsChartInstance) visitorsChartInstance.destroy(); if (featuresChartInstance) featuresChartInstance.destroy(); visitorsChartInstance = null; featuresChartInstance = null; }
        if (!visitorsChartInstance) {
            const ctxVisitors = document.getElementById('visitors-chart').getContext('2d');
            visitorsChartInstance = new Chart(ctxVisitors, { type: 'line', data: { labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], datasets: [{ label: 'Pengunjung', data: [150, 230, 180, 210, 250, 300, 280], fill: true, backgroundColor: primaryColor + '33', borderColor: primaryColor, tension: 0.4, pointBackgroundColor: primaryColor, }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } }, x: { ticks: { color: textColor }, grid: { color: gridColor } } } } });
        }
        if (!featuresChartInstance) {
            const ctxFeatures = document.getElementById('features-chart').getContext('2d');
            featuresChartInstance = new Chart(ctxFeatures, { type: 'doughnut', data: { labels: ['TikTok', 'YT Play', 'Transkrip', 'Ringkasan'], datasets: [{ label: 'Penggunaan Fitur', data: [450, 210, 80, 50], backgroundColor: [primaryColor, '#ff3b30', '#34c759', '#ff9500'], borderColor: 'transparent', }] }, options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: textColor } } } } });
        }
    }

});
