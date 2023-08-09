import { IDevelopment } from './development.d';
import { NxFormListComponent } from 'src/app/nxin/ui/extensions/web/nx-form-list';
import {
    NxRequiredRule,
    NxStringLengthRule,
    TestValidation,
    NxAsyncRule,
} from 'src/app/nxin/ui/extensions/basic/validation/validation_rule';
import { NxButton } from 'src/app/nxin/ui/extensions/basic/button';
import { NxToolbarPanelItem, NxToolbarPanelTips } from 'src/app/nxin/ui/extensions/basic/toolbar_panel';

export interface DevelopmentConfiguration<T> {
    model: T;
}

export class DemoConfiguration implements DevelopmentConfiguration<NxFormListComponent> {
    _component: IDevelopment;
    constructor(private qlwODataContext, _component?) {
        this._component = _component;
    }
    model: NxFormListComponent = {
        toolbarPanel: {
            left: {
                create: <NxToolbarPanelItem>{
                    options: <NxButton>{
                        type: 'default',
                        text: '添加',
                    },
                },
                import: <NxToolbarPanelItem>{
                    options: <NxButton>{
                        type: 'default',
                        text: '导入',
                    },
                },
                delete: <NxToolbarPanelItem>{
                    options: <NxButton>{
                        text: '删除',
                    },
                },
            },
            tips: {
                closeButton: {
                    icon: '',
                    onClick: (e: NxToolbarPanelTips) => {
                        e.visible = false;
                    },
                },
            },
        },
    };
    coding() {}
}
