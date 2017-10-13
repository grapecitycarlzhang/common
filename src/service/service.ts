import { GCRequest, GCResponse, GCPagingRequest, ITRequest } from "../index";
import { TYPES } from '../di/types';
import { DI } from '../inversify'
const { injectable, inject } = DI

export interface IService {
    getItemsBy(data: GCRequest): Promise<GCResponse>
    get(data: GCRequest): Promise<GCResponse>
    delete(data: GCRequest): Promise<GCResponse>
    create(data: GCRequest): Promise<GCResponse>
    update(data: GCRequest): Promise<GCResponse>
}
export interface ITService<TRequest extends GCRequest, TPageReuest extends GCPagingRequest> extends IService {
    getItemsBy(data: TPageReuest): Promise<GCResponse>
    get(data: TRequest): Promise<GCResponse>
    delete(data: TRequest): Promise<GCResponse>
    create(data: TRequest): Promise<GCResponse>
    update(data: TRequest): Promise<GCResponse>
}
export interface RoutePrefix {
    prefix: string
    suffix?: string
    itemSuffix?: string
}
@injectable()
export abstract class ServiceBase<TRequest extends GCRequest, TPageReuest extends GCPagingRequest> implements ITService<TRequest, TPageReuest> {
    @inject(TYPES.IRequest)
    request: ITRequest<GCRequest, GCResponse>
    abstract routePrefix: RoutePrefix

    url(routeSuffix?: string) {
        if (routeSuffix && routeSuffix.startsWith('~')) {
            return routeSuffix.substr(1);
        }
        if (!this.routePrefix || !this.routePrefix.prefix) {
            throw "service url prefix is empty";
        }
        return `${this.routePrefix.prefix}${routeSuffix ? `/${routeSuffix}` : ''}`;
    }

    getItemsBy(data: TPageReuest) {
        return this.request.get(this.url(), data);
    }

    get(data: TRequest) {
        return this.request.get(this.url(this.routePrefix.itemSuffix), data);
    }

    delete(data: TRequest) {
        return this.request.del(this.url(this.routePrefix.itemSuffix), data);
    }

    create(data: TRequest) {
        return this.request.post(this.url(), data);
    }

    update(data: TRequest) {
        return this.request.put(this.url(this.routePrefix.itemSuffix), data);
    }

}