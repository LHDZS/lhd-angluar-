import { Component, OnInit } from "@angular/core";
import { TranslateService } from "src/app/providers/i18n-translate";

/**
 * 无效的猪场
 */
 @Component({
    selector: 'app-invalid-systemOption',
    templateUrl: './invalid-systemOption.component.html',
    styleUrls: ['./invalid-systemOption.component.scss']
  })
  export class InvalidSemenComponent implements OnInit{
    i18n: any
    constructor(private translator: TranslateService) { 
      this.i18n = this.translator.I18N.semenBatchSet
    }
  
    ngOnInit() {
    }
  }