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
    username : string,
    password : string,
}

export type TokenData = {
    token : string,
    uid : number,
}

// eslint-disable-next-line no-use-before-define
export class DataManager extends Singleton<DataManager>() {
    private data : AppData;

    private token : string|undefined;
    private uid : number|undefined;

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

    async getUserData(u:string, p:string, isReg:boolean) : Promise<TokenData> {
        const login = {
            username: u,
            password: p
        };

        const url = AppManager.getInstance().url;
        const fullURL = isReg ? (url + "/register") : (url + "/login");
        const tokenData = await HttpHelper.Post<LoginData, TokenData>(fullURL, login);

        this.uid = tokenData.uid;
        this.token = tokenData.token;

        return tokenData;
    }

    async getDailyTasks() : Promise<object> {
        const url = AppManager.getInstance().url;
        return HttpHelper.Get<object>(url + "/dailytask/", {
        }, {
            Authorization: `Bearer ${this.token}`
        });
    }

    async createTask() : Promise<object> {
        const url = AppManager.getInstance().url;
        return HttpHelper.Post<object, object>(url + "/dailytask/", {
            taskName: "abc",
            taskDes: "desc"
        }, {
            Authorization: `Bearer ${this.token}`
        });
    }
}
