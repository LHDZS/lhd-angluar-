import * as XLSX from 'xlsx';
export class ExportFile {
    constructor() {}
    writeFileWithData(input: ExportInput) {
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        const descWs: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(input.descriptions);
        XLSX.utils.book_append_sheet(
            wb,
            descWs,
            input.descriptionSheetName ? input.descriptionSheetName : '模板说明文件'
        );

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(input.headers);
        XLSX.utils.book_append_sheet(wb, ws, input.sheetName ? input.sheetName : '模板文件');

        XLSX.writeFile(wb, `${input.fileName ? input.fileName : new Date().toLocaleString()}.xlsx`);
    }
}
export interface ExportInput {
    /**
     * 导出的文件名称
     */
    fileName?: string;

    /* 表头，默认为 json 数组对象的 Object.keys, 长度必须与 json 数组对象的 Object.keys 长度相等 */
    /* 多个工作表可以对应多个表头或单个表头，多个表头为二维数组，与多个工作表匹配 */
    /**
     * 导出的模板里显示的表头二维数组[[]]
     */
    headers?: Array<Array<string>>;
    /**
     * 模板sheet名称
     */
    sheetName: string;

    /***
     * 说明文件的内容
     */
    descriptions: Array<Array<string>>;
    /**
     * 说明sheet名称
     */
    descriptionSheetName: string;

    /* Excel 工作表名称，默认为 'sheet' +索引(从1开始) 多个工作表导出时长度必须与 json 数组长度相等 单个工作表导出时长度必须等于1 */
    //   sheetNames?: Array<string>;

    //   /* 需要合并单元格的数组，['A1:B1'] 和 [['0,0', '0,1']] 等效，两种写法都支持 */
    //   merges?: Array<string | Array<string>>;
}
