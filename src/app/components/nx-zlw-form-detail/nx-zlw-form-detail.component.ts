import { Component, NgModule, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxToolbarPanelModule, NxToolbarPanelComponent } from '../toolbar-panel/toolbar-panel.component';
import { NxFormListModule, NxFormListComponent } from '../nx-zlw-form-list/nx-zlw-form-list.component';
import { NxSearchPanelModule, NxSearchPanelComponent } from '../search-panel/search-panel.component';
import { NxFormDetail } from './nx-zlw-form-detail-extend';
import { ActivatedRoute } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { DataStatus, FormOptions } from 'src/app/providers/enums';
import { NxDateBox } from '../component-model/date-box/model';
import { NxButton } from '../component-model/button/model';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { NxDropDownButton } from '../component-model/drop-down-button/model';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { Notify, NotifyType } from 'src/app/providers/notify';
import { NxSelectBox } from '../component-model/select-box/model';
import { NxTextBox } from '../component-model/text-box/mode';
import { PermissionService } from 'src/app/providers/permission';
import { TokenAuthService } from 'src/app/shared/services';
import { NxReviewModule, NxReviewComponent } from '../review/review.component';
import { ReviewStatus } from '../review/review.extend';
import { DateTime } from 'src/app/providers/common/datetime';
import { RXJSService } from 'src/app/shared/services/RXJSService';
import { DxSpeedDialActionModule } from 'devextreme-angular/ui/speed-dial-action';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';
import { SafeHtmlModule } from 'src/app/providers/pipes/safe-html.pipe';
import { NxTranslateI18N, NxTranslateModule } from 'src/app/nxin/i18n';
import { ColumnSetting } from '../toolbar-panel/toolbar-panel-extend';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';
import {
    DxButtonModule,
    DxDataGridComponent,
    DxDataGridModule,
    DxLoadPanelModule,
    DxTabPanelModule,
    DxTextBoxModule,
    DxDropDownBoxModule,
    DxTreeViewModule,
} from 'devextreme-angular';
import { TranslateModule, TranslateService } from 'src/app/providers/i18n-translate';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataValidator } from 'src/app/providers/common/dataValidator';
import { NxNumberBox } from '../component-model/number-box/mode';

@Component({
    selector: 'nx-zlw-form-detail',
    templateUrl: './nx-zlw-form-detail.component.html',
    styleUrls: ['./nx-zlw-form-detail.component.scss'],
})
export class NxZlwFormDetailComponent {
    messageBoxDisplayText = NxTranslateI18N.I18N.messageBox.text;
    notMessageDisplayText = NxTranslateI18N.I18N.messageBox.noMessage;
    @Input()
    model: NxFormDetail;
    @ViewChild('toolbarPanel', { static: false })
    toolbarPanel: NxToolbarPanelComponent;
    @ViewChild('searchPanel', { static: false })
    searchPanel: NxSearchPanelComponent;
    @ViewChild('dataGrid', { static: false })
    dataGrid: NxFormListComponent;
    @ViewChild('review', { static: false })
    reviewInstance: NxReviewComponent;
    @ViewChild('headDataGrid', { static: false })
    _headDataGrid: DxDataGridComponent;
    @ViewChild('columnDataGrid', { static: false })
    _columnDataGrid: DxDataGridComponent;
    $open: FormOptions;
    private $index: number;
    private $size: number;
    private $rowIndex: number;
    private $count: number;
    private $visibles: number;
    private $saveCtl: boolean = false;
    private $deleteCtl: boolean = false;
    private $remarkInit: boolean = false;
    private defaultEmptyCount: number = 1;
    private totalAddRows: number;
    isReview: boolean = false;
    isRightReview: boolean = false;
    isAddRightReview: boolean = true;
    cacheSearchData: any;
    cacheBodyData: any;
    permission: PermissionService = new PermissionService();
    /**
     * 数据源
     */
    $dataSource: DataSource;
    messageBoxVisible: boolean = false;
    messageBoxInfo: string[] = [];
    lang: string = NxTranslateI18N.lang;

    columnSettingArr: any[] = [];
    columnOid: string;
    saveStatus: boolean = true;
    loading: boolean = false;

    @Input() detailModel:any = {};
    isFirstLoading: boolean;
    _id: string;
    constructor(
        private route: ActivatedRoute,
        private tokenService: TokenAuthService,
        private rxService: RXJSService,
        private http: HttpClient,
        private translator: TranslateService
    ) {
        this.reviewValidation = this.reviewValidation.bind(this);
        this.onReorder = this.onReorder.bind(this);
        this.onColumnReorder = this.onColumnReorder.bind(this);
    }

    detailExport(option) {
        this.dataGrid.exportExcel(option)
    }

    // 弹出框数据读取
    customStateStoringLoad() {
        // console.log(this.detailModel,'this.detailModel',this.model)
        this.http
            .get(`${environment.qlwAssem}/settings?page_index=0&page_size=999&key=${this.detailModel.storageKey}`)
            .toPromise()
            .then((res: any) => {
                if (res && res.data) {
                    this.detailModel.gridRefColumns = res.data.items[0].value;
                    this._id =  res.data.items[0]._id.$oid
                } else {
                    return;
                }  
            })
            .catch((err) => {
                
            });
    }
    //弹出框数据存储
    customStateStoringSave(state) {
        // if (this.model.stateStoring.storageKey.indexOf('detail') >= 0 && !this.makingPermission.$$making) return;
        if (state.columns && state.columns.length > 0) {
            state.pageIndex = 0;
            state.searchText = '';
            state.selectedRowKeys = [];
            state.columns.map((m) => {
                if (m['filterValue'] != undefined || m['filterValue'] != null) {
                    m['filterValue'] = undefined;
                }
                if (m['filterValues']) {
                    m['filterValues'] = [];
                }
                if (m['selectedFilterOperation']) {
                    m['selectedFilterOperation'] = undefined;
                }
            });
            try {
                //存后端
                if (!this.isFirstLoading) {
                    // if (this.detailModel.storageKey.indexOf('detail') >= 0) {
                        let params = this.getRequestParamsWithCustumComponent(state.columns);
                        this.http.put(`${environment.qlwAssem}/setting`, params).toPromise().then((res: any) => {
                            if (res && res.data) {
                                this._id =  res.data._id.$oid
                            }
                        })
                    // } else {
                    //     let params = {
                    //         columns: state.columns,
                    //         moduleKey: this.detailModel.storageKey
                    //     };
                    //     this.http.post(`${environment.qlwCommonService}/component`, params).toPromise();
                    // }
                }
                this.isFirstLoading = false;
            } finally {
                //存前端
                localStorage.setItem(`${this.detailModel.storageKey}`, JSON.stringify(state));
            }
        }

    }
    //t弹出框数据处理
    getRequestParamsWithCustumComponent(c) {
        let columns = [];
        this.detailModel.gridRefColumns.map((item, index) => {
            let nativeCol = c.filter((m) => m.dataField == item.dataField);
            columns.push({
                caption: item.caption,
                dataField: nativeCol.length > 0 ? nativeCol[0].dataField : item.dataField,
                dataType: nativeCol.length > 0 ? nativeCol[0].dataType : item.dataType,
                fixed: nativeCol.length > 0 ? nativeCol[0].fixed : item.fixed,
                visible: nativeCol.length > 0 ? nativeCol[0].visible : item.visible,
                width: nativeCol && nativeCol.length > 0 ? nativeCol[0].width : item.width,
                allowEditing: item.allowEditing,
                calculateDisplayValue: item.calculateDisplayValue,
                lookupData: item.lookupData,
                displayExpr: item.displayExpr,
                valueExpr: item.valueExpr,
                dataSource: item.dataSource,
                alignment: item.alignment,
                editorOptions: item.editorOptions,
                precision: item.precision,
                showCaption: item.showCaption || '',
                HeaderRequiredIcon: item.HeaderRequiredIcon || '',
                HeaderDisabledIcon: item.HeaderDisabledIcon,
                requiredDisable: item.requiredDisable,
                captionDisable: item.captionDisable,
                cellTemplate: item.cellTemplate,
                showIndex: nativeCol.length > 0 ? nativeCol[0].visibleIndex : index,
            });
            item.width = columns[index].width;
        });
        columns.sort((a, b) => {
            return a.showIndex - b.showIndex;
        });
        var data = {
            key: this.detailModel.storageKey,
            value: columns,
        };
        if (this._id) {
            data['_id'] = { $oid: this._id };
        }
        return data;
    }


    protected ngOnDestroy() {
        // this.rxService.unSubscribe();
    }
    protected ngOnInit() {
        this.initialSettings();
        // 设置工具条的初始状态
        // this.model.toolbar.getWidgetByKey('prev').props.disabled = this.$allowPrev;
        // this.model.toolbar.getWidgetByKey('next').props.disabled = this.$allowNext;
        this.tokenService.getPermission().then((res) => {
            this.permission.refresh(res.permissions);
            this.rxService.publish(this.permission);
            if (!this.permission.$$manager) {
                let savebutton = <NxButton>this.model.toolbar.getWidgetByKey('save');
                if (savebutton.props.visible) {
                    savebutton.props.visible = this.permission.$$edit;
                }
                let delButton = <NxButton>this.model.toolbar.getWidgetByKey('delete');
                if (delButton.props.visible) {
                    delButton.props.visible = this.permission.$$delete;
                }
                let createButton = <NxButton>this.model.toolbar.getWidgetByKey('create');
                if (createButton.props.visible) {
                    createButton.props.visible = this.permission.$$add;
                }
                let cancelButton = <NxButton>this.model.toolbar.getWidgetByKey('cancel');
                if (savebutton.props.visible) {
                    cancelButton.props.visible = true;
                } else {
                    cancelButton.props.visible = false;
                }
            }
        });
        this.model.review.onReviewSuccess = this.onReviewSuccess.bind(this);
        this.model.review.onStartReview = this.onStartReview.bind(this);
        this.openCheck(
            () => {
                this.createDataStatus(null);
            },
            () => {
                this.$allowSave = false;
                this.model.dataGrid.editing.allowUpdating = true;
                (<NxButton>this.model.toolbar.getWidgetByKey('create')).props.disabled = false;
                (<NxButton>this.model.toolbar.getWidgetByKey('save')).props.disabled = this.$allowSave;
                (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).props.disabled = this.$allowSave;
                this.$deleted = false;
                this.$open = FormOptions.$modify;
                this.model.toolbar.getWidgetByKey('delete').props.disabled = false;
            }
        );
        if (this.model.initialization) {
            this.model.initialization(this, (dataSource: Array<any>) => {
                this.calulateAddEmptyRow(dataSource);
            });
        }
        this.model.dataGrid.columns.map((m) => {
            m.props.allowSorting = false;
        });
    }
    calulateAddEmptyRow(dataSource: Array<any>) {
        var length = dataSource.length;
        if (length <= this.defaultEmptyCount) {
            for (let index = 0; index < this.defaultEmptyCount - length; index++) {
                let empty = {};
                empty[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
                empty['target'] = DataStatus.newline;
                (<Array<any>>this.model.dataGrid.props.dataSource).push(empty);
            }
        } else {
            if (length < this.totalAddRows) {
                for (let index = 0; index < this.totalAddRows - length; index++) {
                    let empty = {};
                    empty[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
                    empty['target'] = DataStatus.newline;
                    (<Array<any>>this.model.dataGrid.props.dataSource).push(empty);
                }
            }
        }
    }
    onStartReview() {
        let isDisabled = (<NxButton>this.model.toolbar.getWidgetByKey('save')).props.disabled;
        if (!isDisabled) {
            return false;
        }
        return true;
    }
    onReviewSuccess(status: ReviewStatus, isCancel: boolean) {
        this.dataGrid.onReviewSuccess(status, isCancel);
        if (isCancel) {
            this.isReview = false;
            //判断是否是编辑状态还是新增状态
            // this.model.toolbar.getWidgetByKey('delete').props.disabled = false;
            // this.model.toolbar.getWidgetByKey('create').props.disabled = false;
            let mainPanelText = ['save','cancel'];
            for (const button of this.model.toolbar.mainPanel) {
                if (mainPanelText.indexOf(button.key) != -1) {
                    continue;
                } else {
                    (<NxButton>this.model.toolbar.getWidgetByKey(button.key)).props.disabled = false;
                }
            }
            this.model.remarks.disabled = false;
            this.model.toolbar.moreButton.props.disabled = false;
            this.model.conditionPanel.searchButton.props.disabled = false;
            this.model.conditionPanel.openButton.props.disabled = false;
            for (const conditionButton of this.model.conditionPanel.conditionItems) {
                if (conditionButton.widget) {
                    conditionButton.widget.props.disabled = false;
                }
            }
            for (let index = 0; index < this.model.toolbar.otherPanel.length; index++) {
                (<NxButton>(
                    this.model.toolbar.getOtherWidgetByKey(this.model.toolbar.otherPanelKeys[index])
                )).props.disabled = false;
            }
            this.model.dataGrid.editing.enabled = true;
            // for (const columns of this.model.dataGrid.columns) {
            //     columns.props.allowEditing = true;
            // }
            // if(this.$open == FormOptions.$create){
            //     (<NxButton>this.model.toolbar.getWidgetByKey('save')).props.disabled = false;
            // }
            this.model.dataGrid.commandRow.visible = true;//恢复删行、增行
        } else {
            this.isReview = status == ReviewStatus.reviewed ? true : false;
            //禁用所有操作  copyLine|参考新增 create|新增 loadRecent|载入最近 collection|收款
            let mainPanelText = ['copyLine','create','loadRecent','collection'];
            for (const button of this.model.toolbar.mainPanel) {
                if (mainPanelText.indexOf(button.key) != -1) {
                    continue;
                }
                button.widget.props.disabled = status == ReviewStatus.reviewed ? true : false;
            }
            let PanelKeysText = ['headSetting','print'];
            for (let index = 0; index < this.model.toolbar.otherPanel.length; index++) {
                if (PanelKeysText.indexOf(this.model.toolbar.otherPanelKeys[index]) != -1) {
                    continue;
                }
                (<NxButton>(
                    this.model.toolbar.getOtherWidgetByKey(this.model.toolbar.otherPanelKeys[index])
                )).props.disabled = status == ReviewStatus.reviewed ? true : false;
            }
            // this.model.toolbar.moreButton.props.disabled = status == ReviewStatus.reviewed ? true : false;
            this.model.conditionPanel.searchButton.props.disabled = status == ReviewStatus.reviewed ? true : false;
            this.model.conditionPanel.openButton.props.disabled = status == ReviewStatus.reviewed ? true : false;
            this.model.conditionPanel.resetButton.props.disabled = status == ReviewStatus.reviewed ? true : false;
            for (const conditionButton of this.model.conditionPanel.conditionItems) {
                if (conditionButton.widget) {
                    conditionButton.widget.props.disabled = status == ReviewStatus.reviewed ? true : false;
                }
            }
            this.model.remarks.disabled = status == ReviewStatus.reviewed ? true : false;
            this.model.dataGrid.editing.enabled = false;
            this.model.dataGrid.commandRow.visible = false;//禁用删行、增行
        }
        if (this.model.reviewFun) {
            // this.model.reviewFun(isCancel);
        }
    }
    /**
     * 初始化详情页配置
     */
    private initialSettings() {
        const params = this.route.queryParams['value'];
        // 打开方式
        this.$open = params['$open'];
        // 当前页索引
        this.$index = params['$index'];
        // 页面大小
        this.$size = params['$size'];
        // 点击行索引
        this.$rowIndex = params['$rowIndex'];
        // 总页数
        this.$count = params['$count'];
        // 实际显示行数
        this.$visibles = params['$visibles'];
        this.model.dataGrid.stateStoring.enabled = true;
        this.model.dataGrid.stateStoring.storageKey =
            window.location.pathname.match('/[^/]+(?=/)')[0].replace('/', '') + '-detail';
        if (!this.model.dataGrid.events.onEditorPreparing) {
            this.model.dataGrid.events.onEditorPreparing = (e) => {
                if (e.parentType === 'dataRow') {
                    e.editorOptions.onValueChanged = (args) => {
                        this.modifyDataStatusSet();
                        e.setValue(args.value);
                    };
                }
            };
        }
        this.model.dataGrid.columns.map((m) => {
            if (m.props.cellTemplate.enabled) {
                m.props.cellTemplate.widget.events.innerOnValueChanged = (e) => {
                    this.modifyDataStatusSet();
                };
            }
        });
        if (!this.model.dataGrid.commandColumn.trashButton.onClick) {
            this.model.dataGrid.commandColumn.trashButton.onClick = (e) => {
                this.modifyDataStatusSet();
            };
        }
        if (!this.model.dataGrid.commandColumn.addRowButton.statusCtrl) {
            this.model.dataGrid.commandColumn.addRowButton.statusCtrl = (e) => {
                this.modifyDataStatusSet();
            };
        }
        if (!this.model.dataGrid.commandColumn.deleteButton.onClick) {
            this.model.dataGrid.commandColumn.deleteButton.onClick = (e) => {
                this.modifyDataStatusSet();
            };
        }
        if (!(<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick) {
            (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick = () => {
                this.resetDataStatusSet();
            };
        }
        if (!this.model.dataGrid.events.onContextMenuPreparing) {
            this.model.dataGrid.events.onContextMenuPreparing = (e) => {
                if (this.model.dataGrid.type == 'detail') {
                    if (this.isReview) return;
                    if (this.isRightReview) return;
                    let SerialNo = 0;
                    (<Array<any>>this.model.dataGrid.props.dataSource).forEach((m) => {
                        if (!m.SerialNo) return;
                        if(m.SerialNo > SerialNo) SerialNo = m.SerialNo;
                    });
                    // 右键操作的默认实现
                    if (e.row && e.row.rowType === 'data') {
                        e.items = [
                            {
                                text: NxTranslateI18N.I18N.dataGridOptions.rowOptions.add.insertOn,
                                onItemClick: () => {
                                    if (!this.model.dataGrid.editing.allowUpdating) {
                                        return;
                                    }
                                    if (this.model.dataGrid.commandColumn.insertRowButton.onClick) {
                                        this.model.dataGrid.commandColumn.insertRowButton.onClick(
                                            this.dataGrid.calcRowsOptionIndex(e),
                                            this.dataGrid.emptyRow,
                                            'top'
                                        );
                                    } else {
                                        (<Array<any>>this.dataGrid.model.props.dataSource).splice(
                                            this.dataGrid.calcRowsOptionIndex(e),
                                            0,
                                            this.dataGrid.emptyRow
                                        );
                                    }
                                    this.modifyDataStatusSet();
                                    e.event.preventDefault();
                                },
                            },
                            {
                                text: NxTranslateI18N.I18N.dataGridOptions.rowOptions.add.insertDown,
                                onItemClick: () => {
                                    if (!this.model.dataGrid.editing.allowUpdating) {
                                        return;
                                    }
                                    if (this.model.dataGrid.commandColumn.insertRowButton.onClick) {
                                        this.model.dataGrid.commandColumn.insertRowButton.onClick(
                                            this.dataGrid.calcRowsOptionIndex(e) + 1,
                                            this.dataGrid.emptyRow,
                                            'bottom'
                                        );
                                    } else {
                                        (<Array<any>>this.dataGrid.model.props.dataSource).splice(
                                            this.dataGrid.calcRowsOptionIndex(e) + 1,
                                            0,
                                            this.dataGrid.emptyRow
                                        );
                                    }
                                    this.modifyDataStatusSet();
                                    e.event.preventDefault();
                                },
                            },
                            {
                                text: NxTranslateI18N.I18N.dataGridOptions.rowOptions.add.copyOn,
                                onItemClick: () => {
                                    if (!this.model.dataGrid.editing.allowUpdating) {
                                        return;
                                    }
                                    const clone = deepCopy(e.row.data);
                                    clone[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
                                    clone.target = DataStatus.newline;
                                    if (clone.SerialNo) {
                                        clone.SerialNo = ++SerialNo;
                                    }
                                    if (this.model.dataGrid.commandColumn.copyRowButton.onClick) {
                                        this.model.dataGrid.commandColumn.copyRowButton.onClick(
                                            this.dataGrid.calcRowsOptionIndex(e),
                                            clone,
                                            'top'
                                        );
                                    } else {
                                        (<Array<any>>this.dataGrid.model.props.dataSource).splice(
                                            this.dataGrid.calcRowsOptionIndex(e),
                                            0,
                                            clone
                                        );
                                    }
                                    this.modifyDataStatusSet();
                                    e.event.preventDefault();
                                },
                            },
                            {
                                text: NxTranslateI18N.I18N.dataGridOptions.rowOptions.add.copyDown,
                                onItemClick: () => {
                                    if (!this.model.dataGrid.editing.allowUpdating) {
                                        return;
                                    }
                                    const clone = deepCopy(e.row.data);
                                    clone[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
                                    clone.target = DataStatus.newline;
                                    if (clone.SerialNo) {
                                        clone.SerialNo = ++SerialNo;
                                    }
                                    if (this.model.dataGrid.commandColumn.copyRowButton.onClick) {
                                        this.model.dataGrid.commandColumn.copyRowButton.onClick(
                                            this.dataGrid.calcRowsOptionIndex(e) + 1,
                                            clone,
                                            'bottom'
                                        );
                                    } else {
                                        (<Array<any>>this.dataGrid.model.props.dataSource).splice(
                                            this.dataGrid.calcRowsOptionIndex(e) + 1,
                                            0,
                                            clone
                                        );
                                    }
                                    this.modifyDataStatusSet();
                                    e.event.preventDefault();
                                },
                            },
                            {
                                text: NxTranslateI18N.I18N.dataGridOptions.rowOptions.add.deleteRow,
                                onItemClick: () => {
                                    if (!this.model.dataGrid.editing.allowUpdating) {
                                        return;
                                    }
                                    let deletedRowData = (<Array<any>>this.model.dataGrid.props.dataSource).splice(
                                        this.dataGrid.calcRowsOptionIndex(e),
                                        1
                                    );
                                    this.dataGrid.dataGrid.instance.deleteRow(e.row.rowIndex);
                                    if (deletedRowData[0].target != DataStatus.newline) {
                                        deletedRowData[0].target = DataStatus.deleted;
                                        this.dataGrid.$deletedData.push(...deletedRowData);
                                    }
                                    this.modifyDataStatusSet();
                                    e.event.preventDefault();
                                },
                            },
                        ];
                        e.event.preventDefault();
                    }
                    if (this.isAddRightReview) return;
                    if (e.row == undefined && e.target == 'content') {
                        e.items = [
                            {
                                text: NxTranslateI18N.I18N.dataGridOptions.rowOptions.add.appendRow,
                                onItemClick: () => {
                                    if (!this.model.dataGrid.editing.allowUpdating) {
                                        return;
                                    }
                                    if (this.model.dataGrid.commandColumn.insertRowButton.onClick) {
                                        this.model.dataGrid.commandColumn.insertRowButton.onClick(
                                            0,
                                            this.dataGrid.emptyRow,
                                            'unshift'
                                        );
                                    } else {
                                        (<Array<any>>this.dataGrid.model.props.dataSource).unshift(
                                            this.dataGrid.emptyRow
                                        );
                                    }
                                    this.modifyDataStatusSet();
                                    e.event.preventDefault();
                                },
                            },
                        ];
                    }
                }
            };
        }
        if (!this.model.dataGrid.events.onRowUpdating) {
            this.model.dataGrid.events.onRowUpdating = (e) => {
                if (e.oldData.target == DataStatus.none) {
                    e.newData.target = DataStatus.modified;
                }
            };
        }
        this.model.conditionPanel.conditionItems.map((m) => {
            switch (m.type) {
                case 'TextBox':
                    (<NxTextBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifyDataStatusSet();
                    };
                    break;
                case 'DateBox':
                    (<NxDateBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifyDataStatusSet();
                    };
                    break;
                case 'SelectBox':
                    (<NxSelectBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifyDataStatusSet();
                    };
                case 'RadioGroup':
                    (<NxSelectBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifyDataStatusSet();
                    };
                case 'NumberBox':
                    (<NxNumberBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifyDataStatusSet();
                    };
                    break;
            }
        });
        this.model.toolbar.getOtherWidgetByKey('setting').events.onClick = () => {
            this.model.toolbar.columnSettingDisabled = !this.model.toolbar.columnSettingDisabled;
        };
        this.model.toolbar.getOtherWidgetByKey('messageBox').events.onClick = () => {
            this.messageBoxVisible = !this.messageBoxVisible;
        };
        this.model.toolbar.getOtherWidgetByKey('headSetting').events.onClick = () => {
            this.model.columnSettingDisabled = !this.model.columnSettingDisabled;
        };
        let columnSettings = [];
        this.model.dataGrid.columns.map((col) => {
            columnSettings.push(
                new ColumnSetting(col.props.caption, col.props.dataField, col.props.HeaderRequiredIcon)
            );
        });
        this.model.toolbar.settings.push(...columnSettings);
        this.model.toolbar.onColumnSetting = (hiding, dataField) => {
            for (let index = 0; index < this.model.dataGrid.columns.length; index++) {
                const col = this.model.dataGrid.columns[index];
                if (col.props.dataField == dataField) {
                    this.model.dataGrid.columns[index].props.visible = hiding;
                    break;
                }
            }
        };
        this.model.toolbar.onColumnEditing = (value, dataField) => {
            for (let index = 0; index < this.model.dataGrid.columns.length; index++) {
                const col = this.model.dataGrid.columns[index];
                if (col.props.dataField == dataField) {
                    this.model.dataGrid.columns[index].props.caption = value;
                    // this.dataGrid.instance.columnOption('dataField', 'caption', 'value');
                    // this.model.columns.find((m) => m.props.dataField == 'dataField').props.caption = 'value';
                    break;
                }
            }
            let params = this.toolbarPanel.getRequestParams();
            params.moduleKey = this.model.dataGrid.stateStoring.storageKey as string;
            this.http.post(`${environment.qlwCommonService}/component`, params).toPromise();
        };
        this.model.dataGrid.events.onCustomStateStoringLoad = (_instance) => {
            return new Promise(async (resolve, reject) => {
                //先从缓冲拿
                const stateStoring: any = localStorage.getItem(`${_instance.model.stateStoring.storageKey}`);
                var detailConfig = stateStoring ? JSON.parse(stateStoring) : {};
                if (!_instance.model.isCacheColumn||!detailConfig) {
                    detailConfig = {
                        allowedPageSizes: [10, 15, 20, 50, 100],
                        columns: this.model.dataGrid.columns,
                        filterPanel: { filterEnabled: true },
                        filterValue: null,
                        pageIndex: 0,
                        pageSize: 0,
                        searchText: '',
                        selectedRowKeys: [],
                    };
                    resolve(detailConfig);
                    return;
                }
                try {
                    //如果缓冲没有并且是详情页 从后端拿
                    if (_instance.model.stateStoring.storageKey.indexOf('detail') >= 0) {
                        let res: any = await this.getColumnsApi();
                        if (res.data && res.data.items && res.data.items.length > 0) {
                            const json = res.data.items[0];
                            const { value, _id } = json;
                            this.columnOid = _id.$oid;
                            this.settingColumns(value);
                            setTimeout(() => {
                                detailConfig.columns = this.model.dataGrid.columns;
                                resolve(detailConfig);
                            }, 0);
                        } else {
                            detailConfig.columns = this.model.dataGrid.columns;
                            resolve(detailConfig);
                            return;
                        }
                        // let data = await _instance.getconfigfromapi();
                        // if (!data || !data['Columns']) {
                        //     resolve(detailConfig);
                        //     return;
                        // }
                        // //处理列
                        // var columns = JSON.parse(data['Columns']);
                        // let showColumns = this.model.dataGrid.columns;
                        // let tempColumns = [];
                        // showColumns.map((item, index) => {
                        //     let tempColumn = columns.filter((x) => x.dataField == item.props.dataField)[0];
                        //     tempColumns.push({
                        //         dataField: item.props.dataField,
                        //         dataType: item.props.dataType,
                        //         fixed: item.props.fixed,
                        //         fixedPosition: item.props.fixedPosition,
                        //         visible: tempColumn.visible,
                        //         visibleIndex: tempColumn.visibleIndex,
                        //         width: tempColumn.width,
                        //         caption: tempColumn.caption,
                        //     });
                        //     this.model.toolbar.settings.filter((x) => x.dataField == item.props.dataField)[0].visibled =
                        //         tempColumn.visible;
                        //     item.props.visible = tempColumn.visible;
                        //     this.model.toolbar.settings.filter((x) => x.dataField == item.props.dataField)[0].caption =
                        //         tempColumn.caption;
                        //     item.props.caption = tempColumn.caption;
                        // });
                        // detailConfig.columns = tempColumns;
                        // resolve(detailConfig);
                    }
                } catch (error) {
                    console.warn('can not read data from api');
                    resolve(detailConfig);
                    return;
                }
            });
        };
    }

    changeToolBarColumn(hideColumns: Array<any>) {
        let columnSettings = [];
        this.model.dataGrid.columns.map((col) => {
            if (hideColumns.indexOf(col.props.dataField) >= 0) {
                // columnSettings.push(new ColumnSetting(col.props.caption, col.props.dataField));
                col.props.visible = false;
            }
        });
        this.model.toolbar.settings.push(...columnSettings);
    }
    /**
     * 是否允许上一条
     */
    get $allowPrev(): boolean {
        return (this.$index == 0 && this.$rowIndex == 0) || this.$index == undefined;
    }
    /**
     * 是否允许下一条
     */
    get $allowNext(): boolean {
        return (this.$visibles < this.$size && this.$rowIndex + 1 == this.$visibles) || this.$visibles == 1;
    }
    get $allowSave(): boolean {
        return !this.$saveCtl;
    }
    set $allowSave(value: boolean) {
        this.$saveCtl = value;
    }
    get $deleted(): boolean {
        return this.$deleteCtl;
    }
    set $deleted(value: boolean) {
        this.$deleteCtl = value;
    }
    onValueChengdEvent(e) {
        if ((e.value || '') != (this.cacheSearchData[this.model.remarks.dataField] || '')) {
            this.modifyDataStatusSet();
        }
        // if (!this.$remarkInit) {
        //     this.$remarkInit = true;
        // } else {
        //     this.modifyDataStatusSet();
        // }
    }
    openCheck(create: Function, modify: Function) {
        if (this.$open == FormOptions.$create) {
            create();
        } else {
            modify();
        }
    }
    prev(url): Promise<{ url: string; allowPrev: boolean }> {
        return new Promise((resolve, reject) => {
            if (this.$rowIndex == 0) {
                this.$index -= 1;
                this.$rowIndex = this.$size;
            }
            let skip: number = this.$index * this.$size + this.$rowIndex - 1;
            url += `&$skip=${skip}&$top=1`;
            this.$rowIndex = this.$rowIndex - 1;
            this.changedDataStatusSet();
            resolve({
                url: url,
                allowPrev: this.$allowPrev,
            });
        });
    }
    next(url: string): Promise<{ url: string; allowNext: boolean }> {
        return new Promise((resolve, reject) => {
            if (this.$rowIndex + 1 == this.$size) {
                this.$index += 1;
                this.$rowIndex = -1;
            }
            let skip: number = this.$index * this.$size + this.$rowIndex + 1;
            url += `&$skip=${skip}&$top=1`;
            this.$rowIndex = this.$rowIndex + 1;
            (<NxButton>this.model.toolbar.getWidgetByKey('prev')).props.disabled = this.$allowPrev;
            this.changedDataStatusSet();
            resolve({
                url: url,
                allowNext: this.$allowNext,
            });
        });
    }
    saveChanges(val?: any): Promise<any> {
        (<NxButton>this.model.toolbar.getWidgetByKey('save')).props.disabled = true;
        return new Promise<any>((resolve, reject) => {
            var validateResult = this.dataGrid.dataGrid.instance['getController']('validating').validate(true);
            validateResult.done((validation) => {
                if (validation) {
                    this.dataGrid.dataGrid.instance.saveEditData();
                    this.totalAddRows = (<Array<any>>this.model.dataGrid.props.dataSource).length;
                    let arry = [];
                    for (const data of <Array<any>>this.model.dataGrid.props.dataSource) {
                        let isAllEmpty = false;
                        let props = Object.keys(data).filter(
                            (x) => x != this.model.dataGrid.primaryKey && x != 'target' && x != val
                        ); //过滤主键跟target
                        for (const prop of props) {
                            if (data[prop] != null && data[prop] != '' && data[prop] != undefined) {
                                isAllEmpty = true;
                            }
                        }
                        if (!isAllEmpty) {
                            arry.push(data);
                        }
                    }
                    let datas = (<Array<any>>this.model.dataGrid.props.dataSource).filter(
                        (val) => arry.indexOf(val) === -1
                    );
                    if (datas.length > 0) {
                        const Required = this.checkColumnsRequired(datas);
                        const RcheckRequired = this.checkRequired();
                        console.log(Required,RcheckRequired);
                        if (Required && RcheckRequired) {
                            resolve({
                                header: this.model.conditionPanel.data,
                                body: datas,
                                deleted: this.dataGrid.$deletedData,
                            });
                        } else {
                            (<NxButton>this.model.toolbar.getWidgetByKey('save')).props.disabled = false;
                            Notify.toast(NxTranslateI18N.I18N.dataGridOptions.save.checkSaveData, NotifyType.Error);
                        }
                    } else {
                        (<NxButton>this.model.toolbar.getWidgetByKey('save')).props.disabled = false;
                        Notify.toast(NxTranslateI18N.I18N.dataGridOptions.save.notSaveEmptyData, NotifyType.Error);
                    }
                } else {
                    (<NxButton>this.model.toolbar.getWidgetByKey('save')).props.disabled = false;
                    Notify.toast(NxTranslateI18N.I18N.dataGridOptions.save.checkSaveData, NotifyType.Warning);
                }
            });
        });
    }
    deepClone(data): any {
        var d: any;
        if (typeof data === 'object') {
            if (data == null) {
                d = null;
            } else {
                if (data.constructor === Array) {
                    d = [];
                    for (let i in data) {
                        d.push(this.deepClone(data[i]));
                    }
                } else {
                    d = {};
                    for (let i in data) {
                        d[i] = this.deepClone(data[i]);
                    }
                }
            }
        } else {
            d = data;
        }
        return d;
    }
    reviewValidation() {
        // 保存之前验证权限
        if (this.model.review.visible) {
            // 已审核的单子无法保存
            if (this.reviewInstance.reviewStatus) {
                Notify.toast(NxTranslateI18N.I18N.dataGridOptions.review.reviewed, NotifyType.Error);
                return false;
            }
        }
        return true;
    }
    /**
     * 编辑状态下：修改数据之后的工具条状态
     */
    private changedDataStatusSet() {
        //控制内部工具条状态
        this.$allowSave = false;
        this.$deleted = false;
        this.dataGrid.$deletedData = [];
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('save')).props.disabled = this.$allowSave;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('cancel')).props.disabled = this.$allowSave;
    }
    modifyDataStatusSet() {
        if (this.$deleted) {
            return;
        }
        this.$allowSave = true;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('save')).props.disabled = this.$allowSave;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('cancel')).props.disabled = this.$allowSave;
    }
    resetDataStatusSet() {
        this.$allowSave = false;
        if (this.model.conditionPanel.visible) {
            const changeFields = [];
            for (const key in this.model.conditionPanel.data) {
                if (this.model.conditionPanel.data[key] != this.cacheSearchData[key]) {
                    changeFields.push(key);
                }
            }
            this.searchPanel.inited.map((m) => {
                if (changeFields.indexOf(m.dataField) > -1) {
                    m.status = false;
                }
            });
            if (changeFields.indexOf(this.model.remarks.dataField) > -1) {
                this.$remarkInit = false;
            }
            this.model.conditionPanel.data = deepCopy(this.cacheSearchData);
        }
        this.dataGrid.$deletedData = [];
        this.dataGrid.dataGrid.instance.cancelEditData();
        this.model.dataGrid.props.dataSource = deepCopy(this.cacheBodyData);
        // this.dataGrid.dataGrid.instance.refresh();
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('save')).props.disabled = this.$allowSave;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('cancel')).props.disabled = this.$allowSave;
        this.calulateAddEmptyRow(<Array<any>>this.dataGrid.dataGrid.dataSource);
    }
    resetDataStatus() {
        this.$allowSave = false;
        const changeFields = [];
        for (const key in this.model.conditionPanel.data) {
            if (this.model.conditionPanel.data[key] != this.cacheSearchData[key]) {
                changeFields.push(key);
            }
        }
        this.searchPanel.inited.map((m) => {
            if (changeFields.indexOf(m.dataField) > -1) {
                m.status = false;
            }
        });
        if (changeFields.indexOf(this.model.remarks.dataField) > -1) {
            this.$remarkInit = false;
        }
        this.dataGrid.$deletedData = [];
        this.dataGrid.dataGrid.instance.cancelEditData();
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('save')).props.disabled = this.$allowSave;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('cancel')).props.disabled = this.$allowSave;
    }
    /**
     * 设置按钮状态
     * */
    setButtonStatus(allowCreate, allowSave, allowCancel, allowDelete) {
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('create')).props.disabled = !allowCreate;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('save')).props.disabled = !allowSave;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('cancel')).props.disabled = !allowCancel;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('delete')).props.disabled = !allowDelete;
    }
    /**
     * 保存成功回调
     */
    saveDataSuccess(dataSource: Array<any>) {
        this.calulateAddEmptyRow(dataSource);
        this.dataGrid.selectRowIndex = -1;
    }
    /**
     * 保存失败回调
     */
    saveDataError() {
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('save')).props.disabled = false;
    }
    /**
     * 保存成功后状态变更
     */
    saveDataAfterStatus() {
        //审核之后禁用所有按钮
        if(this.model.review && this.model.review.visible && 
            (this.model.review.reviewName || this.model.review.warehouseReviewName || this.model.review.financeReviewName)){
            return;
        }
        this.$allowSave = false;
        this.$deleted = false;
        this.model.toolbar.getWidgetByKey('delete').props.disabled = false;
        this.messageBox.clear();
        this.messageBox.hide();
        (<Array<any>>this.model.dataGrid.props.dataSource)
            .filter((x) => x.target != DataStatus.newline)
            .map((m) => {
                m['target'] = DataStatus.none;
            });
        this.dataGrid.$deletedData = [];
        (<NxButton>this.model.toolbar.getWidgetByKey('create')).props.disabled = false;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('save')).props.disabled = this.$allowSave;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('cancel')).props.disabled = this.$allowSave;
    }
    selectStatusChange() {}
    /**
     * 详情创建按钮的状态变更
     * @param defaultData 默认值
     */
    createDataStatus(defaultData?: any, defaultEmptyCount?: number) {
        this.$deleted = false;
        this.$open = FormOptions.$create;
        this.messageBox.clear();
        this.messageBox.hide();
        this.$allowSave = false;
        this.model.dataGrid.editing.allowUpdating = true;
        let emptyDatas = [];
        this.model.review.visible = false;
        this.model.dataGrid.type = 'detail';
        this.isReview = false;
        //放开某些操作 addHang|批量增行 create|新增 introduce|引入订药
        let mainPanelText = ['create','addHang','introduce'];
        for (const button of this.model.toolbar.mainPanel) {
            if (mainPanelText.indexOf(button.key) != -1) {
                (<NxButton>this.model.toolbar.getWidgetByKey(button.key)).props.disabled = false;
            } else {
                (<NxButton>this.model.toolbar.getWidgetByKey(button.key)).props.disabled = this.$allowSave;
            }
        }
        // 右上角按钮放开
        for (let index = 0; index < this.model.toolbar.otherPanel.length; index++) {
            (<NxButton>(
                this.model.toolbar.getOtherWidgetByKey(this.model.toolbar.otherPanelKeys[index])
            )).props.disabled = false;
        }
        //更多
        this.model.toolbar.moreButton.props.disabled = false;
        // 表头放开
        for (const conditionButton of this.model.conditionPanel.conditionItems) {
            if (conditionButton.widget) {
                conditionButton.widget.props.disabled = false;
            }
        }
        this.model.conditionPanel.searchButton.props.disabled = false;
        this.model.conditionPanel.openButton.props.disabled = false;
        this.model.conditionPanel.resetButton.props.disabled = false;
        this.model.remarks.disabled = false;
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.commandRow.visible = true;//恢复删行、增行
        if (this.dataGrid) {
            this.dataGrid.onReviewSuccess(null, true);
        }
        if (defaultData) {
            defaultData[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
            defaultData['target'] = DataStatus.newline;
            this.model.dataGrid.props.dataSource = [defaultData];
            this.cacheBodyData = deepCopy([defaultData]);
        } else {
            if (defaultData === null) {
                (<Array<any>>this.model.dataGrid.props.dataSource) = emptyDatas;
                this.cacheBodyData = deepCopy(emptyDatas);
                
            } else {
                let count = defaultEmptyCount ? defaultEmptyCount : this.defaultEmptyCount;
                for (let index = 0; index < count; index++) {
                    let empty = {};
                    empty[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();

                    empty['target'] = DataStatus.newline;
                    emptyDatas.push(empty);
                }
                (<Array<any>>this.model.dataGrid.props.dataSource) = emptyDatas;
                this.cacheBodyData = deepCopy(emptyDatas);
            }
        }
        this.$remarkInit = false;
    }
    addCreateDataStatus() {
        this.$deleted = false;
        this.$open = FormOptions.$create;
        this.messageBox.clear();
        this.messageBox.hide();
        this.$allowSave = false;
        this.model.dataGrid.editing.allowUpdating = true;
        this.model.review.visible = false;
        this.model.dataGrid.type = 'detail';
        this.isReview = false;
        //放开某些操作 addHang|批量增行 create|新增 introduce|引入订药
        let mainPanelText = ['create','addHang','introduce'];
        for (const button of this.model.toolbar.mainPanel) {
            if (mainPanelText.indexOf(button.key) != -1) {
                (<NxButton>this.model.toolbar.getWidgetByKey(button.key)).props.disabled = false;
            } else {
                (<NxButton>this.model.toolbar.getWidgetByKey(button.key)).props.disabled = this.$allowSave;
            }
        }
        // 右上角按钮放开
        for (let index = 0; index < this.model.toolbar.otherPanel.length; index++) {
            (<NxButton>(
                this.model.toolbar.getOtherWidgetByKey(this.model.toolbar.otherPanelKeys[index])
            )).props.disabled = false;
        }
        //更多
        this.model.toolbar.moreButton.props.disabled = false;
        // 表头放开
        for (const conditionButton of this.model.conditionPanel.conditionItems) {
            if (conditionButton.widget) {
                conditionButton.widget.props.disabled = false;
            }
        }
        this.model.conditionPanel.searchButton.props.disabled = false;
        this.model.conditionPanel.openButton.props.disabled = false;
        this.model.conditionPanel.resetButton.props.disabled = false;
        this.model.remarks.disabled = false;
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.commandRow.visible = true;//恢复删行、增行
        if (this.dataGrid) {
            this.dataGrid.onReviewSuccess(null, true);
        }
        
        this.$remarkInit = false;
    }
    deletedStatus() {
        this.messageBox.clear();
        this.messageBox.hide();
        this.$deleted = true;
        this.model.toolbar.getWidgetByKey('delete').props.disabled = true;
        this.$allowSave = false;
        this.model.dataGrid.editing.allowUpdating = false;
        this.model.dataGrid.props.dataSource = [];
        this.model.conditionPanel.data = {};
        this.dataGrid.$deletedData.splice(0);
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('save')).props.disabled = this.$allowSave;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('cancel')).props.disabled = this.$allowSave;
        (<NxButton>this.toolbarPanel.model.getWidgetByKey('create')).props.disabled = false;
        this.dataGrid.selectRowIndex = -1;
    }
    setCellValueUpdating(e: { oldData: any; newData: any }) {
        if (e.oldData.target == DataStatus.none) {
            e.newData.target = DataStatus.modified;
        }
    }
    columns(dataField) {
        return this.model.dataGrid.columns.map((col) => {
            if (col.props.dataField == dataField) {
                return col;
            }
        });
    }
    /** 消息盒子 */
    get messageBox() {
        let _this = this;
        return {
            show(message?) {
                _this.messageBoxVisible = true;

                if (message) {
                    if (message instanceof Array) {
                        _this.messageBoxInfo = message;
                        if (_this.toolbarPanel) {
                            _this.toolbarPanel.model.getOtherWidgetByKey('messageBox').props.text = `${message.length}`;
                        }
                    }
                }
            },
            clear() {
                _this.messageBoxInfo = [];
                if (_this.toolbarPanel) {
                    _this.toolbarPanel.model.getOtherWidgetByKey('messageBox').props.text = `0`;
                }
            },
            hide() {
                _this.messageBoxVisible = false;
            },
            get info(): string[] {
                return _this.messageBoxInfo;
            },
            get infoNums(): number {
                return _this.messageBoxInfo.length;
            },
            get visible(): boolean {
                return _this.messageBoxVisible;
            },
        };
    }

    checkRequired() {
        let data = this.model.conditionPanel.data;
        let arr = [];
        this.model.conditionPanel.conditionItems.forEach((item) => {
            if (item.required && ( data[item.dataField] === null || data[item.dataField] === '' || data[item.dataField] === undefined || data[item.dataField] === '0')) {
                arr.push(`${item.label}必填`);
            }
        });
        let status = true;
        if (arr.length) {
            status = false;
            this.messageBox.show(arr);
            this.saveDataError();
        }
        return status;
    }

    checkColumnsRequired(data) {
        const validator = new DataValidator();
        let columnsRequiredArr = [];
        this.model.dataGrid.columns.forEach((item) => {
            if (item.props.HeaderRequiredIcon) {
                let arr = [item.props.dataField, item.props.caption + this.translator.I18N.required];
                columnsRequiredArr.push(arr);
            }
        });
        validator.forObjRequire(data, columnsRequiredArr);
        return validator.validation;
    }

    //弹窗方法

    /**
     * 取消按钮
     */
    _onCancel() {
        this.model.columnSettingDisabled = false;
    }
    /**
     * 保存按钮
     */
    _onSave() {
        this._headDataGrid.instance.saveEditData();
        this._columnDataGrid.instance.saveEditData();
        if (!this.saveStatus) return;
        this.saveStatus = false;
        this.searchPanel._onSave(() => {
            this.model.columnSettingDisabled = false;
        });
        this.settingColumns(this.columnSettingArr);
        this.saveColumnsApi(this.columnSettingArr);
    }
    /**
     * 弹窗关闭执行
     */
    _hidden() {
        this._headDataGrid.instance.saveEditData();
        this.searchPanel._hidden();
        this.columnSettingArr = [];
        this.saveStatus = true;
    }
    _showing() {
        if (this.model.dataGrid.columns && this.model.dataGrid.columns.length > 0) {
            this.columnSettingArr = this.deepTransform(this.model.dataGrid.columns);
        }
    }

    //表头设置

    /**
     * 控制显隐、必填
     */
    onEditorPreparing(e) {
        this.searchPanel.onEditorPreparing(e);
    }

    /**
     * 拖拽方法
     */
    onReorder(e) {
        var visibleRows = e.component.getVisibleRows(),
            toIndex = this.model.conditionPanel.conditionItems
                .map((item) => item.dataField)
                .indexOf(visibleRows[e.toIndex].data.dataField),
            fromIndex = e.fromIndex;
        this.model.conditionPanel.conditionItems.splice(fromIndex, 1);
        this.model.conditionPanel.conditionItems.splice(toIndex, 0, e.itemData);
    }

    //表体设置
    /**
     * 拖拽方法
     */
    onColumnReorder(e) {
        var visibleRows = e.component.getVisibleRows(),
            toIndex = this.columnSettingArr
                .map((item) => item.dataField)
                .indexOf(visibleRows[e.toIndex].data.dataField),
            fromIndex = e.fromIndex;
        this.columnSettingArr.splice(fromIndex, 1);
        this.columnSettingArr.splice(toIndex, 0, e.itemData);
    }
    onColumnEditorPreparing(e) {
        if (!this.columnSettingArr || !this.columnSettingArr.length) return;
        if (e.dataField && e.row.rowType == 'data') {
            //显隐
            if (e.dataField == 'visible') {
                e.editorOptions.disabled = e.row.data.HeaderRequiredIcon || e.row.data.requiredDisable ? true : false;
                if (this.columnSettingArr[e.row.rowIndex].HeaderRequiredIcon) {
                    e.editorOptions.value = true;
                    this.columnSettingArr[e.row.rowIndex].visible = true;
                }
            }
            if (e.dataField == 'HeaderRequiredIcon') {
                e.editorOptions.disabled = e.row.data.requiredDisable ? true : false;
            }
        }
    }
    /**
     * 表体列重新赋值
     */
    settingColumns(columnSettingArr) {
        let order = [];
        columnSettingArr.forEach((item) => {
            order.push(item.dataField);
        });
        this.model.dataGrid.columns.sort((a, b) => {
            return order.indexOf(a.props.dataField) - order.indexOf(b.props.dataField);
        });
        setTimeout(() => {
            this.model.dataGrid.columns.forEach((item, index) => {
                let idx = columnSettingArr.findIndex((ite) => {
                    return ite.dataField == item.props.dataField;
                });
                item = Object.assign(item.props, columnSettingArr[idx], {
                    requiredDisable: item.props.requiredDisable,
                    HeaderRequiredIcon: item.props.requiredDisable
                        ? item.props.HeaderRequiredIcon
                        : columnSettingArr[idx].HeaderRequiredIcon,
                    visible: item.props.requiredDisable ? item.props.visible : columnSettingArr[idx].visible,
                });
            });
        }, 0);
    }
    /**
     * 获取表体列
     */
    private _customSettingDataFields = [
        'dataField',
        'dataType',
        'showCaption',
        'caption',
        'HeaderRequiredIcon',
        'visible',
        'fixed',
        'width',
        'requiredDisable',
    ];
    deepTransform(dataGridColumns: any[]) {
        let arr = [];
        dataGridColumns.forEach((m) => {
            let _ = {};
            this._customSettingDataFields.forEach((field) => {
                _[field] = m.props[field];
            });
            arr.push(_);
        });
        return arr;
    }
    /**
     * 请求API保存列
     */
    saveColumnsApi(arr) {
        let params = {
            key: `${this.model.dataGrid.stateStoring.storageKey}`,
            value: arr,
        };
        if (this.columnOid) {
            params['_id'] = { $oid: this.columnOid };
        }
        this.http
            .put(`${environment.qlwAssem}/setting`, params)
            .toPromise()
            .then((res: { data }) => {
                this.columnOid = res.data._id.$oid;
                this.model.columnSettingDisabled = false;
            });
    }
    getColumnsApi() {
        return this.http
            .get(
                `${environment.qlwAssem}/settings?page_index=0&page_size=999&key=${this.model.dataGrid.stateStoring.storageKey}`
            )
            .toPromise();
    }
}

@NgModule({
    imports: [
        CommonModule,
        NxToolbarPanelModule,
        NxFormListModule,
        NxSearchPanelModule,
        DxTextAreaModule,
        NxReviewModule,
        DxPopupModule,
        DxSpeedDialActionModule,
        DxScrollViewModule,
        SafeHtmlModule,
        NxTranslateModule,
        DxNumberBoxModule,
        TranslateModule,
        DxTextBoxModule,
        DxTabPanelModule,
        DxDataGridModule,
        DxButtonModule,
        DxLoadPanelModule
    ],
    declarations: [NxZlwFormDetailComponent],
    exports: [NxZlwFormDetailComponent],
    providers: [RXJSService],
})
export class NxFormDetailModule {}
