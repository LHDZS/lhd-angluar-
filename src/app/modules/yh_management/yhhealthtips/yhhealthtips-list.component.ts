import { Component, ViewChild } from '@angular/core';
import { NxSearchPanel, NxConditionItem } from 'src/app/components/header-search-panel/header-search-panel-extend';
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxToolbarPanel, ColumnSetting } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { NxFormListComponent } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxDataGrid } from 'src/app/components/component-model/data-grid/model';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import {
    BasicSettingODataContext,
    QlwCustomerContext,
    QlwODataContext,
    YHProductionODataContext,
    YHBasicSettingODataContext,
    PermissionContext,
} from 'src/app/providers/odataContext';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { DataDictionary, FormOptions } from 'src/app/providers/enums';
import { Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { yhhealthtipsService } from './yhhealthtips.service';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { TokenAuthService } from 'src/app/shared/services';
import { DataSourceParamters } from 'src/app/providers/odataContext/helper';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { DateTime } from 'src/app/providers/common/datetime';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { Distinct } from 'src/app/providers/distinct';

@Component({
    selector: 'app-yhhealthtips-list',
    templateUrl: './yhhealthtips-list.component.html',
    styleUrls: ['./yhhealthtips-list.component.scss'],
})
export class yhhealthtipsListComponent {
    StateTypeSource: any;
    YHFarmerSource: any;
    YHBatchSource: any;
    CustomerSource: any;
    detailDataSource: any;
    headerFormData: any = {};
    colorStatusArr: any = {
        0:{color:'#E6A23C'},
        1:{color:'#67C23A'},
        2:{color:'#F56C6C'},
        3:{color:'#67C23A'},
        4:{color:'#67C23A'}
    };
    PromptTypeSource: any = [
        {
            name: '逾期预警',
            value: 2
        },
        {
            name: '提前提示',
            value: 1
        }
    ];
    ReferenceStateSource: any = [
        {
            name: '已引用',
            value: 1
        },
        {
            name: '未引用',
            value: 2
        }
    ];
    PersonSource: any;
    datasource: any;
    ProgramSource: any;
    CommonNameSource: any;
    constructor(
        private service: yhhealthtipsService,
        private basicSettingODataContext: BasicSettingODataContext,
        private router: Router,
        private qlwOdataContext: QlwODataContext,
        private statusODataContext: StatusODataContext,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        private yhProductionODataContext: YHProductionODataContext,
        private translator: TranslateService,
        private tokenService: TokenAuthService,
        private qlwCustomerContext: QlwCustomerContext,
    ) {

        this.StateTypeSource = this.statusODataContext.getWeighType();
        // 养户
        this.YHFarmerSource =  this.yhBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [
                [ 'Status', '=', true ]
            ]
        })
        //通用名
        this.basicSettingODataContext.Product.load().then((res:any) => {
            let data = res.filter(o => o.iSortPlus == DataDictionary.iSortB );
            this.CommonNameSource = Distinct(data,'CommonName');
        })
        //批次
        this.YHBatchSource = this.yhBasicSettingODataContext.getYHBatchDataSource();
        //保健程序
        this.service.HealthProgramList('').then((res:any) => {
            this.ProgramSource = res.value;
        })
        // 客户
        this.CustomerSource = this.qlwCustomerContext.getCustomerDataSource();
        this.PersonSource = this.qlwOdataContext.getQlWPersonOData()

        this.datasource = this.getListDataSource();
        this.detailDataSource = this.datasource;
    }

    ngOnInit() { 
        
    }

    /**
     * 获取列表/详情数据源
     * @param ComboPack 套餐
     */
    getListDataSource(): DataSource {
        let filter = '';
        // console.log(filter,'filter')
        return new DataSource({
            store: this.service.store,
            filter: filter.length > 0 ? filter : '',
        });
    }


    // 状态色值
    typeColor(type) {
        return this.colorStatusArr[type]
    }

    querySearch() {
        let filter = [];
        let data = this.headerFormData;
        if (data.CompareType) {
            filter.push(['CompareType', '=', data['CompareType']]);
        }
        if (data.QuoteStatus) {
            filter.push(['QuoteStatus', '=', data['QuoteStatus']]);
        }
        if (data.YHFarmerID) {
            filter.push(['YHFarmerID', '=', data['YHFarmerID']]);
        }
        if (data.PersonIDs) {
            filter.push(['PersonIDs', 'contains', data['PersonIDs']]);
        }
        if (data.BatchID) {
            filter.push(['BatchID', '=', data['BatchID']]);
        }
        if (data.ProcessName) {
            filter.push(['ProcessName', '=', data['ProcessName']]);
        }
        if (data.ProductCommonName) {
            filter.push(['ProductCommonName', '=', data['ProductCommonName']]);
        }
        if (filter.length > 0) {
            this.datasource.filter(filter);
            
        } else {
            this.datasource.filter('');
        }
        this.datasource.reload();
    }

    resetSearch() {
        this.headerFormData = {};
        this.datasource.filter('');
        this.datasource.reload();
    }

    //#endregion
}
