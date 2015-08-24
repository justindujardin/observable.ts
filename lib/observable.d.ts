declare module obs {
    function isObject(obj: any): boolean;
    interface IGenerator {
        next?(value?: any): void;
        throw?(error: any): void;
        return?(value?: any): void;
    }
    interface IObservable {
        subscribe(generator: IGenerator): ISubscription;
    }
    interface ISubscription {
        unsubscribe(): void;
    }
    class Observable implements IObservable, IGenerator {
        subscribe(generator: obs.IGenerator): obs.ISubscription;
        next(value?: any): void;
        throw(error: any): void;
        return(value?: any): void;
        private _listeners;
        private _execute(operation, value?);
        private _removeGenerator(generator);
    }
}
