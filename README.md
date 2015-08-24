observable.ts [![Build Status](https://travis-ci.org/justindujardin/observable.ts.svg?branch=master)](https://travis-ci.org/justindujardin/observable.ts) [![Coverage Status](https://img.shields.io/coveralls/justindujardin/observable.ts.svg)](https://coveralls.io/r/justindujardin/observable.ts?branch=master)
-------------

A reference implementation of the [observable spec](https://github.com/jhusain/observable-spec) in Typescript.

### Example

Define a game trigger object with `enter` and `leave` observables.

```typescript

interface ITrigger {
  enter: obs.Observable;
  leave: obs.Observable;
  doEnter(obj:IPlayer):void;
  doLeave(obj:IPlayer):void;
  destroy():void;
}
interface IPlayer {
  name: string;
  health: number;
}

var player:IPlayer = {
  name: 'MorTon',
  health: 100
};
var trigger:ITrigger = {
  enter: new obs.Observable(),
  leave: new obs.Observable(),
  doEnter: (obj:IPlayer) => trigger.enter.next(obj),
  doLeave: (obj:IPlayer) => trigger.leave.next(obj),
  destroy: () => {
    trigger.enter.return();
    trigger.leave.return();
  }
};

trigger.enter.subscribe({
  next: (value:IPlayer) => {
    var damage = 50;
    value.health -= damage;
    console.log(player.name + ' entered the trigger and took ' + damage + ' damage!');
  }
});
trigger.leave.subscribe({
  next: (value:IPlayer) => {
    console.log(value.name + ' exited the trigger with ' + value.health + ' health remaining.');
  }
});

trigger.doEnter(player);
trigger.doLeave(player);
trigger.destroy();

```

Outputs:
```
MorTon entered the trigger and took 50 damage!
MorTon exited the trigger with 50 health remaining.
```


### License

<p xmlns:dct="http://purl.org/dc/terms/" xmlns:vcard="http://www.w3.org/2001/vcard-rdf/3.0#">
  <a rel="license"
     href="https://creativecommons.org/publicdomain/zero/1.0/">
    <img src="https://i.creativecommons.org/p/zero/1.0/88x31.png" style="border-style: none;" alt="CC0" />
  </a>
  <br />
  To the extent possible under law,
  <a rel="dct:publisher"
     href="https://www.justindujardin.com">
    <span property="dct:title">Justin DuJardin</span></a>
  has waived all copyright and related or neighboring rights to
  <span property="dct:title">observable.ts</span>.
This work is published from:
<span property="vcard:Country" datatype="dct:ISO3166"
      content="US" about="https://github.com/justindujardin/observable.ts">
  United States</span>.
</p>
