// 孕育助手 - 现代化JavaScript功能文件

// 应用状态管理
let appState = {
    isLoggedIn: false,
    userStatus: null, // 'health', 'pregnancy', 'parenting'
    userData: {
        periodData: null,
        pregnancyData: null,
        babyData: null
    },
    currentPage: 'login',
    currentTab: 'home'
};

// 页面切换函数
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        appState.currentPage = pageId;
    }
}

// 登录功能
function huaweiLogin() {
    console.log('华为一键登录');
    simulateLogin();
}

function wechatLogin() {
    console.log('微信登录');
    simulateLogin();
}

function simulateLogin() {
    // 模拟登录过程
    const loginBtn = document.querySelector('.login-buttons button');
    const originalText = loginBtn.innerHTML;

    loginBtn.innerHTML = '<div class="loading"></div> 登录中...';
    loginBtn.disabled = true;

    setTimeout(() => {
        appState.isLoggedIn = true;
        checkUserStatus();
    }, 1500);
}

// 检查用户状态
function checkUserStatus() {
    const userStatus = localStorage.getItem('userStatus');

    if (userStatus) {
        // 用户已设置状态，直接进入主页
        appState.userStatus = userStatus;
        loadUserData();
        showPage('mainPage');
        updateUserStatusDisplay();
    } else {
        // 用户未设置状态，进入设置页面
        showPage('userSetupPage');
    }
}

// 选择用户状态
function selectStatus(status) {
    appState.userStatus = status;
    localStorage.setItem('userStatus', status);

    // 根据状态初始化数据
    initializeUserData(status);

    // 进入主页
    showPage('mainPage');
    updateUserStatusDisplay();
}

// 初始化用户数据
function initializeUserData(status) {
    const today = new Date();

    switch(status) {
        case 'health':
            // 初始化经期数据
            appState.userData.periodData = {
                lastPeriod: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), // 3天前
                cycleLength: 28,
                periodLength: 5,
                symptoms: []
            };
            break;

        case 'pregnancy':
            // 初始化孕期数据
            const lastPeriod = new Date(today.getTime() - 12 * 7 * 24 * 60 * 60 * 1000); // 12周前
            appState.userData.pregnancyData = {
                lastPeriod: lastPeriod,
                dueDate: new Date(lastPeriod.getTime() + 280 * 24 * 60 * 60 * 1000),
                currentWeek: 12,
                currentDay: 3
            };
            break;

        case 'parenting':
            // 初始化育儿数据
            appState.userData.babyData = {
                birthDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000), // 90天前
                gender: 'unknown',
                vaccines: [],
                growthRecords: []
            };
            break;
    }

    // 保存到本地存储
    localStorage.setItem('userData', JSON.stringify(appState.userData));
}

// 加载用户数据
function loadUserData() {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
        appState.userData = JSON.parse(savedData);
    }
}

// 更新用户状态显示
function updateUserStatusDisplay() {
    const userStatusEl = document.getElementById('userStatus');
    if (!userStatusEl) return;

    let statusText = '';
    let statusDays = '';

    switch(appState.userStatus) {
        case 'health':
            if (appState.userData.periodData) {
                const periodData = appState.userData.periodData;
                const daysSinceLastPeriod = Math.floor((new Date() - new Date(periodData.lastPeriod)) / (1000 * 60 * 60 * 24));
                const periodDay = (daysSinceLastPeriod % periodData.cycleLength) + 1;

                if (periodDay <= periodData.periodLength) {
                    statusText = `经期第${periodDay}天`;
                    statusDays = `剩余${periodData.periodLength - periodDay}天`;
                } else {
                    const nextPeriod = periodData.cycleLength - periodDay + 1;
                    statusText = '经期结束';
                    statusDays = `下次经期${nextPeriod}天后`;
                }
            }
            break;

        case 'pregnancy':
            if (appState.userData.pregnancyData) {
                const pregData = appState.userData.pregnancyData;
                statusText = `孕${pregData.currentWeek}周+${pregData.currentDay}天`;

                const daysLeft = Math.floor((new Date(pregData.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                statusDays = `剩余${daysLeft}天`;
            }
            break;

        case 'parenting':
            if (appState.userData.babyData) {
                const babyData = appState.userData.babyData;
                const daysOld = Math.floor((new Date() - new Date(babyData.birthDate)) / (1000 * 60 * 60 * 24));
                const months = Math.floor(daysOld / 30);
                const days = daysOld % 30;

                statusText = `宝宝${months}个月${days}天`;
                statusDays = '健康成长中';
            }
            break;
    }

    const statusTextEl = userStatusEl.querySelector('.status-text');
    const statusDaysEl = userStatusEl.querySelector('.status-days');

    if (statusTextEl) statusTextEl.textContent = statusText;
    if (statusDaysEl) statusDaysEl.textContent = statusDays;
}

// 打开工具功能
function openTool(toolName) {
    console.log('打开工具:', toolName);

    switch(toolName) {
        case 'period':
            showToolAlert('经期预测', '智能预测月经周期，记录经期症状');
            break;
        case 'ovulation':
            showToolAlert('排卵预测', '精准计算易孕期，提高备孕成功率');
            break;
        case 'fetalMovement':
            showToolAlert('胎动计数', '实时监测胎动，保障胎儿健康');
            break;
        case 'contraction':
            showToolAlert('宫缩计时', '记录宫缩频率，判断入院时机');
            break;
        case 'vaccine':
            showToolAlert('疫苗接种', '疫苗接种提醒与记录');
            break;
        case 'growth':
            showToolAlert('成长记录', '宝宝身高体重成长曲线');
            break;
        case 'temperature':
            showToolAlert('基础体温', '记录基础体温，绘制体温曲线');
            break;
        case 'symptoms':
            showToolAlert('症状记录', '记录身体症状和心情变化');
            break;
        case 'checkup':
            showToolAlert('产检提醒', '产检时间表和项目提醒');
            break;
        case 'encyclopedia':
            showToolAlert('育儿百科', '喂养、护理、疾病知识查询');
            break;
        default:
            showToolAlert('功能开发中', '该功能正在开发中，敬请期待');
    }
}

// 显示工具提示
function showToolAlert(title, message) {
    alert(`${title}\n\n${message}`);
}

// 显示通知
function showNotifications() {
    alert('通知中心\n\n您有2条新通知：\n• 明天上午产检\n• 叶酸补充提醒');
}

// 显示个人资料
function showProfile() {
    alert('个人中心\n\n功能开发中...');
}

// 切换底部标签
function switchTab(tabName) {
    // 更新底部导航激活状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const activeTab = document.querySelector(`.nav-item[onclick="switchTab('${tabName}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    appState.currentTab = tabName;

    // 根据标签显示不同内容
    switch(tabName) {
        case 'home':
            // 主页内容已显示
            break;
        case 'tools':
            alert('工具中心 - 功能开发中');
            break;
        case 'records':
            alert('记录中心 - 功能开发中');
            break;
        case 'profile':
            alert('个人中心 - 功能开发中');
            break;
    }
}

// 工具函数
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// 初始化应用
function initApp() {
    console.log('孕育助手应用初始化');

    // 设置今日日期
    const today = new Date();
    const dateEl = document.querySelector('.reminder-header .date');
    if (dateEl) {
        dateEl.textContent = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    }

    // 检查是否已登录
    const userStatus = localStorage.getItem('userStatus');
    if (userStatus) {
        // 用户已设置状态，直接进入主页
        appState.userStatus = userStatus;
        loadUserData();
        showPage('mainPage');
        updateUserStatusDisplay();
    } else {
        // 显示登录页面
        showPage('loginPage');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

// 导出函数供全局使用
window.huaweiLogin = huaweiLogin;
window.wechatLogin = wechatLogin;
window.selectStatus = selectStatus;
window.openTool = openTool;
window.showNotifications = showNotifications;
window.showProfile = showProfile;
window.switchTab = switchTab;
