declare enum StorageType {
    Local = "local",
    Session = "session"
}
interface StorageOptions {
    type?: StorageType;
    expire?: string | number;
}
interface StorageConfig extends StorageOptions {
    prefix?: string;
}
export declare class WebStorage {
    private config;
    private prefix;
    private storage;
    private expire;
    constructor(config?: StorageConfig);
    setItem(key: string, value: any, opts?: StorageOptions): Promise<unknown>;
    setItemSync(key: string, value: any, opts?: StorageOptions): boolean;
    getItem(key: string, defVal?: any, opts?: StorageOptions): Promise<unknown>;
    getItemSync(key: string, defVal?: any, opts?: StorageOptions): any;
    removeItem(key: string): Promise<unknown>;
    removeItemSync(key: string, opts?: StorageOptions): boolean;
    clear(opts?: StorageOptions): Promise<unknown>;
    clearSync(opts?: StorageOptions): boolean;
    getStorage(opts: StorageOptions | undefined): Storage;
}
export declare const SessionStorage: WebStorage;
export {};
