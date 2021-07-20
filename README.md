# Storage：对sessionStorage和localStorage操作进行封装

## 解决的问题
平常我们在浏览器存储数据时需要通过localStorage和sessionStorage两个对象来操作，如果我们希望限制存储到localStorage和sessionStorage的数据是有时效的，将需要一些额外的工作量，这个库就是用来解决这两个问题的。
## 功能介绍
1. 可以对存储到localStorage和sessionStorage的数据设置有效期。
2. expire参数接受number、string、date，实际上就是接受相对时间和绝对时间。
3. 如果expire参数为number、date类型，那么认为传入的时间是数据过期的时间，例如：如果传入new Date(2021, 7, 8, 10, 10)，如果当前时间大于这个时间，则认为数据已过期，会返回默认值（可自定义，默认为null）。
4. 如果expire参数为string类型，符合`/^(\d+)([dhms]{1,1})$/i`格式则认为是相对时间，内部会进行处理，转化为绝对时间，d - 天、h - 小时、m - 分钟、 s - 秒（dhms忽略大小写），不符合该时间的一律认为是绝对时间，会用date对象处理，因此传入string类型的绝对时间，需要符合date对象格式，如果string使用date对象转化出错，将会抛出异常。
5. 默认暴露Storage实例可以直接使用，自定义实例接受一个配置对象，配置对象有type、prefix和expire三个属性，分别表示使用实例如果未传入type参数，默认使用localStorage还是sessionStorage存储数据、获取数据和清除数据；Storage实例配置：type - session、prefix - '__storage_'、expire - 0（表示没有过期时间）。

`prefix配置说明：是为了区分通过storage库存储的数据和其他操作存储的数据，至于为什么要区分，有两点原因：一是：如果多人合作在同一个域下都有存储数据，为了防止与别人的键冲突；二是：查看或者定位问题的时候，易于区分哪些数据是通过storage库处理的；`

`数据有效时间说明：库是在取值的时候校验数据有效性，如果发现过期，将会异步清除数据，不要以为库会定时去清理过期的数据，因此不要存入太多过大、存储时间长、使用频率较低的数据`

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

**创建自己的实例**
示例如下
``` javascript
import { WebStorage } from '@isq/storage';

const MyStorage = new WebStorage({
    prefix: '__my_storage_',
    expire: '10m',
    local: 'local'
})
```
无论是自己义实例还是内部暴露出来的Storage实例，都有以下方法

### 同步接口
1. setItemSync(key, value, \[opts\])：对应sessionStorage和localStorage的setItem，只是可以添加opts参数，通过传入type和expire参数自定义存储行为

2. getItemSync(key, \[defVal\], \[opts\])：对应sessionStorage和localStorage的getItem，因为存入本地存储和会话存储的数据具有时效，因此当数据过期时，可以传入一个默认值，进行兜底，防止后面的逻辑出错；如果没有传入，默认返回null；还可以添加opts参数，通过传入参数type自定义取值行为

3. clearSync(\[opts\])：对应sessionStorage和localStorage的clear，只是可以添加opts参数，通过传入参数type自定义清除行为

### 异步接口
1. setItem(key, value, \[opts\])：内部调用的是setItemSync，使用Promise封装了一下，返回Promise

2. getItem(key, \[defVal\], \[opts\])：内部调用的是getItemSync，使用Promise封装了一下，返回Promise

3. clear(\[opts\]): 内部调用的是clearSync，使用Promise封装了一下，返回Promise

## 额外话题
网上有说往sessionStorage和localStorage读写写大量数据时，会有性能问题；个人觉得往sessionStorage和localStorage读写数据的时间基本可以忽略，至于有没有性能问题，直接看数据吧：
![storage写性能测试-1.jpg](https://i.loli.net/2021/07/19/vUA64pLRSjDnGON.jpg)

![storage写性能测试-2.jpg](https://i.loli.net/2021/07/19/W8efihgGsJdpQVE.jpg)

![storage写性能测试-3.jpg](https://i.loli.net/2021/07/19/sL8wkcY1bQxo2aE.jpg)

上面三张图表示对localStorage和sessionStorage写入1-5M数据50次的结果，带有__前缀的表示这五十次的平均值，没有前缀的表示这50写操作的总耗时，后面的数字表示写入数据的大小，可以看出写入5m数据也仅仅30ms左右，这对用户来说几乎无感知，而localStorage和sessionStorage能存储数据的大小也就5M左右，所以几乎不用担心读写数据性能问题；

这里只做了写数据测试，没有做读数据测试，个人觉得应该都差不多，有兴趣的可以去验证一下，读测试代码在库的storageTest目录下，可以拉下去改改就能测试读性能测试了；建议使用performanced对象来计算时间，精确性比console.time高。