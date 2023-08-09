export class SubsidyProgrammeModel {
    
    /// <summary>
    /// 品系id
    /// 主键
    /// <!--表示唯一标识实体的一个或多个属性。-->
    /// </summary>
    YHSubsidyID: string;
    /// <summary>
    /// 名称
    /// </summary>
    YHSubsidyName: string;
    /// <summary>
    /// 编码
    /// </summary>
    YhSubsidyCode: number;
    /// <summary>
    /// 补扣类型
    /// </summary>
    YhSubsidyType: string;
    /// <summary>
    /// 集团id
    /// </summary>
    GroupID: string;
    /// <summary>
    /// 单位
    /// </summary>
    EnterpriseID: string;
    /// <summary>
    /// 公式类型
    /// </summary>
    ExpType: number;
    /// <summary>
    /// 计算公式
    /// </summary>
    Expression: string;
    /// <summary>
    /// 是否启用;1-启用；0-停用,
    /// </summary>
    Status: boolean = true;
    /// <summary>
    /// 允许调整
    /// </summary>
    AllowAdjust: boolean = true;
    /// <summary>
    /// 是否计入毛利
    /// </summary>
    GrossProfit: boolean = true;
    /// <summary>
    /// 指标
    /// </summary>
    Indicator: string;
    /// <summary>
    /// 系数
    /// </summary>
    Factor: number;
    /// <summary>
    /// 金额
    /// </summary>
    Amount: number;

    CreatedDate: Date;
    CreatedOwnerId: string;
    ModifiedDate: Date;
    OwnerId: string;
    Remarks: string;
}
