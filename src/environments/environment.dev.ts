import { environmentType } from './environmentType';

export const environment = {
    environmentType: environmentType.develop,
    //环境标识
    production: true,
    // 测试环境 Token 信息
    token: {
        userInfo: {
            userId: 0,
            userName: '',
            enterpriseId: 0,
            enterpriseName: '',
            menuId: 0,
            childId: 0,
            chickenFarmName: '',
            enteDate: '',
            enterGroupId: '0',
            enterGroupName: '集团名称',
        },
        server: 'https://open.t.nxin.com/api/nxin.architecture.authorization/1.0', //测试用
        requestIgnore: ['/api/auth', '.json', 'https://open.t.nxin.com'],
        refreshTiming: 60 * 1000 * 30,
        validationTiming: 1000 * 5,
        homePage: 'https://cas.t.nxin.com/cas/login.html?systemId=12&retUrl=https%3A%2F%2Fhome.t.nxin.com%2F#/',
    },
    zlwPrintService: 'https://apiqlw.t.nxin.com/qlw/print', //打印api
    zlwUri: 'https://arcqlw.t.nxin.com:8089',
    zlwBasicSettingServer: 'https://apiqlw.t.nxin.com/z/basic', // 基础设置
    ylwBasicSettingServer:  'https://apiqlw.t.nxin.com/y/basic',
    zlwProductionServer: 'https://apiqlw.t.nxin.com/z/production/', // 基础
    zlwProductionReadServer: 'https://apiqlw.t.nxin.com/z/production-read/',
    zlwProductionSowServer: 'https://apiqlw.t.nxin.com/z/production/sow', // 母猪生产
    zlwProductionSowReadServer: 'https://apiqlw.t.nxin.com/z/production/sow-read/',
    qlwCommonService: 'https://apiqlw.t.nxin.com/qlw/base', // 企联网公共服务
    qlwSystemServerOq: 'https://apiqlw.t.nxin.com/sys/oq', // 企联网系统服务
    qlwProductService: 'https://apiqlw.t.nxin.com/base/product', // 企联网商品服务
    zlwPromptManageServer: 'https://apiqlw.t.nxin.com//z/production/prompt/', // 生产提示
    zlwMaterialsManageServer: 'https://apiqlw.t.nxin.com/z/materials/oq/', // 物资
    zlwhealthManageServer: 'https://apiqlw.t.nxin.com/z/health/', //健康管理
    zlwReportPigServer: 'https://apiqlw.t.nxin.com/z/reportpig', //指标
    qlwSystemServer: 'https://apiqlw.t.nxin.com/sys', // 企联网系统服务
    zlwcostServer: 'https://apiqlw.t.nxin.com/z/cost', // 成本
    qlwCustomer: 'https://apiqlw.t.nxin.com/qlw/customer', // 客户/供应商
    qlwBizMarket: 'https://apiqlw.t.nxin.com/qlw/market', //区域
    qlwProductSetUrl: 'https://baseqlw.t.nxin.com/ProductWeb/ProductList?appid=1708231814060000101', //设置企联网商品地址
    qlwSimpleProductSetUrl: 'https://baseqlw.t.nxin.com/SimpleProduct/QdProductList?appid=1811011724160000130', //设置企联网产品地址
    zlwBreedingServer: 'https://apiqlw.t.nxin.com/z/breeding', // 育种
    zlwOpsServer: 'https://apiqlw.t.nxin.com/z/ops', // 数据运维
    /**
     * 审核
     */
    review: {
        review: 'https://arcqlw.t.nxin.com:14021/api/QLW_Review/GetRereiew',
        zlwIsReviewed: 'https://arcqlw.t.nxin.com:14021/api/QLW_Review/2/IsReviewed',
        reviewOperate: 'https://arcqlw.t.nxin.com:14021/api/QLW_Review/OperateReview',
        batchReviewOperate: 'https://arcqlw.t.nxin.com:14021/api/QLW_Review/BatchOperateReview', //批量审核
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
        qlwPurchasing: 'https://open.t.nxin.com/api/nxin.inputs.savepostforpurchase/1.0',//物资采购
        wmInventoryCheck: 'https://open.t.nxin.com/api/nxin.BusinessShop.wminventorydata.add/1.0',//物资盘点
        productStock: 'https://open.t.nxin.com/api/nxin.inputs.getproductstockpostgateway/1.0',//根据仓库获取当前仓库库存
        getProductStock: 'https://open.t.nxin.com/api/nxin.inputs.getstockbyproductgateway/1.0',//根据商品获取仓库库存数据
        lastPurchasingRecord: 'https://open.t.nxin.com/api/nxin.inputs.getpurchaselastdata/1.0',//最新一条采购记录
        saveWareHouse:'https://open.t.nxin.com/api/nxin.inputs.savewarehouse/1.0',
        api:'https://open.t.nxin.com/api',
        changeIdentity: 'https://open.t.nxin.com/api/nxin.usercenter.biz.switch.identity/2.0',
        guideRecord:'https://open.t.nxin.com/api/nxin.usercenter.guide.record/1.0',
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
    domain: 'nxin.com',
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
    yhBasicSettingServer: 'https://apiqlw.t.nxin.com/yh/basic',
    //养户基础服务（读操作）
    yhBasicSettingReadServer: 'https://apiqlw.t.nxin.com/yhr/basic',
    //养户生产单据服务
    yhProductionServer: 'https://apiqlw.t.nxin.com/yh/production',
    //养户生产单据服务（读操作）
    yhProductionReadServer: 'https://apiqlw.t.nxin.com/yhr/production',
    //禽联网基础服务
    poultryBasicSettingServer: 'https://apiqlw.t.nxin.com/ch/basic',
    //禽联网基础服务（读操作）
    poultryBasicSettingReadServer: 'https://apiqlw.t.nxin.com/qr/basic',
    //禽联网生产单据服务
    poultryProductionServer: 'https://apiqlw.t.nxin.com/q/production',
    // 养殖期初/设置/计算接口
    poultryProductionCostServer: 'https://apiqlw.t.nxin.com/q/cost',
    //禽联网报表服务
    poultryReportServer: 'https://apiqlw.t.nxin.com/q/reportbreed',
    //养户系统web
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
