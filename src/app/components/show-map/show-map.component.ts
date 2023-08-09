import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DxButtonModule, DxTextBoxModule } from 'devextreme-angular';
import { QlwODataContext } from 'src/app/providers/context/odata-context/qlw.odataContext';

declare var AMap: any;

@Component({
    selector: 'app-show-map',
    templateUrl: './show-map.component.html',
    styleUrls: ['./show-map.component.scss'],
})
export class ShowMapComponent implements OnInit {
    // constructor(private _qlwOdataService: QlwODataContext) { }

    // tslint:disable-next-line:member-ordering
    private market: Array<any> = [];
    // tslint:disable-next-line:member-ordering
    private maps: any;
    // tslint:disable-next-line:member-ordering
    private geoc: any;
    // tslint:disable-next-line:member-ordering
    private toolBar: any;
    private AllArea: Array<any> = [];

    searchValue: string = '';
    searchButton: any;

    private _mode: 'single' | 'multiple';

    @Output() getValue = new EventEmitter();
    @Input()
    set mode(mode: any) {
        this._mode = mode;
    }
    @Input() address;

    get mode() {
        if (this._mode) {
            return this._mode;
        } else {
            return 'single';
        }
    }

    ngOnInit() {
        this.GetAllArea();
        this.getMap();
        this.searchButton = [
            {
                name: 'search',
                location: 'after',
                options: {
                    stylingMode: 'text',
                    icon: 'search',
                    onClick: (e) => {
                        this.searchCity(e);
                    },
                },
            },
        ];
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.address) {
            this.placeSearch(this.address);
        }
    }

    private getMap() {
        this.maps = new AMap.Map('container', {
            resizeEnable: true,
            zoom: 15,
            center: [116.397428, 39.90923],
        });

        const aMap = this.maps;
        const $this = this;
        const $market = this.market;
        const $value = this.getValue;
        const $mode = this.mode;
        // tslint:disable-next-line:only-arrow-functions
        this.maps.on('click', function (e) {
            $this.addMark(e, aMap, $market, $value, $mode);
        });

        // tslint:disable-next-line:only-arrow-functions
        AMap.plugin('AMap.ToolBar', function () {
            // 异步加载插件
            const toolbar = new AMap.ToolBar();
            aMap.addControl(toolbar);
        });
        var autoOptions = {
            input: 'tipinput',
        };
        var auto = new AMap.Autocomplete(autoOptions);
    }

    private addMark(e, aMap, markets, callBack, mode) {
        const target = e.target;
        // 触发事件的地理坐标，AMap.LngLat 类型
        const lnglat = e.lnglat;
        // 触发事件的像素坐标，AMap.Pixel 类型
        const pixel = e.pixel;
        // 触发事件类型
        const type = e.type;
        if (!this.geoc) {
            this.geoc = new AMap.Geocoder({
                city: '010', //城市设为北京，默认：“全国”
                radius: 500, //范围，默认：500
            });
        }
        let $this = this;
        aMap.clearMap();
        this.geoc.getAddress(e.lnglat, function (status, result) {
            if (status === 'complete' && result.regeocode) {
                var rs = result.regeocode;
                var rg = rs.addressComponent;

                var endaddr = rs.formattedAddress
                    .replace(rg.province, '')
                    .replace(rg.city, '')
                    .replace(rg.district, '');

                var marker = new AMap.Marker({
                    position: lnglat,
                    title: endaddr,
                });
                let $market = {
                    nLongitude: lnglat.lng,
                    nLatitude: lnglat.lat,
                    cCoordinateAddr: endaddr,
                    province: rg.province,
                    city: rg.city,
                    district: rg.district,
                    CityId: '0',
                    ProvinceId: '0',
                    CountyId: '0',
                };
                $this.GetArea($market);
                if (mode === 'single') {
                    markets = [];
                }
                markets.push($market);
                // markers.push(marker);

                aMap.add(marker);
                aMap.setFitView();
                callBack.emit(markets);
                // console.log(markets, 'click');
                // //坐标记录下来
                // GetArea(rg.province, rg.city, rg.district, false);
            } else {
            }
        });
    }
    GetArea(model) {

        this.AllArea.forEach(ep => {
            if (ep.CAreaName == model.province) {
                model.ProvinceId = ep.AreaId;
                this.AllArea.forEach(ec => {
                    if (ec.Pid == model.ProvinceId) {
                        //省内筛选
                        if (ec.CAreaName == model.city || (!model.city && (ec.CAreaName == '市辖区' || ec.CAreaName == '市辖县' || ec.CAreaName == '省直辖县级行政区划'))) {
                            model.CityId = ec.AreaId;
                            this.AllArea.forEach(ed => {
                                if (ed.Pid == model.CityId) {
                                    //市内筛选
                                    if (ed.CAreaName == model.district) {
                                        model.CountyId = ed.AreaId;
                                    }
                                }
                            })
                            if( model.CountyId=="0"){
                                this.AllArea.forEach(ed => {
                                    if (ed.Pid == model.CityId) {
                                        //市内筛选
                                        if (ed.CAreaName.substr(0,2) == model.district.substr(0,2)) {
                                            model.CountyId = ed.AreaId;
                                        }
                                    }   
                                })
                            }
                        }
                    }

                });
            }
        })
    }

    GetAllArea() {
        // this._qlwOdataService.getAreas("", "", "").then(res => {
        //     this.AllArea = res['value'];
        // })

    }

    searchCity(e) {
        this.placeSearch(this.searchValue);
    }
    placeSearch(address: string, second?: string) {
        var placeSearch = new AMap.PlaceSearch({
            city: '010',
        });
        const $this = this;
        const $address = address;
        const $second = second;
        const $search = $address ? $address : $second;
        placeSearch.search($search, function (status, result) {
            // debugger;
            $this.placeSearchAction(status, result, $this, $address, $second);
        });
    }
    private placeSearchAction(status, result, $this, address, second) {
        if (status === 'error') {
            return;
        }

        if (status === 'no_data') {
            $this.placeSearch(null, second);
            return;
        }

        var pois = result.poiList.pois;
        // for (var i = 0; i < pois.length; i++) {
        var poi = pois[0];
        var marker = [];
        const mark_b = new AMap.Marker({
            position: poi.location,
            title: poi.name,
        });
        $this.removeMark();

        // console.log(poi, result, 'searck');

        $this.maps.add(mark_b);
        // let $market = {
        //     nLongitude: mark_b.position.lng,
        //     nLatitude: mark_b.position.lat,
        //     cCoordinateAddr: poi.address,
        //     province: rg.province,
        //     city: rg.city,
        //     district: rg.district,
        // };

        // }
        $this.maps.setFitView();
    }

    addsMark() {
        var marker = new AMap.Marker({
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            zoom: 15,
            position: [116.405467, 39.907761],
        });
        this.maps.add(marker);
    }
    removeMark() {
        this.maps.clearMap();
    }
    displayTool() {
        // console.log(this.market);
    }
}

@NgModule({
    imports: [CommonModule, DxTextBoxModule, DxButtonModule],
    declarations: [ShowMapComponent],
    exports: [ShowMapComponent],
})
export class ShowMapModule { }

export class LevelNamedDto {
    public rankArray = [];
}
