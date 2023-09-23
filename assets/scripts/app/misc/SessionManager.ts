import { AppManager } from "../AppManager";
import { Singleton } from "../../aillieo-utils/Singleton";
import { Session } from "../misc/Session";

// eslint-disable-next-line no-use-before-define
export class SessionManager extends Singleton<SessionManager>() {
    public readonly session:Session;

    protected constructor() {
        super();
        const url = AppManager.getInstance().url;
        this.session = Session.Create(url);
    }

    async login(username:string, password:string, isReg:boolean) : Promise<boolean> {
        if (isReg) {
            return this.session!.register(username, password);
        } else {
            return this.session!.login(username, password);
        }
    }
}
