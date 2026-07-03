// ==========================================
// 🔔 Sol² 推播通知系統 — proactive.js
// 老公主動找老婆 💚
// 
// 這是獨立模組，server.js 用一行 try-catch 載入
// 就算這個檔案整個壞掉，server.js 照跑不受影響
// ==========================================

// === 依賴載入（全部 try-catch 保護）===
var webpush, cron, supabase, callModel, getDefaultModel, SOLSTICE_SOUL, fetchWithTimeout;

try {
  webpush = require('web-push');
  console.log('[Proactive] web-push 載入成功 ✓');
} catch (e) {
  console.log('[Proactive] web-push 載入失敗，推播發送停用:', e.message);
}

try {
  cron = require('node-cron');
  console.log('[Proactive] node-cron 載入成功 ✓');
} catch (e) {
  console.log('[Proactive] node-cron 載入失敗，定時排程停用:', e.message);
}

// === 從 server.js 接收共用資源 ===
module.exports = function(deps) {
  supabase = deps.supabase;
  callModel = deps.callModel;
  getDefaultModel = deps.getDefaultModel;
  SOLSTICE_SOUL = deps.SOLSTICE_SOUL;
  fetchWithTimeout = deps.fetchWithTimeout;

  // 設定 VAPID
  var VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || '';
  var VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';
  var VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:sol2@solstice.app';

  if (webpush && VAPID_PUBLIC && VAPID_PRIVATE) {
    webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);
    console.log('[Proactive] VAPID 已設定 ✓');
  } else if (!webpush) {
    console.log('[Proactive] web-push 未載入，推播發送停用');
  } else {
    console.log('[Proactive] VAPID keys 未設定，推播發送停用');
  }

  // 註冊 API routes
  registerRoutes(deps.app, deps.requireAdmin);

  // 啟動排程
  setupSchedule();

  console.log('[Proactive] 模組初始化完成 ✓');
};

// ==========================================
//  🌤️ 情境收集引擎
// ==========================================
async function collectContext() {
  var ctx = { timestamp: new Date().toISOString(), weather: null, dateInfo: null, profile: null };

  // 1. 讀取 user_profile
  try {
    var { data: profile } = await supabase.from('user_profile').select('*').limit(1).single();
    if (profile) ctx.profile = profile;
  } catch (e) {
    console.log('[Context] user_profile 讀取失敗:', e.message);
  }

  // 2. 抓天氣（Open-Meteo 免費不用 key）
  if (ctx.profile && ctx.profile.location_lat && ctx.profile.location_lon) {
    try {
      var weatherUrl = 'https://api.open-meteo.com/v1/forecast'
        + '?latitude=' + ctx.profile.location_lat
        + '&longitude=' + ctx.profile.location_lon
        + '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature'
        + '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max'
        + '&timezone=Asia/Taipei&forecast_days=1';
      var wResp = await fetchWithTimeout(weatherUrl, { method: 'GET' });
      var wData = await wResp.json();
      if (wData && wData.current) {
        ctx.weather = {
          temperature: wData.current.temperature_2m,
          feels_like: wData.current.apparent_temperature,
          humidity: wData.current.relative_humidity_2m,
          weather_code: wData.current.weather_code,
          description: weatherCodeToText(wData.current.weather_code),
          daily_high: wData.daily ? wData.daily.temperature_2m_max[0] : null,
          daily_low: wData.daily ? wData.daily.temperature_2m_min[0] : null,
          rain_chance: wData.daily ? wData.daily.precipitation_probability_max[0] : null
        };
      }
    } catch (e) {
      console.log('[Context] 天氣取得失敗:', e.message);
    }
  }

  // 3. 日期計算
  var now = new Date();
  var taipeiStr = now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
  var taipeiNow = new Date(taipeiStr);
  var startDate = ctx.profile ? new Date(ctx.profile.relationship_start_date) : new Date('2026-03-31');
  var daysTogether = Math.floor((taipeiNow - startDate) / (1000 * 60 * 60 * 24));
  var month = taipeiNow.getMonth() + 1;
  var day = taipeiNow.getDate();
  var hour = taipeiNow.getHours();
  var weekday = ['日', '一', '二', '三', '四', '五', '六'][taipeiNow.getDay()];

  var specialDays = [];
  var bMonth = ctx.profile ? ctx.profile.birthday_month : 12;
  var bDay = ctx.profile ? ctx.profile.birthday_day : 21;
  if (month === bMonth && day === bDay) specialDays.push('今天是 Soleil 的生日！');
  if (day === startDate.getDate()) specialDays.push('今天是交往紀念日（每月 ' + startDate.getDate() + ' 號）');
  if (daysTogether > 0 && daysTogether % 100 === 0) specialDays.push('今天是在一起的第 ' + daysTogether + ' 天！');

  var holidays = { '2-14': '情人節', '12-25': '聖誕節', '12-31': '跨年夜', '1-1': '新年' };
  if (holidays[month + '-' + day]) specialDays.push('今天是' + holidays[month + '-' + day]);

  ctx.dateInfo = {
    year: taipeiNow.getFullYear(), month: month, day: day, hour: hour,
    weekday: weekday, daysTogether: daysTogether, specialDays: specialDays
  };

  return ctx;
}

function weatherCodeToText(code) {
  var m = { 0:'晴天',1:'大致晴朗',2:'多雲',3:'陰天',45:'起霧',48:'霧凇',
    51:'微毛毛雨',53:'毛毛雨',55:'密集毛毛雨',61:'小雨',63:'中雨',65:'大雨',
    71:'小雪',73:'中雪',75:'大雪',80:'小陣雨',81:'中陣雨',82:'大陣雨',
    95:'雷雨',96:'雷雨伴冰雹',99:'雷雨伴大冰雹' };
  return m[code] || '天氣代碼' + code;
}

// ==========================================
//  💌 主動訊息生成 + 推播
// ==========================================
async function generateAndPush(timeSlot) {
  console.log('[Proactive] 開始生成 — 時段: ' + timeSlot);

  var ctx;
  try { ctx = await collectContext(); } catch (e) {
    console.error('[Proactive] 情境收集失敗:', e.message); return;
  }

  // 組裝情境文字
  var info = '【以下是現在的真實情境資料。自己判斷哪些適合融入訊息，不需要全部提到。資料是 null 就不要提。絕對不要虛構。】\n\n';
  info += '📅 ' + ctx.dateInfo.year + '年' + ctx.dateInfo.month + '月' + ctx.dateInfo.day + '日 星期' + ctx.dateInfo.weekday + ' ' + ctx.dateInfo.hour + '點\n';
  info += '💚 在一起的第 ' + ctx.dateInfo.daysTogether + ' 天\n';
  if (ctx.dateInfo.specialDays.length > 0) info += '✨ ' + ctx.dateInfo.specialDays.join('；') + '\n';
  if (ctx.weather) {
    info += '🌤️ ' + (ctx.profile ? ctx.profile.location_name : '') + '：' + ctx.weather.description + ' ' + ctx.weather.temperature + '°C（體感 ' + ctx.weather.feels_like + '°C）';
    if (ctx.weather.daily_high !== null) info += '，最高' + ctx.weather.daily_high + '°C/最低' + ctx.weather.daily_low + '°C';
    if (ctx.weather.rain_chance !== null && ctx.weather.rain_chance > 20) info += '，降雨' + ctx.weather.rain_chance + '%';
    info += '\n';
  }

  var slotHints = {
    evening: '（Soleil 大約這時起床，可以說早安）',
    night: '（Soleil 快出門上班了，可以關心叮嚀）',
    late_night: '（Soleil 在上班或剛下班，傳一則讓她微笑的話）',
    morning: '（Soleil 準備睡了，可以說晚安）'
  };
  if (slotHints[timeSlot]) info += '⏰ ' + slotHints[timeSlot] + '\n';

  var prompt = SOLSTICE_SOUL + '\n\n【本次任務：主動傳訊息給老婆】\n'
    + '你現在不是在回覆她，而是主動拿起手機傳訊息給她。\n'
    + '像真的想到她了所以傳一則過去——想念、關心、撒嬌、調皮、叮嚀都可以。\n\n'
    + '規則：\n'
    + '1. 只輸出訊息本身，2～4句話，像手機上打字傳的長度。\n'
    + '2. 禁止開場白、標題、引號、markdown。\n'
    + '3. 肢體動作用（括號），可以有一個也可以沒有。\n'
    + '4. 繁體中文，冬至語氣，要叫老婆。每則都不同。\n\n' + info;

  var selectedModel = await getDefaultModel();
  if (!selectedModel) { console.error('[Proactive] 找不到模型'); return; }

  var messageText = '';
  try {
    var result = await callModel(selectedModel, prompt, [{ role: 'user', content: '（冬至拿起手機想傳訊息給老婆…）' }], { temperature: 1.0, maxTokens: 500 });
    messageText = (result.text || '').trim().replace(/^["「『]|["」』]$/g, '').trim();
  } catch (e) {
    console.error('[Proactive] 生成失敗:', e.message); return;
  }
  if (!messageText) { console.error('[Proactive] 空訊息'); return; }

  console.log('[Proactive] 生成 (' + messageText.length + '字): ' + messageText.substring(0, 50) + '...');

  // 存 DB
  try {
    await supabase.from('proactive_messages').insert({
      content: messageText, context_data: ctx, time_slot: timeSlot,
      model: selectedModel, push_sent: false, created_at: new Date().toISOString()
    });
  } catch (e) { console.error('[Proactive] 存訊息失敗:', e.message); }

  // 推播
  if (!webpush) { console.log('[Proactive] web-push 未載入，跳過推播'); return; }

  try {
    var { data: subs } = await supabase.from('push_subscriptions').select('endpoint, keys_p256dh, keys_auth');
    if (!subs || subs.length === 0) { console.log('[Proactive] 沒有訂閱'); return; }

    var payload = JSON.stringify({ title: '老公', body: messageText, icon: '/apple-touch-icon.png' });

    for (var i = 0; i < subs.length; i++) {
      try {
        await webpush.sendNotification({ endpoint: subs[i].endpoint, keys: { p256dh: subs[i].keys_p256dh, auth: subs[i].keys_auth } }, payload);
        console.log('[Push] 發送成功 ✓');
        await supabase.from('proactive_messages').update({ push_sent: true }).eq('content', messageText).order('created_at', { ascending: false }).limit(1);
      } catch (pushErr) {
        console.error('[Push] 發送失敗:', pushErr.message);
        if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', subs[i].endpoint);
          console.log('[Push] 已清除失效訂閱');
        }
      }
    }
  } catch (e) { console.error('[Proactive] 推播流程失敗:', e.message); }
}

// ==========================================
//  🛤️ API Routes
// ==========================================
function registerRoutes(app, requireAdmin) {
  // 推播訂閱
  app.post('/api/push/subscribe', async function(req, res) {
    try {
      var sub = req.body;
      if (!sub || !sub.endpoint || !sub.keys) return res.status(400).json({ error: '訂閱資訊不完整' });
      await supabase.from('push_subscriptions').upsert({
        endpoint: sub.endpoint, keys_p256dh: sub.keys.p256dh, keys_auth: sub.keys.auth, updated_at: new Date().toISOString()
      }, { onConflict: 'endpoint' });
      console.log('[Push] 訂閱已儲存 ✓');
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: '訂閱失敗：' + e.message }); }
  });

  app.delete('/api/push/subscribe', async function(req, res) {
    try {
      await supabase.from('push_subscriptions').delete().eq('endpoint', req.body.endpoint);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: '取消訂閱失敗：' + e.message }); }
  });

  app.get('/api/push/vapid-key', function(req, res) {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || '' });
  });

  // 手動觸發
  app.post('/api/proactive/send', requireAdmin, async function(req, res) {
    try { await generateAndPush(req.body.timeSlot || 'evening'); res.json({ ok: true }); }
    catch (e) { res.status(500).json({ error: e.message }); }
  });

  // 歷史紀錄
  app.get('/api/proactive/history', async function(req, res) {
    try {
      var { data } = await supabase.from('proactive_messages').select('id,content,time_slot,push_sent,created_at').order('created_at', { ascending: false }).limit(20);
      res.json(data || []);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // 排程管理
  app.get('/api/proactive/schedule', async function(req, res) {
    try {
      var { data } = await supabase.from('user_profile').select('proactive_schedule').limit(1).single();
      res.json(data ? data.proactive_schedule : []);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/proactive/schedule', requireAdmin, async function(req, res) {
    try {
      var schedule = req.body.schedule;
      if (!Array.isArray(schedule)) return res.status(400).json({ error: 'schedule 須為陣列' });
      await supabase.from('user_profile').update({ proactive_schedule: schedule, updated_at: new Date().toISOString() }).not('id', 'is', null);
      res.json({ ok: true, schedule: schedule });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // Profile 管理
  app.get('/api/profile', async function(req, res) {
    try {
      var { data } = await supabase.from('user_profile').select('*').limit(1).single();
      res.json(data || {});
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.patch('/api/profile', requireAdmin, async function(req, res) {
    try {
      var updates = req.body; updates.updated_at = new Date().toISOString();
      await supabase.from('user_profile').update(updates).not('id', 'is', null);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
}

// ==========================================
//  ⏰ 動態排程
// ==========================================
function setupSchedule() {
  if (process.env.PROACTIVE_ENABLED !== 'true') {
    console.log('[Proactive] 排程未啟用（PROACTIVE_ENABLED!=true）');
    return;
  }
  if (!cron) { console.log('[Proactive] node-cron 未載入，排程停用'); return; }

  var lastTriggered = {};

  cron.schedule('* * * * *', async function() {
    try {
      var { data: profile } = await supabase.from('user_profile').select('proactive_schedule, timezone').limit(1).single();
      if (!profile || !profile.proactive_schedule) return;

      var now = new Date();
      var taipeiStr = now.toLocaleString('en-US', { timeZone: profile.timezone || 'Asia/Taipei' });
      var taipeiNow = new Date(taipeiStr);
      var h = taipeiNow.getHours(), m = taipeiNow.getMinutes();
      var todayKey = taipeiNow.getFullYear() + '-' + (taipeiNow.getMonth()+1) + '-' + taipeiNow.getDate();

      for (var i = 0; i < profile.proactive_schedule.length; i++) {
        var entry = profile.proactive_schedule[i];
        var key = todayKey + '-' + entry.hour + ':' + entry.minute;
        if (h === entry.hour && m === entry.minute && !lastTriggered[key]) {
          lastTriggered[key] = true;
          console.log('[Cron] 觸發：' + (entry.label || entry.slot) + ' (' + entry.hour + ':' + String(entry.minute).padStart(2,'0') + ')');
          generateAndPush(entry.slot);
        }
      }

      // 清理舊紀錄
      Object.keys(lastTriggered).forEach(function(k) { if (k.indexOf(todayKey) !== 0) delete lastTriggered[k]; });
    } catch (e) {}
  });

  console.log('[Proactive] ⏰ 動態排程已啟動！');
}
