// moreNews.js

// ১. প্রথমে সিএসএস ডিজাইন তৈরি করে পেজের <head>-এ যুক্ত করা হচ্ছে
const style = document.createElement('style');
style.innerHTML = `
  .dynamic-more-news {
    margin-top: 40px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  .dynamic-more-news-header {
    font-size: 1.5rem;
    color: #b71c1c;
    border-left: 5px solid #b71c1c;
    padding-left: 10px;
    margin-bottom: 20px;
    font-family: 'Tiro Bangla', serif;
  }
  .dynamic-news-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .dynamic-news-item {
    display: flex;
    gap: 14px;
    align-items: center;
    text-decoration: none;
    color: #333;
    border-bottom: 1px solid #eee;
    padding: 12px 4px;
    transition: background 0.2s ease, padding-left 0.2s ease;
  }
  .dynamic-news-item:first-child {
    padding-top: 0;
  }
  .dynamic-news-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .dynamic-news-item:hover {
    background: #fafafa;
    padding-left: 8px;
  }
  .dynamic-news-img {
    width: 120px;
    height: 84px;
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
  }
  .dynamic-news-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }
  .dynamic-news-title {
    font-size: 0.98rem;
    font-weight: 600;
    line-height: 1.4;
    font-family: 'Tiro Bangla', serif;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .dynamic-news-date {
    font-size: 0.78rem;
    color: #888;
    margin-top: 4px;
    font-family: sans-serif;
  }
  @media (max-width: 600px) {
    .dynamic-news-img { width: 96px; height: 68px; }
    .dynamic-news-title { font-size: 0.92rem; }
  }
`;
document.head.appendChild(style);

// ২. খবর লোড করার মূল ফাংশন
async function loadDynamicMoreNews(containerId, basePath = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // লোডিং টেক্সট
  container.innerHTML = '<p style="text-align:center; color:#777; padding: 20px;">আরও খবর লোড হচ্ছে...</p>';

  try {
    const response = await fetch('https://news-server-ut0z.onrender.com/api/news');
    if (!response.ok) throw new Error("Server error");
    const data = await response.json();

    // বর্তমান পেজের আইডি বের করা (যাতে যে খবরটা পড়া হচ্ছে সেটা 'আরও খবর'-এ না দেখায়)
    const urlParams = new URLSearchParams(window.location.search);
    const currentId = urlParams.get('id');

    // বর্তমান খবরটি বাদ দিয়ে বাকি সব খবর থেকে ৫টি খবর বেছে নেওয়া
    const filteredData = data.filter(item => item.id !== currentId && item._id !== currentId).slice(0, 8);

    if (filteredData.length === 0) {
      container.innerHTML = '';
      return;
    }

    // এইচটিএমএল (HTML) তৈরি করা
    let html = `
      <div class="dynamic-more-news">
        <h3 class="dynamic-more-news-header"><i class="far fa-newspaper"></i> আরও খবর</h3>
        <div class="dynamic-news-list">
    `;

    filteredData.forEach(item => {
      const imgUrl = item.image || 'https://via.placeholder.com/100x75?text=No+Image';
      const title = item.headline ? item.headline.replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'শিরোনাম নেই';
      const date = item.date || 'June 25, 2026';
      const itemId = item.id || item._id;

      html += `
        <a href="${basePath}details/details.html?id=${itemId}" class="dynamic-news-item">
          <img src="${imgUrl}" alt="News Image" class="dynamic-news-img" loading="lazy">
          <div class="dynamic-news-text">
            <div class="dynamic-news-title">${title}</div>
            <div class="dynamic-news-date">${date}</div>
          </div>
        </a>
      `;
    });

    html += `</div></div>`;

    // পেজে কোডটুকু ঢুকিয়ে দেওয়া
    container.innerHTML = html;

  } catch (error) {
    console.error('Error fetching more news:', error);
    container.innerHTML = '';
  }
}
