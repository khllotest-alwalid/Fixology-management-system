import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Login/Signup
      "signInOrUp": "Sign in or Sign up",
      "smarterAnswers": "You'll get smarter answers and you can upload files, images, and much more.",
      "emailAddress": "Email address",
      "continue": "Continue",
      "or": "Or",
      "continueWithGoogle": "Continue with Google account",
      "continueWithMicrosoft": "Continue with Microsoft account", 
      "continueWithApple": "Continue with Apple account",
      "continueWithPhone": "Continue with phone number",
      "forgotPassword": "Forgot password?",
      "noAccount": "Don't have an account? Sign up now",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "signUp": "Sign Up",
      "signIn": "Sign In",
      "alreadyHaveAccount": "Already have an account? Sign in",
      
      // Dashboard
      "dashboard": "Dashboard",
      "deviceReception": "Device Reception",
      "shopAccounts": "Shop Accounts", 
      "statistics": "Statistics",
      "reports": "Reports",
      "periodReview": "Period Review",
      "settings": "Settings",
      "notesAnalyzer": "Notes Analyzer",
      "logout": "Logout",
      
      // Device Reception
      "shopName": "Shop Name",
      "deviceBrand": "Device Brand",
      "modelName": "Model Name",
      "repairDate": "Repair Date",
      "issueDescription": "Issue Description", 
      "repairCost": "Repair Cost ($)",
      "technicianNotes": "Technician Notes",
      "repairStatus": "Repair Status",
      "underRepair": "Under Repair",
      "repaired": "Repaired",
      "notRepaired": "Not Repaired",
      "submit": "Submit",
      "addNewShop": "Add New Shop",
      "deviceType": "Device Type",
      "mobile": "Mobile",
      "laptop": "Laptop",
      
      // Shop Management
      "shopManagement": "Shop Management",
      "addShop": "Add Shop",
      "editShop": "Edit Shop",
      "deleteShop": "Delete Shop",
      "shopContact": "Shop Contact",
      "totalDebt": "Total Debt",
      "recordPayment": "Record Payment",
      
      // Payments
      "payments": "Payments",
      "amount": "Amount",
      "paymentDate": "Payment Date",
      "notes": "Notes",
      "paymentHistory": "Payment History",
      
      // Statistics
      "totalDevicesReceived": "Total Devices Received",
      "repairedDevices": "Repaired Devices", 
      "unrepairedDevices": "Unrepaired Devices",
      "devicesUnderRepair": "Devices Under Repair",
      "monthlyRevenue": "Monthly Revenue",
      "pendingDebts": "Pending Debts",
      
      // Common
      "day": "Day",
      "month": "Month", 
      "year": "Year",
      "search": "Search",
      "filter": "Filter",
      "export": "Export",
      "cancel": "Cancel",
      "save": "Save",
      "edit": "Edit",
      "delete": "Delete",
      "view": "View",
      "actions": "Actions",
      "loading": "Loading...",
      "noDataFound": "No data found",
      
      // Settings
      "language": "Language",
      "theme": "Theme",
      "light": "Light",
      "dark": "Dark",
      "system": "System",
      
      // Success/Error Messages
      "success": "Success",
      "error": "Error",
      "deviceAdded": "Device added successfully",
      "paymentRecorded": "Payment recorded successfully",
      "shopAdded": "Shop added successfully",
      "dataUpdated": "Data updated successfully"
    }
  },
  ar: {
    translation: {
      // Login/Signup
      "signInOrUp": "تسجيل الدخول أو التسجيل",
      "smarterAnswers": "ستحصل على إجابات أكثر ذكاءً ويمكنك تحميل الملفات والصور وغير ذلك الكثير.",
      "emailAddress": "عنوان البريد الإلكتروني",
      "continue": "متابعة",
      "or": "أو",
      "continueWithGoogle": "المتابعة باستخدام حساب Google",
      "continueWithMicrosoft": "المتابعة باستخدام حساب Microsoft",
      "continueWithApple": "المتابعة باستخدام حساب Apple",
      "continueWithPhone": "المتابعة باستخدام رقم الهاتف",
      "forgotPassword": "نسيت كلمة المرور؟",
      "noAccount": "ليس لديك حساب؟ سجل الآن",
      "password": "كلمة المرور",
      "confirmPassword": "تأكيد كلمة المرور",
      "signUp": "تسجيل",
      "signIn": "دخول",
      "alreadyHaveAccount": "لديك حساب بالفعل؟ سجل دخول",
      
      // Dashboard
      "dashboard": "لوحة التحكم",
      "deviceReception": "استلام الأجهزة",
      "shopAccounts": "حسابات المحلات",
      "statistics": "الإحصائيات",
      "reports": "التقارير",
      "periodReview": "مراجعة الفترات",
      "settings": "الإعدادات",
      "notesAnalyzer": "محلل الملاحظات",
      "logout": "تسجيل الخروج",
      
      // Device Reception
      "shopName": "اسم المحل",
      "deviceBrand": "علامة الجهاز",
      "modelName": "اسم الموديل",
      "repairDate": "تاريخ الصيانة",
      "issueDescription": "وصف العطل",
      "repairCost": "تكلفة الصيانة ($)",
      "technicianNotes": "ملاحظات الفني",
      "repairStatus": "حالة الصيانة",
      "underRepair": "قيد الصيانة",
      "repaired": "تمت الصيانة",
      "notRepaired": "لم تتم الصيانة",
      "submit": "إرسال",
      "addNewShop": "إضافة محل جديد",
      "deviceType": "نوع الجهاز",
      "mobile": "هاتف محمول",
      "laptop": "لابتوب",
      
      // Shop Management
      "shopManagement": "إدارة المحلات",
      "addShop": "إضافة محل",
      "editShop": "تعديل المحل",
      "deleteShop": "حذف المحل",
      "shopContact": "تواصل المحل",
      "totalDebt": "إجمالي الديون",
      "recordPayment": "تسجيل دفعة",
      
      // Payments
      "payments": "المدفوعات",
      "amount": "المبلغ",
      "paymentDate": "تاريخ الدفع",
      "notes": "ملاحظات",
      "paymentHistory": "تاريخ المدفوعات",
      
      // Statistics
      "totalDevicesReceived": "إجمالي الأجهزة المستلمة",
      "repairedDevices": "الأجهزة المُصنعة",
      "unrepairedDevices": "الأجهزة غير المُصنعة", 
      "devicesUnderRepair": "الأجهزة قيد الصيانة",
      "monthlyRevenue": "الإيراد الشهري",
      "pendingDebts": "الديون المعلقة",
      
      // Common
      "day": "يوم",
      "month": "شهر",
      "year": "سنة", 
      "search": "بحث",
      "filter": "تصفية",
      "export": "تصدير",
      "cancel": "إلغاء",
      "save": "حفظ",
      "edit": "تعديل",
      "delete": "حذف",
      "view": "عرض",
      "actions": "إجراءات",
      "loading": "جارٍ التحميل...",
      "noDataFound": "لا توجد بيانات",
      
      // Settings
      "language": "اللغة",
      "theme": "المظهر",
      "light": "فاتح",
      "dark": "مظلم",
      "system": "النظام",
      
      // Success/Error Messages
      "success": "نجح",
      "error": "خطأ",
      "deviceAdded": "تم إضافة الجهاز بنجاح",
      "paymentRecorded": "تم تسجيل الدفعة بنجاح",
      "shopAdded": "تم إضافة المحل بنجاح",
      "dataUpdated": "تم تحديث البيانات بنجاح"
    }
  },
  tr: {
    translation: {
      // Login/Signup  
      "signInOrUp": "Giriş yap veya Kaydol",
      "smarterAnswers": "Daha akıllı cevaplar alacaksınız ve dosyalar, resimler ve çok daha fazlasını yükleyebileceksiniz.",
      "emailAddress": "E-posta adresi",
      "continue": "Devam et",
      "or": "Veya",
      "continueWithGoogle": "Google hesabı ile devam et",
      "continueWithMicrosoft": "Microsoft hesabı ile devam et",
      "continueWithApple": "Apple hesabı ile devam et", 
      "continueWithPhone": "Telefon numarası ile devam et",
      "forgotPassword": "Şifremi unuttum?",
      "noAccount": "Hesabınız yok mu? Şimdi kaydolun",
      "password": "Şifre",
      "confirmPassword": "Şifreyi Onayla",
      "signUp": "Kaydol",
      "signIn": "Giriş Yap",
      "alreadyHaveAccount": "Zaten hesabınız var mı? Giriş yapın",
      
      // Dashboard
      "dashboard": "Panel",
      "deviceReception": "Cihaz Kabulü",
      "shopAccounts": "Mağaza Hesapları",
      "statistics": "İstatistikler", 
      "reports": "Raporlar",
      "periodReview": "Dönem İncelemesi",
      "settings": "Ayarlar",
      "notesAnalyzer": "Not Analizörü",
      "logout": "Çıkış",
      
      // Device Reception
      "shopName": "Mağaza Adı",
      "deviceBrand": "Cihaz Markası",
      "modelName": "Model Adı",
      "repairDate": "Tamir Tarihi",
      "issueDescription": "Sorun Açıklaması",
      "repairCost": "Tamir Maliyeti ($)",
      "technicianNotes": "Teknisyen Notları",
      "repairStatus": "Tamir Durumu",
      "underRepair": "Tamir Ediliyor",
      "repaired": "Tamir Edildi",
      "notRepaired": "Tamir Edilmedi",
      "submit": "Gönder",
      "addNewShop": "Yeni Mağaza Ekle",
      "deviceType": "Cihaz Tipi",
      "mobile": "Mobil",
      "laptop": "Laptop",
      
      // Shop Management
      "shopManagement": "Mağaza Yönetimi",
      "addShop": "Mağaza Ekle",
      "editShop": "Mağaza Düzenle",
      "deleteShop": "Mağaza Sil",
      "shopContact": "Mağaza İletişim",
      "totalDebt": "Toplam Borç",
      "recordPayment": "Ödeme Kaydet",
      
      // Payments
      "payments": "Ödemeler",
      "amount": "Miktar",
      "paymentDate": "Ödeme Tarihi",
      "notes": "Notlar",
      "paymentHistory": "Ödeme Geçmişi",
      
      // Statistics
      "totalDevicesReceived": "Alınan Toplam Cihaz",
      "repairedDevices": "Tamir Edilen Cihazlar",
      "unrepairedDevices": "Tamir Edilmeyen Cihazlar",
      "devicesUnderRepair": "Tamir Edilen Cihazlar", 
      "monthlyRevenue": "Aylık Gelir",
      "pendingDebts": "Bekleyen Borçlar",
      
      // Common
      "day": "Gün",
      "month": "Ay",
      "year": "Yıl",
      "search": "Ara",
      "filter": "Filtrele", 
      "export": "Dışa Aktar",
      "cancel": "İptal",
      "save": "Kaydet",
      "edit": "Düzenle",
      "delete": "Sil",
      "view": "Görüntüle",
      "actions": "İşlemler",
      "loading": "Yükleniyor...",
      "noDataFound": "Veri bulunamadı",
      
      // Settings
      "language": "Dil",
      "theme": "Tema",
      "light": "Açık",
      "dark": "Koyu",
      "system": "Sistem",
      
      // Success/Error Messages
      "success": "Başarılı",
      "error": "Hata",
      "deviceAdded": "Cihaz başarıyla eklendi",
      "paymentRecorded": "Ödeme başarıyla kaydedildi",
      "shopAdded": "Mağaza başarıyla eklendi",
      "dataUpdated": "Veriler başarıyla güncellendi"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;