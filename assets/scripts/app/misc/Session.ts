import { HttpHelper, HttpError } from "../../aillieo-utils/HttpHelper";
import { Login } from "../schemas/Login";
import { Token } from "../schemas/Token";
import { Utils } from "./Utils";

export class Session {
    public static create(server: string): Session {
        const session = new Session();
        session.server = server;
        return session;
    }

    private server: string | undefined;
    private token: string | undefined;
    private uid: number | undefined;
    private auth: Record<string, string> | undefined;

    public async login(username: string, password: string): Promise<boolean> {
        try {
            const response = await HttpHelper.post<Login, Token>(
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

    public async register(username: string, password: string): Promise<boolean> {
        try {
            const response = await HttpHelper.post<Login, Token>(
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
    ): Promise<R | undefined> {
        try {
            return await HttpHelper.get<R>(this.server + baseUrl, params, this.auth);
        } catch (e) {
            this.handleError(e);
        }
    }

    public async post<T, R>(
        url: string,
        body: T
    ): Promise<R | undefined> {
        try {
            return await HttpHelper.post<T, R>(this.server + url, body, this.auth);
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(err: unknown) {
        if (err instanceof HttpError) {
            try {
                const json = JSON.parse(err.message);
                if ("detail" in json) {
                    Utils.pushToast(json.detail.toString());
                    return;
                }
            } catch { }
        }

        if (err instanceof Error) {
            Utils.pushToast(err.message);
            return;
        }

        console.error(err);
    }
}
