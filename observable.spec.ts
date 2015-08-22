/// <reference path="typings/jasmine/jasmine.d.ts"/>
/// <reference path="observable.ts"/>

describe('observable', () => {
  it('should be defined', () => {
    expect(observable.Observable).toBeDefined();
  });
  describe('IObservable', () => {
    describe('subscribe', () => {
      it('should add listener to list', () => {
        var o:any = new observable.Observable();
        expect(o._listeners.length).toBe(0);
        o.subscribe({});
        expect(o._listeners.length).toBe(1);
      });
      it('should return a subscription with an unsubscribe method', () => {
        var o:any = new observable.Observable();
        var s:observable.ISubscription = o.subscribe({});
        expect(s.unsubscribe).toBeDefined();
      });
      it('should return null if require generator argument is missing', () => {
        var o:any = new observable.Observable();
        expect(o.subscribe(null)).toBeNull();
      });
    });
  });
  describe('ISubscription', () => {
    it('should remove a listener from the observable when unsubscribe is called', () => {
      var o:any = new observable.Observable();
      var generator:observable.IGenerator = {};
      o.subscribe({});
      var s:observable.ISubscription = o.subscribe(generator);
      expect(o._listeners.length).toBe(2);
      expect(s.unsubscribe).toBeDefined();
      s.unsubscribe();
      expect(o._listeners.length).toBe(1);
    });

  });
});