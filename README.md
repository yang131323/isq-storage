# Storage：对sessionStorage和localStorage操作进行封装

## 快速上手
``` javascript
import { Storage, WebStorage } from '@isq/storage';

// 异步操作
Storage.setItem('test', { name: 'storage', age: 1 }).then((data) => {
    console.log('setItem success!');
    // 存储数据失败处理 
}).catch(err => {
    console.error('setItem fail!');
    // 存储数据成功处理
})

// 同步操作
const result = Storage.setItemSync('test', { name: 'storage', age: 1 });
if (result) {
    console.log('setItem success!');
    // 存储数据失败处理
} else {
    console.error('setItem fail!');
    // 存储数据成功处理
}

// 自定义自己的实例
const MyStorage = new WebStorage ({
    prefix: '__myPrefix_',
    type: 'local',
    expire: '10m'
});

MyStorage.setItem('myKey', { name: 'my' }, { expire: '3d' });

```

## 暴露接口
接口有两套，一套异步接口，一套同步接口，异步接口返回的是promise，暴露异步接口的原因：主要是为了让js线程做它更应该做的事情，详情可以见最后的内容。

**参数说明**
``` typescript
declare enum StorageType {
    Local = "local",
    Session = "session"
}

interface StorageOptions {
    type?: StorageType,
    expire?: string | number | Date,
}
```
所有方法的opts参数都是StorageOptions类型，StorageType枚举值中local表示localStorage、session表示sessionStorage；expire意思表示数据什么时候到期，因此如传入number和date实例，需要自己计算值的过期时间


### 同步接口
1. setItemSync(key, value, opts)：对应sessionStorage和localStorage的setItem，只是可以添加opts参数，通过传入type和expire参数自定义存储行为

### 异步接口
1. setItem(key, value, opts)：对应sessionStorage和localStorage的setItem，只是可以添加opts参数，通过传入参数type和expire自定义存储行为

2. getItem(key, opts)：对应sessionStorage和localStorage的getItem，只是可以添加opts参数，通过传入参数type和expire自定义取值行为

3. clear(opts): 对应sessionStorage和localStorage的clear，只是可以添加opts参数，通过传入参数type和expire自定义清除行为