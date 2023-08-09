import { PermissionCodes } from 'src/app/providers/permission';

export class NxReview {
    visible: boolean = false;
    numericalOrder: string = '';
    /**
     * 制单人
     */
    ownerName: string = '';
    /** 审核人 */
    reviewName: string = '';
    /**
     * 财务审核人
     */
    financeReviewName: string = '';
    /**
     * 仓库审核人
     */
    warehouseReviewName: string = '';
    /**
     * 是否开启无序审核
     * true: 无序审核
     * false: 有序审核
     */
    disorder: boolean = true;
    /**
     * 功能一: 审核组件中显示的审核项控制
     * 功能二: 有序审核级别,索引对应审核级别;审核级别为倒序 1-2-3-4
     * 审核顺序,有序审核状态下启用
     * 示例
     * &nbsp;&nbsp;&nbsp;&nbsp; 普通审核 - [ 制单|65536 , 审核|16 ] - 默认
     * &nbsp;&nbsp;&nbsp;&nbsp; 四级审核 - [ 制单|65536 , 仓库|4096 , 财务|2048 , 审核|16 ]
     */
    levelOrder: PermissionCodes[] = [PermissionCodes.Making, PermissionCodes.Audit];
    status: ReviewStatus = ReviewStatus.none;
    sync: NxReviewSync = new NxReviewSync();
    onStartReview: Function = null;
    onReviewSuccess: Function = null;
    isMember:boolean = false;
}
export class NxReviewSync {
    enable: boolean = true;
    masterApp: NxReviewApp = NxReviewApp.qlw;
    keyMode:string="none";
    // keyMode: 'minus' | 'none' = 'none'
}
export enum NxReviewApp {
    none = undefined,
    all = 0,
    qlw = 1,
    zlw = 2,
    ylw = 3,
    egg = 5,
}
export enum ReviewStatus {
    /**
     * 没有审核权限
     */
    none = 0,
    /**
     * 已审核
     */
    reviewed = 1,
    /**
     * 待审核
     */
    waitReview = 2,
}
