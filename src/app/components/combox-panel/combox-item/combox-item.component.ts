import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChild,
    ElementRef,
    NgModule,
    OnInit,
    Renderer2,
} from '@angular/core';
import {
    DxDateBoxComponent,
    DxDropDownBoxComponent,
    DxSelectBoxComponent,
    DxTagBoxComponent,
    DxTextBoxComponent,
} from 'devextreme-angular';

@Component({
    selector: 'combox-item',
    templateUrl: './combox-item.component.html',
    styleUrls: ['./combox-item.component.scss'],
    styles: [
        `
            :host {
                width: 33.33%;
            }
        `,
    ],
})
export class ComboxItemComponent implements OnInit, AfterContentInit, AfterViewInit {
    _labelWidth: number;
    _labelRef: any;
    @ContentChild(DxTextBoxComponent, { static: false })
    _textBox: DxTextBoxComponent = null;
    @ContentChild(DxSelectBoxComponent, { static: false })
    _selectBox: DxSelectBoxComponent;
    @ContentChild(DxDateBoxComponent, { static: false })
    _dateBox: DxDateBoxComponent;
    @ContentChild(DxDropDownBoxComponent, { static: false })
    _dropDownBox: DxDropDownBoxComponent;
    @ContentChild(DxTagBoxComponent, { static: false })
    _tagBox: DxTagBoxComponent;
    constructor(private _el: ElementRef, private _render: Renderer2) {}
    ngAfterViewInit(): void {
        this._labelRef = this._el.nativeElement.querySelector('.label');
        this._labelWidth = this._labelRef.offsetWidth;
        let EDITOR = null;
        if (this._textBox) EDITOR = '_textBox';
        if (this._selectBox) EDITOR = '_selectBox';
        if (this._dateBox) EDITOR = '_dateBox';
        if (this._dropDownBox) EDITOR = '_dropDownBox';
        if (this._tagBox) EDITOR = '_tagBox';
        if (EDITOR) {
            this[EDITOR].instance.option('width', '100%');
            // this[EDITOR].instance.option('maxWidth', 220);
            // this[EDITOR].instance.option('minWidth', 120);
        }
    }
    ngAfterContentInit(): void {}
    ngOnInit() {}
    /** 设置Label的宽度 */
    _setLabelWidth(width: number) {
        this._render.setStyle(this._labelRef, 'width', `${width}px`);
    }
}
@NgModule({
    declarations: [ComboxItemComponent],
    exports: [ComboxItemComponent],
})
export class ComboxItemModule {}
