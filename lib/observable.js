var obs;
(function (obs) {
    function isObject(obj) {
        return typeof obj === 'object' && !!obj && toString.call(obj) !== '[object Array]';
    }
    obs.isObject = isObject;
    var Observable = (function () {
        function Observable() {
            this._listeners = [];
        }
        Observable.prototype.subscribe = function (generator) {
            var _this = this;
            if (!generator || !isObject(generator)) {
                return null;
            }
            var expired = false;
            this._listeners.push(generator);
            return {
                unsubscribe: function () {
                    if (!expired) {
                        expired = true;
                        _this._removeGenerator(generator);
                    }
                }
            };
        };
        Observable.prototype.next = function (value) {
            return this._execute('next', value);
        };
        Observable.prototype.throw = function (error) {
            return this._execute('throw', error);
        };
        Observable.prototype.return = function (value) {
            return this._execute('return', value);
        };
        Observable.prototype._execute = function (operation, value) {
            var _this = this;
            var completed = [];
            for (var i = 0; i < this._listeners.length; i++) {
                try {
                    var generator = this._listeners[i];
                    if (!generator || !generator[operation]) {
                        continue;
                    }
                    var result = generator[operation](value);
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
                completed.forEach(function (g) { return _this._removeGenerator(g); });
            }
        };
        Observable.prototype._removeGenerator = function (generator) {
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i] === generator) {
                    this._listeners.splice(i, 1);
                    return;
                }
            }
        };
        return Observable;
    })();
    obs.Observable = Observable;
})(obs || (obs = {}));
//# sourceMappingURL=observable.js.map