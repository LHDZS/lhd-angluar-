import { Component } from '@angular/core';

@Component({
    templateUrl: 'report.component.html',
    styleUrls: ['./report.component.scss']
})

export class Report{
    dataSource:any;
    
    constructor(){
        this.dataSource = [
            {
                complaint:'2018-09',
                start:'2018-09-01',
                end:'2018-09-30',
                count: 1,
                cumulativePercent: 3.57
            },
            {
                complaint:'2018-11',
                start:'2018-11-01',
                end:'2018-11-30',
                count: 2,
                cumulativePercent: 7.14
            },
            {
                complaint:'2018-12',
                start:'2018-12-01',
                end:'2018-12-31',
                count: 1,
                cumulativePercent: 3.57
            },
            {
                complaint:'2019-06',
                start:'2019-06-01',
                end:'2019-06-30',
                count: 1,
                cumulativePercent: 3.57
            },
            {
                complaint:'2020-01',
                start:'2020-01-01',
                end:'2020-01-31',
                count: 4,
                cumulativePercent: 14.29
            },
            {
                complaint:'2020-02',
                start:'2020-02-01',
                end:'2020-02-30',
                count: 8,
                cumulativePercent: 28.57
            },
            {
                complaint:'2020-03',
                start:'2020-03-01',
                end:'2020-03-31',
                count: 7,
                cumulativePercent: 25
            },
            {
                complaint:'2020-04',
                count: 3,
                start:'2020-04-01',
                end:'2020-04-30',
                cumulativePercent: 10.71
            },
            {
                complaint:'2020-05',
                start:'2020-05-01',
                end:'2020-05-31',
                count: 1,
                cumulativePercent: 3.57
            },
        ]
        
    }
    customizeTooltip = (info: any) => {
        return {
            html: "<div><div class='tooltip-header'>" +
                info.argumentText + "</div>" +
                "<div class='tooltip-body'><div class='series-name'>" +
                '预计分娩窝数' +
                ": </div><div class='value-text'>" +
                info.points[0].valueText +
                "</div><div class='series-name'>" +
                '预计分娩窝数占有率' +
                ": </div><div class='value-text'>" +
                info.points[1].valueText +
                "% </div></div></div>"
        };
    }

    customizeLabelText = (info: any) => {
        return info.valueText + "%";
    }
}