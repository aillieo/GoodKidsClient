import { _decorator, Component, Node } from "cc";
import { AppManager } from "../AppManager";
import { Singleton, Singleton2 } from "../../aillieo-utils/Singleton";
const { ccclass, property } = _decorator;

export type AppData = {
    name : string,
    age : number,
    photo : string,
}

// eslint-disable-next-line no-use-before-define
export class DataManager extends Singleton2 {
    private data : AppData;

    public constructor() {
        super();
        this.data = {
            name: "a",
            age: 0,
            photo: "a"
        };
    }

    async getData() : Promise<AppData> {
        return this.data;
    }
}
