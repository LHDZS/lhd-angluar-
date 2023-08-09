import { DateTime } from 'src/app/providers/common/datetime';
import { DataDictionary, DataStatus } from 'src/app/providers/enums';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';

export class YhCycleWeightModel {
  RecycleType: string = '2201131629250004155';
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
  Abstract: string = DataDictionary.SalesTypeA;
  TicketedPointID: string = '0';
  /** 操作标识 */
  YhRecycleWeightBareDetailDto: Array<YhTareWeightDto> = [];
  YhRecycleWeightGrossDetailDto: Array<YhRoughWeightDto> = [];target
}
// 皮重
export class YhTareWeightDto {
    /// <summary>
    /// 皮重
    /// </summary>
    BareWeight: Number;
    /// <summary>
    /// 笼数
    /// </summary>
    CageQuantity: Number;
    /// <summary>
    /// 方式
    /// </summary>
    Mode: Number;
      /// <summary>
    /// 类型
    /// </summary>
    Type: Number;
    NumericalOrder: string = '0';
    NumericalOrderDetail: string = '0';
    Target: number;
}
// 毛重
export class YhRoughWeightDto {
    NumericalOrder: string = '0';
    NumericalOrderDetail: string = '0';
    /// <summary>
    ///  商品
    /// </summary>
    ProductID: string;
      /// <summary>
    ///  毛重
    /// </summary>
    GrossWeight: Number;
    /// <summary>
    ///  笼数
    /// </summary>
    CageQuantity: Number;
    /// <summary>
    ///  只数
    /// </summary>
    Quantity: Number;
    /// <summary>
    /// 车重
    /// </summary>
    VehicleWeight: Number;
    /// <summary>
    /// 方式
    /// </summary>
    Mode: Number;
      /// <summary>
    /// 类型
    /// </summary>
    Type: Number;
    Remarks: string = '';
    Target: number;

}

const gridRefColumns:any = [
  {
    dataField:'StatusName',
    dataType: 'string',
    caption: '状态',
    width: '80',
    alignment: 'center',
    allowEditing: false,
    fixed: true,
    editorOptions: undefined,
    cellTemplate: 'ScommandCell'
  },{
    dataField:'CustomerName',
    dataType: 'string',
    caption: '客户',
    width: '100',
    alignment: 'center',
    allowEditing: false,
    fixed: false,
    editorOptions: undefined
  },{
    dataField:'YHFarmerName',
    dataType: 'string',
    caption: '养户',
    width: '100',
    alignment: 'center',
    allowEditing: false,
    fixed: false,
    editorOptions: undefined
  },{
    dataField:'DataDate',
    dataType: 'date',
    caption: '日期',
    width: '120',
    alignment: 'center',
    allowEditing: false,
    fixed: false,
    editorOptions: undefined
  },{
    dataField:'YHBatchName',
    dataType: 'string',
    caption: '养户批次',
    width: '100',
    alignment: 'center',
    allowEditing: false,
    fixed: false,
    editorOptions: undefined
  },{
    dataField:'BreedingName',
    dataType: 'string',
    caption: '批次品种',
    width: '100',
    alignment: 'center',
    allowEditing: false,
    fixed: false,
    editorOptions: undefined
  },{
    dataField:'ProductName',
    dataType: 'string',
    caption: '批次商品代号',
    width: '100',
    alignment: 'center',
    allowEditing: false,
    fixed: false,
    editorOptions: undefined
  },{
    dataField:'DetailProductName',
    dataType: 'string',
    caption: '毛重商品代号',
    width: '100',
    alignment: 'center',
    allowEditing: false,
    fixed: false,
    editorOptions: undefined
  },{
    dataField:'DetailQuantity',
    dataType: 'number',
    caption: '毛重只数',
    width: '100',
    alignment: 'center',
    allowEditing: false,
    fixed: false,
    editorOptions: undefined
  },{
    dataField:'Number',
    dataType: 'string',
    caption: '单据号',
    width: '120',
    alignment: 'center',
    allowEditing: true,
    fixed: false,
  },{
    dataField:'PersonName',
    dataType: 'string',
    caption: '称重员',
    width: '100',
    alignment: 'center',
    allowEditing: true,
    fixed: false,
  },{
    dataField:'WeightFinishTime',
    dataType: 'date',
    caption: '称重完成时间',
    width: '150',
    alignment: 'center',
    allowEditing: true,
    fixed: false,
    format:"yyyy/MM/dd HH:mm:ss"
  },{
    dataField:'CreatedOwnerName',
    dataType: 'string',
    caption: '创建人',
    width: '100',
    alignment: 'center',
    allowEditing: false,
    fixed: false,
    editorOptions: undefined
  },{
    dataField:'CreatedDate',
    dataType: 'date',
    caption: '创建时间',
    width: '150',
    alignment: 'center',
    allowEditing: true,
    fixed: false,
    format:"yyyy/MM/dd HH:mm:ss"
  },{
    dataField:'OwnerName',
    dataType: 'string',
    caption: '修改人',
    width: '100',
    alignment: 'center',
    allowEditing: false,
    fixed: false,
    editorOptions: undefined
  },{
    dataField:'ModifiedDate',
    dataType: 'date',
    caption: '修改时间',
    width: '150',
    alignment: 'center',
    allowEditing: true,
    fixed: false,
    format:"yyyy/MM/dd HH:mm:ss"
  }
]

export { gridRefColumns }