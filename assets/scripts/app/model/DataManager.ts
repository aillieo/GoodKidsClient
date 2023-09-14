import { AppManager } from "../AppManager";
import { Singleton } from "../../aillieo-utils/Singleton";
import { Session } from "../misc/Session";

// eslint-disable-next-line no-use-before-define
export class DataManager extends Singleton<DataManager>() {
    private session:Session |undefined;

    protected constructor() {
        super();
        const url = AppManager.getInstance().url;
        this.session = Session.Create(url);
    }

    async getUserData(u:string, p:string, isReg:boolean) : Promise<boolean> {
        if (isReg) {
            return this.session!.register(u, p);
        } else {
            return this.session!.login(u, p);
        }
    }

    async getDailyTasks() : Promise<any[]> {
        return this.session!.get<any[]>("/dailytask/");
    }

    async createTask(taskName:string, taskDes:string) : Promise<object> {
        return this.session!.post("/dailytask/", {
            taskName,
            taskDes
        });
    }

    async completeTask(taskId:number) : Promise<object> {
        return this.session!.post(`/dailytask/${taskId}/complete`, { note: "test note" });
    }
}
