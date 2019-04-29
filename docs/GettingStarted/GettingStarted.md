# Getting Started

通过阅读本文档，可以使你快速上手使用 NightELF 进行 Dapp 开发。

[release version](#)  等候发布......

[dev version NightELF](https://chrome.google.com/webstore/detail/aelf-explorer-extension-d/mlmlhipeonlflbcclinpbmcjdnpnmkpf)

## 如果你是普通用户

你可以直接略过以下内容，并仔细阅读 [User use document](../User/User.md)。

这会让你了解作为一名用户如何使用 NightELF 进行一些日常操作。

## 如果你是开发者

### 为什么要使用NightELF

通过 NightELF 可以帮助你快速实现AELF的转账、查询等操作。使你可以更加专注Dapp开发。

你可以通过查看 [Examples](../Examples/Examples.md) 了解如何快速实现转账功能


### 我们在开发 NightELF 时的一些想法

1. 我们要做一个支持AELF生态的浏览器扩展应用。
2. 这个扩展应用可以满足生态内的Dapp的交易签名。
3. 扩展应用本身可以当做一个钱包来使用（暂时未添加该功能）。

### 目前NightELF支持的功能

1. Dapp 的授权管理 （用户授权Dapp的合约使用权限管理）。
2. keypair 的创建、删除、备份、导入。
3. NightELF 的加密备份与导入。（通过导出NightELF备份文件，用户可以在任意一台装有Chrome浏览器的电脑上使用NightELF 而无需重新导入每一个keypair与授权信息）
4. NightELF 的定时锁定功能（防止用户离开后被恶意操作）
5. READONLY (不涉及到用户资产交易的方法无需用户确认信息 如 GetBalance)
6. 合约白名单 (如用户经常用到的Transfer 加入白名单后无需反复确认)

### Project Information
We use [ECDH](https://github.com/indutny/elliptic) to use public key to encryt data and private key to decrypt data.