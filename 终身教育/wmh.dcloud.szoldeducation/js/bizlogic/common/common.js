/**
 * 作者：孙尊路
 * 时间：2016-04-11 14:54:02
 * 描述： 接口正式和非正式（测试）接口URL配置相关
 */
(function(win, config) {
	//默认测试服务器接口地址
	var IsFormal = true;
	/**
	 * 全局服务器地址
	 */
	config.ServerUrl = '';
	/**
	 * 更新文件地址 
	 */
	config.UpdateFileUrl = '';
	/**
	 * 匿名函数中进行全局配置
	 */
	(function(win) {

		/**
		 * 正式46服务器上的内网（10.31.0.46）接口地址  映射地址(221.224.167.154)
		 */
//						var serverUrl_formal = 'http://10.31.0.46/WebBuilderMobileService/appservice/';
//						var serverUrl_Pic_formal = 'http://10.31.0.46';
//						var udateFileUrl_formal = 'http://10.31.0.46/WebBuilderMobileService/EpointMobile_szoldeducation/updateFiles/update.json';
//						var udateFilePadUrl_formal = 'http://10.31.0.46/WebBuilderMobileService/EpointMobile_szoldeducation/updateFilesPad/update.json';

		var serverUrl_formal = 'http://221.224.167.154/WebBuilderMobileService/appservice/';
		var serverUrl_Pic_formal = 'http://221.224.167.154';
		var udateFileUrl_formal = 'http://221.224.167.154/WebBuilderMobileService/EpointMobile_szoldeducation/updateFiles/update.json';
		var udateFilePadUrl_formal = 'http://221.224.167.154/WebBuilderMobileService/EpointMobile_szoldeducation/updateFilesPad/update.json';

		/**
		 * 正式236服务器上的内网（10.31.0.236）接口地址  映射地址(zsxx.sipedu.org)
		 */
		//		var serverUrl_formal = 'http://10.31.0.236/WebBuilderMobileService/appservice/';
		//		var serverUrl_Pic_formal = 'http://10.31.0.236';
		//		var udateFileUrl_formal = 'http://10.31.0.236/WebBuilderMobileService/EpointMobile_szoldeducation/updateFiles/update.json';
		//		var udateFilePadUrl_formal = 'http://10.31.0.236/WebBuilderMobileService/EpointMobile_szoldeducation/updateFilesPad/update.json';

		//		var serverUrl_formal = 'http://zsxx.sipedu.org/WebBuilderMobileService/appservice/';
		//		var serverUrl_Pic_formal = 'http://zsxx.sipedu.org';
		//		var udateFileUrl_formal = 'http://zsxx.sipedu.org/WebBuilderMobileService/EpointMobile_szoldeducation/updateFiles/update.json';
		//		var udateFilePadUrl_formal = 'http://zsxx.sipedu.org/WebBuilderMobileService/EpointMobile_szoldeducation/updateFilesPad/update.json';

		/**
		 * 测试服务器上的接口地址（122服务器）
		 */
		var serverUrl_test = 'http://demo.epoint.com.cn:1111/WebBuilderMobileService/appservice/';
		var serverUrl_Pic_test = 'http://demo.epoint.com.cn:1111';
		var udateFileUrl_test = 'http://demo.epoint.com.cn:1111/WebBuilderMobileService/EpointMobile_szoldeducation/updateFiles/update.json';
		var udateFileUrlPad_test = 'http://demo.epoint.com.cn:1111/WebBuilderMobileService/EpointMobile_szoldeducation/updateFilesPad/update.json';
		if(IsFormal == true) {
			config.ServerUrl = serverUrl_formal;
			config.ServerUrl_Pic = serverUrl_Pic_formal;
			config.UpdateFileUrl = udateFileUrl_formal;
			config.UpdateFileUrlPad = udateFilePadUrl_formal;
			//直接调用测试地址
			config.PCServerUrl = "http://demo.epoint.com.cn:1111/WebBuilderMobileService/appservice/";
			//资格认证和培训接口单独调用
			config.TempServerUrl = 'http://221.224.167.154/WebBuilderMobileService/appservice/';
			//154服务器不需要登录
			//config.JServerUrl = "http://221.224.167.154:8099/szedu_v1.0.0/"; //“szedu_v1.0.2”走居民通的；“szedu_v1.0.0”不走居民通的；
			//154服务器需要登录
			config.JServerUrl = "http://221.224.167.154:8099/szedu/"; //“szedu_v1.0.2”走居民通的；“szedu_v1.0.0”不走居民通的；
			//*********严璐琛那边服务器，（测试打包用）************
			//config.JServerUrl = "http://218.4.136.117:8088/szedu_v1.0.0/";
			//mock测试用，后期需要替换掉正式接口地址
			config.MockServerUrl = "http://218.4.136.118:8086/mockjs/110/";
			//居民通登录页面地址,由於登錄地址會發生改變，所以在LoginUtil這個工具類中封裝了獲取登錄地址的方法
			//config.LoginURL = 'https://is.ecitizen-dev.sipac.gov.cn:443/samlsso?SAMLRequest=jZNNb9swDIbv%2BxWC7v5slyVC7CJNUcxAt3qJ20MvgyYzqwBZ8kQ5TfvrJ9vxlkMR9EqRL18%2BpJZXh0aRPViURmc0CWNKQAtTS%2F07ow%2FVbTCnV%2FmnJfJGtWzVuWe9gT8doCMrRLDOl62Nxq4BuwW7lwIeNncZfXauZVGUpkmYppdhMvsSJp8v2TxeLCJ8g7qLxFhFya2xAgbljO64Qh8qbjLqjRRYckS5h%2F8PiB0UGh3XLqNpnMyCJAniRRXP2MWcJbPQh54oKa1xRhh1LfU4SWc1MxwlMs0bQOYE266%2B3bE0jNmvMQnZ16oqg%2FJ%2BW1HyOBFJeyKekUY2MDgv1R770vxIbDBsPy7AJ6g0HzD93PuVhPEyOpWbxL%2F78uKmNEqKV7JSyrysLXDncTnbjWQb7s437COyDnZDKmv7sdGBdpRsy17%2FR8eV3EmwGS16bzSauh%2FvAOphd%2F4IHBwcWZum5VZizw4OXLgjCnaatVZ%2Bzg3sTrh8GMvZNMFEL%2B3D%2FeW8GFv3lwDCu6ws19ga60aW7%2FrJJ87vzvbv9fQb5H8B&RelayState=mobile&selectedKeys=email,phone&ssoLoginPage=';
			//config.LoginURL = 'https://is.ecitizen-dev.sipac.gov.cn:443/samlsso?SAMLRequest=jZNNb9swDIbv%2BxWG7vHn0BlC7CJLUcxAt3mJu8MuhSozqwBZ8kQ5zfbrJ9lx60MRFNCJIl%2B%2BfEStr0%2BdDI5gUGhVkCSMSQCK61ao3wW5b25XObkuP6yRdbKnm8E%2BqR38GQBtsEEEY13ZViscOjB7MEfB4X53V5Ana3saRWmShx%2FDJLsKk%2BQTzeM8j%2FAftMPD0XUK44hPpSS41YbDKF%2BQA5PoQtVNQZybCmuGKI7weoE4QKXQMmULksbJ1SqJ3WnijGYZTbMwTrNfJKiNtppr%2BVmoaZzBKKoZCqSKdYDUcrrffL2jaRjTxykJ6ZemqVf1931Dgp8zltRjcaAU0hHEZan%2B3JeUZ2yjYfN%2BATaTJeWS1jpays3i31x5dVNrKfjfYCOlft4aYNbhsmaYyHbMXm7oI6JdHcZU2vux0YKyJNjXXv%2FHwKQ4CDAFqbw3Es3dz8sA7fh2bhMsnGyw1V3PjEDPDk6M2zMKuszaSjfnDg4LLu%2FGcjGNU%2B6lXdhvzrM2rd8E4M5lY5jCXhs7sXzTTzlzfnO2l9vlXyj%2FAw%3D%3D&RelayState=mobile&selectedKeys=email,phone&ssoLoginPage=';
			//每天更新这个key
			config.secretKey = 'YTI1MzFmZTgtMmE2YS00YzZjLTk5ZjctZTc3ODM0MzhiNmNlOzg1O3N1bnp1bmx1';
		} else {
			config.ServerUrl = serverUrl_test;
			config.ServerUrl_Pic = serverUrl_Pic_test;
			config.UpdateFileUrl = udateFileUrl_test;
			config.UpdateFileUrlPad = udateFileUrlPad_test;
			//mock测试用，后期需要替换掉正式接口地址
			config.PCServerUrl = "http://demo.epoint.com.cn:1111/WebBuilderMobileService/appservice/";
			config.MockServerUrl = "http://218.4.136.118:8086/mockjs/110/";
		}
	})(window);
})(window, window.config = {});