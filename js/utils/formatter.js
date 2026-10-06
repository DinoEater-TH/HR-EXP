// 📝 Formatter (จัดรูปแบบข้อมูล)

class Formatter {
  
  static escapeHtml(val) {
    const el = document.createElement('span');
    el.textContent = val || '';
    return el.innerHTML;
  }
  
  static formatDate(dateString, format = SYSTEM_CONSTANTS.DATE_FORMATS.DATE) {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    
    switch (format) {
      case SYSTEM_CONSTANTS.DATE_FORMATS.DATE:
        return date.toLocaleDateString(SYSTEM_CONSTANTS.DATE_LOCALE, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case SYSTEM_CONSTANTS.DATE_FORMATS.DATETIME:
        return date.toLocaleString(SYSTEM_CONSTANTS.DATE_LOCALE, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      case SYSTEM_CONSTANTS.DATE_FORMATS.ISO:
        return date.toISOString();
      default:
        return date.toLocaleDateString();
    }
  }
  
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  static formatExp(exp) {
    if (exp === null || exp === undefined) return "0 EXP";
    return `${exp} EXP`;
  }
  
  static formatLevel(level) {
    if (!level) return "N/A";
    
    const levelData = SYSTEM_CONSTANTS.LEVELS.find(l => l.levelId === level);
    if (levelData) {
      return `${level} - ${levelData.levelName} ${levelData.badge}`;
    }
    
    return level;
  }
  
  static formatSeverity(severity) {
    const severities = SYSTEM_CONSTANTS.DEFAULT_STATUSES.problem;
    const index = severities.indexOf(severity);
    
    const colors = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800'
    };
    
    const color = colors[severity] || 'bg-gray-100 text-gray-800';
    
    return {
      text: severity,
      class: color
    };
  }
  
  static formatStatus(type, status) {
    const validStatuses = SYSTEM_CONSTANTS.DEFAULT_STATUSES[type];
    if (!validStatuses) return status;
    
    const statusMap = {
      problem: {
        OPEN: { text: 'เปิดอยู่', class: 'bg-blue-100 text-blue-800' },
        IN_PROGRESS: { text: 'กำลังดำเนินการ', class: 'bg-yellow-100 text-yellow-800' },
        RESOLVED: { text: 'แก้ไขแล้ว', class: 'bg-green-100 text-green-800' },
        CLOSED: { text: 'ปิดแล้ว', class: 'bg-gray-100 text-gray-800' }
      },
      knowledge: {
        DRAFT: { text: 'ร่าง', class: 'bg-gray-100 text-gray-800' },
        PUBLISHED: { text: 'เผยแพร่', class: 'bg-green-100 text-green-800' },
        ARCHIVED: { text: 'เก็บถาวร', class: 'bg-gray-200 text-gray-800' }
      },
      announcement: {
        DRAFT: { text: 'ร่าง', class: 'bg-gray-100 text-gray-800' },
        PUBLISHED: { text: 'เผยแพร่', class: 'bg-blue-100 text-blue-800' },
        EXPIRED: { text: 'หมดอายุ', class: 'bg-gray-300 text-gray-800' },
        ARCHIVED: { text: 'เก็บถาวร', class: 'bg-gray-200 text-gray-800' }
      }
    };
    
    return statusMap[type]?.[status] || { text: status, class: 'bg-gray-100 text-gray-800' };
  }
  
  static formatPrivacy(privacy) {
    const privacyMap = {
      PUBLIC: { text: 'สาธารณะ', class: 'bg-blue-100 text-blue-800' },
      PRIVATE: { text: 'ส่วนตัว', class: 'bg-gray-100 text-gray-800' },
      RESTRICTED: { text: 'จำกัด', class: 'bg-purple-100 text-purple-800' }
    };
    
    return privacyMap[privacy] || { text: privacy, class: 'bg-gray-100 text-gray-800' };
  }
  
  static formatRole(role) {
    const roleMap = {
      USER: { text: 'ผู้ใช้ทั่วไป', class: 'bg-green-100 text-green-800' },
      ADMIN: { text: 'ผู้ดูแลระบบ', class: 'bg-red-100 text-red-800' }
    };
    
    return roleMap[role] || { text: role, class: 'bg-gray-100 text-gray-800' };
  }
  
  static truncateText(text, maxLength = 100) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  static formatNumber(num) {
    if (num === null || num === undefined) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  static formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} วันก่อน`;
    } else if (hours > 0) {
      return `${hours} ชั่วโมงก่อน`;
    } else if (minutes > 0) {
      return `${minutes} นาทีก่อน`;
    } else {
      return `${seconds} วินาทีก่อน`;
    }
  }
}

// 📤 Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Formatter;
}
