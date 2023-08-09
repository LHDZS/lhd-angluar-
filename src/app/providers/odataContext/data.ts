import { environment } from 'src/environments/environment';

/**
 * ODATA URL 相关数据
 */
export const ODATA_URL_INFO = {
    /**
     *  禽联网基础设置 ODATA URL
     */
    poultryBasicSettingOdataUrl: environment.poultryBasicSettingReadServer + '/oq',

    /**
     *  禽联网生产设置 ODATA URL
     */
    poultryProductOdataUrl: environment.poultryProductionServer + '/oq',

    /**
     *  禽联网成本设置 ODATA URL
     */
     poultryCostOdataUrl: environment.poultryProductionCostServer + '/oq',

     /**
      * 养户生产设置 ODATA URL
      */
     yhProductionOdataUrl: environment.yhProductionReadServer + '/oq',

     /**
      * 养户基础设置 ODATA URL
      */
     yhBasicSettingOdataUrl: environment.yhBasicSettingReadServer + '/oq',

};


