// Page Router - จัดการหน้าพื้นฐานใน Phase 1

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

    if (page === 'dashboard' && auth.isAuthenticated()) {
      const user = auth.getUser();
      main.innerHTML = `
        <section class="page-header">
          <div>
            <h1 class="page-title">ยินดีต้อนรับ${user ? `, ${this.escapeHtml(user.displayName)}` : ''}</h1>
            <p class="page-subtitle">HR KKU Experience & Knowledge Platform</p>
          </div>
        </section>
        <section class="stats-grid" aria-label="สรุปข้อมูล">
          <article class="stats-card"><div class="stats-icon">📝</div><p class="stats-label">บันทึกงาน</p><p class="stats-value">-</p></article>
          <article class="stats-card"><div class="stats-icon">🏆</div><p class="stats-label">EXP ของฉัน</p><p class="stats-value">${user ? user.totalExp || 0 : 0}</p></article>
          <article class="stats-card"><div class="stats-icon">🌱</div><p class="stats-label">ระดับปัจจุบัน</p><p class="stats-value">${user ? user.levelId || 'LV-01' : 'LV-01'}</p></article>
        </section>
        <section class="card">
          <h2 class="card-title">Project Foundation พร้อมใช้งาน</h2>
          <p class="mt-md">ระบบเชื่อมต่อ Backend แล้ว ขั้นตอนถัดไปคือ Phase 2: ระบบยืนยันตัวตนจริงและประกาศบังคับรับทราบ</p>
        </section>`;
      return;
    }

    main.innerHTML = `
      <section class="login-container">
        <div class="login-card">
          <div class="login-logo"><div class="login-logo-icon">🏢</div></div>
          <h1 class="login-title">HR KKU EXP</h1>
          <p class="login-subtitle">ระบบบันทึกประสบการณ์การทำงานและคลังความรู้</p>
          <form id="login-form" novalidate>
            <div class="form-group">
              <label class="form-label required" for="email">อีเมล KKU</label>
              <input class="form-input" id="email" name="email" type="email" autocomplete="email" placeholder="name@kku.ac.th" required>
              <p class="form-help">รองรับเฉพาะบัญชี @kku.ac.th</p>
            </div>
            <p id="login-error" class="form-error hidden" role="alert"></p>
            <button class="btn btn-primary btn-full" type="submit">เข้าสู่ระบบ</button>
          </form>
        </div>
      </section>`;

    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value.trim();
      const error = document.getElementById('login-error');
      error.classList.add('hidden');

      const result = await auth.login(email);
      if (!result.success) {
        error.textContent = result.error || 'ไม่สามารถเข้าสู่ระบบได้';
        error.classList.remove('hidden');
        return;
      }
      this.go('dashboard');
    });
  },

  escapeHtml(value) {
    const element = document.createElement('span');
    element.textContent = value || '';
    return element.innerHTML;
  }
};
