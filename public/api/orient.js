(function (Z) {
    Z.Starter = Z.Starter || {};
    Z.Starter.orient = function (config, ready) {
        var self = this;
        Z.Starter.orient._api = self.model.people;
        var $pre = $("pre");
        ConsoleJs.init({
            selector: "pre.console",
            input: "textarea.js-code-to-run"
        });
        window._list = function () {
            Z.Starter.orient._api.req({
                m: "find"
            }, function (err, data) {
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
        window._query = function (q) {
            Z.Starter.orient._api.req({
                m: "query",
                q: q
            }, function (err, data) {
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
        console.info("Welcome to ConsoleJS!");
        //_query("insert into people (name, age) values ('Alice', 99)")
    }
})(Z);
