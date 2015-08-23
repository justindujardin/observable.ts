module obs {

  /**
   * Determine if a given parameter is an object or not.
   * @returns {boolean} true if the type is an object.
   */
  export function isObject(obj:any):boolean {
    var type = typeof obj;
    return type === 'object' && !!obj && toString.call(obj) !== '[object Array]';
  }

  /**
   * An object that generates observable values.
   */
  export interface IGenerator {
    /**
     * Trigger/Receive a value.
     * @param value
     */
    next?(value?:any):void;

    /**
     * Trigger/Receive an error.
     * @param error The error that occurred during execution.
     */
    throw?(error:any):void;

    /**
     * Trigger/Receive a final value.
     * @param value An optional value
     */
    return?(value?:any):void;
  }

  /**
   * An object that is observable.  It generates values that
   * interested parties may consume.  It declares a method to
   * allow one to `subscribe` to those events.
   */
  export interface IObservable {

    /**
     * Subscribe to changes in value for this object.
     * @param {@link IGenerator} generator An object that defines the callbacks that
     *        are to be consumed when a value changes.
     */
    subscribe(generator:IGenerator):ISubscription;
  }

  /**
   * An object that manages the lifetime of a generator that is associated with
   * an {@link IObservable}.
   */
  export interface ISubscription {
    /**
     * Unsubscribe the {@link IGenerator} associated with this subscription.  The
     * associated generator will immediately stop receiving values.  Calling this
     * method multiple times will have no side-effects.
     */
    unsubscribe():void;
  }

  /**
   * Implementation of an Observable object that conforms to the observable specification.
   */
  export class Observable implements IObservable, IGenerator {
    subscribe(generator:obs.IGenerator):obs.ISubscription {
      if (!generator || !isObject(generator)) {
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

    next(value?:any):void {
      return this._execute('next', value);
    }

    throw(error:any):void {
      return this._execute('throw', error);
    }

    return(value?:any):void {
      return this._execute('return', value);
    }


    private _listeners:IGenerator[] = [];

    private _execute(operation:string, value?:any):void {
      var completed:obs.IGenerator[] = [];
      for (var i:number = 0; i < this._listeners.length; i++) {
        try {
          var generator:any = this._listeners[i];
          var result:any = generator[operation](value);
          if (result && result.done === true) {
            completed.push(this._listeners[i]);
          }
        }
        catch (e) {
          if (operation === 'throw') {
            console.error("Error thrown in error handler: ", e);
          }
          else {
            this.throw(e);
          }
          break;
        }
      }
      if (completed.length) {
        completed.forEach((g:obs.IGenerator) => this._removeGenerator(g));
      }
    }

    /**
     * Remove a generator by its instance.
     * @param generator The generator to remove.
     * @private
     */
    private _removeGenerator(generator:obs.IGenerator) {
      for (var i:number = 0; i < this._listeners.length; i++) {
        if (this._listeners[i] === generator) {
          this._listeners.splice(i, 1);
          return;
        }
      }
    }
  }
}