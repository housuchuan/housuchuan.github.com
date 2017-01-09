define(function(require,exports,module){"use strict";!function(e){e.startVoiceRecognize=function(e,o){window.plus&&plus.speech.startRecognize({engine:"iFly"},function(o){e&&"function"==typeof e&&e(o)},function(e){o&&"function"==typeof o?o(e.message):console.log("识别语音失败!"+e.message)})}}(exports.SpeechModule={}),function(e){var o,n={};e.startRecord=function(e,n){return console.log("获取录音对象，开始录音...."),o||(o=plus.audio.getRecorder()),null==o?void console.error("录音对象未获取"):(o.record({filename:"_doc/audio/"},function(o){var n=[],t=o.substring(o.lastIndexOf("/")+1,o.length),i="file://"+plus.io.convertLocalFileSystemURL(o);n.push({name:t,path:i}),e&&"function"==typeof e&&e(n)},function(e){n&&"function"==typeof n&&n(e.message)}),o)},e.stopRecord=function(e){return(o=e||o)?void o.stop():void console.error(" recoderInstance 对象为空,无法暂停")},e.startPlay=function(e,o,t){if(!e)return void console.error(" url为空, 无法创建播放对象");n[e]=plus.audio.createPlayer(e);var i=n[e];return i?(i.play(function(){i&&(i.stop(),o&&"function"==typeof o&&o())},function(e){t&&"function"==typeof t&&t(e.message)}),i):void console.error("player为空,无法开始播放")},e.stopPlay=function(e){return"string"==typeof e&&(e=n[e]),e?void e.stop():void console.error("player为空,无法停止播放")},e.pausePlay=function(e){return"string"==typeof e&&(e=n[e]),e?void e.resume():void console.error("player为空,无法暂停播放")},e.resumePlay=function(e){return"string"==typeof e&&(e=n[e]),e?void e.pause():void console.error("player为空,无法恢复播放")}}(exports.AudioUtilModule={}),function(e){e.playHtml5Video=function(e,o,n,t){if(e&&o)if(t=t||!1,window.plus&&"Android"==plus.os.name&&!t){var i=plus.android.importClass("android.content.Intent"),r=plus.android.importClass("android.net.Uri"),s=plus.android.runtimeMainActivity(),u=new i(i.ACTION_VIEW),l=r.parse(e);u.setDataAndType(l,"video/*"),s.startActivity(u)}else t?o.setAttribute("webkit-playsinline","webkit-playsinline"):o.removeAttribute("webkit-playsinline"),o.paused||o.ended?(o.ended&&(o.currentTime=0),o.play(),n&&n(!0)):(o.pause(),n&&n(!1))}}(exports.VideoModule={})});