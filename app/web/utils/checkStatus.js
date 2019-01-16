/*
 * huangzongzhe
 * 2018.08.23
 * Description: for fetch
 */

export default function (response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}