import { Component, ContentChildren, NgModule, OnInit, QueryList } from '@angular/core';
import { ComboxItemComponent } from '../combox-item/combox-item.component';

@Component({
    selector: 'combox-group',
    templateUrl: './combox-group.component.html',
    styleUrls: ['./combox-group.component.scss'],
})
export class ComboxGroupComponent implements OnInit {
    @ContentChildren(ComboxItemComponent)
    _items: QueryList<ComboxItemComponent>;
    constructor() {}

    ngOnInit() {}
}

@NgModule({
    declarations: [ComboxGroupComponent],
    exports: [ComboxGroupComponent],
})
export class ComboxGroupModule {}
