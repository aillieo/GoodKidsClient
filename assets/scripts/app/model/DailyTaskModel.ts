import { Property } from "../../aillieo-utils/Property";
import { DailyTask } from "../schemas/DailyTask";
import { BaseModel } from "./BaseModel";
import { CompletionRecord } from "../schemas/CompletionRecord";

// eslint-disable-next-line no-use-before-define
export class DailyTaskModel extends BaseModel {
    public readonly tasks : Property<DailyTask[]> = new Property<DailyTask[]>([]);

    async getDailyTasks() : Promise<boolean> {
        const result = await this.session.get<DailyTask[]>("/dailytask/");
        if (result) {
            this.tasks.set(result);
            return true;
        }

        return false;
    }

    async createTask(taskName:string, taskDes:string) : Promise<boolean> {
        const result = await this.session.post<DailyTask, DailyTask>("/dailytask/", {
            id: 0,
            taskName,
            taskDes,
            lastRecord: null
        });

        if (result) {
            return true;
        }

        return false;
    }

    async completeTask(taskId:number) : Promise<boolean> {
        const result = await this.session.post<CompletionRecord, DailyTask>(`/dailytask/${taskId}/complete`, { note: "test note", time: 0 });
        if (result) {
            return true;
        }

        return false;
    }
}
