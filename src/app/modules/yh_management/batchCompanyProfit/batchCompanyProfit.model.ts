import { DateTime } from 'src/app/providers/common/datetime';
import { DataDictionary } from 'src/app/providers/enums';

export class batchCompanyProfitModel {
    RecycleType: string = 'number;number;011316number;9number;50004155';
    // DataDate: any = new Date();
    DataDate: string = '';
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

const detailSourceArr: any = [
    {
        dataField: 'id_record',
        HeaderRequiredIcon: true,
        caption: '序号',
        fixed: true,
        alignment: 'center',
        allowEditing: false,
        width: 40,
        XIndex: [0],
        YIndex: [0, 1],
    },
    {
        dataField: 'iSortPlusName',
        HeaderRequiredIcon: true,
        caption: '内置属性',
        fixed: true,
        alignment: 'center',
        allowEditing: false,
        width: 120,
        XIndex: [0],
        YIndex: [0, 1],
    },
    {
        dataField: 'ProductName',
        HeaderRequiredIcon: true,
        caption: '商品代号',
        fixed: false,
        alignment: 'center',
        allowEditing: false,
        width: 160,
        XIndex: [0],
        YIndex: [0, 1],
    },
    {
        dataField: 'Specification',
        HeaderRequiredIcon: true,
        caption: '规格',
        fixed: false,
        alignment: 'center',
        allowEditing: false,
        width: 120,
        XIndex: [0],
        YIndex: [0, 1],
    },
    {
        dataField: 'MeasureUnitName',
        HeaderRequiredIcon: true,
        caption: '计量单位',
        fixed: false,
        alignment: 'center',
        allowEditing: false,
        width: 120,
        XIndex: [0],
        YIndex: [0, 1],
    },
    {
        dataField: 'Quantity',
        HeaderRequiredIcon: true,
        caption: '数量',
        fixed: false,
        alignment: 'center',
        allowEditing: false,
        width: 120,
        XIndex: [0],
        YIndex: [0, 2],
    },
    {
        dataField: 'Amount',
        HeaderRequiredIcon: true,
        caption: '成本金额',
        fixed: false,
        alignment: 'center',
        allowEditing: false,
        width: 120,
        XIndex: [0],
        YIndex: [0, 2],
    },
    {
        dataField: 'ChickSourceType',
        HeaderRequiredIcon: true,
        caption: '苗源类型',
        fixed: false,
        alignment: 'center',
        allowEditing: false,
        width: 120,
        XIndex: [0],
        YIndex: [0, 2],
    },
    {
        dataField: 'ProductBatchID',
        caption: '批号',
        HeaderRequiredIcon: true,
        fixed: false,
        alignment: 'center',
        width: 80,
        XIndex: [0],
        YIndex: [0, 2],
    },
    {
        dataField: 'ChickSource',
        caption: '苗源',
        HeaderRequiredIcon: true,
        fixed: false,
        alignment: 'center',
        width: 80,
        XIndex: [0],
        YIndex: [0, 2],
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


export { detailSourceArr, companiesData }

// 数据
export class batchCompanyProfitDataModel {
    DataDate: any = new Date();
    YHFarmerName: string = '';
    YHBatchName: string = '';
    PersonName: string = '';
    ReceiveDate: string = '';
    ReceiveQuantity: string = '';
    PoultryCost: string = '';
    FeedCost: string = '';
    VaccineCost: string = '';
    DrugCost: string = '';
    SundriesCost: string = '';
    CostSubtotal: string = '';
    FarmerFee: string = '';
    OtherFee: string = '';
    CostTotal: string = '';
    FeedingDays: string = '';
    OutRecycleQuantity: string = '';
    SaleWeight: string = '';
    SaleAmount: string = '';
    KiloAvePrice: string = '';
    EnterProfit: string = '';
    WeightProfit: string = '';
    ProfitOnly: string = '';
    WeightCost: string = '';
    CostOnly: string = '';
    SettleNumericalOrder: string = '';
    Number: string = '';
    Remarks: string = '';
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