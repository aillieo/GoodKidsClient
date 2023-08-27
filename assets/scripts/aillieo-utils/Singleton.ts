export function Singleton<T>() {
    class Singleton {
        protected constructor() {}

        // eslint-disable-next-line no-use-before-define
        private static instance: Singleton = null;

        public static getInstance(): T {
            if (Singleton.instance == null) {
                Singleton.instance = new this();
            }
            return Singleton.instance as T;
        }
    }
    return Singleton;
}

export class Singleton2 {

    public constructor(){}

    // eslint-disable-next-line no-unused-vars
    static getInstance<T extends NonNullable<unknown>>(this:new()=>T):T {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clazz = <any> this;
        if (!clazz.__instance) {
            clazz.__instance = new this();
        }

        return clazz.__instance;
    }
}
