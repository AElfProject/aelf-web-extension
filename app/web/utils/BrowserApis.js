/**
 * @file BrowserApis.js
 * @author Scatter
 */
const swallow = fn => {
    try {
        fn()
    } catch (e) {}
};

class ApiGenerator {
    constructor() {
        [
            'app',
            'storage',
            'extension',
            'runtime',
            'windows',
            'tabs',
        ]
        .map(api => {
            if (typeof chrome !== 'undefined') swallow(() => {
                if (chrome[api]) this[api] = chrome[api]
            });
            if (typeof browser !== 'undefined') swallow(() => {
                if (browser[api]) this[api] = browser[api]
            });
        });

        if (typeof browser !== 'undefined') swallow(() => {
            if (browser && browser.runtime) this.runtime = browser.runtime
        });
    }
}

export const apis = new ApiGenerator();
