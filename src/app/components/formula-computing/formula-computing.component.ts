import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DxTreeListComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-formula-computing',
    templateUrl: './formula-computing.component.html',
    styleUrls: ['./formula-computing.component.scss'],
})
export class FormulaComputingComponent implements OnInit,OnChanges {
    ngOnChanges(changes: SimpleChanges): void {
        
    }
    /**弹出的相对模板变量 */
    @Input()
    target: string = 'window'
    /**  控制是否弹出 */
    @Input()
    visible: boolean = false
    @Input()
    title: string = '公式计算'
    /** 显示/隐藏事件*/
    @Output()
    visibleChange: EventEmitter<Boolean> = new EventEmitter(true);
    /** 设置宽度 */
    @Input()
    width: string | number | (() => number | string) = '900';
    /** 设置最小宽度 */
    @Input()
    minWidth: string | number | (() => number | string) = '800';
    /** 设置高度 */
    @Input()
    height: string | number | (() => number | string) = '900';
    /** 设置最小高度 */
    @Input()
    minHeight: string | number | (() => number | string) = '800';
    pathUrl: SafeResourceUrl;
    iframeDom: any;
    isGroup: boolean = false;
    script: string
    fields:any = [];
    constructor(
        private sanitizer:DomSanitizer
    ) {
    }
    ngOnInit() {
        // this.iframeDom = document.getElementById('approvaliframe');
        // this.sureFormula();
    }
    onHiding(event){
        this.visibleChange.emit(false)
    }
    sureFormula(){
        let iframeDom:any = document.getElementById('approvaliframe');
        //传入参数
        let obj = {
            script: this.script,
            fields: this.fields,
            isGroup: this.isGroup
        };
        //序列化传入对象
        let data = JSON.stringify(obj);
        let childDomain = `${environment.gatway.formula}`;
        document.getElementById('approvaliframe').onload = () => {
            //PostMessage发送数据
            iframeDom.contentWindow.postMessage(data, childDomain);
        };
        this.pathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(childDomain+"calcField");
    }
}

