import { _decorator, Component, Node, Label, log, Button, EditBox } from "cc";
import { Binder } from "../../aillieo-utils/Binder";
import { Property } from "../../aillieo-utils/Property";
import { BasePage } from "../main/BasePage";
import { AppData, DataManager, TokenData, UserData } from "../model/DataManager";
import { HttpHelper } from "../../aillieo-utils/HttpHelper";
const { ccclass, property } = _decorator;

@ccclass("PageProfile")
export class PageProfile extends BasePage {
    @property(Label)
        labelName: Label|null = null;

    @property(Label)
        labelScore: Label|null = null;

    @property(EditBox)
        editBoxName: EditBox|null = null;

    @property(EditBox)
        editBoxPassword: EditBox|null = null;

    @property(Button)
        buttonLogin: Button|null = null;

    @property(Button)
        buttonRegister: Button|null = null;

    protected onEnable(): void {
        super.onEnable();

        this.editBoxName!.string = localStorage.getItem("username") || "";
        this.editBoxPassword!.string = localStorage.getItem("password") || "";

        const that = this;
        this.binder.BindV_ButtonClick(this.buttonRegister!, () => that.onRegisterClick());
        this.binder.BindV_ButtonClick(this.buttonLogin!, () => that.onLoginClick());
    }

    protected onDisable():void {
        this.binder.clear();
    }

    private async loadData(isReg:boolean) {
        const dm : DataManager = DataManager.getInstance();

        const u:string = this.editBoxName!.string;
        const p:string = this.editBoxPassword!.string;

        const data : TokenData = await dm.getUserData(u, p, isReg);
        console.log(data);
    }

    private onRegisterClick():void {
        localStorage.setItem("username", this.editBoxName!.string);
        localStorage.setItem("password", this.editBoxPassword!.string);

        console.log(this);

        this.loadData(true);
    }

    private onLoginClick():void {
        localStorage.setItem("username", this.editBoxName!.string);
        localStorage.setItem("password", this.editBoxPassword!.string);

        console.log(this);

        this.loadData(false);
    }
}
