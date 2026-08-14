// social-link.js
// Pure JavaScript implementation – no HTML needed, just include this script.

(function() {
  "use strict";

  // ---------- configuration ----------
  const CONFIG = {
    youtube: {
      name: 'YouTube',
      icon: 'fab fa-youtube',
      url: 'https://youtube.com/@chetananews.bangla?si=KTYMflDrdNiAXmHK',
      iconClass: 'youtube',
      color: '#FF0000'
    },
    facebook: {
      name: 'Facebook',
      icon: 'fab fa-facebook-f',
      url: 'https://www.facebook.com/share/1BUB1aMkrL/',
      iconClass: 'facebook',
      color: '#1877F2'
    }
  };

  // ---------- create DOM structure ----------
  function buildUI() {
    // 1. create card container
    const card = document.createElement('div');
    card.className = 'join-card';
    card.id = 'joinCard';

    // 2. header
    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `
      <h2><i class="fas fa-bolt" style="margin-right: 8px; opacity: 0.5;"></i> Follow Us </h2>
      <i class="fas fa-ellipsis-h"></i>
    `;
    card.appendChild(header);

    // 3. create join items dynamically
    const platforms = [
      { key: 'youtube', config: CONFIG.youtube },
      { key: 'facebook', config: CONFIG.facebook }
    ];

    platforms.forEach(({ key, config }) => {
      const item = document.createElement('div');
      item.className = `join-item ${config.iconClass}`;
      item.id = `${key}Item`;

      // app info (icon + name)
      const appInfo = document.createElement('div');
      appInfo.className = 'app-info';
      appInfo.innerHTML = `
        <div class="app-icon ${config.iconClass}">
          <i class="${config.icon}"></i>
        </div>
        <div class="app-name">${config.name} <span>·</span></div>
      `;

      // join button
      const btn = document.createElement('button');
      btn.className = 'join-btn';
      btn.id = `join${capitalize(key)}Btn`;
      btn.innerHTML = `Join Now <i class="fas fa-arrow-right"></i>`;

      // assemble item
      item.appendChild(appInfo);
      item.appendChild(btn);
      card.appendChild(item);

      // store reference for event binding
      item._btn = btn;
      item._config = config;
    });

    // 4. footer
    const footer = document.createElement('div');
    footer.className = 'card-footer';
    footer.innerHTML = `
      <span><i class="fas fa-shield-alt"></i> Public</span>
      <span><i class="fas fa-globe"></i> 2026</span>
    `;
    card.appendChild(footer);

        // 5. inject into target container
    const targetContainer = document.getElementById('social-links-wrapper');
    if (targetContainer) {
      targetContainer.appendChild(card); // নির্দিষ্ট বক্সে বসাবে
    } else {
      document.body.appendChild(card); // বক্স না পেলে পেজের নিচে বসাবে
    }


    // 6. attach events after DOM is ready
    attachEvents();
  }

  // ---------- helper: capitalize first letter ----------
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ---------- event handling + link opening ----------
  function attachEvents() {
    const youtubeBtn = document.getElementById('joinYoutubeBtn');
    const facebookBtn = document.getElementById('joinFacebookBtn');
    const youtubeItem = document.getElementById('youtubeItem');
    const facebookItem = document.getElementById('facebookItem');

    if (youtubeBtn && youtubeItem) {
      youtubeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        handleJoin('YouTube', CONFIG.youtube.url, this, youtubeItem);
      });
    }

    if (facebookBtn && facebookItem) {
      facebookBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        handleJoin('Facebook', CONFIG.facebook.url, this, facebookItem);
      });
    }
  }

  // ---------- core action: open link + feedback ----------
  function handleJoin(platform, url, btnElement, parentItem) {
    // 1. pulse effect
    btnElement.classList.add('pulse-glow');
    setTimeout(() => {
      btnElement.classList.remove('pulse-glow');
    }, 400);

    // 2. scale feedback
    parentItem.style.transition = 'transform 0.15s ease, box-shadow 0.2s';
    parentItem.style.transform = 'scale(0.98)';
    setTimeout(() => {
      parentItem.style.transform = 'scale(1)';
    }, 150);

    // 3. button text feedback
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 6px;"></i> opening...`;
    btnElement.style.background = '#f0f4ff';
    btnElement.style.borderColor = 'rgba(0,0,0,0.05)';

    // 4. open link in new tab (with small delay for UI feedback)
    setTimeout(() => {
      window.open(url, '_blank');
      // revert button after 1.8s
      setTimeout(() => {
        btnElement.innerHTML = originalText;
        btnElement.style.background = '';
        btnElement.style.borderColor = '';
      }, 1800);
    }, 200);

    // 5. console log (optional)
    console.log(`[Join] ${platform} → opening ${url}`);
  }

  // ---------- inject required styles (so it works standalone) ----------
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ---- base & card ---- */
      .join-card {
        max-width: 480px;
        width: 100%;
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(14px) saturate(180%);
        -webkit-backdrop-filter: blur(14px) saturate(180%);
        border-radius: 3.5rem;
        padding: 2.5rem 2rem 2.8rem;
        box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5);
        transition: transform 0.25s ease, box-shadow 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.7);
        margin: 0 auto;
      }
      .join-card:hover {
        box-shadow: 0 30px 60px -18px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8);
        transform: scale(1.01);
      }

      /* ---- header ---- */
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2.2rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .card-header h2 {
        color: #1e293b;
        font-weight: 500;
        font-size: 1rem;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.4);
        padding: 0.3rem 1.2rem;
        border-radius: 60px;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
      }
      .card-header i {
        color: #6b7a8f;
        font-size: 1.2rem;
        opacity: 0.6;
      }

      /* ---- join item ---- */
      .join-item {
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        border-radius: 2.5rem;
        padding: 0.9rem 1.8rem 0.9rem 1.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid rgba(255, 255, 255, 0.8);
        transition: all 0.25s ease;
        box-shadow: 0 8px 20px -10px rgba(0, 0, 0, 0.04);
        cursor: default;
      }
      .join-item:last-child {
        margin-bottom: 0;
      }
      .join-item:hover {
        background: rgba(255, 255, 255, 0.75);
        border-color: #ffffff;
        transform: translateY(-3px);
        box-shadow: 0 18px 35px -14px rgba(0, 0, 0, 0.08);
      }

      /* ---- app info ---- */
      .app-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .app-icon {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        color: white;
        background: rgba(0, 0, 0, 0.02);
        transition: 0.2s;
        flex-shrink: 0;
      }
      .app-icon.youtube {
        background: #ffffff;
        color: #FF0000;
        box-shadow: 0 4px 12px rgba(255, 0, 0, 0.08), 0 0 0 1px rgba(255, 0, 0, 0.05);
      }
      .app-icon.youtube i {
        filter: drop-shadow(0 2px 4px rgba(255, 0, 0, 0.1));
      }
      .app-icon.facebook {
        background: #ffffff;
        color: #1877F2;
        box-shadow: 0 4px 12px rgba(24, 119, 242, 0.08), 0 0 0 1px rgba(24, 119, 242, 0.05);
      }
      .app-icon.facebook i {
        filter: drop-shadow(0 2px 4px rgba(24, 119, 242, 0.08));
      }
      .app-name {
        font-weight: 600;
        font-size: 1.3rem;
        letter-spacing: -0.3px;
        color: #0b1a2b;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
        transition: 0.2s;
      }
      .app-name span {
        font-weight: 300;
        opacity: 0.4;
        margin-left: 4px;
        font-size: 0.8rem;
        letter-spacing: 1px;
      }

      /* ---- join button ---- */
      .join-btn {
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.04);
        padding: 0.55rem 1.4rem;
        border-radius: 60px;
        font-weight: 600;
        font-size: 0.8rem;
        letter-spacing: 0.5px;
        color: #1e293b;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(0, 0, 0, 0.01);
        transition: all 0.25s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        text-transform: uppercase;
      }
      .join-btn i {
        font-size: 0.7rem;
        opacity: 0.6;
        transition: 0.2s;
      }
      .join-btn:hover {
        background: #ffffff;
        border-color: rgba(0, 0, 0, 0.06);
        color: #000;
        box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.08);
        transform: scale(1.02);
      }
      .join-btn:active {
        transform: scale(0.96);
      }
      .join-item.youtube:hover .join-btn {
        border-color: rgba(255, 0, 0, 0.2);
        box-shadow: 0 8px 20px -6px rgba(255, 0, 0, 0.05);
      }
      .join-item.facebook:hover .join-btn {
        border-color: rgba(24, 119, 242, 0.2);
        box-shadow: 0 8px 20px -6px rgba(24, 119, 242, 0.05);
      }

      /* ---- footer ---- */
      .card-footer {
        margin-top: 2.8rem;
        text-align: center;
        color: rgba(0, 0, 0, 0.25);
        font-size: 0.7rem;
        letter-spacing: 1.5px;
        display: flex;
        justify-content: center;
        gap: 1.2rem;
        border-top: 1px solid rgba(0, 0, 0, 0.04);
        padding-top: 1.8rem;
      }
      .card-footer i {
        margin-right: 6px;
        opacity: 0.4;
      }

      /* ---- pulse animation ---- */
      .pulse-glow {
        animation: pulseGlow 0.3s ease 1;
      }
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.05); }
        50% { box-shadow: 0 0 30px 8px rgba(0, 0, 0, 0.02); }
        100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
      }

      /* ---- responsive ---- */
      @media (max-width: 460px) {
        .join-card { padding: 1.8rem 1.2rem 2rem; border-radius: 2.5rem; }
        .app-icon { width: 2.8rem; height: 2.8rem; font-size: 1.5rem; }
        .app-name { font-size: 1.1rem; }
        .join-btn { padding: 0.4rem 1rem; font-size: 0.7rem; }
        .join-item { padding: 0.7rem 1rem 0.7rem 1rem; border-radius: 2rem; }
      }
      @media (max-width: 380px) {
        .join-item { flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
        .app-info { flex: 1 1 100%; justify-content: center; }
        .join-btn { width: 100%; justify-content: center; }
      }
      ::selection {
        background: rgba(0, 0, 0, 0.05);
        color: #0b1a2b;
      }
    `;
    document.head.appendChild(style);
  }

  // ---------- init ----------
  function init() {
    // inject styles first
    injectStyles();
    // then build the UI
    buildUI();
    console.log('✅ social-link.js loaded · YouTube & Facebook join cards (light theme)');
  }

  // run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();