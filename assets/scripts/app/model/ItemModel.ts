import { BaseModel } from "./BaseModel";
import { AppManager } from "../AppManager";
import { Property } from "../../aillieo-utils/Property";
import { Item } from "../schemas/Item";

export class ItemModel extends BaseModel {
    public readonly url: string;

    public readonly items:Property<Item[]> = new Property<Item[]>([]);

    public constructor() {
        super();
        this.url = "";
    }

    protected get baseUrl() :string {
        return AppManager.getInstance().url + "item";
    }

    public async getItems() : Promise<boolean> {
        const items = await this.session.get<Item[]>("/");
        if (items) {
            this.items.set(items);
            return true;
        }
        return false;
    }

    public async modifyItem(itemData: Item) : Promise<boolean> {
        const newItemData = await this.session.post<Item, Item>(`/${itemData.id}`, itemData);
        if (newItemData) {
            return true;
        }
        return false;
    }
}
