import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CacheStorageService {
    constructor(private cookieService: CookieService) {}
    /* - - - - - - - - - - - - - - - - -
     * 描述：设置浏览器缓存 localStroage |
     * - - - - - - - - - - - - - - - - */
    public localStorageGet(key: string): string {
        return localStorage.getItem(key);
    }
    public localStorageSet(key: string, value: string): CacheStorageService {
        localStorage.setItem(key, value);
        return this;
    }
    public localStorageRemove(key: string): CacheStorageService {
        localStorage.removeItem(key);
        return this;
    }
    public localStorageClear(): CacheStorageService {
        localStorage.clear();
        return this;
    }
    public localStorageLength(): number {
        return localStorage.length;
    }

    /* - - - - - - - - - - - - - - - - - -
     * 描述：设置浏览器缓存 SessionStroage |
     * - - - - - - - - - - - - - - - - - */
    public sessionStorageGet(key: string): string {
        return sessionStorage.getItem(key);
    }
    public sessionStorageSet(key: string, value: string): CacheStorageService {
        sessionStorage.setItem(key, value);
        return this;
    }
    public sessionStorageRemove(key: string): CacheStorageService {
        sessionStorage.removeItem(key);
        return this;
    }
    public sessionStorageClear(): CacheStorageService {
        sessionStorage.clear();
        return this;
    }
    public sessionStorageLength(): number {
        return sessionStorage.length;
    }

    /* - - - - - - - - - - - - - - - - - - - - - - - - -
     * 描述：设置本地缓存 Cookie                         |
     * 依赖: npm install ngx-cookie-service --save   　 |
     * - - - - - - - - - - - - - - - - - - - - - - - - */
    /**
     * 从Cookie中获取缓存值
     * @param key 键
     * @param value 值
     * @param expires 过期时间
     * @param path 路径
     * @param domain 域
     * @param secure 是否受保护
     * @param sameSite Lax: 普通模式; Strict: 严格模式; None: 默认
     * - - - - - - - - - - - - - - - - -  -- - - - - - - - - - - -*/
    public cookieStorageSet(
        key: string,
        value: string,
        expires?: number | Date,
        path?: string,
        domain?: string,
        secure?: boolean,
        sameSite?: 'Lax' | 'Strict' | 'None'
    ): CacheStorageService {
        this.cookieService.set(key, value, expires, path, domain, secure, sameSite);
        return this;
    }
    public cookieStorageGet(key: string): string {
        return this.cookieService.get(key);
    }
    /**
     * 移除Cookie中指定的缓存
     * @param key 键
     * @param path 路径
     * @param domain 域
     */
    public cookieStorageRemove(key: string, path: string, domain: string): CacheStorageService {
        this.cookieService.delete(key, path, domain);
        return this;
    }
    public cookieStorageClear(): CacheStorageService {
        this.cookieService.deleteAll();
        return this;
    }
    public cookieStorageCheck(key: string): boolean {
        return this.cookieService.check(key);
    }
}
