import { environmentType } from './environmentType';
export const environment = {
    environmentType: environmentType.local,
    production: false,
    token: {
        userInfo: {
            userId: 1842332,//1806728,1806734
            userName: '白静雨',
            enterpriseId: '1970973', //1835918,1843158
            menuId: '2303201441430000150',//2201271755100000109 //2202131822330000109p
            enterpriseName: '新肉禽放养bjy专用', //
            childId: '0',
            chickenFarmName: '',
            enteDate: '2022-3',
            enterGroupId: '1970974',//1832805,1843159
            enterGroupName: '新肉禽放养bjy专用',
        },
        // userInfo: {
        //     userId: 1806728,//1806728,1806734
        //     userName: '曾桂有',
        //     enterpriseId: '1835918', //1835918,1843158
        //     menuId: '2202231742510000309',//2204020855040000109 //2202231742510000309
        //     enterpriseName: '种鸡2.0测试', //种鸡2.0测试
        //     childId: '2204131714420000076',//2204131714420000076,2203181813480000076
        //     chickenFarmName: '孵化第四厂',
        //     enteDate: '2022-3',
        //     enterGroupId: '1832805',//1832805,1843159
        //     enterGroupName: '种鸡2.0版',
        // },
        // userInfo: {
        //     userId: 1806728,//1806728,1806734
        //     userName: '曾桂有',
        //     enterpriseId: '1808019', //1835918,1843158
        //     menuId: '2204020855040000109',//2201271755100000109 //2202131822330000109
        //     enterpriseName: '种鸡2.0测试', //种鸡2.0测试
        //     childId: '2111141822120001076',//2204131714420000076,2203181813480000076
        //     chickenFarmName: '蛋鸡',
        //     enteDate: '2022-3',
        //     enterGroupId: '1808020',//1832805,1843159
        //     enterGroupName: 'S禽成本',
        // },
        // userInfo: {
        //     userId: 1806728,//1806728,1806734
        //     userName: '曾桂有',
        //     enterpriseId: '1832804', //1835918,1843158
        //     menuId: '2202231742510000309',//2201271755100000109 //2202131822330000109
        //     enterpriseName: '种鸡2.0测试', //种鸡2.0测试
        //     childId: '2201271506030000076',
        //     chickenFarmName: '孵化第四厂',
        //     enteDate: '2022-3',
        //     enterGroupId: '1832805',//1832805,1843159
        //     enterGroupName: '种鸡2.0版',
        // },
        server: ' https://apiqlw.t.nxin.com/st', //开发用的
        requestIgnore: [
            'https://apiqlw.t.nxin.com/st',
            '/api/auth',
            '.json',
            '.xlsx',
            '.xls',
            'https://open.t.nxin.com',
        ],
        refreshTiming: 60 * 1000 * 30,
        validationTiming: 1000 * 5,
        homePage: 'https://www.t.nxin.com',
    },
    appSource: 'qqlw',
    appCode: '5BC6BEAC-1F97-4FF9-AA7B-17BAD696324C',
    zlwPrintService: 'https://apiqlw.t.nxin.com/qlw/print', //打印api
    zlwUri: 'https://zqlw.t.nxin.com',

    //#region  测试环境
    zlwBasicSettingServer:  'https://apiqlw.t.nxin.com/z/basic', // 基础设置
    ylwBasicSettingServer:  'https://apiqlw.t.nxin.com/y/basic', // https://localhost:5002   https://apiqlw.t.nxin.com/y/basic
    zlwProductionServer: 'https://apiqlw.t.nxin.com/z/production', // 基础
    zlwProductionReadServer: 'https://apiqlw.t.nxin.com/z/production-read',
    zlwProductionlimitServer: 'https://apiqlw.t.nxin.com/z/production-limit', //限流
    zlwProductionSowServer: 'https://apiqlw.t.nxin.com/z/production/sow', // 母猪生产
    zlwProductionSowReadServer: 'https://apiqlw.t.nxin.com/z/production-sow-read',
    qlwCommonService: 'https://apiqlw.t.nxin.com/qlw/base', // 企联网商品服务
    // qlwCommonService: 'http://10.100.25.67:5000', // 企联网商品服务
    qlwSystemServerOq: 'https://apiqlw.t.nxin.com/sys/oq', // 企联网系统服务
    //
    qlwProductService: 'https://apiqlw.t.nxin.com/base/product', // 企联网商品服务
    zlwPromptManageServer: 'https://apiqlw.t.nxin.com/z/production/prompt', // 生产提示
    zlwMaterialsManageServer: 'https://apiqlw.t.nxin.com/z/materials', // 物资
    zlwhealthManageServer: 'https://apiqlw.t.nxin.com/z/health', //健康管理
    zlwReportPigServer: 'https://apiqlw.t.nxin.com/z/reportpig', //指标
    qlwSystemServer: 'https://apiqlw.t.nxin.com/sys', // 企联网系统服务
    zlwcostServer: 'https://apiqlw.t.nxin.com/z/cost', // 成本
    qlwCustomer: 'https://apiqlw.t.nxin.com/qlw/customer', // 客户/供应商
    qlwBizMarket: 'https://apiqlw.t.nxin.com/qlw/market', //区域
    qlwProductSetUrl: 'https://baseqlw.t.nxin.com/ProductWeb/ProductList?appid=1708231814060000101', //设置企联网商品地址
    qlwSimpleProductSetUrl: 'https://baseqlw.t.nxin.com/SimpleProduct/QdProductList?appid=1811011724160000130', //设置企联网产品地址
    zlwBreedingServer: 'https://apiqlw.t.nxin.com/z/breeding', // 育种
    zlwOpsServer: 'https://apiqlw.t.nxin.com/z/ops', // 数据运维
    //#endregion
    /**
     * 审核
     */
    review: {
        review: 'https://apiqlw.t.nxin.com/qlw/base/api/QLW_Review/GetRereiew',
        zlwIsReviewed: 'https://arcqlw.t.nxin.com/qlw/base/api/QLW_Review/2/IsReviewed',
        reviewOperate: 'https://apiqlw.t.nxin.com/qlw/base/api/QLW_Review/OperateReview',
        batchReviewOperate: 'https://apiqlw.t.nxin.com/qlw/base/api/QLW_Review/BatchOperateReview', //批量审核
        source: 5, // 猪联网
    },
    gatway: {
        infomation: 'https://open.t.nxin.com/api/nxin.information.content.list/1.0',
        disease: 'https://open.t.nxin.com/api/nxin.zbt.disease.list/1.0',
        symptomata: 'https://open.t.nxin.com/api/nxin.zbt.symptom.list/1.0',
        menu: 'https://open.t.nxin.com/api/nxin.permission.qlwpc.menulist/4.0',
        useMenu: 'https://open.t.nxin.com/api/nxin.qlwbase.menu.usualmenu.list/1.0',
        addMenu: 'https://open.t.nxin.com/api/nxin.qlwbase.menu.usualmenulist.add/1.0',
        delMenu: 'https://open.t.nxin.com/api/nxin.qlwbase.menu.usualmenulist.del/1.0',
        customerArrears: 'https://open.t.nxin.com/api/nxin.zlw.receivablesummarydata.list/1.0',
        enterthenumber: 'https://open.t.nxin.com/api/nxin.zlw.lsvehicleregisters.lst/1.0',
        GetPayMented: 'https://open.t.nxin.com/api/nxin.zlw.getpaymented.list/1.0',
        getpurchase: 'https://open.t.nxin.com/api/nxin.inputs.getpurchaseamounttotal/1.0',
        getsell: 'https://open.t.nxin.com/api/nxin.inputs.getsalesamounttotal/1.0',
        getstock: 'https://open.t.nxin.com/api/nxin.inputs.getlastcategorystock/1.0',
        getopenapp: 'https://open.t.nxin.com/api/nxin.qlw.sc.isenteropenapp/1.0',
        getGroupPurchase: 'https://open.t.nxin.com/api/nxin.sc.groupPurchase.list/1.0',
        qlwPurchasing: 'https://open.t.nxin.com/api/nxin.inputs.savepostforpurchase/1.0', //物资采购
        wmInventoryCheck: 'https://open.t.nxin.com/api/nxin.BusinessShop.wminventorydata.add/1.0', //物资盘点
        productStock: 'https://open.t.nxin.com/api/nxin.inputs.getproductstockpostgateway/1.0', //根据仓库获取当前仓库库存
        getProductStock: 'https://open.t.nxin.com/api/nxin.inputs.getstockbyproductgateway/1.0', //根据商品获取仓库库存数据
        lastPurchasingRecord: 'https://open.t.nxin.com/api/nxin.inputs.getpurchaselastdata/1.0', //最新一条采购记录
        saveWareHouse: 'https://open.t.nxin.com/api/nxin.inputs.savewarehouse/1.0',
        api: 'https://open.t.nxin.com/api',
        changeIdentity: 'https://open.t.nxin.com/api/nxin.usercenter.biz.switch.identity/2.0',
        guideRecord: 'https://open.t.nxin.com/api/nxin.usercenter.guide.record/1.0',
        threeMenuList: 'https://open.t.nxin.com/api/nxin.permission.qlwpc.third.menulist/1.0', // 企联网PC端末级菜单--浏览器调用
        getProductInfo: 'https://open.t.nxin.com/api/nxin.qlwbase.product.formual.get/1.0', //获取商品信息
        //入库批号
        getproductiondata:'https://open.t.nxin.com/api/nxin.inputs.getproductiondata/1.0',
        formula : 'https://dataset.t.nxin.com/' , //计算器
    },
    /** 人力域名 */
    hrUri: 'https://hrqlw.t.nxin.com',
    /** 中台基础域名 */
    baseUri: 'https://baseqlw.t.nxin.com',
    /** 仓储管理域名 */
    wmUri: 'https://wmqlw.t.nxin.com',
    /** 猪小智 */
    intelligentUri: 'https://zxzz.t.nxin.com',
    /** 财务域名 */
    fmqlw: 'https://fmqlw.t.nxin.com',
    /** 企联网域名 */
    qlw: 'https://qlw.t.nxin.com',
    /** 采购管理域名 */
    pmUri: 'https://pmqlw.t.nxin.com',
    /**监管大屏 */
    watchPlatUrl: 'https://zxzz.t.nxin.com',
    /**商城 */
    mallUrl: 'https://sc.t.nxin.com',
    /** 域 */
    domain: 'localhost',
    /**会员版套餐 */
    memberVersion: ['2102071754070000101', '2111161305330000101'],
    /**国际版套餐 */
    globalVersion: '2102241341420000101',
    ENV: 'DEV',
    qlwAssem: 'https://apiqlw.t.nxin.com/assem', //自定义打印
    printPage: 'https://print.t.nxin.com', //打印页地址
    desiUrl: 'https://webqlw.t.nxin.com', //打印页地址
    homeUrl: 'https://home.t.nxin.com', //企业主页
    faUri: 'https://apiqlw.t.nxin.com/qlw/fm',

    //基础业务中台
    BaseCustomer: 'https://apiqlw.t.nxin.com/base',
    //架构中台
    commonOdataContext: 'https://apiqlw.t.nxin.com/qlw/base',
    // 标准成本管理
    costManagementServer: 'https://apiqlw.t.nxin.com/cost/management',
    //养户基础服务
    yhBasicSettingServer: 'https://apiqlw.t.nxin.com/yh/basic',//'https://apiqlw.t.nxin.com/yh/basic', // https://localhost:5102
    //养户基础服务（读操作）
    yhBasicSettingReadServer: 'https://apiqlw.t.nxin.com/yhr/basic',//'https://apiqlw.t.nxin.com/yhr/basic', // https://localhost:5103
    //养户生产单据服务
    yhProductionServer: 'http://10.221.252.78:9155',//'https://apiqlw.t.nxin.com/yh/production', // https://localhost:5105 //http://10.221.252.78:9155
    //养户生产单据服务（读操作）
    yhProductionReadServer: 'http://10.221.252.78:9156',//'https://apiqlw.t.nxin.com/yhr/production', // https://localhost:5104 //http://10.221.252.78:9156

    //禽联网基础服务
    poultryBasicSettingServer: 'https://apiqlw.t.nxin.com/ch/basic',//'https://apiqlw.t.nxin.com/ch/basic', // https://localhost:5002
    //禽联网基础服务（读操作）
    poultryBasicSettingReadServer: 'https://apiqlw.t.nxin.com/qr/basic',//'https://apiqlw.t.nxin.com/qr/basic', // https://localhost:5003
    //禽联网生产单据服务
    poultryProductionServer: 'https://apiqlw.t.nxin.com/q/production',//'https://apiqlw.t.nxin.com/q/production', // https://localhost:5006  
    //禽联网生产单据服务
    poultryReportServer: 'https://apiqlw.t.nxin.com/q/reportbreed',//'https://apiqlw.t.nxin.com/q/reportbreed', // https://localhost:5010 
    // 养殖期初/设置/计算接口
    poultryProductionCostServer: 'https://apiqlw.t.nxin.com/q/cost',// https://apiqlw.t.nxin.com/q/cost,//'https://localhost:7004',
    //禽联网web
    qqlwUri: 'https://qyhqlw.t.nxin.com',

    /**
     * 千牛云
     */
     qianniuYunTokenUrl: 'https://fileserver.nxin.com/getToken',
     qianniuYunUploadUrl: 'http://up-z2.qiniup.com',
     qianniuYunFileUrl: 'http://nfs.nxin.com',
     //农信文件存储地址
     nxinfileServerUrl: "https://fileserver.t.nxin.com",

    //磅秤精灵
    WeightWsEndpoint: "ws://localhost:8181",
};
