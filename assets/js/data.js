/**
 * Quản lý Dữ liệu Thiệp Cưới (Wedding Data Manager)
 * Được xuất tự động từ Studio Quản Trị để đẩy lên GitHub
 */

const STORAGE_KEY = 'thiep_cuoi_online_data_v1';

const DEFAULT_WEDDING_DATA = {
  "theme": "rose",
  "envelopeTitle": "Thiệp Mời Thành Hôn",
  "messageIntro": "Hôn nhân là đích đến của tình yêu đích thực, là khởi đầu cho một hành trình mới ngập tràn yêu thương và sẻ chia.",
  "couple": {
    "groom": "Phan Thanh Hoàng",
    "groomShort": "Thanh Hoàng",
    "groomNickname": "Đức Chibi",
    "groomFather": "Phan Văn Tài",
    "groomMother": "Trần Thị Rớt",
    "groomAvatar": "assets/images/groom-avatar.jpg",
    "groomStory": "",
    "bride": "Nguyễn Thị Ngọc Thi",
    "brideShort": "Ngọc Thi",
    "brideNickname": "Linh Xinh",
    "brideFather": "Nguyễn Trường Thạch",
    "brideMother": "Huỳnh Ngọc Thích",
    "brideAvatar": "assets/images/groom-bride.jpg",
    "brideStory": "",
    "coverImage": "assets/images/cover-custom.jpg"
  },
  "weddingDate": "2026-10-03T08:25",
  "weddingDateDisplay": "Thứ Bảy, 03 Tháng 10 Năm 2026",
  "weddingLunarDate": "Tức ngày 23 tháng 08 năm Bính Ngọ (Âm Lịch)",
  "events": {
    "vuQuy": {
      "enabled": true,
      "title": "Lễ Vu Quy (Nhà Gái)",
      "time": "08:30",
      "date": "20/11/2026",
      "lunar": "12/10 Âm lịch",
      "location": "Tư gia Nhà Gái",
      "address": "Số 68 Đường Hoa Hồng, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội",
      "mapUrl": "https://maps.google.com/?q=Hanoi"
    },
    "thanhHon": {
      "enabled": true,
      "title": "Lễ Thành Hôn (Nhà Trai)",
      "time": "10:30",
      "date": "20/11/2026",
      "lunar": "12/10 Âm lịch",
      "location": "Tư gia Nhà Trai",
      "address": "Số 126 Đường Hạnh Phúc, Phường Kim Mã, Quận Ba Đình, Hà Nội",
      "mapUrl": "https://maps.google.com/?q=Hanoi"
    },
    "tiecCuoi": {
      "enabled": true,
      "title": "Tiệc Cưới Trọng Thể",
      "time": "8:00",
      "date": "03/10/2026",
      "lunar": "12/10 Âm lịch",
      "location": "Trường tiểu học 1 Nguyễn Văn Tư",
      "address": "Trường tiểu học 1 Nguyễn Văn Tư",
      "mapUrl": ""
    }
  },
  "music": {
    "type": "sample",
    "name": "Nhạc Tự Đặt Trong Thư Mục (assets/audio/wedding-song.mp3)",
    "url": "assets/audio/wedding-song.mp3"
  },
  "gallery": [
    "assets/images/wedding-cover.jpg",
    "assets/images/groom-bride.jpg",
    "assets/images/gallery-1.jpg",
    "assets/images/gallery-2.jpg"
  ],
  "banking": {
    "groom": {
      "bank": "Vietcombank",
      "bankCode": "VCB",
      "accountNumber": "1029384756",
      "accountName": "NGUYEN VAN DUC"
    },
    "bride": {
      "bank": "Techcombank",
      "bankCode": "TCB",
      "accountNumber": "1903847562019",
      "accountName": "TRAN THI THUY LINH"
    }
  },
  "guests": [
    {
      "id": "g1",
      "name": "Anh Tuấn & Bạn gái",
      "slug": "anh-tuan-va-ban-gai",
      "side": "Nhà Trai",
      "confirmed": true,
      "count": 2
    },
    {
      "id": "g2",
      "name": "Chị Mai Phương",
      "slug": "chi-mai-phuong",
      "side": "Nhà Gái",
      "confirmed": true,
      "count": 1
    },
    {
      "id": "g3",
      "name": "Gia đình Bác Hùng",
      "slug": "gia-dinh-bac-hung",
      "side": "Nhà Trai",
      "confirmed": false,
      "count": 4
    },
    {
      "id": "g4",
      "name": "Tập thể Bạn Thân Đại Học",
      "slug": "tap-the-ban-than-dai-hoc",
      "side": "Nhà Trai",
      "confirmed": true,
      "count": 5
    }
  ],
  "wishes": [
    {
      "id": "w1",
      "name": "Thanh Hằng & Đức Minh",
      "message": "Chúc hai bạn trăm năm hạnh phúc, răng long đầu bạc, cuộc sống luôn ngập tràn tiếng cười và thương yêu nhau như ngày đầu!",
      "time": "15 phút trước",
      "likes": 12
    },
    {
      "id": "w2",
      "name": "Gia đình Bác Hùng",
      "message": "Chúc mừng hai cháu và hai họ! Chúc tổ ấm mới của hai cháu luôn an khang, thịnh vượng và vạn sự như ý.",
      "time": "1 giờ trước",
      "likes": 8
    },
    {
      "id": "w3",
      "name": "Hoàng Long (FPTU)",
      "message": "Chúc mừng anh bạn nối khố đã tìm được bến đỗ bình yên! Hôm tới nhất định nâng ly chúc mừng tới bến nhé!",
      "time": "3 giờ trước",
      "likes": 19
    }
  ]
};

// Cấu hình kết nối Google Firebase Cloud
const firebaseConfig = {
  apiKey: "AIzaSyDrWP6dLiPE4QfHC8uG67S1LneoHl9Ih8U",
  authDomain: "thiep-cuoi-online-8a4a6.firebaseapp.com",
  projectId: "thiep-cuoi-online-8a4a6",
  storageBucket: "thiep-cuoi-online-8a4a6.firebasestorage.app",
  messagingSenderId: "283762387179",
  appId: "1:283762387179:web:1bfb8d032daa73190db6ae"
};

// Khởi tạo Firebase SDK
let firestoreDb = null;
try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firestoreDb = firebase.firestore();
    console.log("🔥 Đã kết nối Google Firebase Firestore thành công!");
  }
} catch (e) {
  console.warn("Lỗi kết nối Firebase:", e);
}

class WeddingDataManager {
  constructor() {
    this.STORAGE_KEY = STORAGE_KEY;
    this.data = this.loadData();
    this.initFirestoreSync();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_WEDDING_DATA, ...parsed };
      }
    } catch (e) {
      console.warn('Lỗi đọc localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_WEDDING_DATA));
  }

  initFirestoreSync() {
    if (!firestoreDb) return;
    try {
      const docRef = firestoreDb.collection("wedding_data").doc("main_info");
      
      // Lắng nghe dữ liệu thời gian thực từ Google Cloud
      docRef.onSnapshot((doc) => {
        if (doc.exists) {
          const cloudData = doc.data();
          if (cloudData) {
            console.log("☁️ Nhận dữ liệu mới nhất từ Firebase Cloud:", cloudData);
            this.data = { ...this.data, ...cloudData };
            try {
              localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
            } catch (err) {}
            // Cập nhật lại giao diện thiệp cưới ngay lập tức
            if (typeof renderWeddingPage === 'function') {
              const urlParams = new URLSearchParams(window.location.search);
              renderWeddingPage(urlParams.get('guest'));
            }
          }
        } else {
          // Lần đầu tiên chạy chưa có dữ liệu trên Firestore: đẩy dữ liệu hiện tại lên
          docRef.set(this.data).then(() => {
            console.log("Đã khởi tạo dữ liệu cưới lên Firebase lần đầu thành công!");
          }).catch(e => console.warn('Lỗi khởi tạo Firestore:', e));
        }
      }, (error) => {
        console.warn("Lỗi kết nối Firestore:", error);
      });
    } catch (err) {
      console.warn("initFirestoreSync failed:", err);
    }
  }

  saveData(newData) {
    if (newData) {
      this.data = newData;
    }
    // 1. Lưu dự phòng vào localStorage
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Lỗi lưu localStorage:', e);
    }
    // 2. Đồng bộ trực tiếp lên Google Cloud Firestore
    if (firestoreDb) {
      firestoreDb.collection("wedding_data").doc("main_info").set(this.data)
        .then(() => {
          console.log("Đã lưu lên Firebase thành công!");
          if (typeof showToast === 'function') {
            showToast('☁️ Dữ liệu đã lưu lên Google Cloud! Tất cả khách mời đều thấy ngay.');
          }
        })
        .catch((error) => {
          console.error("Lỗi đồng bộ Firebase:", error);
        });
    }
  }

  resetDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_WEDDING_DATA));
    this.saveData();
    return this.data;
  }

  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      this.data = { ...DEFAULT_WEDDING_DATA, ...parsed };
      this.saveData();
      return true;
    } catch (e) {
      alert('File JSON không hợp lệ!');
      return false;
    }
  }

  exportDataJsFile() {
    if (window.weddingDB) {
      window.weddingDB.exportDataJsFile();
    }
  }

  addGuest(name, side = 'Nhà Trai') {
    const cleanName = name.trim();
    if (!cleanName) return null;
    const id = 'g_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const slug = encodeURIComponent(cleanName);
    const newGuest = { id, name: cleanName, slug, side, confirmed: false, count: 1 };
    this.data.guests.unshift(newGuest);
    this.saveData();
    return newGuest;
  }

  addBatchGuests(namesText, side = 'Nhà Trai') {
    const lines = namesText.split('\n').map(l => l.trim()).filter(Boolean);
    const added = [];
    lines.forEach(line => {
      const g = this.addGuest(line, side);
      if (g) added.push(g);
    });
    return added;
  }

  removeGuest(id) {
    this.data.guests = this.data.guests.filter(g => g.id !== id);
    this.saveData();
  }

  addWish(name, message, side = 'Khách Mời') {
    const newWish = {
      id: 'w_' + Date.now(),
      name: name.trim() || 'Người bạn thân thiết',
      message: message.trim(),
      time: 'Vừa xong',
      likes: 1
    };
    this.data.wishes.unshift(newWish);
    this.saveData();
    return newWish;
  }

  likeWish(id) {
    const wish = this.data.wishes.find(w => w.id === id);
    if (wish) {
      wish.likes = (wish.likes || 0) + 1;
      this.saveData();
      return wish.likes;
    }
    return 0;
  }
}

window.weddingDB = new WeddingDataManager();
