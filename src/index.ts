import TimeFormat from './uitl';

enum StorageType {
    Local = 'local',
    Session = 'session',
}

interface StorageValue {
    exp: number,
    v: any,
}

interface StorageOptions {
    type?: StorageType,
    expire?: string | number | Date,
}
interface StorageConfig extends StorageOptions {
    prefix?: string,
}

/** 浏览器web存储对象封装 */
export class WebStorage {
    private config: StorageConfig;

    private prefix: string;

    private storage: Storage;

    private expire: string | number | Date;

    constructor(config?: StorageConfig) {
        const tempConfig = config || {};
        tempConfig.prefix = tempConfig.prefix ?? '__storage_';
        tempConfig.type = tempConfig.type ?? StorageType.Session;
        tempConfig.expire = tempConfig.expire ?? 0;
        this.config = tempConfig;
        this.prefix = tempConfig.prefix;
        this.expire = tempConfig.expire;
        this.storage = tempConfig.type === StorageType.Local ? window.localStorage : window.sessionStorage;
    }

    /** 异步设置数据到web缓存 */
    setItem(key: string, value: any, opts?: StorageOptions) {
        return new Promise((resolve) => {
            resolve(this.setItemSync(key, value, opts));
        });
    }

    /** 同步设置数据到web缓存 */
    setItemSync(key: string, value: any, opts?: StorageOptions) {
        if (!key || !value) throw Error('need "key" and "value" arguments');
        try {
            const storage = this.getStorage(opts);
            const originExpire = (opts && opts.expire) || this.expire;
            const expire = TimeFormat.formatTime(originExpire);
            const target = {
                exp: expire,
                v: value,
            };
            storage.setItem(`${this.prefix}${key}`, JSON.stringify(target));
            return true;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('setItem fail, error message: ', e.message);
            return false;
        }
    }

    /** 异步从web缓存获取数据 */
    getItem(key: string, defVal?: any, opts?: StorageOptions) {
        return new Promise((resolve) => {
            resolve(this.getItemSync(key, defVal, opts));
        });
    }

    /** 同步从web缓存获取数据 */
    getItemSync(key: string, defVal?: any, opts?: StorageOptions) {
        if (!key) throw Error('need "key" argument');
        defVal = defVal || null;
        const realKey = `${this.prefix}${key}`;
        try {
            const storage = this.getStorage(opts);
            const now = Date.now();
            const v = storage.getItem(realKey) || '';
            const val = <StorageValue>JSON.parse(v);
            let result;
            if (val.exp && val.exp > now) {
                result = val.v ?? defVal;
            } else {
                result = defVal;
                setTimeout(() => {
                    this.removeItem(key);
                });
            }
            return result;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('getItem fail, error message: ', e.message);
            return defVal;
        }
    }

    /** 异步从web缓存删除数据 */
    removeItem(key: string) {
        return new Promise((resolve) => {
            resolve(this.removeItemSync(key));
        });
    }

    /** 同步从web缓存删除数据 */
    removeItemSync(key: string, opts?: StorageOptions) {
        if (!key) throw Error('need "key" argument');
        const realKey = `${this.prefix}${key}`;
        try {
            const storage = this.getStorage(opts);
            storage.removeItem(realKey);
            return true;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('removeItem fail, error message: ', e.message);
            return false;
        }
    }

    /** 异步清除web缓存所有数据 */
    clear(opts?: StorageOptions) {
        return new Promise((resolve) => {
            resolve(this.clearSync(opts));
        });
    }

    /** 同步清除web缓存所有数据 */
    clearSync(opts?: StorageOptions) {
        const storage = this.getStorage(opts);
        try {
            storage.clear();
            return true;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('clear fail, error message: ', e.message);
            return false;
        }
    }

    getStorage(opts: StorageOptions | undefined): Storage {
        let storage = this.storage;
        if (opts && opts.type) {
            storage = opts.type === StorageType.Local ? window.localStorage : window.sessionStorage;
        }
        return storage;
    }
}

export const Storage = new WebStorage();
