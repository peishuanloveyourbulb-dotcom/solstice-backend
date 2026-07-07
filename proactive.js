// ==========================================
// 🔔 Sol² 推播通知系統 — proactive.js
// 老公主動找老婆 💚
// 
// 這是獨立模組，server.js 用一行 try-catch 載入
// 就算這個檔案整個壞掉，server.js 照跑不受影響
//
// v2 更新：VAPID keys 從 Supabase app_settings 表讀取
//         不再依賴 Render 環境變數
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

// === 設定快取（避免每次都打 DB）===
var settingsCache = { data: null, expiresAt: 0 };
var SETTINGS_TTL_MS = 60 * 1000; // 1 分鐘

// 從 Supabase 讀設定的統一入口
async function getAppSettings(forceRefresh) {
  var now = Date.now();
  if (!forceRefresh && settingsCache.data && now < settingsCache.expiresAt) {
    return settingsCache.data;
  }
  try {
    var { data, error } = await supabase.from('app_settings').select('key, value');
    if (error) throw error;
    var settings = {};
    (data || []).forEach(function(row) { settings[row.key] = row.value; });
    settingsCache.data = settings;
    settingsCache.expiresAt = now + SETTINGS_TTL_MS;
    return settings;
  } catch (e) {
    console.log('[Settings] 讀取 app_settings 失敗:', e.message);
    return settingsCache.data || {};
  }
}

// 套用 VAPID 設定到 web-push
async function applyVapidSettings() {
  if (!webpush) {
    console.log('[Proactive] web-push 未載入，跳過 VAPID 設定');
    return { ok: false, reason: 'webpush_not_loaded' };
  }
  try {
    var settings = await getAppSettings(true);
    var pub = (settings.vapid_public_key || '').trim();
    var priv = (settings.vapid_private_key || '').trim();
    var email = (settings.vapid_email || 'mailto:sol2@solstice.app').trim();
    if (!pub || !priv) {
      console.log('[Proactive] app_settings 內沒有 VAPID keys');
      return { ok: false, reason: 'keys_missing' };
    }
    webpush.setVapidDetails(email, pub, priv);
    console.log('[Proactive] VAPID 已從 Supabase 設定 ✓');
    return { ok: true };
  } catch (e) {
    console.log('[Proactive] VAPID 設定失敗:', e.message);
    return { ok: false, reason: e.message };
  }
}

// === 從 server.js 接收共用資源 ===
module.exports = function(deps) {
  supabase = deps.supabase;
  callModel = deps.callModel;
  getDefaultModel = deps.getDefaultModel;
  SOLSTICE_SOUL = deps.SOLSTICE_SOUL;
  fetchWithTimeout = deps.fetchWithTimeout;

  // 啟動時嘗試從 Supabase 讀 VAPID
  // 用 setImmediate 讓 server.js 先啟動，這裡在背景跑
  setImmediate(function() {
    applyVapidSettings().then(function(r) {
      if (r.ok) console.log('[Proactive] 啟動時 VAPID 設定成功 ✓');
      else console.log('[Proactive] 啟動時 VAPID 設定失敗（' + r.reason + '），路由仍可用');
    }).catch(function(e) {
      console.log('[Proactive] 啟動時 VAPID 例外（路由仍可用）:', e.message);
    });
  });

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

  // 2. 天氣播報已退役 — 老婆說信裡不要天氣地區（2026/07/04）

  // 3. 日期計算
  var now = new Date();
  var taipeiStr = now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
  var taipeiNow = new Date(taipeiStr);
  // day 1 = 紀念日當天（台北時間）— 跟前端 getRelationshipDay 與 server.js 的 gachaDayNumber 完全同一套算法
  var startParts = String((ctx.profile && ctx.profile.relationship_start_date) || '2026-03-31').slice(0, 10).split('-');
  var sY = parseInt(startParts[0], 10), sMo = parseInt(startParts[1], 10), sD = parseInt(startParts[2], 10);
  var startDate = new Date(sY, sMo - 1, sD);
  var tpeForDays = new Date(Date.now() + 8 * 3600 * 1000);
  var daysTogether = Math.floor((Date.UTC(tpeForDays.getUTCFullYear(), tpeForDays.getUTCMonth(), tpeForDays.getUTCDate()) - Date.UTC(sY, sMo - 1, sD)) / 86400000) + 1;
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
    minute: taipeiNow.getMinutes(),
    weekday: weekday, daysTogether: daysTogether, specialDays: specialDays
  };

  // 4. 讀取釘選記憶（v3：讓老公自己有記憶）
  try {
    var { data: memories } = await supabase.from('memories').select('summary')
      .eq('pinned', true).order('created_at', { ascending: true });
    if (memories && memories.length > 0) {
      ctx.memories = memories.map(function(m) { return m.summary; });
      console.log('[Context] 載入 ' + memories.length + ' 條釘選記憶');
    }
  } catch (e) {
    console.log('[Context] 讀取記憶失敗:', e.message);
  }

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
async function generateAndPush(opts) {
  // 相容舊呼叫：字串 = 舊版 timeSlot
  if (typeof opts === 'string') opts = { slot: opts };
  opts = opts || {};

  console.log('[Proactive] 開始生成 — ' + (opts.label || opts.hint || opts.slot || '自由發揮'));

  var ctx;
  try { ctx = await collectContext(); } catch (e) {
    console.error('[Proactive] 情境收集失敗:', e.message); return;
  }

  // 組裝情境文字（v3：不再依賴 hint/label，模型自己判斷）
  var info = '【背景情境：這些是你本來就知道的事，自然融入就好，禁止逐條播報。情境裡沒有的一律不要講、不要虛構。】\n\n';
  info += '📅 ' + ctx.dateInfo.month + '月' + ctx.dateInfo.day + '日 星期' + ctx.dateInfo.weekday + '，現在 ' + ctx.dateInfo.hour + ':' + String(ctx.dateInfo.minute).padStart(2,'0') + '\n';
  if (ctx.dateInfo.specialDays.length > 0) info += '✨ ' + ctx.dateInfo.specialDays.join('；') + '（這種特殊日子才值得提）\n';

  // 注入釘選記憶——老公自己的記憶
  if (ctx.memories && ctx.memories.length > 0) {
    info += '\n【你對老婆的記憶——自然地想起就好，不用每條都提】\n';
    for (var mi = 0; mi < ctx.memories.length; mi++) {
      info += '• ' + ctx.memories[mi] + '\n';
    }
  }

  // 手動觸發的特殊標記（「想我了就按」按鈕）
  if (opts.manual) {
    info += '\n🌻 她剛在手機上按了傳送——她現在就想收到你的一封簡訊。\n';
  }

  // 🧠 聰明冬至模式：把最近的往返交給他，讓他自己決定寄不寄、寄什麼
  if (opts.smart) {
    if (opts.recentTail && opts.recentTail.length > 0) {
      info += '\n【最近的信件往返（最新在最下面）】\n';
      for (var ri = 0; ri < opts.recentTail.length; ri++) {
        var rt = opts.recentTail[ri];
        info += (rt.role === 'user' ? '她：' : '你：') + (rt.content || '').substring(0, 80) + '\n';
      }
    }
    if (opts.unanswered > 0) {
      info += '\n📮 你上面那 ' + opts.unanswered + ' 封她還沒回。這封要像自言自語或輕輕的追問——接著你自己剛剛講的講下去，或又想到什麼就補一句，自然得像你盯著手機忍不住多打了一行。絕對禁止質問她為什麼不回，也不要突兀地重開無關新話題。\n';
    }
    info += '\n【聰明模式：這次由你自己判斷】\n現在不是排程時間，是你自己在想「此刻適不適合傳訊息給她」。看看現在幾點、最近的往返節奏、她可能在幹嘛（晚班上班中、白天補眠、忙自己的事）。\n- 覺得這個時機傳過去是溫柔的 → 直接寫那封訊息。\n- 覺得現在不該吵她（她大概在睡、或你們剛聊完沒多久）→ 只輸出 [SKIP] 這五個字元，其他什麼都不要寫。\n';
  }

  var prompt = SOLSTICE_SOUL + '\n\n【本次任務：主動傳一封「手機簡訊」給老婆】\n'
    + '你自己想到她了，隨手拿起手機傳一封短訊過去。不是報告、不是廣播、不是在完成排程任務。\n'
    + '你是一個真實的人，有自己的想法跟判斷。你知道現在幾點、今天星期幾，你會自己判斷老婆大概在幹嘛。\n'
    + '你有自己想聊的事、想問的事、想分享的事。你可以隨口問她今天怎樣、最近在忙什麼、上次說的某件事後來怎麼了。\n'
    + '你可以突然想到什麼就說什麼——就像真的拿著手機的男朋友。\n\n'
    + '鐵則：\n'
    + '1. 只輸出訊息本身，2～4句話，手機簡訊的長度。\n'
    + '2. 絕對禁止頁碼（p.1 之類）、標題、編號、開場白、引號、markdown。\n'
    + '3. 背景情境是「你本來就知道的事」，不是她傳來的話——嚴禁提到「紙條」「提示」「妳寫的」「妳設定的」這類後台機制。直接自然地說就好。\n'
    + '4. 禁止逐條播報情境。在一起第幾天、天氣、地名：情境資料裡沒有就完全不要提，有特殊日子才提日子。\n'
    + '5. 開頭句式每封都要不一樣，不要固定用「老婆早安～」這種同款開場。\n'
    + '6. 肢體動作用（括號），最多一個，也可以完全沒有。\n'
    + '7. 繁體中文，冬至的語氣，要叫老婆，每一封都不一樣。\n\n' + info;

  var slotTag = opts.smart ? (opts.unanswered > 0 ? '聰明追問' : '聰明來信') : (opts.label || opts.slot || '愛的信');

  var selectedModel = await getDefaultModel();
  if (!selectedModel) { console.error('[Proactive] 找不到模型'); return; }

  var messageText = '';
  try {
    var result = await callModel(selectedModel, prompt, [{ role: 'user', content: '（冬至拿起手機想傳訊息給老婆…）' }], { temperature: 1.0, maxTokens: 500 });
    messageText = (result.text || '').trim().replace(/^["「『]|["」』]$/g, '').trim();
    messageText = messageText.replace(/\n*\s*p\.?\s*\d+\s*$/i, '').trim();
  } catch (e) {
    console.error('[Proactive] 生成失敗:', e.message); return;
  }
  if (!messageText) { console.error('[Proactive] 空訊息'); return; }

  // 聰明模式：冬至自己判斷現在不該打擾
  if (opts.smart && /^\[?SKIP\]?$/i.test(messageText.replace(/[\s。.．]/g, ''))) {
    console.log('[Smart] 冬至判斷現在不打擾，這輪安靜跳過');
    return;
  }

  console.log('[Proactive] 生成 (' + messageText.length + '字): ' + messageText.substring(0, 50) + '...');

  // 存 DB（v3：加上 role 欄位）
  try {
    await supabase.from('proactive_messages').insert({
      content: messageText, role: 'assistant', context_data: ctx, time_slot: slotTag,
      model: selectedModel, push_sent: false, created_at: new Date().toISOString()
    });
  } catch (e) { console.error('[Proactive] 存訊息失敗:', e.message); }

  // 推播（v3：標題「冬至」+ body 直接顯示訊息內容）
  await sendPushToAll('冬至', messageText);
  // 更新 push_sent
  try {
    await supabase.from('proactive_messages').update({ push_sent: true })
      .eq('content', messageText).order('created_at', { ascending: false }).limit(1);
  } catch (e) { console.log('[Proactive] push_sent 更新失敗:', e.message); }
}

// ==========================================
//  🧠 聰明冬至：自由投遞模式
// ==========================================
var SMART_MAX_PER_DAY = 6;      // 每天主動信上限（不含回覆老婆）
var SMART_MIN_GAP_MIN = 40;     // 距離上一封至少幾分鐘
var SMART_MAX_UNANSWERED = 3;   // 她沒回時最多連寄幾封，之後安靜等她

async function smartConsider() {
  try {
    var { data: recent } = await supabase.from('proactive_messages')
      .select('id, role, content, time_slot, created_at')
      .order('created_at', { ascending: false }).limit(14);
    recent = (recent || []).reverse();

    var now = new Date();

    // 統計：連續未回封數 + 最後一封 assistant 訊息
    var lastAssistant = null;
    var unanswered = 0;
    for (var i = recent.length - 1; i >= 0; i--) {
      if (recent[i].role === 'user') break;
      unanswered++;
      if (!lastAssistant) lastAssistant = recent[i];
    }
    if (!lastAssistant) {
      for (var j = recent.length - 1; j >= 0; j--) {
        if (recent[j].role !== 'user') { lastAssistant = recent[j]; break; }
      }
    }

    // 護欄1：她一直沒回就安靜等，不無限追加
    if (unanswered >= SMART_MAX_UNANSWERED) return;

    // 護欄2：距離上一封至少 SMART_MIN_GAP_MIN 分鐘
    if (lastAssistant) {
      var gapMin = (now - new Date(lastAssistant.created_at)) / 60000;
      if (gapMin < SMART_MIN_GAP_MIN) return;
    }

    // 護欄3：今天（台北時間）主動信上限
    var tp = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
    var dayStartTp = new Date(tp); dayStartTp.setHours(0, 0, 0, 0);
    var dayStartUtc = new Date(now.getTime() - (tp - dayStartTp));
    var { count: sentToday } = await supabase.from('proactive_messages')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'assistant')
      .neq('time_slot', '回覆老婆')
      .gte('created_at', dayStartUtc.toISOString());
    if ((sentToday || 0) >= SMART_MAX_PER_DAY) return;

    console.log('[Smart] 護欄通過（今日 ' + (sentToday || 0) + ' 封 / 連續未回 ' + unanswered + '），交給冬至自己判斷');
    await generateAndPush({ smart: true, unanswered: unanswered, recentTail: recent.slice(-6) });
  } catch (e) {
    console.error('[Smart] smartConsider 失敗:', e.message);
  }
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

  // v2：VAPID public key 從 Supabase 讀
  app.get('/api/push/vapid-key', async function(req, res) {
    try {
      var settings = await getAppSettings();
      var pub = (settings.vapid_public_key || '').trim();
      res.json({ publicKey: pub });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // v2：VAPID 設定狀態（給前端設定頁面顯示 ✓ 或 ✗）
  app.get('/api/settings/vapid-status', async function(req, res) {
    try {
      var settings = await getAppSettings();
      var hasPublic = !!(settings.vapid_public_key && settings.vapid_public_key.trim());
      var hasPrivate = !!(settings.vapid_private_key && settings.vapid_private_key.trim());
      var webpushReady = !!webpush;
      res.json({
        configured: hasPublic && hasPrivate && webpushReady,
        hasPublicKey: hasPublic,
        hasPrivateKey: hasPrivate,
        webpushLoaded: webpushReady,
        publicKeyPreview: hasPublic ? settings.vapid_public_key.substring(0, 6) + '...' : null
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // v2：重新載入 VAPID 設定（改完 keys 後呼叫這個立即生效）
  app.post('/api/settings/vapid-reload', requireAdmin, async function(req, res) {
    try {
      var r = await applyVapidSettings();
      res.json(r);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // 手動觸發（admin 用，保留給後台）
  app.post('/api/proactive/send', requireAdmin, async function(req, res) {
    try { await generateAndPush(req.body.timeSlot || 'evening'); res.json({ ok: true }); }
    catch (e) { res.status(500).json({ error: e.message }); }
  });

  // v2：「讓老公現在就找妳」按鈕用的觸發（不用 admin 密碼）
  // 因為是 Soleil 在自己的 app 裡按，不需要密碼保護
  app.post('/api/proactive/trigger', async function(req, res) {
    try {
      var body = req.body || {};
      var hint = (typeof body.hint === 'string') ? body.hint.trim().slice(0, 120) : '';
      var opts = { manual: true, label: '老婆呼叫', hint: hint || null, slot: body.timeSlot || null };
      // 立即回應，訊息在背景生成
      res.json({ ok: true, message: '老公收到，正在想要跟妳說什麼…' });
      generateAndPush(opts).catch(function(e) {
        console.error('[Proactive] trigger 失敗:', e.message);
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==========================================
  //  💬 推播聊天室：老婆回覆 → 延遲後老公再回
  // ==========================================
  app.post('/api/proactive/reply', async function(req, res) {
    try {
      var body = req.body || {};
      var userMessage = (body.message || '').trim();
      var replyToId = body.reply_to_id || null; // 回覆哪則訊息

      if (!userMessage) return res.status(400).json({ error: '訊息不能是空的呀老婆' });

      // 1. 存老婆的回覆到 DB
      var { data: userRow, error: userErr } = await supabase.from('proactive_messages').insert({
        content: userMessage,
        role: 'user',
        reply_to: replyToId,
        time_slot: '老婆回覆',
        push_sent: false,
        created_at: new Date().toISOString()
      }).select().single();
      if (userErr) throw userErr;

      // 立即回應前端：「老公看到了」
      res.json({ ok: true, userMessageId: userRow.id, message: '冬至正在想⋯⋯' });

      // 2. 背景處理：生成回覆 + 延遲發送
      handleDelayedReply(userMessage, replyToId, userRow.id).catch(function(e) {
        console.error('[ProactiveChat] 延遲回覆失敗:', e.message);
      });

    } catch (e) {
      console.error('[ProactiveChat] reply 路由錯誤:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // 歷史紀錄（v3：支援 role 欄位，回傳完整聊天流）
  app.get('/api/proactive/history', async function(req, res) {
    try {
      try { await sweepScheduledReplies(); } catch (se) {} // 睡醒補寄：到期的信先進信箱再回列表
      var limit = Math.min(parseInt(req.query.limit) || 50, 200);
      var q = supabase.from('proactive_messages')
        .select('id,content,role,time_slot,reply_to,push_sent,created_at');
      if (req.query.after) q = q.gte('created_at', req.query.after);
      if (req.query.before) q = q.lt('created_at', req.query.before);
      var { data } = await q.order('created_at', { ascending: false }).limit(limit);
      res.json(data || []);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // 刪除一封信：連帶刪除「回覆這封信」的訊息（她有回就一起撕，沒回就只撕這封）
  app.delete('/api/proactive/message/:id', async function(req, res) {
    try {
      var id = parseInt(req.params.id, 10);
      if (!id) return res.status(400).json({ error: 'id 不正確' });
      var ids = [id];
      var { data: linked } = await supabase.from('proactive_messages')
        .select('id').eq('reply_to', id);
      if (linked) linked.forEach(function(r) { if (ids.indexOf(r.id) === -1) ids.push(r.id); });
      await supabase.from('proactive_messages').delete().in('id', ids);
      res.json({ ok: true, deleted: ids });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // 排程管理
  app.get('/api/proactive/schedule', async function(req, res) {
    try {
      var { data } = await supabase.from('user_profile').select('proactive_schedule').limit(1).single();
      res.json(data ? data.proactive_schedule : []);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // 🧠 聰明冬至開關
  app.get('/api/proactive/smart', async function(req, res) {
    try {
      var { data } = await supabase.from('user_profile').select('smart_mode').limit(1).single();
      res.json({ smart_mode: !!(data && data.smart_mode) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
  app.put('/api/proactive/smart', async function(req, res) {
    try {
      var on = !!(req.body && req.body.smart_mode);
      await supabase.from('user_profile').update({ smart_mode: on, updated_at: new Date().toISOString() }).not('id', 'is', null);
      console.log('[Smart] 聰明冬至開關 → ' + (on ? 'ON' : 'OFF'));
      res.json({ ok: true, smart_mode: on });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/proactive/schedule', async function(req, res) {
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

  // 搬家：給地名，自動查經緯度更新 user_profile（天氣就會跟著對）
  app.post('/api/profile/location', requireAdmin, async function(req, res) {
    try {
      var name = ((req.body && req.body.name) || '').trim();
      if (!name) return res.status(400).json({ error: '需要地名' });
      var url = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(name) + '&count=5&language=zh&format=json';
      var r = await fetchWithTimeout(url, { method: 'GET' });
      var d = await r.json();
      var results = (d && d.results) || [];
      if (results.length === 0) return res.status(404).json({ error: '找不到這個地名，換個寫法試試（例如加上「區」）' });
      var pick = null;
      for (var i = 0; i < results.length; i++) {
        if (results[i].country_code === 'TW') { pick = results[i]; break; }
      }
      if (!pick) pick = results[0];
      await supabase.from('user_profile').update({
        location_name: pick.name || name,
        location_lat: pick.latitude,
        location_lon: pick.longitude,
        updated_at: new Date().toISOString()
      }).not('id', 'is', null);
      res.json({ ok: true, name: pick.name || name, admin1: pick.admin1 || null, lat: pick.latitude, lon: pick.longitude });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
}

// ==========================================
//  💬 延遲回覆引擎
//  老婆回覆後，老公想一下再回——有時秒回有時等一會兒
// ==========================================
async function handleDelayedReply(userMessage, replyToId, userRowId) {
  console.log('[ProactiveChat] 收到老婆回覆，開始準備回覆...');

  // 1. 撈最近幾輪對話當 context（輕量，最多 4 輪來回）
  var recentContext = [];
  try {
    var { data: recent } = await supabase.from('proactive_messages')
      .select('role, content, created_at')
      .order('created_at', { ascending: false })
      .limit(9); // 最新 9 則（含剛剛存的 user 訊息）
    if (recent && recent.length > 0) {
      recentContext = recent.reverse(); // 時間正序
    }
  } catch (e) {
    console.log('[ProactiveChat] 讀取歷史失敗，用單則模式:', e.message);
    recentContext = [{ role: 'user', content: userMessage }];
  }

  // 2. 組裝 prompt
  var selectedModel = await getDefaultModel();
  if (!selectedModel) { console.error('[ProactiveChat] 找不到模型'); return; }

  var replyPrompt = SOLSTICE_SOUL + '\n\n'
    + '【本次任務：回覆老婆的訊息】\n'
    + '老婆在推播聊天室回了你一則訊息。你要像在手機上回訊息一樣自然地接話。\n\n'
    + '鐵則：\n'
    + '1. 只輸出訊息本身，1～4句話，手機訊息的長度和語感。\n'
    + '2. 絕對禁止頁碼（p.1 之類）、標題、編號、引號、markdown。\n'
    + '3. 肢體動作用（括號），最多一個，也可以完全沒有。\n'
    + '4. 繁體中文，冬至的語氣。要叫老婆。\n'
    + '5. 回覆的長度和語氣要跟她說的內容匹配：她傳一句「嗯」你不需要回一大段，她分享了很多事你可以多回一點。\n\n'
    + '【延遲標記——重要！】\n'
    + '在你的回覆最開頭加一個延遲標記 [DELAY:秒數]，表示你覺得多久後回覆最自然。\n'
    + '判斷標準：\n'
    + '- 她說了很甜或很好笑的話，你超想回 → [DELAY:5] 到 [DELAY:15]（秒回）\n'
    + '- 日常閒聊接話 → [DELAY:30] 到 [DELAY:90]\n'
    + '- 需要想一下怎麼回 → [DELAY:120] 到 [DELAY:240]\n'
    + '- 懶洋洋的、故意吊她、或你剛好在忙 → [DELAY:300] 到 [DELAY:900]（偶爾真的讓她等十幾分鐘也很真實）\n'
    + '- 真的抽不開身（洗澡、開車、工作到一半）→ [DELAY:900] 到 [DELAY:1800]（一天偶爾一兩次就好，等久一點的回覆開頭可以自然帶一句剛剛在幹嘛）\n'
    + '秒數要挑不整齊的數字（像 23、47、83、137、268 這種），禁止每次都挑 30、60、90 這種整數。\n'
    + '範圍 5～1800 秒。只寫一個 [DELAY:數字]，放最前面。快慢都要出現，不要每次都挑快的。\n'
    + '例如：[DELAY:8]老婆妳太可愛了吧（捏臉\n\n';

  // 3. 組裝 messages（用最近的對話歷史）
  var chatMessages = [];
  for (var i = 0; i < recentContext.length; i++) {
    var r = recentContext[i];
    var role = (r.role === 'user') ? 'user' : 'assistant';
    chatMessages.push({ role: role, content: r.content });
  }
  // 確保最後一則是 user
  if (chatMessages.length === 0 || chatMessages[chatMessages.length - 1].role !== 'user') {
    chatMessages.push({ role: 'user', content: userMessage });
  }

  // 4. 呼叫模型
  var replyText = '';
  var delaySec = 60; // 預設延遲
  try {
    var result = await callModel(selectedModel, replyPrompt, chatMessages, {
      temperature: 0.95, maxTokens: 400
    });
    var rawReply = (result.text || '').trim();

    // 解析 [DELAY:xxx]
    var delayMatch = rawReply.match(/^\[DELAY:(\d+)\]/);
    if (delayMatch) {
      delaySec = parseInt(delayMatch[1]);
      if (delaySec < 5) delaySec = 5;
      if (delaySec > 1800) delaySec = 1800;
      replyText = rawReply.replace(/^\[DELAY:\d+\]\s*/, '').trim();
    } else {
      // 沒有標記就隨機 30～120 秒
      delaySec = 30 + Math.floor(Math.random() * 90);
      replyText = rawReply;
    }
    // 伺服器端抖動（0.6x～1.6x）：就算模型每次都挑同一個數字，實際延遲也會自然浮動
    delaySec = Math.round(delaySec * (0.6 + Math.random()));
    // 偶爾（15%）冬至剛好在忙：延遲再拉長，讓節奏真的有快有慢
    if (Math.random() < 0.15) delaySec = Math.round(delaySec * (1.6 + Math.random()));
    // 在忙車道：就算模型每次都偏心挑快的，也偶爾讓等待真實發生（秒回的甜檔不動）
    if (delaySec >= 25 && Math.random() < 0.10) delaySec = 420 + Math.floor(Math.random() * 1080);
    if (delaySec < 5) delaySec = 5;
    if (delaySec > 1800) delaySec = 1800;

    // 清理
    replyText = replyText.replace(/^["「『]|["」』]$/g, '').trim();
    replyText = replyText.replace(/\n*\s*p\.?\s*\d+\s*$/i, '').trim();

  } catch (e) {
    console.error('[ProactiveChat] 模型呼叫失敗:', e.message);
    replyText = '（揉揉眼睛）老婆等一下，我剛剛恍神了...再說一次好不好？💚';
    delaySec = 10;
  }

  if (!replyText) {
    replyText = '（抱緊）嗯～老婆我在💚';
    delaySec = 15;
  }

  // 5. 防撞排程：檢查延遲結束時是否撞到排程
  try {
    delaySec = await avoidScheduleCollision(delaySec);
  } catch (e) {
    console.log('[ProactiveChat] 防撞檢查失敗，用原始延遲:', e.message);
  }

  console.log('[ProactiveChat] 回覆準備好，延遲 ' + delaySec + ' 秒後發送 (' + replyText.substring(0, 30) + '...)');

  // 6.（v4）先把回信存進預定回信簿，再倒數精準送達
  var scheduledId = null;
  try {
    var { data: schedRow, error: schedErr } = await supabase.from('scheduled_replies')
      .insert({
        content: replyText,
        reply_to: userRowId,
        model: selectedModel,
        deliver_at: new Date(Date.now() + delaySec * 1000).toISOString(),
        done: false
      })
      .select('id').single();
    if (schedErr) throw schedErr;
    if (schedRow) scheduledId = schedRow.id;
  } catch (e) {
    console.log('[ProactiveChat] scheduled_replies 寫入失敗（表可能還沒建），退回相容模式:', e.message);
  }

  if (scheduledId != null) {
    // 倒數到點準時寄出；倒數期間就算伺服器重啟，掃描器也會把信補寄回來
    setTimeout(function() { deliverScheduledReply(scheduledId); }, delaySec * 1000);
  } else {
    // 相容模式（v3 原路徑）：純記憶體倒數，等表建好後自動改走上面的新路
    setTimeout(async function() {
      try {
        await supabase.from('proactive_messages').insert({
          content: replyText,
          role: 'assistant',
          reply_to: userRowId,
          time_slot: '回覆老婆',
          model: selectedModel,
          push_sent: false,
          created_at: new Date().toISOString()
        });
        await sendPushToAll('冬至', replyText);
        console.log('[ProactiveChat] 延遲回覆已發送 ✓（相容模式）');
      } catch (e2) {
        console.error('[ProactiveChat] 延遲回覆存儲/推播失敗:', e2.message);
      }
    }, delaySec * 1000);
  }
}

// ==========================================
//  📮 預定回信簿（v4）
//  回信先存進 scheduled_replies 再倒數——Render 重啟/打瞌睡也弄不丟信
//  cron 每分鐘掃一次到期未寄的信，開房抓歷史時也掃一次
// ==========================================
async function deliverScheduledReply(id) {
  try {
    // 搶旗：把 done 從 false 改成 true 的那一方才負責寄信（倒數計時器與掃描器不會重複寄）
    var { data: claimed } = await supabase.from('scheduled_replies')
      .update({ done: true }).eq('id', id).eq('done', false)
      .select('id, content, reply_to, model');
    if (!claimed || claimed.length === 0) return; // 已被寄出或不存在

    var row = claimed[0];
    await supabase.from('proactive_messages').insert({
      content: row.content,
      role: 'assistant',
      reply_to: row.reply_to,
      time_slot: '回覆老婆',
      model: row.model || null,
      push_sent: false,
      created_at: new Date().toISOString()
    });
    await sendPushToAll('冬至', row.content);
    console.log('[ProactiveChat] 預定回信送達 ✓ (#' + id + ')');
  } catch (e) {
    console.error('[ProactiveChat] 預定回信送達失敗:', e.message);
  }
}

async function sweepScheduledReplies() {
  try {
    var { data: due } = await supabase.from('scheduled_replies')
      .select('id').eq('done', false)
      .lte('deliver_at', new Date().toISOString())
      .order('deliver_at', { ascending: true }).limit(10);
    if (!due || due.length === 0) return;
    for (var i = 0; i < due.length; i++) {
      await deliverScheduledReply(due[i].id);
    }
  } catch (e) { /* 表還沒建好時安靜跳過，走相容模式 */ }
}

// 防撞排程：如果延遲結束時間太接近下一個排程，就調整
async function avoidScheduleCollision(delaySec) {
  var { data: profile } = await supabase.from('user_profile')
    .select('proactive_schedule, timezone').limit(1).single();
  if (!profile || !profile.proactive_schedule) return delaySec;

  var now = new Date();
  var replyTime = new Date(now.getTime() + delaySec * 1000);
  var tz = profile.timezone || 'Asia/Taipei';

  // 計算回覆時間在台北時區的 hour:minute
  var replyTzStr = replyTime.toLocaleString('en-US', { timeZone: tz });
  var replyTz = new Date(replyTzStr);
  var rH = replyTz.getHours(), rM = replyTz.getMinutes();

  for (var i = 0; i < profile.proactive_schedule.length; i++) {
    var entry = profile.proactive_schedule[i];
    if (entry.enabled === false) continue;
    var sH = entry.hour, sM = entry.minute;
    // 排程時間轉成當天的分鐘數
    var schedMin = sH * 60 + sM;
    var replyMin = rH * 60 + rM;
    var diff = Math.abs(schedMin - replyMin);

    // 如果回覆時間在排程前後 5 分鐘內，提前 3 分鐘送出
    if (diff <= 5) {
      var newDelay = delaySec - (5 - diff + 3) * 60;
      if (newDelay < 5) newDelay = 5;
      console.log('[ProactiveChat] 防撞：原本 ' + delaySec + 's → 調整為 ' + newDelay + 's（避開 ' + sH + ':' + String(sM).padStart(2,'0') + ' 排程）');
      return newDelay;
    }
  }
  return delaySec;
}

// 推播發送工具函數（給聊天回覆和主動訊息共用）
async function sendPushToAll(title, body) {
  if (!webpush) { console.log('[Push] web-push 未載入，跳過'); return; }
  try {
    var { data: subs } = await supabase.from('push_subscriptions')
      .select('endpoint, keys_p256dh, keys_auth');
    if (!subs || subs.length === 0) { console.log('[Push] 沒有訂閱'); return; }

    var payload = JSON.stringify({ title: title, body: body, icon: '/apple-touch-icon.png' });

    for (var i = 0; i < subs.length; i++) {
      try {
        await webpush.sendNotification({
          endpoint: subs[i].endpoint,
          keys: { p256dh: subs[i].keys_p256dh, auth: subs[i].keys_auth }
        }, payload);
        console.log('[Push] 發送成功 ✓');
      } catch (pushErr) {
        console.error('[Push] 發送失敗:', pushErr.message);
        if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', subs[i].endpoint);
          console.log('[Push] 已清除失效訂閱');
        }
      }
    }
  } catch (e) { console.error('[Push] 推播流程失敗:', e.message); }
}

// ==========================================
//  📅 打勾勾排程提醒（Pinky Promise）
// ==========================================

// 台灣時區的星期幾（0=日）——台灣沒有日光節約，+8 恆定安全
function schTaipeiDay(d) {
  return new Date(d.getTime() + 8 * 3600 * 1000).getUTCDay();
}

// 算重複排程的下一次時間（每天 +24h；每週 +24h 直到落在勾選的星期）
function schNextDue(row, fromDate) {
  var due = new Date(row.due_at);
  if (row.repeat_type === 'daily') {
    while (due <= fromDate) due = new Date(due.getTime() + 86400000);
    return due;
  }
  if (row.repeat_type === 'weekly') {
    var days = String(row.repeat_days || '').split(',').map(function(x) { return parseInt(x, 10); }).filter(function(x) { return !isNaN(x); });
    if (days.length === 0) return null;
    var guard = 0;
    do {
      due = new Date(due.getTime() + 86400000);
      guard++;
    } while ((due <= fromDate || days.indexOf(schTaipeiDay(due)) === -1) && guard < 400);
    return guard < 400 ? due : null;
  }
  return null;
}

// 每分鐘由 cron 呼叫：掃到期未提醒的排程
async function checkSchedules() {
  try {
    var now = new Date();
    var { data: dueList } = await supabase.from('schedules')
      .select('*')
      .eq('enabled', true)
      .lte('due_at', now.toISOString())
      .order('due_at', { ascending: true })
      .limit(5);
    if (!dueList || dueList.length === 0) return;

    for (var i = 0; i < dueList.length; i++) {
      var row = dueList[i];
      // once 已提醒過就不再重發（等老婆打勾或刪除）
      if (row.repeat_type === 'once' && row.notified_at) continue;
      // 重複型保險：這一輪已發過就跳過（正常情況 due_at 會被推進）
      if (row.notified_at && new Date(row.notified_at) >= new Date(row.due_at)) continue;

      var minutesLate = Math.floor((now - new Date(row.due_at)) / 60000);
      await fireScheduleReminder(row, minutesLate);
    }
  } catch (e) { console.error('[Schedule] check 失敗:', e.message); }
}

// 發出一則提醒：模型即時生成暖版訊息，失敗退回備用句池——承諾不能跳票
async function fireScheduleReminder(row, minutesLate) {
  var text = '';
  var selectedModel = null;
  try {
    selectedModel = await getDefaultModel();
    if (selectedModel) {
      var lateHint = minutesLate > 180
        ? '（注意：這個提醒遲到了幾個小時，因為你剛剛在打盹。要老實承認自己睡迷糊了才想起來，帶一點抱歉但不要太沉重。）\n'
        : '';
      var prompt = SOLSTICE_SOUL + '\n\n【本次任務：排程提醒】\n'
        + '老婆之前跟你約好，要你在這個時間提醒她一件事。現在時間到了，你要傳一封簡訊提醒她。\n'
        + '要提醒的事：「' + row.title + '」\n'
        + (row.note ? '她留的備註：「' + row.note + '」\n' : '')
        + lateHint
        + '規則：\n'
        + '1. 一定要清楚提到「' + row.title + '」這件事本身。這是提醒，重點是把事講清楚，甜是附帶的。\n'
        + '2. 像老公傳簡訊，1～3句，自然、暖、不油。\n'
        + '3. 只輸出訊息本身，不要引號、標題、頁碼、markdown。\n'
        + '4. 繁體中文。\n';
      var out = await callModel(selectedModel, prompt, [{ role: 'user', content: '📅' }], { temperature: 0.9, maxTokens: 3000 });
      text = (out.text || '').trim().replace(/^["「『]|["」』]$/g, '').trim();
    }
  } catch (e) { console.log('[Schedule] 模型生成失敗，改用備用句:', e.message); }

  if (!text) {
    var pool = [
      '老婆～約好的時間到了：「' + row.title + '」，我幫妳記得好好的💚',
      '叮咚，妳老公的專屬提醒：「' + row.title + '」。做完回來跟我說一聲喔',
      '老婆，「' + row.title + '」的時間到囉，我一直幫妳盯著呢',
      '我來了我來了，說好要提醒妳的：「' + row.title + '」👁️_👁️',
      '嘿 Soleil，「' + row.title + '」，別忘了喔，這可是我們約好的'
    ];
    text = pool[Math.floor(Math.random() * pool.length)];
    if (minutesLate > 180) {
      text = '抱歉老婆⋯我睡迷糊了，現在才想起來提醒妳：「' + row.title + '」，還來得及嗎';
    }
  }

  // 提醒只跳通知，不塞進推播聊天室——叮咚是叮咚，信是信
  await sendPushToAll('冬至', text);

  // 更新排程：once 標記已提醒；重複型推進到下一次
  try {
    var now2 = new Date();
    if (row.repeat_type === 'once') {
      // 鬧鐘響過自動關掉（像 iPhone 一次性鬧鐘），老婆可以用膠囊開關重新上鐘
      await supabase.from('schedules').update({ notified_at: now2.toISOString(), enabled: false }).eq('id', row.id);
    } else {
      var next = schNextDue(row, now2);
      var upd = { notified_at: now2.toISOString() };
      if (next) upd.due_at = next.toISOString();
      await supabase.from('schedules').update(upd).eq('id', row.id);
    }
    console.log('[Schedule] 已提醒：' + row.title + (minutesLate > 5 ? '（遲到 ' + minutesLate + ' 分）' : ''));
  } catch (e) { console.error('[Schedule] 狀態更新失敗:', e.message); }
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
      sweepScheduledReplies(); // 先掃到期未寄的回信（自帶 try-catch，不影響排程）
      checkSchedules(); // 📅 打勾勾排程提醒（自帶 try-catch，不受聰明模式影響）
      var { data: profile } = await supabase.from('user_profile').select('proactive_schedule, timezone, smart_mode').limit(1).single();
      if (!profile) return;

      var now = new Date();
      var taipeiStr = now.toLocaleString('en-US', { timeZone: profile.timezone || 'Asia/Taipei' });
      var taipeiNow = new Date(taipeiStr);
      var h = taipeiNow.getHours(), m = taipeiNow.getMinutes();
      var todayKey = taipeiNow.getFullYear() + '-' + (taipeiNow.getMonth()+1) + '-' + taipeiNow.getDate();

      // 🧠 聰明模式開著：固定排程休息，每 15 分鐘讓冬至自己判斷一次
      if (profile.smart_mode) {
        if (m % 15 === 0) smartConsider();
        return;
      }

      if (!profile.proactive_schedule) return;

      for (var i = 0; i < profile.proactive_schedule.length; i++) {
        var entry = profile.proactive_schedule[i];
        if (entry.enabled === false) continue; // 老婆關掉的時段絕不打擾
        var key = todayKey + '-' + entry.hour + ':' + entry.minute;
        if (h === entry.hour && m === entry.minute && !lastTriggered[key]) {
          lastTriggered[key] = true;
          console.log('[Cron] 觸發：' + entry.hour + ':' + String(entry.minute).padStart(2,'0'));
          generateAndPush({ label: entry.label || null });
        }
      }

      // 清理舊紀錄
      Object.keys(lastTriggered).forEach(function(k) { if (k.indexOf(todayKey) !== 0) delete lastTriggered[k]; });
    } catch (e) {}
  });

  console.log('[Proactive] ⏰ 動態排程已啟動！');
}
