(function () {
    // 设置domain，为调用Home打开新的Tab标签
    if (/nxin.com/.test(window.location.host)) {
        document.domain = 'nxin.com';
    } else if (/dbn.cn/.test(window.location.host)) {
        document.domain = 'dbn.cn';
    }
})();