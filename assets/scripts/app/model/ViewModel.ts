import { Enum } from "cc";
import { Property } from "../../aillieo-utils/Property";
import { Singleton } from "../../aillieo-utils/Singleton";

export enum Pages {
    Profile,
    Daily,
    Challenge,
    Reward,
    Game,
}

Enum(Pages);

// eslint-disable-next-line no-use-before-define
export class ViewModel extends Singleton<ViewModel>() {
    currentPage : Property<Pages>;

    protected constructor() {
        super();
        this.currentPage = new Property<Pages>(Pages.Profile);
    }
}
