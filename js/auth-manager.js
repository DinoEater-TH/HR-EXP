// 🔐 Auth Manager - จัดการ Authentication
// จัดการ Login, Logout, Token, User State

class AuthManager {
  constructor() {
    this.token = null;
    this.user = null;
    this.tokenKey = 'hr_kku_token';
    this.userKey = 'hr_kku_user';
    this.tokenExpiryKey = 'hr_kku_token_expiry';
  }
  
  /**
   * ตรวจสอบว่า Login อยู่หรือไม่
   * @return {boolean}
   */
  isAuthenticated() {
    return !!this.token && !this.isTokenExpired();
  }
  
  /**
   * ตรวจสอบว่า Token หมดอายุหรือยัง
   * @return {boolean}
   */
  isTokenExpired() {
    const expiry = localStorage.getItem(this.tokenExpiryKey);
    if (!expiry) return true;
    return new Date().getTime() > parseInt(expiry);
  }
  
  /**
   * ดึง User ปัจจุบัน
   * @return {Object|null}
   */
  getUser() {
    return this.user;
  }
  
  /**
   * ดึง Token ปัจจุบัน
   * @return {string|null}
   */
  getToken() {
    return this.token;
  }
  
  /**
   * Login
   * @param {string} email - อีเมล @kku.ac.th
   * @return {Promise<Object>}
   */
  async login(email) {
    try {
      // ตรวจสอบ Email format
      if (!Validator.validateEmail(email)) {
        return {
          success: false,
          error: 'อีเมลต้องลงท้ายด้วย @kku.ac.th'
        };
      }
      
      // เรียก API
      const response = await api.login(email);
      
      if (response.success) {
        // บันทึก Token และ User
        this.setSession(response.token, response.user, response.expiresIn);
        return { success: true };
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่'
      };
    }
  }
  
  /**
   * Logout
   * @return {Promise<Object>}
   */
  async logout() {
    try {
      // เรียก API (ถ้า Login อยู่)
      if (this.isAuthenticated()) {
        await api.logout();
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // ล้าง Session ไม่ว่ากรณีใด ๆ
      this.clearSession();
      return { success: true };
    }
  }
  
  /**
   * บันทึก Session
   * @param {string} token - Token
   * @param {Object} user - ผู้ใช้
   * @param {number} expiresIn - วินาทีที่หมดอายุ
   */
  setSession(token, user, expiresIn = 3600) {
    this.token = token;
    this.user = user;
    
    const expiryTime = new Date().getTime() + (expiresIn * 1000);
    
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());
    
    api.setToken(token);
  }
  
  /**
   * โหลด Session จาก localStorage
   * @return {boolean} - สำเร็จหรือไม่
   */
  loadSession() {
    try {
      if (this.isTokenExpired()) {
        this.clearSession();
        return false;
      }
      
      const token = localStorage.getItem(this.tokenKey);
      const userStr = localStorage.getItem(this.userKey);
      
      if (!token || !userStr) {
        return false;
      }
      
      this.token = token;
      this.user = JSON.parse(userStr);
      
      api.setToken(token);
      
      return true;
    } catch (error) {
      console.error('Load session error:', error);
      this.clearSession();
      return false;
    }
  }
  
  /**
   * ล้าง Session
   */
  clearSession() {
    this.token = null;
    this.user = null;
    
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenExpiryKey);
    
    api.clearToken();
  }
  
  /**
   * ตรวจสอบสิทธิ์
   * @param {string} permission - สิทธิ์ที่ต้องการ
   * @return {boolean}
   */
  hasPermission(permission) {
    if (!this.user) return false;
    
    // Admin มีสิทธิ์ทุกอย่าง
    if (this.user.role === 'ADMIN') return true;
    
    const userPermissions = this.getPermissionsByRole(this.user.role);
    return userPermissions.includes(permission);
  }
  
  /**
   * ดึงสิทธิ์ตาม Role
   * @param {string} role - บทบาท
   * @return {Array}
   */
  getPermissionsByRole(role) {
    return SYSTEM_CONSTANTS.PERMISSIONS[role] || [];
  }
  
  /**
   * ตรวจสอบว่าเป็น Admin หรือไม่
   * @return {boolean}
   */
  isAdmin() {
    return this.user && this.user.role === 'ADMIN';
  }
  
  /**
   * ดึงข้อมูลผู้ใช้ปัจจุบัน
   * @return {Promise<Object>}
   */
  async refreshUser() {
    try {
      const response = await api.getProfile();
      
      if (response.success) {
        this.user = response.data;
        localStorage.setItem(this.userKey, JSON.stringify(this.user));
      }
      
      return response;
    } catch (error) {
      console.error('Refresh user error:', error);
      return { success: false, error: error.message };
    }
  }
}

// 🌐 สร้าง Instance เดียวใช้ทั้งแอป
const auth = new AuthManager();

// 📤 Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthManager;
}