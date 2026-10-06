// 🔢 Constants (ค่าคงที่เฉพาะระบบ)
// ไม่ควรเปลี่ยนแปลงโดยผู้ใช้งาน

const SYSTEM_CONSTANTS = {
  // ID ของระบบ
  SYSTEM_ID: "HR-KKU-EXP-001",
  
  // เวอร์ชันของสคีมา
  SCHEMA_VERSION: "1.0.0",
  
  // จำนวนสูงสุดต่อหน้า
  PAGINATION_LIMITS: {
    DEFAULT: 20,
    MAX: 100
  },
  
  // รูปแบบ ID
  ID_FORMATS: {
    USER: /^USR-\d{4}-\d{6}$/,
    WORK_LOG: /^WL-\d{4}-\d{6}$/,
    PROBLEM: /^PROB-\d{4}-\d{6}$/,
    SOLUTION: /^SOL-\d{4}-\d{6}$/,
    KNOWLEDGE: /^KB-\d{4}-\d{6}$/,
    FEEDBACK: /^FB-\d{4}-\d{6}$/,
    EXP_TRANSACTION: /^EXP-\d{4}-\d{6}$/,
    LEVEL: /^LV-\d{2}$/,
    ATTACHMENT: /^ATT-\d{4}-\d{6}$/,
    AUDIT: /^AUD-\d{4}-\d{6}$/,
    ANNOUNCEMENT: /^ANN-\d{4}-\d{6}$/,
    EVENT: /^EVENT-\d{4}-\d{6}$/
  },
  
  // รายการหมวดหมู่เริ่มต้น (ขยายได้)
  DEFAULT_CATEGORIES: [
    "IT Equipment",
    "HR Process",
    "Documentation",
    "Meeting",
    "Training",
    "Communication",
    "Finance",
    "Facilities",
    "Other"
  ],
  
  // รายการแท็กเริ่มต้น (ขยายได้)
  DEFAULT_TAGS: [
    "computer", "printer", "meeting", "training", "document",
    "email", "software", "hardware", "network", "support"
  ],
  
  // รายการสถานะเริ่มต้น
  DEFAULT_STATUSES: {
    problem: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    knowledge: ["DRAFT", "PUBLISHED", "ARCHIVED"],
    announcement: ["DRAFT", "PUBLISHED", "EXPIRED", "ARCHIVED"]
  },
  
  // รายการสิทธิ์
  PERMISSIONS: {
    USER: [
      "read_worklog",
      "create_worklog",
      "read_problem",
      "create_problem",
      "read_knowledge",
      "search_knowledge",
      "create_feedback",
      "view_exp",
      "view_level"
    ],
    ADMIN: [
      "manage_users",
      "manage_roles",
      "manage_knowledge",
      "approve_knowledge",
      "manage_announcements",
      "view_audit_log",
      "view_statistics",
      "configure_system",
      "manage_exp",
      "manage_levels"
    ]
  },
  
  // รายการกิจกรรม EXP
  EXP_ACTIVITIES: [
    "CREATE_WORK_LOG",
    "CREATE_PROBLEM",
    "CREATE_SOLUTION",
    "SOLUTION_RESOLVED",
    "FEEDBACK_HELPFUL",
    "KNOWLEDGE_APPROVED",
    "LOGIN_DAILY"
  ],
  
  // เวลา
  TIMEZONE: "Asia/Bangkok",
  DATE_LOCALE: "th-TH",
  
  // ขนาดไฟล์สูงสุด (bytes)
  MAX_FILE_SIZE: {
    SMALL: 5 * 1024 * 1024,      // 5MB
    MEDIUM: 25 * 1024 * 1024,    // 25MB
    LARGE: 100 * 1024 * 1024     // 100MB
  },
  
  // รายการนามสกุลไฟล์ที่รองรับ
  SUPPORTED_FILE_TYPES: {
    images: ["jpg", "jpeg", "png", "gif"],
    documents: ["pdf", "txt", "md"],
    office: ["doc", "docx", "xls", "xlsx", "ppt", "pptx"],
    archives: ["zip", "rar"]
  },
  
  // รายการเหตุการณ์ที่ต้องบันทึก Audit
  AUDITABLE_EVENTS: [
    "CREATE", "UPDATE", "DELETE",
    "LOGIN", "LOGOUT", "ACKNOWLEDGE",
    "APPROVE", "REJECT"
  ],
  
  // รายการสถานะที่ใช้ทั่วไป
  STATUS: {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED",
    EXPIRED: "EXPIRED",
    ARCHIVED: "ARCHIVED",
    DELETED: "DELETED"
  }
};

// 📤 Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SYSTEM_CONSTANTS;
}