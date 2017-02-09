define(function(require,f,b){var g=require("CommonTools_Core");var j=require("HtmlTools_Core");var h;var e=("ontouchstart" in document);var i=e?"tap":"click";var c={isDebug:false,down:{height:75,contentdown:"下拉可以刷新",contentover:"释放立即刷新",contentrefresh:"正在刷新",},up:{auto:false,offset:100,show:true,contentdown:"上拉显示更多",contentrefresh:"正在加载...",contentnomore:"没有更多数据了",},bizlogic:{defaultInitPageNum:0,getLitemplate:null,getUrl:null,getRequestDataCallback:null,changeResponseDataCallback:null,changeToltalCountCallback:null,successRequestCallback:null,errorRequestCallback:null,refreshCallback:null,itemClickCallback:null,targetListItemClickStr:"li",listdataId:"listdata",pullrefreshId:"pullrefresh",refreshEventName:"refreshListPage",delyTime:300,ajaxSetting:{requestTimeOut:15000,accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:"application/json",xml:"application/xml, text/xml",html:"text/html",text:"text/plain"},contentType:"application/x-www-form-urlencoded",},isRendLitemplateAuto:true},skin:"default"};function a(l){var k=this;l.element=document.getElementById(l.bizlogic.pullrefreshId);if(l.down){l.down.callback=function(){k.pullDownCallback()}}if(l.up){l.up.callback=function(){k.pullUpCallback()}}k.options=l;k.pullRefreshContainer=l.element;k.respnoseEl=document.getElementById(l.bizlogic.listdataId);k.totalCount=0;k.currPage=k.options.bizlogic.defaultInitPageNum;if(k.options.up&&k.options.up.auto){k.currPage--}k.initAllEventListeners();k.pullToRefreshInstance=h.initPullToRefresh(l)}a.prototype.pullDownCallback=function(){var k=this;if(!k.loadingDown){k.isPullDown=true;k.loadingDown=true;k.currPage=k.options.bizlogic.defaultInitPageNum;setTimeout(function(){k.ajaxRequest()},k.options.bizlogic.delyTime);k.options.bizlogic.refreshCallback&&k.options.bizlogic.refreshCallback(true)}};a.prototype.pullUpCallback=function(){var k=this;if(!k.loadingUp){k.isPullDown=false;k.loadingUp=true;k.currPage++;setTimeout(function(){k.ajaxRequest()},k.delyTime)}};a.prototype.initAllEventListeners=function(){var k=this;var l=function(m){k.refresh()};window.removeEventListener(k.options.bizlogic.refreshEventName,l);window.addEventListener(k.options.bizlogic.refreshEventName,l);k.setElemListeners()};a.prototype.setElemListeners=function(){var k=this;if(k.options.bizlogic.itemClickCallback){mui("#"+k.options.bizlogic.listdataId).on(i,k.options.bizlogic.targetListItemClickStr,k.options.bizlogic.itemClickCallback)}};a.prototype.refresh=function(){var k=this;if(!k.loadingUp){k.clearResponseEl();k.currPage=k.options.bizlogic.defaultInitPageNum-1;if(k.pullToRefreshInstance.finished){k.pullToRefreshInstance.refresh(true)}k.pullToRefreshInstance.pullupLoading()}};a.prototype.ajaxRequest=function(){var k=this;if(!k.options.bizlogic.getUrl){if(k.options.isDebug){console.error("error***url无效,无法访问")}k.errorRequest(null,null,"请求url为空!");return}var m={};if(k.options.bizlogic.getRequestDataCallback){m=k.options.bizlogic.getRequestDataCallback(k.currPage)}else{if(k.options.isDebug){console.warn("warning***请注意getData不存在,默认数据为空")}}var l="";if(typeof(k.options.bizlogic.getUrl)=="function"){l=k.options.bizlogic.getUrl()}else{l=k.options.bizlogic.getUrl}mui.ajax(l,{data:m,dataType:"json",timeout:k.options.bizlogic.requestTimeOut,type:"POST",accepts:k.options.bizlogic.ajaxSetting.accepts,contentType:k.options.bizlogic.ajaxSetting.contentType,success:function(n){k.successRequest(n)},error:function(o,n){k.errorRequest(o,n,"请求失败!")}})};a.prototype.errorRequest=function(n,k,m){var l=this;l.refreshState();l.currPage--;l.currPage=l.currPage>=l.defaultInitPageNum?l.currPage:l.defaultInitPageNum;l.options.bizlogic.errorRequestCallback&&l.options.bizlogic.errorRequestCallback(n,k,m)};a.prototype.successRequest=function(o,l){var n=this;if(!o){if(n.options.isDebug){console.log("warning***返回的数据为空,请注意！")}n.refreshState();return}if(n.options.bizlogic.changeResponseDataCallback){o=n.options.bizlogic.changeResponseDataCallback(o)}else{o=n.defaultChangeResponseData(o)}if(n.options.bizlogic.changeToltalCountCallback&&typeof(n.options.bizlogic.changeToltalCountCallback)==="function"){n.totalCount=n.options.bizlogic.changeToltalCountCallback(o)}else{if(n.options.bizlogic.changeToltalCountCallback&&typeof(n.options.bizlogic.changeToltalCountCallback)==="number"){n.totalCount=n.options.bizlogic.changeToltalCountCallback}else{}}if(n.options.bizlogic.isRendLitemplateAuto){if(n.isPullDown){n.clearResponseEl()}if(g.isInclude("mustache.min.js")){if(o&&Array.isArray(o)&&o.length>0){var r="";for(var p=0;p<o.length;p++){var q=o[p];var k="";if(n.options.bizlogic.getLitemplate){if(typeof(n.options.bizlogic.getLitemplate)==="string"){k=n.options.bizlogic.getLitemplate}else{if(typeof(n.options.bizlogic.getLitemplate)==="function"){k=n.options.bizlogic.getLitemplate(q)}}}var m=Mustache.render(k,q);r+=m}if(r!=""){j.appendHtmlChildCustom(n.respnoseEl,r)}}}else{if(n.options.isDebug==true){console.error("error***没有包含mustache.min.js,无法进行模板渲染")}}}if(n.options.bizlogic.successRequestCallback&&typeof(n.options.bizlogic.successRequestCallback)==="function"){n.options.bizlogic.successRequestCallback(o,n.isPullDown||(n.currPage==n.options.bizlogic.defaultInitPageNum))}if(!l){n.refreshState()}};a.prototype.defaultChangeResponseData=function(l){var k=this;var n=null;if(l&&l.UserArea&&l.UserArea.InfoList){if(Array.isArray(l.UserArea.InfoList)){if(l.UserArea.PageInfo&&l.UserArea.PageInfo.TotalNumCount){k.totalCount=l.UserArea.PageInfo.TotalNumCount}else{k.totalCount=0}n=[];for(var m=0;m<l.UserArea.InfoList.length;m++){if(typeof l.UserArea.InfoList[m].Info==="object"){n[m]=l.UserArea.InfoList[m].Info}else{n[m]=l.UserArea.InfoList[m]}}}else{n[0]=l.UserArea.InfoList}}else{if(l&&l.EpointDataBody&&l.EpointDataBody.DATA&&l.EpointDataBody.DATA.UserArea&&l.EpointDataBody.DATA.UserArea.InfoList){if(l.EpointDataBody.DATA.UserArea.PageInfo!=null&&l.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount!=null){k.totalCount=l.EpointDataBody.DATA.UserArea.PageInfo.TotalNumCount}else{k.totalCount=0}if(l.EpointDataBody.DATA.UserArea.InfoList!=null){n=[];var o=null;if(l.EpointDataBody.DATA.UserArea.InfoList.Info){o=l.EpointDataBody.DATA.UserArea.InfoList.Info}else{o=l.EpointDataBody.DATA.UserArea.InfoList}if(Array.isArray(o)){for(var m=0;m<o.length;m++){n[m]=o[m]}}else{n[0]=o}}}else{k.totalCount=0;n=l}}return n};a.prototype.refreshState=function(){var k=this;if(k.isPullDown){k.pullToRefreshInstance.endPullDownToRefresh()}if(k.pullToRefreshInstance.finished){k.pullToRefreshInstance.refresh(true)}var l=j.getChildElemLength(k.respnoseEl);if(l>=k.totalCount){k.pullToRefreshInstance.endPullUpToRefresh(true)}else{k.pullToRefreshInstance.endPullUpToRefresh(false)}k.loadingDown=false;k.loadingUp=false};a.prototype.clearResponseEl=function(){var k=this;if(k.options.bizlogic.isRendLitemplateAuto){k.respnoseEl&&(k.respnoseEl.innerHTML="")}};f.initPullDownRefresh=function(k,m){k=g.extend(true,{},c,k);var l=function(o){h=o;var n=new a(k);m&&m(n)};if(k.skin==="default"){require.async("PullToRefresh_Base_Default_Core",l)}else{if(k.skin==="type0"){require.async("PullToRefresh_Base_Type0_Core",l)}else{g.importFile("css/RayApp/RayApp.PullToRefresh.css");if(k.skin==="type1"){require.async("PullToRefresh_Base_Type1_Core",l)}else{if(k.skin==="type1_material1"){require.async("PullToRefresh_Base_Type1__Material1_Core",l)}else{console.error("错误:传入的下拉刷新皮肤错误,超出范围!")}}}}}});