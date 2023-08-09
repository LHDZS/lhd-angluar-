import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, Input, NgModule, OnInit, QueryList } from '@angular/core';
import { EditorReviewItemComponent } from './editor-review-item/editor-review-item.component';
import { ReviewService } from './service';
import { PermissionCodes, ReviewEntity, ReviewOptions, ReviewSyncApp, ReviewTypes } from './types';

@Component({
    selector: 'editor-review',
    templateUrl: './editor-review.component.html',
    styleUrls: ['./editor-review.component.scss'],
})
export class EditorReviewComponent implements OnInit, AfterContentInit {
    /** 是否开启有序审核 */
    @Input()
    order: boolean = false;
    @Input()
    /** 有序审核顺序 */
    orderly: ReviewTypes[] = [];
    /** 流水号 */
    @Input()
    numericalOrder: string;
    /** 是否同步系统 */
    @Input()
    syncEnable: boolean = false;
    /** 同步设置主键正负值, 仅在syncEnable为true的情况启用 */
    @Input()
    keyMode: 'minus' | 'none' = undefined;
    /** 同步的系统, 仅在syncEnable为true的情况启用 */
    @Input()
    masterApp: ReviewSyncApp;
    /** 审核配置 */
    @Input()
    options: ReviewOptions;
    @ContentChildren(EditorReviewItemComponent)
    _items: QueryList<EditorReviewItemComponent>;
    _data: ReviewEntity[] = [];
    _relationToolbarStatus: (skip: string[]) => void;
    constructor(private _service: ReviewService) {}
    ngAfterContentInit(): void {
        if (this._items && this._items.length > 0) {
            this._items.forEach((m, i) => {
                m.reviewEmitter = this._reviwEmitter.bind(this);
                m._level = i + 1;
            });
        }
    }

    ngOnInit() {}
    get instance() {
        return new EditorReviewInstance(this);
    }
    getReview() {
        if (!this.options) throw new Error('[Editor Review] options is undefined.');
        if (!this.numericalOrder) throw new Error('[Editor Review] numericalOrder value is undefined.');
        if (!this.options.appid) throw new Error('[Editor Review] appid value is undefined.');
        if (!this.options.source) throw new Error('[Editor Review] source value is undefined.');
        if (!this.options.init) throw new Error('[Editor Review] init is not implement.');
        this.options
            .init({
                NumericalOrder: this.numericalOrder,
                ReviweType: this.options.appid,
                Source: this.options.source,
            })
            .then((response) => {
                this._data = response;
                this._items.forEach((m) => {
                    let _ = this._data.find((p) => p.CheckMark == m._reviewOptions[m.type].code);
                    m._data = _;
                    if (_) {
                        m._reviewed = true;
                        m._recordId = _.RecordID;
                        this.options.by(_.CheckedByID).then((value) => {
                            if (value) {
                                m._name = value.name;
                            }
                        });
                    } else {
                        m._reviewed = false;
                        m._recordId = null;
                        m._name = null;
                    }
                    this._relationToolbarStatus(this.options.skipToolbar || []);
                });
            });
    }
    _reviwEmitter(option: { data: ReviewEntity; code: PermissionCodes; reviewed: boolean; level: number }) {
        if (!this.options.review) throw new Error('[Editor Review] review is not implement.');
        return this.options
            .review({
                NumericalOrder: this.numericalOrder,
                ReviweType: this.options.appid,
                Level: option.level,
                CheckMark: option.code,
                CheckedByID: this.options.userId,
                IsAdd: !option.reviewed,
                Source: this.options.source,
                RecordID: option.data.RecordID,
                Sync: {
                    Enable: this.syncEnable,
                    keyMode: this.keyMode,
                    MasterApp: this.masterApp,
                },
            })
            .then((successful) => {
                if (successful) {
                    this.getReview();
                }
                return successful;
            });
    }
}

export class EditorReviewInstance {
    constructor(private _instance: EditorReviewComponent) {}

    /** 初始化审核信息 */
    initialzation() {
        this._instance.getReview();
    }
    /** 获取审核的审核状态 */
    getReviewStatus(type: ReviewTypes) {
        let _ = this._instance._items.find((m) => m.type == type);
        if (_) return _._reviewed;
        else return false;
    }
    getAllReviewStatus() {
        let _ = [];
        this._instance._items.forEach((m) => {
            if (m.type != ReviewTypes.making) {
                _.push(m._reviewed);
            }
        });
        return _;
    }
}

/** 审核组件 */
@NgModule({
    imports: [CommonModule],
    exports: [EditorReviewComponent, EditorReviewItemComponent],
    declarations: [EditorReviewComponent, EditorReviewItemComponent],
    providers: [ReviewService],
})
export class EditorReviewModule {}
