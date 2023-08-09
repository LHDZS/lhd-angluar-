import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService, HasChickenFarmGuard } from 'src/app/shared/services';

const routes: Routes = [
    //保健提示
    {
        path: 'yhhealthtips',
        loadChildren: () => import('./yhhealthtips/yhhealthtips.module').then((m) => m.yhhealthtipsModule),
        canActivate: [AuthGuardService],
    },
    //免疫提示
    {
        path: 'yhImmunetips',
        loadChildren: () => import('./yhImmunetips/yhImmunetips.module').then((m) => m.yhImmunetipsModule),
        canActivate: [AuthGuardService],
    },
    //订药申请
    {
        path: 'yhdrugapplication',
        loadChildren: () =>
            import('./yhdrugapplication/yhdrugapplication.module').then((m) => m.YhDrugApplicationModule),
        canActivate: [AuthGuardService],
    },
    //领料规定
    {
        path: 'yhmaterialsettings',
        loadChildren: () =>
            import('./yhmaterialsettings/yhmaterialsettings.module').then((m) => m.yhmaterialsettingsModule),
        canActivate: [AuthGuardService],
    },
    //巡查填报
    {
        path: 'patrolrecord',
        loadChildren: () => import('./patrolrecord/patrolrecord.module').then((m) => m.PatrolrecordModule),
        canActivate: [AuthGuardService],
    },
    //批次交接单
    {
        path: 'yhbatchtransfer',
        loadChildren: () => import('./yhbatchtransfer/yhbatchtransfer.module').then((m) => m.YhBatchTransferModule),
        canActivate: [AuthGuardService],
    },
    //批次结算设置
    {
        path: 'yhsettlementsetting',
        loadChildren: () =>
            import('./yhsettlementsetting/yhsettlementsetting.module').then((m) => m.yhsettlementsettingModule),
        canActivate: [AuthGuardService],
    },
    //批次结算单
    {
        path: 'yhsettlement',
        loadChildren: () => import('./yhsettlement/yhsettlement.module').then((m) => m.yhsettlementModule),
        canActivate: [AuthGuardService],
    },
    //禽企运费设置
    {
        path: 'yhfarmerfreightsetting',
        loadChildren: () =>
            import('./yhfarmerfreightsetting/yhfarmerfreightsetting.module').then((m) => m.YHFreightSettingModule),
        canActivate: [AuthGuardService],
    },
    //肉禽出栏回收
    {
        path: 'yhouthouserecycle',
        loadChildren: () =>
            import('./yhouthouserecycle/yhouthouserecycle.module').then((m) => m.YHOutHouseRecycleModule),
        canActivate: [AuthGuardService],
    },
    //肉禽回收过磅
    {
        path: 'yhcycleweight',
        loadChildren: () => import('./yhcycleweight/yhcycleweight.module').then((m) => m.ZqYhCycleWeightModule),
        canActivate: [AuthGuardService],
    },
    //肉禽商品配置
    {
        path: 'yhproductpoultrymanage',
        loadChildren: () =>
            import('./yhproductpoultrymanage/yhproductpoultrymanage.module').then((m) => m.ZqPickupChickSettingModule),
        canActivate: [AuthGuardService],
    },
    //出栏日龄设置
    {
        path: 'outstockagesetting',
        loadChildren: () =>
            import('./outstockagesetting/outstockagesetting.module').then((m) => m.OutStockAgeSettingModule),
        canActivate: [AuthGuardService],
    },
    //清棚单
    {
        path: 'yhclearhouse',
        loadChildren: () => import('./yhclearhouse/yhclearhouse.module').then((m) => m.YHClearHouseModule),
        canActivate: [AuthGuardService],
    },
    //养户肉禽销售
    {
        path: 'yhpoultrysales',
        loadChildren: () => import('./yhpoultrysales/yhpoultrysales.module').then((m) => m.YHPoultrySalesModule),
        canActivate: [AuthGuardService],
    },
    //养户批次
    {
        path: 'yhbatch',
        loadChildren: () => import('./yhbatch/yhbatch.module').then((m) => m.yhBatchModule),
        canActivate: [AuthGuardService],
    },
    //养殖合同
    {
        path: 'Contract',
        loadChildren: () => import('./yhfarmercontract/contract.module').then((m) => m.contractModule),
        canActivate: [AuthGuardService],
    },
    //养户领料单
    {
        path: 'yhmaterialreceive',
        loadChildren: () =>
            import('./yhmaterialreceive/yhmaterialreceive.module').then((m) => m.YhMaterialReceiveModule),
        canActivate: [AuthGuardService],
    },
    //养户领苗单
    {
        path: 'yhchickenreceive',
        loadChildren: () => import('./yhchickenreceive/yhchickenreceive.module').then((m) => m.YhChickenReceiveModule),
        canActivate: [AuthGuardService],
    },
    //养户设置
    {
        path: 'yhfarmerInformation',
        loadChildren: () =>
            import('./yhfarmerInformation/yhfarmerInformation.module').then((m) => m.yhfarmerInformationModule),
        canActivate: [AuthGuardService],
    },
    //养户快捷新增
    {
        path: 'yhfamershortcut',
        loadChildren: () => import('./yhfamershortcut/yhfamershortcut.module').then((m) => m.yhfamershortcutModule),
        canActivate: [AuthGuardService],
    },
    //养殖场设置
    {
        path: 'yhchickenfarm',
        loadChildren: () => import('./yhchickenfarm/yhchickenfarm.module').then((m) => m.yhchickenfarmModule),
        canActivate: [AuthGuardService],
    },
    //药杂领用单
    {
        path: 'drugotherreceive',
        loadChildren: () => import('./drugotherreceive/drugotherreceive.module').then((m) => m.DrugOtherReceiveModule),
        canActivate: [AuthGuardService],
    },
    {
        //领用价格方案
        path: 'priceproposals',
        loadChildren: () => import('./priceproposals/priceproposals.module').then((m) => m.PriceProposalsModule),
        canActivate: [AuthGuardService],
    },
    {
        //领用特殊价格
        path: 'priceintercepter',
        loadChildren: () => import('./priceintercepter/priceintercepter.module').then((m) => m.PriceIntercepterModule),
        canActivate: [AuthGuardService],
    },
    {
        //回收销售计划
        path: 'buybackplan',
        loadChildren: () => import('./buybackplan/buybackplan.module').then((m) => m.BuyBackPlanModule),
        canActivate: [AuthGuardService],
    },
    {
        //保证金收支
        path: 'yhcashdeposit',
        loadChildren: () => import('./yhcashdeposit/yhcashdeposit.module').then((m) => m.YhCashDepositModule),
        canActivate: [AuthGuardService],
    },
    {
        //养殖价格方案
        path: 'farmingpriceproposals',
        loadChildren: () =>
            import('./farmingpriceproposals/farmingpriceproposals.module').then((m) => m.FarmingPriceProposalsModule),
        canActivate: [AuthGuardService],
    }, //补扣项目设置
    {
        path: 'subsidyprogramme',
        loadChildren: () => import('./subsidyprogramme/subsidyprogramme.module').then((m) => m.SubsidyProgrammeModule),
        canActivate: [AuthGuardService],
    },
    {
        path: 'echartsdemo',
        loadChildren: () => import('./echartsdemo/echartsdemo.module').then((m) => m.EchartsDemoModule),
        canActivate: [AuthGuardService],
    },
    {
        //养殖批次补扣
        path: 'farmingbatchsubsidy',
        loadChildren: () =>
            import('./farmingbatchsubsidy/farmingbatchsubsidy.module').then((m) => m.FarmingBatchSubsidyModule),
        canActivate: [AuthGuardService],
    },
    {
        // 批次公司利润
        path: 'batchcompanyprofit',
        loadChildren: () =>
            import('./batchCompanyProfit/batchCompanyProfit.module').then((m) => m.batchCompanyProfitModule),
        canActivate: [AuthGuardService],
    },
    {
        // 产蛋周龄指标
        path: 'layeggsindex',
        loadChildren: () => import('./layEggsIndex/layEggsIndex.module').then((m) => m.layEggsIndexModule),
        canActivate: [AuthGuardService],
    },
];

/**
 * 健康管理模块路由
 */
export const YHManagementRoutes = RouterModule.forRoot(routes, {
    useHash: true,
});
