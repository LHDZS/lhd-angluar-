export class NxDataGridExport {
    /**
     * 是否开启导出选择的数据
     */
    allowExportSelectedData: boolean = true;
    /**
     * 自定义Excel单元格
     */
    customizeExcelCell: Function = null;
    /**
     * 是否启用导出功能
     */
    enabled: Boolean = true;
    /**
     * 是否对导出的Excel数据做筛选
     */
    excelFilterEnabled: boolean = false;
    /**
     * 是否对导出的数据自动换行
     */
    excelWrapTextEnabled: boolean = false;
    /**
     * 导出文件名称
     */
    fileName: String = `${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}`;
    /**
     * Excel排除导出的数据异常
     */
    ignoreExcelErrors: boolean = true;
    /**
     * 代理
     */
    proxyUrl: string;
}
