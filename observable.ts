module observable {

  /**
   * An object that generates observable events.
   */
  export interface IGenerator {
    /**
     * Trigger an event for listeners to consume.
     * @param value
     */
    next?(value?:any):void;

    throw?(error: any):void;

    return?(value?:any):void;
  }

  export interface IObservable {
    subscribe(generator:IGenerator):ISubscription;
  }

  export interface ISubscription {
    unsubscribe():void;
  }

  /**
   * Implementation of an Observable object that conforms to the observable specification.
   */
  export class Observable implements IObservable, IGenerator {
    subscribe(generator:observable.IGenerator):observable.ISubscription {
      if (!generator) {
        // TODO: The spec is unclear about what to do if the required argument is missing.
        return null;
      }
      var expired:boolean = false;
      this._listeners.push(generator);
      return {
        unsubscribe: () => {
          if (!expired) {
            expired = true;
            this._removeGenerator(generator);
          }
        }
      };
    }



    private _listeners:IGenerator[] = [];

    /**
     * Remove a generator by its instance.
     * @param generator The generator to remove.
     * @private
     */
    private _removeGenerator(generator:observable.IGenerator) {
      for (var i:number = 0; i < this._listeners.length; i++) {
        if (this._listeners[i] === generator) {
          this._listeners.splice(i, 1);
          return;
        }
      }
    }
  }
}