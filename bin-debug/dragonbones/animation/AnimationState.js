var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 动画状态，播放动画时产生，可以对单个动画的播放进行更细致的控制和调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    var AnimationState = (function (_super) {
        __extends(AnimationState, _super);
        /**
         * @private
         */
        function AnimationState() {
            _super.call(this);
            /**
             * @private
             */
            this._boneMask = [];
            /**
             * @private
             */
            this._boneTimelines = [];
            /**
             * @private
             */
            this._slotTimelines = [];
            /**
             * @private
             */
            this._ffdTimelines = [];
            /**
             * @deprecated
             */
            this.autoTween = false;
        }
        var d = __define,c=AnimationState,p=c.prototype;
        /**
         * @private
         */
        AnimationState.toString = function () {
            return "[Class dragonBones.AnimationState]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            self.displayControl = true;
            self.additiveBlending = false;
            self.playTimes = 1;
            self.timeScale = 1;
            self.weight = 1;
            self.autoFadeOutTime = -1;
            self.fadeTotalTime = 0;
            self._isFadeOutComplete = false;
            self._layer = 0;
            self._position = 0;
            self._duration = 0;
            self._weightResult = 0;
            self._fadeProgress = 0;
            self._group = null;
            if (self._timeline) {
                self._timeline.returnToPool();
                self._timeline = null;
            }
            self._isPlaying = true;
            self._isPausePlayhead = false;
            self._isFadeOut = false;
            self._currentPlayTimes = 0;
            self._fadeTime = 0;
            self._time = 0;
            self._name = null;
            self._armature = null;
            self._animationData = null;
            if (self._boneMask.length) {
                self._boneMask.length = 0;
            }
            for (var i = 0, l = self._boneTimelines.length; i < l; ++i) {
                self._boneTimelines[i].returnToPool();
            }
            for (var i = 0, l = self._slotTimelines.length; i < l; ++i) {
                self._slotTimelines[i].returnToPool();
            }
            for (var i = 0, l = self._ffdTimelines.length; i < l; ++i) {
                self._ffdTimelines[i].returnToPool();
            }
            self._boneTimelines.length = 0;
            self._slotTimelines.length = 0;
            self._ffdTimelines.length = 0;
        };
        /**
         * @private
         */
        p._advanceFadeTime = function (passedTime) {
            var self = this;
            if (passedTime < 0) {
                passedTime = -passedTime;
            }
            self._fadeTime += passedTime;
            var fadeProgress = 0;
            if (self._fadeTime >= self.fadeTotalTime) {
                fadeProgress = self._isFadeOut ? 0 : 1;
            }
            else if (self._fadeTime > 0) {
                fadeProgress = self._isFadeOut ? (1 - self._fadeTime / self.fadeTotalTime) : (self._fadeTime / self.fadeTotalTime);
            }
            else {
                fadeProgress = self._isFadeOut ? 1 : 0;
            }
            if (self._fadeProgress != fadeProgress) {
                self._fadeProgress = fadeProgress;
                var eventDispatcher = self._armature._display;
                if (self._fadeTime <= passedTime) {
                    if (self._isFadeOut) {
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_OUT)) {
                            var event_1 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_1.animationState = this;
                            self._armature._bufferEvent(event_1, dragonBones.EventObject.FADE_OUT);
                        }
                    }
                    else {
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_IN)) {
                            var event_2 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_2.animationState = this;
                            self._armature._bufferEvent(event_2, dragonBones.EventObject.FADE_IN);
                        }
                    }
                }
                if (self._fadeTime >= self.fadeTotalTime) {
                    if (self._isFadeOut) {
                        self._isFadeOutComplete = true;
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_OUT_COMPLETE)) {
                            var event_3 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_3.animationState = this;
                            self._armature._bufferEvent(event_3, dragonBones.EventObject.FADE_OUT_COMPLETE);
                        }
                    }
                    else {
                        self._isPausePlayhead = false;
                        if (eventDispatcher.hasEvent(dragonBones.EventObject.FADE_IN_COMPLETE)) {
                            var event_4 = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                            event_4.animationState = this;
                            self._armature._bufferEvent(event_4, dragonBones.EventObject.FADE_IN_COMPLETE);
                        }
                    }
                }
            }
        };
        /**
         * @private
         */
        p._isDisabled = function (slot) {
            if (this.displayControl &&
                (!slot.displayController ||
                    slot.displayController == this._name ||
                    slot.displayController == this._group)) {
                return false;
            }
            return true;
        };
        /**
         * @private
         */
        p._fadeIn = function (armature, clip, animationName, playTimes, position, duration, time, timeScale, fadeInTime, pausePlayhead) {
            var self = this;
            self._armature = armature;
            self._animationData = clip;
            self._name = animationName;
            self.playTimes = playTimes;
            self.timeScale = timeScale;
            self.fadeTotalTime = fadeInTime;
            self._position = position;
            self._duration = duration;
            self._time = time;
            self._isPausePlayhead = pausePlayhead;
            if (self.fadeTotalTime == 0) {
                self._fadeProgress = 0.999999;
            }
            self._timeline = dragonBones.BaseObject.borrowObject(dragonBones.AnimationTimelineState);
            self._timeline.fadeIn(self._armature, self, self._animationData, self._time);
            self._updateTimelineStates();
        };
        /**
         * @private
         */
        p._updateTimelineStates = function () {
            var self = this;
            var time = self._time;
            if (!self._animationData.hasAsynchronyTimeline) {
                time = self._timeline._currentTime;
            }
            var boneTimelineStates = {};
            var slotTimelineStates = {};
            for (var i = 0, l = self._boneTimelines.length; i < l; ++i) {
                var boneTimelineState = self._boneTimelines[i];
                boneTimelineStates[boneTimelineState.bone.name] = boneTimelineState;
            }
            var bones = self._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                var boneTimelineName = bone.name;
                var boneTimelineData = self._animationData.getBoneTimeline(boneTimelineName);
                if (boneTimelineData && self.containsBoneMask(boneTimelineName)) {
                    var boneTimelineState = boneTimelineStates[boneTimelineName];
                    if (boneTimelineState) {
                        delete boneTimelineStates[boneTimelineName];
                    }
                    else {
                        boneTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.BoneTimelineState);
                        boneTimelineState.bone = bone;
                        boneTimelineState.fadeIn(self._armature, this, boneTimelineData, time);
                        self._boneTimelines.push(boneTimelineState);
                    }
                }
            }
            for (var i in boneTimelineStates) {
                var boneTimelineState = boneTimelineStates[i];
                boneTimelineState.bone.invalidUpdate();
                self._boneTimelines.splice(self._boneTimelines.indexOf(boneTimelineState), 1);
                boneTimelineState.returnToPool();
            }
            //
            for (var i = 0, l = self._slotTimelines.length; i < l; ++i) {
                var slotTimelineState = self._slotTimelines[i];
                slotTimelineStates[slotTimelineState.slot.name] = slotTimelineState;
            }
            var slots = self._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                var slotTimelineName = slot.name;
                var parentTimelineName = slot.parent.name;
                var slotTimelineData = self._animationData.getSlotTimeline(slotTimelineName);
                if (slotTimelineData && self.containsBoneMask(parentTimelineName) && !self._isFadeOut) {
                    var slotTimelineState = slotTimelineStates[slotTimelineName];
                    if (slotTimelineState) {
                        delete slotTimelineStates[slotTimelineName];
                    }
                    else {
                        slotTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.SlotTimelineState);
                        slotTimelineState.slot = slot;
                        slotTimelineState.fadeIn(self._armature, this, slotTimelineData, time);
                        self._slotTimelines.push(slotTimelineState);
                    }
                }
            }
            for (var i in slotTimelineStates) {
                var slotTimelineState = slotTimelineStates[i];
                self._slotTimelines.splice(self._slotTimelines.indexOf(slotTimelineState), 1);
                slotTimelineState.returnToPool();
            }
            self._updateFFDTimelineStates();
        };
        /**
         * @private
         */
        p._updateFFDTimelineStates = function () {
            var self = this;
            var time = self._time;
            if (!self._animationData.hasAsynchronyTimeline) {
                time = self._timeline._currentTime;
            }
            var ffdTimelineStates = {};
            for (var i = 0, l = self._ffdTimelines.length; i < l; ++i) {
                var ffdTimelineState = self._ffdTimelines[i];
                ffdTimelineStates[ffdTimelineState.slot.name] = ffdTimelineState;
            }
            var slots = self._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                var slotTimelineName = slot.name;
                var parentTimelineName = slot.parent.name;
                if (slot._meshData) {
                    var ffdTimelineData = self._animationData.getFFDTimeline(self._armature._skinData.name, slotTimelineName, slot.displayIndex);
                    if (ffdTimelineData && self.containsBoneMask(parentTimelineName)) {
                        var ffdTimelineState = ffdTimelineStates[slotTimelineName];
                        if (ffdTimelineState) {
                            delete ffdTimelineStates[slotTimelineName];
                        }
                        else {
                            ffdTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.FFDTimelineState);
                            ffdTimelineState.slot = slot;
                            ffdTimelineState.fadeIn(self._armature, this, ffdTimelineData, time);
                            self._ffdTimelines.push(ffdTimelineState);
                        }
                    }
                    else {
                        for (var iF = 0, lF = slot._ffdVertices.length; iF < lF; ++iF) {
                            slot._ffdVertices[iF] = 0;
                        }
                        slot._ffdDirty = true;
                    }
                }
            }
            for (var i in ffdTimelineStates) {
                var ffdTimelineState = ffdTimelineStates[i];
                ffdTimelineState.slot._ffdDirty = true;
                self._ffdTimelines.splice(self._ffdTimelines.indexOf(ffdTimelineState), 1);
                ffdTimelineState.returnToPool();
            }
        };
        /**
         * @private
         */
        p._advanceTime = function (passedTime, weightLeft, index) {
            var self = this;
            if (passedTime != 0) {
                self._advanceFadeTime(passedTime);
            }
            // Update time.
            passedTime *= self.timeScale;
            if (passedTime != 0 && self._isPlaying && !self._isPausePlayhead) {
                self._time += passedTime;
            }
            // Blend weight.
            self._weightResult = self.weight * self._fadeProgress * weightLeft;
            if (self._weightResult != 0) {
                var isCacheEnabled = self._fadeProgress >= 1 && index == 0 && self._armature.cacheFrameRate > 0;
                var cacheTimeToFrameScale = self._animationData.cacheTimeToFrameScale;
                var isUpdatesTimeline = true;
                var isUpdatesBoneTimeline = true;
                var time = isCacheEnabled ? (Math.floor(self._time * cacheTimeToFrameScale) / cacheTimeToFrameScale) : self._time; // Cache time internval.
                // Update main timeline.                
                self._timeline.update(time);
                if (!self._animationData.hasAsynchronyTimeline) {
                    time = self._timeline._currentTime;
                }
                if (isCacheEnabled) {
                    var cacheFrameIndex = Math.floor(self._timeline._currentTime * cacheTimeToFrameScale);
                    if (self._armature._cacheFrameIndex == cacheFrameIndex) {
                        isUpdatesTimeline = false;
                        isUpdatesBoneTimeline = false;
                    }
                    else {
                        self._armature._cacheFrameIndex = cacheFrameIndex;
                        if (self._armature._animation._animationStateDirty) {
                            self._armature._animation._animationStateDirty = false;
                            for (var i = 0, l = self._boneTimelines.length; i < l; ++i) {
                                var boneTimeline = self._boneTimelines[i];
                                boneTimeline.bone._cacheFrames = boneTimeline._timeline.cachedFrames;
                            }
                            for (var i = 0, l = self._slotTimelines.length; i < l; ++i) {
                                var slotTimeline = self._slotTimelines[i];
                                slotTimeline.slot._cacheFrames = slotTimeline._timeline.cachedFrames;
                            }
                        }
                        if (self._animationData.cachedFrames[cacheFrameIndex]) {
                            isUpdatesBoneTimeline = false;
                        }
                        else {
                            self._animationData.cachedFrames[cacheFrameIndex] = true;
                        }
                    }
                }
                else {
                    self._armature._cacheFrameIndex = -1;
                }
                if (isUpdatesTimeline) {
                    if (isUpdatesBoneTimeline) {
                        for (var i = 0, l = self._boneTimelines.length; i < l; ++i) {
                            self._boneTimelines[i].update(time);
                        }
                    }
                    for (var i = 0, l = self._slotTimelines.length; i < l; ++i) {
                        self._slotTimelines[i].update(time);
                    }
                    for (var i = 0, l = self._ffdTimelines.length; i < l; ++i) {
                        self._ffdTimelines[i].update(time);
                    }
                }
            }
            if (self.autoFadeOutTime >= 0 && self._fadeProgress >= 1 && self._timeline._isCompleted) {
                self.fadeOut(self.autoFadeOutTime);
            }
        };
        /**
         * @language zh_CN
         * 继续播放。
         * @version DragonBones 3.0
         */
        p.play = function () {
            this._isPlaying = true;
        };
        /**
         * @language zh_CN
         * 暂停播放。
         * @version DragonBones 3.0
         */
        p.stop = function () {
            this._isPlaying = false;
        };
        /**
         * @language zh_CN
         * 淡出动画。
         * @param fadeOutTime 淡出时间。 (以秒为单位)
         * @param pausePlayhead 淡出时是否暂停动画。 [true: 暂停, false: 不暂停]
         * @version DragonBones 3.0
         */
        p.fadeOut = function (fadeOutTime, pausePlayhead) {
            if (pausePlayhead === void 0) { pausePlayhead = true; }
            var self = this;
            if (fadeOutTime < 0 || fadeOutTime != fadeOutTime) {
                fadeOutTime = 0;
            }
            self._isPausePlayhead = pausePlayhead;
            if (self._isFadeOut) {
                if (fadeOutTime > fadeOutTime - self._fadeTime) {
                    // If the animation is already in fade out, the new fade out will be ignored.
                    return;
                }
            }
            else {
                self._isFadeOut = true;
                if (fadeOutTime == 0 || self._fadeProgress <= 0) {
                    self._fadeProgress = 0.000001;
                }
                for (var i = 0, l = self._boneTimelines.length; i < l; ++i) {
                    self._boneTimelines[i].fadeOut();
                }
                for (var i = 0, l = self._slotTimelines.length; i < l; ++i) {
                    self._slotTimelines[i].fadeOut();
                }
            }
            self.displayControl = false;
            self.fadeTotalTime = self._fadeProgress > 0.000001 ? fadeOutTime / self._fadeProgress : 0;
            self._fadeTime = self.fadeTotalTime * (1 - self._fadeProgress);
        };
        /**
         * @language zh_CN
         * 是否包含指定的骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @version DragonBones 3.0
         */
        p.containsBoneMask = function (name) {
            return !this._boneMask.length || this._boneMask.indexOf(name) >= 0;
        };
        /**
         * @language zh_CN
         * 添加指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         */
        p.addBoneMask = function (name, recursive) {
            if (recursive === void 0) { recursive = true; }
            var self = this;
            var currentBone = self._armature.getBone(name);
            if (!currentBone) {
                return;
            }
            if (self._boneMask.indexOf(name) < 0 &&
                self._animationData.getBoneTimeline(name)) {
                self._boneMask.push(name);
            }
            if (recursive) {
                var bones = self._armature.getBones();
                for (var i = 0, l = bones.length; i < l; ++i) {
                    var bone = bones[i];
                    var boneName = bone.name;
                    if (self._boneMask.indexOf(boneName) < 0 &&
                        self._animationData.getBoneTimeline(boneName) &&
                        currentBone.contains(bone)) {
                        self._boneMask.push(boneName);
                    }
                }
            }
            self._updateTimelineStates();
        };
        /**
         * @language zh_CN
         * 删除指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         */
        p.removeBoneMask = function (name, recursive) {
            if (recursive === void 0) { recursive = true; }
            var self = this;
            var index = self._boneMask.indexOf(name);
            if (index >= 0) {
                self._boneMask.splice(index, 1);
            }
            if (recursive) {
                var currentBone = self._armature.getBone(name);
                if (currentBone) {
                    var bones = self._armature.getBones();
                    for (var i = 0, l = bones.length; i < l; ++i) {
                        var bone = bones[i];
                        var boneName = bone.name;
                        var index_1 = self._boneMask.indexOf(boneName);
                        if (index_1 >= 0 &&
                            currentBone.contains(bone)) {
                            self._boneMask.splice(index_1, 1);
                        }
                    }
                }
            }
            self._updateTimelineStates();
        };
        /**
         * @language zh_CN
         * 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         */
        p.removeAllBoneMask = function () {
            this._boneMask.length = 0;
            this._updateTimelineStates();
        };
        d(p, "layer"
            /**
             * @language zh_CN
             * 动画图层。
             * @see dragonBones.Animation#fadeIn()
             * @version DragonBones 3.0
             */
            ,function () {
                return this._layer;
            }
        );
        d(p, "group"
            /**
             * @language zh_CN
             * 动画组。
             * @see dragonBones.Animation#fadeIn()
             * @version DragonBones 3.0
             */
            ,function () {
                return this._group;
            }
        );
        d(p, "name"
            /**
             * @language zh_CN
             * 动画名称。
             * @see dragonBones.AnimationData#name
             * @version DragonBones 3.0
             */
            ,function () {
                return this._name;
            }
        );
        d(p, "animationData"
            /**
             * @language zh_CN
             * 动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 3.0
             */
            ,function () {
                return this._animationData;
            }
        );
        d(p, "isCompleted"
            /**
             * @language zh_CN
             * 是否播放完毕。
             * @version DragonBones 3.0
             */
            ,function () {
                return this._timeline._isCompleted;
            }
        );
        d(p, "isPlaying"
            /**
             * @language zh_CN
             * 是否正在播放。
             * @version DragonBones 3.0
             */
            ,function () {
                return (this._isPlaying && !this._timeline._isCompleted);
            }
        );
        d(p, "currentPlayTimes"
            /**
             * @language zh_CN
             * 当前动画的播放次数。
             * @version DragonBones 3.0
             */
            ,function () {
                return this._currentPlayTimes;
            }
        );
        d(p, "totalTime"
            /**
             * @language zh_CN
             * 当前动画的总时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            ,function () {
                return this._duration;
            }
        );
        d(p, "currentTime"
            /**
             * @language zh_CN
             * 当前动画的播放时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            ,function () {
                return this._timeline._currentTime;
            }
            ,function (value) {
                var self = this;
                if (value < 0 || value != value) {
                    value = 0;
                }
                self._time = value;
                self._timeline.setCurrentTime(self._time);
                if (self._weightResult != 0) {
                    var time = self._time;
                    if (!self._animationData.hasAsynchronyTimeline) {
                        time = self._timeline._currentTime;
                    }
                    for (var i = 0, l = self._boneTimelines.length; i < l; ++i) {
                        self._boneTimelines[i].setCurrentTime(time);
                    }
                    for (var i = 0, l = self._slotTimelines.length; i < l; ++i) {
                        self._slotTimelines[i].setCurrentTime(time);
                    }
                    for (var i = 0, l = self._ffdTimelines.length; i < l; ++i) {
                        self._ffdTimelines[i].setCurrentTime(time);
                    }
                }
            }
        );
        d(p, "clip"
            /**
             * @deprecated
             * @see #animationData
             * @version DragonBones 3.0
             */
            ,function () {
                return this._animationData;
            }
        );
        return AnimationState;
    }(dragonBones.BaseObject));
    dragonBones.AnimationState = AnimationState;
    egret.registerClass(AnimationState,'dragonBones.AnimationState');
})(dragonBones || (dragonBones = {}));
