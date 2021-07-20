enum TimeUnit {
    Day = 'd',
    Hour = 'h',
    Minute = 'm',
    Second = 's',
}

export default class TimeFormat {
    private static readonly DAY: 86400000;

    private static readonly HOUR: 3600000;

    private static readonly MINUTE: 60000;

    private static readonly SENCOND: 1000;

    static formatTime(time: number | string | Date): number {
        let result;
        const timeReg = /(\d+)([dhms]{1,1})/i;
        try {
            if (typeof time === 'string' && timeReg.test(time)) {
                const now = Date.now();
                const originTime = time.trim().toLowerCase();
                const match = originTime.match(timeReg);
                const timeUnit = TimeFormat.getUnitTime(<TimeUnit>(match && match[2]));
                const num = Number((match && match[1]) || 1);
                result = now + (timeUnit * num);
            } else if (typeof time === 'string') {
                result = new Date(time).getTime();
            } else if (typeof time === 'number') {
                result = time;
            } else {
                result = time.getTime();
            }
        } catch (err) {
            throw new Error(`'setItem' or 'setItemSync' expire argument has error, expire: ${time}`);
        }
        return result;
    }

    static getUnitTime(uint: TimeUnit): number {
        switch (uint) {
            case TimeUnit.Day:
                return TimeFormat.DAY;
            case TimeUnit.Hour:
                return TimeFormat.HOUR;
            case TimeUnit.Minute:
                return TimeFormat.MINUTE;
            default:
                return TimeFormat.SENCOND;
        }
    }
}
