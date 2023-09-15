import { HttpHelper, HttpError } from "../../aillieo-utils/HttpHelper";
import { Utils } from "./Utils";

export type LoginData = {
    username : string,
    password : string,
}

export type TokenData = {
    token : string,
    uid : number,
}

export class Session {
    public static Create(server: string) : Session {
        const session = new Session();
        session.server = server;
        return session;
    }

    private server:string|undefined;
    private token:string|undefined;
    private uid:number|undefined;
    private auth:Record<string, string>|undefined;

    public async login(username: string, password:string) : Promise<boolean> {
        try {
            const response = await HttpHelper.post<LoginData, TokenData>(
                this.server + "/login",
                { username, password });
            this.token = response.token;
            this.uid = response.uid;
            this.auth = { Authorization: `Bearer ${this.token}` };
            return true;
        } catch (e) {
            this.handleError(e);
            return false;
        }
    }

    public async register(username: string, password:string) : Promise<boolean> {
        try {
            const response = await HttpHelper.post<LoginData, TokenData>(
                this.server + "/register",
                { username, password });
            this.token = response.token;
            this.uid = response.uid;
            this.auth = { Authorization: `Bearer ${this.token}` };
            return true;
        } catch (e) {
            this.handleError(e);
            return false;
        }
    }

    public async get<R>(
        baseUrl: string,
        params?: Record<string, string>
    ): Promise<R|undefined> {
        try {
            return await HttpHelper.get<R>(this.server + baseUrl, params, this.auth);
        } catch (e) {
            this.handleError(e);
        }
    }

    public async post<T, R>(
        url: string,
        body: T
    ): Promise<R|undefined> {
        try {
            return await HttpHelper.post<T, R>(this.server + url, body, this.auth);
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(err : unknown) {
        if (err instanceof HttpError) {
            try {
                const json = JSON.parse(err.message);
                if ("detail" in json) {
                    Utils.pushToast(json.detail.toString());
                    return;
                }
            } catch {}
        }

        if (err instanceof Error) {
            Utils.pushToast(err.message);
            return;
        }

        console.error(err);
    }
}
