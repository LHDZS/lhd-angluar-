import { DateTime } from 'src/app/providers/common/datetime';
import { DataDictionary } from 'src/app/providers/enums';

export class yhsettlementModel {
    RecycleType: string = 'number;number;011316number;9number;50004155';
    DataDate: any = new Date();
    CustomerID: string = '0';
    YHFarmerID: string = '0';
    YHBatch: string = '0';
    ChickenFarmID: string = '0';
    HenhouseID: string = '0';
    PersonID: string = '0';
    WarehouseID: string = '0';
    Remarks: string = '';
    Number: string = '0';
    NumericalOrder: string = '0';
    NumberRef: string = '0';
    NumericalOrderRef: string = '0';
    ComboPack: string = DataDictionary.ComboPackF;
    AverageOutHouseAges: number;
    Averageweight: number;
    BatchTotalAmount: number;
    ChickenReceiveAmount: number;
    ChickenReceiveDate: string = '2023/03/22';
    BreedingName: string = '健母雏';
    ChickenType: string = '类型3';
    clearHouseDate: string;
    CullQuantity: number;
    CullRate: number;
    DeathFowlweight: number;
    DeathOuantity: number;
    DeductionAmount: number;
    DeductionGrossProfit: number;
    DrugReceiveAmount: number;
    EggRecycleAmount: number;
    EuropeanIndex: number;
    FarmingCanProfit: number;
    FaultyLevel: number;
    FeedIntake: number;
    FeedingDays: number;
    FemaleFeedingDays: number;
    FosterFee: number;
    GrossProfit: number;
    HairyFowlweight: number;
    MaleFeedingDays: number;
    aterialReceiveAmount: number;
    eatFeedRatio: number;
    Numericalorder: number;
    Onelevel: number;
    OneMedicineFee: number;
    OtherOutAmount: number;
    otherOutOuantity: number;
    OtherReceiveAmount: number;
    OutDeathQuantity: number;
    OutPerGrossProfit: number;
    OutRecycleAmount: number;
}

const columnSettingArr1: any = [
    {
        'dataField': 'ChickenReceiveDate',
        'caption': '进苗日期',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'BreedingName',
        'caption': '批次品种',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'ChickenTypeName',
        'caption': '家禽类型',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'ClearHouseDate',
        'caption': '完棚日期',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'MaleFeedingDays',
        'caption': '公养殖天数',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': false,
        'type': 'number'
    }, {
        'dataField': 'FemaleFeedingDays',
        'caption': '母养殖天数',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': false,
        'type': 'number'
    }, {
        'dataField': 'FeedingDays',
        'caption': '养殖天数',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'AverageOutHouseAges',
        'caption': '出栏日龄',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'ValueQuantity',
        'caption': '领苗计价只数',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'ThrowQuantity',
        'caption': '抛苗只数',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'DeathQuantity',
        'caption': '死亡只数',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'CullQuantity',
        'caption': '淘汰只数',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'OutRecycleQuantity',
        'caption': '出栏回收只数',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'UnknownQuantity',
        'caption': '去向不明只数',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'HairyFowlWeight',
        'caption': '毛禽重量(公斤)',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'SettlementWeight',
        'caption': '结算重量(公斤)',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'FeedIntake',
        'caption': '耗料量(公斤)',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }
];

const columnSettingArr2: any = [
    {
        'dataField': 'SurvivalRate',
        'caption': '成活率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'MeatFeedRatio',
        'caption': '料肉比',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'OneMedicineFee',
        'caption': '只药费',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'AverageWeight',
        'caption': '只均重（斤/只）',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'OneLevel',
        'caption': '一级率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'TwoLevel',
        'caption': '二级率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'ThreeLevel',
        'caption': '三级率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'FaultyLevel',
        'caption': '次品率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'PerFeedIntake',
        'caption': '只耗料（斤/只）',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'ReceivePerGrossProfit',
        'caption': '进苗只毛利',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'OutPerGrossProfit',
        'caption': '出栏只毛利',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'EuropeanIndex',
        'caption': '欧指',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'CullRate',
        'caption': '淘汰率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'FaultyQuantity',
        'caption': '次鸡数',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }
];

const columnSettingArr3: any = [
    {
        'dataField': 'OutRecycleAmount',
        'caption': '出栏回收金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true

    }, {
        'dataField': 'ChickenReceiveAmount',
        'caption': '领苗金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'MaterialReceiveAmount',
        'caption': '领料金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'ImmuneReceiveAmount',
        'caption': '领疫苗金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'DrugReceiveAmount',
        'caption': '领药金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'OtherReceiveAmount',
        'caption': '领其他金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'SubsidyGrossProfit',
        'caption': '补贴金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'text': '（计入毛利）',
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'SubsidyAmount',
        'caption': '补贴金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'text': '（不计毛利）',
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'DeductionGrossProfit',
        'caption': '扣款金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'text': '（计入毛利）',
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'DeductionAmount',
        'caption': '扣款金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'text': '（不计毛利）',
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'WithholdGrossProfit',
        'caption': '代扣金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'text': '（计入毛利）',
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'WithholdAmount',
        'caption': '代扣金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'text': '（不计毛利）',
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'GrossProfit',
        'caption': '毛利总额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'BatchTotalAmount',
        'caption': '批次总收入',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }, {
        'dataField': 'RollInMarginBalance',
        'caption': '转入保证金',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': false,
        'type': 'number'
    }, {
        'dataField': 'FarmingCanProfit',
        'caption': '养户可提利润',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true,
        'readOnly': true
    }
];

const detailSourceArr: any = [
    {
        'dataField': 'DataDate',
        'HeaderRequiredIcon': true,
        'caption': '出栏日期',
        "fixed": true,
        'alignment': 'center',
        'allowEditing': false,
        'width': 120,
        'XIndex': [0],
        'YIndex': [0,1]
    },{
        'dataField': 'cProductName',
        'HeaderRequiredIcon': true,
        'caption': '入库商品代号',
        "fixed": false,
        'alignment': 'left',
        'allowEditing': false,
        'width': 120,
        'XIndex': [0],
        'YIndex': [0,2]
    },{
        'dataField': 'SexTypeName',
        'HeaderRequiredIcon': true,
        'caption': '公母',
        "fixed": false,
        'alignment': 'center',
        'allowEditing': false,
        'width': 120,
        'XIndex': [0],
        'YIndex': [0,2]
    },{
        'dataField': 'PoultrySalesRankName',
        'HeaderRequiredIcon': true,
        'caption': '等级',
        "fixed": false,
        'alignment': 'left',
        'allowEditing': false,
        'width': 120,
        'XIndex': [0],
        'YIndex': [0,2]
    },{
        'dataField': 'BreedingName',
        'HeaderRequiredIcon': true,
        'caption': '入库品种',
        "fixed": false,
        'alignment': 'left',
        'allowEditing': false,
        'width': 120,
        'XIndex': [0],
        'YIndex': [0,2]
    },{
        'dataField': 'ElementQuantity',
        'HeaderRequiredIcon': true,
        'caption': '只数',
        "fixed": false,
        'alignment': 'right',
        'allowEditing': false,
        'width': 120,
        'XIndex': [0],
        'YIndex': [0,1,2]
    },{
        'dataField': 'NetWeight',
        'HeaderRequiredIcon': true,
        'caption': '净重(公斤)',
        "fixed": false,
        'alignment': 'right',
        'allowEditing': false,
        'width': 120,
        'XIndex': [0],
        'YIndex': [0,1,2]
    }, 
    // ↑第一排 出栏回收
    {
        'dataField': 'DataDate',
        'HeaderRequiredIcon': true,
        'caption': '日期',
        "fixed": true,
        'alignment': 'center',
        'allowEditing': false,
        'width': 120,
        'XIndex': [1,2,3,4,5,6,7,8],
        'YIndex': [0,1]
    }, {
        'dataField': 'Number',
        'caption': '单据号',
        "fixed": true,
        'allowEditing': false,
        'alignment': 'left',
        'width': 120,
        'XIndex': [0,1,2,3,4,5,6,7,8],
        'YIndex': [0,1]
    }, {
        'dataField': 'ReceiveTypeName',
        'caption': '类别',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'center',
        'width': 80,
        'XIndex': [2,3],
        'YIndex': [0,1]
    }, {
        'dataField': 'iSortPlusName',
        'caption': '内置属性',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'center',
        'width': 120,
        'XIndex': [2,3,5],
        'YIndex': [0,2]
    }, {
        'dataField': '暂无',
        'caption': '饲料阶段',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'string',
        'alignment': 'left',
        'width': 120,
        'XIndex': [2,5],
        'YIndex': [0,2]
    }, {
        'dataField': 'CommonName',
        'caption': '通用名',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'center',
        'width': 120,
        'XIndex': [3],
        'YIndex': [0,2]
    },
    //死淘
    {
        'dataField': 'DeathQuantity',
        'caption': '死亡只数',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'right',
        'width': 100,
        'XIndex': [6],
        'YIndex': [0,1,2]
    },{
        'dataField': 'CullQuantity',
        'caption': '淘汰只数',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'right',
        'width': 100,
        'XIndex': [6],
        'YIndex': [0,1,2]
    },
    //清棚
    {
        'dataField': 'DeathCullOuter',
        'caption': '补登死亡',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'right',
        'width': 100,
        'XIndex': [7],
        'YIndex': [0,1,2]
    },{
        'dataField': 'WeedOuter',
        'caption': '补登淘汰',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'right',
        'width': 100,
        'XIndex': [7],
        'YIndex': [0,1,2]
    },{
        'dataField': 'UnknownQuantity',
        'caption': '不明去向',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'right',
        'width': 100,
        'XIndex': [7],
        'YIndex': [0,1,2]
    },
    //保证金
    {
        'dataField': 'AccountTypeName',
        'caption': '收支类型',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'center',
        'width': 100,
        'XIndex': [8],
        'YIndex': [0,1,2]
    },{
        'dataField': 'Amount',
        'caption': '金额',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'right',
        'width': 120,
        'XIndex': [8],
        'YIndex': [0,1,2]
    },{
        'dataField': 'QuoteNumber',
        'caption': '关联单据',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'left',
        'width': 100,
        'XIndex': [8],
        'YIndex': [0,1]
    },{
        'dataField': 'QuoteNumericalOrder',
        'caption': '关联单号',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'left',
        'width': 100,
        'XIndex': [8],
        'YIndex': [0,1]
    },{
        'dataField': 'Remarks',
        'caption': '备注',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'left',
        'width': 100,
        'XIndex': [8],
        'YIndex': [0,1]
    },
    //
     {
        'dataField': 'cProductName',
        'caption': '商品代号',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'left',
        'width': 120,
        'XIndex': [1,2,3,5],
        'YIndex': [0,2]
    }, {
        'dataField': 'Specification',
        'caption': '规格',
        'dataType': 'string',
        'alignment': 'center',
        'fixedPoint': 4,
        'allowEditing': false,
        'width': 80,
        'XIndex': [2,3,5],
        'YIndex': [0,2]
    }, {
        'dataField': 'bIsStandardPackText',
        'caption': '标品',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'center',
        'width': 80,
        'XIndex': [2,3,5],
        'YIndex': [0,2]
    }, {
        'dataField': 'StandardPack',
        'caption': '标包',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'center',
        'width': 80,
        'XIndex': [2,3,5],
        'YIndex': [0,2]
    }, {
        'dataField': 'ProductBatchName',
        'caption': '批号',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'number',
        'alignment': 'left',
        'width': 80,
        'XIndex': [1,2,3,5],
        'YIndex': [0]
    }, {
        'dataField': 'Packages',
        'caption': '件数',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'number',
        'alignment': 'right',
        'width': 80,
        'XIndex': [2,3,5],
        'YIndex': [0,1,2]
    }, {
        'dataField': 'Quantity',
        'caption': '数量',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'number',
        'alignment': 'right',
        'width': 100,
        'XIndex': [2,3,5],
        'YIndex': [0,1,2]
    }, {
        'dataField': 'Quantity',
        'caption': '数量',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'number',
        'alignment': 'right',
        'width': 100,
        'XIndex': [0],
        'YIndex': [0,2]
    }, {
        'dataField': 'ValueQuantity',
        'HeaderRequiredIcon': true,
        'caption': '计价只数',
        "fixed": false,
        'alignment': 'right',
        'allowEditing': false,
        'width': 120,
        'XIndex': [1],
        'YIndex': [0,1,2]
    },{
        'dataField': 'MeasureUnitName',
        'caption': '计量单位',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'string',
        'alignment': 'center',
        'width': 80,
        'XIndex': [0,1,2,3,5],
        'YIndex': [0,2]
    }, {
        'dataField': 'UnitPrice',
        'caption': '开票单价',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'number',
        'alignment': 'right',
        'width': 80,
        'XIndex': [0,1,2,3],
        'YIndex': [0]
    }, {
        'dataField': 'Amount',
        'caption': '开票金额',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'number',
        'alignment': 'right',
        'width': 80,
        'XIndex': [0,1,2,3],
        'YIndex': [0,1,2]
    },  {
        'dataField': 'AvgUnitPrice',
        'caption': '平均开票单价',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'number',
        'alignment': 'right',
        'width': 100,
        'XIndex': [0,1,2,3],
        'YIndex': [2]
    },{
        'dataField': 'SettlementUnitPrice',
        'caption': '结算单价',
        'dataType': 'number',
        'alignment': 'right',
        'fixedPoint': 4,
        'allowEditing': false,
        'width': 80,
        'XIndex': [0,1,2,3],
        'YIndex': [0]
    }, {
        'dataField': 'SettlementAmount',
        'caption': '结算金额',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'right',
        'width': 80,
        'XIndex': [0,1,2,3],
        'YIndex': [0,1,2]
    }, {
        'dataField': 'AvgSettlementUnitPrice',
        'caption': '平均结算单价',
        'dataType': 'number',
        'alignment': 'right',
        'fixedPoint': 4,
        'allowEditing': false,
        'width': 100,
        'XIndex': [0,1,2,3],
        'YIndex': [2]
    }, {
        'dataField': 'GiftName',
        'caption': '赠',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'center',
        'width': 80,
        'XIndex': [1,2,3],
        'YIndex': [0,2]
    }, {
        'dataField': 'DonateQuantity',
        'caption': '抛苗只数',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'number',
        'alignment': 'right',
        'width': 100,
        'XIndex':[1],
        'YIndex': [0,1,2]
    }, {
        'dataField': 'TotalQuantity',
        'caption': '总只数',
        'dataType': 'number',
        'alignment': 'right',
        'fixedPoint': 4,
        'allowEditing': false,
        'width': 100,
        'XIndex':[1],
        'YIndex': [0,1,2]
    }, {
        'dataField': 'HenhouseName',
        'caption': '栋舍',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'center',
        'width': 120,
        'XIndex':[0,1,2,3,7],
        'YIndex': [0]
    }, {
        'dataField': 'HenhouseName',
        'caption': '栋舍',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'center',
        'width': 120,
        'XIndex':[5],
        'YIndex': [0,1,2]
    }, {
        'dataField': 'HenhouseName',
        'caption': '栋舍',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'center',
        'width': 120,
        'XIndex':[6],
        'YIndex': [0,1]
    }, {
        'dataField': 'SupplierName',
        'caption': '供应商',
        "fixed": false,
        'allowEditing': false,
        'alignment': 'center',
        'width': 120,
        'XIndex':[1],
        'YIndex': [0,1]
    }, {
        'dataField': 'FarmName',
        'caption': '来源禽场',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'string',
        'alignment': 'left',
        'width': 120,
        'XIndex':[1],
        'YIndex': [0]
    },
    // 第四排，批次补扣
    {
        'dataField': 'YHSubsidyName',
        'caption': '项目名称',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'string',
        'alignment': 'left',
        'width': 160,
        'XIndex':[4],
        'YIndex': [0,2]
    },{
        'dataField': 'YhSubsidyCode',
        'caption': '项目编码',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'string',
        'alignment': 'left',
        'width': 80,
        'XIndex':[4],
        'YIndex': [0,2]
    },{
        'dataField': 'YhSubsidyTypeName',
        'caption': '补扣类型',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'string',
        'alignment': 'center',
        'width': 80,
        'XIndex':[4],
        'YIndex': [0,2]
    },{
        'dataField': 'GrossProfitName',
        'caption': '计入毛利',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'string',
        'alignment': 'right',
        'width': 80,
        'XIndex':[4],
        'YIndex': [0,2]
    },{
        'dataField': 'SunsidyAmount',
        'caption': '补扣金额',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'number',
        'alignment': 'right',
        'width': 100,
        'XIndex':[4],
        'YIndex': [0,1,2]
    },{
        'dataField': 'AdjustFactor',
        'caption': '调整系数/固定金额',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'number',
        'alignment': 'right',
        'width': 150,
        'XIndex':[4],
        'YIndex': [0]
    },{
        'dataField': 'AdjustAmount',
        'caption': '调整后金额',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'number',
        'alignment': 'right',
        'width': 100,
        'XIndex':[4],
        'YIndex': [0,1,2]
    },{
        'dataField': 'ExpTypeName',
        'caption': '公式类型',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'string',
        'alignment': 'left',
        'width': 120,
        'XIndex':[4],
        'YIndex': [0,2]
    },{
        'dataField': 'Expression',
        'caption': '计算公式',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'string',
        'alignment': 'left',
        'width': 120,
        'XIndex':[4],
        'YIndex': [0,2]
    },
    // 通用
    {
        'dataField': 'DetailRemarks',
        'caption': '表体备注',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'string',
        'alignment': 'left',
        'width': 120,
        'XIndex':[0,1,2,3,4,7],
        'YIndex': [0]
    }, {
        'dataField': 'Remarks',
        'caption': '表头备注',
        'dataType': 'string',
        'alignment': 'left',
        'fixedPoint': 4,
        'allowEditing': false,
        'width': 120,
        'XIndex':[0,1,2,3,4,7],
        'YIndex': [0,1]
    }, {
        'dataField': 'YHFarmerName',
        'caption': '养户名称',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'dataType': 'string',
        'alignment': 'center',
        'width': 120,
        'XIndex':[0,1,2,3,5,6,7,8],
        'YIndex': [0,1,2]
    }, {
        'dataField': 'YHBatchName',
        'caption': '养户批次',
        'dataType': 'string',
        'alignment': 'left',
        'fixedPoint': 4,
        'allowEditing': false,
        'width': 120,
        'XIndex':[0,1,2,3,5,6,7],
        'YIndex': [0,1,2]
    },
    // 第五排，饲喂/死淘
    {
        'dataField': 'isbeginName',
        'caption': '计算运费',
        'dataType': 'string',
        'alignment': 'left',
        'fixedPoint': 4,
        'allowEditing': false,
        'width': 100,
        'XIndex':[2],
        'YIndex': [0,1]
    }, {
        'dataField': 'isbeginName',
        'caption': '期初',
        'dataType': 'string',
        'alignment': 'left',
        'fixedPoint': 4,
        'allowEditing': false,
        'width': 100,
        'XIndex':[0,1,3,5,6],
        'YIndex': [0,1]
    }, {
        'dataField': 'isbeginName',
        'caption': '期初',
        'dataType': 'string',
        'alignment': 'left',
        'fixedPoint': 4,
        'allowEditing': false,
        'width': 100,
        'XIndex':[2],
        'YIndex': [0,1,2]
    },
];

const companiesData: any = [{
    id: 0,
    RecycleType: '2201131629250004155',
    CompanyName: '出栏回收',
}, {
    id: 1,
    RecycleType: '2201131629250004255',
    CompanyName: '领苗',
}, {
    id: 2,
    RecycleType: '2201131629250004555',
    CompanyName: '领料',
}, {
    id: 1,
    RecycleType: '2201131629250004255',
    CompanyName: '领药杂',
}, {
    id: 2,
    RecycleType: '2201131629250004555',
    CompanyName: '批次补扣',
}, {
    id: 1,
    RecycleType: '2201131629250004255',
    CompanyName: '饲喂',
}, {
    id: 2,
    RecycleType: '2201131629250004555',
    CompanyName: '死淘',
}, {
    id: 1,
    RecycleType: '2201131629250004255',
    CompanyName: '清棚',
}, {
    id: 2,
    RecycleType: '2201131629250004555',
    CompanyName: '保证金',
}]

const productsData: any = [
    {
        id: '0',
        text: '明细表',
        expanded: true,
    }, {
        id: '1',
        text: '单据汇总',
        expanded: true,
    }, {
        id: '2',
        text: '商品汇总',
        expanded: true,
    }
]

export { columnSettingArr1, columnSettingArr2, columnSettingArr3, detailSourceArr, companiesData, productsData }

// 数据
export class yhsettlementDataModel {
    RecycleType: string = 'number;number;011316number;9number;50004155';
    DataDate: any = new Date();
    CustomerID: string = '0';
    YHFarmerID: string = '0';
    YHBatch: string = '0';
    ChickenFarmID: string = '0';
    HenhouseID: string = '0';
    PersonID: string = '0';
    PersonIDs: any = [];
    WarehouseID: string = '0';
    Remarks: string = '';
    Number: string = '0';
    NumericalOrder: string = '0';
    NumberRef: string = '0';
    NumericalOrderRef: string = '0';
    ComboPack: string = DataDictionary.ComboPackF;
    AverageOutHouseAges: number;
    Averageweight: number;
    BatchTotalAmount: number;
    ChickenReceiveAmount: number;
    ChickenReceiveDate: string = '2023/03/22';
    BreedingName: string = '健母雏';
    ChickenType: string = '类型3';
    clearHouseDate: string;
    CullQuantity: number;
    CullRate: number;
    DeathFowlweight: number;
    DeathOuantity: number;
    DeductionAmount: number;
    DeductionGrossProfit: number;
    DrugReceiveAmount: number;
    EggRecycleAmount: number;
    EuropeanIndex: number;
    FarmingCanProfit: number;
    FaultyLevel: number;
    FeedIntake: number;
    FeedingDays: number;
    FemaleFeedingDays: number;
    FosterFee: number;
    GrossProfit: number;
    HairyFowlweight: number;
    MaleFeedingDays: number;
    aterialReceiveAmount: number;
    eatFeedRatio: number;
    Numericalorder: number;
    Onelevel: number;
    OneMedicineFee: number;
    OtherOutAmount: number;
    otherOutOuantity: number;
    OtherReceiveAmount: number;
    OutDeathQuantity: number;
    OutPerGrossProfit: number;
    OutRecycleAmount: number;
}

export class YHFarmerConcertRelateDto {
    BO_ID: string = '0';
    Name: string = '';
    Phone: string = '';
    NumericalOrderDetail: string = '0';
    Card: string = '';
    Remarks: string = '';
    YHFarmerID: string = '0';
    Status: boolean = true;
    type: boolean = false;
}