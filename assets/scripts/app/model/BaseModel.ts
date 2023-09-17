import { Session } from "../misc/Session";
import { SessionManager } from "../misc/SessionManager";

// eslint-disable-next-line no-use-before-define
export class BaseModel {
    public readonly url: string;

    public constructor() {
        this.url = "";
    }

    protected get session() : Session {
        return SessionManager.getInstance().session;
    }
}
