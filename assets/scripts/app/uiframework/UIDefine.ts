// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = unknown> = new (...args: any[]) => T;

export type UIConfig = {
    bundleName : string;
    assetName : string;
}

export function UIDefine<T>(uiCfg: UIConfig) {
    return function(target: Constructor<T>) {
        target.prototype.__uiCfg = uiCfg;
    };
}
