import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, Output, Input, EventEmitter, NgModule, OnInit, ContentChild } from '@angular/core';
import { DxTreeViewModule,DxTabPanelModule,DxDataGridComponent } from 'devextreme-angular';

@Component({
    selector: 'editor-tabs-grid',
    templateUrl: './editor-tabs-grid.component.html',
    styleUrls: ['./editor-tabs-grid.component.scss'],
    styles: [
        `
            :host {
                width: 100%;
                height: 100%;
            }
        `,
    ],
})
export class EditorTabsGridComponent implements OnInit, AfterContentInit {
    @ContentChild(DxDataGridComponent, { static: false })
    _dataGrid: DxDataGridComponent;
    @Input()
    treeview: boolean = false;
    tabIndex: number = 0;
    @Input()
    companies: any = [];
    treeIndex: number = 0;
    @Input()
    products: any = [];
    @Output()
    TabsClick: EventEmitter<any> = new EventEmitter();
    @Output()
    SelectItem: EventEmitter<any> = new EventEmitter();
    constructor() {}
    ngOnInit() {}
    tabsClick(e,i) {
        this.tabIndex = i;
        // console.log(e,'TitleClick')
        this.TabsClick.emit({
            row: e,
            key: i
        })
    }
    selectItem(e,i) {
        this.treeIndex = i;
        // console.log(e.itemData,'selectItem')
        this.SelectItem.emit({
            row: e,
            key: i
        })
    }
    get _tabsStyle() {
        
        return {

        }
    }
    ngAfterContentInit(): void {}
}

@NgModule({
    imports: [CommonModule, DxTreeViewModule, DxTabPanelModule],
    declarations: [EditorTabsGridComponent,],
    exports: [EditorTabsGridComponent],
    entryComponents: [],
})
export class EditorTabsGridModule {}
