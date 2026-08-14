// category.js

const API_URL = "https://news-server-ut0z.onrender.com/api/news"; 

// URL থেকে ক্যাটাগরি, জেলা ও সম্পাদকের নাম বের করা
const urlParams = new URLSearchParams(window.location.search);
const categoryName = urlParams.get('cat');
const districtName = urlParams.get('dist');
const editorParam = urlParams.get('editor');

const categoryTitle = document.getElementById('categoryTitle');
const newsGrid = document.getElementById('newsGrid');
const emptyMessage = document.getElementById('emptyMessage');
const errorMessage = document.getElementById('errorMessage');

// হেডিং টেক্সট সেট করা
if (districtName) {
  categoryTitle.textContent = `${districtName} জেলার খবর`;
} else if (editorParam) {
  categoryTitle.textContent = `${editorParam} এর সম্পাদিত খবর`;
} else if (categoryName) {
  categoryTitle.textContent = categoryName + " বিভাগের খবর";
} else {
  categoryTitle.textContent = "সকল খবর";
}

function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// তারিখের ফরম্যাট
function formatDate(dateString) {
  if (!dateString) return "তারিখ পাওয়া যায়নি"; 
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString; 
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-GB', options); 
  } catch (error) {
    return dateString;
  }
}

// স্কেলিটন লোডিং দেখানোর ফাংশন
function showSkeletons() {
  newsGrid.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    newsGrid.innerHTML += `
      <div class="skel-card skeleton-loading-placeholder">
        <div class="skel-thumb shimmer"></div>
        <div class="skel-body">
          <div class="skel-line title-1 shimmer"></div>
          <div class="skel-line title-2 shimmer"></div>
          <div class="skel-line desc-1 shimmer"></div>
          <div class="skel-line desc-2 shimmer"></div>
          <div class="skel-line cta shimmer"></div>
        </div>
      </div>
    `;
  }
}

async function fetchCategoryNews() {
  try {
    showSkeletons();
    emptyMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Server Error");
    const data = await response.json();

    // ব্রাউজার কনসোলে ডাটা চেক করার জন্য (F12 চেপে Console-এ দেখতে পারবেন)
    console.log("API থেকে পাওয়া মোট খবর:", data);

    let filteredData = Array.isArray(data) ? data : [];

    // ১. ক্যাটাগরি ফিল্টার (স্পেসের অমিল এড়াতে trim ব্যবহার করা হয়েছে)
    if (categoryName) {
      filteredData = filteredData.filter(item => 
        item.category && item.category.toString().trim() === categoryName.trim()
      );
    }

    // ২. জেলা ফিল্টার
    if (districtName) {
      filteredData = filteredData.filter(item => 
        item.district && item.district.toString().trim() === districtName.trim()
      );
    }

    // ৩. সম্পাদক ফিল্টার
    if (editorParam) {
      filteredData = filteredData.filter(item => 
        item.editor && item.editor.toString().trim() === editorParam.trim()
      );
    }

    console.log("ফিল্টার হওয়ার পর রেজাল্ট:", filteredData);

    newsGrid.innerHTML = '';

    // কোনো রেজাল্ট না থাকলে "খবর পাওয়া যায়নি" মেসেজ দেখাবে
    if (filteredData.length === 0) {
      emptyMessage.style.display = 'block';
      return;
    }

    // রেজাল্ট থাকলে কার্ড বানিয়ে দেখাবে
    filteredData.forEach(item => {
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
          <a href="../details/details.html?id=${itemId}" class="read-more">বিস্তারিত পড়ুন →</a>
        </div>
      `;
      newsGrid.appendChild(card);
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    newsGrid.innerHTML = '';
    errorMessage.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', fetchCategoryNews);


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
