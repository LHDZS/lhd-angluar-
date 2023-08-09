import { Component, OnInit, NgModule, Input } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { QlwODataContext } from 'src/app/providers/odataContext';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { Notify, NotifyType } from 'src/app/providers/notify';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { TokenAuthService } from 'src/app/shared/services';
import { PermissionService, PermissionCodes } from 'src/app/providers/permission';
import { NxReview, ReviewStatus } from './review.extend';
import { DataValidation } from 'src/app/providers/validation';
import { NxTranslateI18N, NxTranslateModule } from 'src/app/nxin/i18n';
import { TranslateService } from 'src/app/providers/i18n-translate';

@Component({
    selector: 'nx-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.css'],
})
export class NxReviewComponent implements OnInit {
    auditDisplayText = NxTranslateI18N.I18N.commandOptions.examine.text;
    cancelAuditDisplayText = NxTranslateI18N.I18N.commandOptions.examine.cancel;
    warehouseText = this.translator.I18N.commonColumns.warehouse.text;
    financeText = this.translator.I18N.commonColumns.finance.text;
    constructor(
        private http: HttpClient,
        private qlwODataContext: QlwODataContext,
        private tokenService: TokenAuthService,
        private translator: TranslateService
    ) { }
    /**
     * 审核人
     */
    reviewer: Reviwer = {};
    /**
     * 财务审核人
     */
    financeReviewer: Reviwer = {
        IsAdd: true,
    };
    /**
     * 仓库审核人
     */
    warehouseReviewer: Reviwer = {
        IsAdd: true,
    };
    /**
     * 制单人
     */
    creator: string;
    /**
     * 制单码
     */
    makingCode: number = PermissionCodes.Making;
    /**
     * 审核码
     */
    reviewCode: number = PermissionCodes.Audit;
    /**
     * 财务码
     */
    financeCode: number = PermissionCodes.Finance;
    /**
     * 仓库码
     */
    warehouseCode: number = PermissionCodes.Track;
    reviewData: any;
    permission: PermissionService = new PermissionService();
    /** 当前审核状态 */
    reviewedLevelOrder: boolean[] = [];
    @Input() model: NxReview;
    ngOnInit() {
        // this.permission.refresh(this.tokenService.getTokenData.permissions);
        // 获取实时权限
        this.getPermissionCode();
        if (DataValidation.isEmpty(this.model)) {
            throw new Error('review component model is not defined.');
        }
        if (DataValidation.isEmpty(this.model.numericalOrder)) {
            throw new Error('numericalOrder is not defined.');
        }
        this.getReviewInfo();
    }
    /**
     * 审核
     */
    review(options, code) {
        let checkMark = -1;
        let level = 0;
        // isAdd true是审核 / false 是取消审核
        let isAdd = true;
        let recordId = -1;
        switch (options) {
            // 审核
            case 'review':
                checkMark = PermissionCodes.Audit;
                level = this.model.levelOrder.indexOf(PermissionCodes.Audit) + 1;
                isAdd = this.reviewer.IsAdd;
                recordId = this.reviewer.RecordID;
                break;
            // 财务审核
            case 'finance':
                checkMark = PermissionCodes.Finance;
                level = this.model.levelOrder.indexOf(PermissionCodes.Finance) + 1;
                isAdd = this.financeReviewer.IsAdd;
                recordId = this.financeReviewer.RecordID;
                break;
            // 仓库审核
            case 'warehouse':
                checkMark = PermissionCodes.Track;
                level = this.model.levelOrder.indexOf(PermissionCodes.Track) + 1;
                isAdd = this.warehouseReviewer.IsAdd;
                recordId = this.warehouseReviewer.RecordID;
                break;
            default:
                break;
        }
        if (!this.model.numericalOrder) {
            return;
        }
        let allow = true;
        // 有序审核 - 审核
        if (!this.model.disorder) {
            // 审核
            if (isAdd) {
                // 定位是第几级
                let orderIndex = this.model.levelOrder.indexOf(code);
                if (orderIndex > -1) {
                    for (let i = 0; i < this.model.levelOrder.length; i++) {
                        // 验证前面几级是否都已经审核
                        if (i == orderIndex) {
                            break;
                        }
                        // 跳过制单条件验证
                        if (this.model.levelOrder[i] == this.makingCode) {
                            continue;
                        }
                        if (!this.reviewedLevelOrder[i]) {
                            allow = false;
                            Notify.toast(this.translator.I18N.commonColumns.auditControll.text, NotifyType.Warning);
                            break;
                        }
                    }
                }
            } else {
                // 取消审核
                let orderIndex = this.model.levelOrder.indexOf(code);
                if (orderIndex < this.model.levelOrder.length) {
                    for (let i = this.model.levelOrder.length - 1; i > 0; i--) {
                        if (i == orderIndex) {
                            break;
                        }
                        if (this.model.levelOrder[i] == this.makingCode) {
                            continue;
                        }
                        if (this.reviewedLevelOrder[i]) {
                            allow = false;
                            Notify.toast(this.translator.I18N.commonColumns.cancelAudit.text, NotifyType.Warning);
                            break;
                        }
                    }
                }
            }
        }
        if (!allow) return;
        if (this.model.onStartReview) {
            let isReview = this.model.onStartReview();
            if (!isReview) {
                Notify.toast(NxTranslateI18N.I18N.dataGridOptions.review.saveDataAfter, NotifyType.Warning);
                return;
            }
        }
        if(USER_INFO_CONTEXT.menuId=="2208091311370000109"){
            this._allowReview().then((allow) => {
                if (allow) {
                    console.log("----------------------------------------");
                    this.http
                        .post(`${environment.poultryProductionServer}/ZqBiosafetyReviwe`, {
                            // 流水号
                            NumericalOrder: this.model.numericalOrder.split(","),
                            // 菜单ID
                            ReviweType: USER_INFO_CONTEXT.menuId,
                            // 审核级次
                            Level: level,
                            // 权限
                            CheckMark: checkMark,
                            // 审核人
                            CheckedByID: this.tokenService.getTokenData.user_id,
                            IsAdd: isAdd,
                            Source: environment.review.source,
                            RecordID: recordId,
                            Sync: {
                                Enable: this.model.sync.enable,
                                keyMode: this.model.sync.keyMode,
                                MasterApp: this.model.sync.masterApp,
                            },
                        })
                        .toPromise()
                        .then((result: Result) => {
                            this.response(result);
                        });
                } else {
                    Notify.toast(NxTranslateI18N.I18N.dataGridOptions.review.noPermission, NotifyType.Error);
                }
            });
        }else{
            this._allowReview().then((allow) => {
                if (allow) {
                    this.http
                        .post(environment.review.reviewOperate, {
                            // 流水号
                            NumericalOrder: this.model.numericalOrder,
                            // 菜单ID
                            ReviweType: USER_INFO_CONTEXT.menuId,
                            // 审核级次
                            Level: level,
                            // 权限
                            CheckMark: checkMark,
                            // 审核人
                            CheckedByID: this.tokenService.getTokenData.user_id,
                            IsAdd: isAdd,
                            Source: environment.review.source,
                            RecordID: recordId,
                            Sync: {
                                Enable: this.model.sync.enable,
                                keyMode: this.model.sync.keyMode,
                                MasterApp: this.model.sync.masterApp,
                            },
                        })
                        .toPromise()
                        .then((result: Result) => {
                            this.response(result);
                        });
                } else {
                    Notify.toast(NxTranslateI18N.I18N.dataGridOptions.review.noPermission, NotifyType.Error);
                }
            });
        }
    }
    response(result) {
        const response = ResponseSuccess.handle(result);
        if (response.status) {
            // 审核成功后重新获取审核信息
            this.getReviewInfo();
        } else {
            Notify.toast(response.message, NotifyType.Error);
        }
    }
    getReviewInfo() {
        // 初始化审批条
        // 重新设置审核状态
        if (!this.model.disorder) {
            this.reviewedLevelOrder = [];
            this.model.levelOrder.forEach(() => {
                this.reviewedLevelOrder.push(false);
            });
        }
        this.http
            .post(environment.review.review, {
                NumericalOrder: this.model.numericalOrder,
                ReviweType: USER_INFO_CONTEXT.menuId,
                Source: environment.review.source,
            })
            .toPromise()
            .then((result) => {
                if (result['data']) {
                    // 获取审核数据源
                    this.reviewData = result['data'];
                    if (this.reviewData.length > 0) {
                        let reviewed = false;
                        for (let i = 0; i < this.reviewData.length; i++) {
                            if (
                                this.reviewData.length == 1 &&
                                this.reviewData[i]['CheckMark'] == PermissionCodes.Making
                            ) {
                                this._setWaitReviewStatus();
                                break;
                            }
                            // 制单信息
                            if (this.reviewData[i]['CheckMark'] == PermissionCodes.Making && !this.model.disorder) {
                                let _makingIndex = this.model.levelOrder.indexOf(PermissionCodes.Making);
                                if (_makingIndex > -1) {
                                    this.reviewedLevelOrder[_makingIndex] = true;
                                }
                            }
                            // 审核信息
                            if (this.reviewData[i]['CheckMark'] == PermissionCodes.Audit) {
                                if (!this.model.disorder) {
                                    let _auditIndex = this.model.levelOrder.indexOf(PermissionCodes.Audit);
                                    if (_auditIndex > -1) {
                                        this.reviewedLevelOrder[_auditIndex] = true;
                                    }
                                }
                                if (!reviewed && this.model.status != ReviewStatus.reviewed) {
                                    this.model.status = ReviewStatus.reviewed;
                                    if (this.model.onReviewSuccess) {
                                        this.model.onReviewSuccess(this.model.status, false);
                                    }
                                    reviewed = true;
                                }
                                this.qlwODataContext.personODataStore
                                    .byKey(this.reviewData[i]['CheckedByID'])
                                    .then((value) => {
                                        this.model.status =
                                            this.reviewData[i]['IsAdd'] == false
                                                ? ReviewStatus.reviewed
                                                : ReviewStatus.waitReview;
                                        this.reviewer = {
                                            CheckedByID: this.reviewData[i]['CheckedByID'],
                                            CheckedByName: value[0]['PersonName'],
                                            Level: this.reviewData[i]['Level'],
                                            IsAdd: this.reviewData[i]['IsAdd'],
                                            RecordID: this.reviewData[i]['RecordID'],
                                        };
                                        this.model.reviewName = value[0]['PersonName'];
                                    });
                            } else {
                                this.reviewer = {
                                    IsAdd: true,
                                    Level: this.model.levelOrder.indexOf(this.reviewCode) + 1,
                                    RecordID: -1,
                                };
                                this.model.reviewName = '';
                            }
                            // 财务审核信息
                            if (this.reviewData[i]['CheckMark'] == PermissionCodes.Finance) {
                                if (!this.model.disorder) {
                                    let _financeIndex = this.model.levelOrder.indexOf(PermissionCodes.Finance);
                                    if (_financeIndex > -1) {
                                        this.reviewedLevelOrder[_financeIndex] = true;
                                    }
                                }
                                if (!reviewed) {
                                    this.model.status = ReviewStatus.reviewed;
                                    if (this.model.onReviewSuccess) {
                                        this.model.onReviewSuccess(this.model.status, false);
                                    }
                                    reviewed = true;
                                }
                                this.qlwODataContext.personODataStore
                                    .byKey(this.reviewData[i]['CheckedByID'])
                                    .then((value) => {
                                        // this.model.status =
                                        //     this.reviewData[i]['IsAdd'] == false
                                        //         ? ReviewStatus.reviewed
                                        //         : ReviewStatus.waitReview;
                                        this.financeReviewer = {
                                            CheckedByID: this.reviewData[i]['CheckedByID'],
                                            CheckedByName: value[0]['PersonName'],
                                            Level: this.reviewData[i]['Level'],
                                            IsAdd: this.reviewData[i]['IsAdd'],
                                            RecordID: this.reviewData[i]['RecordID'],
                                        };
                                        this.model.financeReviewName = value[0]['PersonName'];
                                    });
                            } else {
                                this.financeReviewer = {
                                    IsAdd: true,
                                    Level: this.model.levelOrder.indexOf(this.financeCode) + 1,
                                    RecordID: -1,
                                };
                                this.model.financeReviewName = '';
                            }
                            // 仓库审核信息
                            if (this.reviewData[i]['CheckMark'] == PermissionCodes.Track) {
                                if (!this.model.disorder) {
                                    let _warehouseIndex = this.model.levelOrder.indexOf(PermissionCodes.Track);
                                    if (_warehouseIndex > -1) {
                                        this.reviewedLevelOrder[_warehouseIndex] = true;
                                    }
                                }
                                if (!reviewed) {
                                    this.model.status = ReviewStatus.reviewed;
                                    if (this.model.onReviewSuccess) {
                                        this.model.onReviewSuccess(this.model.status, false);
                                    }
                                    reviewed = true;
                                }
                                this.qlwODataContext.personODataStore
                                    .byKey(this.reviewData[i]['CheckedByID'])
                                    .then((value) => {
                                        this.warehouseReviewer = {
                                            CheckedByID: this.reviewData[i]['CheckedByID'],
                                            CheckedByName: value[0]['PersonName'],
                                            Level: this.reviewData[i]['Level'],
                                            IsAdd: this.reviewData[i]['IsAdd'],
                                            RecordID: this.reviewData[i]['RecordID'],
                                        };
                                        this.model.warehouseReviewName = value[0]['PersonName'];
                                    });
                            } else {
                                this.warehouseReviewer = {
                                    IsAdd: true,
                                    Level: this.model.levelOrder.indexOf(this.warehouseCode) + 1,
                                    RecordID: -1,
                                };
                                this.model.warehouseReviewName = '';
                            }
                        }
                    } else {
                        this._setWaitReviewStatus();
                    }
                }
            });
    }
    /**
     * 设置为未审核状态
     */
    private _setWaitReviewStatus() {
        let makingIndex = this.model.levelOrder.indexOf(PermissionCodes.Making);
        this.reviewedLevelOrder[makingIndex] = true;
        this.model.status = ReviewStatus.waitReview;
        if (this.model.onReviewSuccess) {
            this.model.onReviewSuccess(this.model.status, true);
        }
        this.reviewer = {
            IsAdd: true,
            Level: this.model.levelOrder.indexOf(this.reviewCode) + 1,
            RecordID: -1,
        };
        this.model.reviewName = '';
        this.financeReviewer = {
            IsAdd: true,
            Level: this.model.levelOrder.indexOf(this.financeCode) + 1,
            RecordID: -1,
        };
        this.model.financeReviewName = '';
        this.warehouseReviewer = {
            IsAdd: true,
            Level: this.model.levelOrder.indexOf(this.warehouseCode) + 1,
            RecordID: -1,
        };
        this.model.warehouseReviewName = '';
    }
    getPermissionCode() {
        this.tokenService.requestToken().then(d => { this.permission.refresh(this.tokenService.getTokenData.permissions); });
    }
    /**
     * 获取审核状态,true为已审核,false为未审核
     */
    get reviewStatus() {
        return !this.reviewer.IsAdd;
    }
    private _allowReview(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            // 获取最新的权限
            this.tokenService.requestToken().then(d => {
                this.permission.refresh(this.tokenService.getTokenData.permissions);
                // 验证是否有审核权限，没有审核权限无法看到审核按钮  √
                // 审核后无法修改数据  √
                // 主管权限可以不需要判断审核权限 √
                // 有审核权限就可以审核 √
                // 无主管权限且不是审核人无法取消审核 √
                let allowReview = false;
                // 当前登录人没有主管权限时
                if (!this.permission.$$manager) {
                    // 验证是否有审核权限，有审核权限就可以审核或取消审核
                    if (this.permission.$$audit) {
                        // 验证单据是否已经审核
                        if (this.reviewStatus) {
                            // 已审核判断是否和审核人一致
                            if (this.tokenService.getTokenData.user_id == this.reviewer.CheckedByID) {
                                // 一致可以取消审核
                                allowReview = true;
                            } else {
                                // 不一致无法取消审核
                                allowReview = false;
                            }
                        } else {
                            // 未审核单据可以进行审核
                            allowReview = true;
                        }
                    } else {
                        allowReview = false;
                        return;
                    }
                } else {
                    // 当前登录人是主管可以审核/取消审核
                    allowReview = true;
                }
                resolve(allowReview);
            });
        });
    }
}

@NgModule({
    imports: [CommonModule, DxButtonModule, NxTranslateModule],
    declarations: [NxReviewComponent],
    exports: [NxReviewComponent],
})
export class NxReviewModule { }

class Reviwer {
    CheckedByID?: string;
    CheckedByName?: string;
    Level?: number;
    IsAdd?: boolean;
    RecordID?: number;
}

type ReviewOrderType = {
    [code: number]: Boolean;
};
