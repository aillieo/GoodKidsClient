// eslint-disable-next-line no-use-before-define
export class Singleton<T extends Singleton<T>> {
    // eslint-disable-next-line no-use-before-define
    private static instance: Singleton<unknown>;

    public static getInstance<T extends Singleton<T>>(): T {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton<T>() as Singleton<unknown>;
        }
        return Singleton.instance as T;
    }

    // eslint-disable-next-line no-useless-constructor
    protected constructor() {
    }
}
