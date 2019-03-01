/**
 * @file permission.js
 * @author huangzongzhe
 */

export function getApplicationPermssions(permissions, domain) {
    const indexList = [];
    const permissionsTemp = permissions.filter((permission, index) => {
        const domainCheck = permission.domain === domain;
        if (domainCheck) {
            indexList.push(index);
            return true;
        }
        return false;
    });
    return {
        permissions: JSON.parse(JSON.stringify(permissionsTemp)),
        indexList
    };
}
