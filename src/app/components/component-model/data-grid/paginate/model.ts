import { NxTranslateI18N } from 'src/app/nxin/i18n';

export class Paginate {
    pager: Pager = new Pager();
    paging: Paging = new Paging();
}
export class Pager {
    allowedPageSizes: Array<Number> | String = [10, 15, 20, 50, 100];
    infoText: String = NxTranslateI18N.I18N.commandOptions.pager.pageInfo; //'当前为第{0}页 共{1}页 {2}条数据';
    showInfo: Boolean = true;
    showNavigationButtons: Boolean = true;
    showPageSizeSelector: Boolean = true;
    visible: Boolean | String = true;
}
export class Paging {
    enabled: Boolean = true;
    pageIndex: Number = 0;
    pageSize: Number = 20;
}
