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
    ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxCheckBoxModule, DxDateBoxModule, DxNumberBoxModule, DxTextAreaModule, DxButtonModule } from 'devextreme-angular';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxTagBoxModule } from 'devextreme-angular/ui/tag-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';

@Component({
    selector: 'editor-header-grid',
    templateUrl: './editor-header-grid.component.html',
    styleUrls: ['./editor-header-grid.component.scss'],
})
export class EditorHeaderGridComponent implements OnInit, AfterContentInit {
    
    constructor(private _el: ElementRef, private _render: Renderer2) {
      

    }

    ngAfterContentInit(): void {
      
        
    }

    ngOnInit() {
        
    }


}

@NgModule({
    imports: [CommonModule],
    exports: [
        EditorHeaderGridComponent,
        DxSelectBoxModule,
        DxTextBoxModule,
        DxTagBoxModule,
        DxDateBoxModule,
        DxTextAreaModule,
        DxCheckBoxModule,
        DxNumberBoxModule,
        DxButtonModule
    ],
    declarations: [EditorHeaderGridComponent],
})
export class EditorHeaderGridModule {}
