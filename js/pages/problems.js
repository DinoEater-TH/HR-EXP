// Problems & Solutions Page

function renderProblemsPage() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="page-header">
      <h1 class="page-title">ปัญหาและวิธีแก้</h1>
      <div class="page-actions">
        <button class="btn btn-primary" id="new-problem-btn">+ บันทึกปัญหา</button>
      </div>
    </section>

    <section class="card mb-lg" id="problem-form-card" style="display:none">
      <h2 class="card-title">บันทึกปัญหาใหม่</h2>
      <div class="form-group">
        <label class="form-label required">ชื่อปัญหา</label>
        <input class="form-input" id="problem-title" placeholder="เช่น คอมพิวเตอร์ห้องประชุมเปิดไม่ติด">
      </div>
      <div class="form-group">
        <label class="form-label required">รายละเอียด</label>
        <textarea class="form-textarea" id="problem-desc" rows="3" placeholder="อธิบายปัญหาที่พบ"></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">หมวดหมู่</label>
          <select class="form-select" id="problem-category">
            <option value="IT Equipment">IT Equipment</option>
            <option value="HR Process">HR Process</option>
            <option value="Documentation">Documentation</option>
            <option value="Meeting">Meeting</option>
            <option value="Other" selected>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">ความรุนแรง</label>
          <select class="form-select" id="problem-severity">
            <option value="LOW">ต่ำ</option>
            <option value="MEDIUM" selected>ปานกลาง</option>
            <option value="HIGH">สูง</option>
            <option value="CRITICAL">วิกฤต</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">แนบลิงก์ (ถ้ามี)</label>
        <input class="form-input" id="problem-url" placeholder="https://...">
      </div>
      <div class="card-footer" style="border:none">
        <button class="btn btn-ghost" id="cancel-problem-btn">ยกเลิก</button>
        <button class="btn btn-primary" id="save-problem-btn">บันทึกปัญหา</button>
      </div>
    </section>

    <section class="card">
      <div class="card-header">
        <h2 class="card-title">รายการปัญหาของฉัน</h2>
        <select class="form-select" id="status-filter" style="width:auto">
          <option value="">ทุกสถานะ</option>
          <option value="OPEN">เปิดอยู่</option>
          <option value="IN_PROGRESS">กำลังดำเนินการ</option>
          <option value="RESOLVED">แก้ไขแล้ว</option>
          <option value="CLOSED">ปิดแล้ว</option>
        </select>
      </div>
      <div id="problems-list"><p>กำลังโหลด...</p></div>
    </section>`;

  document.getElementById('new-problem-btn').addEventListener('click', () => {
    document.getElementById('problem-form-card').style.display = 'block';
  });
  document.getElementById('cancel-problem-btn').addEventListener('click', () => {
    document.getElementById('problem-form-card').style.display = 'none';
  });
  document.getElementById('save-problem-btn').addEventListener('click', saveProblem);
  document.getElementById('status-filter').addEventListener('change', loadProblems);
  loadProblems();
}

async function saveProblem() {
  const title = document.getElementById('problem-title').value.trim();
  const description = document.getElementById('problem-desc').value.trim();
  if (!title || !description) {
    showToast('กรุณากรอกชื่อและรายละเอียดปัญหา', 'warning');
    return;
  }

  const btn = document.getElementById('save-problem-btn');
  btn.disabled = true;
  btn.textContent = 'กำลังบันทึก...';

  const result = await api.createProblem({
    title,
    description,
    category: document.getElementById('problem-category').value,
    severity: document.getElementById('problem-severity').value
  });

  if (result.success) {
    const url = document.getElementById('problem-url').value.trim();
    if (url && result.data && result.data.problemId) {
      await api.uploadAttachment({
        referenceType: 'PROBLEM',
        referenceId: result.data.problemId,
        url: url,
        fileName: url
      });
    }
    showToast('บันทึกปัญหาสำเร็จ', 'success');
    document.getElementById('problem-form-card').style.display = 'none';
    document.getElementById('problem-title').value = '';
    document.getElementById('problem-desc').value = '';
    document.getElementById('problem-url').value = '';
    loadProblems();
  } else {
    showToast(result.error || 'บันทึกไม่สำเร็จ', 'error');
  }
  btn.disabled = false;
  btn.textContent = 'บันทึกปัญหา';
}

async function loadProblems() {
  const container = document.getElementById('problems-list');
  if (!container) return;

  const status = document.getElementById('status-filter')?.value || '';
  const params = status ? { status } : {};
  const result = await api.listProblems(params);

  if (!result.success) {
    container.innerHTML = `<p class="form-error">${esc(result.error || 'โหลดไม่สำเร็จ')}</p>`;
    return;
  }

  const list = result.data || [];
  if (list.length === 0) {
    container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:var(--spacing-lg)">ยังไม่มีปัญหาที่บันทึก</p>';
    return;
  }

  let html = '';
  for (const p of list) {
    const st = Formatter.formatStatus('problem', p.status);
    const sev = Formatter.formatSeverity(p.severity);
    html += `
      <div class="list-item problem-card" style="flex-direction:column;align-items:stretch;gap:var(--spacing-sm)">
        <div style="display:flex;justify-content:space-between;gap:var(--spacing-sm);flex-wrap:wrap">
          <strong>${esc(p.title)}</strong>
          <div style="display:flex;gap:var(--spacing-xs)">
            <span class="badge ${sev.class.includes('green') ? 'badge-success' : sev.class.includes('red') ? 'badge-danger' : 'badge-warning'}">${esc(p.severity)}</span>
            <span class="badge badge-info">${esc(st.text)}</span>
          </div>
        </div>
        <p style="color:var(--text-secondary);font-size:var(--font-size-sm)">${esc(p.description)}</p>
        <p style="font-size:var(--font-size-xs);color:var(--text-tertiary)">Event: ${esc(p.eventId || '-')} · ${Formatter.formatTimeAgo(p.createdAt)}</p>
        <div id="solutions-${esc(p.problemId)}" class="solutions-box"></div>
        <div class="table-actions">
          ${p.status !== 'RESOLVED' && p.status !== 'CLOSED' ? `
            <button class="btn btn-sm btn-primary add-solution-btn" data-id="${esc(p.problemId)}" data-event="${esc(p.eventId || '')}">+ เสนอวิธีแก้</button>
            <button class="btn btn-sm btn-outline mark-progress-btn" data-id="${esc(p.problemId)}">กำลังดำเนินการ</button>
          ` : ''}
          ${p.status === 'RESOLVED' ? `<span class="badge badge-success">แก้ไขแล้ว</span>` : ''}
        </div>
        <div id="sol-form-${esc(p.problemId)}" class="hidden" style="margin-top:var(--spacing-sm)"></div>
      </div>`;
  }
  container.innerHTML = html;

  container.querySelectorAll('.add-solution-btn').forEach(btn => {
    btn.addEventListener('click', () => showSolutionForm(btn.dataset.id, btn.dataset.event));
  });
  container.querySelectorAll('.mark-progress-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const r = await api.updateProblem(btn.dataset.id, { status: 'IN_PROGRESS' });
      if (r.success) { showToast('อัปเดตสถานะแล้ว', 'success'); loadProblems(); }
      else showToast(r.error || 'อัปเดตไม่สำเร็จ', 'error');
    });
  });

  // โหลด solutions ของแต่ละ problem
  for (const p of list) {
    loadSolutionsForProblem(p.problemId);
  }
}

async function loadSolutionsForProblem(problemId) {
  const box = document.getElementById('solutions-' + problemId);
  if (!box) return;
  const result = await api.listSolutions({ problemId });
  if (!result.success || !result.data || result.data.length === 0) {
    box.innerHTML = '';
    return;
  }
  let html = '<div style="padding:var(--spacing-sm);background:var(--bg-secondary);border-radius:var(--border-radius)"><strong style="font-size:var(--font-size-sm)">💡 วิธีแก้</strong>';
  result.data.forEach(s => {
    const resultBadge = s.result === 'SUCCESS' ? 'badge-success' : s.result === 'FAILED' ? 'badge-danger' : 'badge-warning';
    html += `<div style="margin-top:var(--spacing-xs);font-size:var(--font-size-sm)">
      ${esc(s.description)}
      <span class="badge ${resultBadge}">${esc(s.result)}</span>
    </div>`;
  });
  html += '</div>';
  box.innerHTML = html;
}

function showSolutionForm(problemId, eventId) {
  const form = document.getElementById('sol-form-' + problemId);
  if (!form) return;
  form.classList.remove('hidden');
  form.innerHTML = `
    <div class="form-group">
      <label class="form-label required">วิธีแก้ปัญหา</label>
      <textarea class="form-textarea" id="sol-desc-${problemId}" rows="2" placeholder="อธิบายวิธีที่แก้"></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">ผลลัพธ์</label>
      <select class="form-select" id="sol-result-${problemId}">
        <option value="SUCCESS">สำเร็จ</option>
        <option value="PARTIAL">สำเร็จบางส่วน</option>
        <option value="FAILED">ไม่สำเร็จ</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">แนบลิงก์ (ถ้ามี)</label>
      <input class="form-input" id="sol-url-${problemId}" placeholder="https://...">
    </div>
    <div style="display:flex;gap:var(--spacing-sm)">
      <button class="btn btn-primary btn-sm" id="save-sol-${problemId}">บันทึกวิธีแก้</button>
      <button class="btn btn-ghost btn-sm" id="cancel-sol-${problemId}">ยกเลิก</button>
    </div>`;

  document.getElementById('cancel-sol-' + problemId).addEventListener('click', () => {
    form.classList.add('hidden');
    form.innerHTML = '';
  });
  document.getElementById('save-sol-' + problemId).addEventListener('click', async () => {
    const description = document.getElementById('sol-desc-' + problemId).value.trim();
    if (!description) {
      showToast('กรุณากรอกวิธีแก้', 'warning');
      return;
    }
    const result = await api.createSolution({
      problemId,
      eventId: eventId || undefined,
      description,
      result: document.getElementById('sol-result-' + problemId).value
    });
    if (result.success) {
      const url = document.getElementById('sol-url-' + problemId).value.trim();
      if (url && result.data && result.data.solutionId) {
        await api.uploadAttachment({
          referenceType: 'SOLUTION',
          referenceId: result.data.solutionId,
          url,
          fileName: url
        });
      }
      showToast('บันทึกวิธีแก้สำเร็จ', 'success');
      loadProblems();
    } else {
      showToast(result.error || 'บันทึกไม่สำเร็จ', 'error');
    }
  });
}

function esc(val) {
  const el = document.createElement('span');
  el.textContent = val || '';
  return el.innerHTML;
}