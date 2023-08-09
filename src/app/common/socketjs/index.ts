import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { catchError, delayWhen, retryWhen, switchAll, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
export const WS_ENDPOINT = environment.WeightWsEndpoint;
const RECONNECT_INTERVAL = 3000;
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket$: WebSocketSubject<any>;
  /**
   * 连接
   */
  public connect(obj? : any): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebsocket(obj);
      if (obj)
        obj.ranNum = "0";
    }
  }

  /**
   * 返回 websocketSubject对象,根据WebSocketSubjectConfig内容创建
   */
  private getNewWebsocket(obj? : any) {
    return webSocket({
      url: WS_ENDPOINT,
      closeObserver: {
        next: () => {
          console.log('[Data Service]: connection closed');
          this.socket$ = undefined;
          this.connect(obj);
        },
        error: (e) => {
          console.log(e)
        }
      },
    });
  }

  /**
   * 断线重连
   */
  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(retryWhen(errors => errors.pipe(tap(val => console.log('[Data Service] Try to reconnect', val)),
      delayWhen(_ => timer(RECONNECT_INTERVAL)))));
  }

  /**
   * 发送消息至后端
   */
  sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  /**
   * 接受后端发送来的消息,使用Multiplexing进行一对一推送
   * @param type 根据type获取信息
   * @param reconnect  是否断线重连,默认false
   */
  getMessage(type: string, reconnect: boolean = false): Observable<any> {
    const msg$ = this.socket$.multiplex(
      () => ({ connect: type }),
      () => ({ close: type }),
      message => message.type === type
    ).pipe(
      reconnect ? this.reconnect : o => o
    )
    return msg$;
  }

  /**
   * 接收后端消息
   * @param reconnect 
   * @returns 
   */
  getAllMsg(reconnect: boolean = false): Observable<any> {
    return this.socket$.multiplex(() => ({}), () => ({}), message => message).pipe(reconnect ? this.reconnect : o => o);
  }

  /**
   * 关闭websocket连接
   */
  close() {
    this.socket$.complete();
  }

}

