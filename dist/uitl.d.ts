declare enum TimeUnit {
    Day = "d",
    Hour = "h",
    Minute = "m",
    Second = "s"
}
export default class TimeFormat {
    private static readonly DAY;
    private static readonly HOUR;
    private static readonly MINUTE;
    private static readonly SENCOND;
    static formatTime(time: number | string | Date): number;
    static getUnitTime(uint: TimeUnit): number;
}
export {};
