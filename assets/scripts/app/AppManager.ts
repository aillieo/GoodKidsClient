import { _decorator, Component, Node } from "cc";
import { Singleton } from "../aillieo-utils/Singleton";
import { Property } from "../aillieo-utils/Property";

const { ccclass, property } = _decorator;

@ccclass("NewComponent")

// eslint-disable-next-line no-use-before-define
export class AppManager extends Singleton<AppManager> {

    private score : Property<number>;

    constructor() {
        super();
        this.score = new Property<number>(0);
    }

    public getData() : Property<number> {
        return this.score;
    }
}
