import { BaseModel } from "./BaseModel";
import { AppManager } from "../AppManager";

// eslint-disable-next-line no-use-before-define
export class UserModel extends BaseModel {
    public readonly url: string;

    public constructor() {
        super();
        this.url = "";
    }

    protected get baseUrl() :string {
        return AppManager.getInstance().url + "user";
    }

    public async getUser() : Promise<boolean> {
        await this.session.get("");
        return true;
    }
}
