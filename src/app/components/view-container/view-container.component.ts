import { Component, NgModule, OnInit } from '@angular/core';

@Component({
    selector: 'view-container',
    template: "<div class='view-container'><ng-content></ng-content></div>",
    styleUrls: ['./view-container.component.scss'],
})
export class ViewContainerComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}

/** 布局容器 */
@NgModule({
    declarations: [ViewContainerComponent],
    exports: [ViewContainerComponent],
})
export class ViewContainerModule {}
