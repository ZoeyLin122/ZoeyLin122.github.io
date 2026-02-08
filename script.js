
// --- 狀態變數 ---
let currentDay = 1;
let currentYear = 2026;
let currentMonth = 4;
let userPoints = 200; // 初始分數模擬 (提高方便測試)
let tempDiaryEntry = null;
let currentImage = null;
let currentShopCategory = 'body'; // 預設商店分類
let pendingItem = null; // 待購買道具
const views = ['home', 'calendar', 'day-list', 'step-1', 'step-2', 'step-3', 'step-4', 'preview', 'canvas', 'profile', 'leaderboard'];
const diaryData = {};

// 模擬使用者成就狀態 (小明)
const userStats = {
    consecutiveDays: 5,     // 連續天數
    replyCount: 8,          // 回覆同學次數
    classAnswers: 6,        // 課堂回答次數
    itemsUnlocked: 0,       // 解鎖道具數 (會在 onload 校正)
    goodAssignment: true,   // 作業表現良好
    diaryComplete: true     // 日記表達完整
};

// 模擬其他學生的數據 (排行榜用)
const mockStudents = [
    {
        name: "小華",
        badgeCount: 8,
        badges: ["情緒紀錄者", "情緒觀察員", "溫暖回應者", "收集者"],
        avatarConfig: { bodyColor: '#f87171', faceColor: '#fee2e2', hair: 'item9', glasses: 'item2', face: null, action: 'item3' }
    },
    {
        name: "小美",
        badgeCount: 6,
        badges: ["情緒紀錄者", "課堂積極參與者", "理解他人者"],
        avatarConfig: { bodyColor: '#60a5fa', faceColor: '#fecaca', hair: 'item10', glasses: null, face: 'item1', action: null }
    },
    {
        name: "阿強",
        badgeCount: 4,
        badges: ["情緒紀錄者", "收集者"],
        avatarConfig: { bodyColor: '#facc15', faceColor: '#fef08a', hair: null, glasses: 'item2', face: null, action: 'item5' }
    },
    {
        name: "小莉",
        badgeCount: 9,
        badges: ["情緒管理達人", "情緒觀察員", "溫暖回應者", "收集專家", "作業表現良好"],
        avatarConfig: { bodyColor: '#a78bfa', faceColor: '#ede9fe', hair: 'item10', glasses: null, face: 'item1', action: 'item8' }
    }
];

// 商店道具資料 (包含分類、價錢、鎖定狀態、裝備狀態)
const shopItems = [
    // 身體 (Body) - 必須選一個，取代原本的顏色互斥
    // 請替換這裡的 URL 為您的身體圖片
    { id: 'body1', category: 'body', name: '橙色', price: 0, unlocked: true, equipped: true, zIndex: 10, imgSrc: 'https://i.ibb.co/nN3Ry5Qh/9.png' }, 
    { id: 'body2', category: 'body', name: '粉色', price: 20, unlocked: false, equipped: false, zIndex: 10, imgSrc: 'https://i.ibb.co/HDLFFZ8Q/6.png' }, // 示意：實際請換成紅色的圖
    { id: 'body3', category: 'body', name: '灰色', price: 20, unlocked: false, equipped: false, zIndex: 10, imgSrc: 'https://i.ibb.co/SDjhnH1z/7.png' },
    { id: 'body4', category: 'body', name: '鵝黃色', price: 25, unlocked: false, equipped: false, zIndex: 10, imgSrc: 'https://i.ibb.co/Lh85WH5Y/11.png' },
    { id: 'body5', category: 'body', name: '藍色', price: 25, unlocked: false, equipped: false, zIndex: 10, imgSrc: 'https://i.ibb.co/8nqqqgDp/14.png' },
    { id: 'body6', category: 'body', name: '紫色', price: 25, unlocked: false, equipped: false, zIndex: 10, imgSrc: 'https://i.ibb.co/G3R5wk20/16.png' },
    { id: 'body7', category: 'body', name: '綠色', price: 25, unlocked: false, equipped: false, zIndex: 10, imgSrc: 'https://i.ibb.co/hRRbThmv/20.png' },
    
    // 頭髮 (Hair) - zIndex: 30
    { id: 'hair1', category: 'hair', name: '短髮_油頭', price: 40, unlocked: false, equipped: false, zIndex: 30, imgSrc: 'https://i.ibb.co/QFNz8ZBr/24.png' },
    { id: 'hair2', category: 'hair', name: '短捲髮_羊毛捲', price: 45, unlocked: false, equipped: false, zIndex: 30, imgSrc: 'https://i.ibb.co/4L6SYDJ/26.png' },
    { id: 'hair3', category: 'hair', name: '中捲髮_復古捲', price: 40, unlocked: false, equipped: false, zIndex: 30, imgSrc: 'https://i.ibb.co/7LxMtqd/23.png' },
    { id: 'hair4', category: 'hair', name: '短捲髮_瀏海', price: 40, unlocked: false, equipped: false, zIndex: 30, imgSrc: 'https://i.ibb.co/gLKhGYky/29.png' },
    { id: 'hair5', category: 'hair', name: '短捲髮_無瀏海', price: 40, unlocked: false, equipped: false, zIndex: 30, imgSrc: 'https://i.ibb.co/tpSCv6gZ/25.png' },
    { id: 'hair6', category: 'hair', name: '長髮_瀏海', price: 40, unlocked: false, equipped: false, zIndex: 30, imgSrc: 'https://i.ibb.co/Q3mVjxBB/28.png' },
    { id: 'hair7', category: 'hair', name: '短髮_無瀏海', price: 40, unlocked: false, equipped: false, zIndex: 30, imgSrc: 'https://i.ibb.co/tpSCv6gZ/25.png' },

    // 眼鏡 (Glasses) - zIndex: 40
    { id: 'glasses1', category: 'glasses', name: '圓框眼鏡', price: 30, unlocked: false, equipped: false, zIndex: 40, imgSrc: 'https://i.ibb.co/WNFThVFp/22.png' },
    { id: 'glasses3', category: 'glasses', name: '黑色墨鏡', price: 30, unlocked: false, equipped: false, zIndex: 40, imgSrc: 'https://i.ibb.co/rJpLyhR/24.png' },
    { id: 'glasses4', category: 'glasses', name: '藍色墨鏡', price: 30, unlocked: false, equipped: false, zIndex: 40, imgSrc: 'https://i.ibb.co/TxTvdGhh/25.png' },
    { id: 'glasses5', category: 'glasses', name: '鳳梨墨鏡', price: 30, unlocked: false, equipped: false, zIndex: 40, imgSrc: 'https://i.ibb.co/Mk9pCnVQ/26.png' },
    { id: 'glasses6', category: 'glasses', name: '花花墨鏡', price: 30, unlocked: false, equipped: false, zIndex: 40, imgSrc: 'https://i.ibb.co/V0WP15HK/27.png' },
    { id: 'glasses7', category: 'glasses', name: '豹紋墨鏡', price: 30, unlocked: false, equipped: false, zIndex: 40, imgSrc: 'https://i.ibb.co/HTBSVvSG/28.png' },
    { id: 'glasses8', category: 'glasses', name: '生日快樂墨鏡', price: 30, unlocked: false, equipped: false, zIndex: 40, imgSrc: 'https://i.ibb.co/N6y0SJRL/29.png' },

    // 表情 (Face) - zIndex: 20
    { id: 'face1', category: 'face', name: '喜', price: 30, unlocked: true, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/7tbM6Nxy/30.png' },
    { id: 'face2', category: 'face', name: '樂', price: 30, unlocked: false, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/5gby29g3/31.png' },
    { id: 'face3', category: 'face', name: '怕', price: 30, unlocked: false, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/W4fWd4s9/32.png' },
    { id: 'face4', category: 'face', name: '怒', price: 30, unlocked: false, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/rKNDyJZz/33.png' },
    { id: 'face5', category: 'face', name: '泣', price: 30, unlocked: false, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/HTZYjLZ0/34.png' },
    { id: 'face6', category: 'face', name: '愣', price: 30, unlocked: false, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/gZhwspzy/35.png' },
    { id: 'face7', category: 'face', name: '呆', price: 30, unlocked: false, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/S4Bmx8j6/36.png' },

    // 帽子 (Hat) - zIndex: 50
    { id: 'hat1', category: 'hat', name: '草帽', price: 30, unlocked: false, equipped: false, zIndex: 50, imgSrc: 'https://i.ibb.co/tM56J1T4/3.png' },
    { id: 'hat2', category: 'hat', name: '聖誕帽', price: 30, unlocked: false, equipped: false, zIndex: 50, imgSrc: 'https://i.ibb.co/h1WG0Wz2/4.png' },
    { id: 'hat3', category: 'hat', name: '南瓜帽', price: 30, unlocked: false, equipped: false, zIndex: 50, imgSrc: 'https://i.ibb.co/9mgtGjN7/5.png' },
    { id: 'hat4', category: 'hat', name: '魔法帽', price: 30, unlocked: false, equipped: false, zIndex: 50, imgSrc: 'https://i.ibb.co/8gFbSPsd/6.png' },
    { id: 'hat5', category: 'hat', name: '聖誕帽', price: 30, unlocked: false, equipped: false, zIndex: 50, imgSrc: 'https://i.ibb.co/hJGPS3sP/7.png' },

    // 配件 (Accessories) - zIndex: 50
    { id: 'accessories1', category: 'accessories', name: '藍蝴蝶結', price: 30, unlocked: false, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/xqP08qgS/8.png' },
    { id: 'accessories2', category: 'accessories', name: '紅蝴蝶結', price: 30, unlocked: false, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/0VfqD0VD/9.png' },
    { id: 'accessories3', category: 'accessories', name: '點點領帶', price: 30, unlocked: false, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/gLgDdd69/10.png' },
    { id: 'accessories4', category: 'accessories', name: '條紋領帶', price: 30, unlocked: false, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/GfFr8CkR/11.png' },
    { id: 'accessories5', category: 'accessories', name: '鬍子', price: 30, unlocked: false, equipped: false, zIndex: 20, imgSrc: 'https://i.ibb.co/LDy2P4K5/12.png' },

    // 手持小物 (Hand) - zIndex: 60
    { id: 'hand1', category: 'hand', name: '畫盤', price: 30, unlocked: false, equipped: false, zIndex: 60, imgSrc: 'https://i.ibb.co/Lz02vR1k/14.png' },
    { id: 'hand2', category: 'hand', name: '畫筆', price: 30, unlocked: false, equipped: false, zIndex: 60, imgSrc: 'https://i.ibb.co/mCyhs5QB/15.png' },
    { id: 'hand3', category: 'hand', name: '泰迪熊', price: 30, unlocked: false, equipped: false, zIndex: 60, imgSrc: 'https://i.ibb.co/JWtckqTS/16.png' },
    { id: 'hand4', category: 'hand', name: '珍奶', price: 30, unlocked: false, equipped: false, zIndex: 60, imgSrc: 'https://i.ibb.co/Vcmj0JHc/17.png' },
    { id: 'hand5', category: 'hand', name: '漢堡', price: 30, unlocked: false, equipped: false, zIndex: 60, imgSrc: 'https://i.ibb.co/8gNcSD2Y/18.png' },
    { id: 'hand6', category: 'hand', name: '薯條', price: 30, unlocked: false, equipped: false, zIndex: 60, imgSrc: 'https://i.ibb.co/Wpz5vWGT/19.png' },
    { id: 'hand7', category: 'hand', name: '冰淇淋', price: 30, unlocked: false, equipped: false, zIndex: 60, imgSrc: 'https://i.ibb.co/wZkKjm16/20.png' },
    { id: 'hand8', category: 'hand', name: '相機', price: 30, unlocked: false, equipped: false, zIndex: 60, imgSrc: 'https://i.ibb.co/35PKdjft/21.png' },
    { id: 'hand9', category: 'hand', name: '手機', price: 30, unlocked: false, equipped: false, zIndex: 60, imgSrc: 'https://i.ibb.co/FkZMDCZv/13.png' },
];

// 勳章定義 (會動態檢查 unlocked 狀態)
// 為了實作解鎖通知，我們需要在物件中增加 unlocked 狀態屬性，而不是只靠函數計算
const badgesConfig = [
    { id: 'b1', name: '情緒紀錄者', icon: '📝', check: () => userStats.consecutiveDays >= 3, unlocked: false },
    { id: 'b2', name: '情緒觀察員', icon: '🕵️', check: () => userStats.consecutiveDays >= 7, unlocked: false },
    { id: 'b3', name: '情緒管理達人', icon: '🧘', check: () => userStats.consecutiveDays >= 14, unlocked: false },
    { id: 'b4', name: '作業表現良好', icon: '📚', check: () => userStats.goodAssignment, unlocked: false },
    { id: 'b5', name: '情緒日記表達完整', icon: '🌟', check: () => userStats.diaryComplete, unlocked: false },
    { id: 'b6', name: '課堂積極參與者', icon: '🙋', check: () => userStats.classAnswers >= 5, unlocked: false },
    { id: 'b7', name: '溫暖回應者', icon: '❤️', check: () => userStats.replyCount >= 5, unlocked: false },
    { id: 'b8', name: '理解他人者', icon: '🤝', check: () => userStats.replyCount >= 10, unlocked: false },
    { id: 'b9', name: '收集者', icon: '🎒', check: () => userStats.itemsUnlocked >= 4, unlocked: false },
    { id: 'b10', name: '收集專家', icon: '🏆', check: () => userStats.itemsUnlocked >= 8, unlocked: false }
];

// 模擬共感畫布資料
let sharedPosts = [
    {
        id: 1,
        date: "2026/03/28",
        feel: "覺得很挫折，因為努力了很久卻沒有進步，但我相信休息一下會更好。",
        image: "https://picsum.photos/seed/10/600/400",
        likes: 12,
        likedByMe: false,
        comments: [{ author: "小華", text: "加油！我也遇過這樣的情況，休息一下再出發！" }]
    },
    {
        id: 2,
        date: "2026/03/30",
        feel: "今天超開心的！終於完成了專題報告，感覺如釋重負。",
        image: "https://picsum.photos/seed/20/600/400",
        likes: 8,
        likedByMe: false,
        comments: []
    }
];

// --- 初始化 ---
window.onload = function() {
    renderCalendar();
    // 初始化範例按鈕內容
    initExamples();
    
    // 初始化 itemsUnlocked 數量
    userStats.itemsUnlocked = shopItems.filter(i => i.unlocked && i.category !== 'body').length; 
    
    // 初始化勳章狀態 (避免頁面載入時跳出通知)
    badgesConfig.forEach(badge => {
        if (badge.check()) {
            badge.unlocked = true;
        }
    });
    
    updatePointsUI();
};

// --- 檢查並解鎖新勳章 (核心邏輯) ---
function checkBadges() {
    let hasNewUnlock = false;
    
    badgesConfig.forEach(badge => {
        // 如果條件滿足 且 尚未解鎖
        if (badge.check() && !badge.unlocked) {
            badge.unlocked = true;
            showBadgeModal(badge);
            hasNewUnlock = true;
        }
    });

    if (hasNewUnlock && !document.getElementById('view-profile').classList.contains('hidden-view')) {
        renderProfile(); // 如果正在個人頁面，刷新勳章牆
    }
}

// --- 勳章 Modal 邏輯 ---
function showBadgeModal(badge) {
    document.getElementById('badge-modal-icon').textContent = badge.icon;
    document.getElementById('badge-modal-name').textContent = badge.name;
    document.getElementById('modal-badge-unlocked').classList.remove('hidden');
}

function closeBadgeModal() {
    document.getElementById('modal-badge-unlocked').classList.add('hidden');
}

// --- 範例資料 ---
function initExamples() {
    const obsContainer = document.getElementById('obs-examples');
    const obsExamples = [
        "今天在(什麼地方)我(做什麼事情)", "我聽到(什麼事情)", 
        "我今天和(誰)在(哪裡)(什麼事情)", "今天(什麼時間)，(誰)對我說了(什麼話)", 
        "在(什麼地方)，發生了(一件什麼樣的事)", "(什麼時候)我在(哪裡)看到(什麼事情)", 
        "當我看到 / 聽到 (什麼事情)"
    ];
    obsContainer.innerHTML = obsExamples.map(text => 
        `<div onclick="addText('input-obs', '${text}')" class="example-chip p-3 rounded-lg text-sm border border-gray-100">${text}</div>`
    ).join('');

    const reqEncourage = document.getElementById('content-encourage');
    const reqCommunicate = document.getElementById('content-communicate');
    const reqCelebrate = document.getElementById('content-celebrate');

    reqEncourage.innerHTML = [
        "因為我現在感到(情緒)，所以我決定先(做什麼樣的事情)",
        "為了照顧我對(需求)的重視，我要告訴自己：『( 一句鼓勵自己的話) 』",
        "我現在還沒準備好面對，所以我決定先(做一件讓自己快樂的事情)"
    ].map(t => `<div onclick="addText('input-req', '${t}')" class="example-chip p-3 rounded-lg text-sm border border-gray-100">${t}</div>`).join('');

    reqCommunicate.innerHTML = [
        "你願不願意(提出一項具體的方法)......", "你可不可以(提出一項具體的方法)......"
    ].map(t => `<div onclick="addText('input-req', '${t}')" class="example-chip p-3 rounded-lg text-sm border border-gray-100">${t}</div>`).join('');

    reqCelebrate.innerHTML = [
        "這件事讓我太(感受)了！所以我決定去跟(對象)說：『(感謝的話)』",
        "為了記住這個美好的時刻，我決定(做一個紀錄的動作)",
        "我要(做一件開心的事)來獎勵自己！"
    ].map(t => `<div onclick="addText('input-req', '${t}')" class="example-chip p-3 rounded-lg text-sm border border-gray-100">${t}</div>`).join('');
}

// --- 導航控制 ---
function navigate(viewName) {
    views.forEach(v => document.getElementById(`view-${v}`).classList.add('hidden-view'));
    document.getElementById(`view-${viewName}`).classList.remove('hidden-view');
    
    if (viewName === 'calendar') renderCalendar();
    if (viewName === 'canvas') renderCanvas();
    if (viewName === 'profile') {
        renderProfile();
        filterShop(currentShopCategory); // 預設顯示頭髮
    }
    if (viewName === 'leaderboard') renderLeaderboard(); // 渲染排行榜
    window.scrollTo(0, 0);
}

// --- 核心修改: Avatar HTML 產生器 ---
function generateAvatarHTML(configMap) {
    // configMap 是一個物件，例如 { hair: 'hair1', body: 'body1' ... }
    let layersHtml = '';
    
    // 遍歷所有類別，找到對應的圖片並根據 zIndex 堆疊
    // 為了確保 zIndex 正確，我們應該去 shopItems 找資料
    const equippedItems = [];
    
    // 將 configMap 轉為 Item 物件列表
    for (const category in configMap) {
        const itemId = configMap[category];
        if (itemId) {
            const item = shopItems.find(i => i.id === itemId);
            if (item) equippedItems.push(item);
        }
    }

    // 根據 zIndex 排序 (小的在後面)
    equippedItems.sort((a, b) => a.zIndex - b.zIndex);

    // 產生 HTML
    equippedItems.forEach(item => {
        // 使用 object-contain 確保圖片完整顯示，absolute inset-0 讓它們重疊
        // 這裡使用了假圖片，您可以將 item.imgSrc 換成真實路徑
        
        // 如果是身體顏色不同，可以在這裡加 filter，或者直接使用不同的 imgSrc
        let style = `z-index: ${item.zIndex};`;
        layersHtml += `<img src="${item.imgSrc}" class="avatar-layer absolute inset-0 w-full h-full object-contain" style="${style}" alt="${item.name}">`;
    });

    return layersHtml;
}
// --- Leaderboard Rendering ---
function renderLeaderboard() {
    const listContainer = document.getElementById('leaderboard-list');
    listContainer.innerHTML = '';
    const myBadges = badgesConfig.filter(b => b.unlocked);
    
    // 取得我當前的裝備設定
    const myEquippedMap = {};
    shopItems.forEach(item => {
        if(item.equipped) myEquippedMap[item.category] = item.id;
    });

    const me = { name: "小明 (我)", badgeCount: myBadges.length, badges: myBadges.map(b => b.name), avatarConfig: myEquippedMap, isMe: true };
    const allStudents = [me, ...mockStudents];
    allStudents.sort((a, b) => b.badgeCount - a.badgeCount);

    allStudents.forEach((student, index) => {
        const rank = index + 1;
        let rankClass = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "rank-other";
        
        // 呼叫新的 Image Generator
        const avatarHtml = generateAvatarHTML(student.avatarConfig);

        const badgesHtml = student.badges.length > 0 ? student.badges.map(b => `<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md mr-1 mb-1 inline-block">${b}</span>`).join('') : `<span class="text-xs text-gray-400">尚未獲得勳章</span>`;

        const row = document.createElement('div');
        row.className = `flex items-center bg-white p-4 rounded-xl border ${student.isMe ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-100'} rank-item shadow-sm`;
        row.innerHTML = `
            <div class="mr-4 flex-shrink-0"><div class="rank-badge ${rankClass}">${rank}</div></div>
            <div class="w-16 h-16 mr-4 flex-shrink-0 relative">
                <div class="w-full h-full bg-white rounded-full border-2 border-orange-100 overflow-hidden relative">
                    ${avatarHtml}
                </div>
            </div>
            <div class="flex-grow">
                <div class="flex justify-between items-start">
                    <h4 class="font-bold text-gray-800 text-lg">${student.name}</h4>
                    <div class="text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-full text-sm flex items-center"><span class="mr-1">🏅</span> ${student.badgeCount}</div>
                </div>
                <div class="mt-2 flex flex-wrap">${badgesHtml}</div>
            </div>`;
        listContainer.appendChild(row);
    });
}




// --- Profile 渲染邏輯 ---
function renderProfile() {
    // 更新 Profile Header 數據
    document.getElementById('profile-points-display').textContent = userPoints;
    document.getElementById('profile-items-display').textContent = userStats.itemsUnlocked;

    // 0. 渲染角色外觀
    updateCharacterAppearance();

    // 1. 渲染挑戰進度條 (Modified for progress bar style)
    const consecutiveDays = userStats.consecutiveDays;
    const totalDays = 14;
    const progressPercent = (consecutiveDays / totalDays) * 100;
    
    // Update text
    document.getElementById('challenge-text').textContent = `${consecutiveDays} / ${totalDays} 天`;
    document.getElementById('challenge-status-text').textContent = `挑戰進行中：第 ${consecutiveDays} 天`;
    
    // Update bar width and label
    const bar = document.getElementById('challenge-bar');
    bar.style.width = `${progressPercent}%`;
    
    // Ensure percentage text is updated
    const percentText = document.getElementById('challenge-percent');
    percentText.textContent = `${Math.round(progressPercent)}%`;

    // 2. 渲染道具商店 (這部分現在由 filterShop 觸發)
    // renderShop(); 

    // 3. 渲染勳章
    const badgeContainer = document.getElementById('badges-container');
    badgeContainer.innerHTML = '';
    badgesConfig.forEach(badge => {
        const isUnlocked = badge.unlocked; // 使用狀態屬性而不是函數
        const card = document.createElement('div');
        card.className = `badge-card bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center border border-gray-100 ${isUnlocked ? 'bg-white shadow-sm' : 'badge-locked'}`;
        
        const iconBg = isUnlocked ? 'bg-yellow-100' : 'bg-gray-200';
        
        card.innerHTML = `
            <div class="w-16 h-16 rounded-full ${iconBg} flex items-center justify-center text-3xl mb-3 shadow-inner">
                ${badge.icon}
            </div>
            <h4 class="font-bold text-gray-800 text-sm mb-1">${badge.name}</h4>
            ${isUnlocked ? '<span class="text-xs text-green-500 font-bold mt-2">✨ 已解鎖</span>' : '<span class="text-xs text-gray-400 mt-2">🔒 未解鎖</span>'}
        `;
        badgeContainer.appendChild(card);
    });
}

    // --- 核心修改: 個人頁面角色更新 ---
function updateCharacterAppearance() {
    const container = document.getElementById('avatar-container');
    
    // 取得目前裝備的項目 Map
    const currentEquippedMap = {};
    shopItems.forEach(item => {
        if(item.equipped) currentEquippedMap[item.category] = item.id;
    });

    // 清空並重新插入圖片
    container.innerHTML = generateAvatarHTML(currentEquippedMap);

    // 視覺特效：角色彈跳
    container.classList.remove('avatar-bounce');
    void container.offsetWidth; 
    container.classList.add('avatar-bounce');
}

// --- 商店邏輯 ---
function filterShop(category) {
    currentShopCategory = category;
    
    // 更新 Tabs 樣式
    const tabs = ['hair', 'glasses', 'face', 'body', 'hat', 'accessories', 'hand'];
    tabs.forEach(c => {
        const btn = document.getElementById(`tab-${c}`);
        if (c === category) {
            btn.classList.add('active');
            btn.classList.remove('inactive');
        } else {
            btn.classList.remove('active');
            btn.classList.add('inactive');
        }
    });

    renderShop(category);
}

function renderShop(category) {
    const container = document.getElementById('shop-container');
    container.innerHTML = '';
    const itemsToShow = shopItems.filter(item => item.category === category);
    
    itemsToShow.forEach(item => {
        const card = document.createElement('div');
        card.className = `shop-card bg-white rounded-xl p-4 flex flex-col items-center text-center relative overflow-hidden cursor-pointer ${item.equipped ? 'border-orange-400 bg-orange-50' : (item.unlocked ? 'border-gray-200' : 'border-gray-100')}`;
        card.onclick = () => toggleItem(item.id);

        let statusHtml = '';
        if (item.equipped) statusHtml = `<div class="mt-2 text-xs font-bold text-white bg-orange-500 px-3 py-1 rounded-full">使用中</div>`;
        else if (item.unlocked) statusHtml = `<div class="mt-2 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">已擁有</div>`;
        else statusHtml = `<div class="mt-2 text-xs font-bold text-white bg-green-500 px-3 py-1 rounded-full">$${item.price}</div>`;

        // 商店圖標如果是圖片，可以顯示縮略圖
        let iconDisplay = item.imgSrc 
            ? `<img src="${item.imgSrc}" class="w-8 h-8 object-contain">` 
            : item.icon;

        card.innerHTML = `<div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl mb-2 shadow-inner overflow-hidden">${iconDisplay}</div><h4 class="font-bold text-gray-800 text-sm flex-grow">${item.name}</h4>${statusHtml}`;
        container.appendChild(card);
    });
}

function toggleItem(id) {
    const item = shopItems.find(i => i.id === id);
    if (!item) return;

    // 情況 1: 尚未解鎖 -> 購買流程 (修改為彈出視窗)
    if (!item.unlocked) {
        if (userPoints >= item.price) {
            openBuyModal(item);
        } else {
            showToast("能量點數不足！再多寫幾篇日記吧！");
        }
        return;
    }

    // 情況 2: 已解鎖 -> 裝備/卸下流程
    if (item.equipped) {
        // 如果已經裝備，再次點擊是否卸下？
        // 對於身體顏色，不能卸下(必須有一個)，除非切換。
        // 對於頭髮/動作，可以卸下變成光頭/空手。
        if (item.category === 'body') return; // 顏色不能取消，只能換別的
        item.equipped = false;
        showToast(`卸下 ${item.name}`);
    } else {
        equipItem(item);
    }
    
    // 更新 UI
    updatePointsUI();
    renderProfile(); // 更新角色與數據
    filterShop(currentShopCategory); // 重新渲染商店狀態
}

function openBuyModal(item) {
    pendingItem = item;
    document.getElementById('buy-modal-name').textContent = item.name;
    document.getElementById('buy-modal-price').textContent = item.price;
    document.getElementById('modal-buy-confirm').classList.remove('hidden');
}

function closeBuyModal() {
    document.getElementById('modal-buy-confirm').classList.add('hidden');
    pendingItem = null;
}

function confirmPurchase() {
    if (!pendingItem) return;
    
    const item = pendingItem;
    closeBuyModal(); // Close first

    // Execute purchase logic
    userPoints -= item.price;
    item.unlocked = true;
    userStats.itemsUnlocked++; 
    
    showToast(`購買成功！獲得 ${item.name}`);
    equipItem(item); // Auto equip
    
    updatePointsUI();
    checkBadges(); // 購買後檢查是否有新勳章
    renderProfile(); 
    filterShop(currentShopCategory);
}

function equipItem(targetItem) {
    // 根據類別處理互斥邏輯
    if (['hair', 'face', 'glasses', 'body','hat', 'accessories', 'hand'].includes(targetItem.category)) {
        // 找出同類別已裝備的物品，將其卸下 (body 必選一個，其他可選)
        // 注意：動作類別這裡設定為互斥(一次拿一樣)，如果想混搭可修改此處
        shopItems.filter(i => i.category === targetItem.category && i.id !== targetItem.id).forEach(i => i.equipped = false);
    }
    
    targetItem.equipped = true;
    
    // 視覺特效：角色彈跳
    const avatar = document.getElementById('avatar-container');
    if(avatar) {
        avatar.classList.remove('avatar-bounce');
        void avatar.offsetWidth; // 觸發重繪
        avatar.classList.add('avatar-bounce');
    }
}

// --- 日曆邏輯 ---
function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 1) { currentMonth = 12; currentYear--; } 
    else if (currentMonth > 12) { currentMonth = 1; currentYear++; }
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const title = document.getElementById('calendar-title');
    grid.innerHTML = '';
    
    const monthNames = ["", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    title.textContent = `${currentYear} ${monthNames[currentMonth]}`;

    const days = ['日', '一', '二', '三', '四', '五', '六'];
    let html = days.map(d => `<div class="font-bold text-gray-400 py-2">${d}</div>`).join('');

    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth, 0).getDate();

    for(let i=0; i<firstDay; i++) html += `<div class="calendar-day empty"></div>`;
    grid.innerHTML = html;

    for(let i=1; i<=totalDays; i++) {
        const dateStr = `${currentYear}/${String(currentMonth).padStart(2,'0')}/${String(i).padStart(2,'0')}`;
        const entries = diaryData[dateStr];
        
        let style = '', content = `<span class="relative z-10">${i}</span>`, classes = 'text-gray-700';
        if (entries && entries.length > 0) {
            const imgEntry = [...entries].reverse().find(e => e.image);
            if (imgEntry) {
                style = `background-image: url('${imgEntry.image}'); background-size: cover; background-position: center;`;
                content = `<span class="relative z-10 bg-white/80 px-1.5 py-0.5 rounded-md shadow-sm text-xs md:text-sm font-bold text-orange-800">${i}</span>`;
                classes = '';
            } else {
                content += `<div class="absolute bottom-1 w-1.5 h-1.5 bg-orange-500 rounded-full left-1/2 transform -translate-x-1/2"></div>`;
            }
        }

        const cell = document.createElement('div');
        cell.className = `calendar-day flex flex-col items-center justify-center text-sm md:text-lg relative overflow-hidden cursor-pointer ${classes}`;
        if (style) cell.style.cssText = style;
        cell.innerHTML = content;
        cell.onclick = () => openDayList(i);
        grid.appendChild(cell);
    }
}

// --- 日記列表邏輯 ---
function openDayList(day) {
    currentDay = day;
    const dateStr = `${currentYear}/${String(currentMonth).padStart(2,'0')}/${String(day).padStart(2,'0')}`;
    document.getElementById('day-list-title').textContent = dateStr;
    renderEntries(dateStr);
    navigate('day-list');
}

function renderEntries(dateStr) {
    const container = document.getElementById('entries-container');
    const entries = diaryData[dateStr] || [];
    container.innerHTML = entries.length === 0 
        ? `<div class="text-center text-gray-400 py-8"><p>今天還沒有日記喔！</p><p class="text-sm">點擊下方按鈕開始紀錄</p></div>`
        : '';

    entries.forEach((entry, index) => {
        const imgHtml = entry.image ? `<div class="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 ml-3"><img src="${entry.image}" class="w-full h-full object-cover"></div>` : '';
        const card = document.createElement('div');
        card.className = "bg-white p-5 rounded-2xl shadow-sm border border-orange-100 flex justify-between items-start cursor-pointer hover:shadow-md transition-shadow";
        card.onclick = () => viewDiaryEntry(dateStr, index);
        card.innerHTML = `
            <div class="flex-grow overflow-hidden">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-md">第 ${index + 1} 篇</span>
                    <span class="text-xs text-gray-400">${entry.time}</span>
                </div>
                <h4 class="font-bold text-gray-800 truncate mb-1">${entry.obs ? entry.obs.substring(0, 20) + '...' : '未命名日記'}</h4>
                <p class="text-sm text-gray-500 truncate">${entry.feel ? '感受: ' + entry.feel : ''}</p>
            </div>
            ${imgHtml}`;
        container.appendChild(card);
    });
}

// --- 日記檢視模式 ---
function viewDiaryEntry(dateStr, index) {
    const entry = diaryData[dateStr][index];
    document.getElementById('preview-obs').textContent = entry.obs;
    document.getElementById('preview-feel').textContent = entry.feel;
    document.getElementById('preview-need').textContent = entry.need;
    document.getElementById('preview-req').textContent = entry.req;
    document.getElementById('date-display-preview').textContent = entry.date;

    const imgDisplay = document.getElementById('result-image');
    const placeholder = document.getElementById('placeholder-text');
    if (entry.image) {
        imgDisplay.src = entry.image;
        imgDisplay.classList.remove('hidden');
        placeholder.classList.add('hidden');
    } else {
        imgDisplay.classList.add('hidden');
        placeholder.classList.remove('hidden');
        placeholder.textContent = "此篇日記沒有配圖";
    }

    // UI Mode: View
    document.getElementById('image-control-tabs').classList.add('hidden');
    document.getElementById('control-upload').classList.add('hidden');
    document.getElementById('control-ai').classList.add('hidden');
    document.getElementById('btn-group-create').classList.add('hidden');
    document.getElementById('btn-group-view').classList.remove('hidden');
    navigate('preview');
}

// --- 寫作流程 ---
function startWriting() {
    const dateStr = `${currentYear}/${String(currentMonth).padStart(2,'0')}/${String(currentDay).padStart(2,'0')}`;
    document.querySelectorAll('.date-display').forEach(el => el.textContent = dateStr);
    ['input-obs', 'input-feel', 'input-need', 'input-req'].forEach(id => document.getElementById(id).value = '');
    
    currentImage = null;
    document.getElementById('result-image').src = '';
    document.getElementById('result-image').classList.add('hidden');
    document.getElementById('placeholder-text').classList.remove('hidden');
    navigate('step-1');
}

function showPreview() {
    const dateStr = `${currentYear}/${String(currentMonth).padStart(2,'0')}/${String(currentDay).padStart(2,'0')}`;
    document.getElementById('date-display-preview').textContent = dateStr;
    document.getElementById('preview-obs').textContent = document.getElementById('input-obs').value || "(未填寫)";
    document.getElementById('preview-feel').textContent = document.getElementById('input-feel').value || "(未填寫)";
    document.getElementById('preview-need').textContent = document.getElementById('input-need').value || "(未填寫)";
    document.getElementById('preview-req').textContent = document.getElementById('input-req').value || "(未填寫)";

    // UI Mode: Create
    document.getElementById('image-control-tabs').classList.remove('hidden');
    toggleImageMode('upload');
    document.getElementById('btn-group-create').classList.remove('hidden');
    document.getElementById('btn-group-view').classList.add('hidden');
    navigate('preview');
}

// --- AI 與圖片 ---
function toggleImageMode(mode) {
    const btnUp = document.getElementById('btn-mode-upload');
    const btnAi = document.getElementById('btn-mode-ai');
    const ctrlUp = document.getElementById('control-upload');
    const ctrlAi = document.getElementById('control-ai');
    
    const activeClass = "px-4 py-2 rounded-md text-sm font-bold bg-orange-100 text-orange-600 transition-all";
    const inactiveClass = "px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-orange-600 transition-all";

    if (mode === 'upload') {
        btnUp.className = activeClass; btnAi.className = inactiveClass;
        ctrlUp.classList.remove('hidden'); ctrlAi.classList.add('hidden');
    } else {
        btnAi.className = activeClass.replace('orange', 'indigo'); btnUp.className = inactiveClass;
        ctrlUp.classList.add('hidden'); ctrlAi.classList.remove('hidden');
    }
}

function handleFileUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImage = e.target.result;
            const img = document.getElementById('result-image');
            img.src = currentImage; img.classList.remove('hidden');
            document.getElementById('placeholder-text').classList.add('hidden');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

async function generateAIImage() {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('hidden');
    
    const obs = document.getElementById('input-obs').value;
    const feel = document.getElementById('input-feel').value;
    const need = document.getElementById('input-need').value;
    const prompt = `A soft, artistic illustration for diary. Mood: ${feel}. Need: ${need}. Context: ${obs}. Style: Dreamy watercolor, pastel colors, abstract but comforting.`;

    // 模擬 AI 生成 (實際串接需在後端或填入 Key)
    setTimeout(() => {
        spinner.classList.add('hidden');
        // 使用 Picsum 作為範例
        const randomId = Math.floor(Math.random() * 100);
        currentImage = `https://picsum.photos/seed/${randomId}/600/400`;
        const img = document.getElementById('result-image');
        img.src = currentImage; img.classList.remove('hidden');
        document.getElementById('placeholder-text').classList.add('hidden');
        showToast("AI 圖像生成成功！");
    }, 2000);
}

// --- 儲存與分享流程 ---
async function initiateSaveSequence() {
    const dateStr = `${currentYear}/${String(currentMonth).padStart(2,'0')}/${String(currentDay).padStart(2,'0')}`;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    tempDiaryEntry = {
        date: dateStr, time: timeStr,
        obs: document.getElementById('input-obs').value,
        feel: document.getElementById('input-feel').value,
        need: document.getElementById('input-need').value,
        req: document.getElementById('input-req').value,
        image: currentImage
    };

    document.getElementById('modal-spirit-letter').classList.remove('hidden');
    const msgContent = document.getElementById('spirit-message-content');
    msgContent.innerHTML = `<span class="animate-pulse">✨ 精靈正在為你寫信，請稍候...</span>`;

    // 模擬 AI 回信
    setTimeout(() => {
        msgContent.textContent = "親愛的孩子，精靈看見了你的努力。每一個感受都是靈魂的禮物，請溫柔地擁抱它們。你做得很棒，休息一下，明天會更好！✨";
    }, 1500);
}

function closeSpiritModal() {
    document.getElementById('modal-spirit-letter').classList.add('hidden');
    setTimeout(() => {
        document.getElementById('modal-share-canvas').classList.remove('hidden');
    }, 300);
}

function handleShare(shouldShare) {
    document.getElementById('modal-share-canvas').classList.add('hidden');
    
    const dateStr = tempDiaryEntry.date;
    if (!diaryData[dateStr]) diaryData[dateStr] = [];
    diaryData[dateStr].push(tempDiaryEntry);

    if (shouldShare) {
        const newPost = {
            id: Date.now(),
            author: "匿名同學",
            date: tempDiaryEntry.date,
            feel: tempDiaryEntry.feel,
            image: tempDiaryEntry.image,
            likes: 0,
            likedByMe: false,
            comments: []
        };
        sharedPosts.unshift(newPost);
        userPoints += 10;
        updatePointsUI();
        showToast("已分享並獲得 10 能量點！");
        checkBadges(); // 檢查分享相關勳章
    } else {
        showToast("日記已儲存 (私人)");
    }
    tempDiaryEntry = null;
    navigate('calendar');
}

// --- 共感畫布邏輯 ---
function renderCanvas() {
    const container = document.getElementById('canvas-posts-container');
    container.innerHTML = '';

    sharedPosts.forEach(post => {
        const imgHtml = post.image ? 
            `<div class="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-100"><img src="${post.image}" class="w-full h-full object-cover"></div>` : 
            `<div class="w-full h-24 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl mb-4 flex items-center justify-center text-orange-300 italic text-sm">此貼文無配圖</div>`;

        const commentsHtml = post.comments.map(c => 
            `<div class="text-sm bg-gray-50 p-2 rounded-lg mb-1"><span class="font-bold text-gray-700">${c.author}:</span> <span class="text-gray-600">${c.text}</span></div>`
        ).join('');

        const card = document.createElement('div');
        card.className = "bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full";
        card.innerHTML = `
            <div class="mb-4"><div class="text-sm text-gray-400 font-medium">${post.date}</div></div>
            ${imgHtml}
            <div class="bg-orange-50 p-4 rounded-xl mb-4 border-l-4 border-orange-300">
                <span class="text-xs font-bold text-orange-500 block mb-1">我的感受</span>
                <p class="text-gray-700">${post.feel}</p>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <button onclick="toggleLike(${post.id})" class="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors ${post.likedByMe ? 'like-active text-red-500' : ''}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="${post.likedByMe ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span>${post.likes}</span>
                </button>
                <div class="flex items-center text-gray-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    ${post.comments.length} 留言
                </div>
            </div>
            <div class="mt-4 space-y-2 max-h-32 overflow-y-auto">${commentsHtml}</div>
            <div class="mt-4 flex gap-2">
                <input type="text" id="comment-input-${post.id}" placeholder="寫下你的鼓勵..." class="flex-grow bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <button onclick="addComment(${post.id})" class="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap">發送</button>
            </div>`;
        container.appendChild(card);
    });
}

function toggleLike(postId) {
    const post = sharedPosts.find(p => p.id === postId);
    if (post) {
        if (post.likedByMe) {
            post.likes--; post.likedByMe = false;
            userPoints = Math.max(0, userPoints - 2);
            showToast("取消愛心");
        } else {
            post.likes++; post.likedByMe = true;
            userPoints += 2;
            showToast("送出愛心！獲得 2 能量點！");
        }
        updatePointsUI();
        renderCanvas();
        checkBadges(); // 檢查互動相關勳章
    }
}

function addComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const text = input.value.trim();
    if (text) {
        const post = sharedPosts.find(p => p.id === postId);
        if (post) {
            post.comments.push({ author: "小明", text: text });
            userPoints += 5;
            updatePointsUI();
            showToast("留言成功！獲得 5 能量點！");
            renderCanvas();
            checkBadges(); // 檢查互動相關勳章
        }
    }
}

// --- 共用與輔助 ---
function updatePointsUI() {
    const el = document.getElementById('user-points-display');
    if(el) {
        el.textContent = `🪙 ${userPoints}`;
        el.classList.add('points-pop');
        setTimeout(() => el.classList.remove('points-pop'), 300);
    }
    
    // 同時更新個人檔案頁面的點數顯示
    const profileEl = document.getElementById('profile-points-display');
    if(profileEl) profileEl.textContent = userPoints;
}

function addText(inputId, text) {
    const el = document.getElementById(inputId);
    el.value = (el.value.trim() !== '') ? el.value + '\n' + text : text;
}

function switchTab(tabName) {
    ['encourage', 'communicate', 'celebrate'].forEach(t => {
        document.getElementById(`tab-${t}`).classList.remove('active', 'text-orange-600', 'border-orange-500');
        document.getElementById(`tab-${t}`).classList.add('text-gray-500');
        document.getElementById(`content-${t}`).classList.add('hidden-view');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active', 'text-orange-600', 'border-orange-500');
    document.getElementById(`tab-${tabName}`).classList.remove('text-gray-500');
    document.getElementById(`content-${tabName}`).classList.remove('hidden-view');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.replace('opacity-0', 'opacity-100');
    setTimeout(() => toast.classList.replace('opacity-100', 'opacity-0'), 2000);
}

