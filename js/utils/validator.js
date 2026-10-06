// 🔍 Validator (ตรวจสอบข้อมูล)
// ใช้ตรวจสอบข้อมูลก่อนส่งไป Backend

class Validator {
  
  static validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@kku\.ac\.th$/;
    return emailRegex.test(email);
  }
  
  static validateId(id, type) {
    const format = SYSTEM_CONSTANTS.ID_FORMATS[type];
    if (!format) {
      throw new Error(`Unknown ID type: ${type}`);
    }
    return format.test(id);
  }
  
  static validateFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const allowedTypes = SYSTEM_CONSTANTS.SUPPORTED_FILE_TYPES;
    
    for (const [category, extensions] of Object.entries(allowedTypes)) {
      if (extensions.includes(extension)) {
        return { valid: true, category };
      }
    }
    
    return { valid: false, category: null };
  }
  
  static validateFileSize(sizeBytes) {
    const maxSize = SYSTEM_CONSTANTS.MAX_FILE_SIZE.MEDIUM;
    return sizeBytes <= maxSize;
  }
  
  static validateWorkLogInput(input) {
    if (!input || typeof input !== 'string') {
      return { valid: false, message: "ข้อมูลต้องเป็นข้อความ" };
    }
    
    if (input.trim().length === 0) {
      return { valid: false, message: "กรุณากรอกข้อมูล" };
    }
    
    if (input.length > 2000) {
      return { valid: false, message: "ข้อความยาวเกินไป (สูงสุด 2000 ตัวอักษร)" };
    }
    
    return { valid: true };
  }
  
  static validateProblemInput(title, description) {
    if (!title || title.trim().length === 0) {
      return { valid: false, message: "กรุณากรอกชื่อปัญหา" };
    }
    
    if (!description || description.trim().length === 0) {
      return { valid: false, message: "กรุณากรอกรายละเอียดปัญหา" };
    }
    
    return { valid: true };
  }
  
  static validateSolutionInput(description) {
    if (!description || description.trim().length === 0) {
      return { valid: false, message: "กรุณากรอกรายละเอียดวิธีแก้" };
    }
    
    return { valid: true };
  }
  
  static validateKnowledgeInput(title, content) {
    if (!title || title.trim().length === 0) {
      return { valid: false, message: "กรุณากรอกชื่อความรู้" };
    }
    
    if (!content || content.trim().length === 0) {
      return { valid: false, message: "กรุณากรอกเนื้อหาความรู้" };
    }
    
    return { valid: true };
  }
  
  static validateAnnouncementInput(title, content) {
    if (!title || title.trim().length === 0) {
      return { valid: false, message: "กรุณากรอกชื่อประกาศ" };
    }
    
    if (!content || content.trim().length === 0) {
      return { valid: false, message: "กรุณากรอกเนื้อหาประกาศ" };
    }
    
    return { valid: true };
  }
  
  static validateExpActivity(activity) {
    return SYSTEM_CONSTANTS.EXP_ACTIVITIES.includes(activity);
  }
  
  static validatePermission(userRole, requiredPermission) {
    const userPermissions = SYSTEM_CONSTANTS.PERMISSIONS[userRole];
    return userPermissions.includes(requiredPermission);
  }
  
  static validateDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    
    // ต้องไม่ใช่วันที่ในอนาคต
    if (date > now) {
      return { valid: false, message: "วันที่ไม่ถูกต้อง (ไม่สามารถเลือกวันที่ในอนาคตได้)" };
    }
    
    return { valid: true };
  }
  
  static validateStatus(type, status) {
    const validStatuses = SYSTEM_CONSTANTS.DEFAULT_STATUSES[type];
    if (!validStatuses) {
      return { valid: false, message: `Unknown type: ${type}` };
    }
    
    return validStatuses.includes(status);
  }
}

// 📤 Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validator;
}
