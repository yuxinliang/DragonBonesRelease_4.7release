var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var ColorTransform = (function () {
        function ColorTransform(alphaMultiplier, redMultiplier, greenMultiplier, blueMultiplier, alphaOffset, redOffset, greenOffset, blueOffset) {
            if (alphaMultiplier === void 0) { alphaMultiplier = 1; }
            if (redMultiplier === void 0) { redMultiplier = 1; }
            if (greenMultiplier === void 0) { greenMultiplier = 1; }
            if (blueMultiplier === void 0) { blueMultiplier = 1; }
            if (alphaOffset === void 0) { alphaOffset = 0; }
            if (redOffset === void 0) { redOffset = 0; }
            if (greenOffset === void 0) { greenOffset = 0; }
            if (blueOffset === void 0) { blueOffset = 0; }
            this.alphaMultiplier = alphaMultiplier;
            this.redMultiplier = redMultiplier;
            this.greenMultiplier = greenMultiplier;
            this.blueMultiplier = blueMultiplier;
            this.alphaOffset = alphaOffset;
            this.redOffset = redOffset;
            this.greenOffset = greenOffset;
            this.blueOffset = blueOffset;
        }
        var d = __define,c=ColorTransform,p=c.prototype;
        p.copyFrom = function (value) {
            var self = this;
            self.alphaMultiplier = value.alphaMultiplier;
            self.redMultiplier = value.redMultiplier;
            self.greenMultiplier = value.greenMultiplier;
            self.blueMultiplier = value.blueMultiplier;
            self.alphaOffset = value.alphaOffset;
            self.redOffset = value.redOffset;
            self.redOffset = value.redOffset;
            self.greenOffset = value.blueOffset;
        };
        p.identity = function () {
            var self = this;
            self.alphaMultiplier = self.redMultiplier = self.greenMultiplier = self.blueMultiplier = 1;
            self.alphaOffset = self.redOffset = self.greenOffset = self.blueOffset = 0;
        };
        return ColorTransform;
    }());
    dragonBones.ColorTransform = ColorTransform;
    egret.registerClass(ColorTransform,'dragonBones.ColorTransform');
})(dragonBones || (dragonBones = {}));
