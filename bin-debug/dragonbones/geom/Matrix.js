var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 2D 矩阵。
     * @version DragonBones 3.0
     */
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        var d = __define,c=Matrix,p=c.prototype;
        /**
         * @language zh_CN
         * 复制矩阵。
         * @param value 需要复制的矩阵。
         * @version DragonBones 3.0
         */
        p.copyFrom = function (value) {
            var self = this;
            self.a = value.a;
            self.b = value.b;
            self.c = value.c;
            self.d = value.d;
            self.tx = value.tx;
            self.ty = value.ty;
        };
        /**
         * @language zh_CN
         * 转换为恒等矩阵。
         * @version DragonBones 3.0
         */
        p.identity = function () {
            var self = this;
            self.a = self.d = 1;
            self.b = self.c = 0;
            self.tx = self.ty = 0;
        };
        /**
         * @language zh_CN
         * 将当前矩阵与另一个矩阵相乘。
         * @param value 需要相乘的矩阵。
         * @version DragonBones 3.0
         */
        p.concat = function (value) {
            var self = this;
            var aA = self.a;
            var bA = self.b;
            var cA = self.c;
            var dA = self.d;
            var txA = self.tx;
            var tyA = self.ty;
            var aB = value.a;
            var bB = value.b;
            var cB = value.c;
            var dB = value.d;
            var txB = value.tx;
            var tyB = value.ty;
            self.a = aA * aB + bA * cB;
            self.b = aA * bB + bA * dB;
            self.c = cA * aB + dA * cB;
            self.d = cA * bB + dA * dB;
            self.tx = aB * txA + cB * tyA + txB;
            self.ty = dB * tyA + bB * txA + tyB;
            /*
            [
                self.a,
                self.b,
                self.c,
                self.d,
                self.tx,
                self.ty
            ] = [
                self.a * value.a + self.b * value.c,
                self.a * value.b + self.b * value.d,
                self.c * value.a + self.d * value.c,
                self.c * value.b + self.d * value.d,
                value.a * self.tx + value.c * self.tx + value.tx,
                value.d * self.ty + value.b * self.ty + value.ty
            ];
            */
        };
        /**
         * @language zh_CN
         * 转换为逆矩阵。
         * @version DragonBones 3.0
         */
        p.invert = function () {
            var self = this;
            var aA = self.a;
            var bA = self.b;
            var cA = self.c;
            var dA = self.d;
            var txA = self.tx;
            var tyA = self.ty;
            var n = aA * dA - bA * cA;
            self.a = dA / n;
            self.b = -bA / n;
            self.c = -cA / n;
            self.d = aA / n;
            self.tx = (cA * tyA - dA * txA) / n;
            self.ty = -(aA * tyA - bA * txA) / n;
        };
        /**
         * @language zh_CN
         * 将矩阵转换应用于指定点。
         * @param x 横坐标。
         * @param y 纵坐标。
         * @param result 应用转换之后的坐标。
         * @params delta 是否忽略 tx，ty 对坐标的转换。
         * @version DragonBones 3.0
         */
        p.transformPoint = function (x, y, result, delta) {
            if (delta === void 0) { delta = false; }
            var self = this;
            result.x = self.a * x + self.c * y;
            result.y = self.b * x + self.d * y;
            if (!delta) {
                result.x += self.tx;
                result.y += self.ty;
            }
        };
        return Matrix;
    }());
    dragonBones.Matrix = Matrix;
    egret.registerClass(Matrix,'dragonBones.Matrix');
})(dragonBones || (dragonBones = {}));
