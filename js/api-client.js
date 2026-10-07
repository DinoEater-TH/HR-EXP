// 📡 API Client - ติดต่อ Backend (Google Apps Script)
// ใช้สำหรับเรียก API ทั้งหมด

class APIClient {
  constructor() {
    this.baseUrl = APP_CONFIG.backendUrl;
    this.token = null;
  }
  
  /**
   * ตั้งค่า Token
   * @param {string} token - Token
   */
  setToken(token) {
    this.token = token;
  }
  
  /**
   * ล้าง Token
   */
  clearToken() {
    this.token = null;
  }
  
  /**
   * เรียก GET Request
   * @param {string} action - Action
   * @param {Object} params - Parameters
   * @return {Promise<Object>} - Response
   */
  async get(action, params = {}) {
    const queryParams = new URLSearchParams({
      action: action,
      ...params
    });
    
    if (this.token) {
      queryParams.append('token', this.token);
    }
    
    const url = `${this.baseUrl}?${queryParams.toString()}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * เรียก POST Request
   * @param {string} action - Action
   * @param {Object} data - ข้อมูล
   * @return {Promise<Object>} - Response
   */
  async post(action, data = {}) {
    const payload = {
      action: action,
      token: this.token,
      data: data
    };
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * จัดการ Response
   * @param {Response} response - Response object
   * @return {Promise<Object>} - Parsed response
   */
  async handleResponse(response) {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          status: response.status
        };
      }
      
      return data;
    } catch (error) {
      return {
        success: false,
        error: 'Invalid response format',
        status: response.status
      };
    }
  }
  
  /**
   * จัดการ Error
   * @param {Error} error - Error object
   * @return {Object} - Error response
   */
  handleError(error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message || 'Network error',
      status: 0
    };
  }
  
  // ===== Authentication API =====
  
  async login(email) {
    return this.post('auth.login', { email: email });
  }
  
  async logout() {
    return this.post('auth.logout');
  }
  
  async verifyToken() {
    return this.get('auth.verify');
  }
  
  // ===== User API =====
  
  async getProfile() {
    return this.get('user.profile');
  }
  
  async updateProfile(data) {
    return this.post('user.update', data);
  }
  
  // ===== Work Log API =====
  
  async createWorkLog(data) {
    return this.post('worklog.create', data);
  }
  
  async listWorkLogs(params = {}) {
    return this.get('worklog.list', params);
  }
  
  async getWorkLog(id) {
    return this.get('worklog.get', { id: id });
  }
  
  async updateWorkLog(id, data) {
    return this.post('worklog.update', { id: id, ...data });
  }
  
  async deleteWorkLog(id) {
    return this.post('worklog.delete', { id: id });
  }
  
  // ===== Problem API =====
  
  async createProblem(data) {
    return this.post('problem.create', data);
  }
  
  async listProblems(params = {}) {
    return this.get('problem.list', params);
  }
  
  async getProblem(id) {
    return this.get('problem.get', { id: id });
  }
  
  async updateProblem(id, data) {
    return this.post('problem.update', { id: id, ...data });
  }
  
  // ===== Solution API =====
  
  async createSolution(data) {
    return this.post('solution.create', data);
  }
  
  async listSolutions(params = {}) {
    return this.get('solution.list', params);
  }
  
  async updateSolution(id, data) {
    return this.post('solution.update', { id: id, ...data });
  }
  
  // ===== Knowledge API =====
  
  async createKnowledge(data) {
    return this.post('knowledge.create', data);
  }
  
  async searchKnowledge(query, params = {}) {
    return this.get('knowledge.search', { query: query, ...params });
  }
  
  async getKnowledge(id) {
    return this.get('knowledge.get', { id: id });
  }
  
  async updateKnowledge(id, data) {
    return this.post('knowledge.update', { id: id, ...data });
  }
  
  async approveKnowledge(id) {
    return this.post('knowledge.approve', { id: id });
  }
  
  // ===== Feedback API =====
  
  async createFeedback(data) {
    return this.post('feedback.create', data);
  }
  
  async listFeedback(params = {}) {
    return this.get('feedback.list', params);
  }
  
  // ===== EXP & Level API =====
  
  async getExpBalance() {
    return this.get('exp.balance');
  }
  
  async getExpHistory(params = {}) {
    return this.get('exp.history', params);
  }
  
  async getCurrentLevel() {
    return this.get('level.current');
  }
  
  // ===== Announcement API =====
  
  async getPendingAnnouncements() {
    return this.get('announcement.pending');
  }
  
  async acknowledgeAnnouncement(id) {
    return this.post('announcement.acknowledge', { id: id });
  }
  
  async createAnnouncement(data) {
    return this.post('announcement.create', data);
  }
  
  async listAnnouncements(params = {}) {
    return this.get('announcement.list', params);
  }
  
  async getAnnouncementStatus(id) {
    return this.get('announcement.status', { id: id });
  }
  
  // ===== Attachment API =====
  
  async uploadAttachment(data) {
    return this.post('attachment.upload', data);
  }
  
  async getAttachment(id) {
    return this.get('attachment.get', { id: id });
  }
  
  async deleteAttachment(id) {
    return this.post('attachment.delete', { id: id });
  }
  
  // ===== AI API =====
  
  async classifyText(text) {
    return this.post('ai.classify', { text: text });
  }
  
  // ===== Admin API =====
  
  async listUsers(params = {}) {
    return this.get('admin.users', params);
  }
  
  async updateUser(id, data) {
    return this.post('admin.user.update', { id: id, ...data });
  }
  
  async getAuditLog(params = {}) {
    return this.get('admin.audit', params);
  }
  
  async getStatistics() {
    return this.get('admin.statistics');
  }
  
  async updateSettings(data) {
    return this.post('admin.settings', data);
  }
  
  // ===== Health Check =====
  
  async healthCheck() {
    return this.get('health.check');
  }
}

// 🌐 สร้าง Instance เดียวใช้ทั้งแอป
const api = new APIClient();

// 📤 Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIClient;
}