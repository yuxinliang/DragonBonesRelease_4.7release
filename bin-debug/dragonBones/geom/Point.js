var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        var d = __define,c=Point,p=c.prototype;
        p.copyFrom = function (value) {
            this.x = value.x;
            this.y = value.y;
        };
        p.clear = function () {
            this.x = this.y = 0;
        };
        return Point;
    }());
    dragonBones.Point = Point;
    egret.registerClass(Point,'dragonBones.Point');
})(dragonBones || (dragonBones = {}));
