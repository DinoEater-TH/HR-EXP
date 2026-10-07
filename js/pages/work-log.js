// Work Log Page

let aiPreviewData = null;

function renderWorkLogPage() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="page-header">
      <h1 class="page-title">บันทึกงาน</h1>
    </section>

    <section class="card">
      <div id="worklog-input-section">
        <div class="form-group">
          <label class="form-label" for="log-date">วันที่</label>
          <input class="form-input" id="log-date" type="date" value="${todayStr()}">
        </div>
        <div class="form-group">
          <label class="form-label required" for="worklog-text">วันนี้คุณทำอะไรบ้าง?</label>
          <textarea class="form-textarea" id="worklog-text" rows="5" placeholder="พิมพ์ด้วยภาษาธรรมชาติ เช่น: วันนี้จัดทำโปสเตอร์ประชาสัมพันธ์งาน Town Hall และแก้ไขรูปภาพให้เหมาะกับจอ Projector"></textarea>
          <p class="form-help">พิมพ์สิ่งที่คุณทำวันนี้ได้เลย ระบบจะช่วยวิเคราะห์ให้</p>
        </div>
        <button class="btn btn-primary" id="analyze-btn">🔍 วิเคราะห์</button>
      </div>
      <div id="ai-preview-section" class="hidden"></div>
      <div id="success-section" class="hidden"></div>
    </section>

    <section class="card mt-lg">
      <div class="card-header">
        <h2 class="card-title">ประวัติการบันทึก</h2>
      </div>
      <div id="worklog-list"><p>กำลังโหลด...</p></div>
    </section>`;

  document.getElementById('analyze-btn').addEventListener('click', analyzeAndPreview);
  loadWorkLogList();
}

async function analyzeAndPreview() {
  const text = document.getElementById('worklog-text').value.trim();
  if (!text) {
    showToast('กรุณาพิมพ์สิ่งที่ทำในวันนี้', 'warning');
    return;
  }

  document.getElementById('analyze-btn').disabled = true;
  document.getElementById('analyze-btn').textContent = 'กำลังวิเคราะห์...';

  const result = await api.classifyText(text);
  document.getElementById('analyze-btn').disabled = false;
  document.getElementById('analyze-btn').textContent = '🔍 วิเคราะห์อีกครั้ง';

  if (!result.success) {
    showToast('วิเคราะห์ไม่สำเร็จ', 'error');
    return;
  }

  aiPreviewData = result.data;
  showAIPreview(aiPreviewData);
}

function showAIPreview(data) {
  const section = document.getElementById('ai-preview-section');
  const items = data.items || [];
  const problems = data.problems || [];
  const solutions = data.solutions || [];

  let html = `<div class="card-header"><h3 class="card-title">ผลการวิเคราะห์</h3><span class="badge badge-primary">${data.classification}</span></div>`;

  if (items.length > 0) {
    html += `<h4 style="margin-top:var(--spacing-md)">📝 งานที่ตรวจพบ</h4>`;
    items.forEach((item, i) => {
      html += `<div class="list-item" style="justify-content:space-between">
        <span>${esc(item.description)}</span>
        <button class="btn btn-sm btn-ghost edit-item-btn" data-type="WORK" data-index="${i}">แก้ไข</button>
      </div>`;
    });
  }

  if (problems.length > 0) {
    html += `<h4 style="margin-top:var(--spacing-md)">⚠️ ปัญหาที่ตรวจพบ</h4>`;
    problems.forEach((p, i) => {
      html += `<div class="list-item" style="justify-content:space-between">
        <span>${esc(p.title || p.description)}</span>
        <button class="btn btn-sm btn-ghost edit-item-btn" data-type="PROBLEM" data-index="${i}">แก้ไข</button>
      </div>`;
    });
  }

  if (solutions.length > 0) {
    html += `<h4 style="margin-top:var(--spacing-md)">💡 วิธีแก้ที่ตรวจพบ</h4>`;
    solutions.forEach((s, i) => {
      html += `<div class="list-item" style="justify-content:space-between">
        <span>${esc(s.description)}</span>
        <button class="btn btn-sm btn-ghost edit-item-btn" data-type="SOLUTION" data-index="${i}">แก้ไข</button>
      </div>`;
    });
  }

  html += `<div class="card-footer">
    <button class="btn btn-primary btn-lg" id="confirm-btn">✓ ยืนยันและบันทึก</button>
  </div>`;

  section.innerHTML = html;
  section.classList.remove('hidden');

  document.getElementById('confirm-btn').addEventListener('click', confirmAndSave);
}

async function confirmAndSave() {
  const rawInput = document.getElementById('worklog-text').value.trim();
  const logDate = document.getElementById('log-date').value;
  document.getElementById('confirm-btn').disabled = true;
  document.getElementById('confirm-btn').textContent = 'กำลังบันทึก...';

  const result = await api.createWorkLog({
    rawInput: rawInput,
    logDate: logDate,
    confirmedItems: aiPreviewData
  });

  if (result.success) {
    showToast('บันทึกสำเร็จ!', 'success');
    document.getElementById('worklog-input-section').classList.add('hidden');
    document.getElementById('ai-preview-section').classList.add('hidden');
    const success = document.getElementById('success-section');
    success.classList.remove('hidden');
    success.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">✅</div>
        <h3 class="empty-state-title">บันทึกสำเร็จ</h3>
        <button class="btn btn-primary mt-md" id="new-worklog-btn">บันทึกงานใหม่</button>
      </div>`;
    document.getElementById('new-worklog-btn').addEventListener('click', () => {
      renderWorkLogPage();
    });
    loadWorkLogList();
  } else {
    showToast(result.error || 'บันทึกไม่สำเร็จ', 'error');
    document.getElementById('confirm-btn').disabled = false;
    document.getElementById('confirm-btn').textContent = '✓ ยืนยันและบันทึก';
  }
}

async function loadWorkLogList() {
  const container = document.getElementById('worklog-list');
  if (!container) return;

  try {
    const result = await api.listWorkLogs();
    if (!result.success || !result.data || result.data.length === 0) {
      container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:var(--spacing-lg)">ยังไม่มีบันทึกงาน</p>';
      return;
    }

    let html = '';
    result.data.forEach(wl => {
      const dateStr = wl.logDate ? new Date(wl.logDate).toLocaleDateString('th-TH', {year:'numeric',month:'long',day:'numeric'}) : '-';
      const content = (wl.aiResult && wl.aiResult.items) ? wl.aiResult.items.map(i => i.description).join('<br>') : wl.rawInput;
      html += `<div class="list-item" style="flex-direction:column;align-items:flex-start">
        <div style="display:flex;justify-content:space-between;width:100%">
          <span class="badge badge-primary">${wl.classification}</span>
          <span style="font-size:var(--font-size-xs);color:var(--text-tertiary)">${dateStr}</span>
        </div>
        <p style="margin-top:var(--spacing-xs)">${esc(content.substring(0, 200))}</p>
      </div>`;
    });

    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<p class="error">โหลดไม่สำเร็จ</p>';
  }
}

function todayStr() {
  return new Date().toISOString().substring(0, 10);
}

function esc(val) {
  const el = document.createElement('span');
  el.textContent = val || '';
  return el.innerHTML;
}