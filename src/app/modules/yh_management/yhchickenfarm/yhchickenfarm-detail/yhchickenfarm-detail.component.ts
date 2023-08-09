import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ActivatedRoute } from '@angular/router';
import {
    QlwODataContext,
    QlwCustomerContext,
    BasicSettingODataContext,
    QlwSystemContext } from 'src/app/providers/odataContext';
import DataSource from 'devextreme/data/data_source';
import {
    FormOptions,
    DataDictionary,
} from 'src/app/providers/enums';
import { RegExps } from 'src/app/providers/regexp';
import { USER_GUIDE_CONTEXT, USER_INFO_CONTEXT } from 'src/app/providers/context';
import { yhchickenfarmModel,AddressInfoEntity,yhchickenHenHouseModel,ZoningModel } from '../yhchickenfarm.model';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { Notify, NotifyType, MessageBox } from 'src/app/providers/notify';
import { yhchickenfarmService } from '../yhchickenfarm.service';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { TranslateI18N, TranslateService } from 'src/app/providers/i18n-translate';
import { retry } from 'rxjs-compat/operator/retry';
import { environment } from 'src/environments/environment';
import { UploadProvider } from 'src/app/providers/upload';
import { DateTime } from 'src/app/providers/common/datetime';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { TokenAuthService } from 'src/app/shared/services';

@Component({
    selector: 'app-yhchickenfarm-detail',
    templateUrl: './yhchickenfarm-detail.component.html',
    styleUrls: ['./yhchickenfarm-detail.component.scss'],
})

export class yhchickenfarmDetailComponent implements OnInit {
    @ViewChild('form', { static: false })
    formInstance: DxFormComponent;
    @ViewChild('ZoningForm', { static: false })
    ZoningFormInstance: DxFormComponent;
    $option: FormOptions = FormOptions.$modify;
    formData: any = new yhchickenfarmModel();
    submitOption: any;
    $save: boolean = true;
    $load: boolean = true;
    $deleted: boolean = true;
    $form: boolean = false;
    $date: boolean = true;
    loading: boolean = false;
    visibleFlag: boolean = false;
    today: Date = new Date();
    provinceText:any;
    ChickenFarmID: string = '';
    compareDataSource: yhchickenfarmModel;
    limitCharacter = RegExps.Forbidcharacter;
    warehouseSource: any;
    FeedWarehouseSource: any;
    DrugWarehouseSource: any;
    ticketedPointSource: any;
    $modifyProvince: boolean = false;
    $modifyCity: boolean = false;
    //地区三级数据
    provinceSource: any = [];
    provinceId: any;
    citySource: any = [];
    cityId: any;
    areaSource: any = [];
    areaId: any;
    privincenulldata: any;
    flag:boolean = false;
    //end地区三级数据
    stockWarehouseName: string;
    ChickenFarmTypeSource: any;
    //部门
    MarketSource: any;
    outDataDate: any;
    StatusSource: any = [
        {name: '启用',value: true},
        {name: '禁用',value: false}
    ];
    ZoningSource: any;
    formDataList: any = [];
    formData1: any = {};
    StartDate: any;
    showMapPop: boolean = false;
    MapRid: number = 0;
    mapsAddress: string;
    //区域下拉
    Province: any;
    City: any;
    County: any;
    CompanyProvince: any;
    CompanyCity: any;
    CompanyCounty: any;

    deleteVisible: boolean = false;
    delIndex: number;
    ChickenFarmNameAll: any = [];

    //场区
    popupVisible: boolean = false;
    formDataZoning: any =  new ZoningModel();
    submitZoningOption: any;
    saveDisabled: boolean = false;
    PoultryCategorySource:any;
    constructor(
        private route: ActivatedRoute,
        private basicSettingODataContext: BasicSettingODataContext,
        private service: yhchickenfarmService,
        private USER_GUIDE: USER_GUIDE_CONTEXT,
        private qlwOdataContext: QlwODataContext,
        private qlwSystemContext: QlwSystemContext,
        private translator: TranslateService,
        private qlwCustomerContext: QlwCustomerContext,
        private StatusODataContext: StatusODataContext,
        private tokenService: TokenAuthService,
    ) {
        this.warehouseSource = this.service.warehouseSource;

        //领用部门
        this.MarketSource = this.qlwCustomerContext.getBizMarketDataSource({
            filter: [
                ['IsUse', '=', 1],
                ['isEnd', '=', 1],
            ],
            select: ['MarketId', 'MarketName',],
        });
        this.PoultryCategorySource=[{Id:2,Name:"鸡"},{Id:8,Name:"鸭"}]
        this.ChickenFarmTypeSource = this.StatusODataContext.getFarmType();

        this.$option = this.route.queryParams['value']['$option'];
        this.ChickenFarmID = this.route.queryParams['value']['ChickenFarmID'] || '';



        this.submitOption = {
            text: '保存',
            type: 'success',
            onClick: this.onFormSubmit.bind(this),
        };

        this.submitZoningOption = {
            text: this.translator.I18N.commandOptions.save.text,
            type: 'default',
            onClick: this.onZoningFormSubmit.bind(this),
            disabled: false,
        };

        this.service.AllName().then((res:any) => {
            for (let i = 0; i < res.value.length; i++) {
                const element = res.value[i];
                this.ChickenFarmNameAll.push(element.ChickenFarmName)
            }
        })

        this.NameValidation = this.NameValidation.bind(this)

    }

    async ngOnInit() {
        await this.service.address(0).then((res: any) => {
            this.provinceSource = res.data  //获取省
        })

        if (this.$option == FormOptions.$modify) {
            this.$deleted = false;
            setTimeout(() => {
                this.load();
            },500)
            this.formDataList.push(new yhchickenHenHouseModel());
        } else {
            this.formData = new yhchickenfarmModel();
            //默认核算单元
            // new DataSource(this.qlwOdataContext.getAccountagencyODataDataSource()).load().then((result) => {
            //     if(result.length==1){
            //         this.formData.NTicketedPointID = result[0].TicketedPointId;
            //     }
            // });
            //获取最近养殖场类型
            this.service.YHFarmType().then((res:any) => {
                this.formData.YHFarmType = res.YHFarmType;
            })
            this.service.getLastPoultryCategory().then((res:any)=>{
                this.formData.PoultryCategory = res;
            })
            this.compareDataSource = deepCopy(this.formData);
        }
        // this.FeedWarehouseSource = this.basicSettingODataContext.getWareHouseDataSource({
        //     select: ['WarehouseID', 'WarehouseName'],
        // });

        // this.DrugWarehouseSource = this.basicSettingODataContext.getWareHouseDataSource({
        //     select: ['WarehouseID', 'WarehouseName'],
        // });




    }

    NameValidation(params) {
        return new Promise((resolve) => {
            setTimeout(() => {
              resolve(this.ChickenFarmNameAll.indexOf(params.value) == -1 );
            }, 1000);
          });
    }

    showMap(e) {
        this.showMapPop = true;
        this.MapRid = 0;
        //获取坐标 或者获取省市县 定位
        this.mapsAddress = this.formData.FullAddress;
    }
    //增加场区
    addZoning(e) {
        // console.log(e,'增加场区');
        this.popupVisible = true;
    }
    //#endregion
    onZoningFormSubmit(flag) {
        let validation = this.ZoningFormInstance.instance.validate().isValid;
        this.formDataZoning.ChickenFarmID = this.ChickenFarmID;
        if (validation) {
            this.saveDisabled = true;
            this.service.saveZoning(this.formDataZoning).then((result: Result) => {
                const response = ResponseSuccess.handle(result);
                if (response.status) {
                    Notify.toast(
                        `${this.translator.I18N.commandOptions.save.text}${response.message}`,
                        NotifyType.Success
                    );
                    this.$load = false;
                    this.ZoningSource = this.basicSettingODataContext.getYzcZoningDataSource({
                        filter:[['FarmID','=',this.formDataZoning.ChickenFarmID]],
                        select: ['ZoningID', 'ZoningName'],
                    });
                    setTimeout(() => {
                        if(flag){
                            this.create();
                        }else{
                            this.popupVisible = false;
                            this.saveDisabled = false;
                        }
                        this.$load = true;
                    }, 200);
                } else {
                    this.saveDisabled = false;
                    Notify.toast(response.message, NotifyType.Error);
                }
            });
        }
    }
    create() {
        this.saveDisabled = false;
        this.popupVisible = true;
        this.formDataZoning = new ZoningModel();
    }
    onHiding(e) {
        // this.formInstance.instance.resetValues();
    }
    popup_hiding(e) {
        if (!e) {
            return;
        }

        let province = e[0]['province'];
        let city = e[0]['city'];
        let district = e[0]['district'];
        if (this.MapRid == 0) {
            // this.formData.PostalAddress = new AddressInfoEntity();
            // this.formData.PostalAddress.latitude = e[0]['lat'];
            // this.formData.PostalAddress.longitude = e[0]['lng'];
            this.formData['LAT'] = e[0].nLatitude;
            this.formData['LON'] = e[0].nLongitude;
            this.formData.CoordinateAddr = province + city + district + e[0]['cCoordinateAddr'];

            this.formData.FullAddress = e[0]['cCoordinateAddr'];
            this.Province = e[0]['ProvinceId'];
            this.City = e[0]['CityId'];
            this.County = e[0]['CountyId'];
            this.formData.AreaID = this.County != '0' ? this.County : (this.City != '0' ? this.City : this.Province)
        } else {

            this.formData.CompanyFullAddress = e[0]['cCoordinateAddr'];
            this.CompanyProvince = e[0]['ProvinceId'];
            this.CompanyCity = e[0]['CityId'];
            this.CompanyCounty = e[0]['CountyId'];
            this.formData.CompanyAreaID = this.CompanyCounty != '0' ? this.CompanyCounty : (this.CompanyCity != '0' ? this.CompanyCity : this.CompanyProvince)
        }

    }
    // 添加栋
    addBuilding() {
        for (let i = 0; i < this.formDataList.length; i++) {
            const element = this.formDataList[i];
            element.type = false;
        }
        this.formDataList.push(new yhchickenHenHouseModel())
    }
    //删除栋
    delBuilding(i) {
        this.deleteVisible = true;
        this.delIndex = i;
    }
    //确认
    delConfirm() {
        if (this.formDataList[this.delIndex].HenHouseID) {
            this.service.HenHouseDel(this.formDataList[this.delIndex].HenHouseID).then((result: Result) => {
                const response = ResponseSuccess.handle(result);
                console.log(response,'保存栋舍')
                if (response.status) {
                    this.deleteVisible = false;
                    Notify.toast(`删除${response.message}`, NotifyType.Success);
                    this.load();
                    //更新场外信息数据源
                    // this.getBoarOrSowEarNumberData();
                } else {
                    Notify.toast(response.message, NotifyType.Error);
                }
            });
        } else {
            this.formDataList.splice(this.delIndex,1)
            this.deleteVisible = false;
        }
    }
    //取消
    delCancel() {
        this.deleteVisible = false;
    }
    //编辑栋
    editorBuilding(i) {
        for (let index = 0; index < this.formDataList.length; index++) {
            const element = this.formDataList[index];
            if (i == index) {
                element.type = true;
            } else {
                element.type = false;
            }
        }
    }
    //保存栋
    SubmitBuilding(i) {
        this.formDataList[i]['ChickenFarmID'] = this.formData.ChickenFarmID;
        this.formDataList[i]['HenHouseID'] = this.formDataList[i].HenHouseID || '0';
        this.formDataList[i]['iCount'] = this.formDataList[i].iCount || 0;
        this.formDataList[i]['AreaSize'] = this.formDataList[i].AreaSize || 0;
        this.formDataList[i]['ZoningID'] = this.formDataList[i].ZoningID || '0';
        this.formDataList[i]['CreateEnterpriseID'] = USER_INFO_CONTEXT.enterpriseId;
        this.formDataList[i]['ComboPack'] = this.formData.PoultryCategory==2?DataDictionary.ComboPackA:this.formData.PoultryCategory==8?DataDictionary.ComboPackB:"0";
        //
        this.loading = true;
        if (this.formDataList[i].HenHouseID != '0') {
            this.service.HenHousePut(this.formDataList[i]).then((result: Result) => {
                const response = ResponseSuccess.handle(result);
                this.loading = false;
                if (response.status) {
                    this.formDataList[i].type = false;
                    Notify.toast(`保存${response.message}`, NotifyType.Success);
                    this.load();
                    //更新场外信息数据源
                    // this.getBoarOrSowEarNumberData();
                } else {
                    Notify.toast(response.message, NotifyType.Error);
                }
            });
        } else {
            this.service.HenHousePost(this.formDataList[i]).then((result: Result) => {
                const response = ResponseSuccess.handle(result);
                this.loading = false;
                if (response.status) {
                    this.formDataList[i].type = false;
                    Notify.toast(`保存${response.message}`, NotifyType.Success);
                    this.load();
                    //更新场外信息数据源
                    // this.getBoarOrSowEarNumberData();
                } else {
                    Notify.toast(response.message, NotifyType.Error);
                }
            });
        }

    }

    // 省级
    onProvinceChanged(event) {
        if (this.$save  && this.$load) {
            this.$save = false;
        }
        if(this.flag){
            return ;
        }
        this.service.address(event.value).then((res: any) => {
            this.citySource = res.data;
            if (this.$option == FormOptions.$create) {
                this.cityId = res.data[0].id;
            } else {
                let newData = this.citySource.filter(d => { return d['id'] == this.cityId });
                if(newData && newData.length>0){
                    this.cityId = newData[0].id
                }

            }
        })
    }
    onCityChanged(event) {
        if(this.flag){
            this.flag = false;
            return;
        }
        this.service.address(event.value).then((res: any) => {
            this.areaSource = res.data;
            if (this.$option == FormOptions.$create) {
                this.areaId = res.data[0].id
            } else {
                let newData = this.areaSource.filter(d => { return d['id'] == this.areaId });
                if(newData && newData.length>0){
                    this.areaId = newData[0].id
                }
            }
        })
    }
    onFormSubmit() {
        if (!this.areaId || this.areaId == '-1') {
            Notify.toast(this.translator.I18N.chickenYHFarmSetting.AreaId.requestMessage, NotifyType.Error);
            return false;
        }
        if (this.formData.ChickenFarmName) {
            this.formData.ChickenFarmID = this.formData.ChickenFarmID || '0';
        } else {
            this.formData.ChickenFarmID = '';
        }
        const validation = this.formInstance.instance.validate().isValid;
        if (validation) {
            this.loading = true;
            this.formData.AreaID = (this.areaId).toString();
            if (this.$option == FormOptions.$create) {
                this.service.post(this.formData).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    this.loading = false;
                    this.$date = false;
                    setTimeout(() => {
                        this.$date = true;
                    }, 50);
                    if (response.status) {
                        Notify.toast(`保存${response.message}`, NotifyType.Success);
                        if (this.$option == FormOptions.$create) {
                            this.$option = FormOptions.$modify;
                            this.ChickenFarmID = response.data.ChickenFarmID;
                            this.formData.ChickenFarmID = this.ChickenFarmID;
                            // 保存成功更新对比数据源
                            this.compareDataSource = deepCopy(this.formData);
                            this.load();
                            this.$deleted = false;
                            this.$save = true;
                            this.$form = true;
                            // this.initEarTagDataSource();
                        }
                        //更新场外信息数据源
                        // this.getBoarOrSowEarNumberData();
                    } else {
                        Notify.toast(response.message, NotifyType.Error);
                    }
                });
            }
            if (this.$option == FormOptions.$modify) {
                this.service.put(this.formData).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    this.loading = false;
                    this.$date = false;
                    this.$save = true;
                    setTimeout(() => {
                        this.$date = true;
                    }, 50);
                    if (response.status) {
                        // 修改成功更新对比数据源
                        this.compareDataSource = deepCopy(this.formData);
                        this.load();
                        Notify.toast(`修改${response.message}`, NotifyType.Success);
                        //更新场外信息数据源
                        // this.getBoarOrSowEarNumberData();
                    } else {
                        Notify.toast(response.message, NotifyType.Error);
                    }
                });
            }
        }
    }
    add() {
        this.$option = FormOptions.$create;
        this.$deleted = true;
        this.$form = false;
        // if (!this.$deleted) {
            this.cancel();
        // }
    }
    cancel() {
        if (this.$option == FormOptions.$create) {
            this.formInstance.instance.resetValues();
            this.formData = new yhchickenfarmModel();
            //默认核算单元
            // new DataSource(this.qlwOdataContext.getAccountagencyODataDataSource()).load().then((result) => {
            //     if(result.length==1){
            //         this.formData.NTicketedPointID = result[0].TicketedPointId;
            //     }
            // });
            this.compareDataSource = deepCopy(this.formData);
            this.provinceId=-1;
            this.areaId=-1;
            this.cityId=-1;
            this.flag = true;
            setTimeout(() => {
                this.$save=true;
            }, 50);
        } else {
            this.load();
        }
    }

    load() {
        var Param = 'ChickenFarmID=' + this.ChickenFarmID;
        this.service
        .byKey(<any>Param)
        .then((res: any) => {
            if(res.isSuccess){
                this.$load = false;
                var value = res.data[0];
                var newValue = value;
                // 排除当前单据名称
                let index = this.ChickenFarmNameAll.indexOf(newValue.ChickenFarmName);
                this.ChickenFarmNameAll.splice(index,1);
                // #
                this.StartDate = newValue.StartDate;
                this.formData = deepCopy(newValue);
                this.compareDataSource = deepCopy(this.formData);
                this.formDataList = deepCopy(newValue.Details);
                this.service.address(Number(this.formData.AreaID), 1).then((res: any) => {
                    if (res.data.length) {
                        let axis = res.data[0].axis;
                        let arr = axis.split('$');
                        this.provinceId = Number(arr[1]);
                        this.cityId = Number(arr[2]);
                        this.areaId = Number(arr[3]);
                        setTimeout(() => {
                            this.$load = true;
                        }, 100);
                    }
                })
                // 场区
                this.ZoningSource = this.basicSettingODataContext.getYzcZoningDataSource({
                    filter:[['FarmID','=',this.ChickenFarmID]],
                    select: ['ZoningID', 'ZoningName'],
                });
            }
        });
    }

    _onValueChanged(e) {
        if (e.value) {
            this.formData.StartDate = new DateTime(e.value.toString()).toString('yyyy-MM-dd');
        } else {
            this.formData.StartDate = null;
        }
        if (this.$save && this.$load) {
            this.$save = false;
        }
    }

    onFieldDataChanged(e) {
        if (this.compareDataSource&&e.dataField&&e.dataField!="DomainEvents") {
            if (this.compareDataSource[e.dataField] != e.value) {
                if (this.$save && this.$load) {
                    this.$save = false;
                }
            }
        }
        // if (e.dataField == 'iCount') {
        //     console.log(e,i);
        //     this.formDataList[i].iCount = Math.floor(e.value)
        // }
    }

    deleteData() {
        MessageBox.confirm('您确认要删除吗', '提示').then((confirm) => {
            if (confirm) {
                this.service.deleteList([{ ChickenFarmID: this.ChickenFarmID }]).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        this.formInstance.instance.resetValues();
                        this.formData = new yhchickenfarmModel();
                        //默认核算单元
                        // new DataSource(this.qlwOdataContext.getAccountagencyODataDataSource()).load().then((result) => {
                        //     if(result.length==1){
                        //         this.formData.NTicketedPointID = result[0].TicketedPointId;
                        //     }
                        // });
                        this.compareDataSource = deepCopy(this.formData);
                        this.provinceId=-1;
                        this.areaId=-1;
                        this.cityId=-1;
                        this.$deleted = true;
                        this.$form = true;
                        this.flag = true;
                        setTimeout(() => {
                            this.$save = true;
                        }, 50);
                        Notify.toast('删除成功');
                    } else {
                        Notify.toast(response.message, NotifyType.Error);
                    }
                });
            }
        });

    }
    redirectToAddProduct() {
        this.USER_GUIDE.toSetProduct();
    }

    /**
     * 判断鸡场类型
     * @returns 是否是养殖场
     */
    // private getStockWarehouseName() {
    //     if (this.service.PoultryFarmType == DataDictionary.FarmTypeA) {
    //         return TranslateI18N.I18N.chickenYHFarmSetting.Warehouse.poultry;
    //     }else if (this.service.PoultryFarmType == DataDictionary.FarmTypeB) {
    //         this.visibleFlag = true;
    //         return TranslateI18N.I18N.chickenYHFarmSetting.Warehouse.hatchery;
    //     }else {
    //         return '';
    //     }
    // }

}
