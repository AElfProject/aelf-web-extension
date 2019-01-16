/**
 * @file apisauce
 * @author huangzongzhe
 * low-fat wrapper for the amazing axios http client library
 * apisauce: https://github.com/infinitered/apisauce
 * axios: https://github.com/axios/axios
 */
import {
    create
} from 'apisauce';
import {Toast} from 'antd-mobile';

const api = create({
    baseURL: '/',
    timeout: 10000
});

const httpErrorHandler = errMsg => {
    Toast.fail(errMsg, 3000, () => {}, false);
};

const get = async (url, params, config, hideToast = false) => {
    const res = await api.get(url, params, config);
    if (res.ok) {
        return res.data;
    }
    if (!hideToast) {
        httpErrorHandler(res.problem);
    }
    throw Error(res.problem);
};

const post = async (url, data, config, hideToast = false) => {
    const res = await api.post(url, data, config);
    if (res.ok) {
        return res.data;
    }
    if (!hideToast) {
        httpErrorHandler(res.problem);
    }
    throw Error(res.problem);
};

export default {
    get,
    post
};