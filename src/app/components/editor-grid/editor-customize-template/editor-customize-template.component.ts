import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';

@Component({
    selector: 'editor-customize-template',
    templateUrl: './editor-customize-template.component.html',
    styleUrls: ['./editor-customize-template.component.scss'],
})
export class EditorCustomizeTemplateComponent implements OnInit {
    @Input()
    title: string;
    constructor() {}

    ngOnInit() {}
}

@NgModule({
    imports: [CommonModule],
    declarations: [EditorCustomizeTemplateComponent],
    exports: [EditorCustomizeTemplateComponent],
})
export class EditorCustomizeTemplateModule {}
