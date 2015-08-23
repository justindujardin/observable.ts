/// <reference path="typings/jasmine/jasmine.d.ts"/>
/// <reference path="observable.ts"/>

describe('obs', () => {

  describe('IObservable', () => {

    describe('subscribe', () => {

      it('should add listener to list', () => {
        var o:any = new obs.Observable();
        expect(o._listeners.length).toBe(0);
        o.subscribe({});
        expect(o._listeners.length).toBe(1);
      });

      it('should return a subscription with an unsubscribe method', () => {
        var o:any = new obs.Observable();
        var s:obs.ISubscription = o.subscribe({});
        expect(s.unsubscribe).toBeDefined();
      });

      it('should return null if required generator argument is missing', () => {
        var o:any = new obs.Observable();
        expect(o.subscribe(null)).toBeNull();
      });

      it('should return null if required generator argument is not an object', () => {
        var o:any = new obs.Observable();
        expect(o.subscribe([])).toBeNull();
        expect(o.subscribe("notanobject")).toBeNull();
      });

    });
  });
  describe('ISubscription', () => {

    describe('unsubscribe', () => {

      it('should remove a listener from the obs when unsubscribe is called', () => {
        var o:any = new obs.Observable();
        var generator:obs.IGenerator = {};
        o.subscribe({});
        var s:obs.ISubscription = o.subscribe(generator);
        expect(o._listeners.length).toBe(2);
        expect(s.unsubscribe).toBeDefined();
        s.unsubscribe();
        expect(o._listeners.length).toBe(1);
      });

      it('should have no side effects when called multiple times', () => {
        var o:any = new obs.Observable();
        var s:obs.ISubscription = o.subscribe({});
        s.unsubscribe();
        s.unsubscribe();
      });

    });
  });

  describe('IGenerator', () => {
    function expectNotCalledAfterUnsubscribe(operation:string) {
      var count:number = 0;
      var o:any = new obs.Observable();
      var generator:any = {};
      generator[operation] = (value?:any):any => count++;
      var subscription:obs.ISubscription = o.subscribe(generator);
      o[operation]();
      expect(count).toBe(1);
      subscription.unsubscribe();
      o[operation]();
      expect(count).toBe(1);
    }

    function expectUnsubscribeOnDoneTrue(operation:string) {
      var o:any = new obs.Observable();
      var generator:any = {};
      generator[operation] = (value?:any):any => {
        return {
          done: true
        };
      };
      o.subscribe(generator);
      expect(o._listeners.length).toBe(1);
      o[operation]();
      expect(o._listeners.length).toBe(0);
    }

    function expectThrowOnCallbackThrow(operation:string) {
      var called:boolean = false;
      var o:any = new obs.Observable();
      var e = new Error('Test Error');
      var generator:any = {
        throw: (error:string) => {
          expect(error).toBe(e);
          called = true;
        }
      };
      generator[operation] = (value?:any):any => {
        throw e;
      };
      o.subscribe(generator);
      o[operation]();
      expect(called).toBe(operation !== 'throw');
    }

    describe('next', () => {
      it('must never be called after the unsubscribe method of subscription has been called', () => {
        expectNotCalledAfterUnsubscribe('next');
      });
      it('should unsubscribe if an object {done:true} is returned from handler', () => {
        expectUnsubscribeOnDoneTrue('next');
      });
      it('errors thrown during execution are reported to a generator with throw method defined', () => {
        expectThrowOnCallbackThrow('next');
      });
    });
    describe('throw', () => {
      it('must never be called after the unsubscribe method of subscription has been called', () => {
        expectNotCalledAfterUnsubscribe('throw');
      });
      it('should unsubscribe if an object {done:true} is returned from handler', () => {
        expectUnsubscribeOnDoneTrue('throw');
      });
      it('errors thrown during execution are reported to a generator with throw method defined', () => {
        expectThrowOnCallbackThrow('throw');
      });
    });
    describe('return', () => {
      it('must never be called after the unsubscribe method of subscription has been called', () => {
        expectNotCalledAfterUnsubscribe('return');
      });
      it('should unsubscribe if an object {done:true} is returned from handler', () => {
        expectUnsubscribeOnDoneTrue('return');
      });
      it('errors thrown during execution are reported to a generator with throw method defined', () => {
        expectThrowOnCallbackThrow('return');
      });
    });
  });
});