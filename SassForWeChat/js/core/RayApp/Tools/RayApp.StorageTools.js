define(function(require,exports,module){"use strict";var e={isDebug:!1};exports.setOptions=function(t){if(t)for(var r in e)void 0!==t[r]&&(e[r]=t[r])},exports.setStorageItem=function(e,t){if(t=t||"","string"==typeof t||(t=JSON.stringify(t)),window.plus)plus.storage.setItem(e,t);else try{localStorage.setItem(e,t)}catch(r){console.error("localStorage存储值出错:"+e+","+JSON.stringify(r))}},exports.getStorageItem=function(e,t){t="boolean"!=typeof t||t;var r=null;if(window.plus)r=plus.storage.getItem(e);else try{r=localStorage.getItem(e)}catch(a){console.error("localStorage获取值出错:"+e+","+JSON.stringify(a))}if(null!=r&&t)try{r=JSON.parse(r)}catch(l){}return r},exports.removeStorageItem=function(e){if(null!=e&&""!=e)if(window.plus)plus.storage.removeItem(e);else try{localStorage.removeItem(e)}catch(t){console.error("localStorage删除值出错:"+e+","+JSON.stringify(msg))}},exports.clearAllStorageItem=function(){if(window.plus)plus.storage.clear();else try{localStorage.clear()}catch(e){console.error("localStorage清空时出错:,"+JSON.stringify(msg))}},function(t){var r="MyOffLineAppCache";t.clearAllOffLineAppCache=function(){var e=exports.getStorageItem(r);if(null!=e&&Array.isArray(e))for(var a=0;a<e.length;a++)exports.removeStorageItem(e[a]),t.deleteOffLineCache(e[a])},t.addOffLineCache=function(t,a){var l=exports.getStorageItem(r);null==l&&(l=[]),1==e.isDebug&&console.log("key:"+t+",addOffLineCache增加前的值:"+JSON.stringify(l));var n=null;"string"==typeof a?n=a:null!=a&&(n=JSON.stringify(a)),l.push(t),exports.setStorageItem(r,l),1==e.isDebug&&console.log("添加数据:key:"+t+",value:"+n),exports.setStorageItem(t,n),1==e.isDebug&&console.log("key:"+t+",addOffLineCache增加后的值:"+JSON.stringify(l))},t.getOffLineCache=function(e,t){return exports.getStorageItem(e,t)},t.deleteOffLineCache=function(t){var a=exports.getStorageItem(r);if(null!=a&&Array.isArray(a)){var l=a.indexOf(t);a.splice(l,1),exports.removeStorageItem(t),1==e.isDebug&&console.log("删除后离线管理:"+JSON.stringify(a)),exports.setStorageItem(r,a)}},t.IsHasOffLineCache=function(e){var t=!1,a=exports.getStorageItem(r);if(null==a||!Array.isArray(a))return t;var l=a.indexOf(e);return l!=-1&&(t=!0),t},t.addListDataCache=function(r,a,l){var n=t.getOffLineCache(r);if(null!=n&&Array.isArray(n)||(n=[]),"string"==typeof a)try{a=JSON.parse(a)}catch(o){1==e.isDebug&&console.log("addListCache,将列表字符串数据转为json时出错")}if(null!=l&&(l=parseInt(l)),!(null==l||isNaN(l)||l<0)){if(null==a||!Array.isArray(a))return void(1==e.isDebug&&console.log("addListCache,存储数据格式不对,传入非JSON数组格式"));if(1==e.isDebug&&console.log("addListCache,加入前的数据:"+JSON.stringify(n)),n.length<=l)Array.prototype.push.apply(n,a);else{1==e.isDebug&&console.log("插入数组长度:"+a.length+",beginIndex:"+l);var i=n.slice(0,l),s=n.slice(l+a.length);Array.prototype.push.apply(i,a),null!=s&&Array.prototype.push.apply(i,s),n=i}t.addOffLineCache(r,n),1==e.isDebug&&console.log("addListCache,key"+r+",加入后的数据:"+JSON.stringify(n))}},t.getListDataCache=function(r,a,l){var n=t.getOffLineCache(r),o=0;null!=n&&Array.isArray(n)&&(o=n.length),1==e.isDebug&&console.log("getListDataCache,总共的离线数据:"+JSON.stringify(n));var i=null,s=null;null!=a&&(i=parseInt(a)),null!=l&&(s=parseInt(l)),(null==i||isNaN(i))&&(i=0),(null==s||isNaN(s))&&(s=1),1==e.isDebug&&console.log("当前页:"+i+",页面大小:"+s);var g={totalCount:o,data:null};return null!=n&&(g.data=n.slice(i*s,(i+1)*s)),n=null,g}}(exports.OffLineAppCache={})});