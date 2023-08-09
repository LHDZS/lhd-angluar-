import ArrayStore, { ArrayStoreOptions } from 'devextreme/data/array_store';
import CustomStore, { CustomStoreOptions } from 'devextreme/data/custom_store';
import DataSource, { DataSourceOptions } from 'devextreme/data/data_source';
import ODataStore, { ODataStoreOptions } from 'devextreme/data/odata/store';

export class DataSourceFactory {
    static odata(store: ODataStore, dataSourceOptions?: DataSourceOptions);
    static odata(store: ODataStoreOptions, dataSourceOptions?: DataSourceOptions);
    static odata(_: ODataStore | ODataStoreOptions, dataSourceOptions?: DataSourceOptions) {
        if (_ instanceof ODataStore) {
            return new DataSource({
                store: _,
                ...dataSourceOptions,
            });
        }
        return new DataSource({
            store: StoreFactory.odata(_),
            ...dataSourceOptions,
        });
    }
    static array(storeOptions: ArrayStoreOptions, dataSourceOptions?: DataSourceOptions) {
        return new DataSource({
            store: StoreFactory.array(storeOptions),
            ...dataSourceOptions,
        });
    }
    static custom(storeOptions: CustomStoreOptions, dataSourceOptions?: DataSourceOptions) {
        return new DataSource({
            store: StoreFactory.custom(storeOptions),
            ...dataSourceOptions,
        });
    }
}

export class StoreFactory {
    static odata(options: ODataStoreOptions) {
        return new ODataStore({
            version: 4,
            ...options,
        });
    }
    static array(options: ArrayStoreOptions) {
        return new ArrayStore(options);
    }
    static custom(options: CustomStoreOptions) {
        return new CustomStore(options);
    }
}
