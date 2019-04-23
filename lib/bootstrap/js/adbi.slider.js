! function (t, i) {
    "use strict";
    var n = function (t, n) {
        this.$el = i(t), this.opts = n, this.init()
    }, e = {
        startIndex: 0,
        duration: 1e3,
        interval: 5e3,
        hasControl: !1,
        afterSlide: function (t, i) { }
    };
    n.prototype = {
        init: function () {
            this.opts = i.extend({}, e, this.opts), this._create(), this._initStyle()
        },
        _create: function () {
            this.$children = this.$el.children(), this.max = this.$children.length - 1, this.index = 0, this.animating = !1, this.timer = null, this.hasPagi = 0 !== this.max
        },
        _initStyle: function () {
            this.$children.height();
            this.$el.addClass("adbi-slider"), this.$el.wrap('<div class="adbi-slider-wrap"></div>'), this.$parent = this.$el.parent(), this.$children.eq(this.opts.startIndex).siblings().hide(), this.hasPagi && (this._createPagi(), this._play(), this._bindPagi()), this.hasPagi && this.opts.hasControl && (this._createControl(), this._bindControl())
        },
        next: function () {
            //this.animating || (this.animating = !0, this.index++, this.index > this.max && (this.index = 0), console.log(this.index), this._transform())
            this.animating || (this.animating = !0, this.index++, this.index > this.max && (this.index = 0), this._transform())
        },
        prev: function () {
            this.animating || (this.animating = !0, this.index--, this.index < 0 && (this.index = this.max), this._transform())
        },
        jump: function (t) {
            this.animating || (this.animating = !0, this.index = t, this._transform())
        },
        _transform: function () {
            var t = this;
            t.hasPagi && t.$pagination.children().eq(t.index).addClass("active").siblings().removeClass("active"), t.$children.eq(t.index).stop().fadeIn(t.opts.duration, function () {
                t.animating = !1, t.opts.afterSlide.call(t, t.index, i(this))
            }).siblings().fadeOut(t.opts.duration)
        },
        _createControl: function () {
            var t = '<div class="adbi-controller"><div class="adbi-control adbi-control-prev">prev</div><div class="adbi-control adbi-control-next">next</div></div>';
            this.$control = i(t), this.$parent.append(this.$control)
        },
        _bindControl: function () {
            var t = this;
            this.$parent.on({
                mouseenter: function () {
                    t.$control.show()
                },
                mouseleave: function () {
                    t.$control.hide()
                }
            }), this.$control.find(".adbi-control-prev").on("click", function () {
                t.prev()
            }), this.$control.find(".adbi-control-next").on("click", function () {
                t.next()
            })
        },
        _createPagi: function () {
            for (var t = '<div class="adbi-pager">', n = 0; n <= this.max; n++) t += '<div class="adbi-pager-item"><a href="javascript:;" data-index="' + n + '" class="adv-pager-link">' + n + "</a></div>";
            this.$pagination = i(t), this.$parent.append(this.$pagination), this.$pagination.css({
                width: 20 * (this.max + 1) + 10 + "px",
                "padding-left": "5px",
                "margin-left": 20 * -(this.max + 1) / 2 + "px"
            }), this.$pagination.children().eq(this.opts.startIndex).addClass("active")
        },
        _bindPagi: function () {
            var t = this;
            this.$parent.on({
                mouseenter: function () {
                    t._stop()
                },
                mouseleave: function () {
                    setTimeout(function () {
                        t._play()
                    }, 1e3)
                }
            }), this.$pagination.on("click", ".adbi-pager-item", function () {
                var n = i(this).index();
                t.jump(n)
            })
        },
        _play: function () {
            var t = this;
            this._stop(), t.timer = setInterval(function () {
                t.next()
            }, t.opts.interval)
        },
        _stop: function () {
            clearInterval(this.timer), this.timer = null
        }
    }, "undefined" != typeof module && module.exports ? module.exports = n : "function" == typeof define && define.amd ? define(n) : t.BiSlider = n
}(this, this.jQuery),
function () {
    "use strict";
    var a6Host = getA6Host();
    if (a6Host == "") {
        a6Host = "https://a6.hujiang.com";
    }
    var t = a6Host + "/v2/slide.ashx",
        i = a6Host + "/style/adbi.css?v=" + $('#a6_solid_script').data('version'),
        n = {
            aid: 613
        }, e = {
            log: {},
            slider: {},
            init: function () {
                var i = this;
                $("[data-bid]").each(function (e, a) {
                    var s = $(a),
                        o = s.attr("data-bid"),
                        r = s.attr("data-mode"),
                        l = s.attr("data-control");
                    n.aid = o, l = "true" === l, i.log["bid_" + o] = [], i.getAjax(t, n, function (t) {
                        1 === t.Code && t.Data && (i.getAjax(t.Data.DisplayHref), i.initUi(t, s, o, r, l))
                    })
                })
            },
            initUi: function (t, i, n, e, a) {
                var s = "bid_" + n,
                    o = this.getData(t.Data, s, e).html,
                    r = $(o),
                    l = this;
                r.attr("id", s), i.append(r), l.log[s][0].isRequested = !0, l.getAjax(l.log[s][0].requestUrl), l.slider[s] = new BiSlider("#" + s, {
                    hasControl: a,
                    afterSlide: function (t, i) {
                        l.log[s][t].isRequested || (l.getAjax(l.log[s][t].requestUrl), l.log[s][t].isRequested = !0)
                    }
                })
            },
            getData: function (t, i, n) {
                var e = t.MediaBuyList,
                    a = "";
                a = '<ul style="height: ' + t.Height + 'px">';
                for (var s = 0; s < e.length; s++) {
                    this.log[i][s] = {
                        isRequested: !1,
                        requestUrl: e[s].DisplayHref
                    };
                    var o = e[s].IsBlank ? 'target="_blank"' : "";
                    if (e[s].Text == null) {
                        a += "image" === n ? '<li><a href="' + e[s].TargetUrl + '" ' + o + '><img src="' + e[s].ImgPath + '"></a></li>' : '<li style="background-color:' + e[s].FillColor + '; background-image:url(' + e[s].ImgPath + ');"><a href="' + e[s].TargetUrl + '" ' + o + '></a></li>'
                    } else {
                        a += "image" === n ? '<li><a href="' + e[s].TargetUrl + '" ' + o + ' title="' + e[s].Text + '"><img src="' + e[s].ImgPath + '" alt="' + e[s].Text + '"></a></li>' : '<li style="background-color:' + e[s].FillColor + '; background-image:url(' + e[s].ImgPath + ');"><a href="' + e[s].TargetUrl + '" ' + o + ' title="' + e[s].Text + '"></a></li>'
                    }
                    //a += "image" === n ? '<li><a href="' + e[s].TargetUrl + '" ' + o + ' title="' + e[s].Text + '"><img src="' + e[s].ImgPath + '" alt="' + e[s].Text + '"></a></li>' : '<li style="background-color:' + e[s].FillColor + '; background-image:url(' + e[s].ImgPath + ');"><a href="' + e[s].TargetUrl + '" ' + o + ' title="' + e[s].Text + '"></a></li>'
                }
                return a += '</ul>', {
                    html: a
                }
            },
            getAjax: function (t, i, n) {
                if (!t) return;
                i && (t = t + "?v=" + Math.random()), $.ajax({
                    url: t,
                    data: i,
                    type: "GET",
                    dataType: "jsonp",
                    success: function (t) {
                        n && n(t)
                    },
                    error: function (t) { /*console.log(t)*/ }
                })
            },
            requireCss: function (t) {
                var i = document.createElement("link"),
                    n = document.getElementsByTagName("head");
                i.type = "text/css", i.rel = "stylesheet", i.href = t, n = n.length ? n[0] : document.documentElement, n.appendChild(i)
            }
        };
    e.requireCss(i), $(function() {
        e.init();
    });
}();

function getA6Host() {
    var env = "";
    host = location.host;

    if (/^local/i.test(host)) {
        env = 'qaa6.hujiang.com';
    } else if (/^qa\d?/i.test(host)) {
        var envPrefix = host.match(/^qa\d?/i);
        env = `${envPrefix[0]}a6.hujiang.com`;
    } else if (/^yz/i.test(host)) {
        env = 'yz.a6.hujiang.com';
    } else {
        env = 'a6.hujiang.com';
    }

    return 'https://' + env;
}