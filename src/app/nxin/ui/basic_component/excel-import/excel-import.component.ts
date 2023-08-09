import { Component, OnInit, NgModule, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxTemplateModule } from 'devextreme-angular/core';
import { DxPopupModule, DxPopupComponent } from 'devextreme-angular/ui/popup';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';
import { INxExcelImportComponent, NxExcelImportComponent } from '../../extensions/basic/excel_import';
import { NxExcelImportComponentImplements } from '../../extensions/basic/excel_import/_default';
import { ExcelImport } from 'src/app/providers/excel/import';
import { ExportFile } from 'src/app/providers/excel/export';
import { Notify, NotifyType } from 'src/app/providers/notify';
import { HttpClient } from '@angular/common/http';
import { ResponseSuccess, Result } from 'src/app/providers/result';
import {
    InnerCodes,
    ResponseCodes,
    SystemResponseCodes,
    PoultryCommonResponseCodes,
} from 'src/app/providers/response-codes';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { ResponseCodeEnumMap } from 'src/app/providers/enums/map';
import { SafeHtmlModule } from 'src/app/providers/pipes/safe-html.pipe';
import { NxTranslateI18N, NxTranslateModule } from 'src/app/nxin/i18n';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'nx-excel-import',
    templateUrl: './excel-import.component.html',
    styleUrls: ['./excel-import.component.scss'],
})
export class NxExcelImport implements OnInit, INxExcelImportComponent {
    importingText: string = NxTranslateI18N.I18N.importComponent.buttonImporting;
    importText: string = NxTranslateI18N.I18N.importComponent.buttonImport;
    @ViewChild('popup', { static: false })
    dxPopupComponent: DxPopupComponent;
    importInstance: ExcelImport = new ExcelImport(this.http);
    excelExportInstance: ExportFile;
    errTipPostion: 'left';
    filenames: Array<string> = new Array<string>();
    @Input()
    model: NxExcelImportComponent;
    errMsgList: Array<string> = new Array<string>();
    errorNums: number = 0;
    isShowErrMsgTip: boolean = false;
    _header: string[];
    _headerMap: any;
    _data: any[];
    importing: boolean = false;
    hasError: boolean = false;
    param: string;
    // 是否存在自定义表单列
    hasCustomTemplate: boolean = false;
    constructor(private http: HttpClient) {}
    ngOnInit() {
        let _default = new NxExcelImportComponentImplements();
        this.model = Object.assign(_default, this.model);
        if (!this.model.jsonTemplatePath) {
            throw new Error('Import json path is not find.');
        }

        if (this.model.customTemplateKey) {
            this.http
                .get(`${environment.qlwAssem}/settings?page_index=0&page_size=999&key=header1`)
                .toPromise()
                .then((res: { data }) => {
                    if (res.data && res.data.items && res.data.items.length) {
                        this.hasCustomTemplate = true;
                    } else {
                        this.hasCustomTemplate = false;
                    }
                })
                .catch((err) => {
                    this.hasCustomTemplate = false;
                });
        }
        if (!this.model.customTemplateKey && !this.model.xlsxTemplatePath) {
            throw new Error('Import xlsx file path is not find.');
        }
        if (this.model.onInitBefore) {
            this.model.onInitBefore(this);
        }
    }
    viewException() {
        this.isShowErrMsgTip = true;
    }
    show() {
        this.model.visible = true;
    }
    hide() {
        this.model.visible = false;
    }
    importFile() {
        this.importInstance.importSingleFile((data: Array<any>, fileName) => {
            if (this.filenames.length >= 1) {
                this.filenames.pop();
            }
            // 重新导入文件后就清空错误
            this.importInstance.dom.value = null;
            this.errMsgList = [];
            this.errorNums = 0;
            this.hasError = false;
            this.filenames.push(fileName);
            console.log(data);
            if (data.length > 1) {
                console.log(this.model.jsonTemplatePath);
                console.log(this.hasCustomTemplate);
                this.importInstance.load(data, this.model.jsonTemplatePath, this.hasCustomTemplate).then((result) => {
                    console.log(result);
                    if (result.code == 0) {
                        this._header = result.header;
                        this._headerMap = result.headerMap;
                        this._data = result.data;
                    } else {
                        if (result.errorColumn.length > 0) {
                            result.errorColumn.map((m) => {
                                this.errMsgList.push(
                                    `列 <span style='color:#F8787D'>${m.caption}</span> 不存在或列名称不正确`
                                );
                            });
                            this.errMsgList.push(`<span style='color:#F8787D'>请检查模板或重新下载模板</span>`);
                            this.hasError = true;
                            this.isShowErrMsgTip = true;
                        }
                    }
                });
            }
        }, this.hasCustomTemplate);
    }
    downloadTemplateEvent() {
        if (this.model.onDownloadTemplate) {
            this.downloadTemplateEvent();
        }
    }
    //自定义表单配置模板
    downloadCustomTemplateEvent() {
        let _this = this;
        this.http
            .get(`${environment.qlwCommonService}/api/systemoption/GetDynamicExcelTemplate`, {
                responseType: 'blob',
            })
            .toPromise()
            .then((res: any) => {
                let reader = new FileReader();
                reader.readAsDataURL(res);
                reader.onload = function (e) {
                    let a = document.createElement('a');
                    let fileName = `${_this.model.customTemplateFileName}.xlsx`;
                    a.download = decodeURIComponent(fileName); //解码
                    a.href = (e.target as any).result as string;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };
            });
    }
    importExcel() {}
    confirmClick(e) {

        if (this.filenames.length <= 0) {
            Notify.toast(NxTranslateI18N.I18N.importComponent.importFileBeforeSave, NotifyType.Warning);
            return;
        }
        if (this.model.onConfirm) {
            this.model.onConfirm(e);
        } else {
            console.log(this._data);
            if (this._data && this._data.length > 0) {
                this.importRequest();
            } else {
                this.errMsgList = ['导入数据错误，请确认模板是否正确且不是空文件'];
                this.hasError = true;
                this.viewException();
            }
        }
    }
    cancelClick(e) {
        if (this.model.onCancel) {
            this.model.onCancel(e);
        }
        this.close();
    }
    close() {
        this.filenames = [];
        this.errMsgList = [];
        this._data = [];
        this._header = [];
        this._headerMap = [];
        this.errorNums = 0;
        this.hasError = false;
        this.importing = false;
        this.model.visible = false;
        this.isShowErrMsgTip = false;
        this.importInstance.dom.value = null;
    }
    closing(e) {
        if (this.importing) {
            Notify.toast('导入数据中,请等待数据完成后关闭', NotifyType.Warning);
            e.cancel = true;
            return true;
        } else {
            e.cancel = false;
            return false;
        }
    }
    importRequest() {
        this.importing = true;
        const data = {
            ExcelLines: this._data,
            param: this.param?this.param:""
        };
        this.http
            .post(this.model.importServer, data)
            .toPromise()
            .then((result: Result) => {
                this.errMsgList = [];
                if (result.errors && result.errors.length > 0) {
                    this.isShowErrMsgTip = true;
                    this.errorNums = result.errors.length;
                    this.hasError = this.errorNums != 0 ? true : false;
                    result.errors.map((m) => {
                        m.columns.map((col) => {
                            let _message = '';
                            if (m.index != 0) {
                                _message += `${NxTranslateI18N.I18N.importComponent.index} ${m.index} ${NxTranslateI18N.I18N.importComponent.line}:`;
                            }
                            if (this._headerMap[col.name]) {
                                _message += `【${this._headerMap[col.name]}】${
                                    NxTranslateI18N.I18N.importComponent.inputError
                                }：`;
                            }
                            // 8. 验证是否需要FROMAT输出
                            if (col.format && col.format.length > 0) {
                                let codeFormat: string = '';
                                let innerCode = col.code.toString().substring(3, 6);
                                var numInnerCode = new Number(innerCode);
                                // if (numInnerCode != NaN && InnerCodes.BeginIndex <= numInnerCode && InnerCodes.EndIndex >= numInnerCode){
                                if (InnerCodes.indexOf(innerCode) > -1) {
                                    codeFormat = SystemResponseCodes[NxTranslateI18N.lang][innerCode]
                                        ? SystemResponseCodes[NxTranslateI18N.lang][innerCode]
                                        : PoultryCommonResponseCodes[NxTranslateI18N.lang][innerCode];
                                } else {
                                    codeFormat += ResponseCodes[NxTranslateI18N.lang][col.code];
                                }
                                if (!codeFormat.match(/\$[a-zA-Z]+/g)) {
                                    _message += codeFormat;
                                } else {
                                    // 9. 遍历format
                                    col.format.map((f) => {
                                        // 10. 判断FORMAT KEY类型
                                        const types = f.key.split('.');
                                        const $key = `\\${f.key}`;
                                        switch (types[0]) {
                                            // 实体
                                            case '$ENTITY':
                                                // 示例1：$ENTITY.EarNumber
                                                // 示例2：$ENTITY.EarNumber.VALUE
                                                // FORMAT KEY 有VALUE 将 KEY 替换为 VALUE
                                                // FORMAT KEY 无VALUE 将 KEY 替换为 Column 列名
                                                if (types[2] === 'VALUE') {
                                                    codeFormat = codeFormat.replace(
                                                        /\$ENTITY/gm,
                                                        `<span style='color:#F8787D'>${f.value}</span>`
                                                    );
                                                } else if (types[1]) {
                                                    codeFormat = codeFormat.replace(
                                                        /\$ENTITY/gm,
                                                        `<span style='color:#F8787D'>${
                                                            this._headerMap[types[1]]
                                                        }</span>`
                                                    );
                                                } else {
                                                    codeFormat = codeFormat.replace(
                                                        /\$ENTITY/gm,
                                                        `<span style='color:#F8787D'>${
                                                            this._headerMap[types[1]]
                                                        }</span>`
                                                    );
                                                }
                                                break;
                                            // 枚举
                                            case '$ENUM':
                                                // 示例1：$ENUM.PigType.Sow 直接取值
                                                // 示例2：$ENUM.PigType 从VALUE中获取实际值
                                                let enumValue = '';
                                                if (types[2]) {
                                                    enumValue = ResponseCodeEnumMap[`${types[1]}`][`${types[2]}Text`];
                                                } else {
                                                    enumValue = ResponseCodeEnumMap[`${types[1]}`][`${f.value}Text`];
                                                }
                                                codeFormat = codeFormat.replace(
                                                    new RegExp($key, 'gm'),
                                                    `<span style='color:#F8787D'>${enumValue}</span>`
                                                );
                                                break;
                                            // 自定义
                                            case '$CUST':
                                            default:
                                                codeFormat = codeFormat.replace(
                                                    new RegExp($key, 'gm'),
                                                    `<span style='color:#F8787D'>${f.value}</span>`
                                                );
                                                break;
                                        }
                                    });
                                    _message += codeFormat;
                                }
                            } else {
                                let innerCode = col.code.toString().substring(3, 6);
                                var numInnerCode = new Number(innerCode);
                                // if (numInnerCode != NaN && InnerCodes.BeginIndex <= numInnerCode && InnerCodes.EndIndex >= numInnerCode){
                                if (InnerCodes.indexOf(innerCode) > -1) {
                                    _message += SystemResponseCodes[NxTranslateI18N.lang][innerCode]
                                        ? SystemResponseCodes[NxTranslateI18N.lang][innerCode]
                                        : PoultryCommonResponseCodes[NxTranslateI18N.lang][innerCode]
                                        ? PoultryCommonResponseCodes[NxTranslateI18N.lang][innerCode]
                                        : '请检查输入的内容';
                                } else {
                                    _message += ResponseCodes[NxTranslateI18N.lang][col.code]
                                        ? ResponseCodes[NxTranslateI18N.lang][col.code]
                                        : '请检查输入的内容';
                                }
                            }
                            this.errMsgList.push(_message);
                        });
                    });
                    if (this.model.onImportFailed) {
                        this.model.onImportFailed(result);
                    }
                } else {
                    this.errorNums = 0;
                    this.hasError = false;
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.toast(NxTranslateI18N.I18N.importComponent.importSuccess);
                        if (this.model.onImportSuccess) {
                            this.model.onImportSuccess(result);
                        }
                        this.close();
                    } else {
                        this.errMsgList.push(response.message);
                        this.isShowErrMsgTip = true;
                    }
                }
                this.importing = false;
            })
            .catch((reson) => {
                console.error(reson);
                Notify.toast(NxTranslateI18N.I18N.importComponent.importFailed, NotifyType.Error);
            });
    }
}
@NgModule({
    imports: [
        CommonModule,
        DxTemplateModule,
        DxPopupModule,
        DxButtonModule,
        DxScrollViewModule,
        DxLoadIndicatorModule,
        SafeHtmlModule,
        NxTranslateModule,
    ],
    declarations: [NxExcelImport],
    exports: [NxExcelImport],
})
export class NxExcelImportModule {}
