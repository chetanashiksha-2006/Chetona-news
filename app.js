// app.js[span_0](start_span)[span_0](end_span)

const API_URL = "https://news-server-ut0z.onrender.com/api/news";

const newsGrid = document.getElementById('newsGrid');
const errorMessage = document.getElementById('errorMessage');
const emptyMessage = document.getElementById('emptyMessage');

// পেজিনেশনের জন্য গ্লোবাল ভ্যারিয়েবল
let lastVisible = null; 
let isLoading = false;
let hasMore = true;

function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// তারিখের ফরম্যাট করার জন্য
function formatDate(dateString) {
  if (!dateString) return "তারিখ পাওয়া যায়নি"; 
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString; 
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-GB', options); 
  } catch (error) {
    return dateString;
  }
}

// স্কেলিটন লোডিং (HTML স্ট্রিং রিটার্ন করবে)
function getSkeletonsHTML(count) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skel-card skeleton-loading-placeholder">
        <div class="skel-thumb shimmer"></div>
        <div class="skel-body">
          <div class="skel-line title-1 shimmer"></div>
          <div class="skel-line title-2 shimmer"></div>
          <div class="skel-line desc-1 shimmer"></div>
          <div class="skel-line desc-2 shimmer"></div>
          <div class="skel-line cta shimmer"></div>
        </div>
      </div>`;
  }
  return html;
}

// স্কেলিটন রিমুভ করার ফাংশন
function removeSkeletons() {
  const skeletons = document.querySelectorAll('.skeleton-loading-placeholder');
  skeletons.forEach(el => el.remove());
}

// নিউজ কার্ড তৈরি করে গ্রিডে যুক্ত করার ফাংশন
function appendNews(newsList) {
  newsList.forEach(item => {
    const card = document.createElement('article');
    card.className = 'news-card';

    const imageUrl = item.image || 'https://via.placeholder.com/400x250?text=No+Image';
    const headline = escapeHTML(item.headline || 'শিরোনাম নেই');
    const shortBody = escapeHTML(truncateText(item.body, 100));
    const editorName = escapeHTML(item.editor || 'P.K EDITOR'); 
    const newsDate = formatDate(item.date || item.createdAt); 
    const itemId = item.id || item._id;

    card.innerHTML = `
      <img src="${imageUrl}" alt="${headline}" loading="lazy">
      <div class="card-content">
        <div class="card-meta">
          <span class="editor-name"><i class="fas fa-user-edit"></i> ${editorName}</span>
          <span class="publish-date"><i class="far fa-clock"></i> ${newsDate}</span>
        </div>
        
        <h3>${headline}</h3>
        <p>${shortBody}</p>
        <a href="details/details.html?id=${itemId}" class="read-more">বিস্তারিত পড়ুন →</a>
      </div>
    `;

    newsGrid.appendChild(card);
  });
}

// মূল API কল ফাংশন (Pagination সহ)
async function fetchNews() {
  if (isLoading || !hasMore) return; 

  try {
    isLoading = true;
    errorMessage.style.display = 'none';
    emptyMessage.style.display = 'none';

    // নতুন ডেটা আসার আগে নিচে স্কেলিটন দেখানো
    newsGrid.insertAdjacentHTML('beforeend', getSkeletonsHTML(6));

    let url = `${API_URL}?limit=20`;
    if (lastVisible) {
      url += `&lastVisible=${lastVisible}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // ডেটা চলে আসার পর স্কেলিটন সরিয়ে ফেলা
    removeSkeletons();

    if (!Array.isArray(data) || data.length === 0) {
      if (!lastVisible) {
        emptyMessage.style.display = 'block'; 
      }
      hasMore = false; 
      isLoading = false;
      return;
    }

    // শেষ নিউজের আইডি সেভ করা পরবর্তী পেজের জন্য
    lastVisible = data[data.length - 1].id;

    if (data.length < 20) {
      hasMore = false; // ২০টার কম হলে আর নিউজ নেই ধরে নেওয়া হবে
    }

    appendNews(data);
    isLoading = false;
  } catch (error) {
    console.error('Error fetching news:', error);
    removeSkeletons();
    if (!lastVisible) {
      newsGrid.innerHTML = '';
      errorMessage.style.display = 'block';
    }
    isLoading = false;
  }
}

// স্ক্রল ডিটেকশন (Infinite Scroll)
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
    fetchNews();
  }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

// Initial load
document.addEventListener('DOMContentLoaded', fetchNews);

// =====================================
// সাইডবার মেনু কন্ট্রোল করার কোড
// =====================================
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

if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    alert("সার্চ ফিচারটি খুব শীঘ্রই আসছে!"); 
  });
}

// =====================================
// ডায়নামিক নিউজ টিকার (ব্রেকিং নিউজ)
// =====================================
async function loadDynamicTicker() {
  const tickerMove = document.querySelector('.ticker-move');
  if (!tickerMove) return;

  try {
    // টিকারে শুধু লেটেস্ট ৩টি নিউজ আনবে
    const response = await fetch(`${API_URL}?limit=3`);
    const data = await response.json();

    const recentNews = data.slice(0, 3);

    if (recentNews.length > 0) {
      let tickerHTML = '';
      const prefixes = ["সবচেয়ে বড় খবর: ", "এই মুহূর্তের আপডেট: ", "টাটকা খবর: "];

      recentNews.forEach((news, index) => {
        const prefix = prefixes[index]; 
        const headline = news.headline ? news.headline : 'শিরোনাম নেই';
        tickerHTML += `<span class="ticker-item">${prefix} ${headline}</span>`;
      });

      tickerHTML += `<span class="ticker-item">আরও নতুন খবর পেতে আমাদের সাথেই থাকুন...</span>`;
      tickerMove.innerHTML = tickerHTML;
    }
  } catch (error) {
    console.error("Ticker load error:", error);
    tickerMove.innerHTML = `
      <span class="ticker-item">সার্ভার থেকে খবর আনতে সমস্যা হচ্ছে...</span>
      <span class="ticker-item">আরও নতুন খবর পেতে আমাদের সাথেই থাকুন...</span>
    `;
  }
}

document.addEventListener('DOMContentLoaded', loadDynamicTicker);

// =====================================
// সাইডবার সাবমেনু (জেলা সমূহ / সম্পাদক) টগল লজিক
// =====================================
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
