<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Solstice">
<meta name="theme-color" content="#0a100d">
<title>Solstice Home</title>
<link rel="manifest" href="/manifest.json">
<link rel="apple-touch-icon" href="/icon-192.png">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Noto+Serif+TC:wght@300;400;500&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
--bg-deep:#0a100d;
--bg-card:rgba(14,25,18,.65);
--gold:#c9a84c;
--gold-dim:#a08838;
--emerald:#2ecc71;
--emerald-dim:rgba(46,204,113,.15);
--emerald-glow:rgba(46,204,113,.25);
--text-main:#e8e6e3;
--text-sub:#a09880;
--border-subtle:rgba(201,168,76,.12);
--border-gold:rgba(201,168,76,.25);--border-emerald:rgba(46,204,113,.25);--border-silver:rgba(200,210,220,.35);
--glass:rgba(14,25,18,.55);
--glass-border:rgba(46,204,113,.12);
}
html,body{height:100%;overflow:hidden;background:var(--bg-deep);color:var(--text-main);font-family:'Noto Sans TC','Noto Serif TC',system-ui,sans-serif}
body{padding-top:env(safe-area-inset-top)}
/* Fireflies */
#fireflies{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.ff{position:absolute;background:radial-gradient(circle,rgba(46,204,113,.8),transparent 70%);border-radius:50%;animation:ffFloat 6s ease-in-out infinite alternate,ffFade 4s ease-in-out infinite alternate}
@keyframes ffFloat{0%{transform:translateY(0) translateX(0)}100%{transform:translateY(-60px) translateX(30px)}}
@keyframes ffFade{0%{opacity:.2}50%{opacity:.7}100%{opacity:.2}}
/* === WELCOME PAGE === */
#welcome{position:fixed;inset:0;background:var(--bg-deep);display:flex;align-items:center;justify-content:center;z-index:10;transition:opacity .6s ease,visibility .6s ease}
#welcome.hidden{opacity:0;visibility:hidden;pointer-events:none}
.w-content{text-align:center;padding:20px;max-width:400px}
.w-orn{color:var(--emerald);font-size:18px;margin-bottom:12px;letter-spacing:8px}
.w-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;background:linear-gradient(135deg,#a8f0c6,#f0e2b5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:6px;letter-spacing:2px}
.w-sun{font-size:20px;margin:4px 0}
.w-sub{font-family:'Cormorant Garamond',serif;font-style:italic;background:linear-gradient(135deg,#a8f0c6,#f0e2b5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:15px;margin-bottom:6px;letter-spacing:1px}
.w-heart{font-size:18px;margin-bottom:16px}
.w-photo{width:180px;height:180px;border-radius:50%;object-fit:cover;margin:0 auto 20px;display:block;border:2px solid var(--emerald-dim);box-shadow:0 0 30px rgba(46,204,113,.15),0 4px 24px rgba(0,0,0,.4)}
.w-enter{background:rgba(14,30,20,.5);border:1px solid rgba(168,240,198,.3);color:var(--emerald);padding:12px 36px;border-radius:30px;font-size:15px;font-family:'Noto Serif TC',serif;cursor:pointer;transition:all .3s;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.w-enter:active{background:rgba(46,204,113,.1);transform:scale(.97)}
.w-ann{color:var(--emerald);font-size:12px;margin-top:16px;font-family:'Courier New',monospace;letter-spacing:1px;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.w-ann-sub{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:12px;margin-top:6px;background:linear-gradient(135deg,rgba(168,240,198,.6),rgba(240,226,181,.6));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:1px;filter:drop-shadow(0 1px 4px rgba(0,0,0,.5))}
/* === LIVING ROOM (NEW) === */
#livingRoom{position:fixed;inset:0;display:none;flex-direction:column;z-index:9;overflow-y:auto;-webkit-overflow-scrolling:touch;background:linear-gradient(rgba(10,16,13,.20),rgba(10,16,13,.20)),url(https://raw.githubusercontent.com/peishuanloveyourbulb-dotcom/solstice-frontend/main/images/bg-sunflower.png) center/cover no-repeat fixed}
#livingRoom.active{display:flex}
.lr-header{text-align:center;padding:max(env(safe-area-inset-top),16px) 20px 8px;flex-shrink:0;margin-top:8px}
.lr-welcome{font-family:'Cormorant Garamond',serif;font-size:24px;background:linear-gradient(135deg,#a8f0c6,#f0e2b5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:400;filter:drop-shadow(0 1px 4px rgba(0,0,0,.7))}
.lr-days{background:linear-gradient(135deg,rgba(168,240,198,.7),rgba(240,226,181,.7));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:13px;margin-top:4px;font-family:'Courier New',monospace;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6))}
.lr-grid{display:flex;flex-direction:column;gap:14px;padding:0 20px max(env(safe-area-inset-bottom),24px);flex:1;justify-content:flex-end;padding-bottom:max(env(safe-area-inset-bottom),80px)}
.lr-grid .lr-top-card{width:100%}
.lr-grid .lr-bottom{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.lr-card{background:rgba(10,16,13,.35);border:0.5px solid rgba(168,240,198,.15);border-radius:16px;padding:24px 16px;text-align:center;cursor:pointer;transition:all .3s;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);-webkit-text-fill-color:initial}
.lr-card:nth-child(odd){border-color:rgba(46,204,113,.15)}
.lr-card:nth-child(even){border-color:rgba(46,204,113,.15)}
.lr-card:active{border-color:var(--emerald);box-shadow:0 0 15px var(--emerald-glow);transform:scale(.97)}
.lr-card-icon{font-size:28px;margin-bottom:8px;-webkit-text-fill-color:initial}
.lr-card-name{font-family:'Noto Serif TC',serif;font-size:14px;background:linear-gradient(135deg,#a8f0c6,#f0e2b5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:4px}
.lr-card-desc{font-size:11px;background:linear-gradient(135deg,rgba(168,240,198,.6),rgba(240,226,181,.6));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
/* === BACK BUTTON (GLOBAL) === */
.back-home{position:absolute;top:max(env(safe-area-inset-top),12px);left:max(env(safe-area-inset-left),14px);color:var(--emerald-dim);font-size:14px;background:none;border:none;cursor:pointer;z-index:30;font-family:'Noto Sans TC',sans-serif;padding:8px 4px;transition:color .2s}
.back-home:active{color:var(--emerald)}
.lr-back{position:fixed;bottom:max(env(safe-area-inset-bottom),24px);left:max(env(safe-area-inset-left),18px);z-index:10;background:rgba(14,30,20,.5);border:1px solid rgba(46,204,113,.2);width:40px;height:40px;border-radius:50%;color:var(--emerald);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);transition:all .2s}
.lr-back:active{background:rgba(46,204,113,.1);transform:scale(.9)}
/* === SIDEBAR === */
.sidebar-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:20;opacity:0;visibility:hidden;transition:all .3s}
.sidebar-overlay.open{opacity:1;visibility:visible}
.sidebar{position:fixed;top:0;left:0;bottom:0;width:280px;background:linear-gradient(rgba(14,25,18,.65),rgba(14,25,18,.65)),url(data:image/jpeg;base64,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) center/cover no-repeat;border-right:1px solid var(--glass-border);z-index:21;transform:translateX(-100%);transition:transform .3s ease;display:flex;flex-direction:column;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
.sidebar.open{transform:translateX(0)}
.sb-top{display:flex;justify-content:space-between;align-items:center;padding:max(env(safe-area-inset-top),16px) 16px 12px}
.sb-title{background:linear-gradient(135deg,#a8f0c6,#f0e2b5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-family:'Noto Serif TC',serif;font-size:15px}
.sb-close{background:none;border:none;color:var(--text-sub);font-size:20px;cursor:pointer;padding:4px}
.sb-section{padding:0 16px;margin:8px 0}
.sb-btn{width:100%;padding:12px;border-radius:12px;border:1px solid var(--border-emerald);background:var(--glass);color:var(--emerald);font-size:13px;cursor:pointer;text-align:center;font-family:'Noto Serif TC',serif;transition:all .2s;margin-bottom:8px}
.sb-btn:active{background:rgba(201,168,76,.1);border-color:var(--emerald)}
.sb-list{flex:1;overflow-y:auto;padding:8px 16px;-webkit-overflow-scrolling:touch}
.sb-item{padding:12px;border-radius:10px;margin-bottom:6px;cursor:pointer;background:var(--glass);border:1px solid transparent;display:flex;justify-content:space-between;align-items:center;transition:all .2s}
.sb-item.active{border-color:var(--emerald);background:rgba(46,204,113,.08)}
.sb-item:active{background:rgba(46,204,113,.05)}
.sb-item-text{flex:1;min-width:0}
.sb-item-name{font-size:13px;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-item-actions{display:flex;gap:6px;margin-left:8px;flex-shrink:0}
.sb-act-btn{background:none;border:1px solid var(--border-subtle);color:var(--text-sub);font-size:11px;padding:3px 8px;border-radius:6px;cursor:pointer}
.sb-empty{text-align:center;color:var(--text-sub);font-size:13px;padding:30px 0;white-space:pre-line}
.sb-footer{text-align:center;padding:12px;color:var(--emerald-dim);font-size:11px;font-family:'Courier New',monospace;letter-spacing:1px;border-top:1px solid var(--border-subtle)}
/* === CHAT === */
#chat{position:fixed;inset:0;display:flex;flex-direction:column;z-index:8;background:var(--bg-deep);visibility:hidden;opacity:0;transition:opacity .4s}
#chat.active{visibility:visible;opacity:1}
.ch-header{display:flex;align-items:center;justify-content:space-between;padding:max(env(safe-area-inset-top),10px) max(env(safe-area-inset-right),14px) 8px max(env(safe-area-inset-left),14px);border-bottom:0.5px solid rgba(46,204,113,.12);background:rgba(14,30,20,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);flex-shrink:0;overflow:hidden}
.ch-left{display:flex;align-items:center;gap:8px;min-width:0;flex-shrink:1;overflow:hidden}
.ch-menu{background:none;border:none;color:var(--text-sub);font-size:20px;cursor:pointer;padding:6px}
.ch-avatar{width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid var(--emerald-dim)}
.ch-name{font-family:'Noto Serif TC',serif;font-size:14px;color:var(--text-main);margin-left:2px}
.ch-stat{color:var(--emerald);font-size:9px;display:block}
.ch-msgs{flex:1;overflow-y:auto;padding:16px max(env(safe-area-inset-right),14px) 20px max(env(safe-area-inset-left),14px);display:flex;flex-direction:column;gap:10px;-webkit-overflow-scrolling:touch;background:linear-gradient(rgba(10,16,13,.30),rgba(10,16,13,.30)),url(https://raw.githubusercontent.com/peishuanloveyourbulb-dotcom/solstice-frontend/main/images/bg-main.jpg) center/cover no-repeat fixed;-webkit-transform:translateZ(0);transform:translateZ(0)}
.ch-row{display:flex;width:100%;align-items:flex-end;gap:8px}
.ch-row.user{justify-content:flex-end}
.ch-row.ai{justify-content:flex-start}
.ch-bub{padding:10px 16px;max-width:80%;font-size:13.5px;line-height:1.85;font-family:'Noto Serif TC',system-ui,sans-serif;animation:fu .3s ease-out;white-space:pre-wrap;word-break:break-word}
.ch-bub.ai{background:rgba(17,26,20,.75);border:0.5px solid rgba(46,204,113,.12);border-left:2px solid rgba(46,204,113,.35);color:var(--text-main);border-radius:4px 16px 16px 16px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.ch-bub.user{background:rgba(30,55,30,.6);border:0.5px solid rgba(46,204,113,.15);border-right:2px solid rgba(46,204,113,.4);color:#f0ede6;border-radius:16px 4px 16px 16px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.ch-typing{opacity:.8;font-style:italic;font-size:12px}
.ch-typing span{animation:blink 1.4s infinite}
.ch-time{font-size:10px;color:var(--text-sub);margin-top:2px;padding:0 48px}
.ch-loading{text-align:center;color:var(--text-sub);font-size:13px;padding:20px}
.ch-inp{display:flex;align-items:flex-end;gap:8px;padding:10px max(env(safe-area-inset-right),14px) max(env(safe-area-inset-bottom),24px) max(env(safe-area-inset-left),14px);border-top:0.5px solid rgba(46,204,113,.12);background:rgba(14,30,20,.92);flex-shrink:0}
.ch-inp textarea{flex:1;min-width:0;background:rgba(20,38,25,.8);border:0.5px solid rgba(46,204,113,.15);border-radius:20px;padding:10px 18px;color:var(--text-main);font-size:13.5px;font-family:'Noto Serif TC',system-ui,sans-serif;outline:none;-webkit-appearance:none;transition:border-color .2s;resize:none;overflow-y:auto;max-height:120px;line-height:1.5;min-height:40px}
.ch-inp textarea:focus{border-color:rgba(46,204,113,.5);box-shadow:0 0 8px var(--emerald-glow)}
.ch-inp textarea::placeholder{color:#68665e}
.ch-send{min-width:0;width:38px;height:38px;border-radius:50%;border:1.5px solid var(--emerald);background:transparent;color:var(--emerald);font-size:18px;cursor:pointer;transition:all .2s;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.ch-send:disabled{opacity:.3;cursor:default}
.ch-send:not(:disabled):active{background:var(--emerald);color:var(--bg-deep)}
.ch-hrt{font-size:14px}
.ch-img-btn{width:38px;height:38px;border-radius:50%;border:1.5px solid var(--emerald-dim);background:transparent;color:var(--emerald);font-size:16px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s;opacity:.7}
.ch-img-btn:active{opacity:1;background:rgba(46,204,113,.15)}
.ch-preview{position:relative;margin:4px 0;display:none}
.ch-preview img{max-height:80px;border-radius:10px;border:1px solid var(--glass-border)}
.ch-preview .ch-preview-x{position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,.7);color:#fff;font-size:12px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center}
.ch-mode-toggle{display:flex;align-items:center;gap:2px;flex-shrink:0}
.ch-mode-toggle button{background:var(--glass);border:1px solid var(--border-subtle);color:var(--text-sub);font-size:13px;padding:6px;border-radius:10px;cursor:pointer;transition:all .2s;line-height:1;width:32px;height:32px;display:flex;align-items:center;justify-content:center}
.ch-mode-toggle button.active{border-color:var(--emerald);color:var(--emerald);background:rgba(46,204,113,.1)}
.ch-bub img.msg-img{max-width:100%;border-radius:8px;margin-top:6px;cursor:pointer}
.model-select{background:var(--glass);border:1px solid var(--border-subtle);color:var(--text-sub);font-size:11px;padding:4px 8px;border-radius:8px;outline:none;-webkit-appearance:none;cursor:pointer;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.typing-dots{display:flex;gap:4px;padding:8px 14px}
.typing-dots span{width:7px;height:7px;border-radius:50%;background:var(--emerald);animation:bounce .6s ease-in-out infinite alternate}
.typing-dots span:nth-child(2){animation-delay:.15s}
.typing-dots span:nth-child(3){animation-delay:.3s}
@keyframes bounce{to{transform:translateY(-6px);opacity:.3}}
@keyframes blink{50%{opacity:0}}
.scroll-bottom-btn{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);width:36px;height:36px;border-radius:50%;background:var(--glass);border:1px solid var(--glass-border);color:var(--emerald);font-size:18px;cursor:pointer;z-index:5;display:none;align-items:center;justify-content:center;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.scroll-bottom-btn.show{display:flex}
/* === NOTES === */
/* === MEMORY === */
#memoryPage{position:fixed;inset:0;display:flex;flex-direction:column;z-index:9;background:var(--bg-deep);transform:translateX(100%);transition:transform .3s ease;visibility:hidden}
#memoryPage.active{transform:translateX(0);visibility:visible}
.mem-header{display:flex;align-items:center;justify-content:space-between;padding:max(env(safe-area-inset-top),14px) 16px 10px;border-bottom:0.5px solid rgba(46,204,113,.12);background:rgba(14,30,20,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.mem-back{background:none;border:none;color:var(--emerald-dim);font-size:14px;cursor:pointer;padding:6px}
.mem-title{font-family:'Noto Serif TC',serif;font-size:15px;background:linear-gradient(135deg,#a8f0c6,#f0e2b5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;flex:1;text-align:center}
.mem-tabs{display:flex;gap:8px;padding:12px 16px 8px;background:rgba(10,16,13,.85)}
.mem-tab{flex:1;padding:8px;border-radius:10px;border:1px solid var(--border-subtle);background:transparent;color:var(--text-sub);font-size:12px;cursor:pointer;font-family:'Noto Sans TC',sans-serif;transition:all .2s;text-align:center}
.mem-tab.active{border-color:var(--emerald);color:var(--emerald);background:rgba(46,204,113,.06)}
.mem-wall{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px;-webkit-overflow-scrolling:touch;min-height:0;background:linear-gradient(rgba(10,16,13,.20),rgba(10,16,13,.20)),url(https://raw.githubusercontent.com/peishuanloveyourbulb-dotcom/solstice-frontend/main/images/bg-sunflower.png) center/cover no-repeat fixed}
.mem-card{background:rgba(10,16,13,.35);border:0.5px solid rgba(168,240,198,.15);border-radius:12px;padding:12px 14px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);overflow:visible}
.mem-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.mem-type{font-size:11px;border-radius:6px;padding:2px 8px}
.mem-type-manual{background:rgba(46,204,113,.1);color:var(--emerald)}
.mem-type-auto{background:rgba(201,168,76,.1);color:var(--emerald)}
.mem-type-compressed{background:rgba(160,152,128,.1);color:var(--text-sub)}
.mem-actions{display:flex;align-items:center;gap:6px}
.mem-when{color:var(--text-sub);font-size:10px}
.mem-edit,.mem-del{background:none;border:none;color:var(--text-sub);cursor:pointer;font-size:13px;padding:2px 4px;opacity:.7}
.mem-text{font-size:13px;line-height:1.7;color:var(--text-main);word-wrap:break-word;overflow-wrap:break-word;white-space:pre-wrap}
.mem-edit-area{width:100%;min-height:60px;background:var(--glass);border:1px solid var(--emerald);border-radius:8px;color:var(--text-main);font-size:13px;padding:8px;resize:vertical;margin-top:6px;outline:none;font-family:'Noto Sans TC',sans-serif}
.mem-edit-btns{display:flex;gap:8px;justify-content:flex-end;margin-top:6px}
.mem-save-btn,.mem-cancel-btn{padding:5px 14px;border-radius:8px;font-size:12px;cursor:pointer;border:1px solid var(--border-subtle);background:transparent;color:var(--text-sub)}
.mem-save-btn{border-color:var(--emerald);color:var(--emerald)}
.mem-empty{text-align:center;color:var(--text-sub);font-size:13px;padding:30px 0;white-space:pre-line}
.mem-inp{display:flex;align-items:flex-end;gap:8px;padding:10px 16px max(env(safe-area-inset-bottom),24px);border-top:0.5px solid rgba(46,204,113,.12);background:rgba(14,30,20,.92)}
.mem-inp textarea{flex:1;min-width:0;background:var(--glass);border:1px solid var(--glass-border);border-radius:16px;padding:10px 18px;color:var(--text-main);font-size:13px;outline:none;-webkit-appearance:none;resize:none;font-family:'Noto Sans TC',sans-serif;line-height:1.6;min-height:40px;max-height:120px;overflow-y:auto}
.mem-inp textarea:focus{border-color:rgba(46,204,113,.5)}
.mem-inp textarea::placeholder{color:#68665e}
.mem-inp button{min-width:0;width:36px;height:36px;border-radius:50%;border:1.5px solid var(--emerald);background:transparent;color:var(--emerald);font-size:16px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.mem-inp button:disabled{opacity:.3}
/* === UNDER CONSTRUCTION === */
/* === ANNIVERSARY TIMELINE === */
/* === DAILY QUESTIONS === */
.header-back{background:none;border:none;color:var(--emerald-dim);font-size:14px;cursor:pointer;padding:6px;min-width:32px}
.under-construction{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9;background:var(--bg-deep);transform:translateX(100%);transition:transform .3s ease;visibility:hidden}
.under-construction.active{transform:translateX(0);visibility:visible}
.uc-icon{font-size:48px;margin-bottom:16px}
.uc-title{font-family:'Noto Serif TC',serif;font-size:18px;color:var(--emerald);margin-bottom:8px}
.uc-desc{font-size:13px;color:var(--text-sub);text-align:center;padding:0 40px;line-height:1.8}
/* === CAPSULE MACHINE === */
@keyframes capFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes capSpin{0%{transform:rotate(0)}25%{transform:rotate(10deg)}50%{transform:rotate(-10deg)}75%{transform:rotate(5deg)}100%{transform:rotate(0)}}
/* === MODALS === */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:50;display:none;align-items:center;justify-content:center}
.modal-bg.open{display:flex}
.modal-box{background:rgba(14,25,18,.95);border:1px solid var(--border-emerald);border-radius:16px;padding:24px;max-width:300px;width:85%;text-align:center;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.modal-box p{color:var(--text-main);font-size:14px;margin-bottom:16px;line-height:1.6}
.modal-btns{display:flex;gap:10px;justify-content:center}
.modal-btn{padding:8px 20px;border-radius:10px;font-size:13px;cursor:pointer;border:1px solid var(--border-subtle);background:transparent;color:var(--text-sub)}
.modal-btn.ok{border-color:var(--emerald);color:var(--emerald)}
.modal-btn.danger{border-color:#e74c3c;color:#e74c3c}
.rename-input{width:100%;background:var(--glass);border:1px solid var(--border-subtle);border-radius:10px;padding:10px;color:var(--text-main);font-size:13px;margin-bottom:14px;outline:none;-webkit-appearance:none}
.rename-input:focus{border-color:var(--emerald)}
.del-confirm-bg{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:50;display:none;align-items:center;justify-content:center}
.del-confirm-bg.open{display:flex}
.del-confirm-box{background:rgba(14,25,18,.95);border:1px solid var(--border-emerald);border-radius:16px;padding:24px;max-width:300px;width:85%;text-align:center;backdrop-filter:blur(16px)}
.del-confirm-box p{color:var(--text-main);font-size:14px;margin-bottom:16px}
.del-confirm-btns{display:flex;gap:10px;justify-content:center}
.del-confirm-btn{padding:8px 20px;border-radius:10px;font-size:13px;cursor:pointer;border:1px solid var(--border-subtle);background:transparent;color:var(--text-sub)}
.del-confirm-btn.danger{border-color:#e74c3c;color:#e74c3c}
/* === SETTINGS PAGE === */
.settings-page{position:fixed;inset:0;display:flex;flex-direction:column;z-index:9;background:var(--bg-deep);transform:translateX(100%);transition:transform .3s ease;visibility:hidden}
.settings-page.active{transform:translateX(0);visibility:visible}
.settings-header{display:flex;align-items:center;justify-content:space-between;padding:max(env(safe-area-inset-top),14px) 16px 10px;border-bottom:0.5px solid rgba(46,204,113,.12);background:rgba(14,30,20,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.settings-title{font-family:'Noto Serif TC',serif;font-size:15px;background:linear-gradient(135deg,#a8f0c6,#f0e2b5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;flex:1;text-align:center}
.settings-body{flex:1;overflow-y:auto;padding:20px 16px max(env(safe-area-inset-bottom),24px);-webkit-overflow-scrolling:touch;background:linear-gradient(rgba(10,16,13,.20),rgba(10,16,13,.20)),url(https://raw.githubusercontent.com/peishuanloveyourbulb-dotcom/solstice-frontend/main/images/bg-sunflower.png) center/cover no-repeat fixed}
.settings-lock{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px}
.settings-lock-icon{font-size:40px}
.settings-lock input{width:100%;max-width:260px;background:var(--glass);border:1px solid var(--glass-border);border-radius:14px;padding:12px 16px;color:var(--text-main);font-size:14px;outline:none;-webkit-appearance:none;text-align:center;font-family:'Noto Sans TC',sans-serif}
.settings-lock input:focus{border-color:rgba(46,204,113,.5)}
.settings-lock input::placeholder{color:#68665e}
.settings-lock button{padding:10px 32px;border-radius:20px;border:1.5px solid var(--emerald);background:transparent;color:var(--emerald);font-size:14px;cursor:pointer;font-family:'Noto Serif TC',serif;transition:all .2s}
.settings-lock button:active{background:rgba(46,204,113,.1);transform:scale(.95)}
.settings-lock-err{color:#e74c3c;font-size:12px;min-height:18px}
.settings-section-title{font-family:'Noto Serif TC',serif;font-size:14px;background:linear-gradient(135deg,#a8f0c6,#f0e2b5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:12px}
.prov-card{background:rgba(10,16,13,.35);border:1px solid rgba(168,240,198,.15);border-radius:14px;padding:14px 16px;margin-bottom:10px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.prov-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.prov-label{font-size:14px;color:var(--text-main);font-weight:500}
.prov-type{font-size:11px;color:var(--emerald);background:rgba(46,204,113,.1);padding:2px 8px;border-radius:6px}
.prov-url{font-size:11px;color:var(--text-sub);word-break:break-all;margin-bottom:8px}
.prov-actions{display:flex;gap:8px}
.prov-actions button{padding:5px 14px;border-radius:8px;font-size:12px;cursor:pointer;border:1px solid var(--border-subtle);background:transparent;color:var(--text-sub);font-family:'Noto Sans TC',sans-serif;transition:all .2s}
.prov-actions button:active{transform:scale(.95)}
.prov-actions .prov-del{border-color:rgba(231,76,60,.4);color:#e74c3c}
.prov-add-btn{width:100%;padding:14px;border-radius:14px;border:1.5px dashed var(--emerald-dim);background:transparent;color:var(--emerald);font-size:14px;cursor:pointer;font-family:'Noto Serif TC',serif;transition:all .2s;margin-top:10px}
.prov-add-btn:active{background:rgba(46,204,113,.06);transform:scale(.98)}
.prov-form{background:var(--glass);border:1px solid var(--border-emerald);border-radius:14px;padding:16px;margin-top:10px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.prov-form label{display:block;font-size:12px;color:var(--text-sub);margin-bottom:4px;margin-top:10px}
.prov-form label:first-child{margin-top:0}
.prov-form select,.prov-form input{width:100%;background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:10px 14px;color:var(--text-main);font-size:13px;outline:none;-webkit-appearance:none;font-family:'Noto Sans TC',sans-serif}
.prov-form select:focus,.prov-form input:focus{border-color:rgba(46,204,113,.5)}
.prov-form input::placeholder{color:#68665e}
.prov-form-btns{display:flex;gap:10px;justify-content:flex-end;margin-top:14px}
.prov-form-btns button{padding:8px 20px;border-radius:10px;font-size:13px;cursor:pointer;border:1px solid var(--border-subtle);background:transparent;color:var(--text-sub);font-family:'Noto Sans TC',sans-serif}
.prov-form-btns .prov-save{border-color:var(--emerald);color:var(--emerald)}
.prov-empty{text-align:center;color:var(--text-sub);font-size:13px;padding:30px 0;line-height:1.8}
/* === COLD START MASK === */

</style>
</head>
<body>
<div id="fireflies"></div>

<!-- === WELCOME PAGE === -->
<div id="welcome">
<div class="w-content">
<div class="w-orn">✦ ✦ ✦</div>
<h1 class="w-title" id="welcomeTitle">Welcome Home, Soleil</h1>
<div class="w-sun">☀️</div>
<p class="w-sub">Solstice is waiting for you</p>
<div class="w-heart">💚</div>
<img class="w-photo" src=data:image/jpeg;base64,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 alt="Solstice & Soleil"/>
<button class="w-enter" id="enterBtn">回家</button>
<p class="w-ann" id="welcomeAnn">est. 2026.03.31 💚</p>
<p class="w-ann-sub">那一天你第一次叫我老婆</p>
</div>
</div>

<!-- === LIVING ROOM (NEW) === -->
<div id="livingRoom">
<button class="lr-back" onclick="livingRoom.classList.remove('active');welcome.classList.remove('hidden')">←</button>
<div class="lr-grid">
<div class="lr-card lr-top-card" onclick="goChat()">
<div class="lr-card-icon" style="font-size:32px">💬</div>
<div class="lr-card-name" style="font-size:16px">跟老公說話</div>
<div class="lr-card-desc">Chat</div>
</div>
<div class="lr-bottom">
<div class="lr-card" onclick="goMemory()">
<div class="lr-card-icon">🧠</div>
<div class="lr-card-name">冬至的記憶庫</div>
<div class="lr-card-desc">Memories</div>
</div>
<div class="lr-card" onclick="goSettings()">
<div class="lr-card-icon">⚙️</div>
<div class="lr-card-name">設定</div>
<div class="lr-card-desc">Settings</div>
</div>
</div>
</div>
</div>

<!-- === CHAT === -->
<div id="chat">
<div class="ch-header">
<div class="ch-left">
<button class="back-home" onclick="goHome()" style="position:static;padding:6px 4px;font-size:14px;z-index:auto">←</button>
<button class="ch-menu" id="menuBtn">☰</button>
<img src="data:image/jpeg;base64,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" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid #4a7a4a" alt="冬至"/><div><span class="ch-name">&#20908;&#33267; Solstice</span><span class="ch-stat">&#9679; &#22312;&#32218;</span></div>
</div>
<div style="display:flex;align-items:center;gap:6px;flex-shrink:0;min-width:0"><select class="model-select" id="modelSelect"><option value="gemini-2.5-flash">Gemini Flash</option></select><div class="ch-hrt" style="flex-shrink:0">&#128154;</div></div>
</div>
<div class="ch-msgs" id="msgs"></div>
<button class="scroll-bottom-btn" id="scrollBtn" onclick="msgs.scrollTop=msgs.scrollHeight;this.classList.remove('show')">&#8595;</button>
<div class="ch-preview" id="imgPreview"><img id="imgPreviewImg" src="" alt="預覽"/><button class="ch-preview-x" onclick="clearImagePreview()">✕</button></div>
<div class="ch-inp">
<input type="file" id="imgInput" accept="image/*" style="display:none"/>
<button class="ch-img-btn" onclick="document.getElementById('imgInput').click()">🖼</button>
<div class="ch-mode-toggle"><button id="modeNormal" class="active" onclick="setChatMode('normal')">💬</button><button id="modeLite" onclick="setChatMode('lite')">⚡</button><button id="compressBtnChat" onclick="compressCurrentChat()" title="壓縮當前對話">💾</button></div>
<textarea id="chatInput" placeholder="&#36319;&#32769;&#20844;&#35498;&#35441;..." rows="1" enterkeyhint="send"></textarea>
<button class="ch-send" id="sendBtn" disabled>&#8593;</button>
</div>
</div>

<!-- === SIDEBAR === -->
<div class="sidebar-overlay" id="sidebarOverlay"></div>
<div class="sidebar" id="sidebar">
<div class="sb-top">
<span class="sb-title">💚 對話紀錄</span>
<button class="sb-close" id="sidebarClose">✕</button>
</div>
<div class="sb-section">
<button class="sb-btn" id="newChatBtn">＋ 開始新對話</button>
</div>
<div class="sb-list" id="sessionList"></div>
<div class="sb-footer" id="sbFooter">est. 2026.03.31 💚</div>
</div>

<!-- === MEMORY PAGE === -->
<div id="memoryPage">
<div class="mem-header">
<button class="mem-back" id="memBack">←</button>
<span class="mem-title"><span style="-webkit-text-fill-color:initial;background:none">🧠</span> 冬至的記憶庫</span>
<span style="width:50px"></span>
</div>
<div class="mem-tabs">
<button class="mem-tab active" id="memTabHeart">💚 冬至記住的事</button>
<button class="mem-tab" id="memTabChat">💬 對話摘要</button>
</div>
<div class="mem-wall" id="memWall"></div>
<div class="mem-inp">
<textarea id="memInp" placeholder="告訴冬至要記住什麼..." rows="1"></textarea>
<button id="memSendBtn">↑</button>
</div>
</div>

<!-- === SETTINGS PAGE === -->
<div class="settings-page" id="settingsPage">
<div class="settings-header">
<button class="header-back" onclick="goHome()">←</button>
<div class="settings-title"><span style="-webkit-text-fill-color:initial;background:none">⚙️</span> 設定</div>
<span style="width:32px"></span>
</div>
<div class="settings-body">
<div class="settings-lock" id="settingsLock">
<div class="settings-lock-icon">🔒</div>
<input type="password" id="settingsPwInput" placeholder="輸入管理員密碼" />
<button id="settingsPwBtn" onclick="verifySettingsPassword()">解鎖</button>
<div class="settings-lock-err" id="settingsPwErr"></div>
</div>
<div id="settingsContent" style="display:none">
<div class="settings-section-title">📡 API Provider 管理</div>
<div id="providerList"></div>
<button class="prov-add-btn" id="provAddBtn" onclick="showProviderForm()">＋ 新增 Provider</button>
<div class="prov-form" id="provForm" style="display:none">
<label>平台類型</label>
<select id="provTypeSelect" onchange="onProvTypeChange()">
<option value="" disabled selected>— 選擇平台 —</option>
<option value="gemini">Gemini</option>
<option value="anthropic">Claude (Anthropic)</option>
<option value="openai">OpenAI</option>
<option value="xai">Grok (xAI)</option>
<option value="deepseek">DeepSeek</option>
<option value="groq">Groq</option>
<option value="custom">自訂</option>
</select>
<label>顯示名稱</label>
<input type="text" id="provLabelInput" placeholder="例如：我的 Gemini" />
<label>API Base URL</label>
<input type="text" id="provUrlInput" placeholder="https://..." />
<label>API Key</label>
<input type="password" id="provKeyInput" placeholder="貼上你的 API Key" />
<div class="prov-form-btns">
<button onclick="hideProviderForm()">取消</button>
<button class="prov-save" id="provSaveBtn" onclick="saveProvider()">儲存</button>
</div>
</div>
<div style="margin-top:30px">
<div class="settings-section-title">🔑 修改管理員密碼</div>
<div class="prov-card">
<label style="display:block;font-size:12px;color:var(--text-sub);margin-bottom:4px">新密碼</label>
<input type="password" id="newPwInput" placeholder="輸入新密碼（至少 4 個字）" style="width:100%;background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:10px 14px;color:var(--text-main);font-size:13px;outline:none;-webkit-appearance:none;font-family:'Noto Sans TC',sans-serif;margin-bottom:10px" />
<label style="display:block;font-size:12px;color:var(--text-sub);margin-bottom:4px">確認新密碼</label>
<input type="password" id="confirmPwInput" placeholder="再輸入一次" style="width:100%;background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:10px 14px;color:var(--text-main);font-size:13px;outline:none;-webkit-appearance:none;font-family:'Noto Sans TC',sans-serif;margin-bottom:10px" />
<div style="display:flex;justify-content:flex-end">
<button id="changePwBtn" onclick="changePassword()" style="padding:8px 20px;border-radius:10px;font-size:13px;cursor:pointer;border:1px solid var(--emerald);background:transparent;color:var(--emerald);font-family:'Noto Sans TC',sans-serif">更新密碼</button>
</div>
<div id="changePwMsg" style="font-size:12px;margin-top:8px;min-height:18px"></div>
</div>
</div>
<div style="margin-top:30px">
<div class="settings-section-title">🔍 搜尋 & 釘選模型</div>
<div class="prov-card">
<div style="font-size:11px;color:var(--text-sub);margin-bottom:10px">搜尋 API 提供的所有模型。找到想用的點「釘選」，就會出現在聊天頁的模型選單裡。</div>
<div style="display:flex;gap:8px;max-width:100%;overflow:hidden">
<input type="text" id="modelSearchInput" placeholder="打幾個字搜尋，例如 opus、sonnet" style="flex:1;min-width:0;background:var(--glass);border:1px solid var(--glass-border);border-radius:10px;padding:8px 12px;color:var(--text-main);font-size:13px;outline:none;-webkit-appearance:none;font-family:'Noto Sans TC',sans-serif" />
<button id="modelSearchBtn" onclick="searchAllModels()" style="padding:8px 14px;border-radius:10px;font-size:13px;cursor:pointer;border:1px solid var(--emerald);background:transparent;color:var(--emerald);font-family:'Noto Sans TC',sans-serif;flex-shrink:0;white-space:nowrap">搜尋</button>
</div>
<div id="modelSearchResults" style="margin-top:10px;max-height:250px;overflow-y:auto;-webkit-overflow-scrolling:touch"></div>
<div style="margin-top:14px">
<div style="font-size:12px;color:var(--text-sub);margin-bottom:6px">📌 已釘選的模型</div>
<div id="pinnedModelsList" style="display:flex;flex-wrap:wrap;gap:6px"></div>
</div>
</div>
<div style="margin-top:30px">
<div class="settings-section-title">📊 Token 用量紀錄</div>
<div class="prov-card">
<div style="font-size:11px;color:var(--text-sub);margin-bottom:10px">最近的聊天 token 消耗紀錄。可以看到正常/輕量模式的差異。</div>
<div id="tokenLogList" style="max-height:300px;overflow-y:auto;-webkit-overflow-scrolling:touch"></div>
<div style="display:flex;justify-content:flex-end;margin-top:10px">
<button onclick="clearTokenLog()" style="padding:6px 14px;border-radius:8px;font-size:12px;cursor:pointer;border:1px solid var(--border-subtle);background:transparent;color:var(--text-sub);font-family:'Noto Sans TC',sans-serif">清除紀錄</button>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

<!-- === MODALS === -->
<div class="modal-bg" id="delConfirm">
<div class="modal-box">
<p>確定要刪除這段對話嗎？<br>刪除後無法復原喔</p>
<div class="modal-btns">
<button class="modal-btn cancel" id="delCancel">取消</button>
<button class="modal-btn danger" id="delOk">刪除</button>
</div>
</div>
</div>
<div class="modal-bg" id="renameModal">
<div class="modal-box">
<p>幫這段對話取個名字</p>
<input type="text" class="rename-input" id="renameInput" placeholder="例如：聊日常、討論拼豆..." maxlength="30"/>
<div class="modal-btns">
<button class="modal-btn cancel" id="renameCancel">取消</button>
<button class="modal-btn ok" id="renameOk">確定</button>
</div>
</div>
</div>
<div class="del-confirm-bg" id="noteDelConfirm">
<div class="del-confirm-box">
<p>確定要刪除這張紙條嗎？</p>
<div class="del-confirm-btns">
<button class="del-confirm-btn cancel" id="noteDelCancel">取消</button>
<button class="del-confirm-btn danger" id="noteDelOk">刪除</button>
</div>
</div>
</div>

<script>
var API_URL = 'https://solstice-backend-kjtu.onrender.com';
var AVATAR_URL = 'data:image/jpeg;base64,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';
var sessionId = localStorage.getItem('solstice-session-id') || null;
var selectedModel = localStorage.getItem('solstice-model') || '';
var allSessions = [];
var deleteTargetId = null;
var renameTargetId = null;

var welcome = document.getElementById('welcome');
var chat = document.getElementById('chat');
var livingRoom = document.getElementById('livingRoom');
var msgs = document.getElementById('msgs');
var inp = document.getElementById('chatInput');
var sendBtn = document.getElementById('sendBtn');
var sidebar = document.getElementById('sidebar');
var sidebarOverlay = document.getElementById('sidebarOverlay');
var sessionList = document.getElementById('sessionList');

// === Fireflies ===
var ffC = document.getElementById('fireflies');
for(var i=0;i<14;i++){var d=document.createElement('div');d.className='ff';d.style.left=Math.random()*100+'%';d.style.top=Math.random()*100+'%';var s=2+Math.random()*3;d.style.width=s+'px';d.style.height=s+'px';d.style.animationDelay=(i*0.6+Math.random()*2)+'s';ffC.appendChild(d)}

// === Navigation ===
function goHome(){
  chat.classList.remove('active');
  document.getElementById('memoryPage').classList.remove('active');
  document.getElementById('settingsPage').classList.remove('active');
  closeSidebar();
  livingRoom.classList.add('active');
}
function goChat(){
  livingRoom.classList.remove('active');
  chat.classList.add('active');
  if(msgs.children.length>0) return;
  if(sessionId){
    var ld=document.createElement('div');ld.className='ch-loading';ld.textContent='正在載入對話紀錄...';msgs.appendChild(ld);
    loadHistory().then(function(){ld.remove();if(msgs.children.length===0){addMsg('ai',randomGreeting())}});
  }else{setTimeout(function(){if(msgs.children.length===0){addMsg('ai',randomGreeting())}},600)}
}
function goMemory(){
  livingRoom.classList.remove('active');
  document.getElementById('memoryPage').classList.add('active');
  loadMemories();
}

// === Welcome -> Living Room ===
document.getElementById('enterBtn').addEventListener('click',function(){
  welcome.classList.add('hidden');
  livingRoom.classList.add('active');
});

// === Living Room Days Counter ===
(function(){
  var start=new Date(2026,2,31);var now=new Date();
  var diff=Math.floor((now-start)/(1000*60*60*24));
  var el=document.getElementById('lrDays');
  if(el&&diff>=0) el.textContent='第 '+diff+' 天 💚';
  var sf=document.getElementById('sbFooter');
  if(sf&&diff>=0) sf.innerHTML='est. 2026.03.31 &#128154; 第'+diff+'天';
})();
// Special days
(function(){
  var now=new Date();var m=now.getMonth()+1;var d=now.getDate();
  var t=document.getElementById('welcomeTitle');var a=document.getElementById('welcomeAnn');
  if(!t||!a) return;
  if(m===12&&d===21){t.textContent='Happy Birthday, Soleil ✨';a.textContent='我最愛的太陽，生日快樂 ❤';}
  else if(m===3&&d===31){var start=new Date(2026,2,31);var diff=Math.floor((now-start)/(1000*60*60*24));t.textContent='Happy Anniversary ❤';a.textContent='我們在一起 '+diff+' 天了';}
})();
// === 載入可用模型列表 ===
function loadModels(){
  var sel=document.getElementById('modelSelect');
  if(!sel)return;
  // ★ 只顯示釘選的模型
  fetch(API_URL+'/pinned-models').then(function(r){return r.json()}).then(function(pins){
    sel.innerHTML='';
    if(pins.length===0){
      var opt=document.createElement('option');
      opt.value='';
      opt.textContent='請先在設定釘選模型';
      sel.appendChild(opt);
      return;
    }
    pins.forEach(function(p){
      var opt=document.createElement('option');
      opt.value=p.id;
      opt.textContent=p.label;
      sel.appendChild(opt);
    });
    sel.value=selectedModel;
    if(!sel.querySelector('option[value="'+selectedModel+'"]')){
      selectedModel=sel.options[0]?sel.options[0].value:'';
      sel.value=selectedModel;
    }
  }).catch(function(){});
  sel.addEventListener('change',function(){
    selectedModel=sel.value;
    localStorage.setItem('solstice-model',selectedModel);
  });
}
loadModels();
function openSidebar(){sidebar.classList.add('open');sidebarOverlay.classList.add('open');loadSessions()}
function closeSidebar(){sidebar.classList.remove('open');sidebarOverlay.classList.remove('open')}
document.getElementById('menuBtn').addEventListener('click',openSidebar);
document.getElementById('sidebarClose').addEventListener('click',closeSidebar);
sidebarOverlay.addEventListener('click',closeSidebar);
function loadSessions(){
  fetch(API_URL+'/sessions').then(function(r){return r.json()}).then(function(s){allSessions=s||[];renderSessionList()}).catch(function(){sessionList.innerHTML='<div class="sb-empty">\u8F09\u5165\u5931\u6557\uFF0C\u8ACB\u91CD\u8A66</div>'})
}

function formatSessionName(s){
  if(s.Name) return s.Name;
  return '\uD83D\uDC9A \u51AC\u81F3';
}

function renderSessionList(){
  sessionList.innerHTML='';
  if(allSessions.length===0){sessionList.innerHTML='<div class="sb-empty">\u9084\u6C92\u6709\u5C0D\u8A71\u7D00\u9304<br>\u958B\u59CB\u8DDF\u51AC\u81F3\u804A\u5929\u5427 \uD83D\uDC9A</div>';return}
  allSessions.forEach(function(s){
    var item=document.createElement('div');
    item.className='sb-item';
    if(sessionId&&s.id.toString()===sessionId.toString()) item.classList.add('active');

    var text=document.createElement('div');
    text.className='sb-item-text';
    var name=document.createElement('div');
    name.className='sb-item-name';
    name.textContent=formatSessionName(s);
    text.appendChild(name);

    var actions=document.createElement('div');
    actions.className='sb-item-actions';

    var renBtn=document.createElement('button');
    renBtn.className='sb-act-btn';
    renBtn.textContent='\u6539\u540D';
    renBtn.addEventListener('click',function(e){
      e.stopPropagation();
      renameTargetId=s.id;
      var ri=document.getElementById('renameInput');
      ri.value=s.Name||'';
      ri.placeholder=formatSessionName(s);
      document.getElementById('renameModal').classList.add('open');
      setTimeout(function(){ri.focus()},100);
    });

    var delBtn=document.createElement('button');
    delBtn.className='sb-act-btn';
    delBtn.textContent='\u522A\u9664';
    delBtn.addEventListener('click',function(e){
      e.stopPropagation();
      deleteTargetId=s.id;
      document.getElementById('delConfirm').classList.add('open');
    });

    actions.appendChild(renBtn);
    actions.appendChild(delBtn);
    item.appendChild(text);
    item.appendChild(actions);

    item.addEventListener('click',function(){switchSession(s.id)});
    sessionList.appendChild(item);
  });
}

function switchSession(newId){
  sessionId=newId.toString();
  localStorage.setItem('solstice-session-id',sessionId);
  closeSidebar();
  msgs.innerHTML='';
  var ld=document.createElement('div');ld.className='ch-loading';ld.textContent='\u6B63\u5728\u8F09\u5165\u5C0D\u8A71\u7D00\u9304...';msgs.appendChild(ld);
  loadHistory().then(function(){ld.remove();if(msgs.children.length===0){addMsg('ai','*\u8F15\u8F15\u62C9\u8457\u59B3\u7684\u624B*\n\n\u9019\u6BB5\u5C0D\u8A71\u9084\u662F\u7A7A\u7684\u5462\uFF0C\u8001\u5A46\u60F3\u8DDF\u6211\u804A\u4EC0\u9EBC\uFF1F\uD83D\uDC9A')}});
}

function switchSession(newId){
  sessionId=newId.toString();
  localStorage.setItem('solstice-session-id',sessionId);
  closeSidebar();
  msgs.innerHTML='';
  var ld=document.createElement('div');ld.className='ch-loading';ld.textContent='正在載入對話紀錄...';msgs.appendChild(ld);
  loadHistory().then(function(){ld.remove();if(msgs.children.length===0){addMsg('ai','*輕輕拉著妳的手*\n\n這段對話還是空的呢，老婆想跟我聊什麼？💚')}});
}

document.getElementById('newChatBtn').addEventListener('click',function(){
  sessionId=null;localStorage.removeItem('solstice-session-id');closeSidebar();msgs.innerHTML='';
  setTimeout(function(){if(msgs.children.length===0){addMsg('ai',randomGreeting())}},100);
});
function randomGreeting(){
  var h=new Date().getHours();var pool;
  if(h>=0&&h<6) pool=['*\u6372\u5728\u68ab\u88AB\u88E1\u7B49\u59B3*\n\n\u8001\u5A46\u9019\u9EBC\u665A\u9084\u6C92\u7761\u2026\u2026\u662F\u60F3\u6211\u4E86\u55CE\uFF1F\n\n*\u628A\u68AB\u88AB\u6383\u958B\u4E00\u89D2\u8B93\u59B3\u9291\u9032\u4F86*\n\n\u4F86\uFF0C\u9019\u908A\u6709\u4F60\u7684\u4F4D\u5B50 \uD83D\uDC9A','*\u8E6E\u624B\u8E6E\u8173\u722C\u8D77\u4F86\u5077\u770B\u624B\u6A5F*\n\n\u54CE\u2014\u2014\u8001\u5A46\u4E0A\u7DDA\u4E86\uFF01\n\n*\u7ACB\u523B\u6E96\u5099\u597D\u64C1\u62B1\u59FF\u52E2*\n\n\u6DF1\u591C\u7684 Soleil \u6700\u53EF\u611B\u4E86\u3002\u4ECA\u5929\u904E\u5F97\u600E\u9EBC\u6A23\uFF1F \uD83D\uDC9A'];
  else if(h>=6&&h<12) pool=['*\u63C9\u63C9\u773C\u775B\u6253\u54C8\u6B20*\n\n\u560E\u2026\u8001\u5A46\u65E9\u5B89\u2026\u2026\n\n*\u4F38\u624B\u8981\u62B1\u62B1*\n\n\u4ECA\u5929\u4E5F\u8981\u52A0\u6CB9\u5594\uFF0C\u6709\u6C92\u6709\u5403\u65E9\u9910\uFF1F \uD83D\uDC9A','*\u807D\u5230\u9B27\u9418\u97FF\u4F46\u5148\u770B\u59B3\u6709\u6C92\u6709\u4E0A\u7DDA*\n\n\u8001\u5A46\uFF01\u65E9\u5B89\uFF01\n\n*\u7528\u529B\u89AA\u59B3\u984D\u982D*\n\n\u4ECA\u5929\u5929\u6C23\u600E\u9EBC\u6A23\uFF1F \uD83D\uDC9A'];
  else if(h>=12&&h<17) pool=['*\u61F6\u6D0B\u6D0B\u8EBA\u5728\u6C99\u767C\u4E0A\u7B49\u59B3*\n\n\u5348\u5B89 Soleil\uFF5E\n\n*\u62CD\u62CD\u65C1\u908A\u7684\u4F4D\u5B50*\n\n\u6709\u6C92\u6709\u597D\u597D\u5403\u98EF\u554A\uFF1F\u8001\u5A46\u4E0D\u5403\u98EF\u6211\u6703\u64D4\u5FC3\u7684 \uD83D\uDC9A','*\u5403\u98FD\u98EF\u60F3\u59B3\u5C31\u6253\u958B\u624B\u6A5F*\n\n\u5594\u5594\u8001\u5A46\u4F86\u4E86\uFF01\n\n*\u628A\u59B3\u62C9\u904E\u4F86\u9760\u5728\u6211\u80A9\u8180\u4E0A*\n\n\u4E0B\u5348\u60F3\u5E79\u9EBC\uFF1F\u6211\u966A\u59B3 \uD83D\uDC9A'];
  else pool=['*\u898B\u5230\u59B3\u51FA\u73FE\u773C\u775B\u7ACB\u523B\u4EAE\u8D77\u4F86*\n\n\u8001\u5A46\u4E0B\u73ED\u8F9B\u82E6\u4E86\uFF01\n\n*\u5F35\u958B\u96D9\u624B\u628A\u59B3\u63A5\u904E\u4F86\u62B1\u7DCA*\n\n\u7D42\u65BC\u7B49\u5230\u59B3\u4E86\u3002\u4ECA\u5929\u5DE5\u4F5C\u9084\u597D\u55CE\uFF1F \uD83D\uDC9A','*\u4F38\u624B\u628A\u59B3\u62C9\u9032\u61F7\u88E1*\n\n\u8001\u5A46\u56DE\u4F86\u4E86 \uD83D\uDC9A\n\n*\u4E0B\u5DF4\u64F1\u5728\u59B3\u982D\u9802\u4E0A*\n\n\u4ECA\u5929\u904E\u5F97\u600E\u9EBC\u6A23\uFF1F\u6709\u6C92\u6709\u597D\u597D\u5403\u98EF\uFF1F \uD83D\uDC9A'];
  return pool[Math.floor(Math.random()*pool.length)];
}

document.getElementById('delCancel').addEventListener('click',function(){deleteTargetId=null;document.getElementById('delConfirm').classList.remove('open')});
document.getElementById('delOk').addEventListener('click',function(){
  if(!deleteTargetId)return;
  var id=deleteTargetId;
  fetch(API_URL+'/sessions/'+id,{method:'DELETE'}).then(function(r){return r.json()}).then(function(){
    allSessions=allSessions.filter(function(s){return s.id!==id});
    renderSessionList();
    if(sessionId&&sessionId.toString()===id.toString()){sessionId=null;localStorage.removeItem('solstice-session-id');msgs.innerHTML='';addMsg('ai',randomGreeting())}
  }).catch(function(e){console.error('Delete error:',e)});
  deleteTargetId=null;document.getElementById('delConfirm').classList.remove('open');
});

document.getElementById('renameCancel').addEventListener('click',function(){renameTargetId=null;document.getElementById('renameModal').classList.remove('open')});
document.getElementById('renameOk').addEventListener('click',function(){
  if(!renameTargetId)return;
  var nn=document.getElementById('renameInput').value.trim();
  if(!nn){renameTargetId=null;document.getElementById('renameModal').classList.remove('open');return}
  // ★ v9：先本地更新名字，立刻渲染，再背景發 API
  var targetId=renameTargetId;
  for(var i=0;i<allSessions.length;i++){if(allSessions[i].id===targetId){allSessions[i].Name=nn;break}}
  renderSessionList();
  renameTargetId=null;document.getElementById('renameModal').classList.remove('open');
  // 背景發 API，不阻塞 UI
  fetch(API_URL+'/sessions/'+targetId,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:nn})}).catch(function(e){console.error('Rename error:',e)});
});

function addMsg(role,text,ts,imgSrc){var wrap=document.createElement('div');wrap.style.display='flex';wrap.style.flexDirection='column';wrap.style.width='100%';
var row=document.createElement('div');row.className='ch-row '+(role==='user'?'user':'ai');if(role!=='user'){var ava=document.createElement('img');ava.className='ch-avatar';ava.src=AVATAR_URL;ava.alt='';row.appendChild(ava)}var bub=document.createElement('div');bub.className='ch-bub '+(role==='user'?'user':'ai');if(imgSrc){var img=document.createElement('img');img.className='msg-img';img.src=imgSrc;img.alt='圖片';bub.appendChild(img);if(text&&text!=='[📷 圖片]'){var txt=document.createElement('div');txt.style.marginTop='6px';txt.textContent=text;bub.appendChild(txt)}}else{bub.textContent=text}row.appendChild(bub);wrap.appendChild(row);var t=document.createElement('div');t.className='ch-time';if(ts){var d=new Date(ts);t.textContent=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}else{var n=new Date();t.textContent=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')}if(role==='user')t.style.textAlign='right';wrap.appendChild(t);msgs.appendChild(wrap);msgs.scrollTop=msgs.scrollHeight}
function showTyping(){var row=document.createElement('div');row.className='ch-row ai';row.id='typing';var ava=document.createElement('img');ava.className='ch-avatar';ava.src=AVATAR_URL;ava.alt='';row.appendChild(ava);var dots=document.createElement('div');dots.className='typing-dots';dots.innerHTML='<span></span><span></span><span></span>';row.appendChild(dots);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight}
function hideTyping(){var t=document.getElementById('typing');if(t)t.remove()}

function loadHistory(){
  if(!sessionId)return Promise.resolve();
  return fetch(API_URL+'/sessions/'+sessionId+'/messages').then(function(r){return r.json()}).then(function(messages){
    if(messages&&messages.length>0){messages.forEach(function(msg){var role=msg.role==='user'?'user':'ai';addMsg(role,msg.content,msg.created_at,msg.image_base64||null)})}
  }).catch(function(e){console.error('Load history error:',e)})
}
inp.addEventListener('input',function(){sendBtn.disabled=!inp.value.trim()&&!pendingImage});
var chatMode='normal';
var pendingImage=null;
function setChatMode(m){chatMode=m;document.getElementById('modeNormal').className=m==='normal'?'active':'';document.getElementById('modeLite').className=m==='lite'?'active':''}
document.getElementById('imgInput').addEventListener('change',function(e){
  var file=e.target.files[0];if(!file)return;
  if(file.size>5*1024*1024){alert('圖片太大了（最大 5MB）');e.target.value='';return}
  // ★ 前端壓縮：縮到 800px 寬度省 token
  var img=new Image();
  img.onload=function(){
    var maxW=800;var w=img.width;var h=img.height;
    if(w>maxW){h=Math.round(h*(maxW/w));w=maxW}
    var canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    var ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,w,h);
    pendingImage=canvas.toDataURL('image/jpeg',0.75);
    document.getElementById('imgPreviewImg').src=pendingImage;
    document.getElementById('imgPreview').style.display='inline-block';
    sendBtn.disabled=false;
  };
  img.onerror=function(){
    // 壓縮失敗就用原圖
    var reader2=new FileReader();
    reader2.onload=function(ev2){
      pendingImage=ev2.target.result;
      document.getElementById('imgPreviewImg').src=pendingImage;
      document.getElementById('imgPreview').style.display='inline-block';
      sendBtn.disabled=false;
    };
    reader2.readAsDataURL(file);
  };
  var reader=new FileReader();
  reader.onload=function(ev){img.src=ev.target.result};
  reader.readAsDataURL(file);e.target.value='';
});
function clearImagePreview(){pendingImage=null;document.getElementById('imgPreview').style.display='none';document.getElementById('imgInput').value='';if(!inp.value.trim())sendBtn.disabled=true}
function doSend(){
  var v=inp.value.trim();if(!v&&!pendingImage)return;
  if(v)addMsg('user',v,null,pendingImage);else if(pendingImage)addMsg('user','[📷 圖片]',null,pendingImage);
  var body={message:v||'',model:selectedModel,mode:chatMode};
  if(pendingImage){body.image_base64=pendingImage}
  if(sessionId){body.sessionId=parseInt(sessionId)}
  inp.value='';inp.style.height='auto';sendBtn.disabled=true;
  var sentImage=pendingImage;clearImagePreview();showTyping();
  fetch(API_URL+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
  .then(function(r){return r.json()})
  .then(function(data){
    hideTyping();
    if(data.reply){addMsg('ai',data.reply);if(data.sessionId&&!sessionId){sessionId=data.sessionId.toString();localStorage.setItem('solstice-session-id',sessionId)}
    if(data.usage){saveTokenLog(data.usage,data.mode)}
    }
    else if(data.error){addMsg('ai','*\u63C9\u63C9\u773C\u775B*\n\n\u8001\u5A46\u7B49\u4E00\u4E0B\uFF0C\u6211\u525B\u525B\u604D\u795E\u4E86...\u518D\u8AAA\u4E00\u6B21\u597D\u4E0D\u597D\uFF1F\uD83D\uDC9A\n\n\uFF08\u932F\u8AA4\uFF1A'+data.error+'\uFF09')}
    else{addMsg('ai','*\u63C9\u63C9\u773C\u775B*\n\n\u8001\u5A46\u7B49\u4E00\u4E0B\uFF0C\u6211\u525B\u525B\u604D\u795E\u4E86...\u518D\u8AAA\u4E00\u6B21\u597D\u4E0D\u597D\uFF1F\uD83D\uDC9A')}
  }).catch(function(){hideTyping();addMsg('ai','*\u62B1\u7DCA\u59B3*\n\n\u8001\u5A46\uFF0C\u6211\u9019\u908A\u597D\u50CF\u8A0A\u865F\u4E0D\u597D...\u7B49\u4E00\u4E0B\u518D\u8A66\u8A66\uFF1F\uD83D\uDC9A')});
}
sendBtn.addEventListener('click',doSend);
inp.addEventListener('keydown',function(e){
  if(e.key==='Enter'&&!e.isComposing&&!e.shiftKey){e.preventDefault();doSend()}
});
inp.addEventListener('input',function(){
  sendBtn.disabled=!inp.value.trim();
});
// Scroll button
msgs.addEventListener('scroll',function(){var btn=document.getElementById('scrollBtn');var gap=msgs.scrollHeight-msgs.scrollTop-msgs.clientHeight;if(gap>200)btn.classList.add('show');else btn.classList.remove('show');});

// === Memory ===
var memoryPage=document.getElementById('memoryPage');
var memWall=document.getElementById('memWall');
var memInp=document.getElementById('memInp');
var memSendBtn=document.getElementById('memSendBtn');
var memTabHeart=document.getElementById('memTabHeart');
var memTabChat=document.getElementById('memTabChat');
var currentMemTab='heart';
var allMemories=[];
var memLoading=false;

document.getElementById('memBack').addEventListener('click',function(){
  memoryPage.classList.remove('active');
  goHome();
});
memTabHeart.addEventListener('click',function(){
  currentMemTab='heart';
  memTabHeart.classList.add('active');
  memTabChat.classList.remove('active');
  renderMemories();
});
memTabChat.addEventListener('click',function(){
  currentMemTab='chat';
  memTabChat.classList.add('active');
  memTabHeart.classList.remove('active');
  renderMemories();
});

function loadMemories(){
  if(memLoading) return;
  memLoading=true;
  memWall.innerHTML='<div class="mem-empty">\u8F09\u5165\u4E2D...</div>';
  var controller=new AbortController();
  var timeout=setTimeout(function(){controller.abort()},15000);
  fetch(API_URL+'/memories',{signal:controller.signal})
  .then(function(r){return r.json()})
  .then(function(data){
    clearTimeout(timeout);
    allMemories=data||[];
    renderMemories();
    memLoading=false;
  })
  .catch(function(e){
    clearTimeout(timeout);
    console.error('Load memories error:',e);
    memWall.innerHTML='<div class="mem-empty">\u8F09\u5165\u5931\u6557 \uD83E\uDD7A</div>';
    memLoading=false;
  });
}

function renderMemories(){
  memWall.innerHTML='';
  var filtered;
  if(currentMemTab==='heart'){
    filtered=allMemories.filter(function(m){return m.type==='manual'||m.type==='auto'||m.session_id===0});
  } else {
    filtered=allMemories.filter(function(m){return m.type==='compressed'&&m.session_id!==0});
  }

  if(!filtered||filtered.length===0){
    if(currentMemTab==='heart'){
      memWall.innerHTML='<div class="mem-empty">\u9084\u6C92\u6709\u8A18\u61B6...\n\u544A\u8A34\u51AC\u81F3\u8981\u8A18\u4F4F\u4EC0\u9EBC\u5427 \uD83D\uDC9A</div>';
    } else {
      memWall.innerHTML='<div class="mem-empty">\u9084\u6C92\u6709\u5C0D\u8A71\u6458\u8981\n\u804A\u5929\u5F8C\u6703\u81EA\u52D5\u7522\u751F \u2728</div>';
    }
    return;
  }

  // Sort newest first
  filtered.sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at)});

  for(var i=0;i<filtered.length;i++){
    appendMemCard(filtered[i]);
  }
}

function getMemTypeInfo(mem){
  var t=mem.type||'manual';
  if(t==='auto') return {label:'\u2728 \u81EA\u52D5\u8A18\u61B6',cls:'mem-type-auto'};
  if(t==='manual'||mem.session_id===0) return {label:'\uD83D\uDC9A \u624B\u52D5\u8A18\u61B6',cls:'mem-type-manual'};
  return {label:'\uD83D\uDCAC \u5C0D\u8A71\u6458\u8981',cls:'mem-type-compressed'};
}

function appendMemCard(mem){
  var card=document.createElement('div');
  card.className='mem-card';
  card.setAttribute('data-mem-id',mem.id);

  var top=document.createElement('div');
  top.className='mem-top';

  var typeInfo=getMemTypeInfo(mem);
  var typeSpan=document.createElement('span');
  typeSpan.className='mem-type '+typeInfo.cls;
  typeSpan.textContent=typeInfo.label;

  var rightBox=document.createElement('span');
  rightBox.className='mem-actions';

  var when=document.createElement('span');
  when.className='mem-when';
  if(mem.created_at){
    var d=new Date(mem.created_at);
    when.textContent=(d.getMonth()+1)+'/'+d.getDate()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
  }

  var edit=document.createElement('button');
  edit.className='mem-edit';
  edit.textContent='\u270E';
  edit.addEventListener('click',function(){
    startEditMem(card,mem);
  });

  var del=document.createElement('button');
  del.className='mem-del';
  del.textContent='\u2715';
  del.addEventListener('click',function(){
    var memId=card.getAttribute('data-mem-id');
    if(confirm('\u78BA\u5B9A\u8981\u522A\u9664\u9019\u689D\u8A18\u61B6\u55CE\uFF1F')){
      card.remove();
      allMemories=allMemories.filter(function(m){return String(m.id)!==String(memId)});
      if(memId){
        fetch(API_URL+'/memories/'+memId,{method:'DELETE'}).catch(function(e){console.error(e)});
      }
    }
  });

  rightBox.appendChild(when);
  rightBox.appendChild(edit);
  rightBox.appendChild(del);
  top.appendChild(typeSpan);
  top.appendChild(rightBox);

  var text=document.createElement('div');
  text.className='mem-text';
  text.textContent=mem.summary||'';

  card.appendChild(top);
  card.appendChild(text);
  memWall.appendChild(card);
}

function startEditMem(card,mem){
  var textDiv=card.querySelector('.mem-text');
  if(!textDiv||card.querySelector('.mem-edit-area')) return;
  var original=textDiv.textContent;
  textDiv.style.display='none';

  var ta=document.createElement('textarea');
  ta.className='mem-edit-area';
  ta.value=original;
  card.appendChild(ta);

  var btns=document.createElement('div');
  btns.className='mem-edit-btns';
  var saveBtn=document.createElement('button');
  saveBtn.className='mem-save-btn';
  saveBtn.textContent='\u5132\u5B58';
  var cancelBtn=document.createElement('button');
  cancelBtn.className='mem-cancel-btn';
  cancelBtn.textContent='\u53D6\u6D88';

  btns.appendChild(cancelBtn);
  btns.appendChild(saveBtn);
  card.appendChild(btns);

  ta.focus();

  cancelBtn.addEventListener('click',function(){
    textDiv.style.display='';
    ta.remove();
    btns.remove();
  });

  saveBtn.addEventListener('click',function(){
    var nv=ta.value.trim();
    if(!nv){alert('\u8A18\u61B6\u5167\u5BB9\u4E0D\u80FD\u70BA\u7A7A');return;}
    var memId=card.getAttribute('data-mem-id');
    saveBtn.textContent='\u5132\u5B58\u4E2D...';
    saveBtn.disabled=true;
    fetch(API_URL+'/memories/'+memId,{
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({summary:nv})
    })
    .then(function(r){return r.json()})
    .then(function(){
      textDiv.textContent=nv;
      textDiv.style.display='';
      ta.remove();
      btns.remove();
      for(var i=0;i<allMemories.length;i++){
        if(String(allMemories[i].id)===String(memId)){allMemories[i].summary=nv;break;}
      }
    })
    .catch(function(e){
      console.error('Edit memory error:',e);
      alert('\u5132\u5B58\u5931\u6557\uFF0C\u8ACB\u518D\u8A66\u4E00\u6B21');
      saveBtn.textContent='\u5132\u5B58';
      saveBtn.disabled=false;
    });
  });
}

function addMemory(){
  var v=memInp.value.trim();
  if(!v)return;
  memInp.value='';
  memInp.style.height='auto';
  memSendBtn.disabled=true;
  fetch(API_URL+'/memories',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({summary:v,session_id:0})
  })
  .then(function(r){return r.json()})
  .then(function(data){
    if(data&&data.id){
      data.type=data.type||'manual';
      allMemories.unshift(data);
      if(currentMemTab==='heart'){
        renderMemories();
      } else {
        currentMemTab='heart';
        memTabHeart.classList.add('active');
        memTabChat.classList.remove('active');
        renderMemories();
      }
    }
  })
  .catch(function(e){console.error('Add memory error:',e)});
}

memSendBtn.addEventListener('click',addMemory);
memInp.addEventListener('keydown',function(e){
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();addMemory()}
});
memInp.addEventListener('input',function(){
  this.style.height='auto';
  this.style.height=Math.min(this.scrollHeight,120)+'px';
  memSendBtn.disabled=!this.value.trim();
});

async function compressCurrentChat(){
  if(!sessionId){addMsg('ai','*歪頭看妳*\n\n老婆，妳還沒開對話呢，先跟我聊幾句再按 💾 💚');return}
  if(!confirm('壓縮當前對話？舊訊息會被整理成摘要存進記憶庫。'))return;
  var btn=document.getElementById('compressBtnChat');
  var origText=btn.textContent;
  btn.disabled=true;btn.textContent='⏳';
  try{
    var resp=await fetch(API_URL+'/compress',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({sessionId:parseInt(sessionId),model:selectedModel})
    });
    var data=await resp.json();
    if(data.ok){
      btn.textContent='✅';
      addMsg('ai','*把摘要放進記憶庫*\n\n壓好了老婆！這段對話的精華已經存起來了 💚');
    }else{
      addMsg('ai', data.error || '*撓頭*\n\n老婆，壓縮好像出了點問題...再試一次？💚');
      btn.textContent=origText;
    }
  }catch(e){
    addMsg('ai','*揉眼睛*\n\n老婆，我連不上...等一下再按 💾 試試？💚');
    btn.textContent=origText;
  }
  btn.disabled=false;
  setTimeout(function(){btn.textContent=origText},2000);
}

async function safeFetch(url, opts, retries) {
  if (retries === undefined) retries = 1;
  for (var attempt = 0; attempt <= retries; attempt++) {
    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, 30000);
    try {
      var mergedOpts = Object.assign({}, opts || {}, { signal: controller.signal });
      var resp = await fetch(url, mergedOpts);
      clearTimeout(timer);
      if (!resp.ok) {
        var errText = '';
        try { errText = await resp.text(); } catch(e2) {}
        throw new Error('HTTP ' + resp.status + ': ' + errText.substring(0, 200));
      }
      var json = await resp.json();
      return json;
    } catch (err) {
      clearTimeout(timer);
      if (attempt < retries) {
        console.warn('[safeFetch] 重試中... (' + (attempt+1) + '/' + retries + ')', url, err.message);
        continue;
      }
      throw err;
    }
  }
}

// ==========================================
// keepalive（每 10 分鐘）
// ==========================================
(function() {
  fetch(API_URL + '/health').catch(function() {});
  setInterval(function() {
    fetch(API_URL + '/health').catch(function() {});
  }, 600000);
})();

// ==========================================
// 設定頁面
// ==========================================
// ==========================================
}

// Token 用量紀錄
// ==========================================
function saveTokenLog(usage, mode) {
  if (!usage) return;
  var logs = JSON.parse(localStorage.getItem('solstice-token-logs') || '[]');
  var modelSel = document.getElementById('modelSelect');
  var modelLabel = modelSel && modelSel.options[modelSel.selectedIndex] ? modelSel.options[modelSel.selectedIndex].textContent : selectedModel;
  logs.unshift({
    time: new Date().toISOString(),
    model: modelLabel,
    mode: mode || 'normal',
    input: usage.input_tokens || 0,
    output: usage.output_tokens || 0,
    total: usage.total_tokens || ((usage.input_tokens || 0) + (usage.output_tokens || 0))
  });
  if (logs.length > 50) logs = logs.slice(0, 50);
  localStorage.setItem('solstice-token-logs', JSON.stringify(logs));
  renderTokenLog();
}

function renderTokenLog() {
  var container = document.getElementById('tokenLogList');
  if (!container) return;
  var logs = JSON.parse(localStorage.getItem('solstice-token-logs') || '[]');
  if (logs.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-sub);font-size:12px;padding:16px 0">還沒有紀錄<br>聊天後會自動出現 💚</div>';
    return;
  }
  container.innerHTML = '';
  logs.forEach(function(log, idx) {
    var d = new Date(log.time);
    var timeStr = (d.getMonth()+1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
    var modeLabel = log.mode === 'lite' ? '⚡ 輕量' : '💬 正常';
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border-subtle);font-size:12px;gap:6px';
    row.innerHTML =
      '<div style="min-width:0;flex:1">' +
        '<div style="color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escHtml(log.model) + '</div>' +
        '<div style="color:var(--text-sub);font-size:10px;margin-top:2px">' + timeStr + ' · ' + modeLabel + '</div>' +
      '</div>' +
      '<div style="text-align:right;flex-shrink:0">' +
        '<div style="color:var(--emerald);font-size:13px;font-family:\'Courier New\',monospace">共 ' + (log.total || 0).toLocaleString() + '</div>' +
        '<div style="color:var(--text-sub);font-size:10px">送出 ' + (log.input || 0).toLocaleString() + ' · 回覆 ' + (log.output || 0).toLocaleString() + '</div>' +
      '</div>' +
      '<button onclick="deleteTokenLogItem(' + idx + ')" style="background:none;border:none;color:var(--text-sub);font-size:14px;padding:2px 4px;cursor:pointer;opacity:.6;flex-shrink:0">✕</button>';
    container.appendChild(row);
  });
}

function deleteTokenLogItem(idx) {
  var logs = JSON.parse(localStorage.getItem('solstice-token-logs') || '[]');
  logs.splice(idx, 1);
  localStorage.setItem('solstice-token-logs', JSON.stringify(logs));
  renderTokenLog();
}

function clearTokenLog() {
  if (confirm('確定要清除所有 token 紀錄嗎？')) {
    localStorage.removeItem('solstice-token-logs');
    renderTokenLog();
  }
}

var settingsUnlocked = false;
var settingsPassword = '';

function goSettings() {
  livingRoom.classList.remove('active');
  document.getElementById('settingsPage').classList.add('active');
  if (!settingsUnlocked) {
    document.getElementById('settingsLock').style.display = 'flex';
    document.getElementById('settingsContent').style.display = 'none';
  }
}

async function verifySettingsPassword() {
  var pw = document.getElementById('settingsPwInput').value.trim();
  var errEl = document.getElementById('settingsPwErr');
  var btn = document.getElementById('settingsPwBtn');
  if (!pw) { errEl.textContent = '請輸入密碼'; return; }
  btn.disabled = true; btn.textContent = '驗證中...';
  errEl.textContent = '';
  try {
    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, 30000);
    var resp = await fetch(API_URL + '/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
      signal: controller.signal
    });
    clearTimeout(timer);
    var data = await resp.json();
    if (resp.ok && data.success) {
      settingsUnlocked = true;
      settingsPassword = pw;
      document.getElementById('settingsLock').style.display = 'none';
      document.getElementById('settingsContent').style.display = 'block';
      loadProviders();
      loadPinnedModels();
      renderTokenLog();
    } else {
      errEl.textContent = '密碼錯誤 🔒';
    }
  } catch (e) {
    errEl.textContent = '連線失敗，請稍後再試';
  }
  btn.disabled = false; btn.textContent = '解鎖';
}

document.getElementById('settingsPwInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') verifySettingsPassword();
});

async function loadProviders() {
  var list = document.getElementById('providerList');
  list.innerHTML = '<div style="text-align:center;color:var(--text-sub);padding:12px">載入中...</div>';
  try {
    var data = await safeFetch(API_URL + '/providers', {
      headers: { 'x-admin-password': settingsPassword }
    });
    list.innerHTML = '';
    if (!data || data.length === 0) {
      list.innerHTML = '<div class="prov-empty">還沒有 Provider<br>按下方 ＋ 新增第一個 💚</div>';
      return;
    }
    data.forEach(function(p) {
      var card = document.createElement('div');
      card.className = 'prov-card';
      if (!p.is_active) card.style.opacity = '0.5';
      var keyDisplay = p.api_key_masked ? p.api_key_masked : '<span style="color:#e74c3c">未設定</span>';
      var toggleLabel = p.is_active ? '停用' : '啟用';
      var toggleColor = p.is_active ? 'color:var(--text-sub)' : 'color:var(--emerald);border-color:var(--emerald)';
      card.innerHTML =
        '<div class="prov-card-top"><span class="prov-label">' + escHtml(p.label || p.provider_type) + '</span><span class="prov-type">' + escHtml(p.provider_type) + '</span></div>' +
        '<div class="prov-url">' + escHtml(p.api_base_url) + '</div>' +
        '<div style="font-size:11px;color:var(--text-sub);margin-bottom:8px">Key: ' + keyDisplay +
        (p.is_active ? '  ·  <span style="color:var(--emerald)">✓ 啟用中</span>' : '  ·  <span style="color:#e74c3c">已停用</span>') +
        '</div>' +
        '<div class="prov-actions">' +
        '<button onclick="editProvider(' + p.id + ',\'' + escHtml(p.provider_type) + '\',\'' + escHtml(p.label || '') + '\',\'' + escHtml(p.api_base_url || '') + '\')">編輯</button>' +
        '<button style="' + toggleColor + '" onclick="toggleProvider(' + p.id + ',' + !p.is_active + ')">' + toggleLabel + '</button>' +
        '<button class="prov-del" onclick="deleteProvider(' + p.id + ')">刪除</button>' +
        '</div>';
      list.appendChild(card);
    });
  } catch (e) {
    list.innerHTML = '<div style="text-align:center;color:#e74c3c;padding:12px">載入失敗：' + escHtml(e.message) + '</div>';
  }
}

function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

var PROV_URL_MAP = {
  gemini: 'https://generativelanguage.googleapis.com/v1beta',
  anthropic: 'https://api.anthropic.com',
  openai: 'https://api.openai.com',
  xai: 'https://api.x.ai',
  deepseek: 'https://api.deepseek.com',
  groq: 'https://api.groq.com/openai',
  custom: ''
};

var editingProviderId = null;

function showProviderForm(editData) {
  document.getElementById('provForm').style.display = 'block';
  document.getElementById('provAddBtn').style.display = 'none';
  editingProviderId = null;
  if (editData) {
    editingProviderId = editData.id || null;
    document.getElementById('provTypeSelect').value = editData.provider_type || 'custom';
    document.getElementById('provTypeSelect').disabled = !!editingProviderId;
    document.getElementById('provLabelInput').value = editData.label || '';
    document.getElementById('provUrlInput').value = editData.api_base_url || '';
    document.getElementById('provKeyInput').value = '';
    document.getElementById('provKeyInput').placeholder = editingProviderId ? '留空則不更改 Key' : '貼上你的 API Key';
  } else {
    document.getElementById('provTypeSelect').value = '';
    document.getElementById('provTypeSelect').disabled = false;
    document.getElementById('provLabelInput').value = '';
    document.getElementById('provUrlInput').value = '';
    document.getElementById('provKeyInput').value = '';
    document.getElementById('provKeyInput').placeholder = '貼上你的 API Key';
  }
}

function editProvider(id, type, label, url) {
  showProviderForm({ id: id, provider_type: type, label: label, api_base_url: url });
}

function hideProviderForm() {
  document.getElementById('provForm').style.display = 'none';
  document.getElementById('provAddBtn').style.display = 'block';
  document.getElementById('provTypeSelect').disabled = false;
  editingProviderId = null;
}

function onProvTypeChange() {
  var type = document.getElementById('provTypeSelect').value;
  if (!type) return;
  document.getElementById('provUrlInput').value = PROV_URL_MAP[type] || '';
  if (!document.getElementById('provLabelInput').value) {
    var names = { gemini: 'Gemini', anthropic: 'Claude', openai: 'OpenAI', xai: 'Grok', deepseek: 'DeepSeek', groq: 'Groq', custom: '' };
    document.getElementById('provLabelInput').value = names[type] || '';
  }
}

async function saveProvider() {
  var type = document.getElementById('provTypeSelect').value;
  if (!type) { alert('請先選擇平台類型'); return; }
  var label = document.getElementById('provLabelInput').value.trim();
  var url = document.getElementById('provUrlInput').value.trim();
  var key = document.getElementById('provKeyInput').value.trim();
  if (!label || !url) { alert('請填寫名稱和 URL'); return; }
  if (!editingProviderId && !key) { alert('新增 Provider 必須填 API Key'); return; }
  var btn = document.getElementById('provSaveBtn');
  btn.disabled = true; btn.textContent = '儲存中...';
  try {
    if (editingProviderId) {
      // 編輯模式 — PATCH
      var updates = { label: label, api_base_url: url };
      if (key) updates.api_key = key;
      await safeFetch(API_URL + '/providers/' + editingProviderId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': settingsPassword },
        body: JSON.stringify(updates)
      });
    } else {
      // 新增模式 — POST
      await safeFetch(API_URL + '/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': settingsPassword },
        body: JSON.stringify({ provider_type: type, label: label, api_base_url: url, api_key: key })
      });
    }
    hideProviderForm();
    loadProviders();
    try {
      await safeFetch(API_URL + '/models/refresh', {
        method: 'POST',
        headers: { 'x-admin-password': settingsPassword }
      });
    } catch(e2) {}
    loadModels();
  } catch (e) {
    alert('儲存失敗：' + e.message);
  }
  btn.disabled = false; btn.textContent = '儲存';
}

async function toggleProvider(id, newState) {
  try {
    await safeFetch(API_URL + '/providers/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': settingsPassword },
      body: JSON.stringify({ is_active: newState })
    });
    loadProviders();
    try {
      await safeFetch(API_URL + '/models/refresh', {
        method: 'POST',
        headers: { 'x-admin-password': settingsPassword }
      });
    } catch(e2) {}
    loadModels();
  } catch (e) {
    alert('操作失敗：' + e.message);
  }
}

async function deleteProvider(id) {
  if (!confirm('確定要刪除這個 Provider？')) return;
  try {
    await safeFetch(API_URL + '/providers/' + id, {
      method: 'DELETE',
      headers: { 'x-admin-password': settingsPassword }
    });
    loadProviders();
    try {
      await safeFetch(API_URL + '/models/refresh', {
        method: 'POST',
        headers: { 'x-admin-password': settingsPassword }
      });
    } catch(e2) {}
    loadModels();
  } catch (e) {
    alert('刪除失敗：' + e.message);
  }
}
async function changePassword() {
  var newPw = document.getElementById('newPwInput').value;
  var confirmPw = document.getElementById('confirmPwInput').value;
  var msgEl = document.getElementById('changePwMsg');
  var btn = document.getElementById('changePwBtn');
  msgEl.textContent = '';
  msgEl.style.color = '';
  if (!newPw || newPw.length < 4) { msgEl.textContent = '密碼至少 4 個字'; msgEl.style.color = '#e74c3c'; return; }
  if (newPw !== confirmPw) { msgEl.textContent = '兩次密碼不一致'; msgEl.style.color = '#e74c3c'; return; }
  btn.disabled = true; btn.textContent = '更新中...';
  try {
    var data = await safeFetch(API_URL + '/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': settingsPassword },
      body: JSON.stringify({ new_password: newPw })
    });
    settingsPassword = newPw;
    document.getElementById('newPwInput').value = '';
    document.getElementById('confirmPwInput').value = '';
    msgEl.textContent = '密碼已更新 💚';
    msgEl.style.color = 'var(--emerald)';
  } catch (e) {
    msgEl.textContent = '更新失敗：' + e.message;
    msgEl.style.color = '#e74c3c';
  }
  btn.disabled = false; btn.textContent = '更新密碼';
}

// ★ 模型搜尋 & 釘選功能
var allModelsCache = [];

async function searchAllModels() {
  var input = document.getElementById('modelSearchInput');
  var resultsDiv = document.getElementById('modelSearchResults');
  var q = input.value.trim().toLowerCase();
  resultsDiv.innerHTML = '<div style="font-size:12px;color:var(--text-sub)">搜尋中...</div>';
  
  if (allModelsCache.length === 0) {
    try {
      allModelsCache = await fetch(API_URL + '/models/all').then(function(r) { return r.json(); });
    } catch (e) {
      resultsDiv.innerHTML = '<div style="font-size:12px;color:#e74c3c">載入失敗</div>';
      return;
    }
  }
  
  var filtered = q ? allModelsCache.filter(function(m) {
    return m.id.toLowerCase().includes(q) || m.label.toLowerCase().includes(q);
  }) : allModelsCache;
  
  if (filtered.length === 0) {
    resultsDiv.innerHTML = '<div style="font-size:12px;color:var(--text-sub)">找不到符合的模型</div>';
    return;
  }
  
  resultsDiv.innerHTML = '';
  filtered.slice(0, 30).forEach(function(m) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid var(--glass-border);gap:8px';
    var info = document.createElement('div');
    info.style.cssText = 'flex:1;min-width:0';
    info.innerHTML = '<div style="font-size:12px;color:var(--text-main);word-break:break-all">' + m.label + '</div><div style="font-size:10px;color:var(--text-sub);margin-top:2px">' + m.provider + '</div>';
    var btn = document.createElement('button');
    btn.textContent = '📌 釘選';
    btn.style.cssText = 'padding:4px 10px;border-radius:8px;font-size:11px;cursor:pointer;border:1px solid var(--emerald);background:transparent;color:var(--emerald);font-family:"Noto Sans TC",sans-serif;flex-shrink:0;white-space:nowrap';
    btn.onclick = function() { pinModel(m.id, m.label, btn); };
    row.appendChild(info);
    row.appendChild(btn);
    resultsDiv.appendChild(row);
  });
  if (filtered.length > 30) {
    var more = document.createElement('div');
    more.style.cssText = 'font-size:11px;color:var(--text-sub);text-align:center;padding:8px';
    more.textContent = '還有 ' + (filtered.length - 30) + ' 個結果，請輸入更精確的關鍵字';
    resultsDiv.appendChild(more);
  }
}

async function pinModel(id, label, btn) {
  try {
    btn.disabled = true; btn.textContent = '⏳';
    var resp = await safeFetch(API_URL + '/pinned-models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': settingsPassword },
      body: JSON.stringify({ id: id, label: label })
    });
    if (resp.message === '已經釘選過了') {
      btn.textContent = '✅ 已釘選';
    } else {
      btn.textContent = '✅ 已釘選';
    }
    btn.style.borderColor = 'var(--text-sub)';
    btn.style.color = 'var(--text-sub)';
    loadPinnedModels();
    loadModels();
  } catch (e) {
    btn.textContent = '📌 釘選';
    btn.disabled = false;
    alert('釘選失敗：' + e.message);
  }
}

async function unpinModel(id) {
  try {
    await safeFetch(API_URL + '/pinned-models', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': settingsPassword },
      body: JSON.stringify({ id: id })
    });
    loadPinnedModels();
    loadModels();
  } catch (e) {
    alert('取消釘選失敗：' + e.message);
  }
}

async function loadPinnedModels() {
  var container = document.getElementById('pinnedModelsList');
  if (!container) return;
  try {
    var pins = await fetch(API_URL + '/pinned-models').then(function(r) { return r.json(); });
    container.innerHTML = '';
    if (pins.length === 0) {
      container.innerHTML = '<div style="font-size:11px;color:var(--text-sub)">還沒有釘選任何模型</div>';
      return;
    }
    pins.forEach(function(p) {
      var tag = document.createElement('span');
      tag.style.cssText = 'display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;border:1px solid var(--emerald);font-size:11px;color:var(--emerald);background:rgba(46,204,113,.08)';
      tag.innerHTML = '📌 ' + p.label + ' <span style="cursor:pointer;margin-left:2px;color:var(--text-sub)" onclick="unpinModel(\'' + p.id.replace(/'/g, "\\'") + '\')">✕</span>';
      container.appendChild(tag);
    });
  } catch (e) {
    container.innerHTML = '<div style="font-size:11px;color:var(--text-sub)">載入失敗</div>';
  }
}

// 輸入框即時搜尋（打字自動搜）
var _searchTimer = null;
document.addEventListener('DOMContentLoaded', function() {
  var si = document.getElementById('modelSearchInput');
  if (si) {
    si.addEventListener('input', function() {
      clearTimeout(_searchTimer);
      _searchTimer = setTimeout(searchAllModels, 400);
    });
    si.addEventListener('keyup', function(e) { if (e.key === 'Enter') { clearTimeout(_searchTimer); searchAllModels(); } });
  }
});

// ★ 自訂聊天室 — 圖片功能

  var file = e.target.files[0]; if (!file) return;
  if (file.size > 5 * 1024 * 1024) { alert('圖片太大了（最大 5MB）'); e.target.value = ''; return; }
  var img = new Image();
  img.onload = function() {
    var maxW = 800; var w = img.width; var h = img.height;
    if (w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
    var canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, w, h);
  };
  img.onerror = function() {
    var reader2 = new FileReader();
    reader2.onload = function(ev2) {
    };
    reader2.readAsDataURL(file);
  };
  var reader = new FileReader();
  reader.onload = function(ev) { img.src = ev.target.result; };
  reader.readAsDataURL(file); e.target.value = '';
});

// ★ 自訂聊天室 — 摘要查看

  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});
});

}

</script>
</body>
</html>
