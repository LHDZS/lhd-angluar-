import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReviewTypes } from '../types';

@Injectable()
export class ReviewService {
    constructor(private _http: HttpClient) {}
    /**
     * 审核
     * @param userId 审核人ID
     * @param data
     */
    post(url, userId, options: any) {
        return this._http.post(`${url}/api/QLW_Review/OperateReview`, { CheckedByID: userId, ...options }).toPromise();
    }
    /**
     * 获取审核信息
     * @param url
     * @param data
     */
    get(url, data: any) {
        return this._http.post(`${url}/api/QLW_Review/GetRereiew`, data).toPromise();
    }
    hasReviewed(data: any[]) {
        let _ = data.find((m) => m._reviewed && m.type != ReviewTypes.making);
        if (_) return true;
        else return false;
    }
}
