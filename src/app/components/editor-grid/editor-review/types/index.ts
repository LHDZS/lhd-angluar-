export enum ReviewTypes {
    /** 制单 */
    making = 'making',
    /** 审核 */
    review = 'review',
    /** 仓库 */
    warehouse = 'warehouse',
    /** 财务 */
    finance = 'finance',
}

export type ReviewOptionType = {
    [key: string]: { code: number; name: string };
};

export enum ReviewSource {
    /** 企联网 */
    qlw = 1,
    /** 猪联网 */
    zlw = 2,
    /** 羊联网 */
    ylw = 3,
}
export class ReviewEntity {
    /** 主键 */
    RecordID: string;
    /** 权限码 */
    CheckMark: number;
    /** 审核人ID */
    CheckedByID: string;
    /** 流水号 */
    NumericalOrder: string;
    /** 审核顺序 */
    Level: number;
    /** 菜单ID */
    ReviweType: string;
}
export enum ReviewSyncApp {
    none = undefined,
    all = 0,
    qlw = 1,
    zlw = 2,
    ylw = 3,
}
export class ReviewOptions {
    /** 菜单ID */
    appid: string;
    /** 系统 */
    source: ReviewSource;
    /** 当前登录人ID */
    userId: string;
    /** 排除的工具条控制 */
    skipToolbar?: string[] = [];
    /** 初始化审核信息 */
    init: (options) => Promise<ReviewEntity[]>;
    /** 审核/取消审核 */
    review: (options) => Promise<boolean>;
    /** 人员信息 */
    by: (id) => Promise<{ id: any; name: string }>;
}
/**
 * 权限码
 */
export enum PermissionCodes {
    /**
     * 浏览
     */
    Retrieve = 1,
    /**
     * 新增
     */
    Create = 2,
    /**
     * 编辑
     */
    Update = 2 << 1,
    /**
     * 删除
     */
    Delete = 2 << 2,
    /**
     * 审核
     */
    Audit = 2 << 3,
    /**
     * 汇总
     */
    Summary = 2 << 4,
    /**
     * 查询
     */
    Search = 2 << 5,
    /**
     * 固顶
     */
    Fixed = 2 << 6,
    /**
     * 修改
     */
    Modify = 2 << 7,
    /**
     * 报表
     */
    Report = 2 << 8,
    /**
     * 审批
     */
    Approval = 2 << 9,
    /**
     * 财务
     */
    Finance = 2 << 10,
    /**
     * 跟踪
     */
    Track = 2 << 11,
    /**
     * 停用
     */
    Enable = 2 << 12,
    /**
     * 复核
     */
    Review = 2 << 13,
    /**
     * 主管
     */
    Manager = 2 << 14,
    /**
     * 制单
     */
    Making = 2 << 15,
}
