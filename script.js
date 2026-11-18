/**
 * GARDEN GRAPE INVESTMENTS - SCRIPT.JS
 * Site interactions: nav, hero carousel, filter tabs, racing game, booking form.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // 1. Audio System (Web Audio API Synthesizer)
  // ----------------------------------------------------
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  const SoundFX = {
    click: () => {
      if (!soundEnabled || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch (e) {}
    },
    powerup: () => {
      if (!soundEnabled || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, audioCtx.currentTime);
        osc.frequency.setValueAtTime(440, audioCtx.currentTime + 0.06);
        osc.frequency.setValueAtTime(660, audioCtx.currentTime + 0.12);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.28);
      } catch (e) {}
    },
    crash: () => {
      if (!soundEnabled || !audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } catch (e) {}
    },
    win: () => {
      if (!soundEnabled || !audioCtx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          const startTime = audioCtx.currentTime + (idx * 0.08);
          gain.gain.setValueAtTime(0.2, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.22);
        });
      } catch (e) {}
    }
  };

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundToggleBtn.classList.toggle('active', soundEnabled);
      soundToggleBtn.querySelector('span').textContent = soundEnabled ? 'SFX: ON' : 'SFX: OFF';
      if (soundEnabled) SoundFX.click();
    });
  }

  document.querySelectorAll('button, .btn, .filter-tab, .slider-dot').forEach(el => {
    el.addEventListener('click', () => {
      initAudio();
      SoundFX.click();
    });
  });

  // ----------------------------------------------------
  // 2. Navigation & Mobile Menu
  // ----------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const headerNav = document.getElementById('headerNav');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerNav?.classList.add('scrolled');
    } else {
      headerNav?.classList.remove('scrolled');
    }
  });

  // ----------------------------------------------------
  // 3. Hero Visual Carousel Slider
  // ----------------------------------------------------
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide = index;
  }

  function nextSlide() {
    if (!slides.length) return;
    showSlide((currentSlide + 1) % slides.length);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(parseInt(dot.getAttribute('data-index') || '0', 10));
      resetSlideTimer();
    });
  });

  function startSlideTimer() {
    if (slides.length > 1) slideInterval = setInterval(nextSlide, 4500);
  }

  function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
  }

  startSlideTimer();

  // ----------------------------------------------------
  // 4. Attraction Filter Tabs
  // ----------------------------------------------------
  const filterTabs = document.querySelectorAll('.filter-tab');
  const attractionCards = document.querySelectorAll('.attraction-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-filter');

      attractionCards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // ----------------------------------------------------
  // 5. Interactive Mini-Game: "Adrenaline Turbo Racer"
  // ----------------------------------------------------
  const canvas = document.getElementById('arcadeCanvas');
  const gameStartOverlay = document.getElementById('gameStartOverlay');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const startGameBtn = document.getElementById('startGameBtn');
  const restartGameBtn = document.getElementById('restartGameBtn');
  const finalScoreEl = document.getElementById('finalScoreEl');
  const promoUnlockBox = document.getElementById('promoUnlockBox');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let isPlaying = false;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('gg_highscore') || '0', 10);
    const highScoreEl = document.getElementById('highScoreEl');
    if (highScoreEl) highScoreEl.textContent = highScore;

    canvas.width = 400;
    canvas.height = 500;

    const lanes = [90, 200, 310];
    let currentLane = 1;
    let playerY = 420;
    let targetX = lanes[currentLane];
    let playerX = lanes[currentLane];

    let speed = 4.2;
    let obstacles = [];
    let powerups = [];
    let spawnTimer = 0;
    let roadStripeOffset = 0;

    function resetGame() {
      score = 0;
      speed = 4.2;
      currentLane = 1;
      playerX = lanes[1];
      targetX = lanes[1];
      obstacles = [];
      powerups = [];
      spawnTimer = 0;
    }

    function moveLeft() {
      if (currentLane > 0) {
        currentLane--;
        targetX = lanes[currentLane];
        SoundFX.click();
      }
    }

    function moveRight() {
      if (currentLane < lanes.length - 1) {
        currentLane++;
        targetX = lanes[currentLane];
        SoundFX.click();
      }
    }

    window.addEventListener('keydown', (e) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
      }
    });

    document.getElementById('touchLeft')?.addEventListener('click', () => {
      if (isPlaying) moveLeft();
    });
    document.getElementById('touchRight')?.addEventListener('click', () => {
      if (isPlaying) moveRight();
    });

    function spawnEntity() {
      const lane = Math.floor(Math.random() * 3);
      const isPowerup = Math.random() < 0.45;

      if (isPowerup) {
        const type = Math.random() < 0.5 ? 'grape' : 'ice';
        powerups.push({ x: lanes[lane], y: -30, type, radius: 14 });
      } else {
        obstacles.push({ x: lanes[lane], y: -40, width: 36, height: 36, type: 'cone' });
      }
    }

    function drawPlayer(x, y) {
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#2FA157';
      ctx.fillStyle = '#2FA157';
      ctx.beginPath();
      ctx.ellipse(x, y + 10, 22, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(x, y);

      ctx.fillStyle = '#111827';
      ctx.fillRect(-22, -18, 8, 14);
      ctx.fillRect(14, -18, 8, 14);
      ctx.fillRect(-23, 10, 9, 16);
      ctx.fillRect(14, 10, 9, 16);

      ctx.fillStyle = '#2FA157';
      ctx.fillRect(-20, -14, 4, 6);
      ctx.fillRect(16, -14, 4, 6);
      ctx.fillRect(-21, 14, 5, 8);
      ctx.fillRect(16, 14, 5, 8);

      ctx.fillStyle = '#FF7A1F';
      ctx.beginPath();
      ctx.roundRect(-14, -20, 28, 42, 6);
      ctx.fill();

      ctx.fillStyle = '#0B0E14';
      ctx.beginPath();
      ctx.roundRect(-9, -8, 18, 18, 4);
      ctx.fill();

      ctx.fillStyle = '#2FA157';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0A84FF';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0A84FF';
      ctx.fillRect(-11, -22, 5, 3);
      ctx.fillRect(6, -22, 5, 3);

      ctx.restore();
    }

    function gameLoop() {
      if (!isPlaying) return;

      ctx.fillStyle = '#0B0E14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#2A2F3A';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 0, canvas.width - 40, canvas.height);

      roadStripeOffset = (roadStripeOffset + speed) % 40;
      ctx.strokeStyle = 'rgba(47, 161, 87, 0.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([18, 22]);

      ctx.beginPath();
      ctx.moveTo(145, -40 + roadStripeOffset);
      ctx.lineTo(145, canvas.height + 40);
      ctx.moveTo(255, -40 + roadStripeOffset);
      ctx.lineTo(255, canvas.height + 40);
      ctx.stroke();
      ctx.setLineDash([]);

      playerX += (targetX - playerX) * 0.25;
      drawPlayer(playerX, playerY);

      spawnTimer++;
      if (spawnTimer > Math.max(30, 65 - Math.floor(score / 50))) {
        spawnEntity();
        spawnTimer = 0;
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += speed;

        ctx.save();
        ctx.fillStyle = '#EF4444';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#EF4444';
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y - 18);
        ctx.lineTo(obs.x - 14, obs.y + 14);
        ctx.lineTo(obs.x + 14, obs.y + 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(obs.x - 7, obs.y - 2, 14, 5);
        ctx.restore();

        const dist = Math.hypot(obs.x - playerX, obs.y - playerY);
        if (dist < 28) {
          endGame();
          return;
        }

        if (obs.y > canvas.height + 40) {
          obstacles.splice(i, 1);
          score += 5;
        }
      }

      for (let i = powerups.length - 1; i >= 0; i--) {
        const p = powerups[i];
        p.y += speed * 0.9;

        ctx.save();
        if (p.type === 'grape') {
          ctx.shadowBlur = 14;
          ctx.shadowColor = '#2FA157';
          ctx.fillStyle = '#2FA157';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#92b443';
          ctx.fillRect(p.x - 2, p.y - 16, 4, 7);
        } else {
          ctx.shadowBlur = 14;
          ctx.shadowColor = '#0A84FF';
          ctx.fillStyle = '#0A84FF';
          ctx.fillRect(p.x - 10, p.y - 10, 20, 20);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(p.x - 6, p.y - 6, 12, 12);
        }
        ctx.restore();

        const dist = Math.hypot(p.x - playerX, p.y - playerY);
        if (dist < 26) {
          SoundFX.powerup();
          if (p.type === 'grape') {
            score += 30;
          } else {
            score += 50;
            speed = Math.max(3, speed - 0.8);
          }
          powerups.splice(i, 1);
        } else if (p.y > canvas.height + 30) {
          powerups.splice(i, 1);
        }
      }

      score += 0.1;
      speed = Math.min(9.5, speed + 0.0008);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px -apple-system, sans-serif';
      ctx.fillText(`SCORE: ${Math.floor(score)}`, 30, 32);

      const liveScoreEl = document.getElementById('liveScoreEl');
      if (liveScoreEl) liveScoreEl.textContent = Math.floor(score);

      animationId = requestAnimationFrame(gameLoop);
    }

    function startGame() {
      initAudio();
      resetGame();
      isPlaying = true;
      gameStartOverlay?.classList.add('hidden');
      gameOverOverlay?.classList.add('hidden');
      SoundFX.click();
      animationId = requestAnimationFrame(gameLoop);
    }

    function endGame() {
      isPlaying = false;
      cancelAnimationFrame(animationId);
      SoundFX.crash();

      const finalScore = Math.floor(score);
      if (finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem('gg_highscore', highScore.toString());
        SoundFX.win();
      }

      if (highScoreEl) highScoreEl.textContent = highScore;
      if (finalScoreEl) finalScoreEl.textContent = finalScore;

      if (finalScore >= 500) {
        if (promoUnlockBox) promoUnlockBox.style.display = 'block';
        SoundFX.win();
      } else {
        if (promoUnlockBox) promoUnlockBox.style.display = 'none';
      }

      gameOverOverlay?.classList.remove('hidden');
    }

    startGameBtn?.addEventListener('click', startGame);
    restartGameBtn?.addEventListener('click', startGame);
  }

  // ----------------------------------------------------
  // 6. Booking & Inquiry Form Submission
  // ----------------------------------------------------
  const successModal = document.getElementById('bookingSuccessModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  function openBookingModal(confirmMessage, waTargetNumber, waMessage) {
    const confirmText = document.getElementById('modalConfirmationText');
    if (confirmText) confirmText.textContent = confirmMessage;

    const modalWaLink = document.getElementById('modalWhatsAppSend');
    if (modalWaLink) {
      modalWaLink.href = `https://wa.me/${waTargetNumber}?text=${encodeURIComponent(waMessage)}`;
    }

    if (successModal) successModal.classList.add('active');
  }

  const bookingForm = document.getElementById('venueBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      initAudio();
      SoundFX.powerup();

      const name = document.getElementById('bkName')?.value || 'Guest';
      const phone = document.getElementById('bkPhone')?.value || '';
      const activity = document.getElementById('bkActivity')?.value || 'General Visit';
      const date = document.getElementById('bkDate')?.value || 'Upcoming';
      const notes = document.getElementById('bkNotes')?.value || '';
      const contactTarget = document.getElementById('bkContactTarget')?.value || 'Ketty';
      const targetNumber = contactTarget.includes('Ketty') ? '263712354319' : '263772465535';

      const msg = `Hello Garden Grape Investments! My name is ${name} (${phone}). I would like to book/inquire with ${contactTarget} about: ${activity} on ${date}. Special Notes: ${notes}`;
      openBookingModal(
        `Thanks ${name}! Your inquiry for ${activity} on ${date} is ready for ${contactTarget}. Send it directly on WhatsApp for priority response!`,
        targetNumber,
        msg
      );
    });
  }

  // School & Event Quote Form
  const eventBookingForm = document.getElementById('eventBookingForm');
  if (eventBookingForm) {
    eventBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      initAudio();
      SoundFX.powerup();

      const org = document.getElementById('evOrg')?.value || 'Guest';
      const contactName = document.getElementById('evContactName')?.value || '';
      const phone = document.getElementById('evPhone')?.value || '';
      const service = document.getElementById('evService')?.value || '';
      const eventType = document.getElementById('evType')?.value || '';
      const date = document.getElementById('evDate')?.value || 'Upcoming';
      const count = document.getElementById('evCount')?.value || 'Not specified';
      const location = document.getElementById('evLocation')?.value || 'Not specified';
      const notes = document.getElementById('evNotes')?.value || '';

      const msg = `Hello Ketty! I would like to request a quote for a school/event booking.\n` +
        `Organization: ${org}\nContact: ${contactName} (${phone})\nService: ${service}\nEvent Type: ${eventType}\n` +
        `Date: ${date}\nEstimated Participants: ${count}\nLocation: ${location}\nNotes: ${notes}`;

      openBookingModal(
        `Thanks ${contactName || org}! Your ${service} quote request for ${date} is ready to send to Ketty.`,
        '263712354319',
        msg
      );
    });
  }

  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }

  successModal?.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.remove('active');
    }
  });
});
