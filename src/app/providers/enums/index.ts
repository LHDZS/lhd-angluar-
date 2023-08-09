import { TranslateI18N } from '../i18n-translate';

/**
 * 数据行状态
 */
export enum DataStatus {
    /**
     * 无操作
     */
    none = 0,
    /**
     * 新增行
     */
    newline = 1,
    /**
     * 修改行
     */
    modified = 2,
    /**
     * 删除行
     */
    deleted = 3,
}
/**
 * 表单操作
 */
export enum FormOptions {
    $create = 1,
    $modify = 0,
}
/**
 * 字典数据
 */
export enum PigDataDictionary {

    /**
    * 字典数据：分群等级
    */
    PigGrade = '202101231533000',
    /**
     * 字典数据：猪场规模
     */
    PigFarmScale = '202003161431341000',
    /**
     * 字典数据：猪场模式
     */
    CultureMode = '202004101502151000',
    /**
     * 字典数据：级次信息
     */
    DataLevel = '202003161047451000',
    /**
     * 字典数据：栋舍类型
     */
    PigHouseUnitType = '202003161411341000',
    /**
     * 猪类型
     */
    PigType = '202003161542341000',
    /**
     * 免疫/保健类型
     */
    ImmuneType = '202003161420341000',
    /**
     * 日龄
     */
    dayold = 347,
    /**
     * 产前
     */
    antenatal = 348,
    /**
     * 产后
     */
    postpartum = 349,
    /**
     * 普免
     */
    Universalimmunity = 350,
    /**
     * 入场后
     */
    Afteradmission = 351,

    /**
     * 免疫项目
     */
    ImmuneProject = '202003161028311002',
    /**
     * 保健名称
     */
    HealthCareProject = '202003161028311021',

    /**
     * 批次模式
     */
    BatchMode = '202004131932161000',
    /**
     * 批次模式：非全进全出
     */
    BatchModeNotAll = '202004131932161001',
    /**
     * 批次模式：全进全出
     */
    BatchModeAll = '202004131932161002',
    /**
     * 事件 / 异常类型
     */
    PigState = '202003161028311014',
    /**
     * 母猪淘汰
     */
    SowKnockOut = '202003161028311009',
    /**
     * 公猪淘汰
     */
    BoarKnockOut = '202003161028311010',
    /**
     * 死亡原因
     */
    DeathCause = '202003161028311007',
    /**
     * 死亡类型
     */
    DeathType = '2020043014530001',
    /**
     * 妊检结果
     */
    PregnancyResult = '202003161028311014',
    /**
     * 妊检方式
     */
    PregnancyWay = '202003161028311005',
    /**
     * 产仔难易
     */
    EasyToLitter = '202003161442341000',
    /**
     * 上次事件 / 母猪状态
     */
    LastState = '202003161423341000',
    /**
     * 喂养类型
     */
    FeedingType = '202005071945431000',
    /**
     * 精液类型
     */
    SemenType = '202003161629341000',
    /**
     * 消毒类型
     */
    disinfectionType = '202003161028311008',
    /**
     * 消毒用药
     */
    disinfectiondrugs = '202003161028311004',
    /**
     * 免疫方法
     */
    immunemethod = '202003161028311003',
    /**
     * 配种方式
     */
    breedingType = '202003161700341000',
    /**
     * 肥猪批次类型
     */
    batchType = '201911041541201000',
    /**
     * B超检查
     */
    bCheck = '201409301459314213',

    /**
    * 猪舍总仓库类型
    */
    PigWarehouseType = '201611500104402104',
    /**
    * 等级
    */
    grade = '202003161028311022',
    /**
     * 测定类型
     */
    TestType = '202101081648000',
    /**
     * 原料仓库
     */
    yuanliaoWarehouseType = '201611500104402101',
    /**
    * 配料筒仓
    */
    peiliaoWarehouseType = '201611500104402103',
    /**
   * 物资仓库
   */
    MaterialWarehouseType = '1711221602150000101',
    /**
    * 成品仓库
    */
    chengpinWarehouseType = '1803121608280000130',
    /**
   * 虚拟仓库
   */
    xuniWarehouseType = '1809141440070000130',
    /**
    * 来源类型
    */
    PigSourceType = '202103311603000',
    /**
     * 公猪类型
     */
    BoarType = '202103311558000',
    /** 档案类别 */
    ProfileType = '202111231714000',
}
/**
 * 猪类型
 */
export enum PigType {
    /**
     * 公猪
     */
    Boar = 322,
    BoarText = '公猪',
    /**
     * 母猪
     */
    Sow = 323,
    SowText = '母猪',
    /**
     * 肥猪
     */
    Fat = 324,
    FatText = '肥猪',
    /**
     * 公猪
     */
    Boarstring = '322',
    /**
     * 母猪
     */
    Sowstring = '323',
    /**
     * 肥猪
     */
    Fatstring = '324',
}
export enum PigStatus {
    /**
     * 过高
     */
    High = 'HIGH',
    HighText = '过高',
    PHighText = '偏高',
    /**
     * 过低
     */
    Low = 'LOW',
    LowText = '过低',
    PLowText = '偏低',
    /**
     * 正常
     */
    Normal = 'NORMAL',
    NormalText = '正常',
    /**
     * 预测发情  ESTRUS 预测发情，UNESTRUS 预测未发情
     */
    Estrus = 'ESTRUS',
    EstrusText = '预测发情',
    /**
     * 预测未发情
     */
    UnEstrus = 'UNESTRUS',
    UnEstrusText = '预测未发情',
}
/**
 * 猪性别
 */
export enum PigGender {
    /**
     * 母猪
     */
    Girl = 0,
    /**
     * 公猪
     */
    Boy = 1,
}
/**
 * 摘要类型枚举
 */
export enum AbstractType {
    /**
     * 期初
     */
    Begin = 137,
    BeginText = '期初',
    /**
     * 转舍转入
     */
    TurnIn = 138,
    TurnInText = '转舍转入',
    /**
     * 转舍转出
     */
    TurnOut = 139,
    TurnOutText = '转舍转出',
    /**
     * 产仔
     */
    Farrow = 140,
    FarrowText = '产仔',
    /**
     *  断奶
     */
    Wean = 141,
    WeanText = '断奶',
    /**
     * 销售离场
     */
    Sale = 142,
    SaleText = '销售离场',
    /**
     * 死亡离场
     */
    Death = 143,
    DeathText = '死亡离场',
    /**
     * 采购转入
     */
    Purchase = 147,
    PurchaseText = '采购转入',
    /**
     * 出苗
     */
    OutSeedling = 149,
    OutSeedlingText = '出苗',
    /**
     * 回收
     */
    BuyBack = 150,
    BuyBachText = '回购',
    /**
     * 种猪转入
     */
    ReserveIn = 191,
    ReserveInText = '种猪转入',
    /**
     * 后备转出
     */
    ReserveOut = 215,
    ReserveOutText = '后备转出',
    /**
     * 调拨转入
     */
    AllotIn = 1381,
    AllotInText = '调拨转入',
    /**
     * 寄养转入
     */
    FosterIn = 1382,
    FosterInText = '寄养转入',
    /**
     * 盘点转入
     */
    InventoryIn = 1383,
    InventoryInText = '盘点转入',
    /**
     * 调拨转出
     */
    AllotOut = 1391,
    AllotOutText = '调拨转出',
    /**
     * 寄养转出
     */
    FosterOut = 1392,
    FosterOutText = '寄养转出',
    /**
     * 盘点转出
     */
    InventoryOut = 1393,
    InventoryOutText = '盘点转出',
    /**
     * 淘汰
     */
    Eliminate = 3122,
    EliminateText = '淘汰',
    /**
    * 分娩
    */
    Delivery = 216,
    DeliveryText = '分娩',
    /**
     * 采精
     */
    SemenCollection = 232,
    SemenCollectionText = '公猪采精',
    /**
     * 配种
     */
    Breeding = 157,
    BreedingText = '配种',
    /**
     * 免疫
     */
    ImmuneType = 3120,
    ImmuneTypeText = '免疫',
    /**
     * 保健
     */
    HealthCare = 3121,
    HealthCareText = '保健',
    /**
     * 期初
     */
    Beginstring = '137',
    BeginstringText = '期初',
    /**
     * 死亡离场
     */
    Deathstring = '143',
    DeathstringText = '死亡离场',
    /**
     * 精液使用
     */
    SemenUse = '326',
    SemenUseText = '精液使用',
    /**
     * 精液报废
     */
    SemenNoUse = '327',
    SemenNoUseText = '精液报废',
    /**
     * 物资领用
     */
    ProductUse = '155',
    ProductUseText = '物资领用',

    Boarsemenc = 219,
    BoarsemencText = '公猪精液',
    /**
     * 顺产
     */
    BirthSuccess = '41',
    /** 妊检单 */
    PregnancyCheck = 101401,
    PregnancyCheckText = '妊检记录',
    /** 喂养 */
    SowFeeding = 101402,
    SowFeedingText = '母猪喂养',
    BoarFeeding = 101403,
    BoarFeedingText = '公猪喂养',
    FatFeeding = 101404,
    FatFeedingText = '肥猪喂养',
    /**
     * 背膘测定
     */
    BackfatDetermination = 101301,
    BackfatDeterminationText = '背膘测定',

    // 摘要:
    //     配种计划
    BreedingPlan = 101406,
    BreedingPlanText = '配种计划',
    //
    // 摘要:
    //     妊检计划
    PregnancyPlan = 101407,
    PregnancyPlanText = '妊检计划',
    //
    // 摘要:
    //     分娩计划
    DeliveryPlan = 101408,
    DeliveryPlanText = '分娩计划',
    //
    // 摘要:
    //     断奶计划
    WeaningPlan = 101409,
    WeaningPlanText = '断奶计划',
    //
    // 摘要:
    //     母猪配种
    SowBreed = 101410,
    SowBreedText = '母猪配种',
    //
    // 摘要:
    //     后备配种
    HbBreed = 101411,
    HbBreedText = '后备配种',
    //
    // 摘要:
    //     后备转母猪
    HbTransferSow = 101412,
    HbTransferSowText = '后备转母猪',
    /// <summary>
    /// 调整转入
    /// </summary>
    AdjustIn = 20210429138,
    AdjustInText = '调整转入',
    /// <summary>
    /// 调整转出
    /// </summary>
    AdjustOut = 20210429139,
    AdjustOutText = '调整转出'
}
/**
 * 在场状态
 */
export enum EntranceState {
    /**
     * 离场
     */
    Leave = 0,
    /**
     * 离场
     */
    LeaveString = '离场',
    /**
     * 入场
     */
    Enter = 1,
    /**
     * 入场
     */
    EnterString = '在场',
    /**
     * 待入场
     */
    Wait = 2,
    /**
     * 待入场
     */
    WaitString = '待入场',
}
/**
 * 母猪状态
 */
export enum SowPigState {
    /**
     * 后备
     */
    HB = '292',
    HBText = '后备',
    /**
     * 空怀
     */
    KH = '293',
    KHText = '空怀',
    /**
     * 返情
     */
    FQ = '295',
    FQText = '返情',
    /**
     * 流产
     */
    LC = '296',
    LCText = '流产',
    /**
     * 空胎
     */
    KT = '297',
    KTText = '空胎',
    /**
     * 妊娠
     */
    RS = '299',
    RSText = '妊娠',
    /**
     * 哺乳
     */
    BR = '300',
    BRText = '哺乳',
    /**
     * 断奶
     */
    DN = '301',
    DNText = '断奶',
    /**
     * 淘汰
     */
    TT = '302',
    TTText = '淘汰',
    /**
     * 死亡
     */
    SW = '303',
    SWText = '死亡',
    /**
     * 其他
     */
    QT = '304',
    QTText = '其他',
    /**
     * 销售
     */
    XS = '305',
    XSText = '销售',
    /**
     * 调拨转入
     */
    DBZR = '202003161423341001',
    DBZRText = '调拨',
    /**
     * 无状态
     */
    NoState = '0',
    NoStateText = '无状态',
}
/**
 * 妊检结果
 */
export enum PregnancyCheckResult {
    /**
     * 空胎
     */
    KT = '201409301459314222',
    /**
     *  返情
     */
    FQ = '201409301459314223',
    /**
     * 流产
     */
    LC = '201409301459314224',
    /**
     * 妊检阳性
     */

    RJYX = '201409301459314225',
    /**
     * 妊检阴性（空怀）
     */

    KH = '201409301459314226',
}
/**
 * 发情记录字典类型
 */
export enum RuttingRecordResult {
    /**
     * 后备猪
     */
    HBZ = '201911041541201004',
    /**
     * 后备公猪
     */
    HBGZ = '201911041541201005',
    /**
     * 后备母猪
     */
    HBMZ = '201911041541201006',
}

/**
 * 批次类型
 */
export enum BatchType {
    /**
     * 乳猪
     */
    RZ = '201911041541201001',
    /**
     * 保育
     */
    BY = '201911041541201002',
    /**
     * 育肥
     */
    YF = '201911041541201003',
    /**
     * 后备猪
     */
    HBZ = '201911041541201004',
    /**
     * 后备公猪
     */
    HBGZ = '201911041541201005',
    /**
     * 后备母猪
     */
    HBMZ = '201911041541201006',
    /**
     * 精液批次
     */
    SEMEN = '219',
}
/**
 * 喂养类型
 */
export enum FeedingType {
    /**
     * 耳号
     */
    EarNumber = 850,
    EarNumberText = '耳号',
    /**
     * 栋舍类型
     */
    PigHouseType = 851,
    PigHouseTypeText = '栋舍类型',
    /**
     * 栋舍
     */
    PigHouse = 852,
    PigHouseText = '栋舍',
    /**
     * 批号
     */
    BatchNumber = 853,
    BatchNumberText = '批次',
    /**
     * 猪场
     */
    PigFarm = 854,
    PigFarmText = '猪场',
}

/**
 * 费用项目归集信息
 */
 export enum ProjectTypeInfo {
    /**
     * 禽生产费用
     */
    ProjectTypeA = "201904121023082106",
    ProjectTypeAText = '禽生产费用',
    /**
     * 孵化生产费用
     */
    ProjectTypeB = "201904121023082107",
    ProjectTypeBText = '孵化生产费用',
    /**
     * 蛋加工费用
     */
     ProjectTypeC = "201904121023082109",
     ProjectTypeCText = '蛋加工费用',

    /**
     * 鸡场
     */
    ChickenFarm = "2209071611060000150",
    ChickenFarmText = '鸡场',
    /**
     * 栋舍
     */
    HenHouse = "2209071611060000250",
    HenHouseText = '栋舍',
    /**
     * 批次
     */
    BatchNumber = "2209071611060000350",
    BatchNumberText = '批次',
    /**
     * 孵化厂
     */
    HatcherFarm = "2209071611060000450",
    HatcherFarmText = '孵化厂',
    /**
     * 摘要
     */
    Abstract = "2209071611060000550",
    AbstractText = '摘要',
}

/**
 * 系统选项 配置
 */
export enum SystemOptionType {
    /**
     * 母猪档案出生日期  猪场管理
     */
    MZDADATE = '20200518161507',
    /**
     * 母猪系谱
     */
    MZXP = '20200518161606',
    /**
     * 精子活力
     */
    JZHL = '20200518161640',
    /**
     * 首配评分
     */
    SPPF = '20200518161707',
    /**
     * 有效产仔
     */
    YXCZ = '20200518161854',
    /**
     * 死淘种猪
     */
    STZZ = '20200518161958',
    /**
     * 公猪费用
     */
    GZFY = '20200518162018',
    /**
     * 后备转种猪生成原值
     */
    HBZZ = '20200518162041',
    /**
     * 乳猪销售是否按系数分摊
     * 勾选乳猪死亡及存栏按照0.5头计算，不勾选成本计算乳猪销售按1头计算
     */
    RZXS = '20200518162108',
    /**
     * 成本计算
     * 勾选勾选成本计算的选项起作用，不勾选勾选成本计算的选项不起作用
     */
    CBJS = '20200518162223',
    /**
     * 乳猪成本归集
     */
    RZCBGJ = '20200518162611',
    /**
     * 采精成本计算
     * 勾选后采精精液参与成本计算，不勾选采精精液不参与成本计算
     */
    CJCBJS = '20200518162640',
    /**
     * 是否保存日成本数据
     * 勾选保存日成本，不勾选不保存日成本
     */
    SFBLRCBSJ = '20200518162700',
    /**
     * 肥猪死亡成本是否分摊到存栏
     */
    FZSWCBSFFTDCL = '20200518162724',
    /**
     * 启用喂养分摊
     * 勾选按照喂养分摊，不勾选按照领用分摊
     */
    QYWYFT = '20200518163325',
    /**
     * 分娩天数控制
     * 勾选妊娠母猪可以分娩，不勾选妊娠天数100~125天可以分娩
     */
    FWTSKZ = '20200518163346',
    /**
     * 种猪费用分摊规则
     * 勾选当月全部种猪费用分摊到出生乳猪，不勾选分娩母猪和公猪的费用分摊到出生乳猪
     */
    ZZFYFTGZ = '20200518163406',
    /**
     * 肥猪猪成本按日齢分摊
     * 默认肥猪猪成本按头数分摊
     */
    FZZCBARLFT = '20200518163436',

    /**
     * 肥猪猪成本按日齢分摊
     * 默认肥猪猪成本按头数分摊
     */
    FZCBARLFT = '20200518163406',

    /**
     * 启用饲养日齢计算成本
     * 启用饲养日齢计算成本
     */
    QYSYRLJSCB = '20200518163453',

    /**
     * 断奶成本归集
     * 勾选断奶种猪费用分摊到乳猪，不勾选以产仔后分摊到乳猪
     */
    DNCBGJ = '20200518163511',

    /**
     * 启用日成本计算
     * 勾选当月全部种猪费用分摊到出生乳猪，不勾选分娩母猪和公猪的费用分摊到出生乳猪
     */
    QYRCBJS = '20200518163535',
    /**
     * 勾选启用控制按天做领用单管理，不勾选不启用
     * 启用按天物资领用管理
     */
    QYATWZLYGL = '20200518163838',
    /**
     * 启用存栏为零时自动结束肥猪批次
     * 不勾选默认为手动结束批次,勾选后存栏为0时，第二天凌晨三点批次自动结束
     */
    QYCLWLSZDJSFZPC = '20200518163924',
    /**
     * 配种记录公猪耳号同步
     * 勾选配种公猪选择第一行赋值同时给下面所有行赋值，不勾选只给第一行赋值
     */
    PZJLGZEHTB = '20200518165019',
    /**
     * 启用公母猪销售单生成淘汰单
     * 勾选生成，不勾选不生成
     */
    QYGMZXSDSCTTD = '20200518165100',
    /**
     * 猪压猪
     */
    ZYZ = '20200518165019',
    /**
     * （智能终端）开启打开钱箱需要密码验证
     * 开启后，打开钱箱需要输入当前登录用户的登录密码验证，验证通过后才可以打开钱箱
     */
    KQDKQXXYMMYZ = '20200611134301',

    /**
     * 启用销售单价格禁止修改
     */
    SALEPRICE = '201801201220412691',

    /**
     * 销售单用收款抹零功能 (控制向上取整、向下取整)
     */
    SALEROUNDING = '20190615152954',

    /**
     * 销售单进厂编号显示天数
     */
    SALEENTRYNUMBER = '20190806134752',
    //采购单无序审核
    CAIGOUDANWUXU = '20190712175426',
    //采购单、销售单、采购合同、金额与单价*数量的最大误差值
    SALEMAXIMUM = '201806050104402001',
    /*仓库数据启用权限筛选*/
    CKSJQX = '20190221155038',

    /**
     * 销售单无序审核
     * */
    XIAOSHOUDANWUXU = '20190404132048',

    /**
     * 种猪批次管理模式
     */
    ZHONGZHUPICIGUANLI = '20210330150743',
    /**
     * 种猪批次管理模式
     */
    FeiZHUPICIGUANLI = '20210518093906',

    /**
     * 是否启用精液批次
     * */
    SHIFOUQIYONGJINYEPI = '20210412152240',
    /**
    * 启用肥猪日龄
    */
    SHIFOUQIYONGFEIZHURILING = '20210518093906',
    /**
     * 批次存栏为0时，次日自动结束
     */
    BATCHISZEROWILLFINISH = '20210915145350',
}

export enum OptionTypeEnum {
    /**
     * 文本
     */
    Text = 1,
    /**
     * 单选
     */
    SingleSelection = 2,
    /**
     * 多选s
     */
    MultipleSelection = 3,
}
/**
 * 商品分类
 */
export enum ProductClassification {
    /**
     * 饲料
     */
    Fodder = '4604',
    /**
     * 兽药
     */
    VeterinaryDrug = '4625',
    /**
     * 疫苗
     */
    Vaccine = '4626',
    /**
     * 猪养殖
     */
    PigBreeding = '4606',
    /**
     * 种猪商品
     */
    BreedingPigCommodity = '4750',
}
/**
 * 栋舍类型
 */
export enum HouseType {
    /**
     * 公猪舍
     */
    boar = '115',
    /**
     * 配种舍
     */
    breed = '116',
    /**
     * 妊娠舍
     */
    mate = '117',
    /**
     * 分娩舍
     */
    birth = '118',
    /**
     * 保育舍
     */
    feed = '119',
    /**
     * 育肥舍
     */
    fat = '120',
    /**
     * 隔离舍
     */
    isolate = '121',
    /**
     * 后备舍
     */
    hb = '168',
}
/* 企联网字段数据
 */
export enum QlwDataDictionary {
    /**
     * 类别
     */
    type = '201610140104402101',
    /**
     * 销售类别
     */
    selltype = '201610140104402401',
    /**
     * 摘要
     */
    abstract = '201610140104402301',
    /**
     * 销售摘要
     */
    sellabstract = '201610140104402501',
    /**
     * 等级
     */
    grade = '201707241410401001',
}
/** 猪在场状态 */
export enum PigInState {
    /** 离场 */
    Leave = 0,
    LeaveText = '离场',
    /** 在场 */
    In = 1,
    InText = '在场',
    /** 待入场 */
    WaitIn = 2,
    WaitInText = '待入场',
}

/** 猪在场状态 */
export enum EasyToLitter {
    /** 顺产 */
    Easy = 41,
    /** 难产 */
    Hard = 42,
    /** 助产 */
    Helpe = 43,
}

/**
 * 肥猪批次有效枚举
 */
export enum FatBatchEffective {
    /// <summary>
    /// 肥猪类型
    /// </summary>
    FatType = 0,
    FatTypeText = '肥猪类型',
    /// <summary>
    /// 启用
    /// </summary>

    IsUse = 1,
    IsUseText = '启用',
    /// <summary>
    /// 本猪场
    /// </summary>

    PigFarm = 2,
    PigFarmText = '本猪场',
    /// <summary>
    /// 乳猪类型
    /// </summary>

    RzType = 3,
    RzTypeText = '乳猪类型',
    /// <summary>
    /// 已结束
    /// </summary>

    IsFinish = 4,
    IsFinishText = '已结束',
}
/**
 * 公猪类型
 */
export enum BoarTypeEnum {
    /** 生产公猪 */
    SC = '202103311558001',
    /** 诱情公猪 */
    YQ = '202103311558002',
    /** 精液公猪 */
    JY = '202103311558003',
}

/** 导入枚举 */
export class ImportField {
    static DataDate = 0;
    static get DataDateText() {
        return TranslateI18N.I18N.enums.importField.dataDateText;
    }
    static PersonID = 1;
    static get PersonIDText() {
        return TranslateI18N.I18N.enums.importField.personIDText;
    }
    static PigType = 2;
    static get PigTypeText() {
        return TranslateI18N.I18N.enums.importField.pigTypeText;
    }
    static PigFarmID = 3;
    static get PigFarmIDText() {
        return TranslateI18N.I18N.enums.importField.pigFarmIDText;
    }
    static WarehouseId = 4;
    static get WarehouseIdText() {
        return TranslateI18N.I18N.enums.importField.warehouseIdText;
    }
    static GodownMan = 5;
    static get GodownManText() {
        return TranslateI18N.I18N.enums.importField.godownManText;
    }
    static Recipient = 6;
    static get RecipientText() {
        return TranslateI18N.I18N.enums.importField.recipientText;
    }
    static RequisitionUnitType = 7;
    static get RequisitionUnitTypeText() {
        return TranslateI18N.I18N.enums.importField.requisitionUnitTypeText;
    }
    static RequisitionType = 8;
    static get RequisitionTypeText() {
        return TranslateI18N.I18N.enums.importField.requisitionTypeText;
    }
    static FeedType = 9;
    static get FeedTypeText() {
        return TranslateI18N.I18N.enums.importField.feedTypeText;
    }
    static PurchaseType = 10;
    static get PurchaseTypeText() {
        return TranslateI18N.I18N.enums.importField.purchaseTypeText;
    }
    static PurchaseAbstract = 11;
    static get PurchaseAbstractText() {
        return TranslateI18N.I18N.enums.importField.purchaseAbstractText;
    }
    static TicketedPointId = 12;
    static get TicketedPointIdText() {
        return TranslateI18N.I18N.enums.importField.ticketedPointIdText;
    }
    static SupplierId = 13;
    static get SupplierIdText() {
        return TranslateI18N.I18N.enums.importField.supplierIdText;
    }
    static SalesType = 14;
    static get SalesTypeText() {
        return TranslateI18N.I18N.enums.importField.salesTypeText;
    }
    static SalesAbstract = 15;
    static get SalesAbstractText() {
        return TranslateI18N.I18N.enums.importField.salesAbstractText;
    }
    static CustomerId = 16;
    static get CustomerIdText() {
        return TranslateI18N.I18N.enums.importField.customerIdText;
    }
    static MarketId = 17;
    static get MarketIdText() {
        return TranslateI18N.I18N.enums.importField.marketIdText;
    }
    static ShippingAddress = 18;
    static get ShippingAddressText() {
        return TranslateI18N.I18N.enums.importField.shippingAddressText;
    }
    static ProductId = 19;
    static get ProductIdText() {
        return TranslateI18N.I18N.enums.importField.productIdText;
    }
    static CustomerContact = 20;
    static get CustomerContactText() {
        return TranslateI18N.I18N.enums.importField.customerContactText;
    }
    static ContactNumber = 21;
    static get ContactNumberText() {
        return TranslateI18N.I18N.enums.importField.contactNumberText;
    }
    static TestType = 22;
    static get TestTypeText() {
        return TranslateI18N.I18N.enums.importField.TestTypeText;
    }
    static IsHb = 23;
    static get IsHbText() {
        return TranslateI18N.I18N.enums.importField.IsHbText;
    }
}


export class AppIdDataRel {
    //种鸡场菜单
    static ChickenFarmPoultryAppId = '2201251433090000109';
    static get ChickenFarmPoultryAppIdText() {
        return TranslateI18N.I18N.chickenFarmSetting.ChickenFarmType.poultry;
    }
    //鸡孵化厂菜单
    static ChickenFarmHatcheryAppId = '2202091839240000109';
    static get ChickenFarmHatcheryAppIdText() {
        return TranslateI18N.I18N.chickenFarmSetting.ChickenFarmType.hatchery;
    }

     //带鸡消毒菜单 2202101932140000109
    static ChickenFarmHenHouseSterilizeAppId = '2202091842280000109';
    //空舍消毒菜单
    static ChickenFarmEmptyHenHouseSterilizeAppId = '2202101514170000109';

    //种鸡场消毒菜单 2202101932140000109
    static ChickenFarmEnviromentSterilizeAppId = '2202101932140000109';
    //孵化厂消毒菜单
    static ChickenFarmEmptyEnviromentSterilizeAppId = '2202101935320000109';

    //商品代品种
    static BreedingAppId = '1706211008040000101';
    //种禽品种
    static ZqBreedingAppId = '2201271735040000109';
    //蛋鸭品种
    static DuckBreedingAppId = '2208121434080000109';
}

export enum DataDictionary {
    // 销售单
    SalesTypeA = '201610140104402402',
    // 销售退货单
    SalesTypeB = '201610140104402403',

    
    /**只预计净残值*/
    ResidualTypeA = '2110271346300000112',
    /**预计净残值率*/
    ResidualTypeB = '2110271346420000212',
    /**禽别*/
    PoultryType = '2201051734480000580',
    //蛋鸡
    PoultryTypeA = '2201052033040000155',
    //肉鸡
    PoultryTypeB = '2201052033040000255',
    //蛋鸭
    PoultryTypeC = '2201052033040000355',
    //肉鸭
    PoultryTypeD = '2201052033040000455',
    //肉鹅
    PoultryTypeE = '2201052033040000555',
    //蛋鹌鹑
    PoultryTypeF = '2201052033040000655',
    //肉鹌鹑
    PoultryTypeG = '2201052033040000755',
    //肉鸽
    PoultryTypeH = '2201052033040000855',
    //蛋鸽
    PoultryTypeI = '2201052033040000955',

    /**套餐类型*/
    ComboPack = '2201052033040000955',
    //种鸡
    ComboPackA = '2201052035160000155',
    //种鸭
    ComboPackB = '2201052035160000255',
    //种鹅
    ComboPackC = '2201052035160000355',
    //种鹌鹑
    ComboPackD = '2201052035160000455',
    //种鸽
    ComboPackE = '2201052035160000555',
    //公共
    ComboPackF = '2201052035160000655',
    //鸡
    ComboPackG = '2201052035160000755',
    //鸭
    ComboPackH = '2201052035160000855',
    //鹅
    ComboPackI = '2201052035160000955',
    //家禽放养
    ComboPackJ = '2201052035160001255',

    /**代次*/
    GenerationLine = '201704130105242003',
    // 育种
    GenerationLineA = '2201052033420000155',
    // 祖代
    GenerationLineB = '2201052033420000255',
    // 父母代
    GenerationLineC = '201704130104402330',
    // 商品代
    GenerationLineD = '201704130104402331',

    /**农场类型*/
    FarmType = '2201051734480000380',
    // 养殖场
    FarmTypeA = '2201052031570000155',
    // 孵化厂
    FarmTypeB = '2201052031570000255',
    // 育雏育成种鸡场
    FarmTypeA1 = '201704130105242106',
    // 产蛋种鸡场
    FarmTypeA2 = '201704130105242107',
    // 综合种鸡场
    FarmTypeA3 = '201704130105242111',
    //祖代种禽孵化厂
    FarmTypeB1 = '201704130105242108',
    //父母代种禽孵化厂
    FarmTypeB2 = '201704130105242109',
    //综合种禽孵化厂
    FarmTypeB3 = '201704130105242110',

    //养殖户自建场
    FarmTypeC1 = '201704130105242112',
    //养殖户租赁场
    FarmTypeC2 = '201704130105242113',
    //公司养殖基地
    FarmTypeC3 = '201704130105242114',
    //小区养殖模式
    FarmTypeC4 = '201704130105242115',

    /**系别*/
    DescentLine = '2201051734480000680',
    // 父系
    DescentLineA = '2201052034010000155',
    // 母系
    DescentLineB = '2201052034010000255',

    /**养殖方式 */
    RearType = '2201051734480000480',
    /**笼养舍 */
    RearTypeA = '2201052032310000155',
     /**平养舍 */
    RearTypeB = '2201052032310000255',
     /**散养舍 */
    RearTypeC = '2201052032310000355',

    /**批次类型*/
    BatchType = '2201051734480000780',
    // 正常
    BatchTypeA = '2201052034580000155',
    // 换羽
    BatchTypeB = '2201052034580000255',

    //产蛋期
    LifePeriodA = '2210261354270000350',

    /**阶段类型 */
    PhaseType = '2201051734480000280',

    //育雏舍
    PhaseTypeA = '2201112004550000155',
    //育成舍
    PhaseTypeB = '2201112004550000255',
    //育雏育成舍
    PhaseTypeC = '2201112004550000355',
    //产蛋舍
    PhaseTypeD = '2201112004550000455',
    //一体舍
    PhaseTypeE = '2201112004550000555',
    //淘汰舍
    PhaseTypeF = '2201112004550000655',

    /**引种来源*/
    ChickenSource = '201610140104402301',
    //仓库期初
    ChickenSourceA = '201611300104402201',
    //外购转入
    ChickenSourceB = '201610140104402302',

    /**公母*/
    SexType = '201711171453531001',
    //公
    SexTypeA = '201711171453531101',
    //母
    SexTypeB = '201711171453531102',
    //混合
    SexTypeC = '201711171453531103',

    /**出栏类型*/
    OutHouseType = '2021102540104401001',
    //零星
    OutHouseTypeA = '2021102540104401002',
    //批量
    OutHouseTypeB = '2021102540104401003',
    //群淘
    OutHouseTypeC = '2021102540104401004',

     /**体重等级*/
    WeightLevel = '2201051734480001180',
    //不分
    WeightLevelA = '2201261319200000155',
    //特大
    WeightLevelB = '2201261319200000255',
    //较大
    WeightLevelC = '2201261319200000355',
    //大
    WeightLevelD = '2201261319200000455',
    //中
    WeightLevelE = '2201261319200000555',
    //小
    WeightLevelF = '2201261319200000655',
    //较小
    WeightLevelG = '2201261319200000755',
    //特小
    WeightLevelH = '2201261319200000855',
    //残次
    WeightLevelI = '2201261319200000955',

    //商品类型
    iSort = '201711221519051001',
    //水稻
    iSortK = '201711221519051111',
    //饲料
    iSortA = '201711221519051101',
    //药品
    iSortB = '201711221519051102',
    //疫苗
    iSortC = '201711221519051103',
    //鸡苗
    iSortD = '201711221519051104',
    //其他
    iSortE = '201711221519051105',
    //禽类
    iSortF = '201711221519051106',
    //包装物
    iSortG = '201711221519051107',
    //肉类产品
    iSortH = '201711221519051108',
    //蛋类产品
    iSortI = '201711221519051109',
    //稻谷
    iSortJ = '201711221519051111',

    //商品类型
    ProductCollectType = '2201051734480003980',
    //禽苗类
    ProductCollectTypeA = '2301051125260000150',
    //饲料类
    ProductCollectTypeB = '2301051125260000250',
    //药杂类
    ProductCollectTypeC = '2301051125260000350',
    //肉禽类
    ProductCollectTypeD = '2301051125260000450',

    //剂型
    DosageForm = '2201051734480001080',
    //活苗
    DosageFormA = '2201241923410000155',
    //油苗
    DosageFormB = '2201241923410000255',

    //用药目的
    Purpose = '2201051734480001280',
    //保健
    PurposeA = '2202100958040000155',
    //治疗
    PurposeB = '2202100958040000255',

    //称重目的
    WeighAim = '2201051734480001580',

    //用药途径
    DrugsWay = '201804101052151001',
    //饮水
    DrugsWayA = '201804101052151101',
    //拌料
    DrugsWayB = '201804101052151102',
    //注射
    DrugsWayC = '201804101052151103',
    //喷雾
    DrugsWayD = '201804101052151104',
    //浸泡
    DrugsWayE = '201804101052151105',

    //免疫方式
    ImmuneType = '201711231051151001',
    //注射
    ImmuneTypeA = '201711231051151101',
    //饮水
    ImmuneTypeB = '201711231051151102',
    //滴鼻点眼
    ImmuneTypeC = '201711231051151103',
    //刺种
    ImmuneTypeD = '201711231051151104',
    //气雾
    ImmuneTypeE = '201711231051151105',
    //滴口
    ImmuneTypeF = '201711231051151106',
    //其他
    ImmuneTypeG = '201711231051151107',

    //家禽类型
    ChickenType = '2201051734480003780',

    //消毒方式
    SterilizeMethod = '201711231003151001',
    //喷雾
    SterilizeMethodA = '201711231003151101',
    //浸泡
    SterilizeMethodB = '201711231003151102',
    //熏蒸
    SterilizeMethodC = '201711231003151103',
    //清洗
    SterilizeMethodD = '201711231003151104',


    //拣后类别
    SortingEggType = '2201051734480001880',
    //可入孵种蛋
    SortingEggTypeA = '2202151128470000155',
    //商品蛋
    SortingEggTypeB = '2202151128470000255',
    //鸡场损耗
    SortingEggTypeC = '2202151128470000355',
    //运输损耗
    SortingEggTypeD = '2202151128470000455',
    //分拣损耗
    SortingEggTypeE = '2202151128470000555',

    //分拣蛋名称
    SortingEggID = '2201051734480001980',
    //可入孵种蛋
    SortingEggIDA = '2202151130420000155',
    //二级种蛋
    SortingEggIDB = '2202151130420000255',
    //三级种蛋
    SortingEggIDC = '2202151130420000355',
    //四级种蛋
    SortingEggIDD = '2202151130420000455',
    //转商品蛋
    SortingEggIDE = '2202151130420000555',
    //转小蛋
    SortingEggIDF = '2202151130420000655',
    //转脏蛋
    SortingEggIDG = '2202151130420000755',
    //破碎蛋
    SortingEggIDH = '2202151130420000855',
    //空位
    SortingEggIDI = '2202151130420000955',
    //运输损耗
    SortingEggIDJ = '2202151130420001055',
    //分拣损耗
    SortingEggIDK = '2202151130420001155',

    //产蛋分类
    LayEggType = '2201051734480001680',
    //种鸡场合格种蛋
    LayEggTypeA = '2202150930150000155',
    //种鸡场不合格种蛋
    LayEggTypeB = '2202150930150000255',
    //种鸡场淘汰蛋
    LayEggTypeC = '2202150930150000355',

    //产蛋名称
    LayEggID = '2201051734480001780',
    //合格种蛋
    LayEggIDA = '2202150944440000155',
    //畸形蛋
    LayEggIDB = '2202150944440000255',
    //双黄蛋
    LayEggIDC = '2202150944440000355',
    //破损蛋
    LayEggIDD = '2202150944440000455',
    //软皮蛋
    LayEggIDE = '2202150944440000555',
    //脏蛋
    LayEggIDF = '2202150944440000655',
    //小蛋
    LayEggIDG = '2202150944440000755',
    //菜蛋
    LayEggIDH = '2202150944440000855',


    //照蛋类型
    EggTesterType = '2201051734480001480',
    //照蛋即落盘
    EggTesterTypeA = '2202111027080000155',
    //先照蛋后落盘
    EggTesterTypeB = '2202111027080000255',
    //多次照蛋
    EggTesterTypeC = '2202111027080000355',

    //孵化机类型
    IncubatorType = '2201051734480001380',
    //单阶段大箱体
    IncubatorTypeA = '2202110954060000155',
    //单阶段小箱体
    IncubatorTypeB = '2202110954060000255',
    //巷道式多阶段
    IncubatorTypeC = '2202110954060000355',


    //胚蛋类别
    EmbryoEggType = '2201051734480002080',
    //无精蛋
    EmbryoEggTypeA = '2202231432370000155',
    //死精蛋
    EmbryoEggTypeB = '2202231432370000255',
    //活胚蛋
    EmbryoEggTypeC = '2202231432370000355',

    //胚蛋名称
    EmbryoEggID = '2201051734480002180',
    //白蛋
    EmbryoEggIDA = '2202231433100000155',
    //死精蛋
    EmbryoEggIDB = '2202231433100000255',
    //臭蛋
    EmbryoEggIDC = '2202231433100000355',
    //空壳蛋
    EmbryoEggIDD = '2202231433100000455',
    //破蛋
    EmbryoEggIDE = '2202231433100000555',
    //入库活胚蛋
    EmbryoEggIDF = '2202231433100000655',
    //在孵活胚蛋
    EmbryoEggIDG = '2202231433100000755',

    /**雏规格*/
    NestlingSpec = '2201051734480002380',
    //大
    NestlingSpecA = '2202251445290000155',
    //中
    NestlingSpecB = '2202251445290000255',
    //小
    NestlingSpecC = '2202251445290000355',
    //不分
    NestlingSpecD = '2202251445290000455',


    /**照蛋状态*/
    EggtesterStatus = '2201051734480002480',
    //未照蛋
    EggtesterStatusA = '2202281347220000155',
    //部分照蛋
    EggtesterStatusB = '2202281347220000255',
    //全部照蛋
    EggtesterStatusC = '2202281347220000355',

    /**照蛋状态*/
    BreedingEggSource = '2201051734480002280',
    //未照蛋
    BreedingEggSourceA = '2202251318330000155',
    //部分照蛋
    BreedingEggSourceB = '2202251318330000255',
    //全部照蛋
    BreedingEggSourceC = '2202251318330000355',
    //未照蛋
    BreedingEggSourceD = '2202251318330000455',
    //部分照蛋
    BreedingEggSourceE = '2202251318330000555',
    //全部照蛋
    BreedingEggSourceF = '2202251318330000655',

    // 出雏名称
    ChickEggID = '2201051734480002580',
    // 健雏
    ChickEggIDA = '2203031914570000155',
    // 弱雏
    ChickEggIDB = '2203031914570000255',
    // 残次雏
    ChickEggIDC = '2203031914570000355',
    // 死雏
    ChickEggIDD = '2203031914570000455',
    // 毛蛋
    ChickEggIDE = '2203031914570000555',

    //销售摘要
    SalesAbstract = '201610140104402501',
    // 销售转出
    SalesAbstractA = '201610140104402502',
    // 内销转出
    SalesAbstractB = '201610140104402503',

    //计价方式
    PricingMode = '2201051734480002780',
    // 按重量计价
    PricingModeA = '2205131115250000155',
    // 按只计价
    PricingModeB = '2205131115250000255',


    //入孵照蛋摘要
    BroodMode = '2201051734480002980',
    //种蛋入孵
    BroodModeA = '2207041335590000155',
    //入孵期初
    BroodModeB = '2207041335590000255',
    //日常照蛋
    BroodModeC = '2207041335590000355',
    //期初照蛋
    BroodModeD = '2207041335590000455',

    //养殖标准
    BreedStandardTypeA = '201706211003402003',
    //孵化标准指标
    BreedStandardTypeB = '201905151010251000',

    //成本价调拨
    MaterialSupplyPolicyA ='2212201025170000150',
    //约定价领用
    MaterialSupplyPolicyB ='2212201025170000250',
    //销售
    MaterialSupplyPolicyC ='2212201025170000350',
    ReceiveTypeA = '2201131702170001255',
    ReceiveTypeB = '2201131702170001355',

    /**苗源类型 */
    //外购
    ChickSourceA = '2212241629580000150',
    //自产
    ChickSourceB = '2212241629580000250',

    /**价格类型 - 默认 */
    PriceTypeDefault = '2301051115370000150',
}

export class DataDictionarySource {

    static fieldsSource = [
        { fieldName: 'intoQuantity',fieldText: '进苗只数', fieldType: 1,Category: '出栏信息' },
        { fieldName: 'outQuantity',fieldText: '出栏数量', fieldType: 1,Category: '出栏信息' },
        { fieldName: 'outWeight',fieldText: '出栏重量', fieldType: 2,Category: '出栏信息' },
        { fieldName: 'firstQuantity',fieldText: '一等只数', fieldType: 1,Category: '出栏信息' },
        { fieldName: 'firstWeight',fieldText: '一等重量', fieldType: 2,Category: '出栏信息' },
        { fieldName: 'secondQuantity',fieldText: '二等只数', fieldType: 1,Category: '出栏信息' },
        { fieldName: 'secondWeight',fieldText: '二等重量', fieldType: 2,Category: '出栏信息' },
        { fieldName: 'thirdQuantity',fieldText: '三等只数', fieldType: 1,Category: '出栏信息' },
        { fieldName: 'thirdWeight',fieldText: '三等重量', fieldType: 2,Category: '出栏信息' },
        { fieldName: 'feedingdays',fieldText: '饲养天数', fieldType: 1,Category: '饲养业绩'},
        { fieldName: 'listingRate',fieldText: '上市率', fieldType: 2,Category: '饲养业绩' },
        { fieldName: 'feedRatio',fieldText: '料肉比', fieldType: 2,Category: '饲养业绩' },
        { fieldName: 'rejectRate',fieldText: '淘汰率', fieldType: 2,Category: '饲养业绩' },
        { fieldName: 'deathRate',fieldText: '死亡率', fieldType: 2,Category: '饲养业绩' },
        { fieldName: 'deathQuantity',fieldText: '死亡只数', fieldType: 1,Category: '饲养业绩' },
        { fieldName: 'cullQuantity',fieldText: '淘汰只数', fieldType: 1,Category: '饲养业绩' },
        { fieldName: 'feedReceWeight',fieldText: '饲料领用重量', fieldType: 2,Category: '耗料数据', },
        { fieldName: 'feedFreight',fieldText: '饲料运价', fieldType: 2, Category: '运费' },
        { fieldName: 'poultryFreight',fieldText: '禽苗运价', fieldType: 2, Category: '运费' },
        { fieldName: 'poultryRecoveryRate',fieldText: '肉禽回收运价', fieldType: 2, Category: '运费' },
        { fieldName: 'calcFreightFeedWeight',fieldText: '计算运费饲料重量', fieldType: 2, Category: '运费' },
    ];

    static ReceiveTypeSource = [
        {Value: DataDictionary.ReceiveTypeA, Text: '领取'},
        {Value: DataDictionary.ReceiveTypeB, Text: '退回'},
    ];

    static ConfirmStatusSource = [
        {value: 1, name:'是'},
        {value: 0, name:'否'}
    ]

    static blImmunitySource = [
        {value: true, name:'是'},
        {value: false, name:'否'}
    ]

    static BatchRule = [
        {BatchSubjectID:'ChickenFarmID',BatchSubjectName:'养殖场'},
        {BatchSubjectID:'HenhouseID',BatchSubjectName:'栋舍'},
        {BatchSubjectID:'BatchID',BatchSubjectName:'养殖批次'},
        {BatchSubjectID:'BreedingID',BatchSubjectName:'品种'},
        {BatchSubjectID:'ProductionDate',BatchSubjectName:'生产日期'},
        {BatchSubjectID:'BatchRemarks',BatchSubjectName:'批号备注'}
    ]

    static PurchaseSource = [
        {Purchase:'201610140104402302',PurchaseName:'外购转入'},
        {Purchase:'201610140104402303',PurchaseName:'内购转入'},
        {Purchase:'201611300104402201',PurchaseName:'仓库期初'}
    ]
    static PurchaseSourceText(value : string) {
        var PurchaseName ='';
        DataDictionarySource.PurchaseSource.forEach((result) => {
            if(result.Purchase==value){
                PurchaseName =  result.PurchaseName;
            }
        });
        return PurchaseName;
    }

    static UnitSource = [
        {UnitId:'1809121019130004601',UnitName:'筐'},
        {UnitId:'2016033109618455895',UnitName:'吨'},
        {UnitId:'2016033109836870826',UnitName:'公斤'},
        {UnitId:'2016033111189189746',UnitName:'克'},
        {UnitId:'2016033111886581715',UnitName:'袋'},
        {UnitId:'2016033112291186777',UnitName:'桶'},
        {UnitId:'2016033112500302839',UnitName:'个'},
        {UnitId:'2016033112664484807',UnitName:'枚'},
        {UnitId:'2016033112859884687',UnitName:'斤'},
        {UnitId:'2016033113097629849',UnitName:'箱'},
        {UnitId:'2016033113530024985',UnitName:'盒'},
        {UnitId:'2018010610219878174',UnitName:'板'},
        {UnitId:'2018010610219878175',UnitName:'打'},
        {UnitId:'2018010610219878176',UnitName:'件'},
        {UnitId:'2018010610219878177',UnitName:'辆'},
        {UnitId:'2018010610219878187',UnitName:'盘'}
    ]

    static SettingSource = [
        {ID:'1',Name:'未设置'},
        {ID:'2',Name:'已设置'}
    ]

    static SexTypeSource = [
        {SexType:'201711171453531101',SexTypeName:'公'},
        {SexType:'201711171453531102',SexTypeName:'母'},
        {SexType:'201711171453531103',SexTypeName:'混合'}
    ]
    static SexTypeSourceText(value : string) {
        var SexTypeName ='';
        DataDictionarySource.SexTypeSource.forEach((result) => {
            if(result.SexType==value){
                SexTypeName =  result.SexTypeName;
            }
        });
        return SexTypeName;
    }
    static DosageUnitSource = [
        {DosageUnit:'2016033113546543179',DosageUnitName:'毫升'},
        {DosageUnit:'2016033112432190411',DosageUnitName:'羽份'}
    ]
    static DosageUnitSourceText(value : string) {
        return value=='2016033113546543179'?'毫升':'羽份';
    }
    static EggTesterTypeSource = [
        {EggTesterType:'2202111027080000155',EggTesterTypeName:'照蛋即落盘'},
        {EggTesterType:'2202111027080000255',EggTesterTypeName:'先照蛋后落盘'}
    ]
    static WhetherSource = [
        {value:'1',text:'是'},
        {value:'0',text:'否'}
    ]
    static ScalingTypeSource = [
        {ScalingType:1,ScalingTypeName:'='},
        {ScalingType:0,ScalingTypeName:'≈'}
    ]
    static ScalingTypeSourceText(value : number) {
        return value==1?'=':'≈';
    }
    static ScalingType = 1;

    static SignForStatusSource = [
        {SignForStatus:'0',SignForStatusName:'未签收'},
        // {SignForStatus:'1',SignForStatusName:'部分签收'},
        {SignForStatus:'2',SignForStatusName:'已签收'}
    ]

    static AuditSource = [
        // {ID:'1',Name:'全部'},
        {ID:'2',Name:'未审核'},
        {ID:'3',Name:'已审核'}
    ]

    static ImmuneTypeSource = [
        //注射
        {ImmuneType: '201711231051151101', ImmuneTypeName: '注射'},
        //饮水
        {ImmuneType: '201711231051151102', ImmuneTypeName: '饮水'},
        //滴鼻点眼
        {ImmuneType: '201711231051151103', ImmuneTypeName: '滴鼻点眼'},
        //刺种
        {ImmuneType: '201711231051151104', ImmuneTypeName: '刺种'},
        //气雾
        {ImmuneType: '201711231051151105', ImmuneTypeName: '气雾'},
        //滴口
        {ImmuneType: '201711231051151106', ImmuneTypeName: '滴口'},
        //其他
        {ImmuneType: '201711231051151107', ImmuneTypeName: '其他'},
    ];

    static ImmuneTypeSourceText(key:string | number){
        let result = '未知选项';
        this.ImmuneTypeSource.forEach(x => {
            if (key.toString() == x.ImmuneType){
                result = x.ImmuneTypeName;
            }
        })
        return result;
    }
    

    static MaterialSupplyPolicySource = [
        //成本价调拨
        {MaterialSupplyPolicy: '2212201025170000150', MaterialSupplyPolicyName: '成本价调拨'},
        //约定价领用
        {MaterialSupplyPolicy: '2212201025170000250', MaterialSupplyPolicyName: '约定价领用'},
        //销售
        // {MaterialSupplyPolicy: '2212201025170000350', MaterialSupplyPolicyName: '销售'},
    ];

    static MaterialSupplyPolicySourceText(key:string | number){
        let result = '未知选项';
        this.MaterialSupplyPolicySource.forEach(x => {
            if (key.toString() == x.MaterialSupplyPolicy){
                result = x.MaterialSupplyPolicyName;
            }
        })
        return result;
    }

    static ChickSourceTypeSource = [
        {id: "2212241629580000150", name: "外购"},
        {id: "2212241629580000250", name: "自产"},
    ];

    static OutHouseRecycleQuote = [
        {value: "2201131629250004155", name: "回收销售过磅"},
        {value: "2201131629250004255", name: "回收入库过磅"}
    ];

    static PoultrySalesRankSource = [
        {name: "一级", value: "2301110928400000150"},
        {name: "二级", value: "2301110928400000250"},
        {name: "三级", value: "2301110928400000350"},
    ];
}


