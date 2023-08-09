/**
 * 多语言本地化配置
 */
export const i18n = {
    language: 'zh',
};
/**
 * 公共的组件语言
 */
//#region 公共组件内部定义的文本内容
export const i18n_nxFormListHeaderPanel = {
    fullTextSearchPlaceholder: '搜索',
};
//#endregion

//#region Providers中定义的文本内容
/**
 * 接口请求错误的异常处理文本内容
 */
export const i18n_response_error_handler = {
    /**
     * 未知的异常，请求接口发生网络错误
     */
    unknow: '发生了未知的异常',
};
//#endregion

//#region 基础设置
/**
 * 猪场设置
 */
export const i18n_pigFarmSetting = {
    PigFarmId: '猪场编码',
    PigFarmFullName: '猪场全称',
    PigFarmName: '猪场简称',
    PigFarmCode: '猪场代码',
    Begindate: '建账日期',
    PersonId: '负责人',
    Address: '详细地址',
    IsUse: '状态',
    CreatedOwnerId: '创建人',
    CreatedDate: '创建时间',
    OwnerId: '修改人',
    ModifiedDate: '修改时间',
    isUseTrueText: '启用',
    isUseFalseText: '禁用',
};
//#endregion

export const i18n_common = {
    nodata: '没有数据',
    delete_success: '删除成功',
    save: '保存',
};
/**
 * 多语言业务功能配置
 */
export const i18n_sow_manage = {};

export const i18n_sow_breeding = {
    breeding_date: '配种日期',
    hb_info: '后备母猪配种详情页',
    info: '母猪配种详情页',
    number: '单据号',
    fat_batch: '肥猪批次',
    fat_house: '肥猪批次当前栋舍',
    sow_batch: '母猪批次',
    sow_ear: '母猪耳号',
    last_event: '上次事件',
    date_event: '日期事件',
    into_house: '转入栋舍',
    into_column: '转入栏位',
    breeding_type: '配种方式',
    first_pig: '首配公猪',
    first_score: '首配公猪',
    creator: '创建人',
    create_date: '创建时间',
    modified: '修改人',
    modified_date: '修改时间',
    checker: '审核人',
    import_plan: '引入配种计划',
    select_ear: '选择耳号',
    responsor: '负责人',
    numericalOrder: '流水号',
    current_house: '当前栋舍',
    weight: '重量(公斤)',
    second_pig: '二配公猪',
    second_score: '二配评分',
    third_pig: '三配公猪',
    third_score: '三配评分',
    ear: '耳号',
    current_column: '当前栏位',
};

export const i18n_mate_check = {
    number: '单据号',
    mate_check_date: '妊检日期',
    sow_batch: '母猪批次',
    ear: '耳号',
    current_house: '当前栋舍',
    current_column: '当前栏位',
    mate_date: '妊娠天数',
    mate_type: '妊检方式',
    mate_result: '妊检结果',
    creator: '创建人',
    create_date: '创建时间',
    modified: '修改人',
    modified_date: '修改时间',
    checker: '审核人',
    mate_info: '妊检记录详情页',
    import_plan: '引入配种计划',
    select_ear: '选择耳号',
    responsor: '负责人',
    numericalOrder: '流水号',
};

export const i18n_sow_birth = {
    number: '单据号',
    birth_date: '分娩日期',
    sow_batch: '母猪批次',
    ear: '耳号',
    current_house: '当前栋舍',
    current_column: '当前栏位',
    mate_date: '妊娠天数',
    into_house: '转入栋舍',
    into_column: '转入栏位',
    health: '健仔数',
    weak: '弱仔数',
    disabled: '畸形数',
    dead: '死胎数',
    mummy: '木乃伊数',
    available: '有效产仔数',
    house_weight: '窝总重(公斤)',
    house: '窝号',
    birth_difficult: '产仔难易',
    fat_batch: '肥猪批次',
    creator: '创建人',
    create_date: '创建时间',
    modified: '修改人',
    modified_date: '修改时间',
    checker: '审核人',
    birth_info: '分娩记录详情页',
    import_plan: '引入配种计划',
    select_ear: '选择耳号',
    responsor: '负责人',
    numericalOrder: '流水号',
    sow_weight: '母猪重量(公斤)',
};

export const i18n_sow_death = {
    number: '单据号',
    death_date: '死亡日期',
    sow_batch: '母猪批次',
    ear: '耳号',
    current_house: '当前栋舍',
    current_column: '当前栏位',
    last_event: '上次事件',
    date_event: '日期事件',
    death_type: '死亡类型',
    death_cause: '死亡原因',
    creator: '创建人',
    create_date: '创建时间',
    modified: '修改人',
    modified_date: '修改时间',
    checker: '审核人',
    info: '死亡记录详情页',
};
