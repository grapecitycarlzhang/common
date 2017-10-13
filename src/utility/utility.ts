import { Store } from "redux";
import { InjectedIntl } from "react-intl";
export class GCGlobal {
    public static store: Store<any>
    public static intl: InjectedIntl
    public static apiPrefix: string = window ? window['apiPrefix'] : ''
    public static authorityUrl: string = window ? window['authorityUrl'] : ''
    public static loginUser: any = window ? (window['loginUser'] || {}) : {}
}
export class GCUtil {
    static redirectTo(url: string) {
        window.location.href = url
    }
    static getQueryString(key: any): string {
        var reg = new RegExp("(^|&|\\?)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.href.substr(1).match(reg);
        if (r) {
            return decodeURIComponent(r[2]);
        }
        return null;
    }
    static deepClone(obj: any): any {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        return JSON.parse(JSON.stringify(obj));
    }
    static isEmpty(obj: any): boolean {
        return obj === null || obj === undefined || obj === '';
    }
}