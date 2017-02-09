SrcBoot.output((function() {
    var arr = [];

    arr.push('js/lib/jquery/' + (document.addEventListener ? 'jquery-2.2.3.min.js' : 'jquery-1.11.0.min.js'));

    // 对JSON API进行支持
    if(!window.JSON) {
        arr.push('js/lib/json3.min.js');
    }
    
    arr = arr.concat([
        'js/lib/jquery.cookie.js',
        'js/lib/mustache.js',
        'js/common.js',
        'js/lib/chosen.jquery.min.js'
    ]);
    // 非调试阶段去掉mockjs支持，可以根据实际项目情况进行调整采用本地mock或者mock系统
    if (SrcBoot.debug) {
        arr.push('js/lib/mock/jquery.mockjax.min.js');
        arr.push('js/lib/mock/mock-min.js');

        //自动加载页面对应的test文件
        var pagename = location.href.replace(/(.*\/)*([^.]+).*/ig, "$2");
        arr.push('./_test/test' + pagename + '.js');
    }
    return arr;
}()));
