import { Request } from '../../../src/request/request';
import { expect } from 'chai';
import { ServiceBase, DIEx, IRequest, TYPES, RoutePrefix } from '../../../src/index'

class foo1 extends ServiceBase<any, any> {
    routePrefix: RoutePrefix = { prefix: 'routePrefix' }
}

describe('Service', () => {
    let repos: foo1
    beforeEach(() => {
        repos = new foo1()
    })
    it('routePrefix is not empty', () => {
        try {
            repos.routePrefix = { prefix: '' }
            repos.url();
        } catch (error) {
            expect(error).to.equals('service url prefix is empty');
        }
        try {
            repos.routePrefix = null
            repos.url();
        } catch (error) {
            expect(error).to.equals('service url prefix is empty');
        }
        try {
            repos.routePrefix = undefined
            repos.url();
        } catch (error) {
            expect(error).to.equals('service url prefix is empty');
        }
    });
    it('routePrefix merge routeSuffix', () => {
        let url = repos.url('routeSuffix');
        expect(url).to.equals('routePrefix/routeSuffix')
    });
    it('routeSuffix start with ~', () => {
        let url = repos.url("~routeSuffix/1/2/3");
        expect(url).to.equals('routeSuffix/1/2/3');
    });

})
