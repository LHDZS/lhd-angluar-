export interface NxExport{
    /**
     * 是否只导出指定的行
     * @default false
     */
    allowExportSelectedData?:boolean;
    /**
     * 自定义单元格
     */
    customizeExcelCell?: Function;
}