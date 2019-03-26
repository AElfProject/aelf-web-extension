/**
 * @file diffPermissions.js
 * @author zhouminghui
*/



export default function diffPermissions(oldPermissions, newPermissions) {
    if (oldPermissions && newPermissions) {
        let removePermissions = oldPermissions;
        let addPermissions = [];
        for (let i = 0, len = newPermissions.length; i < len; i++) {
            let unconverter = false;
            for (let j = 0, len = oldPermissions.length; j < len; j++) {
                if (JSON.stringify(newPermissions[i]) === JSON.stringify(oldPermissions[j])) {
                    unconverter = true;
                    removePermissions.splice(j, 1);
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
