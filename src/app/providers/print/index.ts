export class PrintInput {
    tableData: Array<Array<any>>;
    attachInfo: AttachInfo = new AttachInfo();
    summaryRows: Array<SummaryRows> = new Array<SummaryRows>();
    /** 行DOM集合 */
    rowElementCollection: (Element[] & JQuery)[] = [];
    /** 行集合 */
    rows: any[] = [];
    /** 列 */
    columns: string[] = [];
    appType:number //猪联网
    headers:Array<any> = [];
    footers:Array<any> = [];
    isSale:boolean=false;
    InvoiceType:number;
    SaleSummaryRows: Array<any> = [];
    /**
     * 设置参数
     */
    setOptions(options: AttachInfo): void {
        this.rowElementCollection.map((ele, rowIndex) => {
            this.rows.push({});
            for (let index = 0; index < (<HTMLCollection>ele[0]['cells']).length; index++) {
                if (index != 0) {
                    const cellText = (<HTMLCollection>ele[0]['cells']).item(index)['innerText'];
                    this.rows[rowIndex][`c${index}`] = cellText;
                }
            }
        });
        this.tableData = [this.columns, this.rows];
        this.attachInfo = options;
    }
}

export class SummaryRows {
    index: number;
    value: number;
}

export class AttachInfo {
    /**
     * 标题
     */
    title: string;
    /**
     * 单位id
     */
    enterpriseId: string;
    /**
     * 猪场名称
     */
    pigFarmName: string;
    /**
     * 配种员
     */
    breeder: string;
    /**
     * 单据日期
     */
    dateTime: string;
    /**
     * 单据号
     */
    billNumber: string;
    /**
     * 备注
     */
    mark: string;
    /**
     * 审核人
     */
    auditerName: string;
    /**
     * 制单人
     */
    creatorName: string;
    

}
