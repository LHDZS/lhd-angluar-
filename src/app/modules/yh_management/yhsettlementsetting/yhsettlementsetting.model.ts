import { DateTime } from 'src/app/providers/common/datetime';
import { DataDictionary } from 'src/app/providers/enums';

export class yhsettlementsettingModel {
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
}

const columnSettingArr1: any = [
    {
        'dataField': 'FeedingDays',
        'caption': '养殖天数',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'AverageOutHouseAges',
        'caption': '平均出栏日龄',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'SettlementWeight',
        'caption': '结算重量(公斤)',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'FeedIntake',
        'caption': '耗料量(公斤)',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }
];

const columnSettingArr2: any = [
    {
        'dataField': 'SurvivalRate',
        'caption': '成活率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'MeatFeedRatio',
        'caption': '料肉比',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'OneMedicineFee',
        'caption': '只药费',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'AverageWeight',
        'caption': '只均重（斤/只）',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'OneLevel',
        'caption': '一级率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'TwoLevel',
        'caption': '二级率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'ThreeLevel',
        'caption': '三级率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'FaultyLevel',
        'caption': '次品率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'PerFeedIntake',
        'caption': '只耗料（斤/只）',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'ReceivePerGrossProfit',
        'caption': '进苗只毛利',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'OutPerGrossProfit',
        'caption': '出栏只毛利',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'EuropeanIndex',
        'caption': '欧指',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'CullRate',
        'caption': '淘汰率%',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }
];

const columnSettingArr3: any = [
    {
        'dataField': 'OutRecycleAmount',
        'caption': '出栏回收金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'ChickenReceiveAmount',
        'caption': '领苗金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'MaterialReceiveAmount',
        'caption': '领料金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'DrugReceiveAmount',
        'caption': '领药金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'ImmuneReceiveAmount',
        'caption': '领疫苗金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'OtherReceiveAmount',
        'caption': '领其他金额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }, {
        'dataField': 'GrossProfit',
        'caption': '毛利总额',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }
];

const columnSettingArr4: any = [
    {
        'dataField': 'FarmingPriceID',
        'caption': '养殖价格方案',
        'width': 80,
        'HeaderRequiredIcon': false,
        "fixed": false,
        'visible': true
    }
]


export { columnSettingArr1, columnSettingArr2, columnSettingArr3, columnSettingArr4}

// 数据
export class yhsettlementsettingDataModel {
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