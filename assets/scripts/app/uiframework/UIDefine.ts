export interface Ctor<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): T;
}

export type UIConfig = {
    bundleName : string;
    assetName : string;
}

export function UIDefine<T>(uiCfg: UIConfig) {
    return function(target: Ctor<T>) {
        target.prototype.__uiCfg = uiCfg;
    };
}
