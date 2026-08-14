    const API_URL = "https://news-server-ut0z.onrender.com/api/news";

const urlParams = new URLSearchParams(window.location.search);
const newsId = urlParams.get('id');

// এলিমেন্টগুলো ধরা হলো
const skeletonLoader = document.getElementById('skeletonLoader');
const actualNewsContent = document.getElementById('actualNewsContent');
const headlineEl = document.getElementById('detailHeadline');
const imageEl = document.getElementById('detailImage');
const imageWrapper = document.getElementById('detailImageWrapper');
const imageCaption = document.getElementById('imageCaption');
const bodyEl = document.getElementById('detailBody');
const authorEl = document.getElementById('detailAuthor');
const dateEl = document.getElementById('detailDate');
const readTimeEl = document.getElementById('detailReadTime');
const moreNewsGrid = document.getElementById('moreNewsGrid');
const extraNewsList = document.getElementById('extraNewsList');
const socialShare = document.getElementById('socialShare');

// ইংরেজি সংখ্যাকে বাংলায় কনভার্ট করার ফাংশন
function toBengaliNumber(numStr) {
  if (!numStr) return '';
  const bengaliDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
  return numStr.toString().replace(/[0-9]/g, function(w) {
    return bengaliDigits[w] || w;
  });
}

// ইংরেজি মাসের নাম বাংলায় কনভার্ট করার ডিকশনারি
const monthMap = {
  'January': 'জানুয়ারি', 'February': 'ফেব্রুয়ারি', 'March': 'মার্চ', 'April': 'এপ্রিল',
  'May': 'মে', 'June': 'জুন', 'July': 'জুলাই', 'August': 'আগস্ট',
  'September': 'সেপ্টেম্বর', 'October': 'অক্টোবর', 'November': 'নভেম্বর', 'December': 'ডিসেম্বর',
  'Jan': 'জানুয়ারি', 'Feb': 'ফেব্রুয়ারি', 'Mar': 'মার্চ', 'Apr': 'এপ্রিল', 'Jun': 'জুন',
  'Jul': 'জুলাই', 'Aug': 'আগস্ট', 'Sep': 'সেপ্টেম্বর', 'Oct': 'অক্টোবর', 'Nov': 'নভেম্বর', 'Dec': 'ডিসেম্বর'
};

// ইংরেজি তারিখ ফরম্যাটকে রূপান্তর
function convertToBengaliDate(dateString) {
  if (!dateString) return toBengaliNumber("২৪ জুন, ২০২৬");
  
  let formatted = dateString;
  for (const [eng, bng] of Object.entries(monthMap)) {
    if (formatted.includes(eng)) {
      formatted = formatted.replace(eng, bng);
      break;
    }
  }
  return toBengaliNumber(formatted);
}

// রিডিং টাইম হিসাব করার ফাংশন
function calculateReadTime(text) {
  if (!text) return toBengaliNumber("১") + " মিনিট পাঠ";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 170);
  return toBengaliNumber(minutes) + " মিনিট পাঠ";
}

// ডাইনামিক রিপোর্টার/সম্পাদক নির্বাচন
const editors = [
  "নিজস্ব প্রতিবেদক", 
  "বিশেষ প্রতিনিধি", 
  "ডেস্ক রিপোর্ট", 
  "স্টাফ রিপোর্টার", 
  "অনলাইন ডেস্ক", 
  "তথ্যপ্রযুক্তি বিভাগ"
];

function getEditorName(newsItem, id) {
  if (newsItem.editor) return newsItem.editor;
  if (newsItem.author) return newsItem.author;
  
  const idx = id ? (parseInt(id.toString().slice(-2)) || 0) % editors.length : 0;
  return editors[idx];
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ডাবল স্টার (**) ও সিঙ্গেল স্টার (*) ফরম্যাটিং ফাংশন
function formatMarkdownCustom(text) {
  if (!text) return '';
  
  let safeText = escapeHTML(text);
  safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  safeText = safeText.replace(/\*(.*?)\*/g, '<span class="blue-bold">$1</span>');
  
  return safeText;
}

async function loadNewsDetails() {
  try {
    skeletonLoader.style.display = 'block';
    actualNewsContent.style.display = 'none';

    const response = await fetch(API_URL);
    const data = await response.json();

    const currentNews = data.find(item => item.id == newsId || item._id == newsId);

    skeletonLoader.style.display = 'none';
    actualNewsContent.style.display = 'block';

    if (currentNews) {
      headlineEl.textContent = currentNews.headline;
      
      bodyEl.innerHTML = formatMarkdownCustom(currentNews.body);
      
      authorEl.textContent = getEditorName(currentNews, newsId);
      dateEl.textContent = convertToBengaliDate(currentNews.date);
      readTimeEl.textContent = calculateReadTime(currentNews.body);

      // --- Open Graph Meta Tags Dynamic Update (Client Side Fallback) ---
      const cleanDescription = currentNews.body ? currentNews.body.replace(/[*#_]/g, '').slice(0, 150) + '...' : 'চেতনা নিউজ';
      const imageUrl = currentNews.image || 'https://konaiparimal50.github.io/Chetana-news/assets/default-share-image.jpg';

      document.title = currentNews.headline + " | চেতনা নিউজ";
      document.getElementById('ogTitle')?.setAttribute('content', currentNews.headline);
      document.getElementById('ogDescription')?.setAttribute('content', cleanDescription);
      
      document.getElementById('twTitle')?.setAttribute('content', currentNews.headline);
      document.getElementById('twDescription')?.setAttribute('content', cleanDescription);

      if (currentNews.image) {
        imageEl.src = currentNews.image;
        imageWrapper.style.display = 'block';
        imageCaption.textContent = currentNews.headline + " — বিশেষ সংবাদ চিত্র";

        document.getElementById('ogImage')?.setAttribute('content', imageUrl);
        document.getElementById('twImage')?.setAttribute('content', imageUrl);
      }
      // ------------------------------------------

      // ===== নতুন শেয়ারিং লিংক জেনারেশন (Render Server Route) =====
      const shareUrl = `https://news-server-ut0z.onrender.com/news-share/${newsId}`;
      const encodedShareUrl = encodeURIComponent(shareUrl);
      const shareTitle = encodeURIComponent(currentNews.headline);

      document.getElementById('shareWa').href = `https://api.whatsapp.com/send?text=${shareTitle} ${encodedShareUrl}`;
      document.getElementById('shareFb').href = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`;
      document.getElementById('shareTw').href = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodedShareUrl}`;
      document.getElementById('shareIg').href = `https://instagram.com/`; 
      // ==========================================================

    } else {
      headlineEl.textContent = "খবরটি পাওয়া যায়নি।";
      socialShare.style.display = 'none';
    }

    // 'পড়তে ভুলবেন না' এবং 'আরও খবর' সেকশন 
    const allOtherNews = data.filter(item => item.id != newsId && item._id != newsId);
    
    // ১. 'পড়তে ভুলবেন না'
    const relatedNews = allOtherNews.slice(0, 6);
    moreNewsGrid.innerHTML = '';
    relatedNews.forEach(item => {
      const card = document.createElement('a');
      const itemId = item.id || item._id;
      card.href = `details.html?id=${itemId}`;
      card.className = 'related-card';

      const imgUrl = item.image || 'https://via.placeholder.com/400x250?text=No+Image';
      const safeHeadline = escapeHTML(item.headline);

      card.innerHTML = `
        <img src="${imgUrl}" alt="${safeHeadline}" class="related-img" loading="lazy">
        <h3 class="related-title">${safeHeadline}</h3>
      `;
      moreNewsGrid.appendChild(card);
    });

    // ২. 'আরও খবর'
    const extraNews = allOtherNews.slice(6, 11);
    extraNewsList.innerHTML = '';
    extraNews.forEach(item => {
      const a = document.createElement('a');
      const itemId = item.id || item._id;
      a.href = `details.html?id=${itemId}`;
      a.className = 'extra-list-item';

      const imgUrl = item.image || 'https://via.placeholder.com/400x250?text=No+Image';
      const safeHeadline = escapeHTML(item.headline);
      const newsDate = convertToBengaliDate(item.date); 

      a.innerHTML = `
        <img src="${imgUrl}" alt="${safeHeadline}" class="extra-list-img" loading="lazy">
        <div class="extra-list-content">
          <h3 class="extra-list-title">${safeHeadline}</h3>
          <span class="extra-list-date">${newsDate}</span>
        </div>
      `;
      extraNewsList.appendChild(a);
    });

  } catch (error) {
    console.error('Error:', error);
    skeletonLoader.style.display = 'none';
    actualNewsContent.style.display = 'block';
    headlineEl.textContent = "সার্ভার থেকে খবর আনতে সমস্যা হয়েছে।";
    socialShare.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', loadNewsDetails);

// ফন্ট সাইজ কন্ট্রোলার
let currentFontSize = 1.35; 
const minFontSize = 1.1;
const maxFontSize = 1.7;

const decBtn = document.getElementById('decFont');
const incBtn = document.getElementById('incFont');
const resetBtn = document.getElementById('resetFont');

if (decBtn && incBtn && resetBtn) {
  decBtn.addEventListener('click', () => {
    if (currentFontSize > minFontSize) {
      currentFontSize -= 0.08;
      bodyEl.style.fontSize = `${currentFontSize}rem`;
    }
  });

  incBtn.addEventListener('click', () => {
    if (currentFontSize < maxFontSize) {
      currentFontSize += 0.08;
      bodyEl.style.fontSize = `${currentFontSize}rem`;
    }
  });

  resetBtn.addEventListener('click', () => {
    currentFontSize = 1.35;
    bodyEl.style.fontSize = `${currentFontSize}rem`;
  });
}

// রিডিং প্রোগ্রেস বার
window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('readingProgress').style.width = `${scrolled}%`;
});

// সাইডবার মেনু কন্ট্রোল
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebarMenu = document.getElementById('sidebarMenu');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const searchBtn = document.getElementById('searchBtn');

if (menuBtn && closeBtn && sidebarMenu && sidebarOverlay) {
  menuBtn.addEventListener('click', () => {
    sidebarMenu.classList.add('active');
    sidebarOverlay.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    sidebarMenu.classList.remove('active');
    sidebarOverlay.classList.remove('active');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebarMenu.classList.remove('active');
    sidebarOverlay.classList.remove('active');
  });
}

// সার্চ বাটনের জন্য নোটিফিকেশন
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const customAlert = document.createElement('div');
    customAlert.style.position = 'fixed';
    customAlert.style.bottom = '30px';
    customAlert.style.left = '50%';
    customAlert.style.transform = 'translateX(-50%)';
    customAlert.style.background = '#333';
    customAlert.style.color = '#fff';
    customAlert.style.padding = '12px 24px';
    customAlert.style.borderRadius = '30px';
    customAlert.style.fontSize = '0.95rem';
    customAlert.style.zIndex = '10000';
    customAlert.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    customAlert.style.fontFamily = 'Tiro Bangla, serif';
    customAlert.textContent = "সার্চ ফিচারটি খুব শীঘ্রই আসছে!";
    
    document.body.appendChild(customAlert);
    setTimeout(() => {
      customAlert.style.transition = 'opacity 0.5s';
      customAlert.style.opacity = '0';
      setTimeout(() => customAlert.remove(), 500);
    }, 2500);
  });
}

// সাইডবার সাবমেনু
function setupSidebarSubmenu(toggleId, submenuId) {
  const toggle = document.getElementById(toggleId);
  const submenu = document.getElementById(submenuId);
  if (!toggle || !submenu) return;

  toggle.addEventListener('click', (e) => {
    e.preventDefault();

    const isOpen = submenu.style.display === 'block';
    submenu.style.display = isOpen ? 'none' : 'block';

    const icon = toggle.querySelector('.dropdown-icon');
    if (icon) {
      icon.classList.toggle('fa-chevron-down', isOpen);
      icon.classList.toggle('fa-chevron-up', !isOpen);
    }
  });
}

setupSidebarSubmenu('districtToggle', 'districtSubmenu');
setupSidebarSubmenu('editorToggle', 'editorSubmenu');
