import { Component, Input, OnInit } from '@angular/core';
// import { PermissionCodes } from 'projects/common/src/permission';
import { PermissionCodes } from 'src/app/providers/permission';

@Component({
    selector: 'editor-review-remote-item',
    templateUrl: './editor-review-remote-item.component.html',
    styleUrls: ['./editor-review-remote-item.component.scss'],
})
export class EditorReviewRemoteItemComponent implements OnInit {
    /** 类型 */
    @Input()
    type: 'making' | 'review' | 'warehouse' | 'finance';
    /** 名称 */
    @Input()
    label: string;
    /** 自定义显示值文本 */
    @Input()
    customizeText: () => string;

    @Input()
    customize: boolean = false;
    @Input()
    customizeCode: PermissionCodes;
    @Input()
    customizeKey: string;
    constructor() {}

    ngOnInit() {}
}
