/**
 * Main Wedding Application Controller
 * Xử lý hiệu ứng cánh hoa, mở phong bì, cá nhân hóa khách mời, đếm ngược,
 * Lightbox xem ảnh, VietQR, RSVP, Sổ lưu bút và Trình Quản Lý Studio.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Kiểm tra & Áp dụng Chế độ Quản trị (Admin vs Guest Mode)
  initAdminMode();

  // 1. Khởi tạo hiệu ứng cánh hoa bay (Petals Canvas)
  initPetalsEffect();

  // 2. Lấy tham số khách mời từ URL (?guest=...)
  const urlParams = new URLSearchParams(window.location.search);
  let currentGuest = urlParams.get('guest');
  if (currentGuest) {
    try {
      currentGuest = decodeURIComponent(currentGuest).trim();
    } catch (e) {
      console.warn('URL guest decode error:', e);
    }
  }

  // 3. Khởi tạo giao diện thiệp cưới với dữ liệu từ weddingDB
  renderWeddingPage(currentGuest);

  // 4. Bắt đầu đồng hồ đếm ngược
  startCountdown();

  // 5. Thiết lập các sự kiện tương tác
  setupEventListeners(currentGuest);

  // 6. Khởi chạy hiệu ứng cuộn trang lướt lên lướt xuống hiện thông tin
  initScrollReveal();
});

/* =========================================================
   HIỆU ỨNG CÁNH HOA ANH ĐÀO & TIM BAY
   ========================================================= */
function initPetalsEffect() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = 28;

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 9 + 8,
      speedX: Math.random() * 1.5 - 0.75,
      speedY: Math.random() * 1.2 + 0.8,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 2 - 1,
      opacity: Math.random() * 0.5 + 0.35,
      color: Math.random() > 0.3 ? '#ffb3c1' : '#f48c9c'
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    // Vẽ hình cánh hoa mềm mại
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, 0, 0, p.size * 1.3);
    ctx.bezierCurveTo(-p.size, 0, -p.size / 2, -p.size / 2, 0, 0);
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      drawPetal(p);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* =========================================================
   RENDER TOÀN BỘ NỘI DUNG THIỆP CƯỚI
   ========================================================= */
function renderWeddingPage(guestName) {
  const data = weddingDB.data;
  const displayName = guestName || 'Quý Khách & Gia Đình';

  // Cập nhật Theme màu
  document.documentElement.setAttribute('data-theme', data.theme || 'rose');

  // Phong bì mở đầu
  const envGuestEl = document.getElementById('envelope-guest-name');
  if (envGuestEl) envGuestEl.textContent = displayName;

  const envCoupleEl = document.getElementById('envelope-couple-names');
  if (envCoupleEl) {
    envCoupleEl.textContent = `${data.couple.groomShort || 'Chú Rể'} & ${data.couple.brideShort || 'Cô Dâu'}`;
  }

  // Hero Section
  const heroCoupleEl = document.getElementById('hero-couple-names');
  if (heroCoupleEl) {
    heroCoupleEl.textContent = `${data.couple.groomShort || 'Văn Đức'} & ${data.couple.brideShort || 'Thùy Linh'}`;
  }

  const heroGuestEl = document.getElementById('hero-guest-name');
  if (heroGuestEl) heroGuestEl.textContent = displayName;

  const heroDateEl = document.getElementById('hero-wedding-date');
  if (heroDateEl) heroDateEl.textContent = data.weddingDateDisplay || '20 Tháng 11 Năm 2026';

  const heroLunarEl = document.getElementById('hero-wedding-lunar');
  if (heroLunarEl) heroLunarEl.textContent = data.weddingLunarDate || '';

  const heroBgEl = document.getElementById('hero-bg-image');
  if (heroBgEl && data.couple.coverImage) {
    heroBgEl.style.backgroundImage = `url('${data.couple.coverImage}')`;
  }

  // Cô Dâu & Chú Rể
  const groomNameEl = document.getElementById('groom-name');
  if (groomNameEl) groomNameEl.textContent = data.couple.groom;
  const groomAvatarEl = document.getElementById('groom-avatar');
  if (groomAvatarEl && data.couple.groomAvatar) groomAvatarEl.src = data.couple.groomAvatar;
  const groomParentsEl = document.getElementById('groom-parents');
  if (groomParentsEl) {
    groomParentsEl.textContent = `Con ông: ${data.couple.groomFather || '...'} & Bà: ${data.couple.groomMother || '...'}`;
  }
  const groomBioEl = document.getElementById('groom-bio');
  if (groomBioEl) groomBioEl.textContent = data.couple.groomStory || '';

  const brideNameEl = document.getElementById('bride-name');
  if (brideNameEl) brideNameEl.textContent = data.couple.bride;
  const brideAvatarEl = document.getElementById('bride-avatar');
  if (brideAvatarEl && data.couple.brideAvatar) brideAvatarEl.src = data.couple.brideAvatar;
  const brideParentsEl = document.getElementById('bride-parents');
  if (brideParentsEl) {
    brideParentsEl.textContent = `Con ông: ${data.couple.brideFather || '...'} & Bà: ${data.couple.brideMother || '...'}`;
  }
  const brideBioEl = document.getElementById('bride-bio');
  if (brideBioEl) brideBioEl.textContent = data.couple.brideStory || '';

  // PHẦN TRÂN TRỌNG KÍNH MỜI (THƯ MỜI & NỔI BẬT NGÀY CƯỚI)
  const formalGuestEl = document.getElementById('formal-invitation-guest');
  if (formalGuestEl) formalGuestEl.textContent = displayName;

  // Xử lý ngày cưới nổi bật
  const wDate = new Date(data.weddingDate || '2026-11-20T11:00:00');
  const dayOfWeekNames = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];
  const dayName = !isNaN(wDate.getDay()) ? dayOfWeekNames[wDate.getDay()] : 'THỨ SÁU';
  const dayNum = !isNaN(wDate.getDate()) ? String(wDate.getDate()).padStart(2, '0') : '20';
  const monthNum = !isNaN(wDate.getMonth()) ? wDate.getMonth() + 1 : 11;
  const yearNum = !isNaN(wDate.getFullYear()) ? wDate.getFullYear() : 2026;

  const formalDayEl = document.getElementById('formal-day-name');
  if (formalDayEl) formalDayEl.textContent = dayName;

  const formalDateNumEl = document.getElementById('formal-date-number');
  if (formalDateNumEl) formalDateNumEl.textContent = dayNum;

  const formalMonthYearEl = document.getElementById('formal-month-year');
  if (formalMonthYearEl) formalMonthYearEl.textContent = `THÁNG ${monthNum} • NĂM ${yearNum}`;

  const formalLunarEl = document.getElementById('formal-lunar-date');
  if (formalLunarEl) formalLunarEl.textContent = data.weddingLunarDate || '';

  // Thời gian và địa điểm tiệc cưới chính
  const tiec = data.events.tiecCuoi || {};
  const formalTimeEl = document.getElementById('formal-event-time');
  if (formalTimeEl) formalTimeEl.textContent = `${tiec.time || '11:30'} - Ngày ${tiec.date || '20/11/2026'}`;

  const formalLocEl = document.getElementById('formal-event-location');
  if (formalLocEl) formalLocEl.textContent = tiec.location || 'Trung Tâm Tiệc Cưới & Hội Nghị Trống Đồng Palace';

  const formalAddrEl = document.getElementById('formal-event-address');
  if (formalAddrEl) formalAddrEl.textContent = tiec.address || '';

  const formalMapBtn = document.getElementById('formal-map-btn');
  if (formalMapBtn && tiec.mapUrl) formalMapBtn.href = tiec.mapUrl;

  const formalCalBtn = document.getElementById('formal-cal-btn');
  if (formalCalBtn) {
    const text = encodeURIComponent(`Lễ Thành Hôn - ${data.couple.groomShort || 'Chú Rể'} & ${data.couple.brideShort || 'Cô Dâu'}`);
    const loc = encodeURIComponent(tiec.address || tiec.location || '');
    formalCalBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&location=${loc}&details=${encodeURIComponent('Đám cưới chung vui cùng gia đình chúng tôi!')}`;
  }

  // Lịch Trình Lễ Vu Quy & Thành Hôn 2 Nhà
  renderEvents(data.events);

  // Album Ảnh Cưới
  renderGallery(data.gallery);

  // Mừng Cưới QR
  renderBanking(data.banking, displayName);

  // Sổ Lưu Bút
  renderWishes(data.wishes);



  setTimeout(() => {
    initScrollReveal();
  }, 100);
}

/* =========================================================
   RENDER LỊCH TRÌNH CƯỚI & GOOGLE CALENDAR
   ========================================================= */
function renderEvents(events) {
  const container = document.getElementById('events-container');
  if (!container || !events) return;

  const createCalendarUrl = (title, address, dateStr) => {
    const text = encodeURIComponent(title);
    const loc = encodeURIComponent(address);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&location=${loc}&details=${encodeURIComponent('Đám cưới chung vui cùng gia đình chúng tôi!')}`;
  };

  // Chỉ hiển thị Vu Quy & Thành Hôn ở mục tư gia (tiệc chính đã nổi bật ở trên)
  const list = [
    { key: 'vuQuy', data: events.vuQuy, icon: 'fa-house-chimney-heart' },
    { key: 'thanhHon', data: events.thanhHon, icon: 'fa-heart-circle-check' }
  ];

  container.innerHTML = list.filter(item => item.data && item.data.enabled !== false).map((item, index) => {
    const ev = item.data;
    const calUrl = createCalendarUrl(ev.title, ev.address, ev.date);
    return `
      <div class="event-item-card reveal-on-scroll reveal-fade-up delay-${(index + 1) * 150}">
        <div class="event-badge-title">
          <span class="event-name"><i class="fa-solid ${item.icon} text-gold mr-2"></i> ${ev.title}</span>
          <span class="event-time-tag">${ev.time}</span>
        </div>
        <div class="event-details">
          <div><i class="fa-regular fa-calendar-check"></i> <strong>${ev.date}</strong> (${ev.lunar})</div>
          <div><i class="fa-solid fa-location-dot"></i> <strong>${ev.location}</strong></div>
          <div style="font-size: 0.8rem; opacity: 0.9;">${ev.address}</div>
        </div>
        <div class="event-actions">
          <a href="${ev.mapUrl || '#'}" target="_blank" rel="noopener" class="event-btn btn-maps">
            <i class="fa-solid fa-map-location-dot"></i> Chỉ đường Maps
          </a>
          <a href="${calUrl}" target="_blank" rel="noopener" class="event-btn btn-calendar">
            <i class="fa-regular fa-calendar-plus"></i> Lưu vào Lịch
          </a>
        </div>
      </div>
    `;
  }).join('');
}

/* =========================================================
   RENDER ALBUM ẢNH CƯỚI & LIGHTBOX
   ========================================================= */
let currentLightboxIndex = 0;
let currentGalleryList = [];

function renderGallery(gallery) {
  const container = document.getElementById('gallery-container');
  if (!container || !gallery) return;

  currentGalleryList = gallery;

  container.innerHTML = gallery.map((imgUrl, index) => `
    <div class="gallery-thumb-item reveal-on-scroll reveal-zoom-in delay-${(index % 4) * 100}" onclick="openLightbox(${index})">
      <img src="${imgUrl}" alt="Ảnh cưới ${index + 1}" loading="lazy" />
      <div class="gallery-overlay-icon">
        <i class="fa-solid fa-magnifying-glass-plus fa-lg"></i>
      </div>
    </div>
  `).join('');
}

window.openLightbox = function(index) {
  currentLightboxIndex = index;
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  if (!modal || !img || !currentGalleryList.length) return;

  img.src = currentGalleryList[currentLightboxIndex];
  modal.classList.add('active');
};

window.closeLightbox = function() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.remove('active');
};

window.navLightbox = function(step) {
  if (!currentGalleryList.length) return;
  currentLightboxIndex = (currentLightboxIndex + step + currentGalleryList.length) % currentGalleryList.length;
  const img = document.getElementById('lightbox-img');
  if (img) img.src = currentGalleryList[currentLightboxIndex];
};

/* =========================================================
   RENDER MỪNG CƯỚI VIETQR TỰ ĐỘNG
   ========================================================= */
let currentBankingTab = 'groom';

function renderBanking(banking, guestName) {
  if (!banking) return;

  const currentInfo = banking[currentBankingTab] || banking.groom;
  const container = document.getElementById('banking-info-container');
  if (!container) return;

  const transferMsg = `Mung cuoi ${guestName || 'ban'}`;
  // Chuẩn link ảnh mã VietQR tự động
  const qrUrl = `https://img.vietqr.io/image/${currentInfo.bankCode || 'VCB'}-${currentInfo.accountNumber}-compact2.png?amount=&addInfo=${encodeURIComponent(transferMsg)}&accountName=${encodeURIComponent(currentInfo.accountName)}`;

  container.innerHTML = `
    <div class="qr-display-card">
      <div class="vietqr-image-wrap">
        <img src="${qrUrl}" alt="Mã VietQR Mừng Cưới" id="vietqr-img" />
      </div>
      <table class="bank-info-table">
        <tr>
          <td class="label">Ngân hàng:</td>
          <td class="value">${currentInfo.bank} (${currentInfo.bankCode})</td>
        </tr>
        <tr>
          <td class="label">Số tài khoản:</td>
          <td class="value" style="font-family: monospace; font-size: 1.05rem;">${currentInfo.accountNumber}</td>
        </tr>
        <tr>
          <td class="label">Chủ tài khoản:</td>
          <td class="value">${currentInfo.accountName}</td>
        </tr>
      </table>
      <button class="copy-acc-btn" onclick="copyAccountNumber('${currentInfo.accountNumber}')">
        <i class="fa-regular fa-copy"></i> Sao chép số tài khoản
      </button>
    </div>
  `;
}

window.switchBankingTab = function(tab) {
  currentBankingTab = tab;
  document.querySelectorAll('.banking-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  const data = weddingDB.data;
  const urlParams = new URLSearchParams(window.location.search);
  const guest = urlParams.get('guest');
  renderBanking(data.banking, guest);
};

window.copyAccountNumber = function(accNum) {
  navigator.clipboard.writeText(accNum).then(() => {
    showToast(`Đã sao chép số tài khoản: ${accNum}`);
  }).catch(() => {
    showToast(`STK: ${accNum}`);
  });
};

/* =========================================================
   RENDER SỔ LƯU BÚT
   ========================================================= */
function renderWishes(wishes) {
  const container = document.getElementById('wishes-container');
  if (!container || !wishes) return;

  container.innerHTML = wishes.map((w, idx) => `
    <div class="wish-feed-item reveal-on-scroll reveal-fade-up delay-${(idx % 3) * 100}">
      <div class="wish-item-header">
        <span class="wish-sender-name"><i class="fa-solid fa-heart text-gold mr-1"></i> ${w.name}</span>
        <span class="wish-time">${w.time}</span>
      </div>
      <div class="wish-text">${w.message}</div>
      <button class="wish-like-btn" onclick="likeWish('${w.id}')">
        <i class="fa-regular fa-heart"></i> Yêu thích (${w.likes || 0})
      </button>
    </div>
  `).join('');

  if (typeof initScrollReveal === 'function') {
    initScrollReveal();
  }
}

window.likeWish = function(id) {
  const newCount = weddingDB.likeWish(id);
  renderWishes(weddingDB.data.wishes);
  showToast('Cảm ơn bạn đã thả tim lời chúc! ❤️');
};

/* =========================================================
   ĐỒNG HỒ ĐẾM NGƯỢC (COUNTDOWN TIMER)
   ========================================================= */
function startCountdown() {
  function update() {
    const targetDate = new Date(weddingDB.data.weddingDate || '2026-11-20T11:00:00').getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-mins');
    const secsEl = document.getElementById('count-secs');

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* =========================================================
   CÁC SỰ KIỆN TƯƠNG TÁC CHÍNH (EVENTS & AUDIO)
   ========================================================= */
function setupEventListeners(currentGuest) {
  // Mở phong bì cưới & Bắt đầu phát nhạc
  const waxSeal = document.getElementById('wax-seal-btn');
  const envelopeOverlay = document.getElementById('envelope-overlay');

  if (waxSeal && envelopeOverlay) {
    waxSeal.addEventListener('click', () => {
      envelopeOverlay.classList.add('opened');
      // Phát nhạc khi chạm mở phong bì (chuẩn chính sách trình duyệt)
      if (window.weddingAudio) {
        window.weddingAudio.play(weddingDB.data.music);
      }
      showToast('Chúc mừng hạnh phúc lứa đôi! 🌸');
    });
  }

  // Đĩa than / Nút phát nhạc xoay
  const audioFab = document.getElementById('audio-fab');
  const vinylDisk = document.getElementById('vinyl-disk');

  if (window.weddingAudio) {
    window.weddingAudio.onStateChange = (isPlaying, trackName) => {
      if (vinylDisk) vinylDisk.classList.toggle('spinning', isPlaying);
    };
  }

  if (audioFab) {
    audioFab.addEventListener('click', () => {
      if (window.weddingAudio) {
        const wasPlaying = window.weddingAudio.isPlaying;
        window.weddingAudio.toggle(weddingDB.data.music);
        showToast(wasPlaying ? '⏸️ Đã tạm dừng nhạc' : '🎵 Đang phát nhạc cưới');
      }
    });
  }

  // Toggle đổi chế độ Phone Mockup và Full Desktop
  const deviceToggleBtn = document.getElementById('device-toggle-btn');
  const viewport = document.getElementById('wedding-viewport');
  if (deviceToggleBtn && viewport) {
    deviceToggleBtn.addEventListener('click', () => {
      viewport.classList.toggle('full-width');
      const isFull = viewport.classList.contains('full-width');
      deviceToggleBtn.innerHTML = isFull 
        ? `<i class="fa-solid fa-mobile-screen"></i> Chế độ Điện Thoại`
        : `<i class="fa-solid fa-desktop"></i> Toàn Màn Hình`;
    });
  }

  // Gửi Lời Chúc & Xác Nhận RSVP
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    if (currentGuest) {
      const nameInput = document.getElementById('rsvp-name');
      if (nameInput) nameInput.value = currentGuest;
    }

    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value;
      const message = document.getElementById('rsvp-message').value;
      const attendance = document.getElementById('rsvp-attendance').value;
      const count = document.getElementById('rsvp-count').value;

      if (!name.trim()) {
        showToast('Vui lòng nhập họ và tên của bạn!');
        return;
      }

      if (message.trim()) {
        weddingDB.addWish(name, message);
        renderWishes(weddingDB.data.wishes);
      }

      showToast(`Cảm ơn ${name} đã gửi lời chúc và xác nhận tham dự (${attendance})! ❤️`);
      document.getElementById('rsvp-message').value = '';
    });
  }

  // Nút mở Studio
  const studioOpenBtn = document.getElementById('studio-toggle-btn');
  const studioCloseBtn = document.getElementById('studio-close-btn');
  const studioModal = document.getElementById('studio-modal');

  if (studioOpenBtn && studioModal) {
    studioOpenBtn.addEventListener('click', () => {
      openStudioModal();
    });
  }
  if (studioCloseBtn && studioModal) {
    studioCloseBtn.addEventListener('click', () => {
      studioModal.classList.remove('active');
    });
  }

  // Lightbox close button
  const lightboxClose = document.getElementById('lightbox-close');
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
}

/* =========================================================
   STUDIO CREATOR - BẢNG ĐIỀU KHIỂN THIẾT KẾ THIỆP
   ========================================================= */
function openStudioModal() {
  if (!window.checkIsAdmin()) {
    window.openPinModal();
    return;
  }
  const modal = document.getElementById('studio-modal');
  if (!modal) return;
  modal.classList.add('active');

  const data = weddingDB.data;

  // Tab 1: Thông tin cơ bản
  document.getElementById('input-groom').value = data.couple.groom || '';
  document.getElementById('input-groom-short').value = data.couple.groomShort || '';
  document.getElementById('input-groom-father').value = data.couple.groomFather || '';
  document.getElementById('input-groom-mother').value = data.couple.groomMother || '';
  document.getElementById('input-groom-story').value = data.couple.groomStory || '';

  document.getElementById('input-bride').value = data.couple.bride || '';
  document.getElementById('input-bride-short').value = data.couple.brideShort || '';
  document.getElementById('input-bride-father').value = data.couple.brideFather || '';
  document.getElementById('input-bride-mother').value = data.couple.brideMother || '';
  document.getElementById('input-bride-story').value = data.couple.brideStory || '';

  // Tab 2: Thời gian & Địa điểm
  document.getElementById('input-wedding-date').value = data.weddingDate ? data.weddingDate.substring(0, 16) : '';
  document.getElementById('input-wedding-date-display').value = data.weddingDateDisplay || '';
  document.getElementById('input-wedding-lunar').value = data.weddingLunarDate || '';

  // Tiệc cưới
  if (data.events.tiecCuoi) {
    document.getElementById('input-tiec-time').value = data.events.tiecCuoi.time || '';
    document.getElementById('input-tiec-date').value = data.events.tiecCuoi.date || '';
    document.getElementById('input-tiec-location').value = data.events.tiecCuoi.location || '';
    document.getElementById('input-tiec-address').value = data.events.tiecCuoi.address || '';
    document.getElementById('input-tiec-map').value = data.events.tiecCuoi.mapUrl || '';
  }

  // Tab 3: Khách mời
  renderStudioGuestList();

  // Tab 5: Mừng cưới
  if (data.banking) {
    document.getElementById('input-bank-groom-name').value = data.banking.groom.bank || '';
    document.getElementById('input-bank-groom-code').value = data.banking.groom.bankCode || '';
    document.getElementById('input-bank-groom-acc').value = data.banking.groom.accountNumber || '';
    document.getElementById('input-bank-groom-owner').value = data.banking.groom.accountName || '';

    document.getElementById('input-bank-bride-name').value = data.banking.bride.bank || '';
    document.getElementById('input-bank-bride-code').value = data.banking.bride.bankCode || '';
    document.getElementById('input-bank-bride-acc').value = data.banking.bride.accountNumber || '';
    document.getElementById('input-bank-bride-owner').value = data.banking.bride.accountName || '';
  }

  // Theme
  const themeRadios = document.querySelectorAll('input[name="studio-theme"]');
  themeRadios.forEach(radio => {
    radio.checked = radio.value === data.theme;
  });

  // Đồng bộ ảnh xem trước trong Studio
  const groomPrev = document.getElementById('preview-groom-avatar');
  if (groomPrev && data.couple.groomAvatar) groomPrev.src = data.couple.groomAvatar;

  const bridePrev = document.getElementById('preview-bride-avatar');
  if (bridePrev && data.couple.brideAvatar) bridePrev.src = data.couple.brideAvatar;

  const coverPrev = document.getElementById('preview-cover-image');
  if (coverPrev && data.couple.coverImage) coverPrev.src = data.couple.coverImage;

  renderStudioGallery();
}

// Chuyển Tab trong Studio
window.switchStudioTab = function(tabId) {
  document.querySelectorAll('.studio-tab-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pane === tabId);
  });
  document.querySelectorAll('.studio-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `pane-${tabId}`);
  });
};

// Render Bảng Khách Mời trong Studio
function renderStudioGuestList() {
  const container = document.getElementById('studio-guest-table-body');
  if (!container) return;

  const guests = weddingDB.data.guests || [];
  const currentBaseUrl = window.location.origin + window.location.pathname;

  container.innerHTML = guests.map(g => {
    const guestLink = `${currentBaseUrl}?guest=${encodeURIComponent(g.name)}`;
    const zaloShareUrl = `https://zalo.me/share?text=${encodeURIComponent(`Trân trọng kính mời ${g.name} tới dự lễ thành hôn cùng chúng mình tại: ${guestLink}`)}`;

    return `
      <tr>
        <td><strong>${g.name}</strong></td>
        <td><span style="font-size: 0.75rem; background: #eee; padding: 2px 6px; border-radius: 4px;">${g.side || 'Nhà Trai'}</span></td>
        <td>
          <div class="action-btn-group">
            <button class="mini-btn btn-copy" onclick="copyGuestLink('${guestLink}')" title="Sao chép link">
              <i class="fa-regular fa-copy"></i> Link
            </button>
            <a href="${zaloShareUrl}" target="_blank" rel="noopener" class="mini-btn btn-zalo" title="Gửi Zalo">
              <i class="fa-solid fa-paper-plane"></i> Zalo
            </a>
            <a href="${guestLink}" target="_blank" class="mini-btn" style="background:#f0f0f0; color:#333;" title="Xem thử thiệp">
              <i class="fa-solid fa-eye"></i> Xem
            </a>
            <button class="mini-btn btn-del" onclick="deleteStudioGuest('${g.id}')" title="Xóa khách">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.addSingleGuest = function() {
  const input = document.getElementById('input-add-guest-name');
  const sideSelect = document.getElementById('select-guest-side');
  if (!input || !input.value.trim()) {
    showToast('Vui lòng nhập tên khách mời!');
    return;
  }
  weddingDB.addGuest(input.value.trim(), sideSelect ? sideSelect.value : 'Nhà Trai');
  input.value = '';
  renderStudioGuestList();
  showToast('Đã thêm khách mời thành công!');
};

window.addBatchGuests = function() {
  const textarea = document.getElementById('textarea-batch-guests');
  const sideSelect = document.getElementById('select-guest-side');
  if (!textarea || !textarea.value.trim()) {
    showToast('Vui lòng dán danh sách tên khách mời (mỗi dòng 1 người)!');
    return;
  }
  const added = weddingDB.addBatchGuests(textarea.value, sideSelect ? sideSelect.value : 'Nhà Trai');
  textarea.value = '';
  renderStudioGuestList();
  showToast(`Đã thêm ${added.length} khách mời vào danh sách!`);
};

window.deleteStudioGuest = function(id) {
  weddingDB.removeGuest(id);
  renderStudioGuestList();
  showToast('Đã xóa khách mời!');
};

window.copyGuestLink = function(link) {
  navigator.clipboard.writeText(link).then(() => {
    showToast('Đã sao chép link thiệp của khách! Có thể dán gửi ngay qua Zalo/Messenger.');
  });
};

// Lưu Dữ Liệu từ Studio
window.saveStudioChanges = function() {
  const data = weddingDB.data;

  // Cập nhật thông tin
  data.couple.groom = document.getElementById('input-groom').value;
  data.couple.groomShort = document.getElementById('input-groom-short').value;
  data.couple.groomFather = document.getElementById('input-groom-father').value;
  data.couple.groomMother = document.getElementById('input-groom-mother').value;
  data.couple.groomStory = document.getElementById('input-groom-story').value;

  data.couple.bride = document.getElementById('input-bride').value;
  data.couple.brideShort = document.getElementById('input-bride-short').value;
  data.couple.brideFather = document.getElementById('input-bride-father').value;
  data.couple.brideMother = document.getElementById('input-bride-mother').value;
  data.couple.brideStory = document.getElementById('input-bride-story').value;

  data.weddingDate = document.getElementById('input-wedding-date').value;
  data.weddingDateDisplay = document.getElementById('input-wedding-date-display').value;
  data.weddingLunarDate = document.getElementById('input-wedding-lunar').value;

  // Tiệc cưới
  if (data.events.tiecCuoi) {
    data.events.tiecCuoi.time = document.getElementById('input-tiec-time').value;
    data.events.tiecCuoi.date = document.getElementById('input-tiec-date').value;
    data.events.tiecCuoi.location = document.getElementById('input-tiec-location').value;
    data.events.tiecCuoi.address = document.getElementById('input-tiec-address').value;
    data.events.tiecCuoi.mapUrl = document.getElementById('input-tiec-map').value;
  }

  // Mừng cưới
  data.banking.groom.bank = document.getElementById('input-bank-groom-name').value;
  data.banking.groom.bankCode = document.getElementById('input-bank-groom-code').value;
  data.banking.groom.accountNumber = document.getElementById('input-bank-groom-acc').value;
  data.banking.groom.accountName = document.getElementById('input-bank-groom-owner').value;

  data.banking.bride.bank = document.getElementById('input-bank-bride-name').value;
  data.banking.bride.bankCode = document.getElementById('input-bank-bride-code').value;
  data.banking.bride.accountNumber = document.getElementById('input-bank-bride-acc').value;
  data.banking.bride.accountName = document.getElementById('input-bank-bride-owner').value;

  // Theme
  const selectedTheme = document.querySelector('input[name="studio-theme"]:checked');
  if (selectedTheme) {
    data.theme = selectedTheme.value;
  }

  // Lưu vào database
  weddingDB.saveData(data);

  // Re-render
  const urlParams = new URLSearchParams(window.location.search);
  renderWeddingPage(urlParams.get('guest'));

  // Đóng modal
  document.getElementById('studio-modal').classList.remove('active');
  showToast('Đã lưu mọi thay đổi thành công! 💖');
};

// Chọn bài hát từ Studio
window.selectMusicTrack = function(trackId) {
  const tracks = window.weddingAudio ? window.weddingAudio.sampleTracks : [];
  const found = tracks.find(t => t.id === trackId);
  if (found) {
    weddingDB.data.music = {
      type: found.type,
      name: found.name,
      url: found.url
    };
    weddingDB.saveData();
    if (window.weddingAudio) {
      window.weddingAudio.play(weddingDB.data.music);
    }
    showToast(`Đã chuyển sang: ${found.name}`);
  }
};

// Tải file nhạc MP3 từ máy
window.handleAudioUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (window.weddingAudio) {
    window.weddingAudio.setCustomAudioFile(file).then(customTrack => {
      weddingDB.data.music = customTrack;
      weddingDB.saveData();
      window.weddingAudio.play(customTrack);
      showToast(`Đã tải lên bài hát: ${customTrack.name}`);
    });
  }
};

/* =========================================================
   PHÂN QUYỀN ADMIN VS GUEST VIEW (BẢO VỆ CHỈNH SỬA & ĐỔI ẢNH)
   ========================================================= */
window.checkIsAdmin = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const hasAdminParam = urlParams.get('admin') === '1' || urlParams.get('admin') === 'true' || urlParams.get('mode') === 'admin';
  const hasAuthStorage = localStorage.getItem('wedding_is_admin') === 'true';
  return Boolean(hasAdminParam || hasAuthStorage);
};

window.initAdminMode = function() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('admin') === '1' || urlParams.get('admin') === 'true' || urlParams.get('mode') === 'admin') {
    localStorage.setItem('wedding_is_admin', 'true');
  }
  window.applyAdminMode();
};

window.applyAdminMode = function() {
  const isAdmin = window.checkIsAdmin();
  const adminStatusBar = document.getElementById('admin-status-bar');
  const adminGateText = document.getElementById('admin-gate-text');

  if (isAdmin) {
    document.body.classList.add('is-admin-mode');
    if (adminStatusBar) adminStatusBar.style.display = 'block';
    if (adminGateText) adminGateText.innerHTML = '<span style="color: #22c55e;">●</span> Quản trị viên (Đang bật) • Bấm để đăng xuất';
  } else {
    document.body.classList.remove('is-admin-mode');
    if (adminStatusBar) adminStatusBar.style.display = 'none';
    if (adminGateText) adminGateText.innerHTML = 'Dành cho Cô Dâu & Chú Rể';
  }
};

window.handleAdminGateClick = function() {
  if (window.checkIsAdmin()) {
    window.exitAdminMode();
  } else {
    window.openPinModal();
  }
};

window.openPinModal = function() {
  const modal = document.getElementById('pin-modal');
  if (modal) {
    modal.style.display = 'flex';
    const input = document.getElementById('admin-pin-input');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 150);
    }
    const err = document.getElementById('pin-error-msg');
    if (err) err.style.display = 'none';
  }
};

window.closePinModal = function() {
  const modal = document.getElementById('pin-modal');
  if (modal) modal.style.display = 'none';
};

window.verifyAdminPin = function() {
  const input = document.getElementById('admin-pin-input');
  const err = document.getElementById('pin-error-msg');
  const pin = input ? input.value.trim() : '';

  // Mật khẩu PIN mặc định 1234
  if (pin === '1234' || pin.toLowerCase() === 'admin') {
    localStorage.setItem('wedding_is_admin', 'true');
    window.closePinModal();
    window.applyAdminMode();
    showToast('🎉 Đã kích hoạt Chế Độ Quản Trị Viên (Cô Dâu & Chú Rể)!');
  } else {
    if (err) err.style.display = 'block';
  }
};

window.exitAdminMode = function() {
  localStorage.removeItem('wedding_is_admin');
  const url = new URL(window.location.href);
  url.searchParams.delete('admin');
  url.searchParams.delete('mode');
  window.history.replaceState({}, '', url.toString());
  window.applyAdminMode();
  showToast('Đã chuyển sang Chế Độ Khách Mời. Các nút chỉnh sửa đã được ẩn!');
};

/* =========================================================
   BỘ ĐIỀU KHIỂN ĐỔI ẢNH TRỰC QUAN (PHOTO CONTROLLERS)
   ========================================================= */
window.triggerPhotoUpload = function(type) {
  if (!window.checkIsAdmin()) {
    showToast('⚠️ Chỉ Cô Dâu & Chú Rể (Admin) mới có quyền đổi ảnh!');
    return;
  }
  const inputMap = {
    'cover': 'input-file-cover',
    'groom': 'input-file-groom',
    'bride': 'input-file-bride',
    'gallery': 'input-file-gallery'
  };
  const inputId = inputMap[type];
  if (inputId) {
    const input = document.getElementById(inputId);
    if (input) input.click();
  }
};

window.handleQuickPhotoUpload = function(event, type) {
  if (!window.checkIsAdmin()) {
    showToast('⚠️ Chỉ Cô Dâu & Chú Rể (Admin) mới có quyền đổi ảnh!');
    return;
  }
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    if (type === 'cover') {
      weddingDB.data.couple.coverImage = dataUrl;
      const heroBgEl = document.getElementById('hero-bg-image');
      if (heroBgEl) heroBgEl.style.backgroundImage = `url('${dataUrl}')`;
      const coverPrev = document.getElementById('preview-cover-image');
      if (coverPrev) coverPrev.src = dataUrl;
      showToast('Đã đổi ảnh bìa chính thành công! 📸');
    } else if (type === 'groom') {
      weddingDB.data.couple.groomAvatar = dataUrl;
      const groomAvatarEl = document.getElementById('groom-avatar');
      if (groomAvatarEl) groomAvatarEl.src = dataUrl;
      const groomPrev = document.getElementById('preview-groom-avatar');
      if (groomPrev) groomPrev.src = dataUrl;
      showToast('Đã đổi ảnh đại diện Chú Rể! 🤵');
    } else if (type === 'bride') {
      weddingDB.data.couple.brideAvatar = dataUrl;
      const brideAvatarEl = document.getElementById('bride-avatar');
      if (brideAvatarEl) brideAvatarEl.src = dataUrl;
      const bridePrev = document.getElementById('preview-bride-avatar');
      if (bridePrev) bridePrev.src = dataUrl;
      showToast('Đã đổi ảnh đại diện Cô Dâu! 👰');
    }
    weddingDB.saveData();
  };
  reader.readAsDataURL(file);
};

// Tải ảnh cưới lên Album
window.handleGalleryUpload = function(event) {
  if (!window.checkIsAdmin()) {
    showToast('⚠️ Chỉ Cô Dâu & Chú Rể (Admin) mới có quyền thêm ảnh vào Album!');
    return;
  }
  const files = event.target.files;
  if (!files || !files.length) return;

  let loaded = 0;
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      weddingDB.data.gallery.push(e.target.result);
      loaded++;
      if (loaded === files.length) {
        weddingDB.saveData();
        renderGallery(weddingDB.data.gallery);
        renderStudioGallery();
        showToast(`Đã thêm ${loaded} ảnh mới vào Album Cưới! 🖼️`);
      }
    };
    reader.readAsDataURL(file);
  });
};

// Render Album trong Studio kèm nút Xóa
function renderStudioGallery() {
  const container = document.getElementById('studio-gallery-container');
  if (!container) return;
  const gallery = weddingDB.data.gallery || [];
  container.innerHTML = gallery.map((imgUrl, index) => `
    <div class="gallery-studio-item">
      <img src="${imgUrl}" alt="Ảnh cưới ${index + 1}">
      <button type="button" class="gallery-delete-badge" onclick="deleteGalleryPhoto(${index})" title="Xóa ảnh này khỏi Album">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join('');
}

window.deleteGalleryPhoto = function(index) {
  if (!window.checkIsAdmin()) {
    showToast('⚠️ Chỉ Cô Dâu & Chú Rể (Admin) mới có quyền xóa ảnh!');
    return;
  }
  if (weddingDB.data.gallery.length <= 1) {
    showToast('Album cần giữ lại ít nhất 1 ảnh!');
    return;
  }
  weddingDB.data.gallery.splice(index, 1);
  weddingDB.saveData();
  renderGallery(weddingDB.data.gallery);
  renderStudioGallery();
  showToast('Đã xóa ảnh khỏi Album cưới!');
};

// Khôi phục mặc định
window.resetToDefault = function() {
  if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ nội dung về mặc định ban đầu không?')) {
    weddingDB.resetDefault();
    const urlParams = new URLSearchParams(window.location.search);
    renderWeddingPage(urlParams.get('guest'));
    openStudioModal();
    showToast('Đã khôi phục cài đặt mặc định!');
  }
};

/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-gold"></i> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* =========================================================
   HIỆU ỨNG CUỘN TRANG LƯỚT LÊN / LƯỚT XUỐNG
   (SCROLL REVEAL ANIMATIONS CHO CẢ HAI CHIỀU CUỘN)
   ========================================================= */
let scrollRevealObserver = null;

function initScrollReveal() {
  const options = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  };

  if (scrollRevealObserver) {
    scrollRevealObserver.disconnect();
  }

  scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      } else {
        // Khi lướt lên hoặc ra khỏi khung hình, reset để khi cuộn tới lại hiện hiệu ứng
        const rect = entry.target.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) {
          entry.target.classList.remove('is-revealed');
        }
      }
    });
  }, options);

  const targets = document.querySelectorAll('.reveal-on-scroll');
  targets.forEach(el => scrollRevealObserver.observe(el));
}

/* =========================================================
   QUICK GUEST MANAGER (TẠO LINK 10+ KHÁCH MỜI CÁ NHÂN HÓA)
   ========================================================= */
window.openQuickGuestModal = function() {
  if (!window.checkIsAdmin()) {
    window.openPinModal();
    return;
  }
  const modal = document.getElementById('quick-guest-modal');
  if (modal) {
    modal.classList.add('active');
    renderQuickGuestList();
  }
};

window.closeQuickGuestModal = function() {
  const modal = document.getElementById('quick-guest-modal');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.fill10SampleGuests = function() {
  const samples = [
    "Anh Nguyễn Văn Tuấn & Bạn Gái",
    "Chị Trần Mai Phương",
    "Gia đình Bác Hùng (Hà Nội)",
    "Bạn Hoàng Long (FPT)",
    "Anh Minh & Chị Thảo",
    "Chú Bảy & Gia đình",
    "Cô Út Sài Gòn",
    "Tập thể Bạn Thân Đại Học",
    "Em Trâm Anh & Người Thương",
    "Bác Thành & Gia đình"
  ];
  const textarea = document.getElementById('quick-guest-textarea');
  if (textarea) {
    textarea.value = samples.join('\n');
    showToast('Đã điền danh sách mẫu 10 khách mời! Bạn có thể chỉnh sửa tên rồi bấm Tạo Link.');
  }
};

window.handleGenerateBatchGuests = function() {
  const textarea = document.getElementById('quick-guest-textarea');
  const sideSelect = document.getElementById('quick-guest-side');
  if (!textarea || !textarea.value.trim()) {
    showToast('Vui lòng nhập hoặc dán danh sách tên khách mời (mỗi người 1 dòng)!');
    return;
  }
  const side = sideSelect ? sideSelect.value : 'Nhà Trai';
  const added = weddingDB.addBatchGuests(textarea.value, side);
  textarea.value = '';
  renderQuickGuestList();
  renderStudioGuestList(); // Sync with studio
  showToast(`✨ Đã tạo thành công ${added.length} link thiệp cá nhân hóa!`);
};

window.renderQuickGuestList = function() {
  const container = document.getElementById('quick-guest-list-container');
  const countEl = document.getElementById('quick-guest-count');
  if (!container) return;

  const guests = weddingDB.data.guests || [];
  if (countEl) countEl.textContent = guests.length;

  if (guests.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: #9ca3af; font-size: 0.9rem;">
        <i class="fa-regular fa-folder-open" style="font-size: 2rem; margin-bottom: 8px;"></i>
        <div>Chưa có khách mời nào. Hãy nhập tên ở trên hoặc bấm "Điền Mẫu Nhanh 10 Khách"!</div>
      </div>
    `;
    return;
  }

  const baseUrl = window.location.origin + window.location.pathname;

  container.innerHTML = guests.map((g, index) => {
    const guestLink = `${baseUrl}?guest=${encodeURIComponent(g.name)}`;
    const zaloShareUrl = `https://zalo.me/share?text=${encodeURIComponent(`Trân trọng kính mời ${g.name} tới dự lễ thành hôn cùng chúng mình tại: ${guestLink}`)}`;

    return `
      <div class="guest-card-item">
        <div class="guest-info-badge">
          <div class="guest-order-num">${index + 1}</div>
          <div>
            <div class="guest-card-name">${g.name} <span style="font-size: 0.72rem; font-weight: normal; background: #f3f4f6; color: #6b7280; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">${g.side || 'Nhà Trai'}</span></div>
            <div class="guest-card-url">${guestLink}</div>
          </div>
        </div>
        <div class="guest-button-actions">
          <button class="btn-guest-action btn-action-copy" onclick="copyGuestLink('${guestLink}')" title="Sao chép link riêng của ${g.name}">
            <i class="fa-regular fa-copy"></i> Sao chép link
          </button>
          <a href="${zaloShareUrl}" target="_blank" rel="noopener" class="btn-guest-action btn-action-zalo" title="Gửi link qua Zalo cho ${g.name}">
            <i class="fa-solid fa-paper-plane"></i> Gửi Zalo
          </a>
          <a href="${guestLink}" target="_blank" class="btn-guest-action btn-action-preview" title="Xem thiệp cưới riêng của ${g.name}">
            <i class="fa-solid fa-eye"></i> Xem thử
          </a>
          <button class="mini-btn btn-del" onclick="deleteQuickGuest('${g.id}')" title="Xóa khách này" style="padding: 6px 8px;">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
};

window.deleteQuickGuest = function(id) {
  weddingDB.removeGuest(id);
  renderQuickGuestList();
  renderStudioGuestList();
  showToast('Đã xóa khách mời khỏi danh sách.');
};

window.exportGuestsToTxt = function() {
  const guests = weddingDB.data.guests || [];
  if (guests.length === 0) {
    showToast('Chưa có khách mời nào trong danh sách để tải về!');
    return;
  }
  const baseUrl = window.location.origin + window.location.pathname;
  let content = "DANH SÁCH KHÁCH MỜI & LINK THIỆP CƯỚI CÁ NHÂN HÓA\n";
  content += "====================================================\n\n";

  guests.forEach((g, idx) => {
    const link = `${baseUrl}?guest=${encodeURIComponent(g.name)}`;
    content += `${idx + 1}. ${g.name} (${g.side || 'Nhà Trai'})\n   Link: ${link}\n\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Danh_Sach_Thiep_Cuoi_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Đã tải về file danh sách link khách mời (.txt)!');
};


