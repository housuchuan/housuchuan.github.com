/**
 * 作者: housc
 * 时间: 2016-05-21 
 * 描述: 项目中用到的通用config文件 
 */
define(function(require, exports, module) {
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
     //是否正式发布
    exports.isFormal = true;
    //是否使用Mock,优先级高于前面的url
    exports.isUserMock = false;
	//usersession key
	exports.userSessionKey = 'UserSessionKey_showcase';
	//settingSession key
	exports.settingSessionKey = 'SettingSessionKey_showcase';
	//oauth key 包括授权和登录等
	exports.oauthSessionKey = 'OauthSessionKey_showcase';
	//全局服务器地址
	exports.serverUrl = '';
	//全局验证参数
//	exports.validateData = 'Epoint_WebSerivce_**##0601';
	//更新文件地址 
	exports.updateFileUrl = '';
	exports.validateData = '';
	/**
	 * 匿名函数中进行全局配置
	 */
	(function() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/epoint.moapi.v2.js'
		], function() {
			//获取token
			ejs.oauth.getToken(function(result, msg, res) {
				var token = result.token; //(或ios下直接用result)
				exports.validateData = token;
				//如有问题,请自行alert result,根据层级进行取值
			});
		});
		//正式地址
		//柯桥政务个性化服务器地址
		var serverUrl_formal = 'http://220.191.226.70:8080/kqzwwwapin/';
		var bbServerUrl_formal = 'http://220.191.226.70:8080/kqzwwwapi/';
		var udateFileUrl_formal = '';
		//测试地址
		var serverUrl_test = '';
		var udateFileUrl_test = '';
		//mock地址
		var serverUrl_mock = 'http://218.4.136.118:8086/mockjs/219/';
		if (exports.isFormal === true) {
			exports.serverUrl = serverUrl_formal;		  //个性化真实接口地址
			exports.bbServerUrl = bbServerUrl_formal;     //标准版真实接口地址
			exports.spdateFileUrl = udateFileUrl_formal;
		}  else{
			exports.serverUrl = serverUrl_test;
			exports.updateFileUrl = udateFileUrl_test;
		}
		//mock重写
		if( exports.isUserMock===true){
			exports.serverUrl = serverUrl_mock;
		}
	})(); 
});