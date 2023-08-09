import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, Input, NgModule, OnInit, QueryList } from '@angular/core';
import {
    DxButtonComponent,
    DxButtonModule,
    DxDropDownButtonComponent,
    DxDropDownButtonModule,
} from 'devextreme-angular';

@Component({
    selector: 'toolbar-info-panel',
    templateUrl: './toolbar-info-panel.component.html',
    styleUrls: ['./toolbar-info-panel.component.scss'],
})
export class ToolbarInfoPanelComponent implements OnInit, AfterContentInit {
    @Input()
    infoVisible: boolean = true;
    @Input()
    infoType: 'info' | 'success' | 'error' | 'warning' = 'info';
    @Input()
    infoText: string = '';
    defaultText: () => string;
    @Input()
    defaultType: 'info' | 'success' | 'error' | 'warning' = 'info';
    /** 消息关闭时间 */
    @Input()
    timing: number = 3000;
    /** 定时关闭 */
    _timer;
    @ContentChildren(DxButtonComponent)
    _buttons: QueryList<DxButtonComponent>;
    @ContentChildren(DxDropDownButtonComponent)
    _dropDownButtons: QueryList<DxDropDownButtonComponent>;
    constructor() {}
    ngAfterContentInit(): void {}
    ngOnInit() {}
    info(message) {
        this.infoType = 'info';
        this.infoText = message;
        this._invoke();
    }
    error(message) {
        this.infoType = 'error';
        this.infoText = message;
        this._invoke();
    }
    success(message) {
        this.infoType = 'success';
        this.infoText = message;
        this._invoke();
    }
    warning(message) {
        this.infoType = 'warning';
        this.infoText = message;
        this._invoke();
    }
    default() {
        this.infoType = this.defaultType;
        this.infoText = this.defaultText();
    }
    private _invoke() {
        this._timer = setTimeout(() => {
            this.default();
            this._timer = null;
        }, this.timing);
    }
}

@NgModule({
    declarations: [ToolbarInfoPanelComponent],
    exports: [ToolbarInfoPanelComponent, DxButtonModule, DxDropDownButtonModule],
    imports: [CommonModule],
})
export class ToolbarInfoPanelModule {}
