import { message } from 'antd/lib';
import * as request from 'superagent';
import { GCGlobal, GCLocale, GCUtil } from '../index';
import { DI } from '../inversify'
const { injectable,inject } = DI

export interface IRequestErrorHandler{
    handler(response: request.Response, reject):void
}

@injectable()
export class RequestErrorHandler implements IRequestErrorHandler {
    handler(response: request.Response, reject) {
        if (response.unauthorized) {
            this.unauthorized();
        } else if (response.badRequest) {
            this.errorMessage(GCLocale.HttpBadRequest);
        } else if (response.notFound) {
            this.errorMessage(GCLocale.HttpNotFound);
        } else if (response.serverError) {
            this.errorMessage(GCLocale.HttpServerError);
        } else {
            reject(response);
        }
    }
    unauthorized() {
        GCUtil.redirectTo(GCGlobal.authorityUrl);
    }
    errorMessage(id) {
        message.error(GCGlobal.intl.formatMessage({ id: id }));
    }
}
