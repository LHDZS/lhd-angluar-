import { ViewChild, Component, NgModule } from '@angular/core';
import { DemoConfiguration } from './development.conf';
import { QlwODataContext } from 'src/app/providers/odataContext';
import { INxFormListComponent } from 'src/app/nxin/ui/extensions/web/nx-form-list';
import { NxFormListModule } from 'src/app/nxin/ui/web_components/nx-form-list/nx-form-list.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-development',
    templateUrl: './development.html',
})
export class DevelopmentComponent {
    conf: DemoConfiguration;
    @ViewChild('instance', { static: false })
    private instance: INxFormListComponent;
    constructor(protected qlwODataContext: QlwODataContext) {
        this.conf = new DemoConfiguration(this, qlwODataContext);
    }
}

@NgModule({
    imports: [
        CommonModule,
        NxFormListModule,
        RouterModule.forChild([{ path: '', component: DevelopmentComponent }]),
    ],
    declarations: [DevelopmentComponent],
})
export class DevelopmentModule {}
