// Page Router

const router = {
  currentPage: '',

  go(page) {
    this.currentPage = page;
    window.location.hash = page;
    this.render(page);
  },

  render(page) {
    const main = document.getElementById('main-content');
    if (!main) return;

    if (!auth.isAuthenticated()) {
      this.renderLogin(main);
      return;
    }

    if (page === 'dashboard') {
      this.renderDashboard(main);
    } else if (page === 'worklog') {
      renderWorkLogPage();
    } else if (page === 'problems') {
      renderProblemsPage();
    } else if (page === 'admin-announcements' && auth.isAdmin()) {
      renderAdminAnnouncements();
    } else {
      this.renderDashboard(main);
    }
  },

  renderLogin(main) {
    main.innerHTML = `
      <section class="login-container">
        <div class="login-card">
          <div class="login-logo"><div class="login-logo-icon">🏢</div></div>
          <h1 class="login-title">HR KKU EXP</h1>
          <p class="login-subtitle">ระบบบันทึกประสบการณ์การทำงานและคลังความรู้</p>
          <form id="login-form" novalidate>
            <div class="form-group">
              <label class="form-label required" for="email">อีเมล KKU</label>
              <input class="form-input" id="email" type="email" autocomplete="email" placeholder="name@kku.ac.th" required>
              <p class="form-help">รองรับเฉพาะบัญชี @kku.ac.th</p>
            </div>
            <p id="login-error" class="form-error hidden" role="alert"></p>
            <button class="btn btn-primary btn-full" type="submit">เข้าสู่ระบบ</button>
          </form>
        </div>
      </section>`;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const errorEl = document.getElementById('login-error');
      errorEl.classList.add('hidden');

      const result = await auth.login(email);
      if (!result.success) {
        errorEl.textContent = result.error || 'ไม่สามารถเข้าสู่ระบบได้';
        errorEl.classList.remove('hidden');
        return;
      }
      renderHeader();
      renderSidebar();
      announcementManager.run(() => {
        renderHeader();
        renderSidebar();
        router.render('dashboard');
      });
    });
  },

  renderDashboard(main) {
    const user = auth.getUser();
    main.innerHTML = `
      <section class="page-header">
        <div>
          <h1 class="page-title">ยินดีต้อนรับ${user ? `, ${esc(user.displayName)}` : ''}</h1>
          <p class="page-subtitle">HR KKU Experience & Knowledge Platform</p>
        </div>
      </section>
      <section class="stats-grid">
        <article class="stats-card"><div class="stats-icon">📝</div><p class="stats-label">บันทึกงาน</p><p class="stats-value">-</p></article>
        <article class="stats-card"><div class="stats-icon">🏆</div><p class="stats-label">EXP ของฉัน</p><p class="stats-value">${user ? user.totalExp || 0 : 0}</p></article>
        <article class="stats-card"><div class="stats-icon">🌱</div><p class="stats-label">ระดับปัจจุบัน</p><p class="stats-value">${user ? user.levelId || 'LV-01' : 'LV-01'}</p></article>
      </section>
      <section class="card">
        <h2 class="card-title">พร้อมใช้งาน</h2>
        <p class="mt-md">บันทึกงาน · ปัญหาและวิธีแก้ · ประกาศบังคับรับทราบ</p>
        <div class="table-actions mt-md">
          <button class="btn btn-primary" id="go-worklog-btn">บันทึกงาน</button>
          <button class="btn btn-outline" id="go-problems-btn">ปัญหาและวิธีแก้</button>
        </div>
      </section>`;
    document.getElementById('go-worklog-btn')?.addEventListener('click', () => router.go('worklog'));
    document.getElementById('go-problems-btn')?.addEventListener('click', () => router.go('problems'));
  }
};

function esc(val) {
  const el = document.createElement('span');
  el.textContent = val || '';
  return el.innerHTML;
}