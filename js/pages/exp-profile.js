// EXP & Level Profile Page

function renderExpProfilePage() {
  const main = document.getElementById('main-content');
  main.innerHTML = '<p style="padding:var(--spacing-xl);text-align:center">กำลังโหลดข้อมูล...</p>';
  loadExpProfile();
}

async function loadExpProfile() {
  const main = document.getElementById('main-content');
  
  const [expBal, levelRes, expHist] = await Promise.all([
    api.getExpBalance(),
    api.getCurrentLevel(),
    api.getExpHistory()
  ]);

  const totalExp = (expBal.success && expBal.data) ? expBal.data.totalExp : 0;
  const level = (levelRes.success && levelRes.data) ? levelRes.data : { level: {levelId:'LV-01',levelName:'ผู้เริ่มต้น',badge:'🌱'}, totalExp:0, nextLevel: {levelId:'LV-02',minExp:50,levelName:'ผู้เรียนรู้',badge:'📖'}, progress:0 };
  const history = (expHist.success && expHist.data) ? expHist.data : [];

  const currentLevel = level.level || {levelId:'LV-01',levelName:'ผู้เริ่มต้น',badge:'🌱'};
  const nextLevel = level.nextLevel && level.nextLevel.levelId ? level.nextLevel : null;
  const progress = typeof level.progress === 'number' ? level.progress : 0;
  const neededExp = nextLevel ? (nextLevel.minExp - totalExp) : 0;

  main.innerHTML = `
    <section class="page-header">
      <h1 class="page-title">EXP & Level</h1>
    </section>

    <!-- Level Card -->
    <section class="card mb-lg" style="text-align:center">
      <div style="font-size:64px">${esc(currentLevel.badge)}</div>
      <h2 style="font-size:var(--font-size-3xl);margin:var(--spacing-sm) 0">${esc(currentLevel.levelName)}</h2>
      <p style="color:var(--text-secondary)">Level: ${esc(currentLevel.levelId)}</p>
      
      ${nextLevel ? `
        <div style="background:var(--bg-tertiary);border-radius:var(--border-radius-full);height:12px;margin:var(--spacing-md) auto;max-width:400px;overflow:hidden">
          <div style="background:var(--color-primary);height:100%;width:${Math.min(progress,100)}%;border-radius:var(--border-radius-full);transition:width 0.5s"></div>
        </div>
        <p style="font-size:var(--font-size-sm);color:var(--text-secondary)">
          ${totalExp} / ${nextLevel.minExp} EXP → ถัดไป: ${esc(nextLevel.badge)} ${esc(nextLevel.levelName)} (เหลือ ${neededExp} EXP)
        </p>
      ` : `
        <p style="font-size:var(--font-size-sm);color:var(--color-success);font-weight:bold">ถึงระดับสูงสุดแล้ว!</p>
      `}
    </section>

    <!-- EXP Balance -->
    <section class="stats-grid mb-lg">
      <article class="stats-card">
        <p class="stats-label">EXP สะสมทั้งหมด</p>
        <p class="stats-value" style="color:var(--color-secondary)">${totalExp}</p>
      </article>
      <article class="stats-card">
        <p class="stats-label">Level ปัจจุบัน</p>
        <p class="stats-value">${esc(currentLevel.badge)} ${esc(currentLevel.levelId)}</p>
      </article>
      <article class="stats-card">
        <p class="stats-label">EXP ล่าสุด</p>
        <p class="stats-value" style="font-size:var(--font-size-base);color:var(--text-secondary)">
          ${history.length > 0 ? ('+' + history[0].amount + ' EXP (' + history[0].activity + ')') : 'ไม่มีข้อมูล'}
        </p>
      </article>
    </section>

    <!-- EXP History -->
    <section class="card">
      <h2 class="card-title">ประวัติการรับ EXP</h2>
      <div class="exp-history-table">
        ${renderExpHistory(history)}
      </div>
    </section>
  `;
}

function renderExpHistory(history) {
  if (!history || history.length === 0) {
    return '<p style="text-align:center;padding:var(--spacing-lg);color:var(--text-secondary)">ยังไม่มีประวัติการรับ EXP</p>';
  }

  let html = '<table class="table"><thead><tr><th>กิจกรรม</th><th>รายละเอียด</th><th>EXP</th><th>วันที่</th></tr></thead><tbody>';

  history.forEach(h => {
    const activityMap = {
      CREATE_WORK_LOG: 'บันทึกงาน',
      CREATE_PROBLEM: 'บันทึกปัญหา',
      CREATE_SOLUTION: 'เสนอวิธีแก้',
      SOLUTION_RESOLVED: 'ปัญหาได้รับการแก้ไข',
      FEEDBACK_HELPFUL: 'ได้รับ Feedback',
      KNOWLEDGE_APPROVED: 'ความรู้ได้รับการอนุมัติ'
    };
    const activityText = activityMap[h.activity] || h.activity;
    const colorClass = h.amount > 0 ? 'badge-success' : 'badge-danger';

    html += `<tr>
      <td><span class="badge ${colorClass}">${esc(activityText)}</span></td>
      <td style="font-size:var(--font-size-sm)">${esc(h.description || '-')}</td>
      <td style="font-weight:bold;color:var(--color-primary)">+${h.amount} EXP</td>
      <td style="font-size:var(--font-size-xs);color:var(--text-tertiary)">${Formatter.formatDate(h.createdAt, 'YYYY-MM-DD HH:mm:ss')}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  return html;
}