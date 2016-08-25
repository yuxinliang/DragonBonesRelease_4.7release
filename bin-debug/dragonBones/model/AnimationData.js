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
            return "[class dragonBones.AnimationData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            _super.prototype._onClear.call(this);
            this.hasAsynchronyTimeline = false;
            this.cacheTimeToFrameScale = 0;
            this.position = 0;
            this.duration = 0;
            this.playTimes = 0;
            this.fadeInTime = 0;
            this.name = null;
            this.animation = null;
            for (var i in this.boneTimelines) {
                this.boneTimelines[i].returnToPool();
                delete this.boneTimelines[i];
            }
            for (var i in this.slotTimelines) {
                this.slotTimelines[i].returnToPool();
                delete this.slotTimelines[i];
            }
            for (var i in this.ffdTimelines) {
                for (var j in this.ffdTimelines[i]) {
                    for (var k in this.ffdTimelines[i][j]) {
                        this.ffdTimelines[i][j][k].returnToPool();
                    }
                }
                delete this.ffdTimelines[i];
            }
            if (this.cachedFrames.length) {
                this.cachedFrames.length = 0;
            }
        };
        /**
         * @private
         */
        p.cacheFrames = function (value) {
            if (this.animation) {
                return;
            }
            var cacheFrameCount = Math.max(Math.floor((this.frameCount + 1) * this.scale * value), 1);
            this.cacheTimeToFrameScale = cacheFrameCount / (this.duration + 0.000001); //
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
            for (var i in this.boneTimelines) {
                this.boneTimelines[i].cacheFrames(cacheFrameCount);
            }
            for (var i in this.slotTimelines) {
                this.slotTimelines[i].cacheFrames(cacheFrameCount);
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
