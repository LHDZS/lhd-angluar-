import { Data } from '@angular/router';
import { PigType } from 'src/app/providers/enums';


export class YhCashDeposit {
    Number:string='';
    NumericalOrder:string='';
    /**单据日期 */
    DataDate:String='';
    /**养户ID */
    YHFarmerID:String='';
    /**收支类型 */
    AccountType:String='';
    /**金额 */
    Amount:Number=0;
    /**关联单据类型 */
    QuoteBillType:String='';
    /**关联单据流水号 流水号不是单据号 */
    QuoteNumericalOrder:String='';
    /**关联单据号 */
    QuoteNumber:String='';
    /**备注 */
    Remarks:String='';
    /**套餐类型 */
    ComboPack:string;
}
