export function formatDate(mdate, fmt) {
    if (fmt == undefined) {
        fmt = 'yyyy/MM/dd hh:mm:ss'
    }
    if (mdate == '') {
        return ''
    }
    var date = ((mdate + "").replace("T", " ").replace("Z", " ").replace(/-/g, '/'));   //这里处理的时候需要注意 苹果IOS 不支持 2020-12-10 08:12:30  这种形式转换为Date类型 必须转换为 2020/12/10 08:12:30 的形式
    // if (/(y+)/.test(fmt)) {
    //     fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    // }
    // let o = {
    //     'M+': date.getMonth() + 1,
    //     'd+': date.getDate(),
    //     'h+': date.getHours(),
    //     'm+': date.getMinutes(),
    //     's+': date.getSeconds()
    // };
    // for (let k in o) {
    //     if (new RegExp(`(${k})`).test(fmt)) {
    //         let str = o[k] + '';
    //         fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
    //     }
    // }
    return date;
}