// Sidebar Component

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  if (!auth.isAuthenticated()) {
    sidebar.innerHTML = '';
    return;
  }

  sidebar.innerHTML = `
    <nav class="sidebar-nav" aria-label="เมนูหลัก">
      <button class="sidebar-link" data-page="dashboard" type="button">🏠 แดชบอร์ด</button>
      <button class="sidebar-link" type="button" disabled>📝 บันทึกงาน <span>เร็ว ๆ นี้</span></button>
      <button class="sidebar-link" type="button" disabled>📚 องค์ความรู้ <span>เร็ว ๆ นี้</span></button>
    </nav>`;

  const dashboard = sidebar.querySelector('[data-page="dashboard"]');
  dashboard.addEventListener('click', () => {
    sidebar.classList.remove('open');
    router.go('dashboard');
  });
}
