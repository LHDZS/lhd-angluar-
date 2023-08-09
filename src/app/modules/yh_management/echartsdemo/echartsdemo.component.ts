import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { EchartsDemoService } from './echartsdemo.service';
import { BasicSettingODataContext } from 'src/app/providers/odataContext';
import { TokenAuthService } from 'src/app/shared/services';
import { TranslateService } from 'src/app/providers/i18n-translate';
import * as echarts from 'echarts';
@Component({
    selector: 'app-strain-line',
    templateUrl: './echartsdemo.component.html',
    styleUrls: ['./echartsdemo.component.css'],
    providers: [EchartsDemoService],
})
export class EchartsDemoComponent {
    constructor(
        private service: EchartsDemoService,
        private basicSettingODataContext: BasicSettingODataContext,
        private tokenService: TokenAuthService,
        private translator: TranslateService,
        public changeDetectorRef: ChangeDetectorRef
    ) {

    }

    ngOnInit() {
        const lineChart = echarts.init(document.getElementById('lineChart'));
        var option = {
            title: {
              text: 'Stacked Line'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
            },
            grid: {
              left: '4%',
              right: '4%',
              bottom: '4%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: [
              {
                type: 'value',
                position: 'left',
                offset:0,
                name:'Email',
              }, {
                type: 'value',
                position: 'left',
                offset:50,
                name:'Union',
               
              },  {
                type: 'value',
                position: 'left',
                offset:100 ,
                name:'Video',
              },  {
                type: 'value',
                 position: 'right',
                offset:0,
                name:'Direct',
              },  {
                type: 'value',
                // position: 'right',
                offset:50,
                name:'Search',
              },   
            ],
            series: [
              {
                name: 'Email',
                type: 'line',
                stack: 'Total',
                data: [120, 132, 101, 134, 90, 230, 210],
                yAxisIndex:0
              },
              {
                name: 'Union Ads',
                type: 'line',
                stack: 'Total',
                data: [220, 182, 191, 234, 290, 330, 310],
                yAxisIndex:1
              },
              {
                name: 'Video Ads',
                type: 'line',
                stack: 'Total',
                min: 0,
                max: 5*2,
                data: [150, 232, 201, 154, 190, 330, 410],
                yAxisIndex:2
              },
              {
                name: 'Direct',
                type: 'line',
                stack: 'Total',
                data: [320, 332, 300, 334, 390, 330, 300],
                yAxisIndex:3
              },
              {
                name: 'Search Engine',
                type: 'line',
                stack: 'Total',
                data: [220, 220, 101, 234, 129, 133, 132],
                yAxisIndex:4
              }
            ]
          };
        lineChart.setOption(option);
    }
    
}
