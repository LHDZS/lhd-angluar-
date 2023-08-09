import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, HostBinding, Input, ContentChildren, NgModule, OnInit, QueryList } from '@angular/core';
import { EditorGridItemComponent } from './editor-grid-item/editor-grid-item.component';
import { EditorGridTabComponent, TabContentAnchor } from './editor-grid-tab/editor-grid-tab.component';
import { DxTreeViewModule } from 'devextreme-angular';

@Component({
    selector: 'editor-multiple-grid',
    templateUrl: './editor-multiple-grid.component.html',
    styleUrls: ['./editor-multiple-grid.component.scss'],
    styles: [
        `
            :host {
                width: 100%;
                height: 100%;
            }
        `,
    ],
})
export class EditorMultipleGridComponent implements OnInit, AfterContentInit {
    @ContentChildren(EditorGridTabComponent)
    _tabs: QueryList<EditorGridTabComponent>;
    @Input()
    display: string = '300px';
    // @HostBinding('style.width') get displayHost() {
    //     return this.display;
    // }
    constructor() {}
    ngOnInit() {}
    ngAfterContentInit(): void {}
}

@NgModule({
    imports: [CommonModule,DxTreeViewModule],
    declarations: [EditorMultipleGridComponent, EditorGridItemComponent, EditorGridTabComponent, TabContentAnchor],
    exports: [EditorMultipleGridComponent, EditorGridItemComponent, EditorGridTabComponent],
    entryComponents: [EditorGridItemComponent],
})
export class EditorMultipleGridModule {}
