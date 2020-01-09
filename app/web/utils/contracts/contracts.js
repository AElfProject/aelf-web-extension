/**
 * @file contracts.js
 * @author huangzongzhe
 * @description
 * 0.for background.js
 * 1.basic methods for key: contracts
 */

export function contractsCompare(contractA, contractB) {
    const contractATemp = JSON.parse(JSON.stringify(contractA));
    const contractBTemp = JSON.parse(JSON.stringify(contractB));
    const contractCTemp = JSON.parse(JSON.stringify(contractB));
    for (let ai = 0, aj = contractATemp.length; ai < aj; ai++) {
        for (let bi = 0, bj = contractBTemp.length; bi < bj; bi++) {
            const chainIdChecked = contractBTemp[bi].chainId === contractATemp[ai].chainId;
            const contractAddressChecked = contractBTemp[bi].contractAddress === contractATemp[ai].contractAddress;
            if (chainIdChecked && contractAddressChecked) {
                contractCTemp.splice(bi, 1);
            }
        }
    }
    return !contractCTemp.length;
}

// ignore other values like whitelist
export function formatContracts(contractsInput) {
    const contracts = JSON.parse(JSON.stringify(contractsInput));
    const contractsFormated = contracts.map(item => {
        const {
            chainId,
            contractAddress,
            contractName,
            description,
            github
        } = item;
        return {
            chainId,
            contractAddress,
            contractName,
            description,
            github
        };
    });
    return contractsFormated;
}

export function contractWhitelistCheck(options) {
    const {
        appPermissions,
        contractAddress,
        method
    } = options;
    const contractMatch = appPermissions.permissions[0].contracts.find(item => {
        if (item.contractAddress === contractAddress) {
            return true;
        }
        return false;
    });
    if (contractMatch.whitelist && contractMatch.whitelist.hasOwnProperty(method)) {
        return true;
    }
    return false;
}

export function getContractInfoWithAppPermissions(contractInfo, appPermissions) {

    let contractInfoOutput = {};
    if (!appPermissions || !appPermissions.permissions) {
        return contractInfoOutput;
    }

    const {hostname,payload} = contractInfo;
    const {contractAddress} = payload;

    appPermissions.permissions.forEach(permission => {
        if (permission.domain === hostname) {
            const { contracts } = permission;
            contracts.forEach(contract => {
                if (contract.contractAddress === contractAddress) {
                    contractInfoOutput = contract;
                }
            });
        }
    });
    return contractInfoOutput;
}
