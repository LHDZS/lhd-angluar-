/**
 * 文件上传提供
 */
export class UploadProvider {
    /** input - [type = file] dom */
    dom: HTMLInputElement;
    input: any;
    /** 支持选择的文件格式 */
    accept: string = '*';
    /** 是否支持多文件上传 */
    multiple: boolean = false;
    /** 限制文件选择的数量 */
    limit: number = 1;
    private _type = 'file';
    private _reader: FileReader = new FileReader();
    /**
     *
     * @param multiple 是否可以选择多个文件
     * @param accept 选择的文件类型
     * @param limit 文件选择的个数
     */
    constructor(multiple?: boolean, accept?: string[], limit?: number) {
        this._paramsInit(multiple, accept, limit)._createDom();
    }
    /**
     * 参数初始化
     */
    private _paramsInit(multiple?: boolean, accept?: string[], limit?: number) {
        if (multiple) {
            this.multiple = multiple;
        }
        if (accept) {
            this.accept = accept.toString();
        }
        if (limit) {
            this.limit = limit;
        }
        return this;
    }
    /**
     * 创建Dom
     */
    private _createDom() {
        this.input = document.getElementById('uploadInput');
        // this.dom = document.createElement('input');
        // this.dom.setAttribute('type', this._type);
        // this.dom.setAttribute('multiple', `${this.multiple}`);
        // this.dom.setAttribute('accept', this.accept);
    }
    /**
     * 触发点击事件选择文件
     */
    private _excute() {
        this.input.click();
    }
    /**
     * 获取选择的文件信息
     */
    load(): Promise<FileList> {
        return new Promise((resolve, reject) => {
            this.input.onchange = e => {
                const INPUT: DataTransfer = <DataTransfer>e.target;
                resolve(INPUT.files);
            };
            this._excute();
        });
    }
    private _read(
        readType: ReadAsType
    ): Promise<
        Array<{
            file: File;
            result: any;
            e: any;
        }>
    > {
        return new Promise((resolve, reject) => {
            let result: any[] = [];
            let states = [];
            this.load().then(files => {
                let _interval = setInterval(() => {
                    if (states.length == files.length && !(states.indexOf(false) > -1)) {
                        resolve(result);
                        clearInterval(_interval);
                    }
                }, 300);
                for (let i = 0; i < files.length; i++) {
                    states.push(false);
                    const file = files[i];
                    let _reader = new FileReader();
                    _reader.onload = (e: any) => {
                        states[i] = true;
                        result.push({
                            file: file,
                            result: e.target.result,
                            e: e,
                        });
                    };
                    switch (readType) {
                        case ReadAsType.BinaryString:
                            _reader.readAsBinaryString(file);
                            break;
                        case ReadAsType.ArrayBuffer:
                            _reader.readAsArrayBuffer(file);
                            break;
                            case ReadAsType.Base64:
                                _reader.readAsDataURL(file);
                                break;
                        default:
                            throw new Error('[UploadProvider] Can not map read type.');
                    }
                }
            });
        });
    }
    /**
     * Read as ArrayBuffer
     */
    readAsArrayBuffer(): Promise<
        Array<{
            file: File;
            result: any;
            e: any;
        }>
    > {
        return this._read(ReadAsType.ArrayBuffer);
    }
    /**
     * Read as BinaryString
     */
    readAsBinaryString(): Promise<
        Array<{
            file: File;
            result: any;
            e: any;
        }>
    > {
        return this._read(ReadAsType.BinaryString);
    }
    
    /**
     * Read as BinaryString
     */
    readAsBase64String(): Promise<
        Array<{
            file: File;
            result: any;
            e: any;
        }>
    > {
        return this._read(ReadAsType.Base64);
    }
}
enum ReadAsType {
    BinaryString = 0,
    ArrayBuffer = 1,
    Base64 = 2,
}
// UploadProvider 示例
// new UploadProvider().load().then(e=>{
//
// })
