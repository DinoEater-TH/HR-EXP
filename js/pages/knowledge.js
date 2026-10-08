// Knowledge Base Page

let currentKnowledgeId = null;

function renderKnowledgePage(initialKnowledgeId) {
  currentKnowledgeId = initialKnowledgeId || null;
  const main = document.getElementById('main-content');
  
  if (currentKnowledgeId) {
    renderKnowledgeDetail(currentKnowledgeId);
    return;
  }
  
  main.innerHTML = `
    <section class="page-header">
      <h1 class="page-title">คลังความรู้ (Knowledge Base)</h1>
      <div class="page-actions">
        <button class="btn btn-primary" id="new-kb-btn">+ สร้างองค์ความรู้</button>
      </div>
    </section>

    <!-- ฟอร์มสร้างความรู้ใหม่ -->
    <section class="card mb-lg" id="kb-form-card" style="display:none">
      <h2 class="card-title">สร้างองค์ความรู้ใหม่</h2>
      <div class="form-group">
        <label class="form-label required">หัวข้อองค์ความรู้</label>
        <input class="form-input" id="kb-title" placeholder="เช่น วิธีตรวจสอบและแก้ไขคอมพิวเตอร์เปิดไม่ติด">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">หมวดหมู่</label>
          <select class="form-select" id="kb-category">
            <option value="IT Equipment">IT Equipment</option>
            <option value="HR Process">HR Process</option>
            <option value="Documentation">Documentation</option>
            <option value="Meeting">Meeting</option>
            <option value="Other" selected>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">แท็ก (คั่นด้วยจุลภาค ,)</label>
          <input class="form-input" id="kb-tags" placeholder="computer, powersupply, hardware">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label required">เนื้อหา / ขั้นตอนการทำงาน</label>
        <textarea class="form-textarea" id="kb-content" rows="6" placeholder="ระบุขั้นตอนการทำงาน หรือวิธีแก้ปัญหาอย่างละเอียด..."></textarea>
      </div>
      <div class="card-footer" style="border:none">
        <button class="btn btn-ghost" id="cancel-kb-btn">ยกเลิก</button>
        <button class="btn btn-primary" id="save-kb-btn">บันทึกองค์ความรู้</button>
      </div>
    </section>

    <!-- ค้นหา & ตัวกรอง -->
    <section class="card mb-lg">
      <div class="form-row">
        <div class="form-group" style="flex:2">
          <input class="form-input" id="search-query" placeholder="🔍 พิมพ์คำค้นหา เช่น คอมพิวเตอร์, เอกสาร...">
        </div>
        <div class="form-group">
          <select class="form-select" id="filter-category">
            <option value="">ทุกหมวดหมู่</option>
            <option value="IT Equipment">IT Equipment</option>
            <option value="HR Process">HR Process</option>
            <option value="Documentation">Documentation</option>
            <option value="Meeting">Meeting</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group" style="flex:0">
          <button class="btn btn-outline" id="btn-search-kb">ค้นหา</button>
        </div>
      </div>
    </section>

    <!-- รายการความรู้ -->
    <section class="card">
      <div class="card-header">
        <h2 class="card-title">รายการองค์ความรู้</h2>
        <span id="kb-count" class="badge badge-info">0 รายการ</span>
      </div>
      <div id="kb-list"><p>กำลังโหลด...</p></div>
    </section>
  `;

  document.getElementById('new-kb-btn').addEventListener('click', () => {
    document.getElementById('kb-form-card').style.display = 'block';
  });
  document.getElementById('cancel-kb-btn').addEventListener('click', () => {
    document.getElementById('kb-form-card').style.display = 'none';
  });
  document.getElementById('save-kb-btn').addEventListener('click', saveKnowledge);
  document.getElementById('btn-search-kb').addEventListener('click', searchKnowledge);
  document.getElementById('search-query').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchKnowledge();
  });
  document.getElementById('filter-category').addEventListener('change', searchKnowledge);

  loadKnowledgeList();
}

async function loadKnowledgeList() {
  const container = document.getElementById('kb-list');
  if (!container) return;

  const result = await api.listKnowledge();
  renderKnowledgeCards(result, container);
}

async function searchKnowledge() {
  const container = document.getElementById('kb-list');
  if (!container) return;
  container.innerHTML = '<p>กำลังค้นหา...</p>';

  const query = document.getElementById('search-query').value.trim();
  const category = document.getElementById('filter-category').value;

  const result = await api.searchKnowledge(query, { category });
  renderKnowledgeCards(result, container);
}

function renderKnowledgeCards(result, container) {
  if (!result.success) {
    container.innerHTML = `<p class="form-error">${esc(result.error || 'เกิดข้อผิดพลาดในการโหลด')}</p>`;
    return;
  }

  const list = result.data || [];
  const countBadge = document.getElementById('kb-count');
  if (countBadge) countBadge.textContent = `${list.length} รายการ`;

  if (list.length === 0) {
    container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:var(--spacing-lg)">ไม่พบองค์ความรู้ที่ค้นหา</p>';
    return;
  }

  const isAdmin = auth.isAdmin();

  let html = '';
  list.forEach(k => {
    const statusBadge = k.status === 'PUBLISHED' ? 'badge-success' : 'badge-warning';
    const statusText = k.status === 'PUBLISHED' ? 'เผยแพร่แล้ว' : 'ร่าง/รออนุมัติ';
    const tagBadges = (k.tags || []).map(t => `<span class="badge" style="background:var(--bg-tertiary);margin-right:4px">#${esc(t)}</span>`).join('');

    html += `
      <div class="list-item" style="flex-direction:column;align-items:stretch;gap:var(--spacing-sm);cursor:pointer" onclick="openKnowledgeDetail('${esc(k.knowledgeId)}')">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--spacing-sm)">
          <strong style="font-size:var(--font-size-lg);color:var(--color-primary)">${esc(k.title)}</strong>
          <div style="display:flex;gap:var(--spacing-xs)">
            <span class="badge badge-primary">${esc(k.category)}</span>
            <span class="badge ${statusBadge}">${statusText}</span>
          </div>
        </div>
        <p style="color:var(--text-secondary);font-size:var(--font-size-sm);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
          ${esc(k.content)}
        </p>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:var(--font-size-xs);color:var(--text-tertiary);margin-top:var(--spacing-xs)">
          <div>${tagBadges}</div>
          <div>
            <span>👁️ ${k.viewCount || 0}</span> · 
            <span>👍 ${k.feedbackCount || 0}</span> · 
            <span>${Formatter.formatTimeAgo(k.updatedAt || k.createdAt)}</span>
          </div>
        </div>
        ${isAdmin && k.status === 'DRAFT' ? `
          <div style="margin-top:var(--spacing-xs)" onclick="event.stopPropagation()">
            <button class="btn btn-sm btn-secondary" onclick="publishKnowledge('${esc(k.knowledgeId)}')">✓ อนุมัติและเผยแพร่</button>
          </div>
        ` : ''}
      </div>
    `;
  });

  container.innerHTML = html;
}

window.openKnowledgeDetail = function(id) {
  router.go(`knowledge?id=${id}`);
};

async function publishKnowledge(id) {
  const result = await api.post('knowledge.publish', { id });
  if (result.success) {
    showToast('เผยแพร่องค์ความรู้สำเร็จ', 'success');
    loadKnowledgeList();
  } else {
    showToast(result.error || 'เผยแพร่ไม่สำเร็จ', 'error');
  }
}

async function saveKnowledge() {
  const title = document.getElementById('kb-title').value.trim();
  const content = document.getElementById('kb-content').value.trim();
  const category = document.getElementById('kb-category').value;
  const tags = document.getElementById('kb-tags').value.trim();

  if (!title || !content) {
    showToast('กรุณากรอกหัวข้อและเนื้อหา', 'warning');
    return;
  }

  const btn = document.getElementById('save-kb-btn');
  btn.disabled = true;
  btn.textContent = 'กำลังบันทึก...';

  const result = await api.createKnowledge({
    title,
    content,
    category,
    tags,
    isDirectCreate: true
  });

  if (result.success) {
    showToast('บันทึกองค์ความรู้เรียบร้อย (รออนุมัติ)', 'success');
    document.getElementById('kb-form-card').style.display = 'none';
    document.getElementById('kb-title').value = '';
    document.getElementById('kb-content').value = '';
    document.getElementById('kb-tags').value = '';
    loadKnowledgeList();
  } else {
    showToast(result.error || 'บันทึกไม่สำเร็จ', 'error');
  }

  btn.disabled = false;
  btn.textContent = 'บันทึกองค์ความรู้';
}

// หน้ารายละเอียด Knowledge Detail & Feedback
async function renderKnowledgeDetail(knowledgeId) {
  const main = document.getElementById('main-content');
  main.innerHTML = `<p style="padding:var(--spacing-xl);text-align:center">กำลังโหลดองค์ความรู้...</p>`;

  const result = await api.getKnowledge(knowledgeId);
  if (!result.success || !result.data) {
    main.innerHTML = `
      <section class="card">
        <p class="form-error">ไม่พบข้อมูลองค์ความรู้ หรือคุณไม่มีสิทธิ์เข้าถึง</p>
        <button class="btn btn-outline mt-md" onclick="router.go('knowledge')">← กลับไปหน้ารวม</button>
      </section>
    `;
    return;
  }

  const k = result.data;
  const tagHtml = (k.tags || []).map(t => `<span class="badge" style="background:var(--bg-tertiary);margin-right:4px">#${esc(t)}</span>`).join('');

  main.innerHTML = `
    <section class="page-header">
      <div>
        <button class="btn btn-ghost btn-sm mb-sm" onclick="router.go('knowledge')">← กลับไปคลังความรู้</button>
        <h1 class="page-title">${esc(k.title)}</h1>
      </div>
      <div class="page-actions">
        <span class="badge badge-primary">${esc(k.category)}</span>
      </div>
    </section>

    <section class="card mb-lg">
      <div style="font-size:var(--font-size-xs);color:var(--text-tertiary);margin-bottom:var(--spacing-md)">
        <span>อัปเดตเมื่อ: ${Formatter.formatDate(k.updatedAt || k.createdAt, 'YYYY-MM-DD HH:mm:ss')}</span> · 
        <span>👁️ รับชม ${k.viewCount || 0} ครั้ง</span>
        ${k.ownerId ? ` · <span>เจ้าของ: ${esc(k.ownerId)}</span>` : ''}
      </div>

      <div style="line-height:1.75;white-space:pre-wrap;font-size:var(--font-size-base)">${esc(k.content)}</div>

      <div style="margin-top:var(--spacing-lg);padding-top:var(--spacing-md);border-top:1px solid var(--border-color)">
        ${tagHtml}
      </div>
    </section>

    <!-- กล่อง Feedback -->
    <section class="card mb-lg">
      <h3 class="card-title">องค์ความรู้นี้มีประโยชน์หรือไม่?</h3>
      <p style="color:var(--text-secondary);font-size:var(--font-size-sm);margin-bottom:var(--spacing-md)">
        ให้ Feedback เพื่อเป็นกำลังใจและมอบ EXP ให้กับผู้สร้างองค์ความรู้
      </p>

      <div style="display:flex;gap:var(--spacing-sm);margin-bottom:var(--spacing-md)">
        <button class="btn btn-outline" id="btn-helpful">👍 วิธีนี้ช่วยแก้ปัญหาได้ (+5 EXP)</button>
        <button class="btn btn-ghost" id="btn-not-helpful">👎 ยังไม่ตอบโจทย์</button>
      </div>

      <div class="form-group">
        <label class="form-label">แสดงความคิดเห็นเพิ่มเติม</label>
        <textarea class="form-textarea" id="feedback-comment" rows="2" placeholder="พิมพ์ความคิดเห็น หรือข้อเสนอแนะ..."></textarea>
      </div>
      <button class="btn btn-primary btn-sm" id="btn-submit-feedback">ส่งความคิดเห็น</button>
    </section>

    <!-- รายการความคิดเห็น -->
    <section class="card">
      <h3 class="card-title">ความคิดเห็นจากบุคลากร</h3>
      <div id="feedback-list" style="margin-top:var(--spacing-md)"><p>กำลังโหลด...</p></div>
    </section>
  `;

  document.getElementById('btn-helpful').addEventListener('click', () => sendFeedback(knowledgeId, 'HELPFUL'));
  document.getElementById('btn-not-helpful').addEventListener('click', () => sendFeedback(knowledgeId, 'NOT_HELPFUL'));
  document.getElementById('btn-submit-feedback').addEventListener('click', () => {
    const comment = document.getElementById('feedback-comment').value.trim();
    if (!comment) {
      showToast('กรุณากรอกความคิดเห็น', 'warning');
      return;
    }
    sendFeedback(knowledgeId, 'COMMENT', comment);
  });

  loadFeedbackList(knowledgeId);
}

async function sendFeedback(knowledgeId, type, comment = '') {
  const result = await api.createFeedback({
    knowledgeId,
    type,
    comment
  });

  if (result.success) {
    showToast('ขอบคุณสำหรับ Feedback!', 'success');
    const commentInput = document.getElementById('feedback-comment');
    if (commentInput) commentInput.value = '';
    loadFeedbackList(knowledgeId);
  } else {
    showToast(result.error || 'ส่ง Feedback ไม่สำเร็จ', 'error');
  }
}

async function loadFeedbackList(knowledgeId) {
  const container = document.getElementById('feedback-list');
  if (!container) return;

  const result = await api.listFeedback({ knowledgeId });
  if (!result.success) {
    container.innerHTML = '<p class="form-error">โหลดความคิดเห็นไม่สำเร็จ</p>';
    return;
  }

  const list = result.data || [];
  if (list.length === 0) {
    container.innerHTML = '<p style="color:var(--text-secondary)">ยังไม่มีความคิดเห็น เป็นคนแรกที่ให้ Feedback!</p>';
    return;
  }

  let html = '';
  list.forEach(fb => {
    const badge = fb.type === 'HELPFUL' ? '👍 ช่วยแก้ปัญหาได้' : fb.type === 'NOT_HELPFUL' ? '👎 ยังไม่ตอบโจทย์' : '💬 ความคิดเห็น';
    html += `
      <div class="list-item" style="flex-direction:column;align-items:stretch;gap:4px">
        <div style="display:flex;justify-content:space-between;font-size:var(--font-size-xs)">
          <span class="badge badge-info">${badge}</span>
          <span style="color:var(--text-tertiary)">${Formatter.formatTimeAgo(fb.createdAt)}</span>
        </div>
        ${fb.comment ? `<p style="font-size:var(--font-size-sm);margin-top:4px">${esc(fb.comment)}</p>` : ''}
      </div>
    `;
  });

  container.innerHTML = html;
}

// ฟังก์ชันแปลง Problem/Solution เป็น Knowledge โดยตรงจากหน้า Problems
window.openCreateKnowledgeModal = function(problemId, title, solutionDesc, category) {
  router.go('knowledge');
  setTimeout(() => {
    const formCard = document.getElementById('kb-form-card');
    if (formCard) {
      formCard.style.display = 'block';
      const titleInput = document.getElementById('kb-title');
      const contentInput = document.getElementById('kb-content');
      const catInput = document.getElementById('kb-category');

      if (titleInput) titleInput.value = `แนวทางแก้ไข: ${title}`;
      if (contentInput) contentInput.value = `ปัญหาที่พบ:\n${title}\n\nวิธีแก้ไขปัญหา:\n${solutionDesc}`;
      if (catInput && category) catInput.value = category;
      formCard.scrollIntoView({ behavior: 'smooth' });
    }
  }, 200);
};
