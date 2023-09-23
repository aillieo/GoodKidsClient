import { BaseModel } from "./BaseModel";
import { AppManager } from "../AppManager";
import { Property } from "../../aillieo-utils/Property";
import { Item } from "../schemas/Item";

export class ItemModel extends BaseModel {
    public readonly url: string;

    public readonly items:Property<Item[]> = new Property<Item[]>(new Array<Item>(0));

    public constructor() {
        super();
        this.url = "";
    }

    protected get baseUrl() :string {
        return AppManager.getInstance().url + "item";
    }

    public async getUser() : Promise<boolean> {
        const items = await this.session.get<Item[]>("/me");
        if (items) {
            this.items.set(items);
            return true;
        }
        return false;
    }
}
