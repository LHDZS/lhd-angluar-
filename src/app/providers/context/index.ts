import { environment } from 'src/environments/environment';
import { environmentType } from 'src/environments/environmentType';
import { HomeHelper } from '../homeHelper';
import { Injectable } from '@angular/core';
import { TranslateI18N } from '../i18n-translate';


/**
 * 当前用户相关数据
 */
export const USER_INFO_CONTEXT = {
    /**
     * 当前用户ID
     */
    userId:
        environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
            ? environment.token.userInfo.userId
            : window['userInfo'].userid,
    /**
     * 当前单位ID
     */
    enterpriseId:
        environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
            ? environment.token.userInfo.enterpriseId
            : window['userInfo'].enterpriseId,
    /**
     * 当前单位ID
     */
    enterpriseName:
        environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
            ? environment.token.userInfo.enterpriseName
            : window['userInfo'].enterpriseName,
    /**
     * 当前菜单ID
     */
    menuId:
        environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
            ? environment.token.userInfo.menuId
            : window['userInfo'].appid,
    /**
     * 当前鸡场ID
     */
    childId:
        environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
            ? environment.token.userInfo.childId
            : window['userInfo'].childEnterpriseId,
    /**
     * 当前场类型
     */
    childFarmType: null,
    /**
     * 当前鸡场名称
     */
    chickenFarmName:
        environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
            ? environment.token.userInfo.chickenFarmName
            : window['userInfo'].childName,
    /**
     * 当前登录人名称
     */
    // realName:
    //     environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
    //         ? environment.token.userInfo.userName
    //         : window.parent['$store']
    //             ? window.parent['$store'].state.app.userInfo.realName
    //             : '',
    realName:
        environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
            ? environment.token.userInfo.userName
            : window['userInfo'].realName,
    
    /** 获取当前账套日期 */
    // enteDate:
    //     environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
    //         ? environment.token.userInfo.enteDate
    //         : window.parent['$store']
    //             ? window.parent['$store'].state.app.enterprise.default.EnterDate
    //             : '',
    enteDate:
        environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
            ? environment.token.userInfo.enteDate
            : window['userInfo'].enteDate,

    /** 当前集团ID */
    // enterGroupId:
    //     environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
    //         ? environment.token.userInfo.enterGroupId
    //         : window.parent['$store']
    //             ? window.parent['$store'].state.app.enterprise.default.EnterpriseGroupID
    //             : '',
    /** 当前集团ID */
    enterGroupId:
        environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
            ? environment.token.userInfo.enterGroupId
            : window['userInfo'].groupIdAll,

    // enterGroupName:
    //     environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
    //         ? environment.token.userInfo.enterGroupName
    //         : window.parent['$store']
    //             ? window.parent['$store'].state.app.enterprise.default.Name
    //             : '',
    /** 当前集团名称 */
    enterGroupName:
        environment.environmentType == environmentType.local || environment.environmentType == environmentType.develop
            ? environment.token.userInfo.enterGroupName
            : window['userInfo'].enterGroupName,

};

/** 用户引导 */
@Injectable()
export class USER_GUIDE_CONTEXT {
    /** 引导设置商品 */
    toSetProduct() {
        HomeHelper.open(
            {
                url: environment.qlwProductSetUrl + `&lang=${TranslateI18N.lang}`,
                title: TranslateI18N.I18N.fatBatchSetting.productName.text,
            },
            () => {
                location.href = environment.qlwProductSetUrl;
            }
        );
    }
    /** 引导设置产品名称 */
    toSetGoodsName() {
        HomeHelper.open(
            {
                url: environment.qlwSimpleProductSetUrl + `&lang=${TranslateI18N.lang}`,
                title: TranslateI18N.I18N.fatBatchSetting.goodsName.text,
            },
            () => {
                location.href = environment.qlwSimpleProductSetUrl;
            }
        );
    }
}
