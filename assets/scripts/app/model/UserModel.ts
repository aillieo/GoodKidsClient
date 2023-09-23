import { BaseModel } from "./BaseModel";
import { AppManager } from "../AppManager";
import { Property } from "../../aillieo-utils/Property";
import { User } from "../schemas/User";

// eslint-disable-next-line no-use-before-define
export class UserModel extends BaseModel {
    public readonly url: string;

    public readonly userData:Property<User|undefined> = new Property<User|undefined>(undefined);

    public constructor() {
        super();
        this.url = "";
    }

    protected get baseUrl() :string {
        return AppManager.getInstance().url + "user";
    }

    public async getUser() : Promise<boolean> {
        const user = await this.session.get<User>("/me");
        this.userData.set(user);
        return true;
    }
}
