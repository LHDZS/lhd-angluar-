import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from 'src/app/providers/i18n-translate';

/**
 * 无效的猪场
 */
@Component({
  selector: 'app-invalid-pigfarm',
  templateUrl: './invalid-pigfarm.component.html',
  styleUrls: ['./invalid-pigfarm.component.scss']
})
export class InvalidPigfarmComponent implements OnInit {
  i18n: any;
  type:string = ''
  constructor(
    private translator: TranslateService,
    private route: ActivatedRoute,
    ) { 
    this.i18n = this.translator.I18N.pigFarmSetting
    if(this.route.queryParams['value']['type']){
      this.type = this.route.queryParams['value']['type']
    }
    
  }

  ngOnInit() {
  }

}
