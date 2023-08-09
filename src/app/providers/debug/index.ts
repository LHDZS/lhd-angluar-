import { environment } from 'src/environments/environment';

export class Debug {
    static console(message: any) {
        if (!environment.production) {
            console.log(message);
        }
    }
}
