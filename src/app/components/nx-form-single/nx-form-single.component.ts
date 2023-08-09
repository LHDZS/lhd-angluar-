import { Component, NgModule, Input } from '@angular/core';
import { NxFormListHeaderPanelModule } from '../nx-form-list-header-panel/nx-form-list-header-panel.component';
import { NxFormSingleModel } from './nx-form-signle.extend';
import { NxFormListModule } from '../nx-zlw-form-list/nx-zlw-form-list.component';

@Component({
    selector: 'nx-form-single',
    templateUrl: './nx-form-single.component.html',
    styleUrls: ['./nx-form-single.component.scss'],
})
export class NxFormSingleComponent {
    constructor() {}
    @Input()
    model: NxFormSingleModel;
    ngOnInit() {}
}

@NgModule({
    imports: [NxFormListModule, NxFormListHeaderPanelModule],
    exports: [NxFormSingleComponent],
    declarations: [NxFormSingleComponent],
})
export class NxFormSingleModule {}
