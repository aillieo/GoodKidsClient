import { _decorator } from "cc";
import { BasePage } from "../main/BasePage";
import { Dropdown } from "../../aillieo-utils/ui/Dropdown";
const { ccclass } = _decorator;

@ccclass("PageGame")
export class PageGame extends BasePage {
    protected onEnable() {
        super.onEnable?.();

        const dropdown: Dropdown|null = this.node.getComponentInChildren(Dropdown);
        if (dropdown != null) {
            dropdown.addOptions("text a", "text b", "text c", "text d");
            dropdown.addOptions("text e", "text f", "text g", "text h");
        }
    }
}
