import { debug as ccdebug, log as cclog, warn as ccwarn, error as ccerror, assert as ccassert } from "cc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = unknown> = new (...args: any[]) => T;

enum LoggerMask
{
    Debug= 1 << 0,
    Info= 1 << 1,
    Warn= 1 << 2,
    Error= 1 << 3,
    NoDebug = Info | Warn | Error,
    Everything = Debug | Info | Warn | Error,
}

export class Logger {
    // eslint-disable-next-line no-use-before-define
    private static readonly map: Map<Constructor, Logger> = new Map();

    private name : string;

    public mask : LoggerMask = LoggerMask.Debug;

    constructor(name:string) {
        this.name = name;
    }

    public static get<T>(c: Constructor<T>): Logger {
        let logger: Logger | undefined = Logger.map.get(c);
        if (!logger) {
            logger = new Logger(c.name);
            Logger.map.set(c, logger);
        }

        return logger;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public debug(...data: any[]): void {
        if ((this.mask & LoggerMask.Debug) === 0) {
            return;
        }

        ccdebug(...data);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public log(message?: any, ...optionalParams: any[]):void {
        if ((this.mask & LoggerMask.Info) === 0) {
            return;
        }

        cclog(message, ...optionalParams);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public warn(message?: any, ...optionalParams: any[]): void {
        if ((this.mask & LoggerMask.Warn) === 0) {
            return;
        }

        ccwarn(message, ...optionalParams);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public error(message?: any, ...optionalParams: any[]): void {
        if ((this.mask & LoggerMask.Error) === 0) {
            return;
        }

        ccerror(message, ...optionalParams);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public assert(value: any, message?: string, ...optionalParams: any[]): asserts value is true {
        ccassert(value, message, ...optionalParams);
    }
}
