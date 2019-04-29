# GET_ADDRESS / getAddress

```javascript
    aelf.getAddress({
        appName: 'test'
    }, (error, result) => {
        console.log('>>>>>>>>>>>>>>>>>>>', result);
    });

    // result = {
    //     ...,
    //     addressList: [
    //         {
    //             address: '...',
    //             name: '...',
    //             publicKey: {
    //                 x: '...',
    //                 y: '...'
    //             }
    //         }
    //     ]
    // }
```