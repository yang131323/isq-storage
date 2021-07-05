let storageInstance: WebStorage;

enum StorageType {
    Local = 'local',
    Session = 'session',
}

interface StorageOptions {
    prefix?: string,
    type?: StorageType,
    expire: string | number,
}

class WebStorage {
    private config: StorageOptions;

    private prefix: string;

    private storage: Storage;

    private expire: string | number;

    /**
     * @constructor WebStorage
     * webStorage封装配置初始化
     * @param {StorageOptions} config - Storage配置
     */
    constructor(config: StorageOptions) {
        if (storageInstance) return storageInstance;
        const tempConfig = { ...config };
        tempConfig.prefix = config.prefix ?? '__storage';
        tempConfig.type = config.type ?? StorageType.Session;
        tempConfig.expire = config.expire ?? 0;
        this.config = tempConfig;
        this.prefix = tempConfig.prefix;
        this.expire = tempConfig.expire;
        this.storage = tempConfig.type === StorageType.Local ? window.localStorage : window.sessionStorage;
        storageInstance = this;
    }

    setItem (key: string, value: any, opts?: StorageOptions) {

    }

    setItemSync (key: string, value: any, opts?: StorageOptions) {

    }

    getItem () {

    }

    getItemSync () {

    }

    removeItem () {

    }

    removeItemSync () {

    }

    clear () {

    }

    formatExpire () {

    }
}
