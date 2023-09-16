import { Property } from "../../aillieo-utils/Property";
import { Singleton } from "../../aillieo-utils/Singleton";
import { CompletionRecord } from "../schemas/CompletionRecord";
import { DailyTask } from "../schemas/DailyTask";
import { DataManager } from "./DataManager";

// eslint-disable-next-line no-use-before-define
export class DailyTaskModel extends Singleton<DailyTaskModel>() {
    public readonly tasks : Property<DailyTask[]> = new Property<DailyTask[]>([]);

    async getDailyTasks() : Promise<boolean> {
        const result = await DataManager.getInstance().session!.get<DailyTask[]>("/dailytask/");
        if (result) {
            this.tasks.set(result);
            return true;
        }

        return false;
    }

    async createTask(taskName:string, taskDes:string) : Promise<boolean> {
        const result = await DataManager.getInstance().session!.post<DailyTask, DailyTask>("/dailytask/", {
            id: 0,
            taskName,
            taskDes
        });

        if (result) {
            return true;
        }

        return false;
    }

    async completeTask(taskId:number) : Promise<boolean> {
        const result = await DataManager.getInstance().session!.post<CompletionRecord, DailyTask>(`/dailytask/${taskId}/complete`, { note: "test note", time: 0 });
        if (result) {
            return true;
        }

        return false;
    }
}
