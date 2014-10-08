(function (Z) {
    Z.Starter = Z.Starter || {};
    Z.Starter.orient = function (config, ready) {
        debugger;
        var self = this;
        Z.Starter.orient._api = self.model.people;
        var $pre = $("pre");
        ConsoleJs.init({
            selector: "pre.console",
            input: "textarea.js-code-to-run"
        });
        window._q = function (q, d, c) {

            Z.Starter.orient._api.req(q, d, function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.dir(data);
                }
                $pre.stop().animate({
                    scrollTop: $pre[0].scrollHeight
                }, 800);
            });
        };
    }
})(Z);
