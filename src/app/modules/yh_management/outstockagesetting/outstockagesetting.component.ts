import { Component, OnInit, ViewChild } from '@angular/core';
import { OutStockAgeSettingService } from './outstockagesetting.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify, NotifyType } from 'src/app/providers/notify';
import { BasicSettingODataContext } from 'src/app/providers/odataContext';
import { DataDictionary, DataDictionarySource } from 'src/app/providers/enums';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { OutStockAgeSettingModel} from './outstockagesetting.model';
import { DataStatus, EditorGridComponent } from 'src/app/components/editor-grid';
import { DataValidator } from 'src/app/providers/common/dataValidator';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { Distinct } from 'src/app/providers/distinct';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import {OutStockAgeSettingDto } from './outstockagesetting.model';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { groupBy } from 'src/app/providers/groupby';

@Component({
    selector: 'outstockagesetting',
    templateUrl: './outstockagesetting.component.html',
    styleUrls: ['./outstockagesetting.component.scss'],
    providers: [OutStockAgeSettingService],
})
export class OutStockAgeSettingComponent implements OnInit {
    @ViewChild('editorGrid', { static: false })
    _editorGrid: EditorGridComponent;
    formData: OutStockAgeSettingModel = {} as any;
    @ViewChild('detailGrid', { static: false })
    _settingGrid: DxDataGridComponent;

    mode: 'create' | 'edit';
    /** datagrid数据源 */
    productDataAll: any[];
    settingDataSource: any;
    //属性
    ChickEggDataSource: any = [];
    //公母
    SexTypeDataSource: any = [];
    //代次
    GenerationLineDataSource: any = [];
    //鸡品系
    StrainLineDataSource: any = [];
    //系别
    DescentLineDataSource: any = [];
    //辅助单位
    MeasureUnitDataSource: any = [];
    //商品数据源
    productDataSource:any;
    productDataSourceAll: any[];
    //品种
    BreedingDataSource:any = [];
    //等级
    RemindDataSource:any = [];

    allMeasureUnitExtSource: any = [];

    allProductSource: any = [];
    /** 保存 */
    edited: boolean = true;
    saveStatus: boolean = true;
    loading: boolean = false;
    constructor(
        private service: OutStockAgeSettingService,
        private BasicOdataContext: BasicSettingODataContext,
        private statusOdataContext: StatusODataContext,
    ) {

    }
    onUpdate(type) {
        if(type=="2"){
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'save-btn').disabled = false;
        }
        this.edited = false;
    }
    isRepeat(arr) {
        var hash = {}
        for (let i = 0; i < arr.length; i++) {
            if (hash[arr[i].BreedingID]) {
                return true
            }
            hash[arr[i].BreedingID] = true
        }
        return false
    }
    //#endregion
    onSave() {
        if (this.saveStatus) {
            this._editorGrid.instance.save().then(() => {
                var data = this.service._detailInfoUtil.getSaveData();
                console.log(data);
                this.formData.OutStockAgeSettingDto=[];
                data.map((m)=>{
                    if(m['target'] != DataStatus.Delete){
                        this.formData.OutStockAgeSettingDto.push({
                            MaxDaysOld:m.MaxDaysOld||0,
                            BreedingID:m.BreedingID||'0',
                            BreedingName:m.BreedingName||'',
                            SexType:m.SexType||'0',
                            SexTypeName:m.SexTypeName||'',
                            MinDaysOld:m.MinDaysOld||0,
                            Target: m['target'] 
                        });
                    }
                })
                if(this.formData.OutStockAgeSettingDto.length==0){
                    Notify.error('表体不能为空！');
                    return false;
                };
                // var isType = this.isRepeat(this.formData.OutStockAgeSettingDto);
                // if (isType) {
                //     Notify.toast(`明细表中存在重复的品种，保存失败！`, NotifyType.Error);
                //     return null;
                // }
                const validator = new DataValidator(true);
                validator
                    .each(
                        this.formData.OutStockAgeSettingDto,
                        [
                            ['BreedingID', (data, value) => {
                                if (value && value != '0') return true;
                                return false;
                            }, '第 [$INDEX] 行:品种不能为空！'],
                            ['SexType', (data, value) => {
                                if (value && value != '0') return true;
                                return false;
                            }, '第 [$INDEX] 行:公母不能为空！'],
                            [
                                'MinDaysOld',
                                (data, value) => {
                                    if (value && Number(value)>0) return true;
                                    return false;
                                },
                                '第 [$INDEX] 行:最小出栏日龄必填，且为＞0的整数',
                            ],
                            [
                                'MaxDaysOld',
                                (data, value) => {
                                    if (value && Number(value)!=0 &&Number(value)<Number(data.MinDaysOld)) {
                                        return false;
                                    }
                                    return true;
                                },
                                '第 [$INDEX] 行:最大出栏日龄＜最小出栏日龄!',
                            ]
                        ],
                        '表体不能为空！'
                    );
                if (!validator.validation) {
                    this.saveStatus=true;
                    return;
                }

                let Batchs = groupBy(this.formData.OutStockAgeSettingDto, (item) => {
                    return item.BreedingID;
                });
                let flag = false;
                let msg = [];
                let flag2 = false;
                let msg2 = [];
                Batchs.forEach((d) => {
                    let reviewKeysgroupBy = groupBy(d, (item) => {
                        return item.SexType;
                    });
                    reviewKeysgroupBy.forEach((d1) => {
                       if(d1.length>1){
                            flag = true;
                            msg.push(d1[0].BreedingName+"-"+d1[0].SexTypeName);
                       }
                    });

                    if(d.length>1){
                        var tempd = d.filter(o=>o.SexType=='201711171453531103')
                        if(tempd&&tempd.length>0){
                            flag2 = true;
                            msg2.push(d[0].BreedingName);
                        }
                    }
                });
    
                if(flag){
                    Notify.toast("【"+msg.join(",")+"】重复，保存失败！", NotifyType.Error);
                     return false;
                }
                if(flag2){
                    Notify.toast("相同的品种【"+msg2.join(",")+"】，（公母=混合）与（公母=公/母）不能同时并存！", NotifyType.Error);
                     return false;
                }

                this.loading = true;
                this.service.put(this.formData).then((result: Result) => {
                    this.loading = false;
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.success('保存成功');
                        this._onSavedResetView();
                        this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'save-btn').disabled = true;
                        this.edited = true;
                    } else {
                        Notify.toast(response.message, NotifyType.Error);
                    }
                }).then(()=>{
                    this.loading = false;
                    this.saveStatus=true;
                });
            });
        }
        
    }
    private _onSavedResetView() {
        return this.service
            .load()
            .then((res: any) => {
                if (res.value.length > 0) {
                    var newres = res.value;
                    this.settingDataSource = this.service.getDataSource();
                    this.service._detailInfoUtil.init(newres);
                }else{
                    this.settingDataSource = this.service.getDataSource();
                    this.service._detailInfoUtil.default(6);
                }
            });

    }
   
    ngOnInit() {
        this.BreedingDataSource = this.BasicOdataContext.getZqBreedingsetDataSource({
            filter:[
                ['Status', '=', true]
            ],
            select: ['BreedingID', 'BreedingName'],
        });
        this.SexTypeDataSource =  DataDictionarySource.SexTypeSource;
        this._onSavedResetView();
    }
    onSettingOptionClick(e) {
        if (e.key == 'add') {
            this._addRowImpl();
        }
        else if (e.key == 'del') {
            this._deleteRowImpl();
        }
    }
    /** 增行 */
    _addRowImpl() {
        let _data = { Target: DataStatus.NewButNotEdit };
        let randomKey = undefined;
        const maxWhile = 10;
        let whileCount = 0;
        do {
            randomKey = Math.round(Math.random() * 10000000);
            if (whileCount > maxWhile) {
                break;
            }
            whileCount++;
        } while (this._settingGrid.instance.getRowIndexByKey(randomKey) > -1);
        _data[((<DataSource>this._settingGrid.dataSource).store() as CustomStore).key()] = randomKey;
        ((<DataSource>this._settingGrid.dataSource).store() as CustomStore).insert(_data).then(() => {
            this._settingGrid.instance.refresh();
            this.onUpdate("2");
        });
    }
    /** 删行 */
    _deleteRowImpl() {
        let _deleteKeys: any[] = this._settingGrid.instance.getSelectedRowKeys();
        if (!_deleteKeys || _deleteKeys.length == 0) {
            Notify.error('请选择数据！');
            return false;
        }
        ((<DataSource>this._settingGrid.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this._settingGrid.instance.refresh();
            this.onUpdate("2");
        });
    }
    async onEditorPreparingFn(e) {
        if (e.dataField && e.row.rowType == 'data') {
            const rowIndex = e.row.rowIndex;
            const rowData = e.row.data;
            if(e.dataField == 'BreedingID') {
                e.editorOptions.onValueChanged = async _e => {
                    const selectedItem = _e.component.option('selectedItem');
                    var BreedingID = "";
                    var BreedingName = "";
                    if(selectedItem){
                        if(selectedItem.BreedingID&&selectedItem.BreedingID!="0"){
                            BreedingID = selectedItem.BreedingID;
                            BreedingName = selectedItem.BreedingName;
                        }
                    }
                    var newData = deepCopy(rowData);
                    newData.BreedingID = BreedingID;
                    newData.BreedingName = BreedingName;
                    this.service._detailInfoUtil.setData(e.row.key, newData);
                    this._settingGrid.instance.refresh();
                    this.onUpdate("2");
                }
            } 
            else if(e.dataField == 'SexType') {
                e.editorOptions.onValueChanged = async _e => {
                    const selectedItem = _e.component.option('selectedItem');
                    var SexType = "";
                    var SexTypeName = "";
                    if(selectedItem){
                        if(selectedItem.SexType&&selectedItem.SexType!="0"){
                            SexType = selectedItem.SexType;
                            SexTypeName = selectedItem.SexTypeName;
                        }
                    }
                    var newData = deepCopy(rowData);
                    newData.SexType = SexType;
                    newData.SexTypeName = SexTypeName;
                    this.service._detailInfoUtil.setData(e.row.key, newData);
                    this._settingGrid.instance.refresh();
                    this.onUpdate("2");
                }
            } 
            else if(e.dataField == 'MinDaysOld') {
                e.editorOptions.onValueChanged = _e => {
                    var newData = deepCopy(rowData);
                    var Quantity=0;
                    if (_e.value) {
                        Quantity= Number(_e.value);
                    }
                    newData.MinDaysOld = (Quantity).toFixed(0);
                    this.service._detailInfoUtil.setData(e.row.key, newData);
                    this._settingGrid.instance.refresh();
                    this.onUpdate("2");
                }
            }
            else if(e.dataField == 'MaxDaysOld') {
                e.editorOptions.onValueChanged = _e => {
                    var newData = deepCopy(rowData);
                    var Quantity=0;
                    if (_e.value) {
                        Quantity= Number(_e.value);
                    }
                    newData.MaxDaysOld = (Quantity).toFixed(0);
                    this.service._detailInfoUtil.setData(e.row.key, newData);
                    this._settingGrid.instance.refresh();
                    this.onUpdate("2");
                }
            }
        }
    }
}
