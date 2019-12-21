# Getting Started

By reading this document, you can quickly get started with Dapp development using NightELF.

[release version](#) coming soon

[dev version NightELF](https://chrome.google.com/webstore/detail/aelf-explorer-extension-d/mlmlhipeonlflbcclinpbmcjdnpnmkpf)

## For Users

You can skip the following and read the User use document carefully.
It will be able to help you to use NightELF.

## For Developers

### Why do you need to use NightELF?

You can quickly implement operations such as making and querying transactions on AELF through NightELF. 
You can learn how to quickly implement the transfer function by checking Examples

### Few Thoughts When We Developed NightELF

1. We want to make a browser extension that supports the aelf ecosystem.
2. This extension can satisfy Dapps’ transaction signature in the aelf ecosystem.
3. This extension itself can be used as a wallet (this feature is not being added for the time being).

### Features Which NightELF Currently Supports

1. Dapp authorization management (users can authorize Dapp's contract usage rights management).
2. Keypair creation, deletion, backup, and import.
3. Encrypted backup and import of NightELF (By exporting NightELF backup file, users can use NightELF on any computer with Chrome without re-importing their keypairs and authorization information)
4. NightELF's timing lock function (to prevent users from malicious operations after leaving)
5. READONLY (Transaction methods that do not involve user asset do not require users’ confirmation such as GetBalance)
6. Contract Whitelist (such as transaction which often used by users, users do not need to be repeatedly confirmed after being added to the whitelist)

### Project Information

We use ECDH to use public keys to encrypt data and a private key to decrypt data.
