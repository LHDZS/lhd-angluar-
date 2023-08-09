import { deepCopy } from 'src/app/providers/common/deepCopy';

export class EditorGridUtils<T> {
    key: string;
    loaded: boolean = false;
    items: T[] = [];
    deleted: any[] = [];
    loadInvoke: (loadOptions) => Promise<any[]> = null;
    /** 默认属性值 */
    defaultProperty: any;
    /**
     * 初始化EditorGridUtiles实例
     * @param key 主键
     * EditorGrid 组件
     * ### Example
     * ```ts
     * _util = new EditorGridUtils<T>('主键');
     * new DataSource({
     *                 store: new CustomStore({
     *                     key: '主键',
     *                     load: (loadOptions) => {
     *                         return this._util.items;
     *                     },
     *                     insert: (data) => {
     *                         this._util.push(data);
     *                         return Promise.resolve();
     *                     },
     *                     remove: (keys: any[]) => {
     *                         this._util.delete(keys);
     *                         return Promise.resolve();
     *                     },
     *                     update: (key,data) => {
     *                         this._util.update(key,data);
     *                         return Promise.resolve();
     *                     }
     *                 })
     * })
     * ```
     * `load` `insert` `remove` `update` 对应表格操作 `查` `增` `删` `改`, 在各自方法中可以添加自定义逻辑
     */
    constructor(key: any, initRows: number = 5, defaultProperty?: any) {
        this.key = key;
        if (defaultProperty) {
            this.defaultProperty = defaultProperty;
        }
        if (initRows > 0) {
            this.default(initRows);
        }
    }
    /** 初始化数据 */
    init(data: T[]) {
        data.forEach(item => {
            item['target'] = DataStatus.None;
        });
        this.deleted = [];
        this.items = data;
        
    }
    initNew(data: T[]) {
        data.forEach(item => {
            item['target'] = DataStatus.New;
        });
        this.deleted = [];
        this.items = data;
        
    }
    default(rows: number = 5) {
        this.items.splice(0);
        for (let i = 0; i < rows; i++) {
            let _: any = { target: DataStatus.NewButNotEdit };
            if (this.defaultProperty) {
                for (const key in this.defaultProperty) {
                    _[key] = this.defaultProperty[key];
                }
            }
            _[this.key] = i;
            this.items.push(_);
        }
    }
    /** 新增 */
    push(data: T) {
        if (this.defaultProperty) {
            for (const key in this.defaultProperty) {
                data[key] = this.defaultProperty[key];
            }
        }
        this.items.push(data);
    }
    /** 导入 */
    import(data: T[]) {
        let _identity = this.items.length;
        data.forEach((m, i) => {
            m['target'] = DataStatus.New;
            m[this.key] = _identity + i;
        });
        this.items.unshift(...data);
    }
    /** 删除 */
    delete(keys: any[]) {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const data = this.items.find(m => m[this.key] == key);
            if (data) {
                this.items.splice(
                    this.items.findIndex(m => m[this.key] == key),
                    1
                );
                if (data['target']!==undefined && data['target']!==null && data['target'] != DataStatus.New && data['target'] != DataStatus.NewButNotEdit) {
                    data['target'] = DataStatus.Delete;
                    this.deleted.push(data);
                }
            }
        }
    }
    /** 移除, 不会添加到删除集合中 */
    remove(keys: any[]) {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            this.items.splice(
                this.items.findIndex(m => m[this.key] == key),
                1
            );
        }
    }
    /** 修改 */
    update(key: any, values: any) {
        if (key !== null && key !== undefined) {
            let data = this.items.find(m => m[this.key] == key);
            if (data !== null && data !== undefined) {
                if (data['target'] == DataStatus.NewButNotEdit) {
                    data['target'] = DataStatus.New;
                }
                if (data['target'] != DataStatus.New && data['target'] != DataStatus.Delete) {
                    data['target'] = DataStatus.Edit;
                }
                for (const key in values) {
                    (data as any)[key] = values[key];
                }
            }
        }
    }
    /** 赋值 */
    set(key: any, dataField: string, value: any) {
        let data = this.items.find(m => m[this.key] == key);
        if (data) {
            data[dataField] = value;
        }
    }
    setData(key: any, row: any) {
        let data = this.items.find(m => m[this.key] == key);
        if (data) {
            var target = row['target'];
            if (row['target'] == DataStatus.NewButNotEdit) {
                target =  DataStatus.New;
            }
            else if(row['target'] == DataStatus.None){
                target =  DataStatus.Edit;
            }
            row.target = target;
            for (let p in row) {
                data[p] =
                    typeof row[p] === 'object' && row[p] != null && row[p] != undefined
                        ? row[p].constructor == Date
                            ? row[p]
                            : deepCopy(row[p])
                        : row[p];
            }
        }
    }
    /** 改变某列的值 */
    changeColumn(dataField: string, value: any, changeTarget: boolean = true) {
        for (let i = 0; i < this.items.length; i++) {
            const _row = this.items[i];
            if (changeTarget) {
                if (_row['target'] == DataStatus.None) {
                    _row['target'] = DataStatus.Edit;
                }
            }
            this.items[i][dataField] = value;
        }
    }
    /** 加载 */
    async load(action: () => Promise<any[]>) {
        if (this.loaded) return this.items;
        this.loaded = true;
        this.items.splice(0, this.items.length, ...(await action()));
        return this.items;
    }
    /** 数据源重新加载, 重新加载数据源会将target状态变为none */
    reload(items: any[]) {
        items.forEach(m => {
            m['target'] = DataStatus.None;
        });
        this.items.splice(0, this.items.length, ...items);
    }
    /**
     * 清空表体
     * - `force `
     * -- `true`: 强制清空所有
     * -- `false`: 将 target 为 `None`|`Edit` 放入删除, 舍弃其他数据
     */
    clear(force: boolean = true) {
        if (force) {
            this.items.splice(0);
        } else {
            let _ = this.items.filter(m => m['target'] == DataStatus.None || m['target'] == DataStatus.Edit);
            _.forEach(item => {
                item['target'] = DataStatus.Delete;
                this.deleted.push(item);
            });
            this.items.splice(0);
        }
    }
    map(callbackfn: (item: T, index: number) => void) {
        this.items.forEach((m, i) => callbackfn(m, i));
        return this;
    }
    /** 获取Target状态为非 NewButNotEdit 的数据 */
    getSaveData(): T[] {
        let _ = [];
        _.push(...this.items)
        return _.concat(...this.deleted).filter(m => m['target'] != DataStatus.NewButNotEdit);
    }
    /** 获取 NewButNotEdit 的数据 */
    getData(): T[] {
        let _ = [];
        _.push(...this.items)
        return _;
    }
    /** 重置Target状态 */
    resetTargetStatus() {
        this.items.forEach(m => {
            m['target'] = DataStatus.None;
        });
    }
    /** 保存成功后设置Target的状态 */
    saveTargetSet() {
        for (let i = 0; i < this.items.length; i++) {
            const _ = this.items[i];
            if (_['target'] == DataStatus.Edit || _['target'] == DataStatus.New) {
                this.items[i]['target'] = DataStatus.None;
            }
        }
    }
}
export enum DataStatus {
    /** 无状态 */
    None = 0,
    /** 新增 */
    New = 1,
    /** 新增但未编辑过 */
    NewButNotEdit = -1,
    /** 修改 */
    Edit = 2,
    /** 删除 */
    Delete = 3,
}
