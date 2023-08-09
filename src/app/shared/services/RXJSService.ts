import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class RXJSService {
    private subject = new Subject<any>();

    publish(message: any) {
        this.subject.next(message);
    }

    subscription(): Observable<any> {
        return this.subject.asObservable();
    }
    unSubscribe() {
        this.subject.complete();
        // this.subject.unsubscribe();
    }
}
