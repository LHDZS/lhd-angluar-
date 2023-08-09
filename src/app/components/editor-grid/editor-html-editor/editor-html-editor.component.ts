import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, NgModule, OnInit } from '@angular/core';
import { DxHtmlEditorComponent, DxHtmlEditorModule } from 'devextreme-angular';

@Component({
    selector: 'editor-html-editor',
    templateUrl: './editor-html-editor.component.html',
    styleUrls: ['./editor-html-editor.component.scss'],
})
export class EditorHtmlEditorComponent implements OnInit {
    @Input()
    title: string;
    @Input()
    defaultValue: string;
    @ContentChild(DxHtmlEditorComponent, { static: false })
    _editor: DxHtmlEditorComponent;
    constructor() {}

    ngOnInit() {}
}

@NgModule({
    imports: [DxHtmlEditorModule, CommonModule],
    declarations: [EditorHtmlEditorComponent],
    exports: [EditorHtmlEditorComponent, DxHtmlEditorModule],
})
export class EditorHtmlEditorModule {}
