// 🔧 Configurations (ตั้งค่าระบบ)
// สามารถเปลี่ยนค่าได้โดยไม่ต้องแก้ไขโค้ด

const APP_CONFIG = {
  // ชื่อแอปพลิเคชัน
  appName: "HR KKU Experience & Knowledge Platform",
  
  // เวอร์ชัน
  version: "1.0.0",
  
  // ภาษาเริ่มต้น
  defaultLanguage: "th",
  
  // รายการภาษาที่รองรับ
  supportedLanguages: ["th", "en"],
  
  // URL ของ Backend (Google Apps Script)
  backendUrl: "https://script.google.com/macros/s/AKfycbyliyH29IfLQUvj_VUDD1rMiDAul1teq8TIzLooOvfYdSY2bOYxgVJ__fp17VEg81R_/exec",
  
  // เวลาหมดอายุของ Token (นาที)
  tokenExpiryMinutes: 60,
  
  // ขนาดไฟล์สูงสุด (MB)
  maxFileSizeMB: 25,
  
  // รายการนามสกุลไฟล์ที่รองรับ
  allowedFileTypes: [
    "jpg", "jpeg", "png", "pdf",
    "doc", "docx", "xls", "xlsx",
    "ppt", "pptx", "txt"
  ],
  
  // รายการหมวดหมู่เริ่มต้น
  defaultCategories: [
    "IT Equipment",
    "HR Process",
    "Documentation",
    "Meeting",
    "Training",
    "Other"
  ],
  
  // รายการ Severity
  severities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
  
  // รายการ Privacy
  privacyOptions: ["PUBLIC", "PRIVATE", "RESTRICTED"],
  
  // รายการ Status
  statusOptions: {
    problem: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    knowledge: ["DRAFT", "PUBLISHED", "ARCHIVED"],
    announcement: ["DRAFT", "PUBLISHED", "EXPIRED", "ARCHIVED"]
  }
};

// 📝 Constants (ค่าคงที่)
const APP_CONSTANTS = {
  // ประเภทผู้ใช้
  ROLES: {
    USER: "USER",
    ADMIN: "ADMIN"
  },
  
  // ประเภทเหตุการณ์
  ENTITY_TYPES: {
    WORK_LOG: "WORK_LOG",
    PROBLEM: "PROBLEM",
    SOLUTION: "SOLUTION",
    KNOWLEDGE: "KNOWLEDGE",
    FEEDBACK: "FEEDBACK",
    ANNOUNCEMENT: "ANNOUNCEMENT"
  },
  
  // ประเภท Action
  ACTIONS: {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    ACKNOWLEDGE: "ACKNOWLEDGE"
  },
  
  // ประเภทประกาศ
  ANNOUNCEMENT_TYPES: {
    NORMAL: "NORMAL",
    REQUIRED_ACKNOWLEDGEMENT: "REQUIRED_ACKNOWLEDGEMENT"
  },
  
  // ประเภท Feedback
  FEEDBACK_TYPES: {
    HELPFUL: "HELPFUL",
    NOT_HELPFUL: "NOT_HELPFUL",
    COMMENT: "COMMENT"
  },
  
  // เวลา
  DATE_FORMATS: {
    DATE: "YYYY-MM-DD",
    DATETIME: "YYYY-MM-DD HH:mm:ss",
    ISO: "YYYY-MM-DDTHH:mm:ssZ"
  },
  
  // EXP Values (ค่าเริ่มต้น)
  EXP_VALUES: {
    CREATE_WORK_LOG: 1,
    CREATE_PROBLEM: 1,
    CREATE_SOLUTION: 5,
    SOLUTION_RESOLVED: 10,
    FEEDBACK_HELPFUL: 5,
    KNOWLEDGE_APPROVED: 20
  },
  
  // Level Structure
  LEVELS: [
    { levelId: "LV-01", levelName: "ผู้เริ่มต้น", minExp: 0, badge: "🌱" },
    { levelId: "LV-02", levelName: "ผู้เรียนรู้", minExp: 50, badge: "📖" },
    { levelId: "LV-03", levelName: "นักแก้ปัญหา", minExp: 150, badge: "🔧" },
    { levelId: "LV-04", levelName: "ผู้แบ่งปันองค์ความรู้", minExp: 400, badge: "🤝" },
    { levelId: "LV-05", levelName: "ผู้เชี่ยวชาญ", minExp: 1000, badge: "⭐" },
    { levelId: "LV-06", levelName: "HR Knowledge Master", minExp: 2500, badge: "🏆" }
  ]
};

// 🌐 Language Packs (แพ็กภาษา)
const LANG = {
  th: {
    appName: "HR KKU Experience & Knowledge Platform",
    loginTitle: "เข้าสู่ระบบ HR KKU",
    loginSubtitle: "ระบบบันทึกประสบการณ์การทำงานและคลังความรู้",
    username: "อีเมล",
    password: "รหัสผ่าน",
    login: "เข้าสู่ระบบ",
    logout: "ออกจากระบบ",
    dashboard: "แดชบอร์ด",
    workLog: "บันทึกงาน",
    problems: "ปัญหาที่พบ",
    knowledge: "องค์ความรู้",
    announcements: "ประกาศ",
    myProfile: "โปรไฟล์ของฉัน",
    expBalance: "EXP คงเหลือ",
    level: "ระดับ",
    search: "ค้นหา",
    confirm: "ยืนยัน",
    cancel: "ยกเลิก",
    save: "บันทึก",
    edit: "แก้ไข",
    delete: "ลบ",
    upload: "อัปโหลด",
    today: "วันนี้",
    yesterday: "เมื่อวาน",
    thisWeek: "สัปดาห์นี้",
    thisMonth: "เดือนนี้"
  },
  en: {
    appName: "HR KKU Experience & Knowledge Platform",
    loginTitle: "HR KKU Login",
    loginSubtitle: "Work Experience Logging & Knowledge Base System",
    username: "Email",
    password: "Password",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    workLog: "Work Log",
    problems: "Problems",
    knowledge: "Knowledge",
    announcements: "Announcements",
    myProfile: "My Profile",
    expBalance: "EXP Balance",
    level: "Level",
    search: "Search",
    confirm: "Confirm",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    upload: "Upload",
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    thisMonth: "This Month"
  }
};

// 📤 Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APP_CONFIG, APP_CONSTANTS, LANG };
}
