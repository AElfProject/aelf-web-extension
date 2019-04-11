/**
 * @file diffPermissions.js
 * @author zhouminghui
 * @description diff permission
 *
*/

/**
 *
 * @property diffPermissions
 *
 * @param {object} oldPermissions
 * @param {object} newPermissions
 *
*/


export default function diffPermissions(oldPermissions, newPermissions) {
    if (oldPermissions && newPermissions) {
        let removePermissions = oldPermissions;
        let addPermissions = [];
        for (let i = 0, len = newPermissions.length; i < len; i++) {
            let unconverter = false;
            for (let j = 0, len = oldPermissions.length; j < len; j++) {

                // The same contract with different white lists Direct skip
                if (JSON.stringify(oldPermissions[j]).includes('whitelist')) {
                    continue;
                }
                if (JSON.stringify(newPermissions[i]) === JSON.stringify(oldPermissions[j])) {
                    unconverter = true;
                    removePermissions.splice(j, 1);
                    console.log('>>>>>>>>>>>>>>>>>>>>>removePermissions', removePermissions);
                }
            }

            if (!unconverter) {
                addPermissions.push(newPermissions[i]);
            }
        }

        return {
            removePermissions,
            addPermissions
        };
    }
}
