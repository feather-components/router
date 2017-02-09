;(function(factory){
if(typeof define == 'function' && define.amd){
    //seajs or requirejs environment
    define([], factory);
}else if(typeof module === 'object' && typeof module.exports == 'object'){
    module.exports = factory();
}else{
    window.Router = factory();
}
})(function(){
function Router(rules){
    var self = this;

    self.rules = {};
    self.events = {};
    self.isStart = false;
    self.current = null;

    if(typeof rules == 'function'){
        self.listen('', rules);
    }else{
        Router.each(rules || {}, function(callback, rule){
            self.listen(rule, callback);
        });
    }

    self.$listener = function(){
        var url = location.hash.substr(1);
        
        self.trigger('go', [url, self.current]);
        self.current = url;

        if(!self.isStart) return;

        if(!url && self.main){
            self.main();
            return;
        }

        Router.each(self.rules, function(callback, rule){
            var res = url.match(new RegExp(rule));

            if(res){
                self.trigger('match', res);
                callback.apply(callback, res);
                return false;
            }
        });
    };

    Router.on(window, 'hashchange', this.$listener);
    self.start();

    setTimeout(function(){
        self.$listener();
    }, 10);
}

Router.prototype = {
    listen: function(rule, callback){
        if(typeof rule != 'string'){
            rule = rule.toString().slice(1, -1).replace(/\\/g, '\\\\');
        }

        if(!rule){
            this.main = callback;
            return;
        }

        this.rules[rule] = callback;
    },

    start: function(){
        this.isStart = true;
    },

    stop: function(){
        this.isStart = false;
    },

    go: function(url){
        location.hash = '#' + url;
    },

    on: function(event, callback){
        var self = this, events = self.events;

        if(!events[event]){
            events[event] = [callback];
        }else{
            events[event].push(callback);
        }

        return self;
    },

    trigger: function(event, args){
        var self = this, events = self.events[event] || [];

        Router.each(events, function(event){
            event.apply(self, Router.array(args));
        });

        return self;
    },

    destroy: function(){
        Router.off(window, 'hashchange', this.$listener);
    }
};

Router.on = function(dom, event, callback){
    if(dom.addEventListener){
        dom.addEventListener(event, callback, false);
    }else{
        dom.attachEvent('on' + event, callback);
    }
};

Router.off = function(dom, event, callback){
    if(dom.removeEventListener){
        dom.removeEventListener(event, callback);
    }else{
        dom.detachEvent('on' + event, callback);
    }
};

Router.each = function(arr, callback){
    if(arr.length){
        for(var i = 0; i < arr.length; i++){
            if(callback(arr[i], i) === false){
                break;
            }
        }
    }else{
        for(var i in arr){
            if(arr.hasOwnProperty(i) && callback(arr[i], i) === false){
                break;
            }
        }
    }
};

Router.array = function(arr){
    if(Object.prototype.toString.call(arr) == '[object Array]'){
        return arr;
    }

    return [arr];
};

return Router;

});