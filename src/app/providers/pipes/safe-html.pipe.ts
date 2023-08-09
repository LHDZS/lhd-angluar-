import { CommonModule } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * 安全的HTML转换
 * 渲染innerHTML中的样式
 */
@Pipe({
    name: 'SafeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
    constructor(private _sanitized: DomSanitizer) {}
    transform(value: any, args?: any): any {
        return this._sanitized.bypassSecurityTrustHtml(value);
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [SafeHtmlPipe],
    exports: [SafeHtmlPipe],
})
export class SafeHtmlModule {}
