define(function(require,exports,module){"use strict";function e(e,n,o,i){if(e&&Array.isArray(e)){for(var r="",l=0,a=0;a<e.length;a++){var u=e[a];u.id=u.id||u.url,r+=u.id+",";var c=null;o&&("string"==typeof o&&(o=document.querySelector(o)),c=o);var p=document.createElement("div");p.className="mui-iframe-wrapper",p.id=u.id;var f=u.styles||{};"string"!=typeof f.top&&(f.top="0px"),"string"!=typeof f.bottom&&(f.bottom="0px"),"string"!=typeof f.left&&(f.left="0px"),"string"!=typeof f.right&&(f.right="0px"),p.style.zIndex=f.zindex||0,p.style.position="fixed",p.style.top=f.top,p.style.bottom=f.bottom,p.style.left=f.left,p.style.right=f.right,p.style["-webkit-overflow-scrolling"]="touch";var w=document.createElement("iframe"),m="";if(m+=m.indexOf("?")==-1&&u.url.indexOf("?")==-1?"?":"&",m+="H5PageId="+u.id,m+="&_t="+Math.random(),e[a].extras)for(var v in e[a].extras)m+="&",m+=v+"="+e[a].extras[v];w.src=u.url+m,w.name=u.id,w.style.border="0px",w.onload=w.onreadystatechange=function(){w.readyState&&"complete"!=w.readyState||(l++,l>=e.length&&i&&i())},p.appendChild(w),document.body.appendChild(p),0==a&&1==n?p.style.display="block":p.style.display="none",document.body.style["overflow-x"]="hidden",document.body.style["overflow-y"]="hidden",d.os.wechat&&t(p,w),c&&c.appendChild(p),s.push({iframe:w,styles:f})}return r}}function t(e,t){var n="MUI_SCROLL_POSITION_"+document.location.href+"_"+t.src,o=parseFloat(localStorage.getItem(n))||0;o&&!function(e){t.onload=function(){window.scrollTo(0,e)}}(o),setInterval(function(){var e=window.scrollY;o!==e&&(localStorage.setItem(n,e+""),o=e)},100)}function n(e,t,n,i,r,l){if("undefined"==typeof t)return void console.error("错误:创建窗口的url不能为空");i=i||{},n=n||{},e=e||t;var a="";a+=a.indexOf("?")==-1&&t.indexOf("?")==-1?"?":"&",a+="H5PageId="+e,a+="&_t="+Math.random();for(var s in n)a+="&",a+=s+"="+encodeURIComponent(n[s]);if(!d.os.plus){var c=u.getStorageItem("Html5_Compatible_PageStack")||{},p=o(t+a);return null!=c[window.id]?c[window.id].nextHref=t+a:c[window.id]={href:window.location.href,nextHref:t+a},c[p]={href:t+a,beforeHref:window.location.href},u.setStorageItem("Html5_Compatible_PageStack",c),void(i.isNewWindow?window.open(t+a,""):d.os.ios||d.os.android?window.top.location.href=t+a:window.parent.location.href=t+a)}i=i||{},i=d.extend(!0,{},f,i);var w=plus.webview.currentWebview,m=plus.webview.getWebviewById(e);if(m)return m.show(i.aniShow,i.duration,function(){r&&r(),i.closeCurrentAfterOpen&&w.close()}),m;m=plus.webview.create(t,e,i,n);var v=i.waiting,h=null;v.autoShow&&(h=plus.nativeUI.showWaiting(v.title,v.options)),m.addEventListener("loaded",function(){h&&h.close(),m.show(i.aniShow,i.duration,function(){r&&r(),i.closeCurrentAfterOpen&&w.close()})},!1),m.addEventListener("close",function(){l&&l(),m=null},!1)}function o(e){var t=d.getUrlParamsValue(e,"H5PageId"),n="undefined"!==t?t:"H5index.html";return n}function i(e,t,n){if(d.os.plus){e=e||0;var o=l(e);if(!o){var i="template-level-main-"+e,r="template-level-sub-"+e,a=mui.preload({url:t,id:i,styles:{popGesture:"hide"},extras:{templateType:"main",templateLevel:e}}),u=mui.preload({url:n?n:"",id:r,styles:{top:"0px",bottom:"0px"},extras:{templateType:"sub",templateLevel:e,webviewTemplate:!0}});u.onloaded=function(){setTimeout(function(){u.show("fade-in",200)},50)},u.hide(),a.append(u),mui.os.ios&&a.addEventListener("hide",function(){u.hide("none")}),c[e]=o={name:"template-level-"+e,header:a,content:u}}return o}}function r(){var e=plus.webview.currentWebview().parent();e&&e.parent()&&(e=e.parent());var t=e?e.templateLevel:-1;null==t&&(t=-1);var n=t+1;n>p&&(n=p);var o=l(n);if(!o){var r=d.getRealativePath("html/RayApp/RayApp.Template.html");o=i(n,r)}return o}function l(e){if(!d.os.plus)return null;e=e||0;var t=c[e];if(!t){var n="template-level-main-"+e,o="template-level-sub-"+e,i=plus.webview.getWebviewById(n),r=plus.webview.getWebviewById(o);i&&r&&(c[e]=t={name:"template-level-"+e,header:i,content:r})}return t}function a(){var e=0,t=[];do{var n=l(e);n&&t.push(n),e++}while(null!=n);return t}var d=require("CommonTools_Core"),u=require("StorageTools_Core"),s=[],c=[],p=5,f={top:"0px",bottom:"0px",scrollIndicator:"none",scalable:!1,popGesture:"close",aniShow:"slide-in-right",aniHide:"slide-out-right",duration:300,waiting:{autoShow:!1,title:"加载中...",options:{size:"20px",padlock:!1,modal:!1,color:"#ffff00",background:"rgba(0,0,0,0.8)",loading:{display:"inline"}}},extras:{acceleration:"auto"}};exports.clearHtml=function(e){return e.replace(/(\r\n|\n|\r)/g,"").replace(/[\t ]+\</g,"<").replace(/\>[\t ]+\</g,"><").replace(/\>[\t ]+$/g,">")},exports.clearIframe=function(e){var t=e[0];t.src="about:blank";try{t.contentWindow.document.write(""),t.contentWindow.document.close()}catch(n){}try{t.parentNode.removeChild(t)}catch(n){e.remove()}},exports.getWinSize=function(){var e={width:0,height:0};return"undefined"!=typeof document.compatMode&&"CSS1Compat"==document.compatMode?(e.width=document.documentElement.clientWidth,e.height=document.documentElement.clientHeight):"undefined"!=typeof document.body&&(document.body.scrollLeft||document.body.scrollTop)&&(e.width=document.body.clientWidth,e.height=document.body.clientHeight),e},exports.getHashParams=function(e){var t=location.hash.substr(1),n=t.split("|"),o={};return d.each(n,function(e,t){var n=t.split("=");o[n[0]]=n[1]}),e?o[e]:null},exports.setUrlHash=function(e,t){var n=window.location;return e?void(window.location.hash=e+"="+t):void(n.hash="")},exports.isExternalUrl=function(e){if(/^(http|https|ftp|file)/g.test(e))return!0},exports.setOptions=function(e){f=d.extend(!0,{},f,e)},exports.clearChildrenWebviews=function(e){if(d.os.plus){var t=e.opened();if(t)for(var n=0,o=t.length;n<o;n++){var i=t[n],r=i.opened();r&&r.length>0?(exports.clearChildrenWebviews(i),i.id.indexOf("template-level")===-1&&i.close("none")):i.id.indexOf("template-level")===-1&&i.close("none")}}},exports.createWin=function(e,t,o,i,r,l){n(e,t,o,i,r,l)},exports.showWin=function(e,t,n,o,i){var r;if(d.os.plus)r="object"==typeof e?e:plus.webview.getWebviewById(e),r?(t=t||f.aniShow,n=n||f.duration,r.show(t,n,o,i)):console.error("plus情况页面显示时错误:"+e+"页面不存在!");else{var l=document.getElementById(e);if(!l)return void console.error("h5情况页面显示时错误:"+e+"页面不存在!");l.style.display="block",o&&o()}},exports.hideWin=function(e,t,n,o){var i;if(d.os.plus)i="object"==typeof e?e:plus.webview.getWebviewById(e),i?(t=t||f.aniHide,n=n||f.duration,i.hide(t,n,o)):console.error("plus情况页面隐藏时错误:"+e+"页面不存在!");else{var r=document.getElementById(e);if(!r)return void console.error("h5情况页面隐藏时错误:"+e+"页面不存在!");r.style.display="none"}},exports.createSubWins=function(t,n,o){if(!d.isArray(t))return void console.error("错误:子页面和样式不为数组,传入格式错误!");n=n||{};var i="boolean"!=typeof n.isShowFirst||n.isShowFirst,r=n.parentDom,l="";if(window.plus){var a=plus.webview.currentWebview(),u=0,s=f.waiting,c=null;s.autoShow&&(c=plus.nativeUI.showWaiting(s.title,s.options));for(var p=0;p<t.length;p++){l+=t[p].id||t[p].url+",";var w=t[p].styles?t[p].styles:t[0].styles;w=d.extend(!0,{},f,w);var m=t[p].extras||{},v=t[p].id||t[p].url,h=plus.webview.create(t[p].url,v,w,m);h.addEventListener("loaded",function(){u++,u>=t.length&&(c&&c.close(),o&&o())},!1),a.append(h),p>0?h.hide():i?h.show(w.aniShow,w.duration,w.showedCB,w.extras):h.hide()}}else l=e(t,i,r,o);return l},exports.firePageEvent=function(e,t,n){if(d.os.plus){if(!window.mui)return void console.error("错误:mui不存在,无法触发事件");var o=null;if(o="object"==typeof e?e:plus.webview.getWebviewById(e),n=n||{},t=t||"refreshListPage",!o){for(var i=a(),r=0;r<i.length;r++){var l=i[r],u=l.header;mui.fire(u,"triggerTemplateEvent",{refreshEventName:t,extras:n,id:e})}return}mui.fire(o,t,n)}else if(window.id==e)exports.trigger(document,t,n);else{var s=document.getElementById(e);s?(s=window.frames[e],exports.trigger(s,t,n)):console.error("触发自定义事件出错,触发对应的window的id不是本页面或者不是本页面的子页面,h5模式下无法触发其它历史页面!")}},exports.changeSubPageShow=function(e,t,n){exports.hideSubPage(t),exports.showSubPage(e),n&&n(e)},exports.showSubPage=function(e,t,n,o,i){exports.showWin(e,t,n,o,i)},exports.hideSubPage=function(e,t,n,o){exports.hideWin(e,t,n,o)},exports.receive=function(e,t){if(e){try{t&&(t=JSON.parse(t))}catch(n){}exports.trigger(document,e,t)}},exports.trigger=function(e,t,n){return e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,cancelable:!0})),this},exports.getExtraDataByKey=function(e){if(!e)return null;var t=null;if(window.plus){var n=plus.webview.currentWebview(),o=n.webviewTemplate;t=o?d.getUrlParamsValue(n.getURL(),e):plus.webview.currentWebview()[e]}else t=d.getUrlParamsValue(window.location.href,e);return"undefined"===t&&(t=null),t},exports.dbClickExit=function(e,t){var n=null;e=e||"再按一次退出应用",t=t||1e3,mui.back=function(){n?(new Date).getTime()-n<t&&plus.runtime.quit():(n=(new Date).getTime(),mui.toast(e),setTimeout(function(){n=null},t))}},exports.lockOrientation=function(e){d.os.plus&&(e?plus.screen.lockOrientation("portrait-primary"):plus.screen.lockOrientation("landscape-primary"))},exports.unlockOrientation=function(e){d.os.plus&&plus.screen.unlockOrientation()},exports.closeCurrentPage=function(){if(d.os.plus)mui.back();else if(window.opener)window.opener=null,window.open("","_self"),window.close();else if(window.history.length>1)return window.history.back(),!0},exports.preloadTemplate=function(){d.os.plus&&d.os.android&&r()},exports.openWinWithTemplate=function(e,t,n,o,i,l,a){if(!d.os.plus||d.os.ios)return void exports.createWin(e,t,n,o,i,l);e=e||t,n=n||{},o=d.extend(!0,{},f,o);var a=o.templateOptions||{},u=r(),s=u.header;u.content;/^(http|https|ftp)/g.test(t)||(t=plus.io.convertLocalFileSystemURL(t)),mui.fire(s,"updateHeader",{templateOptions:a,target:t,id:e,extras:n,aniShow:o.aniShow,duration:o.duration})},exports.getScrollTop=function(){var e=0,t=0,n=0;return document.body&&(t=document.body.scrollTop||0),document.documentElement&&(n=document.documentElement.scrollTop||0),e=t>n?t:n},exports.getScrollHeight=function(){var e=0,t=0,n=0;return document.body&&(t=document.body.scrollHeight),document.documentElement&&(n=document.documentElement.scrollHeight),e=t-n>0?t:n},exports.getWindowHeight=function(){var e=0;return e="CSS1Compat"==document.compatMode?document.documentElement.clientHeight:document.body.clientHeight},function(){function e(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("HTMLEvents"),o=!0;for(var i in t)"bubbles"===i?o=!!t[i]:n[i]=t[i];return n.initEvent(e,o,!0),n}e.prototype=window.Event.prototype,"undefined"==typeof window.CustomEvent&&(window.CustomEvent=e),window.id=o(window.location.href)}()});