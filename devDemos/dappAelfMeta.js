const aelfMetaDemo = [{
    "appName": "hzzTest",
    "hostname": "OnlyForTest!!!",
    "httpProvider": "http://192.168.197.70:8001/chain",
    "chainId": "AELF",
    "aelf": {
        "_requestManager": {
            "provider": {
                "host": "http://192.168.197.70:8001/chain",
                "timeout": 0
            },
            "polls": {},
            "timeout": null
        },
        "currentProvider": {
            "host": "http://192.168.197.70:8001/chain",
            "timeout": 0
        },
        "chain": {
            "_requestManager": {
                "provider": {
                    "host": "http://192.168.197.70:8001/chain",
                    "timeout": 0
                },
                "polls": {},
                "timeout": null
            },
            "_initialized": false
        },
        "settings": {},
        "version": {
            "api": "1.1.14"
        },
        "providers": {}
    },
    "contracts": [{
        "address": "ELF_4WBgSL2fSem9ABD4LLZBpwP8eEymVSS1AyTBCqXjt5cfxXK",
        "contractName": "token",
        "contractAddress": "ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx",
        "contractMethods": {
            "_chain": {
                "_requestManager": {
                    "provider": {
                        "host": "http://192.168.197.70:8001/chain",
                        "timeout": 0
                    },
                    "polls": {},
                    "timeout": null
                },
                "_initialized": false
            },
            "transactionHash": null,
            "address": "ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx",
            "abi": {
                "Name": "AElf.Contracts.Token.TokenContract",
                "Methods": [{
                    "Name": "Symbol",
                    "ReturnType": "string",
                    "IsView": true
                }, {
                    "Name": "TokenName",
                    "ReturnType": "string",
                    "IsView": true
                }, {
                    "Name": "TotalSupply",
                    "ReturnType": "ulong",
                    "IsView": true
                }, {
                    "Name": "Decimals",
                    "ReturnType": "uint",
                    "IsView": true
                }, {
                    "Name": "BalanceOf",
                    "Params": [{
                        "Type": "AElf.Common.Address",
                        "Name": "owner"
                    }],
                    "ReturnType": "ulong",
                    "IsView": true
                }, {
                    "Name": "Allowance",
                    "Params": [{
                        "Type": "AElf.Common.Address",
                        "Name": "owner"
                    }, {
                        "Type": "AElf.Common.Address",
                        "Name": "spender"
                    }],
                    "ReturnType": "ulong",
                    "IsView": true
                }, {
                    "Name": "ChargedFees",
                    "Params": [{
                        "Type": "AElf.Common.Address",
                        "Name": "address"
                    }],
                    "ReturnType": "ulong",
                    "IsView": true
                }, {
                    "Name": "FeePoolAddress",
                    "ReturnType": "AElf.Common.Address",
                    "IsView": true
                }, {
                    "Name": "Initialize",
                    "Params": [{
                        "Type": "string",
                        "Name": "symbol"
                    }, {
                        "Type": "string",
                        "Name": "tokenName"
                    }, {
                        "Type": "ulong",
                        "Name": "totalSupply"
                    }, {
                        "Type": "uint",
                        "Name": "decimals"
                    }],
                    "ReturnType": "void"
                }, {
                    "Name": "SetFeePoolAddress",
                    "Params": [{
                        "Type": "AElf.Common.Address",
                        "Name": "address"
                    }],
                    "ReturnType": "void"
                }, {
                    "Name": "Transfer",
                    "Params": [{
                        "Type": "AElf.Common.Address",
                        "Name": "to"
                    }, {
                        "Type": "ulong",
                        "Name": "amount"
                    }],
                    "ReturnType": "void"
                }, {
                    "Name": "TransferFrom",
                    "Params": [{
                        "Type": "AElf.Common.Address",
                        "Name": "from"
                    }, {
                        "Type": "AElf.Common.Address",
                        "Name": "to"
                    }, {
                        "Type": "ulong",
                        "Name": "amount"
                    }],
                    "ReturnType": "void"
                }, {
                    "Name": "Approve",
                    "Params": [{
                        "Type": "AElf.Common.Address",
                        "Name": "spender"
                    }, {
                        "Type": "ulong",
                        "Name": "amount"
                    }],
                    "ReturnType": "void"
                }, {
                    "Name": "UnApprove",
                    "Params": [{
                        "Type": "AElf.Common.Address",
                        "Name": "spender"
                    }, {
                        "Type": "ulong",
                        "Name": "amount"
                    }],
                    "ReturnType": "void"
                }, {
                    "Name": "Burn",
                    "Params": [{
                        "Type": "ulong",
                        "Name": "amount"
                    }],
                    "ReturnType": "void"
                }, {
                    "Name": "ChargeTransactionFees",
                    "Params": [{
                        "Type": "ulong",
                        "Name": "feeAmount"
                    }],
                    "ReturnType": "void"
                }, {
                    "Name": "ClaimTransactionFees",
                    "Params": [{
                        "Type": "ulong",
                        "Name": "height"
                    }],
                    "ReturnType": "void"
                }],
                "Events": [{
                    "Name": "AElf.Contracts.Token.Transfered",
                    "NonIndexed": [{
                        "Type": "AElf.Common.Address",
                        "Name": "From"
                    }, {
                        "Type": "AElf.Common.Address",
                        "Name": "To"
                    }, {
                        "Type": "ulong",
                        "Name": "Amount"
                    }]
                }, {
                    "Name": "AElf.Contracts.Token.Approved",
                    "NonIndexed": [{
                        "Type": "AElf.Common.Address",
                        "Name": "Owner"
                    }, {
                        "Type": "AElf.Common.Address",
                        "Name": "Spender"
                    }, {
                        "Type": "ulong",
                        "Name": "Amount"
                    }]
                }, {
                    "Name": "AElf.Contracts.Token.UnApproved",
                    "NonIndexed": [{
                        "Type": "AElf.Common.Address",
                        "Name": "Owner"
                    }, {
                        "Type": "AElf.Common.Address",
                        "Name": "Spender"
                    }, {
                        "Type": "ulong",
                        "Name": "Amount"
                    }]
                }, {
                    "Name": "AElf.Contracts.Token.Burned",
                    "NonIndexed": [{
                        "Type": "AElf.Common.Address",
                        "Name": "Burner"
                    }, {
                        "Type": "ulong",
                        "Name": "Amount"
                    }]
                }]
            }
        }
    }]
}]