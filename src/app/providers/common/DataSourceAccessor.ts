import { TokenAuthService } from 'src/app/shared/services';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import ODataStore from 'devextreme/data/odata/store';
import { Injectable } from '@angular/core';

@Injectable()
export class DataSourceAccessor {
    constructor(private _tokenService: TokenAuthService) {}

    /**
     * 仅适用于列表页
     * @param customOptions
     */
    getCustomDataStore(customOptions: {
        url: string;
        key: string;
        keyType: string;
        filter?: any[];
        beforeSend?: (loadOptions, e) => void;
    }): DataSource {
        return new DataSource({
            // 使用CustomStore 重新 load 方法
            store: new CustomStore({
                key:customOptions.key,
                load: (loadOptions) => {
                    if (loadOptions.filter instanceof Function) {
                        loadOptions.filter = [];
                    }
                    return new DataSource({
                        store: new ODataStore({
                            url: customOptions.url,
                            key: customOptions.key,
                            keyType: customOptions.keyType,
                            version: 4,
                            beforeSend: (e) => {
                                // e.headers = {
                                //     Authorization: this._tokenService.token,
                                // };
                                if (customOptions.beforeSend) {
                                    customOptions.beforeSend(loadOptions, e);
                                } else {
                                    // 设置 $count = false, $skip,$top 的值
                                    e.params['$count'] = false;
                                    e.params['$top'] = loadOptions.take;
                                    e.params['$skip'] = loadOptions.skip;
                                }
                            },
                        }),
                        requireTotalCount: false, // 设置不需要查询count
                        sort: loadOptions.sort, // 设置查询排序条件
                        filter: loadOptions.filter, // 设置查询过滤条件
                        paginate: true,
                        pageSize: loadOptions.take,
                    })
                        .load()
                        .then((value) => {
                            return {
                                data: value,
                            };
                        });
                },
                // 单独获取Count
                totalCount: (options) => {
                    return new DataSource({
                        store: new ODataStore({
                            url: customOptions.url + '/$count',
                            key: customOptions.key,
                            keyType: customOptions.keyType,
                            version: 4,
                            beforeSend: (e) => {
                                // e.headers = {
                                //     Authorization: this._tokenService.token,
                                // };
                                // 设置不需要查询count
                                e.params['$count'] = false;
                            },
                        }),
                        filter: options.filter, // 增加过滤条件
                        paginate: false, // 设置不需要分页
                    })
                        .load()
                        .then((count) => {
                            // 接口返回count值
                            return count;
                        });
                },
            }),
            filter: customOptions.filter,
        });
    }
}
