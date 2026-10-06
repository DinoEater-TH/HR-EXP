// Application Entry Point

function showToast(message, type) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type || 'info'}`;
  toast.textContent = message;
  container.appendChild(toast);
  window.setTimeout(() => toast.remove(), 4000);
}

async function initializeApp() {
  const loading = document.getElementById('loading-screen');
  const app = document.getElementById('app');

  const health = await api.healthCheck();
  if (!health.success) {
    showToast('ไม่สามารถเชื่อมต่อ Backend ได้', 'error');
  }

  const authed = auth.loadSession();
  renderHeader();
  renderSidebar();

  if (authed) {
    announcementManager.run(() => {
      renderHeader();
      renderSidebar();
      router.render('dashboard');
      loading.classList.add('hidden');
      app.classList.remove('hidden');
    });
  } else {
    router.render('login');
    loading.classList.add('hidden');
    app.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);