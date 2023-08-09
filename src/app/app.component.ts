import { Component, HostBinding } from '@angular/core';
import { RouterAuthService, ScreenService, AppInfoService } from './shared/services';
import { ResponseSuccess } from './providers/result';
import { PermissionService } from './providers/permission';
import { Router, NavigationStart } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    @HostBinding('class') get getClass() {
        return Object.keys(this.screen.sizes)
            .filter((cl) => this.screen.sizes[cl])
            .join(' ');
    }
    router_loading: boolean;
    constructor(
        private authService: RouterAuthService,
        private screen: ScreenService,
        public appInfo: AppInfoService,
        private router: Router
    ) {
    //    // 测试错误码规则       
    //     const response = ResponseSuccess.handle({
    //         errors: [{
    //             index: 1,
    //             columns: [
    //                 {
    //                     index: 0,
    //                     name: "PigId",
    //                     value: "2103011709100000155",
    //                     format: [
    //                         {
    //                             op_type: "text",
    //                             extra: null,
    //                             key: "$EarNumber",
    //                             value: "zayzgz001"
    //                         },
    //                         {
    //                             op_type: "text",
    //                             extra: null,
    //                             key: "$CurrentOrderDate",
    //                             value: "2021-03-01"
    //                         },
    //                         {
    //                             op_type: "text",
    //                             extra: null,
    //                             key: "$DataDate",
    //                             value: "2021-05-22"
    //                         },
    //                         {
    //                             op_type: "text",
    //                             extra: null,
    //                             key: "$ENUM.AbstractType",
    //                             value: "AdjustOut"
    //                         },
    //                         {
    //                             op_type: "text",
    //                             extra: null,
    //                             key: "$Number",
    //                             value: "202105220001"
    //                         }
    //                     ],
    //                     code: 222019
    //                 },
    //                 {
    //                     index: 0,
    //                     name: "PigId",
    //                     value: "2103011709100000155",
    //                     format: [
    //                         {
    //                             op_type: "text",
    //                             extra: null,
    //                             key: "$EarNumber",
    //                             value: "zayzgz001"
    //                         },
    //                         {
    //                             op_type: "text",
    //                             extra: null,
    //                             key: "$CurrentOrderDate",
    //                             value: "2021-03-01"
    //                         },
    //                         {
    //                             op_type: "text",
    //                             extra: null,
    //                             key: "$DataDate",
    //                             value: "2021-04-29"
    //                         },
    //                         {
    //                             op_type: "text",
    //                             extra: null,
    //                             key: "$ENUM.AbstractType",
    //                             value: "BoarFeeding"
    //                         },
    //                         {
    //                             op_type: "text",
    //                             extra: null,
    //                             key: "$Number",
    //                             value: "202104290001"
    //                         }
    //                     ],
    //                     code: 222019
    //                 }
    //             ]
    //         }],
    //         msg: null,
    //         data: null,
    //         code: 222007,
    //     });
    //     console.log(response.message);

        // const permission = new PermissionService();
        // permission.refresh(0);
        this.router.events.subscribe((event) => {
            // 加载埋点js
            if (event instanceof NavigationStart) {
                this.loadScript(`https://collection.nxin.com/hm.js?${environment.appCode}`)
            }
        });
    }
    async loadScript(url) {
        return new Promise((resolve, reject) => {
            const ELEMENT_SCRIPT = document.createElement('script');
            ELEMENT_SCRIPT.src = url;
            ELEMENT_SCRIPT.setAttribute('name', 'collection-nxin');
            ELEMENT_SCRIPT.onload = resolve;
            document.body.appendChild(ELEMENT_SCRIPT);
            document.body.removeChild(ELEMENT_SCRIPT);
        });
    }
    isAutorized() {
        return this.authService.isLoggedIn;
    }
}
