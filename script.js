// Menunggu semua konten HTML dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {

    // ==================================
    // SELEKTOR ELEMEN (VARIABEL)
    // ==================================
    const themeToggle = document.getElementById('theme-toggle');
    const cursorLight = document.querySelector('.cursor-light');
    
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


    // ==================================
    // FUNGSI GANTI HALAMAN
    // ==================================
    function showPage(pageId) {
        pages.forEach(page => {
            if (page.id === pageId) {
                // Tunda sedikit agar animasi fadeOut selesai
                setTimeout(() => {
                    page.classList.add('active');
                }, 100); // Sesuaikan dengan durasi animasi CSS
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

    // Navigasi: Halaman 3 (Fitur) -> Halaman 2
    btnBack.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetPageId = e.target.getAttribute('data-target');
            if (targetPageId) {
                showPage(targetPageId);
            }
        });
    });

    // ==================================
    // FUNGSI MODE GELAP / TERANG
    // ==================================
    // Cek preferensi user di localStorage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Simpan preferensi
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // ==================================
    // FUNGSI EFEK VISUAL
    // ==================================
    // Efek Cahaya Mengikuti Kursor
    document.addEventListener('mousemove', (e) => {
        cursorLight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    // Efek untuk sentuhan di mobile (agak berbeda)
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        cursorLight.style.transform = `translate(${touch.clientX}px, ${touch.clientY}px)`;
    });


    // ==================================
    // FUNGSI HALAMAN 1: INFO DEVICE
    // ==================================
    function loadDeviceInfo() {
        // 1. Waktu & Tanggal (Real-time)
        function updateTime() {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            infoTime.textContent = now.toLocaleDateString('id-ID', options);
        }
        updateTime();
        setInterval(updateTime, 1000); // Update tiap detik

        // 2. Info Perangkat (User Agent)
        infoDevice.textContent = navigator.userAgentData?.platform || navigator.platform || 'Tidak diketahui';

        // 3. Info Baterai
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
        } else {
            infoBattery.textContent = 'Tidak didukung';
        }

        // 4. Info Koneksi
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            infoNetwork.textContent = connection.effectiveType ? `${connection.effectiveType.toUpperCase()}` : 'Tidak diketahui';
        } else {
            infoNetwork.textContent = 'Tidak didukung';
        }

        // 5. Info IP & Lokasi (Menggunakan API Eksternal)
        // Kita pakai API yang free & CORS-friendly
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

    // Muat info device saat halaman pertama kali dibuka
    loadDeviceInfo();

    // ==================================
    // FUNGSI HALAMAN 2: MENU
    // ==================================
    menuHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.menu-item');
            // Toggle kelas 'active' pada item yang diklik
            item.classList.toggle('active');

            // (Opsional) Tutup menu lain saat satu dibuka
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
    
    // Tampilkan/Sembunyikan Petunjuk
    btnPetunjukTiktok.addEventListener('click', () => {
        modalPetunjukTiktok.classList.add('active');
    });
    btnTutupPetunjuk.addEventListener('click', () => {
        modalPetunjukTiktok.classList.remove('active');
    });

    // Logika Download
    btnDownloadTiktok.addEventListener('click', () => {
        const url = tiktokUrlInput.value.trim();
        if (!url) {
            alert('Silakan masukkan URL TikTok terlebih dahulu.');
            return;
        }

        // Reset tampilan
        tiktokResults.innerHTML = '';
        loadingSpinner.style.display = 'flex'; // Tampilkan loading

        // Panggil API
        const apiUrl = `https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(url)}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Cek header, API ini punya 'access-control-allow-origin: *'
                // jadi kita aman dari CORS
                return response.json();
            })
            .then(data => {
                loadingSpinner.style.display = 'none'; // Sembunyikan loading
                console.log(data); // Untuk debugging

                if (data.status === true && data.data) {
                    displayTikTokResults(data.data);
                } else {
                    displayError(data.message || 'Gagal mendapatkan data dari API.');
                }
            })
            .catch(error => {
                loadingSpinner.style.display = 'none'; // Sembunyikan loading
                console.error('Error fetching TikTok data:', error);
                displayError('Terjadi kesalahan. Cek konsol (F12) untuk detail. Kemungkinan API sedang down atau link tidak valid.');
            });
    });

    function displayTikTokResults(data) {
        const metadata = data.metadata;
        const downloads = data.download;

        // Kosongkan hasil sebelumnya
        tiktokResults.innerHTML = '';

        const resultElement = document.createElement('div');
        resultElement.classList.add('tiktok-result-item');

        // Judul / Deskripsi
        let title = metadata.title || metadata.description || 'Video TikTok';
        if (title.length > 100) {
            title = title.substring(0, 100) + '...';
        }

        // Link Download
        let downloadLinksHTML = '';
        if (downloads.video && downloads.video.length > 0) {
            downloads.video.forEach((videoUrl, index) => {
                // Kita coba beri nama berdasarkan kualitas (jika bisa)
                let qualityLabel = `Video ${index + 1}`;
                if (videoUrl.includes('original')) qualityLabel = 'Video Original (HD)';
                
                downloadLinksHTML += `<a href="${videoUrl}" target="_blank" download>Unduh ${qualityLabel}</a>`;
            });
        } else {
            downloadLinksHTML = '<p>Tidak ada link video yang ditemukan.</p>';
        }

        resultElement.innerHTML = `
            <h4>${title}</h4>
            <p>
                <i class="bi bi-play-circle"></i> ${metadata.stats.playCount.toLocaleString('id-ID')} views | 
                <i class="bi bi-heart"></i> ${metadata.stats.likeCount.toLocaleString('id-ID')} likes
            </p>
            <div class="download-links">
                ${downloadLinksHTML}
            </div>
        `;
        
        tiktokResults.appendChild(resultElement);
    }

    function displayError(message) {
        tiktokResults.innerHTML = `<div class="error-message">${message}</div>`;
    }

});
