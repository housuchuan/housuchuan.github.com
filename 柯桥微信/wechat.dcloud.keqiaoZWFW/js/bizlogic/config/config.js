/**
 * 作者: dailc
 * 时间: 2016-05-21 
 * 描述: 项目中用到的通用config文件 
 */
define(function(require, exports, module) {
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
	exports.extraServerUrl = '';
	//全局验证参数
	exports.validateData = 'Epoint_WebSerivce_**##0601';
	//更新文件地址 
	exports.updateFileUrl = '';

	//获取token函数
	exports.GetToken = function(success, error) {
		var token = '';
		var url = 'http://220.191.226.70:8080/kqzwwwapin/Common/GetToken';
		var requestData = {
			paras: {
				AppKey: "epointoa",
				AppSecret: "EpointGtig_oa8_pdfsign_Servcie",
				AppName: "wszwdt"
			}

		}; //'{"infoId":"'+infoId+'","cateNum":"'+cateNum+'"}'
		//mock完成后回调函数
		console.log('请求数据:' + JSON.stringify(requestData) + '请求地址：' + url);
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			success: function(response) {
				//console.log('请求成功');
				console.error(JSON.stringify(response));
				if(response && response.UserArea && response.UserArea.Token) {
					token = response.UserArea.Token;
					success && success(token);
				} else {

				}
			},
			error: function(response) {
				//console.log('请求失败');
				console.log(JSON.stringify(response));
				error && error(response);
			}
		});

	};
	
	//根据OpenID获取userguid
	exports.getUserguidbyOpenID = function(Token, OpenID, successcallback, errorcallback) {
			var UserGuid = '';
			var LoginID = '';
			var tips = '';
			var ret;
			var url = "http://220.191.226.70:8080/kqzwwwapi/User/userDetailByOpenID";
			var requestData = {
				ValidateData: Token,
				paras: {
					OpenID: OpenID
				}
			}
			console.log('openid请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
			mui.ajax(url, {
				data: JSON.stringify(requestData),
				dataType: "json",
				type: "POST",
				success: function(rtnData) {
					console.log('openid请求结果'+JSON.stringify(rtnData));
					//mui.toast(JSON.stringify(rtnData));
					if(rtnData.ReturnInfo.Code == "0") {
						tips = rtnData.ReturnInfo.Description
						successcallback && successcallback(LoginID, UserGuid, tips);
						return false;
					}
					if(rtnData.BusinessInfo.Code == "0") {
						tips = rtnData.BusinessInfo.Description
						successcallback && successcallback(LoginID, UserGuid, tips);
						//self.location = '../Interaction/Account_binding.aspx?UserPK=' + userguid;
						return false;
					}
					UserGuid = rtnData.UserArea.UserGuid;
					LoginID = rtnData.UserArea.LoginID;
					tips = '请求成功'
					successcallback && successcallback(LoginID, UserGuid, tips);
				},
				error: function() {
					//console.log('请求失败');
					//console.log(JSON.stringify(response));
					errorcallback && errorcallback(response)
				}
			});

		}
		/**
		 * @description 得到一个项目的根路径,
		 * h5模式下例如:http://id:端口/项目名/
		 * @return {String} 项目的根路径
		 */
	exports.getProjectBasePath = function(success) {
		//非本地
		var obj = window.location;
		var patehName = obj.pathname;
		//h5
		var contextPath = '';
		//这种获取路径的方法有一个要求,那就是所有的html必须在html文件夹中,并且html文件夹必须在项目的根目录
		//普通浏览器
		contextPath = patehName.substr(0, patehName.lastIndexOf("/html/") + 1);
		//var contextPath = obj.pathname.split("/")[1] + '/';
		var basePath = obj.protocol + "//" + obj.host + contextPath;
		//console.log(basePath);
		success && success(basePath);
	};
	/**
	 * 匿名函数中进行全局配置
	 */
	(function() {
		//正式地址
		var serverUrl_formal = 'http://220.191.226.70:8080/kqzwwwapi';
		var extraServerUrl_formal = 'http://220.191.226.70:8080/kqzwwwapin';
		var udateFileUrl_formal = '';
		//测试地址
		var serverUrl_test = '';
		var udateFileUrl_test = '';
		//mock地址
		var serverUrl_mock = 'http://218.4.136.118:8086/mockjs/143/';
		if(exports.isFormal === true) {
			exports.serverUrl = serverUrl_formal;
			exports.extraServerUrl = extraServerUrl_formal;
			exports.spdateFileUrl = udateFileUrl_formal;
		} else {
			exports.serverUrl = serverUrl_test;
			exports.updateFileUrl = udateFileUrl_test;
		}
		//mock重写
		if(exports.isUserMock === true) {
			exports.serverUrl = serverUrl_mock;
		}
	})();
});