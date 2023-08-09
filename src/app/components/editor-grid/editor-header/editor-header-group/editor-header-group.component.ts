import {
    AfterContentInit,
    Component,
    ContentChildren,
    ElementRef,
    Input,
    OnInit,
    QueryList,
    Renderer2,
    NgModule,
    ViewChild,
    ChangeDetectorRef,
    Inject, forwardRef
} from '@angular/core';

import { EditorHeaderItemComponent } from '../editor-header-item/editor-header-item.component';
import { EditorHeaderComponent } from '../editor-header.component'

@Component({
    selector: 'editor-header-group',
    templateUrl: './editor-header-group.component.html',
    styleUrls: ['./editor-header-group.component.scss'],
})
export class EditorHeaderGroupComponent implements OnInit, AfterContentInit {
    @ContentChildren(EditorHeaderItemComponent)
    _items: QueryList<EditorHeaderItemComponent>;

    @ViewChild('HeaderGroup', { static: false })
    HeaderGroup: ElementRef;
    // 是否显示左侧title
    @Input()
    title: string;
    // 是否显示收起/展开功能
    @Input()
    expressionType: boolean = false;
    @Input()
    expansionNone: boolean = false;
    // 宽度是否100%
    @Input()
    MaxClass: boolean = true;
    // 是否设置dlsplay为flex;
    @Input()
    flex: any = 1;
    // 是否启用Label宽度计算
    @Input()
    widthType: boolean = false;
    //默认收起高度
    @Input()
    defaultHeight: number = 50;
    // label宽度
    @Input()
    labelWidth: string = '65px';
    @Input()
    labelHeight:any = 'auto';
    labelText: any = '收起';
    offsetHeight: string;
    lastNum: number = 0;
    headerItem: any = {
        num: 0,
        width: 0
    };
    widthContrast: any = {
        '100%': 1,
        '50%': 2,
        '33.33%': 3,
        '25%': 4,
        '20%': 5,
        '10%': 10
    }
    constructor(private cd: ChangeDetectorRef, private _el: ElementRef, private _render: Renderer2, @Inject(forwardRef(()=>EditorHeaderComponent)) public _header:EditorHeaderComponent) {
        
    }

    ngAfterContentInit(): void {
      
        
    }

    ngAfterViewInit() {
        
        
    }

    ngOnInit() {
        
    }

    timeVisible() {
        let obj = {
            num: 0,
            width: 0
        }
        let items:any = this._items;
        items.forEach((item, inedx) => {
            if (item.visible) {
                obj.num++
                obj.width += Number(1/this.widthContrast[item.itemWidth])
            }
        });
        obj.width = Math.ceil(obj.width);
        return obj
    }

    expansion() {
        if (this.labelText == '展开') {
            this.labelText = '收起';
            this.labelHeight = this.offsetHeight;
        } else {
            if (this.flex != 1) {
                this.offsetHeight = this.HeaderGroup.nativeElement.offsetHeight + 'px';
            } else {
                this.offsetHeight = 'auto';
            }
            this.labelText = '展开'
            this.labelHeight = this.defaultHeight + 'px';
        }
    }

    get heightTyle() {
        if (this.labelHeight) {
            return {
                width: this.expressionType ? '95%' : '100%',
                height: this.labelHeight,
            };
        }
        return null;
    }

}

