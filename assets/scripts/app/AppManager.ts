import { Singleton } from "../aillieo-utils/Singleton";

// eslint-disable-next-line no-use-before-define
export class AppManager extends Singleton<AppManager>() {
    public url : string = "http://127.0.0.1:8000";
}
