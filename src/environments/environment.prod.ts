/**
 * 测试环境配置
 */
import { environmentType } from './environmentType';
export const environment = {
    //环境标识
    production: true,
    environmentType: environmentType.production,
    // 测试环境 Token 信息
    token: {
        userInfo: {
            userId: 0,
            userName: '',
            enterpriseId: 0,
            enterpriseName: "",
            menuId: 0,
            childId: 0,
            chickenFarmName: '',
            enteDate: '',
            enterGroupId: '0',
            enterGroupName: '集团名称',
        },
        server: 'https://open.nxin.com/api/nxin.architecture.authorization/1.0', //测试用
        requestIgnore: ['/api/auth', '.json', 'https://open.nxin.com'],
        refreshTiming: 60 * 1000 * 30,
        validationTiming: 1000 * 10,
        homePage: 'https://cas.nxin.com/cas/login.html?systemId=12&retUrl=https%3A%2F%2Fhome.nxin.com%2F#/',
    },
    appSource: 'qqlw_web',
    appCode: '5BC6BEAC-1F97-4FF9-AA7B-17BAD696324C',
    zlwPrintService: 'https://apiqlw.nxin.com/qlw/print', //打印api
    zlwUri: 'https://zqlw.nxin.com',
    zlwBasicSettingServer: 'https://apiqlw.nxin.com/z/basic', // 基础设置
    ylwBasicSettingServer:  'https://apiqlw.nxin.com/y/basic',
    zlwProductionServer: 'https://apiqlw.nxin.com/z/production', // 基础
    zlwProductionReadServer: 'https://apiqlw.nxin.com/z/production-read',
    zlwProductionlimitServer: 'https://apiqlw.nxin.com/z/production-limit', //限流
    zlwProductionSowServer: 'https://apiqlw.nxin.com/z/production/sow', // 母猪生产
    zlwProductionSowReadServer: 'https://apiqlw.nxin.com/z/production-sow-read',
    qlwCommonService: 'https://apiqlw.nxin.com/qlw/base', // 企联网商品服务
    qlwSystemServerOq: 'https://apiqlw.t.nxin.com/sys/oq', // 企联网系统服务
    qlwProductService: 'https://apiqlw.nxin.com/base/product', // 企联网商品服务
    zlwPromptManageServer: 'https://apiqlw.nxin.com/z/production/prompt', // 生产提示
    zlwMaterialsManageServer: 'https://apiqlw.nxin.com/z/materials', // 物资
    zlwhealthManageServer: 'https://apiqlw.nxin.com/z/health', //健康管理
    zlwReportPigServer: 'https://apiqlw.nxin.com/z/reportpig', //指标
    qlwSystemServer: 'https://apiqlw.nxin.com/sys', // 企联网系统服务
    zlwcostServer: 'https://apiqlw.nxin.com/z/cost', // 成本
    qlwCustomer: 'https://apiqlw.nxin.com/qlw/customer', // 客户/供应商
    qlwBizMarket: 'https://apiqlw.nxin.com/qlw/market', //区域
    qlwProductSetUrl: 'https://baseqlw.nxin.com/ProductWeb/ProductList?appid=1708231814060000101', //设置企联网商品地址
    qlwSimpleProductSetUrl: 'https://baseqlw.nxin.com/SimpleProduct/QdProductList?appid=1811011724160000130', //设置企联网产品地址
    zlwBreedingServer: 'https://apiqlw.nxin.com/z/breeding', // 育种
    zlwOpsServer: 'https://apiqlw.nxin.com/z/ops', // 数据运维
    /**
     * 审核
     */
    review: {
        review: 'https://apiqlw.nxin.com/qlw/base/api/QLW_Review/GetRereiew',
        zlwIsReviewed: 'https://arcqlw.nxin.com/qlw/base/api/QLW_Review/2/IsReviewed',
        reviewOperate: 'https://apiqlw.nxin.com/qlw/base/api/QLW_Review/OperateReview',
        batchReviewOperate: 'https://apiqlw.nxin.com/qlw/base/api/QLW_Review/BatchOperateReview', //批量审核
        source: 5, // 猪联网
    },
    gatway: {
        infomation: 'https://open.nxin.com/api/nxin.information.content.list/1.0',
        disease: 'https://open.nxin.com/api/nxin.zbt.disease.list/1.0',
        symptomata: 'https://open.nxin.com/api/nxin.zbt.symptom.list/1.0',
        menu: 'https://open.nxin.com/api/nxin.permission.qlwpc.menulist/4.0',
        useMenu: 'https://open.nxin.com/api/nxin.qlwbase.menu.usualmenu.list/1.0',
        addMenu: 'https://open.nxin.com/api/nxin.qlwbase.menu.usualmenulist.add/1.0',
        delMenu: 'https://open.nxin.com/api/nxin.qlwbase.menu.usualmenulist.del/1.0',
        customerArrears: 'https://open.nxin.com/api/nxin.zlw.receivablesummarydata.list/1.0',
        enterthenumber: 'https://open.nxin.com/api/nxin.zlw.lsvehicleregisters.lst/1.0',
        GetPayMented: 'https://open.nxin.com/api/nxin.zlw.getpaymented.list/1.0',
        getpurchase: 'https://open.nxin.com/api/nxin.inputs.getpurchaseamounttotal/1.0',
        getsell: 'https://open.nxin.com/api/nxin.inputs.getsalesamounttotal/1.0',
        getstock: 'https://open.nxin.com/api/nxin.inputs.getlastcategorystock/1.0',
        getopenapp: 'https://open.nxin.com/api/nxin.qlw.sc.isenteropenapp/1.0',
        getGroupPurchase: 'https://open.nxin.com/api/nxin.sc.groupPurchase.list/1.0',
        qlwPurchasing: 'https://open.nxin.com/api/nxin.inputs.savepostforpurchase/1.0',//物资采购
        wmInventoryCheck: 'https://open.nxin.com/api/nxin.BusinessShop.wminventorydata.add/1.0',//物资盘点
        productStock: 'https://open.nxin.com/api/nxin.inputs.getproductstockpostgateway/1.0',//根据仓库获取当前仓库库存
        getProductStock: 'https://open.nxin.com/api/nxin.inputs.getstockbyproductgateway/1.0',//根据商品获取仓库库存数据
        lastPurchasingRecord: 'https://open.nxin.com/api/nxin.inputs.getpurchaselastdata/1.0',//最新一条采购记录
        saveWareHouse:'https://open.nxin.com/api/nxin.inputs.savewarehouse/1.0',
        api:'https://open.nxin.com/api',
        changeIdentity:'https://open.nxin.com/api/nxin.usercenter.biz.switch.identity/2.0',
        guideRecord:'https://open.nxin.com/api/nxin.usercenter.guide.record/1.0',
        threeMenuList: 'https://open.nxin.com/api/nxin.permission.qlwpc.third.menulist/1.0', // 企联网PC端末级菜单--浏览器调用
        getProductInfo: 'https://open.nxin.com/api/nxin.qlwbase.product.formual.get/1.0', //获取商品信息
        //入库批号
        getproductiondata:'https://open.nxin.com/api/nxin.inputs.getproductiondata/1.0',
        formula : 'https://dataset.nxin.com/' , //计算器
    },
    /** 人力域名 */
    hrUri: 'https://hrqlw.nxin.com',
    /** 中台基础域名 */
    baseUri: 'https://baseqlw.nxin.com',
    /** 仓储管理域名 */
    wmUri: 'https://wmqlw.nxin.com',
    /** 猪小智 */
    intelligentUri: 'https://zxz.nxin.com',
    /** 财务域名 */
    fmqlw: 'https://fmqlw.nxin.com',
    /** 企联网域名 */
    qlw: 'https://qlw.nxin.com',
    /** 采购管理域名 */
    pmUri: 'https://pmqlw.nxin.com',
    /**监管大屏 */
    watchPlatUrl: 'https://zxz.nxin.com',
    /**商城 */
    mallUrl: 'https://sc.nxin.com',
    /** 域 */
    domain: 'nxin.com',
    /**会员版套餐 */
    memberVersion: ['2109092026150000116','2102051117410000161','2109092026150121328'],
    /**国际版套餐 */
    globalVersion: '2102241439130000161',
    ENV: "PROD",
    qlwAssem: 'https://apiqlw.nxin.com/assem', //自定义打印
    printPage: 'https://print.nxin.com', //打印页地址
    desiUrl: 'https://webqlw.nxin.com', //打印页地址
    homeUrl:'https://home.nxin.com',//企业主页
    faUri: 'https://apiqlw.nxin.com/qlw/fm',

    //基础业务中台
    BaseCustomer: 'https://apiqlw.nxin.com/base',
    //架构中台
    commonOdataContext: 'https://apiqlw.nxin.com/qlw/base',
    //标准成本管理
    costManagementServer: 'https://apiqlw.nxin.com/cost/management',
    //养户基础服务
    yhBasicSettingServer: 'https://apiqlw.nxin.com/yh/basic',
    //养户基础服务（读操作）
    yhBasicSettingReadServer: 'https://apiqlw.nxin.com/yhr/basic',
    //养户生产单据服务
    yhProductionServer: 'https://apiqlw.nxin.com/yh/production',
    //养户生产单据服务（读操作）
    yhProductionReadServer: 'https://apiqlw.nxin.com/yhr/production',
    //禽联网基础服务
    poultryBasicSettingServer: 'https://apiqlw.nxin.com/ch/basic',
    //禽联网基础服务（读操作）
    poultryBasicSettingReadServer: 'https://apiqlw.nxin.com/qr/basic',
    //禽联网生产单据服务
    poultryProductionServer: 'https://apiqlw.nxin.com/q/production',
    // 养殖期初/设置/计算接口
    poultryProductionCostServer: 'https://apiqlw.nxin.com/q/cost',
    //禽联网报表服务
    poultryReportServer: 'https://apiqlw.nxin.com/q/reportbreed',
    //养户系统web
    qqlwUri: 'https://qyhqlw.nxin.com',

    /**
     * 千牛云
     */
     qianniuYunTokenUrl: 'https://fileserver.nxin.com/getToken',
     qianniuYunUploadUrl: 'http://up-z2.qiniup.com',
     qianniuYunFileUrl: 'http://nfs.nxin.com',

       //农信文件存储地址
    nxinfileServerUrl: "https://fileserver.nxin.com",

    //磅秤精灵
    WeightWsEndpoint: "ws://localhost:8181",
};
