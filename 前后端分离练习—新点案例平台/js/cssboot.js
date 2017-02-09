// 默认第二层为根路径 
// 如localhost/f9 f9即对应项目根目录webapp
var _rootPath = (function() {
    var path = location.pathname;

    if (path.indexOf('/') == 0) {
        path = path.substring(1);
    }

    return '/' + path.split('/')[0];
}());


// ★前端开发目录★，如 var _basePath = _rootPath + '/Project';这里的“Project”根据项目组放置本框架的目录进行更改，为访问路径第二层开始至pages;
var _basePath = _rootPath + '';

var SrcBoot = {
    // 获取资源全路径
    getPath: function(path) {
        // 全路径
        if (/^(http|https|ftp)/g.test(path)) {
            return path;
        }

        // 用于测试本地mockjs测试用例js，约定以_test最为前缀，debug为false时不在页面输出
        if (path.indexOf('_test') != -1 && !this.debug) {
            return false;
        }

        // 是否是相对路径
        var isRelative = path.indexOf('./') != -1 || path.indexOf('../') != -1;

        path = (isRelative ? '' : (_basePath + '/')) + path;

        return path;
    },

    // 获取路径的最后的文件扩展名
    getExt: function(path) {
        if (path.indexOf('?') != -1) {
            path = path.split('?')[0];
        }

        var dotPos = path.lastIndexOf('.'),
			ext = path.substring(dotPos + 1);

        return ext;
    },

    // 批量输出css|js
    output: function(arr) {
        var i = 0,
			len = arr.length,
			path,
			ext;

        for (; i < len; i++) {
            path = this.getPath(arr[i]);

            if (path === false) continue;

            ext = this.getExt(path);
            if (ext == 'js') {
                document.writeln('<script src="' + path + '"></sc' + 'ript>');
            } else {
                document.writeln('<link rel="stylesheet" href="' + path + '">');
            }
        }
    },

    // 这个debug是针对mock测试而言的
    debug: false
};

(function(window) {
    if (!window.Util) {
        window.Util = {};
    }
    Util.getExplorerInfo = function() {
        var explorer = window.navigator.userAgent.toLowerCase();
        //IE
        if (explorer.indexOf("msie") >= 0) {
            var ver = explorer.match(/msie ([\d.]+)/)[1];
            return {
                type: "IE",
                version: ver
            };
        }
            //Firefox
        else if (explorer.indexOf("firefox") >= 0) {
            var ver = explorer.match(/firefox\/([\d.]+)/)[1];
            return {
                type: "Firefox",
                version: ver
            };
        }
            //Chrome
        else if (explorer.indexOf("chrome") >= 0) {
            var ver = explorer.match(/chrome\/([\d.]+)/)[1];
            return {
                type: "Chrome",
                version: ver
            };
        }
            //Opera
        else if (explorer.indexOf("opera") >= 0) {
            var ver = explorer.match(/opera.([\d.]+)/)[1];
            return {
                type: "Opera",
                version: ver
            };
        }
            //Safari
        else if (explorer.indexOf("Safari") >= 0) {
            var ver = explorer.match(/version\/([\d.]+)/)[1];
            return {
                type: "Safari",
                version: ver
            };
        }
            //手机端
        else {
            return {
                type: "phone",
                version: "none"
            };
        }
    }

}(this));

// path从{project}下面开始
SrcBoot.output(['css/common.css']);
SrcBoot.output(['css/chosen.css']);
SrcBoot.output(['css/Style.css']);