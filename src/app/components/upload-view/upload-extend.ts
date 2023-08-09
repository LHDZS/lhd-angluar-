import { EventEmitter } from '@angular/core';
import { PermissionCodes } from 'src/app/providers/permission';
import { FileInfo, StoreType } from './upload-view.model';

export class NxUploader {
    multiple: boolean = true;

    visible: boolean = false;

    limit: number = 5;

    maxFileLength = 20;

    maxFileMB = 50;

    accept: string[] = ["*"];

    showShortcutList: boolean = true;

    readonly: boolean = false;

    labelText: string = "附件管理";

    uploadButtonText: string = "上传";

    gridNoDataText: string = "请上传文件";

    title: string = "文件上传";

    numericalOrder: string;

    popWidth: string = "800px";

    popHeight: string = "580px";

    store: StoreType = "nxin";

    fileListChange:Function; //new EventEmitter<FileInfo[]>();
}