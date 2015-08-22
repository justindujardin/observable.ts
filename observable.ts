module observable {

  export interface IGenerator {
    /**
     *
     * @param value
     */
    next?(value?:any):any;
  }

  export interface IObservable {
    subscribe(generator:IGenerator):ISubscription;
  }

  export interface ISubscription {
    unsubscribe():void;
  }

  export class Observable implements IObservable {
    subscribe(generator:observable.IGenerator):observable.ISubscription {
      if(!generator){
        // TODO: The spec is unclear about what to do if the required argument is missing.
        return null;
      }
      this._listeners.push(generator);
      return {
        unsubscribe: this._unsubscribe.bind(this,generator),
      }
    }

    private _listeners:IGenerator[] = [];
    private _unsubscribe(generator:observable.IGenerator):void {
      for (var i:number = 0; i < this._listeners.length; i++) {
        if (this._listeners[i] === generator) {
          this._listeners.splice(i, 1);
          return;
        }
      }
    }
  }
}