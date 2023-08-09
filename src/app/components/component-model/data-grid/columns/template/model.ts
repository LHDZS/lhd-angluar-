import { NxTagBox } from '../../../tagbox/model';
import { NxSelectBox } from '../../../select-box/model';

export class NxDataGridColumnCellTemplate {
    enabled: Boolean = false;
    type: 'TagBox' | 'SelectBox' | 'Link';
    widget: NxTagBox | NxSelectBox | any;
    templateName: string = 'template';
}
export class NxDataGridColumnCellLinkTemplate {
    enabled: Boolean = false;
    type: 'Link' = "Link";
    templateName: string = 'template';
    to: Function = null;
    /**
     * 展示条件
     * @returns boolean
     */
    linkCondition: (cell) => boolean = () => true;
}
