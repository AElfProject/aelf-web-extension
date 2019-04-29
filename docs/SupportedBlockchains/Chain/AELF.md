# AELF

目前 NightELF 只支持 AELF。

连接到AELF的方法如下：

```javascript
    const aelf = new window.NightElf.AElf({
        // Enter your test address in this location
        httpProvider: [
            'https://127.0.0.1:8000/chain', // host
            null, // timeout
            null, // user
            null, // password
            // header
            [{
                name: 'Accept',
                value: 'text/plain;v=1.0'
            }]
        ],
        appName // your Dapp name
    });
```

