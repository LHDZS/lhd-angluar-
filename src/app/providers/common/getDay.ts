export function getDay(num, fmt, date) {
    if (num) {
        if (date) {
            var Millisecond = new Date(date).getTime()
            console.log(Millisecond,'阿这？？？');
        } else {
            var Millisecond = new Date().getTime()
        }
        let dayTime = 1000 * 60 * 60 * 24;
        Millisecond += dayTime * num;

        if (fmt) {
            return formatDate(new Date(Millisecond), fmt)
        } else {
            return formatDate(new Date(Millisecond), 'yyyy-MM-dd')
        }
    } else {
        return formatDate(new Date(), 'yyyy-MM-dd')
    }
};

function formatDate(time, fmt) {
    let date = new Date(time)
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            console.log(str)
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : str);
        }
    }
    return fmt;
};