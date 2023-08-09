import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Notify } from 'src/app/providers/notify';

@Component({
    selector: 'editor-approval',
    templateUrl: './editor-approval.component.html',
    styleUrls: ['./editor-approval.component.scss'],
})
export class EditorApprovalComponent implements OnInit {
    environmentStatus = {
        DEV: 'https://hrqlw.t.nxin.com',
        PROD: 'https://hrqlw.nxin.com',
        PAT: 'https://hrqlw.p.nxin.com',
        UAT: 'https://hrqlw.t.nxin.com',
    };

    pathUrl: SafeResourceUrl;

    @Input()
    ApprovalTypeId: string;
    @Input()
    EnterpriseId: string;
    @Input()
    Status: string;
    @Input()
    NumericalOrder: string;
    @Input()
    ENV: 'DEV' | 'PROD' | 'PAT' | 'UAT';
    iframeDom: any;
    iframeDomList: any;

    constructor(private sanitizer: DomSanitizer) {}
    ngOnInit() {
        let locationHref = window.location.href;
        let wwg = '';
        if (locationHref.indexOf('&wwg=') > -1 || locationHref.indexOf('?wwg=') > -1) {
            wwg = '&wwg=1';
        }
        this.pathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `${this.environmentStatus[this.ENV]}/fatest/index?ApprovalTypeId=${this.ApprovalTypeId}&EnterpriseId=${
                this.EnterpriseId
            }&Status=${this.Status}&NumericalOrder=${this.NumericalOrder}${wwg}`
        );

        this.iframeDom = document.getElementById('approvaliframe');
        this.iframeDom.onload = function() {
            this.iframeDom = document.getElementById('approvaliframe');
            this.iframeDomList = this.iframeDom.contentDocument.getElementById('myreview');
        };
    }
    //刷新iframe
    reload() {
        setTimeout(() => {
            let locationHref = window.location.href;
            let wwg = '';
            if (locationHref.indexOf('&wwg=') > -1 || locationHref.indexOf('?wwg=') > -1) {
                wwg = '&wwg=1';
            }
            this.pathUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                `${this.environmentStatus[this.ENV]}/fatest/index?ApprovalTypeId=${this.ApprovalTypeId}&EnterpriseId=${
                    this.EnterpriseId
                }&Status=${this.Status}&NumericalOrder=${this.NumericalOrder}${wwg}`
            );
           
            this.iframeDom = document.getElementById('approvaliframe');
            this.iframeDom.contentWindow.location.reload(true);
        }, 0);
    }
    //创建
    create(id: string) {
        window['rev'].create(id);
    }
    validation() {
        try {
            let testiframe = this.iframeDom.contentDocument;
            if (testiframe) {
                let selectList = testiframe.getElementById('myreview').getElementsByTagName('select');
                let flagselect = false;
                if (selectList.length > 0) {
                    for (let d in selectList) {
                        if (selectList[d].value != -1 && selectList[d].value != undefined) {
                            flagselect = true;
                        }
                    }
                } else {
                    let tbodyList = testiframe.getElementById('myreview').getElementsByTagName('tbody');
                    if (tbodyList) {
                        let trtdNameList = tbodyList[0].getElementsByTagName('tr');
                        if (trtdNameList && trtdNameList.length > 0) {
                            let NameDomList = trtdNameList[0].getElementsByTagName('td');
                            if (NameDomList && NameDomList.length > 0) {
                                if (NameDomList[1].innerText) {
                                    flagselect = true;
                                }
                            }
                        }
                    }
                }

                if (!flagselect) {
                    Notify.error('请填写审批人');
                    return false;
                }
            } else {
                Notify.error('请填写审批人');
                return false;
            }
            return true;
        } catch (error) {}
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [EditorApprovalComponent],
    exports: [EditorApprovalComponent],
})
export class EditorApprovalModule {}
