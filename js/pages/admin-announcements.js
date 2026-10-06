// Admin Announcements Page

function renderAdminAnnouncements() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="page-header">
      <h1 class="page-title">จัดการประกาศ</h1>
      <div class="page-actions">
        <button class="btn btn-primary" id="create-ann-btn">สร้างประกาศใหม่</button>
      </div>
    </section>

    <section class="card">
      <h2 class="card-title">รายการประกาศทั้งหมด</h2>
      <div id="ann-table-container">
        <p>กำลังโหลด...</p>
      </div>
    </section>`;

  document.getElementById('create-ann-btn').addEventListener('click', () => showAnnouncementForm());
  loadAnnouncementTable();
}

async function loadAnnouncementTable() {
  const container = document.getElementById('ann-table-container');
  if (!container) return;

  try {
    const result = await api.listAnnouncements();
    if (!result.success) {
      container.innerHTML = '<p class="error">ไม่สามารถโหลดรายการประกาศได้</p>';
      return;
    }

    const list = result.data || [];
    if (list.length === 0) {
      container.innerHTML = '<p>ยังไม่มีประกาศ</p>';
      return;
    }

    let html = '<table class="table"><thead><tr>';
    html += '<th>หัวข้อ</th><th>ประเภท</th><th>สถานะ</th><th>บังคับรับทราบ</th><th>วันที่สร้าง</th><th>จัดการ</th>';
    html += '</tr></thead><tbody>';

    list.forEach(ann => {
      const statusInfo = Formatter.formatStatus('announcement', ann.status);
      const typeText = ann.type === 'REQUIRED_ACKNOWLEDGEMENT' ? 'บังคับรับทราบ' : 'ทั่วไป';
      html += `<tr>
        <td>${esc(ann.title)}</td>
        <td><span class="badge ${ann.type === 'REQUIRED_ACKNOWLEDGEMENT' ? 'badge-danger' : 'badge-info'}">${typeText}</span></td>
        <td><span class="badge" style="background:${statusInfo.class.split(' ')[0]};color:${statusInfo.class.split(' ')[1]}">${statusInfo.text}</span></td>
        <td>${ann.requiredAcknowledgement ? 'ใช่' : 'ไม่'}</td>
        <td>${Formatter.formatTimeAgo(ann.createdAt)}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-outline edit-ann" data-id="${esc(ann.announcementId)}">แก้ไข</button>
          ${ann.status === 'DRAFT' ? `<button class="btn btn-sm btn-primary publish-ann" data-id="${esc(ann.announcementId)}">เผยแพร่</button>` : ''}
          ${ann.status === 'PUBLISHED' ? `<button class="btn btn-sm btn-secondary archive-ann" data-id="${esc(ann.announcementId)}">เก็บถาวร</button>` : ''}
          <button class="btn btn-sm btn-outline status-ann" data-id="${esc(ann.announcementId)}">ดูสถิติ</button>
        </td>
      </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    container.querySelectorAll('.edit-ann').forEach(btn => {
      btn.addEventListener('click', () => showAnnouncementForm(btn.dataset.id));
    });
    container.querySelectorAll('.publish-ann').forEach(btn => {
      btn.addEventListener('click', () => publishAnnouncement(btn.dataset.id));
    });
    container.querySelectorAll('.archive-ann').forEach(btn => {
      btn.addEventListener('click', () => archiveAnnouncement(btn.dataset.id));
    });
    container.querySelectorAll('.status-ann').forEach(btn => {
      btn.addEventListener('click', () => showAnnouncementStatus(btn.dataset.id));
    });
  } catch (e) {
    container.innerHTML = '<p class="error">เกิดข้อผิดพลาด</p>';
  }
}

function showAnnouncementForm(id) {
  const main = document.getElementById('main-content');
  const isEdit = !!id;
  let annData = { title: '', content: '', type: 'NORMAL', priority: 'MEDIUM', requiredAcknowledgement: false, startDate: '', endDate: '' };

  if (isEdit) {
    showToast('กำลังโหลด...', 'info');
    return;
  }

  main.innerHTML = `
    <section class="page-header">
      <h1 class="page-title">${isEdit ? 'แก้ไขประกาศ' : 'สร้างประกาศใหม่'}</h1>
      <button class="btn btn-ghost" id="back-to-list-btn">กลับ</button>
    </section>
    <section class="card">
      <div class="form-group">
        <label class="form-label required" for="ann-title">หัวข้อ</label>
        <input class="form-input" id="ann-title" value="${esc(annData.title)}" maxlength="200">
      </div>
      <div class="form-group">
        <label class="form-label required" for="ann-content">เนื้อหา</label>
        <textarea class="form-textarea" id="ann-content" rows="8">${esc(annData.content)}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label" for="ann-type">ประเภท</label>
        <select class="form-select" id="ann-type">
          <option value="NORMAL" ${annData.type === 'NORMAL' ? 'selected' : ''}>ทั่วไป</option>
          <option value="REQUIRED_ACKNOWLEDGEMENT" ${annData.type === 'REQUIRED_ACKNOWLEDGEMENT' ? 'selected' : ''}>บังคับรับทราบ</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="ann-priority">ความสำคัญ</label>
        <select class="form-select" id="ann-priority">
          <option value="LOW">ต่ำ</option>
          <option value="MEDIUM" selected>ปานกลาง</option>
          <option value="HIGH">สูง</option>
          <option value="URGENT">ด่วน</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="ann-start-date">วันที่เริ่ม</label>
          <input class="form-input" id="ann-start-date" type="date" value="${annData.startDate}">
        </div>
        <div class="form-group">
          <label class="form-label" for="ann-end-date">วันที่สิ้นสุด</label>
          <input class="form-input" id="ann-end-date" type="date" value="${annData.endDate}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-checkbox">
          <input type="checkbox" id="ann-required-ack" ${annData.requiredAcknowledgement ? 'checked' : ''}>
          จำเป็นต้องรับทราบ
        </label>
      </div>
      <div class="card-footer" style="border:none;padding-top:var(--spacing-md)">
        <p id="form-error" class="form-error hidden" role="alert"></p>
        <button class="btn btn-primary" id="save-ann-btn">บันทึกเป็นร่าง</button>
        <button class="btn btn-secondary" id="publish-ann-btn">เผยแพร่ทันที</button>
      </div>
    </section>`;

  document.getElementById('back-to-list-btn').addEventListener('click', () => renderAdminAnnouncements());

  const doSave = async (status) => {
    const error = document.getElementById('form-error');
    error.classList.add('hidden');
    const title = document.getElementById('ann-title').value.trim();
    const content = document.getElementById('ann-content').value.trim();
    if (!title) { error.textContent = 'กรุณากรอกหัวข้อ'; error.classList.remove('hidden'); return; }
    if (!content) { error.textContent = 'กรุณากรอกเนื้อหา'; error.classList.remove('hidden'); return; }

    const data = {
      title, content,
      type: document.getElementById('ann-type').value,
      priority: document.getElementById('ann-priority').value,
      requiredAcknowledgement: document.getElementById('ann-required-ack').checked,
      startDate: document.getElementById('ann-start-date').value,
      endDate: document.getElementById('ann-end-date').value,
      status: status
    };

    const result = isEdit
      ? await api.post('announcement.update', { id: annData.announcementId, ...data })
      : await api.createAnnouncement(data);

    if (result.success) {
      showToast('บันทึกสำเร็จ', 'success');
      renderAdminAnnouncements();
    } else {
      error.textContent = result.error || 'เกิดข้อผิดพลาด';
      error.classList.remove('hidden');
    }
  };

  document.getElementById('save-ann-btn').addEventListener('click', () => doSave('DRAFT'));
  document.getElementById('publish-ann-btn').addEventListener('click', () => doSave('PUBLISHED'));
}

async function publishAnnouncement(id) {
  const result = await api.post('announcement.update', { id, status: 'PUBLISHED' });
  if (result.success) { showToast('เผยแพร่แล้ว', 'success'); loadAnnouncementTable(); }
  else { showToast(result.error || 'เกิดข้อผิดพลาด', 'error'); }
}

async function archiveAnnouncement(id) {
  const result = await api.post('announcement.update', { id, status: 'ARCHIVED' });
  if (result.success) { showToast('เก็บถาวรแล้ว', 'success'); loadAnnouncementTable(); }
  else { showToast(result.error || 'เกิดข้อผิดพลาด', 'error'); }
}

async function showAnnouncementStatus(id) {
  const result = await api.getAnnouncementStatus(id);
  if (!result.success) { showToast(result.error, 'error'); return; }

  const d = result.data;
  let html = `<div class="modal" role="dialog"><div class="card-header"><h3 class="card-title">สถานะ: ${esc(d.title)}</h3></div>`;
  html += `<div class="card-body">
    <div class="stats-grid">
      <div class="stats-card"><p class="stats-label">รับทราบแล้ว</p><p class="stats-value">${d.acknowledgedCount}/${d.totalUsers}</p></div>
      <div class="stats-card"><p class="stats-label">ยังไม่รับทราบ</p><p class="stats-value">${d.pendingCount}</p></div>
    </div>`;
  html += `<p><strong>รับทราบแล้ว:</strong> ${d.acknowledged.map(u => u.displayName).join(', ') || 'ไม่มี'}</p>`;
  html += `<p><strong>ยังไม่รับทราบ:</strong> ${d.pending.map(u => u.displayName).join(', ') || 'ไม่มี'}</p>`;
  html += `</div><div class="card-footer"><button class="btn btn-primary" id="close-status-btn">ปิด</button></div></div>`;

  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = html;
  modalContainer.classList.add('open');
  document.getElementById('close-status-btn').addEventListener('click', () => modalContainer.classList.remove('open'));
}

function esc(val) {
  const el = document.createElement('span');
  el.textContent = val || '';
  return el.innerHTML;
}