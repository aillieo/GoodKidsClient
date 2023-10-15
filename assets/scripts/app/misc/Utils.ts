import { Component, Tween, Node } from "cc";
import { UIDialogueView } from "../uiframework/UIDialogueView";
import { UIManager } from "../uiframework/UIManager";
import { UIToastView } from "../uiframework/UIToastView";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = unknown> = new (...args: any[]) => T;

export class Utils {
    public static formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    public static getStartOfDay(timeStamp: number): number {
        const date = new Date(timeStamp);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    public static getStartOfDayUTC(timeStamp: number): number {
        const date = new Date(timeStamp);
        date.setUTCHours(0, 0, 0, 0);
        return date.getTime();
    }

    public static getStartOfWeek(timeStamp: number): number {
        const date = new Date(timeStamp);
        const day = date.getDay() || 7;
        date.setHours(0, 0, 0, 0);
        const oneDay = 24 * 60 * 60 * 1000;
        return date.getTime() - (day - 1) * oneDay;
    }

    public static getStartOfWeekUTC(timeStamp: number): number {
        const date = new Date(timeStamp);
        const day = date.getUTCDay() || 7;
        date.setUTCHours(0, 0, 0, 0);
        const oneDay = 24 * 60 * 60 * 1000;
        return date.getTime() - (day - 1) * oneDay;
    }

    public static getStartOfMonth(timeStamp: number): number {
        const date = new Date(timeStamp);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }

    public static getStartOfMonthUTC(timeStamp: number): number {
        const date = new Date(timeStamp);
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        return date.getTime();
    }

    public static async pushToast(message: string): Promise<void> {
        const view: UIToastView | null = await UIManager.getInstance().open(UIToastView);
        if (view === null) {
            return;
        }

        await view.showMessage(message);
        UIManager.getInstance().close(view);
    }

    public static async alert(message: string): Promise<void> {
        const view: UIDialogueView | null = await UIManager.getInstance().open(UIDialogueView);
        if (view === null) {
            return;
        }

        await view.alert(message);
        UIManager.getInstance().close(view);
    }

    public static async ask(message: string): Promise<boolean> {
        const view: UIDialogueView | null = await UIManager.getInstance().open(UIDialogueView);
        if (view === null) {
            return false;
        }

        const result = await view.ask(message);
        UIManager.getInstance().close(view);
        return result;
    }

    public static async startTweenAsync(tween: Tween<unknown>): Promise<void> {
        return new Promise((resolve) => {
            tween.union().call(resolve).start();
        });
    }

    public static async delay<T extends Component>(time: number, comp: T): Promise<void> {
        return new Promise((resolve) => {
            comp.scheduleOnce(resolve, time);
        });
    }

    public static getOrAddComponent<T extends Component>(node: Node, classConstructor: Constructor<T>): T {
        let comp: T | null = node.getComponent(classConstructor);
        if (!comp || !comp.isValid) {
            comp = node.addComponent(classConstructor);
        }
        return comp;
    }
}
