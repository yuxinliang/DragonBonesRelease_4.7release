var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 2D 变换。
     * @version DragonBones 3.0
     */
    var Transform = (function () {
        /**
         * @private
         */
        function Transform(
            /**
             * @language zh_CN
             * 水平位移。
             * @version DragonBones 3.0
             */
            x, 
            /**
             * @language zh_CN
             * 垂直位移。
             * @version DragonBones 3.0
             */
            y, 
            /**
             * @language zh_CN
             * 水平倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewX, 
            /**
             * @language zh_CN
             * 垂直倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewY, 
            /**
             * @language zh_CN
             * 水平缩放。
             * @version DragonBones 3.0
             */
            scaleX, 
            /**
             * @language zh_CN
             * 垂直缩放。
             * @version DragonBones 3.0
             */
            scaleY) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (skewX === void 0) { skewX = 0; }
            if (skewY === void 0) { skewY = 0; }
            if (scaleX === void 0) { scaleX = 1; }
            if (scaleY === void 0) { scaleY = 1; }
            this.x = x;
            this.y = y;
            this.skewX = skewX;
            this.skewY = skewY;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
        }
        var d = __define,c=Transform,p=c.prototype;
        /**
         * @private
         */
        Transform.normalizeRadian = function (value) {
            value = (value + Math.PI) % (Math.PI * 2);
            value += value > 0 ? -Math.PI : Math.PI;
            return value;
        };
        /**
         * @private
         */
        p.toString = function () {
            return "[object dragonBones.Transform] x:" + this.x + " y:" + this.y + " skewX:" + this.skewX * 180 / Math.PI + " skewY:" + this.skewY * 180 / Math.PI + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
        };
        /**
         * @private
         */
        p.copyFrom = function (value) {
            var self = this;
            self.x = value.x;
            self.y = value.y;
            self.skewX = value.skewX;
            self.skewY = value.skewY;
            self.scaleX = value.scaleX;
            self.scaleY = value.scaleY;
            return this;
        };
        /**
         * @private
         */
        p.clone = function () {
            var value = new Transform();
            value.copyFrom(this);
            return value;
        };
        /**
         * @private
         */
        p.identity = function () {
            var self = this;
            self.x = self.y = self.skewX = self.skewY = 0;
            self.scaleX = self.scaleY = 1;
            return this;
        };
        /**
         * @private
         */
        p.add = function (value) {
            var self = this;
            self.x += value.x;
            self.y += value.y;
            self.skewX += value.skewX;
            self.skewY += value.skewY;
            self.scaleX *= value.scaleX;
            self.scaleY *= value.scaleY;
            return this;
        };
        /**
         * @private
         */
        p.minus = function (value) {
            var self = this;
            self.x -= value.x;
            self.y -= value.y;
            self.skewX = Transform.normalizeRadian(self.skewX - value.skewX);
            self.skewY = Transform.normalizeRadian(self.skewY - value.skewY);
            self.scaleX /= value.scaleX;
            self.scaleY /= value.scaleY;
            return this;
        };
        /**
         * @private
         */
        p.fromMatrix = function (matrix) {
            var self = this;
            var PI_Q = Math.PI * 0.25;
            var backupScaleX = self.scaleX, backupScaleY = self.scaleY;
            self.x = matrix.tx;
            self.y = matrix.ty;
            self.skewX = Math.atan(-matrix.c / matrix.d);
            self.skewY = Math.atan(matrix.b / matrix.a);
            if (self.skewX != self.skewX)
                self.skewX = 0;
            if (self.skewY != self.skewY)
                self.skewY = 0;
            self.scaleY = (self.skewX > -PI_Q && self.skewX < PI_Q) ? matrix.d / Math.cos(self.skewX) : -matrix.c / Math.sin(self.skewX);
            self.scaleX = (self.skewY > -PI_Q && self.skewY < PI_Q) ? matrix.a / Math.cos(self.skewY) : matrix.b / Math.sin(self.skewY);
            if (backupScaleX >= 0 && self.scaleX < 0) {
                self.scaleX = -self.scaleX;
                self.skewY = self.skewY - Math.PI;
            }
            if (backupScaleY >= 0 && self.scaleY < 0) {
                self.scaleY = -self.scaleY;
                self.skewX = self.skewX - Math.PI;
            }
            return this;
        };
        /**
         * @language zh_CN
         * 转换为矩阵。
         * @param 矩阵。
         * @version DragonBones 3.0
         */
        p.toMatrix = function (matrix) {
            var self = this;
            matrix.a = self.scaleX * Math.cos(self.skewY);
            matrix.b = self.scaleX * Math.sin(self.skewY);
            matrix.c = -self.scaleY * Math.sin(self.skewX);
            matrix.d = self.scaleY * Math.cos(self.skewX);
            matrix.tx = self.x;
            matrix.ty = self.y;
        };
        d(p, "rotation"
            /**
             * @language zh_CN
             * 旋转。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            ,function () {
                return this.skewY;
            }
            ,function (value) {
                var dValue = value - this.skewY;
                this.skewX += dValue;
                this.skewY += dValue;
            }
        );
        return Transform;
    }());
    dragonBones.Transform = Transform;
    egret.registerClass(Transform,'dragonBones.Transform');
})(dragonBones || (dragonBones = {}));
