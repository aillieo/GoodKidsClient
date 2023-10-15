export function Singleton<T>() {
    class Singleton {
        // eslint-disable-next-line no-useless-constructor
        protected constructor() { }

        // eslint-disable-next-line no-use-before-define
        private static instance: Singleton | null = null;

        public static getInstance(): T {
            if (Singleton.instance == null) {
                Singleton.instance = new this();
            }
            return Singleton.instance as T;
        }
    }
    return Singleton;
}
