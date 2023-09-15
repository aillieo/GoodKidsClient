import { Property } from "../../aillieo-utils/Property";
import { Singleton } from "../../aillieo-utils/Singleton";
import { DataManager } from "./DataManager";

export type TaskData = {
    id:number;
    taskName:string;
    taskDes:string;
}

// eslint-disable-next-line no-use-before-define
export class DailyTaskModel extends Singleton<DailyTaskModel>() {
    public readonly tasks : Property<TaskData[]> = new Property<TaskData[]>([]);

    async getDailyTasks() : Promise<boolean> {
        const result = await DataManager.getInstance().session!.get<TaskData[]>("/dailytask/");
        if (result) {
            this.tasks.set(result);
            return true;
        }

        return false;
    }

    async createTask(taskName:string, taskDes:string) : Promise<boolean> {
        const result = await DataManager.getInstance().session!.post("/dailytask/", {
            taskName,
            taskDes
        });

        if (result) {
            return true;
        }

        return false;
    }

    async completeTask(taskId:number) : Promise<boolean> {
        const result = await DataManager.getInstance().session!.post(`/dailytask/${taskId}/complete`, { note: "test note" });
        if (result) {
            return true;
        }

        return false;
    }
}
