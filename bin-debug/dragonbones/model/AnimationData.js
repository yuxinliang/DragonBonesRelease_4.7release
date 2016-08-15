var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 动画数据。
     * @version DragonBones 3.0
     */
    var AnimationData = (function (_super) {
        __extends(AnimationData, _super);
        /**
         * @private
         */
        function AnimationData() {
            _super.call(this);
            /**
             * @private
             */
            this.boneTimelines = {};
            /**
             * @private
             */
            this.slotTimelines = {};
            /**
             * @private
             */
            this.ffdTimelines = {}; // skin slot displayIndex
            /**
             * @private
             */
            this.cachedFrames = [];
        }
        var d = __define,c=AnimationData,p=c.prototype;
        /**
         * @private
         */
        AnimationData.toString = function () {
            return "[Class dragonBones.AnimationData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            self.hasAsynchronyTimeline = false;
            self.cacheTimeToFrameScale = 0;
            self.position = 0;
            self.duration = 0;
            self.playTimes = 0;
            self.fadeInTime = 0;
            self.name = null;
            self.animation = null;
            for (var i in self.boneTimelines) {
                self.boneTimelines[i].returnToPool();
                delete self.boneTimelines[i];
            }
            for (var i in self.slotTimelines) {
                self.slotTimelines[i].returnToPool();
                delete self.slotTimelines[i];
            }
            for (var i in self.ffdTimelines) {
                for (var j in self.ffdTimelines[i]) {
                    for (var k in self.ffdTimelines[i][j]) {
                        self.ffdTimelines[i][j][k].returnToPool();
                    }
                }
                delete self.ffdTimelines[i];
            }
            if (self.cachedFrames.length) {
                self.cachedFrames.length = 0;
            }
        };
        /**
         * @private
         */
        p.cacheFrames = function (value) {
            var self = this;
            if (self.animation) {
                return;
            }
            var cacheFrameCount = Math.max(Math.floor(self.frameCount * self.scale * value), 1);
            self.cacheTimeToFrameScale = cacheFrameCount / (self.duration + 0.000001); //
            self.cachedFrames.length = 0;
            self.cachedFrames.length = cacheFrameCount;
            for (var i in self.boneTimelines) {
                self.boneTimelines[i].cacheFrames(cacheFrameCount);
            }
            for (var i in self.slotTimelines) {
                self.slotTimelines[i].cacheFrames(cacheFrameCount);
            }
        };
        /**
         * @private
         */
        p.addBoneTimeline = function (value) {
            if (value && value.bone && !this.boneTimelines[value.bone.name]) {
                this.boneTimelines[value.bone.name] = value;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        p.addSlotTimeline = function (value) {
            if (value && value.slot && !this.slotTimelines[value.slot.name]) {
                this.slotTimelines[value.slot.name] = value;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        p.addFFDTimeline = function (value) {
            if (value && value.skin && value.slot) {
                var skin = this.ffdTimelines[value.skin.name] = this.ffdTimelines[value.skin.name] || {};
                var slot = skin[value.slot.slot.name] = skin[value.slot.slot.name] || {};
                if (!slot[value.displayIndex]) {
                    slot[value.displayIndex] = value;
                }
                else {
                    throw new Error();
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        p.getBoneTimeline = function (name) {
            return this.boneTimelines[name];
        };
        /**
         * @private
         */
        p.getSlotTimeline = function (name) {
            return this.slotTimelines[name];
        };
        /**
         * @private
         */
        p.getFFDTimeline = function (skinName, slotName, displayIndex) {
            var skin = this.ffdTimelines[skinName];
            if (skin) {
                var slot = skin[slotName];
                if (slot) {
                    return slot[displayIndex];
                }
            }
            return null;
        };
        return AnimationData;
    }(dragonBones.TimelineData));
    dragonBones.AnimationData = AnimationData;
    egret.registerClass(AnimationData,'dragonBones.AnimationData');
})(dragonBones || (dragonBones = {}));
