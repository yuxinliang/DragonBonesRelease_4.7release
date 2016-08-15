var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var ActionData = (function (_super) {
        __extends(ActionData, _super);
        function ActionData() {
            _super.call(this);
        }
        var d = __define,c=ActionData,p=c.prototype;
        ActionData.toString = function () {
            return "[Class dragonBones.ActionData]";
        };
        p._onClear = function () {
            var self = this;
            self.type = 0 /* Play */;
            self.data = null;
            self.bone = null;
            self.slot = null;
        };
        return ActionData;
    }(dragonBones.BaseObject));
    dragonBones.ActionData = ActionData;
    egret.registerClass(ActionData,'dragonBones.ActionData');
    /**
     * @private
     */
    var EventData = (function (_super) {
        __extends(EventData, _super);
        function EventData() {
            _super.call(this);
        }
        var d = __define,c=EventData,p=c.prototype;
        EventData.toString = function () {
            return "[Class dragonBones.EventData]";
        };
        p._onClear = function () {
            var self = this;
            self.type = 0 /* Frame */;
            self.name = null;
            self.data = null;
            self.bone = null;
            self.slot = null;
        };
        return EventData;
    }(dragonBones.BaseObject));
    dragonBones.EventData = EventData;
    egret.registerClass(EventData,'dragonBones.EventData');
    /**
     * @private
     */
    var FrameData = (function (_super) {
        __extends(FrameData, _super);
        function FrameData() {
            _super.call(this);
        }
        var d = __define,c=FrameData,p=c.prototype;
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            self.position = 0;
            self.duration = 0;
            self.prev = null;
            self.next = null;
        };
        return FrameData;
    }(dragonBones.BaseObject));
    dragonBones.FrameData = FrameData;
    egret.registerClass(FrameData,'dragonBones.FrameData');
    /**
     * @private
     */
    var TweenFrameData = (function (_super) {
        __extends(TweenFrameData, _super);
        function TweenFrameData() {
            _super.call(this);
        }
        var d = __define,c=TweenFrameData,p=c.prototype;
        TweenFrameData.samplingCurve = function (curve, frameCount) {
            if (curve.length == 0 || frameCount == 0) {
                return null;
            }
            var samplingTimes = frameCount + 2;
            var samplingStep = 1 / samplingTimes;
            var sampling = new Array((samplingTimes - 1) * 2);
            //
            curve.unshift(0, 0);
            curve.push(1, 1);
            var stepIndex = 0;
            for (var i = 0; i < samplingTimes - 1; ++i) {
                var step = samplingStep * (i + 1);
                while (curve[stepIndex + 6] < step) {
                    stepIndex += 6; // stepIndex += 3 * 2
                }
                var x1 = curve[stepIndex];
                var x4 = curve[stepIndex + 6];
                var t = (step - x1) / (x4 - x1);
                var l_t = 1 - t;
                var powA = l_t * l_t;
                var powB = t * t;
                var kA = l_t * powA;
                var kB = 3 * t * powA;
                var kC = 3 * l_t * powB;
                var kD = t * powB;
                sampling[i * 2] = kA * x1 + kB * curve[stepIndex + 2] + kC * curve[stepIndex + 4] + kD * x4;
                sampling[i * 2 + 1] = kA * curve[stepIndex + 1] + kB * curve[stepIndex + 3] + kC * curve[stepIndex + 5] + kD * curve[stepIndex + 7];
            }
            return sampling;
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            _super.prototype._onClear.call(this);
            this.tweenEasing = 0;
            this.curve = null;
        };
        return TweenFrameData;
    }(FrameData));
    dragonBones.TweenFrameData = TweenFrameData;
    egret.registerClass(TweenFrameData,'dragonBones.TweenFrameData');
    /**
     * @private
     */
    var AnimationFrameData = (function (_super) {
        __extends(AnimationFrameData, _super);
        function AnimationFrameData() {
            _super.call(this);
            this.actions = [];
            this.events = [];
        }
        var d = __define,c=AnimationFrameData,p=c.prototype;
        AnimationFrameData.toString = function () {
            return "[Class dragonBones.AnimationFrameData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            if (self.actions.length) {
                for (var i = 0, l = self.actions.length; i < l; ++i) {
                    self.actions[i].returnToPool();
                }
                self.actions.length = 0;
            }
            if (self.events.length) {
                for (var i = 0, l = self.events.length; i < l; ++i) {
                    self.events[i].returnToPool();
                }
                self.events.length = 0;
            }
        };
        return AnimationFrameData;
    }(FrameData));
    dragonBones.AnimationFrameData = AnimationFrameData;
    egret.registerClass(AnimationFrameData,'dragonBones.AnimationFrameData');
    /**
     * @private
     */
    var BoneFrameData = (function (_super) {
        __extends(BoneFrameData, _super);
        function BoneFrameData() {
            _super.call(this);
            this.transform = new dragonBones.Transform();
        }
        var d = __define,c=BoneFrameData,p=c.prototype;
        BoneFrameData.toString = function () {
            return "[Class dragonBones.BoneFrameData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            self.tweenScale = false;
            self.tweenRotate = 0;
            self.transform.identity();
        };
        return BoneFrameData;
    }(TweenFrameData));
    dragonBones.BoneFrameData = BoneFrameData;
    egret.registerClass(BoneFrameData,'dragonBones.BoneFrameData');
    /**
     * @private
     */
    var SlotFrameData = (function (_super) {
        __extends(SlotFrameData, _super);
        function SlotFrameData() {
            _super.call(this);
        }
        var d = __define,c=SlotFrameData,p=c.prototype;
        SlotFrameData.generateColor = function () {
            return new dragonBones.ColorTransform();
        };
        SlotFrameData.toString = function () {
            return "[Class dragonBones.SlotFrameData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            self.displayIndex = 0;
            self.zOrder = 0;
            self.color = null;
        };
        SlotFrameData.DEFAULT_COLOR = new dragonBones.ColorTransform();
        return SlotFrameData;
    }(TweenFrameData));
    dragonBones.SlotFrameData = SlotFrameData;
    egret.registerClass(SlotFrameData,'dragonBones.SlotFrameData');
    /**
     * @private
     */
    var ExtensionFrameData = (function (_super) {
        __extends(ExtensionFrameData, _super);
        function ExtensionFrameData() {
            _super.call(this);
            this.tweens = [];
            this.keys = [];
        }
        var d = __define,c=ExtensionFrameData,p=c.prototype;
        ExtensionFrameData.toString = function () {
            return "[Class dragonBones.ExtensionFrameData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            self.type = 0 /* FFD */;
            if (self.tweens.length) {
                self.tweens.length = 0;
            }
            if (self.keys.length) {
                self.keys.length = 0;
            }
        };
        return ExtensionFrameData;
    }(TweenFrameData));
    dragonBones.ExtensionFrameData = ExtensionFrameData;
    egret.registerClass(ExtensionFrameData,'dragonBones.ExtensionFrameData');
})(dragonBones || (dragonBones = {}));
