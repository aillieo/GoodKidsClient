import { assetManager, AssetManager, SpriteFrame, Asset, Prefab, instantiate, Node, Tween, tween, Vec3 } from "cc";
import { UIDialogueView } from "../uiframework/UIDialogueView";
import { UIManager } from "../uiframework/UIManager";
import { UIToastView } from "../uiframework/UIToastView";

export class Utils {
    public static async loadRes<T extends Asset>(name:string) : Promise<T> {
        return new Promise((resolve, reject) => {
            assetManager.loadAny<T>(name, (err, resAsset) => {
                err && reject(err);
                resolve(resAsset);
            });
        });
    }

    public static async loadBundle(name:string) : Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(name, (err, data) => {
                err && reject(err);
                resolve(data);
            });
        });
    }

    public static async loadSpriteFrame(bundleName:string, assetName:string) : Promise<SpriteFrame> {
        let bundle = assetManager.getBundle(bundleName);
        if (bundle == null) {
            bundle = await this.loadBundle(bundleName);
        }

        return new Promise((resolve, reject) => {
            bundle?.load(assetName, SpriteFrame, (err, data) => {
                err && reject(err);
                resolve(data);
            });
        });
    }

    public static async loadPrefab(bundleName:string, assetName:string) : Promise<Node> {
        let bundle = assetManager.getBundle(bundleName);
        if (bundle == null) {
            bundle = await this.loadBundle(bundleName);
        }

        return new Promise((resolve, reject) => {
            bundle?.load(assetName, Prefab, (err, data) => {
                err && reject(err);
                const node : Node = instantiate(data);
                resolve(node);
            });
        });
    }

    public static formatTime(timestamp:number) : string {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    public static getStartOfDay(timeStamp:number) : number {
        const date = new Date(timeStamp);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    public static getStartOfDayUTC(timeStamp:number) : number {
        const date = new Date(timeStamp);
        date.setUTCHours(0, 0, 0, 0);
        return date.getTime();
    }

    public static getStartOfWeek(timeStamp:number) : number {
        const date = new Date(timeStamp);
        const day = date.getDay() || 7;
        date.setHours(0, 0, 0, 0);
        const oneDay = 24 * 60 * 60 * 1000;
        return date.getTime() - (day - 1) * oneDay;
    }

    public static getStartOfWeekUTC(timeStamp:number) : number {
        const date = new Date(timeStamp);
        const day = date.getUTCDay() || 7;
        date.setUTCHours(0, 0, 0, 0);
        const oneDay = 24 * 60 * 60 * 1000;
        return date.getTime() - (day - 1) * oneDay;
    }

    public static getStartOfMonth(timeStamp:number) : number {
        const date = new Date(timeStamp);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    public static getStartOfMonthUTC(timeStamp:number) : number {
        const date = new Date(timeStamp);
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        return date.getTime();
    }

    public static async pushToast(message:string) : Promise<void> {
        const view : UIToastView|null = await UIManager.getInstance().open(UIToastView);
        if (view === null) {
            return;
        }

        await view.showMessage(message);
        UIManager.getInstance().close(view);
    }

    public static async alert(message:string) : Promise<void> {
        const view : UIDialogueView|null = await UIManager.getInstance().open(UIDialogueView);
        if (view === null) {
            return;
        }

        await view.alert(message);
        UIManager.getInstance().close(view);
    }

    public static async ask(message:string) : Promise<boolean> {
        const view : UIDialogueView|null = await UIManager.getInstance().open(UIDialogueView);
        if (view === null) {
            return false;
        }

        const result = await view.ask(message);
        UIManager.getInstance().close(view);
        return result;
    }

    public static async startTweenAsync(tween: Tween<unknown>): Promise<void> {
        return new Promise((resolve, reject) => {
            tween.union().call(resolve).start();
        });
    }
}
