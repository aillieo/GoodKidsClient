import { BaseModel } from "./BaseModel";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = unknown> = new (...args: any[]) => T;

export class Models {
    private static readonly map : Map<Constructor, BaseModel> = new Map();

    public static get<T extends BaseModel>(c: Constructor<T>): T {
        let m : BaseModel|undefined = Models.map.get(c);
        if (!m) {
            // eslint-disable-next-line new-cap
            m = new c();
            Models.map.set(c, m);
        }

        return m as T;
    }
}
