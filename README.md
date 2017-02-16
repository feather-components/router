# router
============
路由控制插件，可用于单页面，目前使用hashbang方式实现

```html
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
