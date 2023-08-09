export class DateTime {
    dateTime: Date = new Date();
    localDate: string;
    localTime: string;
    year: number;
    month: number;
    date: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    constructor(dateTime?: string | Date) {
        if (dateTime && new Date(dateTime).getFullYear().toString() == '1') {
            this.dateTime = null;
        } else {
            if (dateTime) {
                if (typeof dateTime === 'string') {
                    this.dateTime = new Date(dateTime);
                } else {
                    this.dateTime = dateTime;
                }
            }
            this.localDate = this.dateTime.toLocaleDateString();
            this.localTime = this.dateTime.toLocaleTimeString();
            this.year = this.dateTime.getFullYear();
            this.month = this.dateTime.getMonth() + 1;
            this.date = this.dateTime.getDate();
            this.hours = this.dateTime.getHours();
            this.minutes = this.dateTime.getMinutes();
            this.seconds = this.dateTime.getSeconds();
            this.milliseconds = this.dateTime.getMilliseconds();
        }
    }
    /** 格式化输出 */
    toString(format: string = 'yyyy-MM-dd') {
        if (!this.dateTime) {
            return '';
        }
        var o = {
            'M+': this.month, //月份
            'd+': this.date, //日
            'H+': this.hours, //小时
            'h+': this.hours,
            'm+': this.minutes, //分
            's+': this.seconds, //秒
            'q+': Math.floor((this.dateTime.getMonth() + 3) / 3), //季度
            S: this.milliseconds, //毫秒
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.year + '').substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp('(' + k + ')').test(format))
                format = format.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                );
        return format;
    }
    /**
     * 计算两个日期之间相差多少天
     * @param dateEnd 结束日期
     * @param dateBegin 开始日期
     */
    diff(dateEnd: Date, dateBegin: Date) {
        let dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
        let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
        return dayDiff;
    }
    /** 获取随机数 */
    get randomValue() {
        return Math.round(Math.random() * 10 * 1000000);
    }
    //用于生成uuid
    generateUUID() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    guid() {
        return (
            this.generateUUID() +
            this.generateUUID() +
            '-' +
            this.generateUUID() +
            '-' +
            this.generateUUID() +
            '-' +
            this.generateUUID() +
            '-' +
            this.generateUUID() +
            this.generateUUID() +
            this.generateUUID()
        );
    }
    /** 读取excel日期转换 */
    static FromOADate(timespan: number): DateTime {
        var date = new Date();
        date.setTime(Math.round(timespan * 24 * 60 * 60 * 1000) + Date.parse('1899-12-30'));
        return new DateTime(date);
    }
}
