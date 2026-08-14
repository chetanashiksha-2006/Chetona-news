// footer.js

function renderFooter(basePath = '') {
  const footerHTML = `
    <footer class="site-footer">
      <div class="footer-top">
        <div class="footer-grid">
          
          <div class="footer-col about-col">
            <h2 class="footer-logo">চেতনা<span>নিউজ</span></h2>
            <p>চেতনা নিউজ হলো আপনার বিশ্বস্ত খবরের মাধ্যম। আমরা আপনাদের কাছে পৌঁছে দিই দেশ-বিদেশ, রাজনীতি, খেলা ও বিনোদনের টাটকা ও নিরপেক্ষ খবর, সবার আগে।</p>
          </div>

          <div class="footer-col links-col">
            <h3>Category</h3>
            <ul>
              <li><a href="${basePath}category/category.html?cat=জাতীয়">জাতীয়</a></li>
              <li><a href="${basePath}category/category.html?cat=আন্তর্জাতিক">আন্তর্জাতিক</a></li>
              <li><a href="${basePath}category/category.html?cat=রাজনীতি">রাজনীতি</a></li>
              <li><a href="${basePath}category/category.html?cat=শিক্ষা">শিক্ষা</a></li>
              <li><a href="${basePath}category/category.html?cat=খেলা">খেলা</a></li>
              <li><a href="${basePath}category/category.html?cat=বিনোদন">বিনোদন</a></li>
            </ul>
          </div>

          <div class="footer-col social-col">
            <h3>Follow Us</h3>
            <div class="social-links">
              <a href="https://www.facebook.com/share/1ETK8ATjPR/" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>
              <a href="https://youtube.com/@chetananews.bangla?si=1oT9JWCFRoReUa6k" target="_blank" title="YouTube"><i class="fab fa-youtube"></i></a>
              <a href="YOUR_WHATSAPP_LINK" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
            </div>
          </div>

        </div>
      </div>

      <div class="footer-bottom-wrapper">
        <div class="footer-bottom">
          <p>© 2026 সংবাদ প্রতিদিন | সর্বস্বত্ব সংরক্ষিত</p>
          <p>Developed by <a href="YOUR_DEVELOPER_LINK" target="_blank" class="dev-link">Parimal (P.K BOSS)</a></p>
        </div>
      </div>
    </footer>
  `;

  // HTML পেজে থাকা ফাঁকা <div>-এর ভেতর এই কোড ঢুকিয়ে দেবে
  document.getElementById('footer-placeholder').innerHTML = footerHTML;
}
