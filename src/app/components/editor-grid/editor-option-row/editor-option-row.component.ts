import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, NgModule, OnInit } from '@angular/core';
import { AddDeleteComponent } from './add-delete-row/add-delete-row.component';

@Component({
    selector: 'editor-option-row',
    templateUrl: './editor-option-row.component.html',
    styleUrls: ['./editor-option-row.component.scss'],
})
export class EditorOptionRowComponent implements OnInit, AfterContentInit {
    @ContentChild(AddDeleteComponent, { static: false })
    _addDelete: AddDeleteComponent;
    constructor() {}
    ngAfterContentInit(): void {}
    ngOnInit() {}
}

@NgModule({
    imports: [CommonModule],
    exports: [EditorOptionRowComponent, AddDeleteComponent],
    declarations: [EditorOptionRowComponent, AddDeleteComponent],
})
export class EditorOptionRowModule {}
