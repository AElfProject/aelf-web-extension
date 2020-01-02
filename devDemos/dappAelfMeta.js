const aelfMetaNewDemo = {
    "keychain": {
        "keypairs": [{
                "name": "1111",
                "address": "ELF_5E85xxqccciycENmu4azsX47pyszNm2eZRGpWMQjfASuSZv",
                "mnemonic": "ten misery release transfer limit caught subway obvious axis meadow spare cake",
                "privateKey": "4f49fb219d7b562063e1a251d8d1d07196aebbfdebdb7eb12a2de8de58f34361",
                "publicKey": {
                    "x": "727eae295373d2dd4c1fd8539353320c9761255659c525d9e53173c0f5b90400",
                    "y": "301afb37e2424154fda05943be7b59ad3f8e005f72ccec91bc12dcc35df41203"
                }
            },
            {
                "name": "Hzz",
                "address": "ELF_34PXaE15ek534fMJT3fChx4R46BN5ppxjn9bvcHamT8SqiA",
                "mnemonic": "warrior deposit long bacon modify spike diary margin sunny tip solution ignore",
                "privateKey": "917b844c636ef92c6421d085ba2b1f41cee08f2a9ff76f91a610cd5040d9b7f8",
                "publicKey": {
                    "x": "a1fcc7e4e8f1919462a7d4095ec049ea59e26b4c2b185d102cd941f86cffc4c7",
                    "y": "5dab6d42edaedc0646c083b6785fedf86b08cfbe33e66f3bcf502a5a01aa313c"
                }
            }
        ],
        "permissions": [{
                // https://github.com/hzz780/aelf-web-extension/tree/master/app/web/langConfig
                // "appName": "hzzTest",
                // if input value is string, set { default: string }.
                // else, set input string.
                // and the default value will be the key.
                "appName": {
                    default: 'hzzTest',
                    'zh-CN': 'xxx'
                },
                "domain": "OnlyForTest!!!",
                // address对应 登录权限。
                // 如果address为空，则无登录权限。
                "address": "ELF_5E85xxqccciycENmu4azsX47pyszNm2eZRGpWMQjfASuSZv",
                "contracts": [{
                        "chainId": "AELF",
                        "contractAddress": "ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9",
                        "contractName": "token",
                        // "description": "token contract",
                        // if input value is string, set { default: string }.
                        // else, set input string.
                        "description": {
                            default: 'token contract',
                            'zh-CN': '通令合约'
                        },
                        "github": "",
                        "whitelist": {
                            // transfer(a, b, c)
                            // transfer(a, b, c, d) is not ok
                            transfer: [{
                                value: 'a',
                                variable: true
                            }, {
                                value: 'b',
                                variable: false
                            }, {
                                value: 'c',
                                variable: true
                            }]
                        }
                    },
                    {
                        "chainId": "AELF",
                        "contractAddress": "ELF_4CBbRKd6rkCzTX5aJ2mnGrwJiHLmGdJZinoaVfMvScTEoBR",
                        "contractName": "resource",
                        "description": "resource contract",
                        "github": ""
                    }
                ]
            },
            // 仅仅只是登录授权的情况。
            {
                "appName": {
                    default: 'hzzTest',
                    'zh-CN': 'xxx'
                },
                "domain": "OnlyForTest!!!",
                // address对应 登录权限。
                // 如果address为空，则无登录权限。
                "address": "ELF_5E85xxqccciycENmu4azsX47pyszNm2eZRGpWMQjfASuSZv",
                "contracts": []
            },
            {
                "appName": "hzzTest",
                "domain": "OnlyForTest!!!",
                "address": "ELF_4yCJfobjm2YAdxGrwACQihpa3TMz1prDTdYiWTvFTvefQFs",
                "contracts": [{
                        "chainId": "AELF",
                        "contractAddress": "ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx",
                        "contractName": "token",
                        "description": "token contract",
                        "github": ""
                    },
                    {
                        "chainId": "AELF TEST",
                        "contractAddress": "TEST contractAddress",
                        "contractName": "TEST contractName",
                        "description": "contract description",
                        "github": ""
                    }
                ]
            }
        ]
    },
    "histories": []
};
