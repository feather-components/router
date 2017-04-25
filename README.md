# router
============
路由控制插件，可用于单页面，目前使用hash方式实现

```js
var router = new Router(function(){
    //register main callback
    alert('empty');
});

router.listen('topic/(\\d+)/(\\d+)', function(){
    router.stop();

    setTimeout(function(){
        console.log('start');
        router.start();
    }, 3000);
})
```

```js
var router = new Router({
    //object register
    '': function(){
        alert('main');
    },

    'news': function(){
        alert('news');
    }
}, {
    beforeCall: function(to, from){
        console.log(to, from);

        if(to === 'news'){
            //如果url为news，则不执行对应的callback
            return false;
        }
    }
});
```

### Options

* beforeCall: 跳转前执行，return false可阻止该路由对应的callback执行，但是url还是会进行变化

### Event

* go: 跳转hash时执行
* call: 执行对应callback后触发，参数为callback执行的结果
* main: 跳转的hash为main时，执行
* match: 匹配到某一个路由时执行

### Methods

* go: 直接跳转至某个url

```js
router.go('news');
```

* start: 开始监听，默认自动调用
* stop: 停止监听url变化
* listen: 新增需要监听的url
* on: 绑定事件
* trigger: 触发事件
* destroy: 摧毁router