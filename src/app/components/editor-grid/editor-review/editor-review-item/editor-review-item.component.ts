import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PermissionCodes, ReviewEntity, ReviewOptionType, ReviewTypes } from '../types';

@Component({
    selector: 'editor-review-item',
    templateUrl: './editor-review-item.component.html',
    styleUrls: ['./editor-review-item.component.scss'],
    styles: [
        `
            :host {
                width: 25%;
                text-align: center;
            }
        `,
    ],
})
export class EditorReviewItemComponent implements OnInit {
    /**
     * 审核类型 making-制单 | review-审核 | warehouse-仓库审核 | finance-财务审核
     * @making 制单
     * @review 审核
     * @warehouse 仓库
     * @finance 财务
     */
    @Input()
    type: ReviewTypes;
    @Input()
    _visible: boolean = true;
    /** 名称 */
    _name: string;
    /** 是否已经审核 */
    _reviewed: boolean = false;
    /** 主键 */
    _recordId: any;
    /** 审核事件 */
    reviewEmitter: (option: {
        data: ReviewEntity;
        code: PermissionCodes;
        reviewed: boolean;
        level: number;
    }) => Promise<boolean> = null;
    _reviewOptions: ReviewOptionType = {
        making: { code: PermissionCodes.Making, name: '制单' },
        review: { code: PermissionCodes.Audit, name: '审核' },
        warehouse: { code: PermissionCodes.Track, name: '仓库' },
        finance: { code: PermissionCodes.Finance, name: '财务' },
    };
    _data: ReviewEntity;
    _level: number;
    constructor() {}

    ngOnInit() {}

    map(type: ReviewTypes) {
        if (!this._reviewOptions[type]) {
            console.error('[Editor Review] Input review type not support. check your value.');
            return '--';
        }
        return this._reviewOptions[type].name;
    }
    review() {
        this.reviewEmitter({
            data: this._data || new ReviewEntity(),
            code: this._reviewOptions[this.type].code,
            reviewed: this._reviewed,
            level: this._level,
        }).then(successful => {
            if (successful) {
                this._reviewed = !this._reviewed;
            }
        });
    }
}
