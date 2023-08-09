import {
    AfterContentInit,
    Component,
    ComponentFactoryResolver,
    ContentChild,
    ContentChildren,
    Directive,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { EditorGridItemComponent } from '../editor-grid-item/editor-grid-item.component';

@Directive({
    selector: '[anchor]',
})

export class TabContentAnchor {
    constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
    selector: 'editor-grid-tab',
    templateUrl: './editor-grid-tab.component.html',
    styleUrls: ['./editor-grid-tab.component.scss'],
})
export class EditorGridTabComponent implements OnInit, AfterContentInit {
    @ContentChildren(EditorGridItemComponent)
    _items: QueryList<EditorGridItemComponent>;
    /** Tab 内容高度 */
    @Input()
    height: number;
    _current: EditorGridItemComponent;
    @Output()
    onTabChanged: EventEmitter<any> = new EventEmitter();
    @Output()
    onOptionClick: EventEmitter<any> = new EventEmitter();
    constructor() {}
    ngAfterContentInit(): void {
        this._current = this._items.find(m => m.active);
    }

    ngOnInit() {}

    _tabChanged(item: EditorGridItemComponent) {
        this._current.active = false;
        item.active = true;
        this._current = item;
        this.onTabChanged.emit({
            key: this._current.key,
        });
    }
    _onOptionClick(option) {
        this.onOptionClick.emit(option);
    }
}
