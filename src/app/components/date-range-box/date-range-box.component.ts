import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, NgModule, OnInit, Output } from '@angular/core';
import { DxButtonModule, DxCalendarModule, DxDateBoxModule, DxPopupModule, DxTextBoxModule } from 'devextreme-angular';
import Guid from 'devextreme/core/guid';

@Component({
    selector: 'date-range-box',
    templateUrl: './date-range-box.component.html',
    styleUrls: ['./date-range-box.component.scss'],
})
export class DateRangeBoxComponent implements OnInit {
    @HostBinding('style.width')
    get getWidth() {
        return this.width ? `${this.width}px` : '100%';
    }
    _calandarPop: boolean = false;
    guid: string = new Guid().toString();
    @Input()
    width: number | string;
    @Input()
    value = [null, null];
    @Input()
    placeholder: string = '请选择日期';
    /** 最大日期 */
    @Input()
    max: Date | string;
    /** 最小日期 */
    @Input()
    min: Date | string;
    @Input()
    format: string = 'yyyy-MM-dd';
    @Output()
    onValueChange = new EventEmitter();
    _textValue = null;
    constructor() {}
    ngOnInit() {}
    _confirm() {
        this.onValueChange.emit(this.value);
        this._calandarPop = false;
    }
    get textValue() {
        let emitValue = [null, null];
        if (this.value && this.value[0]) emitValue[0] = this._dateFromat(this.value[0]);
        if (this.value && this.value[1]) emitValue[1] = this._dateFromat(this.value[1]);
        if (emitValue[0] == null && emitValue[1] == null) {
            this._textValue = '';
        } else {
            this._textValue = `${emitValue[0] || ''} ─ ${emitValue[1] || ''}`;
        }
        return this._textValue;
    }
    _onValueChanged(e, index) {
        if (!e.value) {
            if (index == -1) {
                this.value[0] = null;
                this.value[1] = null;
            } else {
                this.value[index] = null;
            }
        }
    }
    _dateFromat(date: Date, format: string = 'yyyy-MM-dd') {
        var o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 4) / 3), //季度
            S: date.getMilliseconds(), //毫秒
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp('(' + k + ')').test(format))
                format = format.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                );
        return format;
    }
}

@NgModule({
    imports: [
        CommonModule,
        DxTextBoxModule,
        DxCalendarModule,
        DxButtonModule,
        DxTextBoxModule,
        DxPopupModule,
        DxDateBoxModule,
    ],
    exports: [DateRangeBoxComponent],
    declarations: [DateRangeBoxComponent],
})
export class DateRangeBoxModule {}
