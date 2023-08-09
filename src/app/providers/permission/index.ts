const status = [
    '$$visible',
    '$$add',
    '$$delete',
    '$$edit',
    '$$audit',
    '$$summary',
    '$$search',
    '$$fixed',
    '$$modify',
    '$$report',
    '$$approval',
    '$$finance',
    '$$track',
    '$$enable',
    '$$review',
    '$$manager',
    '$$making',
];
/**
 * 权限服务
 */
export class PermissionService {
    /**
     * 浏览
     */
    $$visible: boolean = false;
    /**
     * 添加
     */
    $$add: boolean = false;
    /**
     * 删除
     */
    $$delete: boolean = false;
    /**
     * 编辑
     */
    $$edit: boolean = false;
    /**
     * 审核
     */
    $$audit: boolean = false;
    /**
     * 汇总
     */
    $$summary: boolean = false;
    /**
     * 查询
     */
    $$search: boolean = false;
    /**
     * 固顶
     */
    $$fixed: boolean = false;
    /**
     * 修改
     */
    $$modify: boolean = false;
    /**
     * 报表
     */
    $$report: boolean = false;
    /**
     * 审批
     */
    $$approval: boolean = false;
    /**
     * 财务
     */
    $$finance: boolean = false;
    /**
     * 跟踪
     */
    $$track: boolean = false;
    /**
     * 停用
     */
    $$enable: boolean = false;
    /**
     * 复核
     */
    $$review: boolean = false;
    /**
     * 主管
     */
    $$manager: boolean = false;
    /**
     * 制单
     */
    $$making: boolean = false;
    constructor(code?) {
        if (code) {
            this.refresh(code);
        }
    }
    /**
     * 获取权限
     * @param code
     */
    refresh(code) {
        if (code) {
            for (let i = 0; i < status.length; i++) {
                const state = status[i];
                if (state) {
                    this[`${state}`] = (Math.pow(2, i) & code) > 0;
                }
            }
        } else {
            for (let i = 0; i < status.length; i++) {
                this[`${status[i]}`] = false;
            }
        }
    }
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
