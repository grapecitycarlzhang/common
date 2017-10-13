import { DI, DIEx } from '../inversify'
import { TYPES } from './types';
import { IRequest, Request } from '../index';
import { IRequestErrorHandler, RequestErrorHandler } from '../request/requestErrorHandler';

export class BindingCollection {
    private isbindingToSyntax: boolean = false
    bindings: ((container: DI.Container) => void)[] = []
    get isbinded() {
        return this.isbindingToSyntax;
    }
    push(bindingToSyntax: (container: DI.Container) => void) {
        this.bindings.push(bindingToSyntax);
    }
    bindingToSyntax() {
        this.isbindingToSyntax || (this.isbindingToSyntax = true, this.bindings.map((bindingToSyntax) => bindingToSyntax(DIEx.container)));
    }
}
const bindingCollection = new BindingCollection()
bindingCollection.push((container) => {
    container.bind<IRequest>(TYPES.IRequest).to(Request);
    container.bind<IRequestErrorHandler>(TYPES.IRequestErrorHandler).to(RequestErrorHandler);
})
export { bindingCollection }
