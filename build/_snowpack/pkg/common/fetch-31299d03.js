import '../cross-fetch/polyfill.js';

const defaultFetchOpts = {
    referrerPolicy: 'origin',
};
async function fetchWrapper(input, init) {
    const fetchOpts = {};
    Object.assign(fetchOpts, init, defaultFetchOpts);
    const fetchResult = await fetch(input, fetchOpts);
    return fetchResult;
}
function argsForCreateFetchFn(args) {
    let fetchLib = fetchWrapper;
    let middlewares = [];
    if (args.length > 0 && typeof args[0] === 'function') {
        fetchLib = args.shift();
    }
    if (args.length > 0) {
        middlewares = args;
    }
    return { fetchLib, middlewares };
}
function createFetchFn(...args) {
    const { fetchLib, middlewares } = argsForCreateFetchFn(args);
    const fetchFn = async (url, init) => {
        let fetchParams = { url, init: init ?? {} };
        for (const middleware of middlewares) {
            if (typeof middleware.pre === 'function') {
                const result = await Promise.resolve(middleware.pre({
                    fetch: fetchLib,
                    ...fetchParams,
                }));
                fetchParams = result ?? fetchParams;
            }
        }
        let response = await fetchLib(fetchParams.url, fetchParams.init);
        for (const middleware of middlewares) {
            if (typeof middleware.post === 'function') {
                const result = await Promise.resolve(middleware.post({
                    fetch: fetchLib,
                    url: fetchParams.url,
                    init: fetchParams.init,
                    response: response?.clone() ?? response,
                }));
                response = result ?? response;
            }
        }
        return response;
    };
    return fetchFn;
}

export { createFetchFn as c };
