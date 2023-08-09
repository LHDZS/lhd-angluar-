import { CommonModule } from '@angular/common';
import {
    AfterContentInit,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    NgModule,
    OnInit,
    Output,
    QueryList,
} from '@angular/core';
import { EditorReviewRemoteItemComponent } from './editor-review-remote-item/editor-review-remote-item.component';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenAuthService } from 'src/app/shared/services';

@Component({
    selector: 'editor-review-remote',
    templateUrl: './editor-review-remote.component.html',
    styleUrls: ['./editor-review-remote.component.scss'],
})
export class EditorReviewRemoteComponent implements OnInit, AfterContentInit {
    /** 流水号 */
    @Input()
    editorType: number;
    @Input()
    numericalOrder: string;
    @Input()
    appId: string;
    @Input()
    userId: string;
    /**
     * 同步审核数据到其他数据库
     * - enabled 是否开启同步 true/false
     * - keyMode 正负值, minus - 出库, none - 入库
     * - MasterApp 需要同步的系统: 0 - 全部, 1 - 企联网, 2 - 猪联网, 3 - 羊联网
     */
    @Input()
    sync: { enabled: boolean; keyMode: 'minus' | 'none'; masterApp: number } = {
        enabled: false,
        keyMode: undefined,
        masterApp: undefined,
    };
    @Input()
    load: (data) => Promise<any>;
    /** 有序审核 */
    @Input()
    order: boolean = false;
    /** 审核顺序 */
    @Input()
    orderly: string[] = [];
    @Input()
    operation: (data) => Promise<any>;
    @Output()
    onReviewOptionChanged = new EventEmitter();
    /**
     * - 1 - 企联网
     * - 2 - 猪联网
     * - 3 - 羊联网
     * - 5 - 禽联网
     */
    system: number = 1;
    @Input()
    ConfirmStatus: number;
    @ContentChildren(EditorReviewRemoteItemComponent)
    items: QueryList<EditorReviewRemoteItemComponent>;
    _items: {
        key: 'making' | 'review' | 'warehouse' | 'finance' | any;
        RecordId?: any;
        label: string;
        code: number;
        reviewed: boolean;
        personId?: string;
        personName?: string;
        level: number;
        customizeText?: (info: any) => string;
    }[] = [];
    constructor(private tokenService: TokenAuthService, private http?: HttpClient) {}
    ngAfterContentInit(): void {
        this.items.forEach(m => {
            if (m.customize) {
                this._items.push({
                    key: m.customizeKey,
                    label: m.label,
                    code: m.customizeCode,
                    reviewed: false,
                    level: 0,
                    customizeText: m.customizeText,
                });
            } else {
                switch (m.type) {
                    case 'making':
                        this._items.push({
                            key: 'making',
                            label: m.label || '制单',
                            code: 65536,
                            reviewed: false,
                            level: 0,
                            customizeText: m.customizeText,
                        });
                        break;
                    case 'review':
                        this._items.push({
                            key: 'review',
                            label: m.label || '审核',
                            code: 16,
                            reviewed: false,
                            level: 0,
                            customizeText: m.customizeText,
                        });
                        break;
                    case 'warehouse':
                        this._items.push({
                            key: 'warehouse',
                            label: m.label || '仓库',
                            code: 4069,
                            reviewed: false,
                            level: 0,
                            customizeText: m.customizeText,
                        });
                        break;
                    case 'finance':
                        this._items.push({
                            key: 'finance',
                            label: m.label || '财务',
                            code: 2048,
                            reviewed: false,
                            level: 0,
                            customizeText: m.customizeText,
                        });
                        break;
                    default:
                        break;
                }
            }
        });
    }

    ngOnInit() {
        this._getReviewInfo();
    }
    _onReviewClick(item) {
        this._reviewOperation(item);
    }
    /** 审核/取消审核 */
    _reviewOperation(item: {
        key: 'review' | 'warehouse' | 'finance';
        RecordId?: any;
        label: string;
        code: number;
        reviewed: boolean;
        personId?: string;
        personName?: string;
        level: number;
        customizeText?: (info: any) => string;
    }) {
        // if (this.editorType == 2) {
        //     Notify.warning('请先保存数据，然后再操作');
        //     return 
        // }
        let next = true;
        if (this.order) {
            if (this.orderly && this.orderly.length > 0) {
                let index = this.orderly.indexOf(item.key) + 1;
                if (item.reviewed) {
                    // 取消审核
                    if (this.appId == '2303201441430000150' && this.ConfirmStatus == 1) {
                        next = false;
                        MessageBox.confirm('当前单据养户已确认，您确定要取消审核吗?').then(confirm => {
                            if (confirm) {
                               // 取消审核需要从后往前取消, 如果是最后一级取消不需要验证
                               if (index < this.orderly.length) {
                                console.log("1")
                                // 验证上一级是否已经取消审核
                                    let _before = this._items.find(m => m.key == this.orderly[index]);
                                    if (_before.reviewed) {
                                        Notify.warning(`请先取消 ${_before.label} 的审核`);
                                    } else {
                                        console.log('?????????')
                                        item.level = index;
                                        this.operation({
                                            NumericalOrder: this.numericalOrder,
                                            ReviweType: this.appId,
                                            Level: item.level,
                                            CheckMark: item.code,
                                            CheckedByID: this.userId,
                                            IsAdd: !item.reviewed,
                                            Source: this.system,
                                            RecordID: item.RecordId,
                                            Sync: {
                                                Enable: this.sync.enabled,
                                                keyMode: this.sync.keyMode,
                                                MasterApp: this.sync.masterApp,
                                            },
                                        }).then(result => {
                                            if (result.code == 0) {
                                                this._getReviewInfo();
                                                this.http
                                                .put(`${environment.yhProductionServer}/Settlement/confirm`,{
                                                    NumericalOrder: this.numericalOrder,
                                                    ConfirmStatus: false,
                                                    ConfirmUrl: ''
                                                })
                                                .toPromise()
                                                .then((res: any) => {
                                                })
                                            }
                                        });
                                    }
                               } else {
                                    this.operation({
                                        NumericalOrder: this.numericalOrder,
                                        ReviweType: this.appId,
                                        Level: item.level,
                                        CheckMark: item.code,
                                        CheckedByID: this.userId,
                                        IsAdd: !item.reviewed,
                                        Source: this.system,
                                        RecordID: item.RecordId,
                                        Sync: {
                                            Enable: this.sync.enabled,
                                            keyMode: this.sync.keyMode,
                                            MasterApp: this.sync.masterApp,
                                        },
                                    }).then(result => {
                                        if (result.code == 0) {
                                            this._getReviewInfo();
                                            this.http
                                            .put(`${environment.yhProductionServer}/Settlement/confirm`,{
                                                NumericalOrder: this.numericalOrder,
                                                ConfirmStatus: false,
                                                ConfirmUrl: ''
                                            })
                                            .toPromise()
                                            .then((res: any) => {
                                                if (res.code == 0) {
                                                    this.onReviewOptionChanged.emit({
                                                        items: this._items,
                                                        ConfirmStatus: true
                                                    });
                                                }
                                            })
                                        }
                                    });
                                } 
                            }
                        });
                    } else {
                        // 取消审核需要从后往前取消, 如果是最后一级取消不需要验证
                        if (index < this.orderly.length) {
                            // 验证上一级是否已经取消审核
                            let _before = this._items.find(m => m.key == this.orderly[index]);
                            if (_before.reviewed) {
                                next = false;
                                Notify.warning(`请先取消 ${_before.label} 的审核`);
                            } else {
                                next = true;
                                item.level = index;
                            }
                        }
                    }
                } else {
                    // 审核
                    // 审核从前往后审, 如果是第一级不需要验证
                    if (index > 1) {
                        // 验证上一级是否已经审核
                        let _after = this._items.find(m => m.key == this.orderly[index - 2]);
                        if (_after.reviewed) {
                            next = true;
                            item.level = index;
                        } else {
                            next = false;
                            Notify.warning(`请先审核 ${_after.label}`);
                        }
                    }
                }
            } else {
                console.error(
                    `[Editor Review Remote] You opened the order review, but not set orderly. Please set orderly property.`
                );
                next = false;
            }
        }
        if (this.operation && next) {
            this.operation({
                NumericalOrder: this.numericalOrder,
                ReviweType: this.appId,
                Level: item.level,
                CheckMark: item.code,
                CheckedByID: this.userId,
                IsAdd: !item.reviewed,
                Source: this.system,
                RecordID: item.RecordId,
                Sync: {
                    Enable: this.sync.enabled,
                    keyMode: this.sync.keyMode,
                    MasterApp: this.sync.masterApp,
                },
            }).then(result => {
                if (result.code == 0) {
                    this._getReviewInfo();
                }
            });
        }
    }
    /** 获取审核信息 */
    _getReviewInfo() {
        if (this.numericalOrder&&this.numericalOrder!="0" && this.appId && this.load) {
            return this.load({
                NumericalOrder: this.numericalOrder,
                ReviweType: this.appId,
                Source: this.system,
            }).then((result: { code: number; data: any[]; errors: any[]; msg: string }) => {
                if (result.code == 0 && result.data && result.data.length > 0) {
                    this._items.forEach(m => {
                        let _has = result.data.find(r => r.CheckMark == m.code);
                        if (_has) {
                            m.reviewed = _has.CheckMark == 65536 ? undefined : true;
                            m.personId = _has.CheckedByID;
                            m.personName = m.customizeText ? m.customizeText({ textValue: _has.Name }) : _has.Name;
                            m.RecordId = _has.RecordID;
                        } else {
                            m.reviewed = false;
                            m.personId = undefined;
                            m.personName = undefined;
                            m.RecordId = undefined;
                        }
                    });
                    this.onReviewOptionChanged.emit({
                        items: this._items,
                    });
                } else {
                    console.error(`[Editor Grid Remote Reviw] Remote response data is empty.`);
                }
            });
        } else {
            console.warn(
                '[Editor Grid Remote Review] NumericalOrder or appId is undefined or load function is not implement.'
            );
        }
    }
    get instance() {
        return new EditorReviewRemoteComponentInstance(this);
    }
}
class EditorReviewRemoteComponentInstance {
    constructor(private _component: EditorReviewRemoteComponent) {}

    /** 刷新审核信息 */
    refresh(numericalOrder: string) {
        if (numericalOrder) {
            this._component.numericalOrder = numericalOrder;
            this._component._getReviewInfo();
        } else {
            console.error('[Editor Review Remote] From instance.refersh(); NumericalOrder is undefined.');
        }
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [EditorReviewRemoteComponent, EditorReviewRemoteItemComponent],
    exports: [EditorReviewRemoteComponent, EditorReviewRemoteItemComponent],
})
export class EditorReviewRemoteModule {}
