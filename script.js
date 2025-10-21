/* global Chart */

document.addEventListener('DOMContentLoaded', () => {

    // ==================================
    // PRELOADER & DESKTOP CHECK
    // ==================================
    const preloader = document.getElementById('preloader');
    if (window.innerWidth >= 1024) {
        if (preloader) preloader.classList.add('hidden');
    } else {
        // Biarkan preloader atau tampilkan warning (CSS akan handle)
        console.log("Layar terlalu kecil, mode desktop diperlukan.");
    }

    // ==================================
    // SELEKTOR ELEMEN
    // ==================================
    const themeToggle = document.getElementById('theme-toggle');
    const cursorLight = document.querySelector('.cursor-light');
    const toastContainer = document.getElementById('toast-container');
    
    // Navigasi
    const menuToggle = document.getElementById('menu-toggle');
    const sidenav = document.getElementById('sidenav');
    const overlay = document.getElementById('overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const btnMulai = document.getElementById('btn-mulai');
    const menuHeaders = document.querySelectorAll('.menu-header');
    const btnCoba = document.querySelectorAll('.btn-coba');
    const btnBack = document.querySelectorAll('.btn-back');

    // Halaman 1
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
    // Halaman 7 (Spotify Search)
    const spotifySearchQueryInput = document.getElementById('spotify-search-query');
    const btnSearchSpotify = document.getElementById('btn-search-spotify');
    const loadingSpinnerSpotifySearch = document.getElementById('loading-spinner-spotify-search');
    // Halaman 8 (Spotify Download)
    const spotifyDownloadUrlInput = document.getElementById('spotify-download-url');
    const btnDownloadSpotify = document.getElementById('btn-download-spotify');
    const loadingSpinnerSpotifyDownload = document.getElementById('loading-spinner-spotify-download');
    // Halaman 9 (iPhone Quote - IQC)
    const iqcPromptInput = document.getElementById('iqc-prompt');
    const iqcJamInput = document.getElementById('iqc-jam');
    const iqcBatreInput = document.getElementById('iqc-batre');
    const btnGenerateIqc = document.getElementById('btn-generate-iqc');
    const loadingSpinnerIqc = document.getElementById('loading-spinner-iqc'); 
    // Halaman 10 (Analitik)
    let visitorsChartInstance = null;
    let featuresChartInstance = null;
    // Selektor Petunjuk
    const btnsPetunjuk = document.querySelectorAll('.btn-petunjuk');
    const btnsTutupPetunjuk = document.querySelectorAll('.btn-tutup-petunjuk');

    // ... (Fungsi Toast, Navigasi, Mode Gelap, Efek Visual, Info Device, Menu, Petunjuk, Copy - Tetap Sama) ...
    function showToast(message, type = 'info') { const toast = document.createElement('div'); toast.classList.add('toast', type); toast.textContent = message; toastContainer.appendChild(toast); setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 3000); }
    function toggleMenu() { sidenav.classList.toggle('active'); overlay.classList.toggle('active'); }
    menuToggle.addEventListener('click', toggleMenu); overlay.addEventListener('click', toggleMenu); navLinks.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); const targetPageId = e.currentTarget.getAttribute('data-target'); if (targetPageId) { showPage(targetPageId); toggleMenu(); } }); });
    function showPage(pageId) { pages.forEach(page => { if (page.id === pageId) { setTimeout(() => { page.classList.add('active'); if (pageId === 'page-analytics') loadAnalyticsCharts(); }, 100); } else { page.classList.remove('active'); } }); }
    btnMulai.addEventListener('click', () => showPage('page-menu')); btnCoba.forEach(btn => { btn.addEventListener('click', (e) => { const targetPageId = e.target.getAttribute('data-target'); if (targetPageId) showPage(targetPageId); }); }); btnBack.forEach(btn => { btn.addEventListener('click', (e) => { const targetPageId = e.currentTarget.getAttribute('data-target'); if (targetPageId) showPage(targetPageId); }); });
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    themeToggle.addEventListener('click', () => { document.body.classList.toggle('dark-mode'); localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light'); if (document.getElementById('page-analytics').classList.contains('active')) { loadAnalyticsCharts(true); } });
    document.addEventListener('mousemove', (e) => { cursorLight.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`; }); document.addEventListener('touchmove', (e) => { const touch = e.touches[0]; cursorLight.style.transform = `translate(${touch.clientX - 250}px, ${touch.clientY - 250}px)`; });
    function loadDeviceInfo() { function updateTime() { const now = new Date(); infoTime.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }); } updateTime(); setInterval(updateTime, 1000); infoDevice.textContent = navigator.userAgentData?.platform || navigator.platform || 'Tidak diketahui'; if ('getBattery' in navigator) { navigator.getBattery().then(battery => { function updateBatteryStatus() { const level = (battery.level * 100).toFixed(0); infoBattery.textContent = `${level}% ${battery.charging ? '(Mengisi daya)' : '(Tidak mengisi)'}`; } updateBatteryStatus(); battery.addEventListener('levelchange', updateBatteryStatus); battery.addEventListener('chargingchange', updateBatteryStatus); }); } else { infoBattery.textContent = 'Tidak didukung'; } const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection; infoNetwork.textContent = connection ? (connection.effectiveType ? `${connection.effectiveType.toUpperCase()}` : 'Tidak diketahui') : 'Tidak didukung'; fetch('https://ipapi.co/json/').then(response => response.json()).then(data => { infoIp.textContent = data.ip || 'Gagal memuat'; infoLocation.textContent = `${data.city}, ${data.region}, ${data.country_name}`; }).catch(() => { infoIp.textContent = 'Gagal memuat'; infoLocation.textContent = 'Gagal memuat'; }); }
    loadDeviceInfo();
    menuHeaders.forEach(header => { header.addEventListener('click', () => { const item = header.closest('.menu-item'); item.classList.toggle('active'); document.querySelectorAll('.menu-item').forEach(otherItem => { if (otherItem !== item) otherItem.classList.remove('active'); }); }); });
    btnsPetunjuk.forEach(btn => { btn.addEventListener('click', (e) => { const modalId = e.currentTarget.id.replace('btn-petunjuk-', 'modal-petunjuk-'); const modal = document.getElementById(modalId); if (modal) modal.classList.add('active'); }); });
    btnsTutupPetunjuk.forEach(btn => { btn.addEventListener('click', (e) => { const modalId = e.currentTarget.getAttribute('data-target'); const modal = document.getElementById(modalId); if (modal) modal.classList.remove('active'); }); });
    async function copyToClipboard(text, btn) { try { await navigator.clipboard.writeText(text); showToast('Teks berhasil disalin!', 'success'); if (btn) {btn.innerHTML = '<i class="bi bi-check-lg"></i> Disalin'; setTimeout(() => btn.innerHTML='<i class="bi bi-clipboard"></i> Salin', 2000)} } catch (err) { console.error('Gagal menyalin:', err); showToast('Gagal menyalin teks.', 'error'); } }
    document.body.addEventListener('click', (e) => { const btn = e.target.closest('.btn-copy'); if (btn) { const targetId = btn.getAttribute('data-target'); const targetElement = document.getElementById(targetId); if (targetElement) { copyToClipboard(targetElement.innerText, btn); } } });


    // ==================================
    // FUNGSI API (UMUM - JSON) (Diperbarui)
    // ==================================
    async function fetchApi(url, resultsContainerId, spinnerElement, displayFunction) {
        const resultsContainer = document.getElementById(resultsContainerId);
        resultsContainer.innerHTML = '';
        spinnerElement.style.display = 'flex';
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error Jaringan: ${response.status} ${response.statusText}`);
            const data = await response.json();
            
            let success = false; 
            let responseData = null;
            if (data.success === true && data.data) { success = true; responseData = data.data; } // ZenzzXD
            else if (data.status === true && data.data) { success = true; responseData = data.data; } // Siputzx
            else if (data.status === true && data.result) { success = true; responseData = data.result; } // Faa
            else if (data.status === true && (data.artist || data.title) && data.download) { success = true; responseData = data; } // Agas Spotify
            
            if (success && responseData) {
                displayFunction(responseData, resultsContainerId);
                showToast('Berhasil dimuat!', 'success');
            } else {
                 // Cek jika error ada di 'reason' (beberapa API Faa)
                 if (data.status === false && data.reason) throw new Error(data.reason);
                 // Error umum
                throw new Error(data.message || data.msg || data.reason || 'Format API tidak dikenal atau data gagal.');
            }
        } catch (error) {
            console.error('Error fetching API:', error);
            let userMessage = 'Terjadi kesalahan.';
            if (error.message.includes('Failed to fetch')) {
                userMessage = 'Gagal terhubung ke API. (Kemungkinan error CORS atau API offline)';
            } else { userMessage = `Gagal: ${error.message}`; }
            displayError(userMessage, resultsContainerId);
            showToast(userMessage, 'error');
        } finally {
            spinnerElement.style.display = 'none';
        }
    }
    function displayError(message, containerId) { const container = document.getElementById(containerId); if (container) { container.innerHTML = `<div class="error-message">${message}</div>`; } }

    // ==================================
    // FUNGSI API (UMUM - GAMBAR) (Tetap)
    // ==================================
    async function fetchImageApi(url, resultsContainerId, spinnerElement, displayFunction, fileName) {
        const resultsContainer = document.getElementById(resultsContainerId);
        resultsContainer.innerHTML = '';
        spinnerElement.style.display = 'flex';
        try {
            const response = await fetch(url);
            if (response.ok && response.headers.get('Content-Type')?.includes('image')) {
                const blob = await response.blob();
                const imgUrl = URL.createObjectURL(blob);
                displayFunction(imgUrl, resultsContainerId, fileName); 
                showToast('Gambar berhasil dibuat!', 'success');
            } else {
                let errorMsg = `Error Jaringan: ${response.status}`;
                try { const errData = await response.json(); errorMsg = errData.message || errData.msg || errData.reason || errorMsg; } catch (e) {}
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('Error fetching Image API:', error);
            let userMessage = error.message.includes('Failed to fetch') ? 'Gagal terhubung ke API. (CORS atau API offline)' : `Gagal: ${error.message}`;
            displayError(userMessage, resultsContainerId);
            showToast(userMessage, 'error');
        } finally {
            spinnerElement.style.display = 'none';
        }
    }
    function displayImageResult(imgUrl, containerId, fileName = 'gambar.png') { const container = document.getElementById(containerId); container.innerHTML = `<img src="${imgUrl}" alt="Hasil Gambar"><a href="${imgUrl}" download="${fileName}" class="download-btn"><i class="bi bi-download"></i> Unduh Gambar</a>`; }

    // ==================================
    // FUNGSI HALAMAN 3: TIKTOK (Diperbarui API & Display)
    // ==================================
    btnDownloadTiktok.addEventListener('click', () => {
        const url = tiktokUrlInput.value.trim();
        if (!url) { showToast('Silakan masukkan URL TikTok.', 'error'); return; }
        const apiUrl = `https://api-faa.my.id/faa/tiktok?url=${encodeURIComponent(url)}`; 
        fetchApi(apiUrl, 'tiktok-results', loadingSpinnerTiktok, displayTikTokResults);
    });
    function displayTikTokResults(data, containerId) {
        const container = document.getElementById(containerId);
        let title = data.title || 'Konten TikTok';
        if (title.length > 100) title = title.substring(0, 100) + '...';
        
        let mediaHTML = '';
        let downloadLinksHTML = '';
        const audioUrl = data.music_info?.url;

        if (data.type === "video") {
            const videoUrl = data.data; // URL video utama (No WM)
            mediaHTML = `
                <div class="media-player-box">
                    <video controls src="${videoUrl}" type="video/mp4" poster="${data.cover}" preload="metadata"></video>
                </div>
                ${audioUrl ? `
                <div class="media-player-box" style="margin-top: 10px;">
                    <strong>Audio Original:</strong>
                    <audio controls src="${audioUrl}" type="audio/mpeg" preload="metadata"></audio>
                </div>` : ''}
            `;
            downloadLinksHTML += `<a href="${videoUrl}" target="_blank" download>Unduh Video (No WM)</a>`;
            // Cek jika ada link HD (API Faa mungkin tidak punya, pakai link 'data' lagi)
            if (data.size_nowm_hd) downloadLinksHTML += `<a href="${data.data}" target="_blank" download>Unduh Video (HD)</a>`; 
            if (audioUrl) downloadLinksHTML += `<a href="${audioUrl}" target="_blank" download="audio.mp3">Unduh Audio</a>`;

        } else if (data.type === "image") { // Handle slide/foto
            mediaHTML = `<p>Konten ini berupa slide gambar (${data.images.length} gambar). Silakan unduh satu per satu.</p>`;
             mediaHTML += `<div style="display:flex; flex-wrap:wrap; gap:5px; justify-content:center; max-height: 200px; overflow-y:auto; margin-bottom:10px;">`; // Preview kecil
             data.images.forEach(imgUrl => {
                 mediaHTML += `<img src="${imgUrl}" style="width:50px; height:auto; border-radius:4px;" alt="preview">`;
             });
             mediaHTML += `</div>`;
            if (data.images && Array.isArray(data.images)) {
                data.images.forEach((imgUrl, index) => {
                    downloadLinksHTML += `<a href="${imgUrl}" target="_blank" download="slide_${index + 1}.jpeg">Unduh Gbr ${index + 1}</a>`;
                });
            }
             if (audioUrl) downloadLinksHTML += `<a href="${audioUrl}" target="_blank" download="audio.mp3">Unduh Audio BGM</a>`;

        } else {
             mediaHTML = '<p>Format tidak didukung.</p>';
        }

        container.innerHTML = `
            <div class="result-item">
                <h4>${title}</h4>
                <p>Oleh: ${data.author?.nickname || 'N/A'} | <i class="bi bi-eye"></i> ${data.stats?.views || 'N/A'} | <i class="bi bi-heart"></i> ${data.stats?.likes || 'N/A'}</p>
                ${mediaHTML}
                <div class="download-links">${downloadLinksHTML || '<p>Tidak ada link unduhan.</p>'}</div>
            </div>`;
    }

    // ... (Fungsi Halaman 4, 5, 6, 7 - Tetap Sama) ...
    // Halaman 4: YT Play
    btnSearchYtPlay.addEventListener('click', () => { const query = ytPlayQueryInput.value.trim(); if (!query) { showToast('Silakan masukkan judul video.', 'error'); return; } const apiUrl = `https://api.zenzxz.my.id/api/search/play?query=${encodeURIComponent(query)}`; fetchApi(apiUrl, 'yt-play-results', loadingSpinnerYtPlay, displayYouTubePlayResults); });
    function displayYouTubePlayResults(data, containerId) { const container = document.getElementById(containerId); const metadata = data.metadata; container.innerHTML = `<div class="result-item"><h4>${metadata.title}</h4><p><i class="bi bi-person-circle"></i> ${metadata.channel || 'Tidak diketahui'} | <i class="bi bi-clock-history"></i> ${metadata.duration || 'N/A'}</p><div class="media-player-box"><strong>Audio:</strong><audio controls src="${data.dl_mp3}" type="audio/mpeg" preload="metadata"></audio></div><div class="media-player-box"><strong>Video:</strong><video controls src="${data.dl_mp4}" type="video/mp4" preload="metadata"></video></div><div class="download-links"><a href="${data.dl_mp3}" target="_blank" download>Unduh MP3</a><a href="${data.dl_mp4}" target="_blank" download>Unduh MP4</a></div></div>`; }
    // Halaman 5: YT Transcript
    btnGetYtTranscript.addEventListener('click', () => { const url = ytTranscriptUrlInput.value.trim(); if (!url) { showToast('Silakan masukkan URL YouTube.', 'error'); return; } const apiUrl = `https://api.zenzxz.my.id/api/tools/ytranscript?url=${encodeURIComponent(url)}`; fetchApi(apiUrl, 'yt-transcript-results', loadingSpinnerYtTranscript, displayTranscriptResults); });
    function displayTranscriptResults(data, containerId) { const container = document.getElementById(containerId); const textId = "transcript-text-1"; container.innerHTML = `<div class="transcript-box"><button class="btn-copy" data-target="${textId}"><i class="bi bi-clipboard"></i> Salin</button><h4>${data.title}</h4><p id="${textId}">${data.transcript}</p></div>`; }
    // Halaman 6: YT Summary
    btnGetYtSummary.addEventListener('click', () => { const url = ytSummaryUrlInput.value.trim(); if (!url) { showToast('Silakan masukkan URL YouTube.', 'error'); return; } const apiUrl = `https://api.zenzxz.my.id/api/tools/ytsummarizer?url=${encodeURIComponent(url)}&lang=id`; fetchApi(apiUrl, 'yt-summary-results', loadingSpinnerYtSummary, displaySummaryResults); });
    function displaySummaryResults(data, containerId) { const container = document.getElementById(containerId); const textId = "summary-text-1"; let content = data.content.replace(/<br\s*\/?>/gi, '\n'); content = content.replace(/<\/?(h1|h2|h3|h4|h5|b|strong|p|ul|li|ol)>/gi, ''); if (content.includes('Poin Kunci:')) { content = content.replace('Poin Kunci:', '<h5>Poin Kunci:</h5><ul>') + '</ul>'; content = content.replace(/\*\* (.*?)\n/g, '<li><strong>$1</strong></li>'); } container.innerHTML = `<div class="summary-box"><button class="btn-copy" data-target="${textId}"><i class="bi bi-clipboard"></i> Salin</button><div id="${textId}">${content}</div></div>`; }
    // Halaman 7: Spotify Search
    btnSearchSpotify.addEventListener('click', () => { const query = spotifySearchQueryInput.value.trim(); if (!query) { showToast('Silakan masukkan judul lagu atau artis.', 'error'); return; } const apiUrl = `https://api.siputzx.my.id/api/s/spotify?query=${encodeURIComponent(query)}`; fetchApi(apiUrl, 'spotify-search-results', loadingSpinnerSpotifySearch, displaySpotifySearchResults); });
    function displaySpotifySearchResults(data, containerId) { const container = document.getElementById(containerId); if (!data || data.length === 0) { displayError("Tidak ada hasil ditemukan.", containerId); return; } let html = ''; data.forEach(track => { html += `<div class="spotify-result-item"><img src="${track.thumbnail}" alt="Album Art"><div class="info"><h4>${track.title}</h4><p>${track.artist} • ${track.album}</p><p><i class="bi bi-calendar-event"></i> ${track.release_date} | <i class="bi bi-clock"></i> ${track.duration}</p></div><div class="actions"><a href="${track.track_url}" target="_blank" title="Buka di Spotify"><i class="bi bi-spotify"></i></a></div></div>`; }); container.innerHTML = html; }

    // ==================================
    // FUNGSI HALAMAN 8: SPOTIFY DOWNLOAD (Diperbarui API & Display)
    // ==================================
    btnDownloadSpotify.addEventListener('click', () => {
        const url = spotifyDownloadUrlInput.value.trim();
        if (!url) { showToast('Silakan masukkan URL Spotify.', 'error'); return; }
        const apiUrl = `https://api-agas.my.id/download/spotify?url=${encodeURIComponent(url)}`; 
        fetchApi(apiUrl, 'spotify-download-results', loadingSpinnerSpotifyDownload, displaySpotifyDownloadResults);
    });
    function displaySpotifyDownloadResults(data, containerId) {
        const container = document.getElementById(containerId);
        const downloadUrl = data.download && !data.download.endsWith('undefined') ? data.download : null;
        const title = data.title || "Lagu Spotify";
        const artist = data.artist || "Artis Tidak Diketahui";
        
        container.innerHTML = `
            <div class="result-item">
                <img src="${data.thumbnail}" alt="Album Art" style="width: 80px; height: 80px;">
                <div class="info" style="text-align: left; flex-grow: 1;">
                    <h4>${title}</h4>
                    <p>${artist}</p>
                    <p><i class="bi bi-clock"></i> ${data.duration || 'N/A'}</p>
                </div>
            </div>
            ${downloadUrl ? `
            <div class="media-player-box" style="margin-top: 10px;">
                <audio controls src="${downloadUrl}" type="audio/mpeg" preload="metadata"></audio>
            </div>
            <div class="result-item" style="margin-top: 10px;">
                <div class="download-links" style="width: 100%; justify-content: center; margin-top: 0;">
                    <a href="${downloadUrl}" target="_blank" download="${title} - ${artist}.mp3">Unduh MP3</a>
                </div>
            </div>
            ` : '<div class="error-message" style="margin-top: 10px;">Maaf, link unduhan tidak tersedia dari API.</div>'}
        `;
    }

    // ==================================
    // FUNGSI HALAMAN 9: IPHONE QUOTE (Diperbarui API & Input)
    // ==================================
    btnGenerateIqc.addEventListener('click', () => {
        const prompt = iqcPromptInput.value;
        const jam = iqcJamInput.value;
        const batre = iqcBatreInput.value;

        if (!prompt) { showToast('Teks pesan (prompt) tidak boleh kosong.', 'error'); return; }
        if (!jam) { showToast('Jam tidak boleh kosong.', 'error'); return; }
        if (!batre) { showToast('Persentase baterai tidak boleh kosong.', 'error'); return; }

        const params = new URLSearchParams({ prompt, jam, batre });
        const apiUrl = `https://api-faa.my.id/faa/iqcv2?${params.toString()}`; 
        fetchImageApi(apiUrl, 'iqc-results', loadingSpinnerIqc, displayImageResult, 'iphone-quote.png');
    });

    // ==================================
    // FUNGSI HALAMAN 10: ANALITIK (Tetap)
    // ==================================
    function loadAnalyticsCharts(forceReload = false) { /* ... (Tetap sama) ... */
        const isDarkMode = document.body.classList.contains('dark-mode'); const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'; const textColor = isDarkMode ? '#e0e9f5' : '#1a1a1a'; const primaryColor = isDarkMode ? '#00bfff' : '#007aff';
        if (forceReload) { if (visitorsChartInstance) visitorsChartInstance.destroy(); if (featuresChartInstance) featuresChartInstance.destroy(); visitorsChartInstance = null; featuresChartInstance = null; }
        if (!visitorsChartInstance && document.getElementById('visitors-chart')) { const ctxVisitors = document.getElementById('visitors-chart').getContext('2d'); visitorsChartInstance = new Chart(ctxVisitors, { type: 'line', data: { labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], datasets: [{ label: 'Pengunjung', data: [150, 230, 180, 210, 250, 300, 280], fill: true, backgroundColor: primaryColor + '33', borderColor: primaryColor, tension: 0.4, pointBackgroundColor: primaryColor, }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } }, x: { ticks: { color: textColor }, grid: { color: gridColor } } } } }); }
        if (!featuresChartInstance && document.getElementById('features-chart')) { const ctxFeatures = document.getElementById('features-chart').getContext('2d'); featuresChartInstance = new Chart(ctxFeatures, { type: 'doughnut', data: { labels: ['TikTok', 'Spotify', 'IQC', 'Lainnya'], datasets: [{ label: 'Penggunaan Fitur', data: [450, 280, 150, 50], backgroundColor: [primaryColor, '#1DB954', '#8e8e93', '#ff9500'], borderColor: 'transparent', }] }, options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: textColor } } } } }); }
    }

});
