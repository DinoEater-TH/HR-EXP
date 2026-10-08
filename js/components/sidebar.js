// Sidebar Component

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  if (!auth.isAuthenticated()) {
    sidebar.innerHTML = '';
    return;
  }

  const isAdmin = auth.isAdmin();

  sidebar.innerHTML = `
    <nav class="sidebar-nav" aria-label="เมนูหลัก">
      <button class="sidebar-link" data-page="dashboard" type="button">🏠 แดชบอร์ด</button>
      <button class="sidebar-link" data-page="worklog" type="button">📝 บันทึกงาน</button>
      <button class="sidebar-link" data-page="problems" type="button">🔧 ปัญหาและวิธีแก้</button>
      <button class="sidebar-link" data-page="knowledge" type="button">📚 องค์ความรู้</button>
      ${isAdmin ? `
        <hr style="margin:var(--spacing-sm) 0;border-color:var(--border-color)">
        <button class="sidebar-link" data-page="knowledge" type="button">📚 จัดการองค์ความรู้</button>
        <button class="sidebar-link" data-page="admin-announcements" type="button">📢 จัดการประกาศ</button>
      ` : ''}
    </nav>`;

  sidebar.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      sidebar.classList.remove('open');
      router.go(btn.dataset.page);
    });
  });
}