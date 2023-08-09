import { Component, OnInit, ViewChild } from '@angular/core';
import { PickupChickSettingService } from './yhproductpoultrymanage.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify, NotifyType } from 'src/app/providers/notify';
import { BasicSettingODataContext } from 'src/app/providers/odataContext';
import { DataDictionary } from 'src/app/providers/enums';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { PickupChickSettingModel} from './yhproductpoultrymanage.model';
import { DataStatus, EditorGridComponent } from 'src/app/components/editor-grid';
import { DataValidator } from 'src/app/providers/common/dataValidator';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { Distinct } from 'src/app/providers/distinct';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import {ZqPickupChickSettingDto } from './yhproductpoultrymanage.model';

@Component({
    selector: 'yhproductpoultrymanage',
    templateUrl: './yhproductpoultrymanage.component.html',
    styleUrls: ['./yhproductpoultrymanage.component.scss'],
    providers: [PickupChickSettingService],
})
export class PickupChickSettingComponent implements OnInit {
    @ViewChild('editorGrid', { static: false })
    _editorGrid: EditorGridComponent;
    formData: PickupChickSettingModel = {} as any;
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
        private service: PickupChickSettingService,
        private BasicOdataContext: BasicSettingODataContext,
        private statusOdataContext: StatusODataContext,
    ) {

    }
    onUpdate() {
        this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'save-btn').disabled = false;
        this.edited = false;
    }
    isRepeat(arr) {
        var hash = {}
        for (let i = 0; i < arr.length; i++) {
            if (hash[arr[i].ProductID]) {
                return true
            }
            hash[arr[i].ProductID] = true
        }
        return false
    }
    //#endregion
    onSave() {
        if (this.saveStatus) {
            this._editorGrid.instance.save().then(() => {
                var data = this.settingDataSource._items ? this.settingDataSource._items : this.settingDataSource;
                this.formData.Details=[];
                data.map((m)=>{
                    if(m.ProductID&&m.ProductID!="0"){
                        this.formData.Details.push({
                            ComboPack:DataDictionary.ComboPackA,
                            GroupID:m.GroupID,
                            EnterpriseID:m.EnterpriseID,
                            ProductID:m.ProductID,
                            PoultrySalesRank:m.PoultrySalesRank,
                            BreedingID:m.BreedingID || '0',
                            SexType:m.SexType,
                            UnitName:m.UnitName?m.UnitName:"0",
                            Status:m.Status?m.Status:"0",
                            Target: m.Target || 1,
                            RecordID: m.RecordID
                        });
                    }
                })
                const validation = this.dataValidation(this.formData.Details);
                if(validation){
                    var flag = true;
                    this.formData.Details.map((m)=>{
                        if(m.UnitName != '公斤'){
                            flag = false;
                        }
                    })
                    var isType = this.isRepeat(this.formData.Details);
                    if (isType) {
                        Notify.toast(`明细表中存在重复的商品代号，保存失败！`, NotifyType.Error);
                        return null;
                    }
                    if(!flag){
                        Notify.warning(`计量单位必须设置为“公斤”！请到商品代号中修改！`);
                        return;
                    }
                    let delData = this.service._feedingInfoUtil.getSaveData();
                    for (let j = 0; j < delData.length; j++) {
                        const element = delData[j];
                        if (element['target'] == 3 && element.ProductID) {
                            this.formData.Details.push(element)
                        }
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
                        this.saveStatus=true;
                    });
                }
            });
        }
    }
    private dataValidation(data): boolean {
        const validator = new DataValidator(true);
        if(data.length>0){
            validator.forObjRequire(data, [
                ['ProductID', '商品代号必填'],
                ['SexType', '公母必填'],
                ['PoultrySalesRank', '等级必填'],
            ]);
        }
        return validator.validation;
    }
    private _onSavedResetView() {
        return this.service
            .load()
            .then((res: any) => {
                // this.productDataAll = [];
                // var newres =  setFirstToUpperCase(res);
                if (res.value.length > 0) {
                    var newres = res.value.map((m,i)=>{
                        //重组批号规则
                        // m.RecordID=i+1;
                        m['bUseName'] = m.bUse ? '在用' : '停用';
                        m['Target'] = 0;
                        // this.productDataAll.push(m.ProductID)
                        return m
                    })
                    this.GetProductID();
                    this.settingDataSource = this.service.getDataSource();
                    this.service._feedingInfoUtil.init(newres);
                } else {
                    let arr = []
                    for (let o = 0; o < 6; o++) {
                        arr.push(new ZqPickupChickSettingDto())
                    }
                    var newre = arr.map((m,i)=>{
                        //重组批号规则
                        m['RecordID']=i+1;
                        m['Target'] = 0;
                        m['ProductID'] = '0'
                        return m
                    })
                    this.GetProductID();
                    this.settingDataSource = this.service.getDataSource();
                    this.service._feedingInfoUtil.init(newre);
                }
                
            });

    }
    GetProductID() {
        // this.productDataSource = [];
        var iSort = "iSortPlus=" + DataDictionary.iSortF + "&";
        this.service
            .getProduct(<any>iSort)
            .then((res: any) => {
                this.productDataSourceAll = res.value;
                // for (let i = 0; i < res.value.length; i++) {
                //     const element = res.value[i];
                //     if (this.productDataAll.indexOf(element.ProductID) == -1) {
                //         this.productDataSource.push(element)
                //     }
                    
                // }
            });
    }
    ngOnInit() {
        this.ChickEggDataSource = this.BasicOdataContext.getBizDataDictDataSource({
            filter: [[['Pid', '=', DataDictionary.ChickEggID]]],
            select: ['DictId', 'DictName'],
        });
        this.GenerationLineDataSource = this.BasicOdataContext.getBizDataDictDataSource({
            filter: [[['Pid', '=', DataDictionary.GenerationLine]]],
            select: ['DictId', 'DictName'],
        });
        this.DescentLineDataSource = this.BasicOdataContext.getBizDataDictDataSource({
            filter: [[['Pid', '=', DataDictionary.DescentLine]]],
            select: ['DictId', 'DictName'],
        });
        this.SexTypeDataSource = this.BasicOdataContext.getBizDataDictDataSource({
            filter: [[['Pid', '=', DataDictionary.SexType]]],
            select: ['DictId', 'DictName'],
        });
        this.StrainLineDataSource = this.BasicOdataContext.getBizStrainLineDataSource({
            filter: [[
                ['PoultryType', '=', DataDictionary.PoultryTypeA],
                'or',
                ['PoultryType', '=', DataDictionary.PoultryTypeB]
            ]],
            select: ['StrainLineID', 'StrainLineName'],
        });
        this.BreedingDataSource = this.BasicOdataContext.getZqBreedingsetDataSource({
            filter:[
                ['Status', '=', true]
            ],
            select: ['BreedingID', 'BreedingName'],
            // ,['Status', '=', 1],
        });
        this.RemindDataSource = this.BasicOdataContext.getBizRemindGroupDataSource({
            filter: [
                ['Status', '=', true],
                [
                    'PID', '=', '2201051734480004080'
                ]
            ],
            select: ['RemindID', 'RemindName'],
        })
        
        this._onSavedResetView();
    }
    async getMeasureUnitExt(data) {
        if (!data || data.length == 0) {
            return false;
        }
        var ProductID = '0';
        var newData = Distinct(data, 'ProductID');
        newData.forEach(async (result) => {
            if (result['ProductID']) {
                var productData = this.allMeasureUnitExtSource.filter((o) => o.productId == result['ProductID']);
                if (!productData || productData.length == 0) {
                    ProductID += result['ProductID'] + ',';
                }
                var unitData = this.allProductSource.filter((o) => o.productId == result['ProductID']);

                if (!unitData || unitData.length == 0) {
                    await this.service.getProductInfo(result['ProductID']).then((res: any) => {
                        if (res && res.data) {
                            if (res.data.auxiliaryMeasureUnitList && res.data.auxiliaryMeasureUnitList.length > 0) {
                                var units = Distinct(res.data.auxiliaryMeasureUnitList, 'id');
                                units.forEach((row) => {
                                    row.MeasureUnitExt = row.id;
                                    row.MeasureUnitNameExt = row.name;
                                });
                                res.data['units'] = units;
                            }
                            this.allProductSource.push(res.data);
                        }
                    });
                }
            }
        });
    }
    subBatchRule(m){
        if(m){
            if(m.BatchRule){
                m['HatchBatchID'] = m.BatchRule[0]=="0"?false:true;
                m['cProductID'] = m.BatchRule[1]=="0"?false:true;
                m['HatcherID'] = m.BatchRule[2]=="0"?false:true;
                m['FarmID'] = m.BatchRule[3]=="0"?false:true;
                m['HenhouseID'] = m.BatchRule[4]=="0"?false:true;
                m['BatchID'] = m.BatchRule[5]=="0"?false:true;
                m['BreedingID'] = m.BatchRule[6]=="0"?false:true;
                m['Debeaking'] = m.BatchRule[7]=="0"?false:true;
                m['ImmuneSubjectID'] = m.BatchRule[8]=="0"?false:true;
            }
        }
    }
    appendBatchRule(m){
        var rule ="";
        //相加
        if(m){
            rule = (m['HatchBatchID']?"1":"0")+(m['cProductID']?"1":"0")+(m['HatcherID']?"1":"0")+(m['FarmID']?"1":"0")+(m['HenhouseID']?"1":"0")+(m['BatchID']?"1":"0")+(m['BreedingID']?"1":"0")+(m['Debeaking']?"1":"0")+(m['ImmuneSubjectID']?"1":"0");
        }
        return rule;
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
        let _data = { target: DataStatus.NewButNotEdit };
        _data["ProductID"] = "0";
        _data["BreedingID"] = "0";
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
            this.onUpdate();
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
            this.onUpdate();
        });
    }
    ProductFilterData () {
        return this.productDataSourceAll.map(m => {
            if (this.productDataAll.indexOf(m.ProductID) == -1) {
                m['disabled'] = false;
            } else {
                m['disabled'] = true;
            }
            return m
        })
    }
    //商品代选择
    async onCustomOpened(e,_e) {
        const rowData = e.row.data;
        this.productDataAll = [];
        let dataAll = this.service._feedingInfoUtil.getData();
        if (dataAll.length > 0) {
            for (let i = 0; i < dataAll.length; i++) {
                const element = dataAll[i];
                if (rowData.ProductID != element.ProductID) {
                    this.productDataAll.push(element.ProductID)
                }
            }
        }

        this.productDataSource = await this.ProductFilterData();
    }
    onProductChanged(e,_e) {
        // e.editorOptions.dataSource = this.ProductFilterData();
        const rowData = e.row.data;
        const selectedItem = _e.component.option('selectedItem');
        
      
        rowData['ProductID'] = selectedItem.ProductID;
        rowData['cProductName'] = selectedItem.cProductName;
        rowData['UnitName'] = selectedItem.MeasureUnitName;
        rowData['BreedingID'] = '';
        if (rowData.Target == 0) {
            rowData['Target'] = 2;
        }          
                    
        this._settingGrid.instance.refresh();       
    }
    onValueChanged(e,_e) {
        const rowData = e.row.data;
        
        let dataAll = this.service._feedingInfoUtil.getData();
        for (let i = 0; i < dataAll.length; i++) {
            const element = dataAll[i];
            if (rowData.RecordID == element.RecordID) {
                // this.productDataAll.push(element.ProductID)
                element['BreedingID'] = _e.value;
                if (element.Target == 0) {
                    element['Target'] = 2;
                }
            }
        }
        this._settingGrid.instance.refresh();
    }
    async onEditorPreparingFn(e) {

        if (e.dataField && e.row.rowType == 'data') {
            const rowIndex = e.row.rowIndex;
            const rowData = e.row.data;
            
            
            // e.editorOptions.onValueChanged = (args) => {
                
            //     setTimeout(() => {
            //         // 将选中的文本值赋值到数据源上,_changedValue是下拉数据中对应的文本值
            //         e.setValue(args.value, args.component._changedValue);
            //     }, 0);
                
            // };

            if(e.dataField == 'ProductID') {
                
                
            } 
            else if(e.dataField == 'SexType') {
                e.editorOptions.onValueChanged = _e => {
                    rowData['SexType'] = _e.value;
                    rowData['Target'] = 2;
                    this._settingGrid.instance.refresh();
                }
            }
            else if(e.dataField == 'PoultrySalesRank') {
                e.editorOptions.onValueChanged = _e => {
                    rowData['PoultrySalesRank'] = _e.value;
                    rowData['Target'] = 2;
                    this._settingGrid.instance.refresh();
                }
            }
            // else if(e.dataField == 'BreedingID') {
            //     e.editorOptions.onValueChanged = _e => {
            //         rowData['BreedingID'] = _e.value;
            //         rowData['Target'] = 2;
            //         this._settingGrid.instance.refresh();
            //     }
            // }
        }
    }
}
