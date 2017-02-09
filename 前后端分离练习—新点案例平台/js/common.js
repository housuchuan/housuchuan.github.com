jQuery.support.cors = true;

//全局变量,配置正式接口时填写
window.global = {
    // serverip: "http://218.206.204.65"
    serverip: "http://218.4.136.118:8086/mockjs/195"
    //serverip: "http://localhost"
};

// 工具方法
(function($) {
    if (!window.Util) {
        window.Util = {};
    }
    /*
     * 序列化表单元素，区别于jQuery 的serialize和serializeArray方法
     */
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $.extend(Util, {
        /* 获取URL地址参数
         * prop:参数名
         */
        getUrlParams: function(prop) {
            var params = {},
                query = location.search.substring(1),
                arr = query.split('&'),
                rt;

            $.each(arr, function(i, item) {
                var tmp = item.split('='),
                    key = tmp[0],
                    val = tmp[1];

                if (typeof params[key] == 'undefined') {
                    params[key] = val;
                } else if (typeof params[key] == 'string') {
                    params[key] = [params[key], val];
                } else {
                    params[key].push(val);
                }
            });
            rt = prop ? params[prop] : params;
            return rt;
        },
        //判断地址是否含有http前缀
        startWith: function(source, target) {
            if (target == null || target == "" || source.length == 0 || target.length > source.length)
                return false;
            if (source.substr(0, target.length) == target)
                return true;
            else
                return false;
            return true;
        },

        // 简单封装ajax
        ajax: function(options) {
            options = $.extend({}, {
                type: 'POST',
                dataType: 'json',
                dataFilter: function(data, type) {
                    if (type == 'json') {
                        data = JSON.parse(data);
                        data = data.UserArea || data;
                        if (typeof data == 'object') {
                            data = JSON.stringify(data);
                        }
                    }
                    return data;
                },
                error: Util._ajaxErr
            }, options);
            //debug调试
			if (SrcBoot.debug) {
                var oldSuccess = options.success;
                options.success = function(data) {
                    data = data.UserArea;
                    if ((oldSuccess && typeof oldSuccess === 'function')) {
                        oldSuccess(data);
                    }
                }
            }
            if (!SrcBoot.debug) {
                var tmpurl = options.url;
                if (!Util.startWith(tmpurl, "http"))
                    options.url = global.serverip + options.url;
                    //console.log("xxx"+ options.url);
            }
//          return $.ajax(options).done(function(data) {
//              var status = data.status;
//              if (status) {
//                  var code = parseInt(status.code),
//                      text = status.text,
//                      url = status.url;
//
//                  if (code >= 300) {
//                      if (url) {
//                          if (url.indexOf('http') !== 0) {
//                              url = SrcBoot.getPath(url);
//                          }
//                          window.location.href = url;
//                      } else {
//                          if (options.fail) {
//                              options.fail.call(this, text, status);
//
//                          } else {
//                              alert(text);
//                          }
//                      }
//                  }
//
//              }
//          });
		return $.ajax(options);
        },

        // 动态加载js
        loadJs: function(url, callback) {
            var script = document.createElement("script");
            script.type = 'text/javascript';

            // IE8-
            if (callback) {
                if (script.readyState) {
                    script.onreadystatechange = function() {
                        if (script.readyState == 'loaded' || script.readyState == 'complete') {

                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                    // w3c
                } else {
                    script.onload = function() {
                        callback();
                        script.onload = null;
                    };
                };
            }

            script.src = SrcBoot.getPath(url);
            // append to head
            document.getElementsByTagName("head")[0].appendChild(script);
        },

        // 动态加载css
        loadCss: function(url) {
            var $link = $('<link/>', {
                href: SrcBoot.getPath(url),
                rel: 'stylesheet',
                type: 'text/css'
            });

            $link.appendTo(document.getElementsByTagName("head")[0]);
        },

        // src: tpl, css, js, callback
        loadPageSrc: function(src) {
            src.css && Util.loadCss(src.css);

            $.ajax({
                type: 'get',
                dataType: 'html',
                url: SrcBoot.getPath(src.tpl),
                success: function(html) {
                    $(html).appendTo('body');

                    Util.loadJs(src.js, src.callback);
                }
            });
        },

        // empty function
        noop: function() { },

        // 去除html标签中的换行符和空格
        clearHtml: function(html) {
            return html.replace(/(\r\n|\n|\r)/g, "")
                .replace(/[\t ]+\</g, "<")
                .replace(/\>[\t ]+\</g, "><")
                .replace(/\>[\t ]+$/g, ">");
        },

        _ajaxErr: function(jqXHR, textStatus, errorThrown) {
            console.error('status: %s, error: %s', textStatus, errorThrown);
        }
    });
}(jQuery));

// 加载共用代码片段
(function($) {
    var Include = function(cfg) {
        this.cfg = cfg;

        this._init();
    };

    Include.prototype = {
        constructor: Include,

        _init: function() {
            var c = this.cfg;

            if (c.async !== false) c.async = true;

            this.$container = $('#' + c.id);
        },

        fetch: function() {
            var c = this.cfg,
                self = this;

            return $.ajax({
                url: SrcBoot.getPath(c.src),
                type: 'GET',
                dataType: 'html',
                async: c.async,
                success: function(html) {
                    self.$container.html(html);

                    c.onload && c.onload(html);
                }
            });
        }
    };

    // 需要引入的代码片段
    var includes = [{
        id: 'header',
        src: 'pages/include/header.inc.html',
        onload: function() {
        	//监听行为事件，并初始化
        	initListener();
        }
    }, {
        id: 'footer',
        src: 'pages/include/footer.inc.html',
        onload: function() {
            console.log('...footer loaded...');
        }
    }];

    $.each(includes, function(i, cfg) {
        if ($('#' + cfg.id).length) {
            new Include(cfg).fetch();
        }
    });

}(jQuery));

(function($) {
    // placeholder
    if (!('placeholder' in document.createElement('input'))) {
        Util.loadJs('js/lib/jquery.placeholder.min.js', function() {
            $('input').placeholder();
        });
    }

    if (window._settings) {
        _settings = $.extend(true, _settings);
    }

}(jQuery));

//tab头样式切换
var initListener = function(){
	var $tab = $('#header-tab'),
		tabarray = ["default","casestore","resourcestore"];
	var currentnav = location.pathname.match(/\/pages\/(.+?)\//)[1];
	//$.inarray(value,array)遍历寻找value值,正确返回序列号，错误返回-1
	var tabindex = $.inArray(currentnav, tabarray);
	if (tabindex < 0) {
		tabindex = 0;
	}else if (tabindex == 2) {
		alert('此模块尚未开通');
	};
	$('>a',$tab).eq(tabindex).addClass('header-active');
};

$(function () {
    $("#TestSelect").chosen({
        disable_search: true
    }).change(function (event, opt) {
        console.log(opt.selected);
    });
    $("#SetValue").click(function () {
        $("#TestSelect").val("2");
        $('#TestSelect').trigger('chosen:updated');
    })
    $("#GetValue").click(function () {
        alert($("#TestSelect").val());
    })

})







