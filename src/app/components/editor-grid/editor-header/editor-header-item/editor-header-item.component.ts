import { Component, ContentChild, ElementRef, ChangeDetectorRef, HostBinding, Input, OnInit, Renderer2, Inject, forwardRef, QueryList } from '@angular/core';
import {
    DxCheckBoxComponent,
    DxDateBoxComponent,
    DxNumberBoxComponent,
    DxSelectBoxComponent,
    DxTagBoxComponent,
    DxTextAreaComponent,
    DxTextBoxComponent,
} from 'devextreme-angular';
import { EditorHeaderGroupComponent } from '../editor-header-group/editor-header-group.component';

@Component({
    selector: 'editor-header-item',
    templateUrl: './editor-header-item.component.html',
    styleUrls: ['./editor-header-item.component.scss'],
    styles: [
        `
            :host {
                flex: 1;
                /* width: 33.33%; */
            }
        `,
    ],
})
export class EditorHeaderItemComponent implements OnInit {
    GroupComponent: QueryList<EditorHeaderGroupComponent>;
    /** 默认值 */
    widthType: boolean;
    @Input()
    defaultValue: any = undefined;
    // 宽度设置
    @Input()
    itemWidth: string = '25%';
    @Input()
    itemWidthMax: boolean = false;
    MaxClass: boolean;
    flex: any;
    labelWidth: string;
    @Input()
    itemLabelWidth: string = null;
    @HostBinding('style.width') get widthHost() {
        return this.itemWidth;
    }
    @HostBinding('style.flex') get flexHost() {
        return this.flex;
    }
    // 是否显示label下方小字
    @Input()
    text: boolean = false;
    // 设置高度
    @Input()
    height: string = '50px';
    // 显示隐藏
    @Input()
    visible: boolean = true;

    @Input()
    labelVisible: boolean = true;
    @HostBinding('style.height') get heightHost() {
        return this.height;
    }
    @HostBinding('style.display') get displayHost() {
        return this.visible ? 'block' : 'none';
    }
    _labelWidth: number;
    _labelRef: any;
    @ContentChild(DxTextBoxComponent, { static: false })
    _textBox: DxTextBoxComponent;
    @ContentChild(DxSelectBoxComponent, { static: false })
    _selectBox: DxSelectBoxComponent;
    @ContentChild(DxDateBoxComponent, { static: false })
    _dateBox: DxDateBoxComponent;
    @ContentChild(DxTagBoxComponent, { static: false })
    _tagBox: DxTagBoxComponent;
    @ContentChild(DxTextAreaComponent, { static: false })
    _textArea: DxTextAreaComponent;
    @ContentChild(DxCheckBoxComponent, { static: false })
    _checkBox: DxCheckBoxComponent;
    @ContentChild(DxNumberBoxComponent, { static: false })
    _numberBox: DxNumberBoxComponent;
    loaded: boolean = false;
    _changed: boolean = false;
    constructor(private cd: ChangeDetectorRef, private _el: ElementRef, private _render: Renderer2, @Inject(forwardRef(()=>EditorHeaderGroupComponent)) public parent:EditorHeaderGroupComponent) {
    
        
    }


    ngAfterViewInit(): void {
        this._labelRef = this._el.nativeElement.querySelector('.label');
        this._labelWidth = this._labelRef.offsetWidth;
        setTimeout(() => {
            this.MaxClass = this.parent.MaxClass;
            this.flex = (this.itemWidth && this.itemWidth != 'auto') ? 'none' : this.parent.flex;
            this.widthType = this.parent.widthType;
            this.labelWidth = this.itemLabelWidth || this.parent.labelWidth;
        }, 0);
    }
    ngAfterContentInit(): void {}
    ngOnInit() {
        
    }
    /** 设置Label的宽度 */
    _setLabelWidth(width: number) {
        if (this.widthType) {
            return
        }
        width = width === 0 ? 65 : width;
        this._render.setStyle(this._labelRef, 'width', `${width}px`);
    }
    _loadedChange(change: boolean) {
        this.loaded = change;
    }
    get _editorStyle() {
        if (this.itemWidth == '100%' || this.itemWidthMax) {
            return {
                maxWidth: '100%',
                width: '100%',
            };
        }
        return null;
    }
    get _labelStyle() {
        if (this.labelWidth) {
            return {
                width: this.labelWidth,
            };
        }
        return null;
    }
    get _itemStyle() {
        if (this.text) {
            return {
                lineHeight: '25px',
            };
        }
        return {
            lineHeight: '50px',
        };
    }
}
