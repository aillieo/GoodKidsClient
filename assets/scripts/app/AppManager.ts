import { _decorator, Component, Node } from "cc";
import { Singleton } from "../aillieo-utils/Singleton";
import { Property } from "../aillieo-utils/Property";

const { ccclass, property } = _decorator;

// eslint-disable-next-line no-use-before-define
export class AppManager extends Singleton<AppManager>() {
    public url : string = "http://127.0.0.1:8000";
}
