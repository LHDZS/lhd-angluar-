import { CommonModule } from '@angular/common';
import { Component, ContentChildren, NgModule, OnInit, QueryList, Input } from '@angular/core';
import { DxButtonComponent,DxButtonModule } from 'devextreme-angular/ui/button';
import { DxDropDownButtonComponent, DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
// import { EditorPopupModule,EditorPopupComponent } from '../editor-popupa/editor-popup.component'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { pinyin } from 'pinyin-pro';

import {
    DxTabPanelModule,
    DxDataGridModule
  } from 'devextreme-angular';

@Component({
    selector: 'editor-title',
    templateUrl: './editor-title.component.html',
    styleUrls: ['./editor-title.component.scss'],
})
export class EditorTitleComponent implements OnInit { 
    @Input() zqModel:any = {};
    @ContentChildren(DxButtonComponent)
    _buttons: QueryList<DxButtonComponent>;
    @ContentChildren(DxDropDownButtonComponent)
    _dropDownButtons: QueryList<DxDropDownButtonComponent>;
    setDisplay:Boolean = false;
    columnSettingDisabled:Boolean = false;
    conditionItems:any[] = [];
    columnSettingArr:any[] = [];
    columnSettingArr2:any[] = [];
    _id: any = null;
    _id2: any = null;
    saveStatus:Boolean = true;
    constructor(private http?: HttpClient) {
        // this.reviewValidation = this.reviewValidation.bind(this);
        this.onReorder = this.onReorder.bind(this);
        this.onColumnReorder = this.onColumnReorder.bind(this);
        this.onColumnReorder2 = this.onColumnReorder2.bind(this);
        
    }

    ngOnInit() {
        this.getSettings()
        
    }

    getSettings() {
        if (Object.keys(this.zqModel).length !== 0) {
            if (!this.zqModel.title1) {
                return
            }
            this.setDisplay = true;
            this.http
            .get(`${environment.qlwAssem}/settings?page_index=0&page_size=999&key=${pinyin(this.zqModel.title1,{ toneType: 'none' }).split(' ').join('')}`)
            .toPromise()
            .then((res: { data }) => {
                // console.log(res.data.items,'请求数据')
                if (res.data && res.data.items.length !== 0) {
                    this.zqModel.columnSettingArr = JSON.parse(JSON.stringify(res.data.items[0].value));
                    this.columnSettingArr = JSON.parse(JSON.stringify(res.data.items[0].value)).map((item) => {
                        item['showCaption'] = item.caption
                        return item
                    })
                    this._id =  res.data.items[0]._id.$oid
                } else {
                    this.columnSettingArr = JSON.parse(JSON.stringify(this.zqModel.columnSettingArr)).map((item) => {
                        item['showCaption'] = item.caption;
                        item['visible'] = true;
                        return item
                    })
                    this.zqModel.columnSettingArr = JSON.parse(JSON.stringify(this.zqModel.columnSettingArr)).map((item) => {
                        item['visible'] = true;
                        return item
                    })
                }
            })
            .catch((err) => {
                
            });
            if (!this.zqModel.title2) {
                return
            }
            this.http
            .get(`${environment.qlwAssem}/settings?page_index=0&page_size=999&key=${pinyin(this.zqModel.title2,{ toneType: 'none' }).split(' ').join('')}`)
            .toPromise()
            .then((res: { data }) => {
                // console.log(res.data.items,'请求数据2')
                if (res.data && res.data.items.length !== 0) {
                    this.zqModel.columnSettingArr2 = JSON.parse(JSON.stringify(res.data.items[0].value));
                    this.columnSettingArr2 = JSON.parse(JSON.stringify(res.data.items[0].value)).map((item) => {
                        item['showCaption'] = item.caption
                        return item
                    })
                    this._id2 = res.data.items[0]._id.$oid
                } else {
                    this.columnSettingArr2 = JSON.parse(JSON.stringify(this.zqModel.columnSettingArr2)).map((item) => {
                        item['showCaption'] = item.caption
                        item['visible'] = true;
                        return item
                    })
                    this.zqModel.columnSettingArr2 = JSON.parse(JSON.stringify(this.zqModel.columnSettingArr2)).map((item) => {
                        item['visible'] = true;
                        return item
                    })
                }
            })
            .catch((err) => {
                
            });
            
            // this.conditionItems = JSON.parse(JSON.stringify(this.zqModel.conditionItems)).map((item) => {
            //     item['showLabel'] = item.label
            //     return item
            // })
            // console.log(this.columnSettingArr2)
        }
    }

    // 下拉数据控制 
    giveDataSource(item) {
        return this[item.dataSource]
    }

    // calss 类控制
    classType(item) {
        let str = []
        if (item.HeaderRequiredIcon) {
            str.push('required')
        }
        if (item.allowEditing === false) {
            str.push('disabled')
        }
        return str.join(' ')
    }
    

    // 筛选显示隐藏
    conditionItemsYype(value) {
        for (let index = 0; index < this.conditionItems.length; index++) {
            if (this.conditionItems[index].dataField === value && this.conditionItems[index].headVisible) {
                return true
            }            
        }
        return false
    }

    // 结束

    //弹窗方法
    _onOpen () {
        this.columnSettingDisabled = true;
    }
    /**
     * 取消按钮
     */
     _onCancel() {
        this.columnSettingDisabled = false;
    }
    /**
     * 保存按钮
     */
    _onSave() {
        // this._headDataGrid.instance.saveEditData();
        // this._columnDataGrid.instance.saveEditData();
        if (!this.saveStatus) return;
        // let array = this.columnSettingArr;
        // let num = 0;
        // for (let i = 0; i < array.length; i++) {
        //     const element = array[i];
        //     num += Number(element.width);
        // }
        // if (num < document.body.offsetWidth-40) {
        //     this.columnSettingArr.map((item) => {
        //         item.width = undefined;
        //         return item
        //     })
        // }
        var params = {
            key: (pinyin(this.zqModel.title1,{ toneType: 'none' })).split(' ').join(''),
            value: this.columnSettingArr
        }

        if (this._id) {
            params['_id'] = { $oid:  this._id };
        }

        this.http
            .put(`${environment.qlwAssem}/setting`, params)
            .toPromise()
            .then((res: { data }) => {
                // console.log(res,'保存数据')
            });
        
        if (this.zqModel.title2) {
            var params2 = {
                key: (pinyin(this.zqModel.title2,{ toneType: 'none' })).split(' ').join(''),
                value: this.columnSettingArr2
            }
    
            if (this._id2) {
                params2['_id'] = { $oid:  this._id2 };
            }
    
            this.http
                .put(`${environment.qlwAssem}/setting`, params2)
                .toPromise()
                .then((res: { data }) => {
                    // console.log(res,'保存数据')
                });
        }

        
        this.saveStatus = false;
        
        setTimeout(() => {
            // this.zqModel.columnSettingArr = JSON.parse(JSON.stringify(this.columnSettingArr));
            // this.zqModel.columnSettingArr2 = JSON.parse(JSON.stringify(this.columnSettingArr2));
            // this.zqModel.conditionItems = JSON.parse(JSON.stringify(this.conditionItems));
            this.getSettings()
            // console.log(this.zqModel.columnSettingArr2)
            this.columnSettingDisabled = false;
            this.saveStatus = true;
        }, 100);
        
        
        // this.searchPanel._onSave(() => {
        //     this.model.columnSettingDisabled = false;
        // });
        // this.settingColumns(this.columnSettingArr);
        // this.saveColumnsApi(this.columnSettingArr);
    }

    // saveColumnsApi(arr) {
    //     let params = {
    //         key: `${this.model.dataGrid.stateStoring.storageKey}`,
    //         value: arr,
    //     };
    //     if (this.columnOid) {
    //         params['_id'] = { $oid: this.columnOid };
    //     }
    //     this.http
    //         .put(`${environment.qlwAssem}/setting`, params)
    //         .toPromise()
    //         .then((res: { data }) => {
    //             this.columnOid = res.data._id.$oid;
    //             this.model.columnSettingDisabled = false;
    //         });
    // }

    /**
     * 弹窗关闭执行
     */
     _hidden() {
        // this._headDataGrid.instance.saveEditData();
        // this.searchPanel._hidden();
        // this.columnSettingArr = [];
        this.saveStatus = true;
    }
    _showing() {
        this.columnSettingDisabled = true;
        // if (this.model.dataGrid.columns && this.model.dataGrid.columns.length > 0) {
        //     this.columnSettingArr = this.deepTransform(this.model.dataGrid.columns);
        // }
    }
    // 
    onEditorPreparing(e) {
        // console.log(e)
    }
    onColumnEditorPreparing(e) {
        if (!this.columnSettingArr || !this.columnSettingArr.length) return;

        if (e.dataField && e.row.rowType == 'data') {
            //显隐
            if (e.dataField == 'visible') {
                e.editorOptions.disabled = e.row.data.HeaderRequiredIcon || e.row.data.requiredDisable ? true : false;
                if (this.columnSettingArr[e.row.rowIndex].HeaderRequiredIcon) {
                    e.editorOptions.value = true;
                    this.columnSettingArr[e.row.rowIndex].visible = true;
                }
            }
            if (e.dataField == 'HeaderRequiredIcon') {
                e.editorOptions.disabled = e.row.data.requiredDisable ? true : false;
            }
        }
    }
    onColumnEditorPreparing2(e) {
        if (!this.columnSettingArr2 || !this.columnSettingArr2.length) return;

        if (e.dataField && e.row.rowType == 'data') {
            //显隐
            if (e.dataField == 'visible') {
                e.editorOptions.disabled = e.row.data.HeaderRequiredIcon || e.row.data.requiredDisable ? true : false;
                if (this.columnSettingArr2[e.row.rowIndex].HeaderRequiredIcon) {
                    e.editorOptions.value = true;
                    this.columnSettingArr2[e.row.rowIndex].visible = true;
                }
            }
            if (e.dataField == 'HeaderRequiredIcon') {
                e.editorOptions.disabled = e.row.data.requiredDisable ? true : false;
            }
        }
    }
    /**
     * 拖拽方法
     */
     onReorder(e) {
        var visibleRows = e.component.getVisibleRows(),
        toIndex = this.conditionItems.map((item) => item.dataField).indexOf(visibleRows[e.toIndex].data.dataField),
        fromIndex = e.fromIndex;
        this.conditionItems.splice(fromIndex, 1);
        this.conditionItems.splice(toIndex, 0, e.itemData);
    }
    // 拖拽事件
    onColumnReorder(e) {
        var visibleRows = e.component.getVisibleRows(),
            toIndex = this.columnSettingArr
                .map((item) => item.dataField)
                .indexOf(visibleRows[e.toIndex].data.dataField),
            fromIndex = e.fromIndex;
        this.columnSettingArr.splice(fromIndex, 1);
        this.columnSettingArr.splice(toIndex, 0, e.itemData);
        this.saveStatus = true;

    }

    onColumnReorder2(e) {
        var visibleRows = e.component.getVisibleRows(),
            toIndex = this.columnSettingArr2
                .map((item) => item.dataField)
                .indexOf(visibleRows[e.toIndex].data.dataField),
            fromIndex = e.fromIndex;
            // console.log(visibleRows,fromIndex,toIndex)    
        this.columnSettingArr2.splice(fromIndex, 1);
        this.columnSettingArr2.splice(toIndex, 0, e.itemData);
        this.saveStatus = true;

    }

}

@NgModule({
    imports: [CommonModule,DxPopupModule,DxTabPanelModule,DxDataGridModule,DxButtonModule],
    exports: [EditorTitleComponent, DxDropDownButtonModule,DxButtonModule],
    declarations: [EditorTitleComponent],
})
export class EditorTitleModule {}
