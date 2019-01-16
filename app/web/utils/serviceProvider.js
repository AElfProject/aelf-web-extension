/*
 * huangzongzhe,hzz780
 * 2018.11.15
 * Beijing IFC
 */
const key = 'serviceProvider';

function getProvider() {
    const providerInLocal = localStorage.getItem(key);
    const defaultProvider = window.defaultConfig.httpProvider;

    let provider = providerInLocal || defaultProvider;
    provider = /http/.test(provider) ? provider
        : `${window.location.protocol}//${window.location.host}${provider}`;

    return provider;
}

function getDefaultProvider() {

    let provider = window.defaultConfig.httpProvider;
    provider = /http/.test(provider) ? provider
        : `${window.location.protocol}//${window.location.host}${provider}`;

    return provider;
}

function setProvider(newProvider) {
    localStorage.setItem(key, newProvider);
}

export default {
    getProvider,
    getDefaultProvider,
    setProvider
}