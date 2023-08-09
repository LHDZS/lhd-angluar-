import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { environment } from 'src/environments/environment';
import { AppIdEnum } from 'src/app/providers/appids';
import { HomeHelper } from 'src/app/providers/homeHelper';
/**
 * 无效的猪场
 */
@Component({
  selector: 'app-invalid-page',
  templateUrl: './invalid-page.component.html',
  styleUrls: ['./invalid-page.component.scss']
})
export class InvalidPageComponent implements OnInit {
  i18n: any
  constructor(
    private translator: TranslateService
  ) {
    this.i18n = this.translator.I18N.invalidPage
  }

  ngOnInit() {
  }
  click(e) {
    let url = `${environment.baseUri}/MenuPermissionConfiguration/role/UnitsUserRoles2?appid=` + AppIdEnum.auth
    let title = this.i18n.authMenu
    this.goTabPage(url, title)
  }
  goTabPage(url, title,) {
    HomeHelper.open({
      id: new Date().getMilliseconds(),
      url: url,
      title: title,
      target: 0,
    });
  }
}
