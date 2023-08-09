import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { DateTime } from '../common/datetime';
import { RegExps } from '../regexp';
export class ExcelImport {
    dom: HTMLInputElement;
    fileCount: 5;
    fileName: string;
    reader: FileReader = new FileReader();
    constructor(
        private http: HttpClient,
        type: string = 'file',
        multiple: boolean = false,
        accept: string = '.xls,.xlsx'
    ) {
        this.dom = document.createElement('input');
        this.dom.setAttribute('type', type);
        this.dom.setAttribute('multiple', `${multiple}`);
        this.dom.setAttribute('accept', accept);
    }
    readBinary(e, action: (data: any, fileName: string) => void): any {
        let binaryString: string = e.target.result;
        let workbook: XLSX.WorkBook = XLSX.read(binaryString, {
            type: 'binary',
        });
        let sheetName: string = workbook.SheetNames[1];
        let sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        let importData = XLSX.utils.sheet_to_json(sheet, { raw: false, header: 1, defval: '' });
        action(importData, this.fileName);
    }
    readBinaryCustom(e, action: (data: any, fileName: string) => void): any {
        let binaryString: string = e.target.result;
        let workbook: XLSX.WorkBook = XLSX.read(binaryString, {
            type: 'binary',
        });
        let sheetName: string = workbook.SheetNames[0];
        let sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        let importData = XLSX.utils.sheet_to_json(sheet, { raw: false, header: 1, defval: '' });
        action(importData, this.fileName);
    }
    excute() {
        this.dom.click();
    }
    /**
     * 单文件导入
     * @param action
     */
    importSingleFile(action: (data, fileName) => void, hasCustomTemplate?: boolean) {
        this.dom.onchange = (e) => {
            const target: any = <any>e.target;
            if (target.files.length !== 1) throw new Error('必须选择一个文件');
            if (target && target.files.length !== 1) throw new Error('导入必须选择文件');
            this.reader.onload = (read: any) => {
                this.fileName = target.files[0].name;
                if (hasCustomTemplate) {
                    this.readBinaryCustom(read, action);
                } else {
                    this.readBinary(read, action);
                }
            };
            this.reader.readAsBinaryString(target.files[0]);
        };
        this.excute();
    }
    /**
     * 单文件导入流
     */
    importSingleFileAsStream(action: (buffers: ArrayBuffer) => void) {
        this.dom.onchange = (e) => {
            const target: DataTransfer = <DataTransfer>e['path'][0];
            if (target.files.length !== 1) throw new Error('必须选择一个文件');
            if (target && target.files.length !== 1) throw new Error('导入必须选择文件');
            this.reader.onload = (read: any) => {
                action(read.target.result);
            };
            this.reader.readAsArrayBuffer(target.files[0]);
        };
        this.excute();
    }
    /**
     * 多文件导入
     * @param action
     */
    importMultipleFile(): Promise<Array<any>> {
        this.dom.setAttribute('multiple', 'true');
        return new Promise((resolve, reject) => {
            this.dom.onchange = (e) => {
                let count = 0;
                let readers = [];
                let datas = [];
                const target: DataTransfer = <DataTransfer>e['path'][0];
                if (target.files.length > this.fileCount) {
                    alert('一次最多上产五个文件,文件超出限制');
                    return;
                }
                for (let i = 0; i < target.files.length; i++) {
                    let reader = new FileReader();
                    reader.onload = (read: any) => {
                        count++;
                        this.readBinary(read, (data) => {
                            datas.push(data);
                            if (count == target.files.length) {
                                resolve(datas);
                            }
                        });
                    };
                    readers.push(reader);
                }
                for (let index = 0; index < target.files.length; index++) {
                    readers[index].readAsBinaryString(target.files[index]);
                }
            };
            this.excute();
        });
    }
    /**
     * 多文件导入流
     * @param action
     */
    importMultipleFileAsStream(): Promise<Array<ArrayBuffer>> {
        this.dom.setAttribute('multiple', 'true');
        return new Promise((resolve, reject) => {
            this.dom.onchange = (e) => {
                let count = 0;
                let readers = [];
                let arrayBuffer = [];
                const target: DataTransfer = <DataTransfer>e['path'][0];
                if (target.files.length > this.fileCount) {
                    alert('一次最多上产五个文件,文件超出限制');
                    return;
                }
                for (let i = 0; i < target.files.length; i++) {
                    let reader = new FileReader();
                    reader.onload = (read: any) => {
                        count++;
                        arrayBuffer.push(read.target.result);
                        if (count == target.files.length) {
                            resolve(arrayBuffer);
                        }
                    };
                    readers.push(reader);
                }
                for (let index = 0; index < target.files.length; index++) {
                    readers[index].readAsArrayBuffer(target.files[index]);
                }
            };
            this.excute();
        });
    }
    /**
     * 加载导入数据
     * @param data 数据
     * @param jsonPath 数据模板
     */
    load(
        data: Array<any[]>,
        jsonPath: string,
        hasCustomTemplate?: boolean
    ): Promise<{
        code: number;
        header: string[];
        data: any[];
        headerMap: any;
        errorColumn: ImportExcelTemplate[];
    }> {
        return new Promise<{
            code: number;
            header: string[];
            data: any[];
            headerMap: any;
            errorColumn: ImportExcelTemplate[];
        }>((resolve, reject) => {
            this.http.get(jsonPath).subscribe((template: ImportExcelTemplate[]) => {
                let _templateObj = {};
                template.map((m) => {
                    _templateObj[m.dataField] = m.caption;
                });
                console.log(data);
                if (data.length <= 0 || template.length <= 0) {
                    resolve({
                        code: -1,
                        header: null,
                        data: null,
                        headerMap: null,
                        errorColumn: [],
                    });
                } else {
                    const impor = this.readToObject(template, data, hasCustomTemplate);
                    console.log(impor);
                    // server不为空请求后端导入接口
                    if (impor.errorColumn.length > 0) {
                        resolve({
                            code: -1,
                            header: impor.header,
                            headerMap: impor.headerMap,
                            data: impor.data,
                            errorColumn: impor.errorColumn,
                        });
                    } else {
                        resolve({
                            code: 0,
                            header: impor.header,
                            headerMap: impor.headerMap,
                            data: impor.data,
                            errorColumn: [],
                        });
                    }
                }
            });
        });
    }
    /**
     * 拼接后端接口数据模板
     * @param template 数据模板
     * @param data 导入数据
     */
    private readToObject(template: ImportExcelTemplate[], data: Array<any[]>, hasCustomTemplate?: boolean) {
        let headerMap = {};
        let importData = [];
        // 获取完整数据对象
        const DATA = this.ignoreExcelEmptyRowAndColumn(data);
        // 生成数据字段索引集合
        const dataIndexs: ImportExcelTemplate[] = [];
        let headers = [];
        for (let i = 0; i < DATA[0].length; i++) {
            for (let j = 0; j < template.length; j++) {
                if (this.replaceSign(DATA[0][i]) == this.replaceSign(template[j].caption)) {
                    dataIndexs.push(template[j]);
                    headers.push(template[j].caption.replace(RegExps.TrimSpace, ''));
                    headerMap[template[j].dataField] = this.replaceSign(template[j].caption);
                    break;
                }
            }
        }
        if (hasCustomTemplate) {
            for (let i = 0; i < template.length; i++) {
                headerMap[template[i].dataField] = this.replaceSign(template[i].caption);
            }
        }
        // 验证导入Excel文件列名是否与模板匹配
        if (!hasCustomTemplate && dataIndexs.length != template.length) {
            let errorColumn: ImportExcelTemplate[] = [];
            template.forEach((m) => {
                // 如果在Excel中没有存在模板中的列视为错误列
                if (headers.indexOf(m.caption) == -1) {
                    errorColumn.push(m);
                }
            });
            return {
                header: DATA[0],
                headerMap: headerMap,
                data: importData,
                errorColumn: errorColumn,
            };
        }
        // 匹配数据
        for (let i = 1; i < DATA.length; i++) {
            let tempData = {};
            for (let index = 0; index < dataIndexs.length; index++) {
                try {
                    let value = DATA[i][index];
                    if (value != null && value != undefined) {
                        if (typeof value === 'string') {
                            // 字符串去掉值首尾空格
                            value = value.replace(RegExps.TrimSpace, '');
                        }
                        if (dataIndexs[index].dataType == 'date' && value) {
                            tempData[dataIndexs[index].dataField] = new DateTime(value).toString('yyyy-MM-dd');
                            continue;
                        }
                        tempData[dataIndexs[index].dataField] = value.toString();
                    } else {
                        tempData[dataIndexs[index].dataField] = '';
                    }
                } catch (reson) {
                    throw new Error(reson);
                }
            }
            importData.push(tempData);
        }
        return {
            header: headers,
            headerMap: headerMap,
            data: importData,
            errorColumn: [],
        };
    }

    /**
     * 排除Excel的空列空行
     * @param data
     */
    private ignoreExcelEmptyRowAndColumn(data: Array<any[]>): Array<any[]> {
        // 创建空行对比对象
        const compareEmptyRow = [];
        for (let i = 0; i < data[0].length; i++) {
            compareEmptyRow.push('');
        }
        // 去掉末尾空列
        for (let i = data[0].length - 1; i >= 0; i--) {
            if (data[0][i] != '') {
                break;
            }
            data[0].pop();
        }
        // 去掉空行
        for (let i = data.length - 1; i > 0; i--) {
            data[i].forEach((m, index) => {
                if (typeof m === 'string') {
                    data[i][index] = m.replace(RegExps.TrimSpace, '');
                } else {
                    if (m === null || m === undefined) {
                        data[i][index] = '';
                    }
                }
            });
            if (data[i].toString() != compareEmptyRow.toString()) {
                break;
            }
            data.pop();
        }
        return data;
    }
    /**
     * 去除标题的*或者中英文（）标记
     */
    private replaceSign(caption: string) {
        return caption
            .replace('*', '')
            .replace('（', '')
            .replace('）', '')
            .replace('(', '')
            .replace(')', '')
            .replace(' ', '');
    }
}
class ImportExcelTemplate {
    caption: string;
    dataField: string;
    dataType: 'string' | 'number' | 'date' | 'boolean';
}
