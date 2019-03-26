if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/serviceworker.js').then(
            function (reg) {
                // registerasi service worker berhasil
                console.log('SW registration success, scope :', reg.scope);
            }, function (err) {
                // reg failed
                console.log('SW registration faild : ', err);
            }
        );
    })
}