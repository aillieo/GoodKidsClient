import { AppManager } from "../AppManager";
import { Singleton } from "../../aillieo-utils/Singleton";
import { Session } from "../misc/Session";
import { Property } from "../../aillieo-utils/Property";

export type UserData= {
    username :string;
}

// eslint-disable-next-line no-use-before-define
export class DataManager extends Singleton<DataManager>() {
    public readonly session:Session |undefined;

    protected constructor() {
        super();
        const url = AppManager.getInstance().url;
        this.session = Session.Create(url);
    }

    public readonly userData:Property<UserData|undefined> = new Property<UserData|undefined>(undefined);

    async getUserData(u:string, p:string, isReg:boolean) : Promise<boolean> {
        if (isReg) {
            return this.session!.register(u, p);
        } else {
            return this.session!.login(u, p);
        }
    }
}
