// Header Component

function renderHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const user = auth.getUser();
  header.innerHTML = `
    <div class="header-inner">
      <button class="btn btn-ghost btn-sm" id="menu-toggle" type="button" aria-label="เปิดเมนู">☰</button>
      <button class="brand" id="home-link" type="button">HR KKU EXP</button>
      <div class="header-actions">
        ${user ? `<span class="header-user">${user.displayName || user.email}</span><button class="btn btn-outline btn-sm" id="logout-button" type="button">ออกจากระบบ</button>` : ''}
      </div>
    </div>`;

  document.getElementById('home-link').addEventListener('click', () => router.go('dashboard'));
  document.getElementById('menu-toggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await auth.logout();
      renderHeader();
      renderSidebar();
      router.go('login');
    });
  }
}
