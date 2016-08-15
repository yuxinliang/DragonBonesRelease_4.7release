var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var TimelineData = (function (_super) {
        __extends(TimelineData, _super);
        function TimelineData() {
            _super.call(this);
            /**
             * @private
             */
            this.frames = [];
        }
        var d = __define,c=TimelineData,p=c.prototype;
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            self.scale = 1;
            self.offset = 0;
            if (self.frames.length) {
                var prevFrame = null;
                for (var i = 0, l = self.frames.length; i < l; ++i) {
                    var frame = self.frames[i];
                    if (prevFrame && frame != prevFrame) {
                        prevFrame.returnToPool();
                    }
                    prevFrame = frame;
                }
                self.frames.length = 0;
            }
        };
        return TimelineData;
    }(dragonBones.BaseObject));
    dragonBones.TimelineData = TimelineData;
    egret.registerClass(TimelineData,'dragonBones.TimelineData');
    /**
     * @private
     */
    var BoneTimelineData = (function (_super) {
        __extends(BoneTimelineData, _super);
        function BoneTimelineData() {
            _super.call(this);
            this.bone = null;
            this.originTransform = new dragonBones.Transform();
            this.cachedFrames = [];
        }
        var d = __define,c=BoneTimelineData,p=c.prototype;
        BoneTimelineData.cacheFrame = function (cacheFrames, cacheFrameIndex, globalTransformMatrix) {
            var cacheMatrix = cacheFrames[cacheFrameIndex] = new dragonBones.Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);
            return cacheMatrix;
        };
        BoneTimelineData.toString = function () {
            return "[Class dragonBones.BoneTimelineData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            self.bone = null;
            self.originTransform.identity();
            if (self.cachedFrames.length) {
                self.cachedFrames.length = 0;
            }
        };
        p.cacheFrames = function (cacheFrameCount) {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        };
        return BoneTimelineData;
    }(TimelineData));
    dragonBones.BoneTimelineData = BoneTimelineData;
    egret.registerClass(BoneTimelineData,'dragonBones.BoneTimelineData');
    /**
     * @private
     */
    var SlotTimelineData = (function (_super) {
        __extends(SlotTimelineData, _super);
        function SlotTimelineData() {
            _super.call(this);
            this.slot = null;
            this.cachedFrames = [];
        }
        var d = __define,c=SlotTimelineData,p=c.prototype;
        SlotTimelineData.cacheFrame = function (cacheFrames, cacheFrameIndex, globalTransformMatrix) {
            var cacheMatrix = cacheFrames[cacheFrameIndex] = new dragonBones.Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);
            return cacheMatrix;
        };
        SlotTimelineData.toString = function () {
            return "[Class dragonBones.SlotTimelineData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            self.slot = null;
            if (self.cachedFrames.length) {
                self.cachedFrames.length = 0;
            }
        };
        p.cacheFrames = function (cacheFrameCount) {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        };
        return SlotTimelineData;
    }(TimelineData));
    dragonBones.SlotTimelineData = SlotTimelineData;
    egret.registerClass(SlotTimelineData,'dragonBones.SlotTimelineData');
    /**
     * @private
     */
    var FFDTimelineData = (function (_super) {
        __extends(FFDTimelineData, _super);
        function FFDTimelineData() {
            _super.call(this);
            this.displayIndex = 0;
            this.skin = null;
            this.slot = null;
        }
        var d = __define,c=FFDTimelineData,p=c.prototype;
        FFDTimelineData.toString = function () {
            return "[Class dragonBones.FFDTimelineData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            self.displayIndex = 0;
            self.skin = null;
            self.slot = null;
        };
        return FFDTimelineData;
    }(TimelineData));
    dragonBones.FFDTimelineData = FFDTimelineData;
    egret.registerClass(FFDTimelineData,'dragonBones.FFDTimelineData');
})(dragonBones || (dragonBones = {}));
