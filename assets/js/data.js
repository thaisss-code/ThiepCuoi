/**
 * Quản lý Dữ liệu Thiệp Cưới (Wedding Data Manager)
 * Lưu trữ State, LocalStorage, Import/Export JSON và Danh Sách Khách Mời
 */

const STORAGE_KEY = 'thiep_cuoi_online_data_v1';

const DEFAULT_WEDDING_DATA = {
  theme: 'rose', // 'rose', 'ruby', 'pearl', 'mint'
  envelopeTitle: 'Thiệp Mời Thành Hôn',
  messageIntro: 'Hôn nhân là đích đến của tình yêu đích thực, là khởi đầu cho một hành trình mới ngập tràn yêu thương và sẻ chia.',
  
  couple: {
    groom: 'Nguyễn Văn Đức',
    groomShort: 'Văn Đức',
    groomNickname: 'Đức Chibi',
    groomFather: 'Nguyễn Văn Hùng',
    groomMother: 'Trần Thị Lan',
    groomAvatar: 'assets/images/groom-bride.jpg',
    groomStory: 'Chàng trai chân thành, đam mê công nghệ và luôn dành trọn tình cảm cho người mình thương.',
    
    bride: 'Trần Thị Thùy Linh',
    brideShort: 'Thùy Linh',
    brideNickname: 'Linh Xinh',
    brideFather: 'Trần Văn Long',
    brideMother: 'Lê Thị Thu',
    brideAvatar: 'assets/images/groom-bride.jpg',
    brideStory: 'Cô gái dịu dàng, nụ cười tỏa nắng và là hậu phương ngọt ngào nhất của cuộc đời anh.',
    
    coverImage: 'assets/images/wedding-cover.jpg'
  },

  weddingDate: '2026-11-20T11:00:00',
  weddingDateDisplay: 'Thứ Sáu, 20 Tháng 11 Năm 2026',
  weddingLunarDate: 'Tức ngày 12 tháng 10 năm Bính Ngọ (Âm Lịch)',

  events: {
    vuQuy: {
      enabled: true,
      title: 'Lễ Vu Quy (Nhà Gái)',
      time: '08:30',
      date: '20/11/2026',
      lunar: '12/10 Âm lịch',
      location: 'Tư gia Nhà Gái',
      address: 'Số 68 Đường Hoa Hồng, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
      mapUrl: 'https://maps.google.com/?q=Hanoi'
    },
    thanhHon: {
      enabled: true,
      title: 'Lễ Thành Hôn (Nhà Trai)',
      time: '10:30',
      date: '20/11/2026',
      lunar: '12/10 Âm lịch',
      location: 'Tư gia Nhà Trai',
      address: 'Số 126 Đường Hạnh Phúc, Phường Kim Mã, Quận Ba Đình, Hà Nội',
      mapUrl: 'https://maps.google.com/?q=Hanoi'
    },
    tiecCuoi: {
      enabled: true,
      title: 'Tiệc Cưới Trọng Thể',
      time: '11:30',
      date: '20/11/2026',
      lunar: '12/10 Âm lịch',
      location: 'Trung Tâm Tiệc Cưới & Hội Nghị Trống Đồng Palace',
      address: 'Sảnh Hoàng Gia - Tầng 2, Số 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
      mapUrl: 'https://maps.google.com/?q=Trong+Dong+Palace+Hoang+Quoc+Viet'
    }
  },

  music: {
    type: 'builtin',
    name: 'Hòa Tấu Lãng Mạn - Wedding Day Dreams (Tích Hợp)',
    url: ''
  },

  gallery: [
    'assets/images/wedding-cover.jpg',
    'assets/images/groom-bride.jpg',
    'assets/images/gallery-1.jpg',
    'assets/images/gallery-2.jpg'
  ],

  banking: {
    groom: {
      bank: 'Vietcombank',
      bankCode: 'VCB',
      accountNumber: '1029384756',
      accountName: 'NGUYEN VAN DUC'
    },
    bride: {
      bank: 'Techcombank',
      bankCode: 'TCB',
      accountNumber: '1903847562019',
      accountName: 'TRAN THI THUY LINH'
    }
  },

  guests: [
    { id: 'g1', name: 'Anh Tuấn & Bạn gái', slug: 'anh-tuan-va-ban-gai', side: 'Nhà Trai', confirmed: true, count: 2 },
    { id: 'g2', name: 'Chị Mai Phương', slug: 'chi-mai-phuong', side: 'Nhà Gái', confirmed: true, count: 1 },
    { id: 'g3', name: 'Gia đình Bác Hùng', slug: 'gia-dinh-bac-hung', side: 'Nhà Trai', confirmed: false, count: 4 },
    { id: 'g4', name: 'Tập thể Bạn Thân Đại Học', slug: 'tap-the-ban-than-dai-hoc', side: 'Nhà Trai', confirmed: true, count: 5 }
  ],

  wishes: [
    {
      id: 'w1',
      name: 'Thanh Hằng & Đức Minh',
      message: 'Chúc hai bạn trăm năm hạnh phúc, răng long đầu bạc, cuộc sống luôn ngập tràn tiếng cười và thương yêu nhau như ngày đầu!',
      time: '15 phút trước',
      likes: 12
    },
    {
      id: 'w2',
      name: 'Gia đình Bác Hùng',
      message: 'Chúc mừng hai cháu và hai họ! Chúc tổ ấm mới của hai cháu luôn an khang, thịnh vượng và vạn sự như ý.',
      time: '1 giờ trước',
      likes: 8
    },
    {
      id: 'w3',
      name: 'Hoàng Long (FPTU)',
      message: 'Chúc mừng anh bạn nối khố đã tìm được bến đỗ bình yên! Hôm tới nhất định nâng ly chúc mừng tới bến nhé!',
      time: '3 giờ trước',
      likes: 19
    }
  ]
};

class WeddingDataManager {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_WEDDING_DATA, ...parsed };
      }
    } catch (e) {
      console.warn('Lỗi đọc localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_WEDDING_DATA));
  }

  saveData(newData) {
    if (newData) {
      this.data = newData;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Lỗi lưu localStorage:', e);
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

  // Khách mời
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

  // Lời chúc & RSVP
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
