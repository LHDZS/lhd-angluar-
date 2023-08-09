export interface FileInfo{
    recordId?:number;
    fileName?:string;
    filePath:string;
    uploadDate?:Date;
    ownerName?:string;
    target?:number;
    EnterId?:string;
    FileType?:string;
    OwnerID?:string;
    NumericalOrder?:string;
}

export type StoreType="nxin";
export function UploadViewHelper(data):FileInfo[]{
    if(!data || !(data instanceof Array)){
        return [];
    }

    return data.map(f => {
        return { recordId: f.RecordId, fileName: f.FileName, filePath: f.FilePath, uploadDate: f.CreationDate, ownerName: f.OwnerName }
    })
}

export interface ChangedModel{
    Files:FileInfo[];
    isInit:boolean;
}