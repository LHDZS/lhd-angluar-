import { CommonModule } from '@angular/common';
import { Component, ContentChildren, NgModule, OnInit, QueryList, Input, Inject, ContentChild } from '@angular/core';
import { DxButtonComponent,DxButtonModule } from 'devextreme-angular/ui/button';
import { DxDropDownButtonComponent, DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
// import { EditorPopupModule,EditorPopupComponent } from '../editor-popupa/editor-popup.component'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { pinyin } from 'pinyin-pro';
import { PermissionService } from 'src/app/providers/permission';
import { TokenAuthService } from 'src/app/shared/services';
import { EditorHeaderComponent,EditorHeaderModule } from '../editor-header/editor-header.component';

import {
    DxTabPanelModule,
    DxDataGridModule
  } from 'devextreme-angular';

@Component({
    selector: 'editor-toolbar',
    templateUrl: './editor-toolbar.component.html',
    styleUrls: ['./editor-toolbar.component.scss'],
})
export class EditorToolbarComponent implements OnInit {
    @Input() zqModel:any = {};
    @Input() allowEditing:boolean = true;
    @ContentChildren(DxButtonComponent)
    _buttons: QueryList<DxButtonComponent>;
    @ContentChildren(DxDropDownButtonComponent)
    _dropDownButtons: QueryList<DxDropDownButtonComponent>;
    
    @ContentChildren(EditorHeaderComponent)
    parent: QueryList<EditorHeaderComponent>;
    setDisplay:Boolean = false;
    columnSettingDisabled:Boolean = false;
    conditionItems:any[] = [];
    columnSettingArr:any[] = [];
    columnSettingArr2:any[] = [];
    columnSettingArr3:any[] = [];
    columnSettingArr4:any[] = [];
    _id1: any = null;
    _id2: any = null;
    _id3: any = null;
    _id4: any = null;
    saveStatus:Boolean = true;
    selectedIndex: number = 0;

    makingPermission = new PermissionService();

    isFirstLoading: boolean = true;
    _ids:any = {};
    _names:any = {};
    gridRefColumns: any = [];
    constructor(private tokenService: TokenAuthService, private http?: HttpClient) {
        // this.reviewValidation = this.reviewValidation.bind(this);
        this.onReorder = this.onReorder.bind(this);
        this.onColumnReorder = this.onColumnReorder.bind(this);
        this.onColumnReorder2 = this.onColumnReorder2.bind(this);
        this.onColumnReorder3 = this.onColumnReorder3.bind(this);
        this.onColumnReorder4 = this.onColumnReorder4.bind(this);
    }

    ngOnInit() {
        this.getSettings()
        this.tokenService.requestTokenWithAppId('2110201047420003409').then((res) => {
            this.makingPermission.refresh(res);
            // console.log(this.makingPermission.$$making,'制单权限')
        });
    }

    // 弹出框数据读取 此处不用
    customStateStoringLoad(name,title,bol?) {
        this.setDisplay = true;
        let storageKey = bol ? title : pinyin(title,{ toneType: 'none' }).split(' ').join('');
        this.http
            .get(`${environment.qlwAssem}/settings?page_index=0&page_size=999&key=${storageKey}`)
            .toPromise()
            .then((res: any) => {
                if (res.data && res.data.items.length !== 0) {
                    this.zqModel[name] = JSON.parse(JSON.stringify(res.data.items[0].value));
                    this[name] = JSON.parse(JSON.stringify(res.data.items[0].value)).map((item) => {
                        item['showCaption'] = item.caption
                        return item
                    })
                    this._ids[storageKey] = res.data.items[0]._id.$oid;
                    this._names[storageKey] = name;
                } else {
                    this[name] = JSON.parse(JSON.stringify(this.zqModel.columnSettingArr)).map((item) => {
                        item['showCaption'] = item.caption;
                        item['visible'] = true;
                        return item
                    })
                    this.zqModel[name] = JSON.parse(JSON.stringify(this.zqModel.columnSettingArr)).map((item) => {
                        item['visible'] = true;
                        return item
                    })
                }
            })
            .catch((err) => {
                
            });
    }
    //弹出框数据存储
    customStateStoringSave(state,name,title) {
        let storageKey = pinyin(title,{ toneType: 'none' }).split(' ').join('');
        if (state.columns && state.columns.length > 0) {
            try {
                //存后端
                if (!this.isFirstLoading) {
                    let params = this.getRequestParamsWithCustumComponent(state.columns,name,storageKey);
                    this.http.put(`${environment.qlwAssem}/setting`, params).toPromise().then((res: any) => {
                        if (res && res.data) {
                            this._ids[storageKey] =  res.data._id.$oid
                        }
                    })
                }
                setTimeout(() => {
                    this.isFirstLoading = false;
                }, 500);
            } finally {
                //存前端
                localStorage.setItem(`${storageKey}`, JSON.stringify(state.columns));
            }
        }

    }
    //弹出框数据处理
    getRequestParamsWithCustumComponent(c,name,storageKey) {
        let columns = [];
        this.zqModel[name].map((item, index) => {
            let nativeCol = c.filter((m) => m.dataField == item.dataField);
            columns.push({
                caption: item.caption,
                dataField: nativeCol.length > 0 ? nativeCol[0].dataField : item.dataField,
                dataType: nativeCol.length > 0 ? nativeCol[0].dataType : item.dataType,
                fixed: nativeCol.length > 0 ? nativeCol[0].fixed : item.fixed,
                visible: nativeCol.length > 0 ? nativeCol[0].visible : item.visible,
                width: nativeCol.length > 0 && nativeCol[0].width ? nativeCol[0].width : item.width,
                allowEditing: item.allowEditing,
                calculateDisplayValue: item.calculateDisplayValue,
                lookupData: item.lookupData,
                format: item.format,
                cellTemplate: item.cellTemplate,
                alignment: item.alignment,
                editorOptions: item.editorOptions,
                precision: item.precision,
                showCaption: item.showCaption || '',
                HeaderRequiredIcon: item.HeaderRequiredIcon || '',
                requiredDisable: item.requiredDisable,
                captionDisable: item.captionDisable,
                showIndex: nativeCol.length > 0 ? nativeCol[0].visibleIndex : index,
            });
            item.width = columns[index].width;
        });
        columns.sort((a, b) => {
            return a.showIndex - b.showIndex;
        });
        var data = {
            key: storageKey,
            value: columns,
        };
        if (this._ids[storageKey]) {
            data['_id'] = { $oid: this._ids[storageKey] };
        }
        return data;
    }

    getSettings() {
        if (Object.keys(this.zqModel).length !== 0) {
            if (!this.zqModel.title1 || this.zqModel.neotype) {
                return
            }
            let itemWidthNum = this.zqModel.itemWidthNum;
            this.setDisplay = true;
            this.http
            .get(`${environment.qlwAssem}/settings?page_index=0&page_size=999&key=${pinyin(this.zqModel.title1,{ toneType: 'none' }).split(' ').join('')}`)
            .toPromise()
            .then((res: { data }) => {
                if (res.data && res.data.items.length !== 0) {
                    this.zqModel.columnSettingArr = JSON.parse(JSON.stringify(res.data.items[0].value));
                    this.columnSettingArr = JSON.parse(JSON.stringify(res.data.items[0].value)).map((item) => {
                        item['showCaption'] = item.caption
                        return item
                    })
                    this._id1 =  res.data.items[0]._id.$oid;
                    // let storageKey = pinyin(this.zqModel.title1,{ toneType: 'none' }).split(' ').join('');
                    // this._ids[storageKey] = res.data.items[0]._id.$oid
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
                this.zqModel.labelHeight1 = this.getColumnNumber(this.columnSettingArr,itemWidthNum);
            })
            .catch((err) => {});

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
                this.zqModel.labelHeight2 = this.getColumnNumber(this.columnSettingArr2,itemWidthNum);
            })
            .catch((err) => {});
            
            if (!this.zqModel.title3) {
                return
            }
            this.http
            .get(`${environment.qlwAssem}/settings?page_index=0&page_size=999&key=${pinyin(this.zqModel.title3,{ toneType: 'none' }).split(' ').join('')}`)
            .toPromise()
            .then((res: { data }) => {
                // console.log(res.data.items,'请求数据2')
                if (res.data && res.data.items.length !== 0) {
                    this.zqModel.columnSettingArr3 = JSON.parse(JSON.stringify(res.data.items[0].value));
                    this.columnSettingArr3 = JSON.parse(JSON.stringify(res.data.items[0].value)).map((item) => {
                        item['showCaption'] = item.caption
                        return item
                    })
                    this._id3 = res.data.items[0]._id.$oid
                } else {
                    this.columnSettingArr3= JSON.parse(JSON.stringify(this.zqModel.columnSettingArr3)).map((item) => {
                        item['showCaption'] = item.caption
                        item['visible'] = true;
                        return item
                    })
                    this.zqModel.columnSettingArr3 = JSON.parse(JSON.stringify(this.zqModel.columnSettingArr3)).map((item) => {
                        item['visible'] = true;
                        return item
                    })
                }
                this.zqModel.labelHeight3 = this.getColumnNumber(this.columnSettingArr3,itemWidthNum);
            })
            .catch((err) => {});


            if (!this.zqModel.title4) {
                return
            }
            this.http
            .get(`${environment.qlwAssem}/settings?page_index=0&page_size=999&key=${pinyin(this.zqModel.title4,{ toneType: 'none' }).split(' ').join('')}`)
            .toPromise()
            .then((res: { data }) => {
                // console.log(res.data.items,'请求数据2')
                if (res.data && res.data.items.length !== 0) {
                    this.zqModel.columnSettingArr4 = JSON.parse(JSON.stringify(res.data.items[0].value));
                    this.columnSettingArr4 = JSON.parse(JSON.stringify(res.data.items[0].value)).map((item) => {
                        item['showCaption'] = item.caption
                        return item
                    })
                    this._id4 = res.data.items[0]._id.$oid
                } else {
                    this.columnSettingArr4 = JSON.parse(JSON.stringify(this.zqModel.columnSettingArr4)).map((item) => {
                        item['showCaption'] = item.caption
                        item['visible'] = true;
                        return item
                    })
                    this.zqModel.columnSettingArr4 = JSON.parse(JSON.stringify(this.zqModel.columnSettingArr4)).map((item) => {
                        item['visible'] = true;
                        return item
                    })
                }
                this.zqModel.labelHeight4 = this.getColumnNumber(this.columnSettingArr4,itemWidthNum);
            })
            .catch((err) => {});
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

    TitleClick(e) {
        console.log(e)
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
        if (!this.saveStatus) return;
        
        for (const key in this._ids) {
            if (Object.prototype.hasOwnProperty.call(this._ids, key)) {
                const id = this._ids[key];
                const name = this._names[key];
                var params = {
                    key: key,
                    value: this[name]
                }
        
                if (id) {
                    params['_id'] = { $oid:  id };
                }
        
                this.http
                    .put(`${environment.qlwAssem}/setting`, params)
                    .toPromise()
                    .then((res: { data }) => {
                        // console.log(res,'保存数据')
                        this.customStateStoringLoad(name,key,true)
                    });
            }
        }

        let itemWidthNum = this.zqModel.itemWidthNum;
  
        var params1 = {
            key: (pinyin(this.zqModel.title1,{ toneType: 'none' })).split(' ').join(''),
            value: this.columnSettingArr
        }

        if (this.zqModel.labelHeight1 != undefined) {
            // this.zqModel.expressionType1 = this.getColumnType(this.columnSettingArr,4);
            this.zqModel.labelHeight1 = this.getColumnNumber(this.columnSettingArr,itemWidthNum);
            // this.zqModel.HeaderVisible1 = this.getColumnType(this.columnSettingArr,0);
        }

        if (this._id1) {
            params1['_id'] = { $oid:  this._id1 };
        }

        this.http
            .put(`${environment.qlwAssem}/setting`, params1)
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

        if (this.zqModel.labelHeight2 != undefined) {
            // this.zqModel.expressionType2 = this.getColumnType(this.columnSettingArr2,4);
            this.zqModel.labelHeight2 = this.getColumnNumber(this.columnSettingArr2,itemWidthNum);
            // this.zqModel.HeaderVisible2 = this.getColumnType(this.columnSettingArr2,0);
        }

        if (this.zqModel.title3) {
            var params3 = {
                key: (pinyin(this.zqModel.title3,{ toneType: 'none' })).split(' ').join(''),
                value: this.columnSettingArr3
            }
    
            if (this._id3) {
                params3['_id'] = { $oid:  this._id3 };
            }
    
            this.http
                .put(`${environment.qlwAssem}/setting`, params3)
                .toPromise()
                .then((res: { data }) => {
                    // console.log(res,'保存数据')
                });
        }

        if (this.zqModel.labelHeight3 != undefined) {
            // this.zqModel.expressionType3 = this.getColumnType(this.columnSettingArr3,4);
            this.zqModel.labelHeight3 = this.getColumnNumber(this.columnSettingArr3,itemWidthNum);
            // this.zqModel.HeaderVisible3 = this.getColumnType(this.columnSettingArr3,0);
        }

        if (this.zqModel.title4) {
            var params4 = {
                key: (pinyin(this.zqModel.title4,{ toneType: 'none' })).split(' ').join(''),
                value: this.columnSettingArr4
            }
    
            if (this._id4) {
                params4['_id'] = { $oid:  this._id4 };
            }
    
            this.http
                .put(`${environment.qlwAssem}/setting`, params4)
                .toPromise()
                .then((res: { data }) => {
                    // console.log(res,'保存数据')
                });
        }   

        if (this.zqModel.labelHeight4 != undefined) {
            // this.zqModel.expressionType4 = this.getColumnType(this.columnSettingArr4,4);
            this.zqModel.labelHeight4 = this.getColumnNumber(this.columnSettingArr4,itemWidthNum);
            // this.zqModel.HeaderVisible4 = this.getColumnType(this.columnSettingArr4,0);
        }

        
        this.saveStatus = false;
        
        setTimeout(() => {
            this.getSettings()
            this.columnSettingDisabled = false;
            this.saveStatus = true;
        }, 100);
        
        
        // this.searchPanel._onSave(() => {
        //     this.model.columnSettingDisabled = false;
        // });
        // this.settingColumns(this.columnSettingArr);
        // this.saveColumnsApi(this.columnSettingArr);
    }

    // 保存后判断是否展示 展开/收起 按钮 (按钮提升到头部 不需要了)
    getColumnType (array,maxNum) {
        // let num = 0;
        // for (let i = 0; i < array.length; i++) {
        //     const element = array[i];
        //     if (element.visible) {
        //         num++
        //     }
        // }

        // if (num > maxNum) {
        //     return true
        // }
        // return false
    }
    // 保存后重新计算header高度
    getColumnNumber (array,maxNum) {
        let num = 0;
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (element.visible) {
                num++
            }
        }

        if (num > maxNum) {
            return Math.ceil(num/maxNum)*50 + 'px'
        }

        if (num == 0) {
            return '0px'
        }
        
        return '50px' 
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
    onColumnEditorPreparing(e,columnName) {
        if (!this[columnName] || !this[columnName].length) return;

        if (e.dataField && e.row.rowType == 'data') {
            //显隐
            if (e.dataField == 'visible') {
                e.editorOptions.disabled = e.row.data.HeaderRequiredIcon || e.row.data.requiredDisable ? true : false;
                if (this[columnName][e.row.rowIndex].HeaderRequiredIcon) {
                    e.editorOptions.value = true;
                    this[columnName][e.row.rowIndex].visible = true;
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
        this.columnSettingArr2.splice(fromIndex, 1);
        this.columnSettingArr2.splice(toIndex, 0, e.itemData);
        this.saveStatus = true;
    }

    onColumnReorder3(e) {
        var visibleRows = e.component.getVisibleRows(),
            toIndex = this.columnSettingArr3
                .map((item) => item.dataField)
                .indexOf(visibleRows[e.toIndex].data.dataField),
            fromIndex = e.fromIndex;   
        this.columnSettingArr3.splice(fromIndex, 1);
        this.columnSettingArr3.splice(toIndex, 0, e.itemData);
        this.saveStatus = true;
    }

    onColumnReorder4(e) {
        var visibleRows = e.component.getVisibleRows(),
            toIndex = this.columnSettingArr4
                .map((item) => item.dataField)
                .indexOf(visibleRows[e.toIndex].data.dataField),
            fromIndex = e.fromIndex;   
        this.columnSettingArr4.splice(fromIndex, 1);
        this.columnSettingArr4.splice(toIndex, 0, e.itemData);
        this.saveStatus = true;
    }

}

@NgModule({
    imports: [CommonModule,DxPopupModule,DxTabPanelModule,DxDataGridModule,DxButtonModule],
    exports: [EditorToolbarComponent, DxDropDownButtonModule,DxButtonModule],
    declarations: [EditorToolbarComponent],
})
export class EditorToolbarModule {}
