import { expect } from 'chai';
import { Request } from '../../../src/index'

class foo1 {
    id = 321
    idb = 'idb'
}
class foo2 extends foo1 {
    obj = { id: 123, obj: { now: 'now' } }
}
describe('Request', () => {
    let request: Request<any, any>
    beforeEach(() => {
        request = new Request()
    })
    it('buildRouterParam with url has none { or }', () => {
        let url1 = request.buildRouterParam('api/todo/', undefined)
        expect(url1).to.equals('api/todo/');
        let url2 = request.buildRouterParam('api/todo/{321}', undefined)
        expect(url2).to.equals('api/todo/{321}');
    });

    it('getRouteTokens', () => {
        let params = request.getRouteTokens('api/todo/{id}/time/{now}');
        expect(params.filter(t=>t.name === 'id').length).to.equals(1)
        expect(params.filter(t=>t.name === 'now').length).to.equals(1)
        expect(params.filter(t=>t.name === 'api').length).to.equals(0)
    });

    it('fillRouterParam', () => {
        const routeTokens = [{ name: 'id' }, { name: 'now' }]
        request.fillRouterParam([ ...routeTokens ], { id: 321, idb: 'idb', obj: { id: 123, obj: { now: 'now' } } })
        expect(routeTokens.filter(t=>t.name === 'id')[0]["value"]).to.equals(321);
        expect(routeTokens.filter(t=>t.name === 'now')[0]["value"]).to.equals('now');
    })

    it('formatUrlByRouteParam', () => {
        const tokens = [{ name: 'id', value: 321 }, { name: 'now', value: 'now' }]
        const formatUrl1 = request.formatUrlByRouteParam('api/todo/{id}/time/{now}', tokens)
        expect(formatUrl1).to.equals("api/todo/321/time/now");

        const formatUrl2 = request.formatUrlByRouteParam('api/todo/id/time/now', tokens)
        expect(formatUrl2).to.equals("api/todo/id/time/now");
    })

    it('test function : buildRouterParam', () => {
        let params = request.buildRouterParam('api/todo/{id}/time/{now}', new foo2())
        expect(params).to.equals('api/todo/321/time/now');
    });

    it('test function : buildRouterParam that route data is undefined', () => {
        let params = request.buildRouterParam('api/todo/{id}/time/{now}', new foo2())
        expect(params).to.equals('api/todo/321/time/now');
    });

    it('test function : buildRouterParam that route data has value', () => {
        let params = request.buildRouterParam('api/todo/{id}/time/{now}', {}, new foo2())
        expect(params).to.equals('api/todo/321/time/now');
    });
    it('test function : buildRouterParam that route token not to be empty', () => {
        try {
            request.buildRouterParam('api/todo/{id}/{undefinedRoute}/time/{now}', new foo2())
        } catch (error) {
            expect(error).to.equals('{undefinedRoute}: route token to be empty');
        }

    });


})
