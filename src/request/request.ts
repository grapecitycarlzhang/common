import * as request from 'superagent';
import { GCGlobal, GCUtil } from '../index';
import { IRequestErrorHandler } from './requestErrorHandler';
import { TYPES } from '../di/types';
import { DI } from '../inversify'
const { injectable, inject } = DI

export interface GCBase {
}
export interface GCRequest extends GCBase {
}
export interface GCResponse extends GCBase {
}
export interface GCPagingRequest extends GCRequest {
    index?: number;
    limit?: number;
}
export interface GCRequestParam<T> {
    Url?: string;
    Headers?: {
        [key: string]: string;
    }[];
    Data?: T;
    Querys?: GCBase;
    Prefix?: string;
}

export interface IRequest {
    get(url: string, data?: any, routeData?: any): any;
    post(url: string, data?: any, routeData?: any): any;
    put(url: string, data?: any, routeData?: any): any;
    del(url: string, data?: any, routeData?: any): any;
}

export interface ITRequest<TRequest, TResponse> extends IRequest {
    get(url: string, data?: TRequest, routeData?: any): Promise<TResponse>;
    post(url: string, data?: TRequest, routeData?: any): Promise<TResponse>;
    put(url: string, data?: TRequest, routeData?: any): Promise<TResponse>;
    del(url: string, data?: TRequest, routeData?: any): Promise<TResponse>;
}

@injectable()
export class Request<TRequest, TResponse extends GCResponse> implements ITRequest<TRequest, TResponse> {
    defaultParam = {
        Url: '',
        Data: null,
        Querys: null,
        Headers: [{ "Authorization": "Bearer " + GCGlobal.loginUser.accessToken }],
        Prefix: GCGlobal.apiPrefix
    } as GCRequestParam<TRequest>
    @inject(TYPES.IRequestErrorHandler)
    errorHandler: IRequestErrorHandler
    processResponse(func: (url: string) => request.SuperAgentRequest, param?: GCRequestParam<TRequest>): Promise<TResponse> {
        const request = func(param.Prefix && !param.Url.startsWith("http") ? param.Prefix + param.Url : '' + param.Url);
        request.type("json");
        param.Data && request.send(JSON.stringify(param.Data));
        param.Querys && request.query(param.Querys);
        param.Headers && param.Headers.forEach((entry) => {
            request.set(entry);
        });
        return new Promise((resolve, reject) => {
            request
                .on('error', (err) => { this.errorHandler.handler(err.response, reject) })
                .end((error, response) => {
                    response && response.ok && resolve(response.body)
                });
        });
    }

    buildData(args: IArguments | any[]): GCRequestParam<TRequest> {
        if (typeof (args[0]) === "string") {
            return {
                ...this.defaultParam,
                ...{
                    Url: args[0],
                    Data: args[1]
                }
            };
        }
        else {
            return { ...this.defaultParam, ...args[0] };
        }
    }
    buildQueryParam(url: any, data: any, addRandom?: any): any {
        if (data) {
            url += "?";
            Object.getOwnPropertyNames(data)
                .forEach(name => {
                    url += name + "=" + encodeURI(data[name]) + "&";
                });
            if (addRandom) {
                url += Date.now() + "&";
            }
            url = url.slice(0, url.length - 1);
        }
        return url;
    }
    buildRouterParam(url: any, data?: any, routeData?: any) {
        if ((url as string).lastIndexOf('}') < 0 || (GCUtil.isEmpty(routeData) && GCUtil.isEmpty(data))) {
            return url;
        }
        const routeTokens = this.getRouteTokens(url);
        this.fillRouterParam([...routeTokens], routeData || data);
        return this.formatUrlByRouteParam(url, routeTokens);
    }
    getRouteTokens(url: string) {
        const reg = /\{(.+?)\}/g;
        const tokens = [];
        let execArr = [];
        while (execArr = reg.exec(url)) {
            let token = { name: execArr[1] }
            tokens.push(token)
        }
        return tokens;
    }
    // fillRouterParam(routeTokens?: any, data?: any) {
    //     Object.getOwnPropertyNames(data).forEach(prop => {
    //         if (typeof data[prop] === 'object' && !GCUtil.isEmpty(data[prop])) {
    //             this.fillRouterParam(routeTokens, data[prop])
    //         }
    //         routeTokens[prop] && !routeTokens[prop].hasValue && (routeTokens[prop].hasValue = true, routeTokens[prop].value = data[prop])
    //     });
    // }
    fillRouterParam(tokens?: any, data?: any) {
        tokens.forEach((token, index) => {
            if (!GCUtil.isEmpty(data[token.name])) {
                token.value = data[token.name];
                tokens.splice(index, 1);
            }
        })
        if (tokens.length === 0) return true;
        Object.getOwnPropertyNames(data).some(prop => {
            if (typeof data[prop] === 'object' && !GCUtil.isEmpty(data[prop])) {
                return this.fillRouterParam(tokens, data[prop])
            }
        });
    }
    formatUrlByRouteParam(url: string, tokens: any) {
        tokens.forEach(token => {
            if (GCUtil.isEmpty(token.value)) {
                throw `{${token.name}}: route token to be empty`
            }
            url = url.replace(`{${token.name}}`, token.value)
        })
        return url
    }

    get(url: string, data?: TRequest, routeData?: any): Promise<TResponse> {
        return this.processResponse(request.get, this.buildData([
            this.buildQueryParam(this.buildRouterParam(url, data, routeData), data, true),
            data
        ]));
    }
    post(url: string, data?: TRequest, routeData?: any): Promise<TResponse> {
        return this.processResponse(request.post, this.buildData([this.buildRouterParam(url, data, routeData), data]));
    }
    put(url: string, data?: TRequest, routeData?: any): Promise<TResponse> {
        return this.processResponse(request.put, this.buildData([this.buildRouterParam(url, data, routeData), data]));
    }
    del(url: string, data?: TRequest, routeData?: any): Promise<TResponse> {
        return this.processResponse(request.delete, this.buildData([
            this.buildQueryParam(this.buildRouterParam(url, data, routeData), data),
            data
        ]));
    }
}