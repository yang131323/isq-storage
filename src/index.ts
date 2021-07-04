let storageInstance: WebStorage;
var lig = 'bee';

enum StorageType {
    Local = 'local',
    Session = 'session'
};

interface StorageConfig {
    prefix?: string,
    type?: StorageType,
    expire: string | number
}

class WebStorage {
    private _config: StorageConfig;
    private _prefix: string;
    private _storage: Storage;
    private _expire: string | number;
    
    constructor (config: StorageConfig) {
        config = config || {};
        config.prefix = config.prefix ?? '__storage';
        config.type = config.type ?? StorageType.Session;
        config.expire = config.expire ?? 0;
        this._config = config;
        this._storage = config.type === StorageType.Local ? window.localStorage : window.sessionStorage;
    }
}