import { Component } from "@angular/core";

@Component({
    templateUrl: 'production-quota.component.html',
    styleUrls: ['./production-quota.component.scss']
})

export class ProductionQuota {
    title: String;
    dataSource: any;
    constructor() {
        this.title = '生产指标'
        // this.dataSource = [
        //     {
        //         label: '存栏',
        //         group: [
        //             {
        //                 label: '基础母猪平均存栏头数',
        //                 one: '166',
        //                 two: '166',
        //                 three: '100'
        //             },
        //             {
        //                 label: '基础母猪死淘率(%)',
        //                 one: '2.64',
        //                 two: '0',
        //                 three: '0'
        //             }
        //         ]
        //     }
        // ];
        this.dataSource = {
            fields: [{
                caption: 'Region',
                width: 120,
                dataField: 'region',
                area: 'row',
                alignment:'right'
            }, {
                caption: 'City',
                dataField: 'city',
                width: 150,
                area: 'row',
                alignment:'right'

            }, {
                dataField: 'date',
                dataType: 'date',
                area: 'column'
            }, {
                caption: 'Sales',
                dataField: 'amount',
                dataType: 'number',
                summaryType: 'sum',
               
                alignment:'right',
                area: 'data'
            }],
            store: [ {
                "id": 1,
                "region": "存栏",
                
                "city": "基础母猪平均存栏数(头)",
                "amount": 940,
                "date": "2019/01/01"
            }, {
                "id": 2,
                "region": "存栏",
                
                "city": "基础母猪平均存栏数(头)",
                "amount": 1630,
                "date": "2019/05/10"
            }, {
                "id": 3,
                "region": "存栏",
                

                "city": "基础母猪死淘率(%)",
                "amount": 700,
                "date": "2019/02/11"
            }, {
                "id": 4,
                "region": "存栏",
               
                "city": "基础母猪死淘率(%)",
                "amount": 1110,
                "date": "2019/09/08"
            },
            {
                "id": 5,
                "region": "配种",
               
                "city": "配种头数(头)",
                "amount": 1110,
                "date": "2019/03/08"
            },
            {
                "id": 6,
                "region": "配种",
               
                "city": "断奶发情配种间隔天数(天)",
                "amount": 1110,
                "date": "2019/05/08"
            },
            {
                "id": 7,
                "region": "配种",
               
                "city": "断奶7天内发情配种率(%)",
                "amount": 1110,
                "date": "2019/11/08"
            },
            {
                "id": 8,
                "region": "分娩",
               
                "city": "分娩率(%)",
                "amount": 23.26,
                "date": "2019/01/08"
            },
            {
                "id": 9,
                "region": "分娩",
               
                "city": "分娩窝数(窝)",
                "amount": 23,
                "date": "2019/03/08"
            },
            {
                "id": 10,
                "region": "分娩",
               
                "city": "窝均健仔数(头)",
                "amount": 23,
                "date": "2019/06/08"
            },
            {
                "id": 11,
                "region": "分娩",
               
                "city": "窝均活仔数(头)",
                "amount": 23,
                "date": "2019/09/08"
            },
            {
                "id": 12,
                "region": "分娩",
               
                "city": "窝均总产仔(头)",
                "amount": 23,
                "date": "2019/11/08"
            },
            {
                "id": 13,
                "region": "分娩",
               
                "city": "窝均断奶数(头)",
                "amount": 23,
                "date": "2019/12/08"
            },
            {
                "id": 14,
                "region": "商品猪",
               
                "city": "后备成活率(%)",
                "amount": 23.5,
                "date": "2019/01/08"
            },
            {
                "id": 15,
                "region": "商品猪",
               
                "city": "断奶前成活率(%)",
                "amount": 23.5,
                "date": "2019/04/08"
            },
            {
                "id": 16,
                "region": "商品猪",
               
                "city": "产房成活率(%)",
                "amount": 23.5,
                "date": "2019/07/08"
            },
            {
                "id": 17,
                "region": "商品猪",
               
                "city": "育肥成活率(%)",
                "amount": 23.5,
                "date": "2019/11/08"
            },
            {
                "id": 18,
                "region": "妊娠",
               
                "city": "妊娠期(天)",
                "amount": 23.5,
                "date": "2019/09/08"
            },
            {
                "id": 19,
                "region": "哺乳",
               
                "city": "哺乳期(天)",
                "amount": 23.5,
                "date": "2019/10/08"
            },
            {
                "id": 20,
                "region": "哺乳",
               
                "city": "非生产天数(NPD)",
                "amount": 23.5,
                "date": "2019/06/08"
            },
            {
                "id": 21,
                "region": "哺乳",
               
                "city": "年产胎次(LSY)",
                "amount": 23.5,
                "date": "2019/07/08"
            },
            {
                "id": 22,
                "region": "哺乳",
               
                "city": "年提供断奶仔猪数（PSY）",
                "amount": 23.5,
                "date": "2019/12/08"
            },
         ]
        }
    }
}