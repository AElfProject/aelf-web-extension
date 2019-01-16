/**
 * @file addressCheck.js
 * @author huangzongzhe
 * 2018.12.13
 */

export default function addressCheck(address = '', options = {
    compareToUse: true
}) {
    let output = {
        ready: true,
        message: ''
    };

    // TODO: May Change again.
    const length = address.length;
    if (length <= 53 && length >= 49 && address.match(/^ELF_/)) {

        // 业务功能
        let addressUse = JSON.parse(localStorage.getItem('lastuse')).address;
        if (address === addressUse && options.compareToUse) {
            output.ready = false;
            output.message = 'Address and current wallet are the same.';
            return output;
        }

        output.ready = true;
        return output;
    }
    output.ready = false;
    output.message = 'error address';
    return output;
}

