// 📢 Announcement Manager - Mandatory Announcement Flow

const announcementManager = {
  pendingList: [],
  currentIndex: 0,
  onComplete: null,

  run(callback) {
    this.onComplete = callback || (() => router.go('dashboard'));
    this.fetchAndShow();
  },

  async fetchAndShow() {
    try {
      const result = await api.getPendingAnnouncements();
      if (!result.success || !result.data || result.data.length === 0) {
        this.finish();
        return;
      }
      this.pendingList = result.data;
      this.currentIndex = 0;
      this.showModal(this.pendingList[0]);
    } catch (e) {
      console.error('Announcement fetch error:', e);
      this.finish();
    }
  },

  showModal(ann) {
    const modal = document.createElement('div');
    modal.className = 'announcement-modal';
    modal.id = 'announcement-modal';
    modal.innerHTML = `
      <div class="announcement-card" role="dialog" aria-label="${this.esc(ann.title)}">
        <div class="announcement-header">
          <h2>${this.esc(ann.title)}</h2>
          <p class="form-help">${ann.type === 'REQUIRED_ACKNOWLEDGEMENT' ? 'จำเป็นต้องรับทราบ' : 'ประกาศ'}</p>
        </div>
        <div class="announcement-body" id="announcement-body">
          ${this.esc(ann.content).replace(/\n/g, '<br>')}
        </div>
        <div class="announcement-footer">
          <span class="scroll-hint" id="scroll-hint">กรุณาอ่านให้จบก่อนรับทราบ</span>
          <button class="btn btn-primary" id="acknowledge-btn" disabled>✓ รับทราบ</button>
        </div>
      </div>`;

    document.body.appendChild(modal);

    const body = document.getElementById('announcement-body');
    const ackBtn = document.getElementById('acknowledge-btn');
    const hint = document.getElementById('scroll-hint');

    const checkScroll = () => {
      const scrolled = body.scrollHeight - body.scrollTop - body.clientHeight < 20;
      if (scrolled) {
        ackBtn.disabled = false;
        hint.classList.add('hidden');
        body.removeEventListener('scroll', checkScroll);
      }
    };

    body.addEventListener('scroll', checkScroll);
    checkScroll();

    ackBtn.addEventListener('click', async () => {
      await this.acknowledge(ann.announcementId);
      modal.remove();
      this.currentIndex++;
      if (this.currentIndex < this.pendingList.length) {
        this.showModal(this.pendingList[this.currentIndex]);
      } else {
        await this.fetchAndShow();
      }
    });
  },

  async acknowledge(annId) {
    try {
      await api.acknowledgeAnnouncement(annId);
    } catch (e) {
      console.error('Acknowledge error:', e);
    }
  },

  finish() {
    this.pendingList = [];
    this.currentIndex = 0;
    if (this.onComplete) {
      const cb = this.onComplete;
      this.onComplete = null;
      cb();
    }
  },

  esc(val) {
    const el = document.createElement('span');
    el.textContent = val || '';
    return el.innerHTML;
  }
};