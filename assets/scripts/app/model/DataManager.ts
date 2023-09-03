import { _decorator, Component, Node } from "cc";
import { AppManager } from "../AppManager";
import { Singleton } from "../../aillieo-utils/Singleton";
import { HttpHelper } from "../../aillieo-utils/HttpHelper";
const { ccclass, property } = _decorator;

export type AppData = {
    name : string,
    age : number,
    photo : string,
}

export type UserData = {
    name : string,
}

export type LoginData = {
    name : string,
    password : string,
}

// eslint-disable-next-line no-use-before-define
export class DataManager extends Singleton<DataManager>() {
    private data : AppData;

    protected constructor() {
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

    async getUserData() : Promise<UserData> {
        const login = {
            name : "test",
            password : "test",
        };
        return HttpHelper.Post<LoginData, UserData>("http://127.0.0.1:8000/login", login);
    }
}
