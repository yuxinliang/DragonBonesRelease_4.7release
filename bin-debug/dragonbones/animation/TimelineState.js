var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var AnimationTimelineState = (function (_super) {
        __extends(AnimationTimelineState, _super);
        function AnimationTimelineState() {
            _super.call(this);
        }
        var d = __define,c=AnimationTimelineState,p=c.prototype;
        AnimationTimelineState.toString = function () {
            return "[Class dragonBones.AnimationTimelineState]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            _super.prototype._onClear.call(this);
            this._isStarted = false;
        };
        p._onCrossFrame = function (frame) {
            var self = this;
            var actions = frame.actions;
            for (var i = 0, l = actions.length; i < l; ++i) {
                var actionData = actions[i];
                if (actionData.slot) {
                    var slot = self._armature.getSlot(actionData.slot.name);
                    if (slot) {
                        var childArmature = slot.childArmature;
                        if (childArmature) {
                            childArmature._action = actionData;
                        }
                    }
                }
                else if (actionData.bone) {
                    var slots = self._armature.getSlots();
                    for (var i_1 = 0, l_1 = slots.length; i_1 < l_1; ++i_1) {
                        var eachChildArmature = slots[i_1].childArmature;
                        if (eachChildArmature) {
                            eachChildArmature._action = actionData;
                        }
                    }
                }
                else {
                    self._armature._action = actionData;
                }
            }
            var eventDispatcher = self._armature._display;
            var events = frame.events;
            for (var i = 0, l = events.length; i < l; ++i) {
                var eventData = events[i];
                var eventType = "";
                switch (eventData.type) {
                    case 0 /* Frame */:
                        eventType = dragonBones.EventObject.FRAME_EVENT;
                        break;
                    case 1 /* Sound */:
                        eventType = dragonBones.EventObject.SOUND_EVENT;
                        break;
                }
                if (eventDispatcher.hasEvent(eventType)) {
                    var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                    eventObject.animationState = self._animationState;
                    if (eventData.bone) {
                        eventObject.bone = self._armature.getBone(eventData.bone.name);
                    }
                    if (eventData.slot) {
                        eventObject.slot = self._armature.getSlot(eventData.slot.name);
                    }
                    eventObject.name = eventData.name;
                    eventObject.data = eventData.data;
                    self._armature._bufferEvent(eventObject, eventType);
                }
            }
        };
        p.update = function (time) {
            var self = this;
            var prevPlayTimes = self._currentPlayTimes;
            var eventDispatcher = self._armature._display;
            if (!self._isStarted && time != 0) {
                self._isStarted = true;
                if (eventDispatcher.hasEvent(dragonBones.EventObject.START)) {
                    var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                    eventObject.animationState = self._animationState;
                    self._armature._bufferEvent(eventObject, dragonBones.EventObject.START);
                }
            }
            _super.prototype.update.call(this, time);
            if (prevPlayTimes != self._currentPlayTimes) {
                var eventType = self._isCompleted ? dragonBones.EventObject.COMPLETE : dragonBones.EventObject.LOOP_COMPLETE;
                if (eventDispatcher.hasEvent(eventType)) {
                    var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                    eventObject.animationState = self._animationState;
                    self._armature._bufferEvent(eventObject, eventType);
                }
            }
        };
        return AnimationTimelineState;
    }(dragonBones.TimelineState));
    dragonBones.AnimationTimelineState = AnimationTimelineState;
    egret.registerClass(AnimationTimelineState,'dragonBones.AnimationTimelineState');
    /**
     * @private
     */
    var BoneTimelineState = (function (_super) {
        __extends(BoneTimelineState, _super);
        function BoneTimelineState() {
            _super.call(this);
            this._transform = new dragonBones.Transform();
            this._currentTransform = new dragonBones.Transform();
            this._durationTransform = new dragonBones.Transform();
        }
        var d = __define,c=BoneTimelineState,p=c.prototype;
        BoneTimelineState.toString = function () {
            return "[Class dragonBones.BoneTimelineState]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            self.bone = null;
            self._tweenTransform = 0 /* None */;
            self._tweenRotate = 0 /* None */;
            self._tweenScale = 0 /* None */;
            self._boneTransform = null;
            self._originTransform = null;
            self._transform.identity();
            self._currentTransform.identity();
            self._durationTransform.identity();
        };
        p._onFadeIn = function () {
            var self = this;
            self._originTransform = self._timeline.originTransform;
            self._boneTransform = self.bone._animationPose;
        };
        p._onArriveAtFrame = function (isUpdate) {
            var self = this;
            _super.prototype._onArriveAtFrame.call(this, isUpdate);
            self._currentTransform.copyFrom(self._currentFrame.transform);
            self._tweenTransform = 1 /* Once */;
            self._tweenRotate = 1 /* Once */;
            self._tweenScale = 1 /* Once */;
            if (self._keyFrameCount > 1 && (self._tweenEasing != dragonBones.DragonBones.NO_TWEEN || self._curve)) {
                var nextFrame = self._currentFrame.next;
                var nextTransform = nextFrame.transform;
                // Transform.
                self._durationTransform.x = nextTransform.x - self._currentTransform.x;
                self._durationTransform.y = nextTransform.y - self._currentTransform.y;
                if (self._durationTransform.x != 0 || self._durationTransform.y != 0) {
                    self._tweenTransform = 2 /* Always */;
                }
                // Rotate.
                var tweenRotate = self._currentFrame.tweenRotate;
                if (tweenRotate == tweenRotate) {
                    if (tweenRotate) {
                        if (tweenRotate > 0 ? nextTransform.skewY >= self._currentTransform.skewY : nextTransform.skewY <= self._currentTransform.skewY) {
                            var rotate = tweenRotate > 0 ? tweenRotate - 1 : tweenRotate + 1;
                            self._durationTransform.skewX = nextTransform.skewX - self._currentTransform.skewX + dragonBones.DragonBones.PI_D * rotate;
                            self._durationTransform.skewY = nextTransform.skewY - self._currentTransform.skewY + dragonBones.DragonBones.PI_D * rotate;
                        }
                        else {
                            self._durationTransform.skewX = nextTransform.skewX - self._currentTransform.skewX + dragonBones.DragonBones.PI_D * tweenRotate;
                            self._durationTransform.skewY = nextTransform.skewY - self._currentTransform.skewY + dragonBones.DragonBones.PI_D * tweenRotate;
                        }
                    }
                    else {
                        self._durationTransform.skewX = dragonBones.Transform.normalizeRadian(nextTransform.skewX - self._currentTransform.skewX);
                        self._durationTransform.skewY = dragonBones.Transform.normalizeRadian(nextTransform.skewY - self._currentTransform.skewY);
                    }
                    if (self._durationTransform.skewX != 0 || self._durationTransform.skewY != 0) {
                        self._tweenRotate = 2 /* Always */;
                    }
                }
                else {
                    self._durationTransform.skewX = 0;
                    self._durationTransform.skewY = 0;
                }
                // Scale.
                if (self._currentFrame.tweenScale) {
                    self._durationTransform.scaleX = nextTransform.scaleX - self._currentTransform.scaleX;
                    self._durationTransform.scaleY = nextTransform.scaleY - self._currentTransform.scaleY;
                    if (self._durationTransform.scaleX != 0 || self._durationTransform.scaleY != 0) {
                        self._tweenScale = 2 /* Always */;
                    }
                }
                else {
                    self._durationTransform.scaleX = 0;
                    self._durationTransform.scaleY = 0;
                }
            }
            else {
                self._durationTransform.x = 0;
                self._durationTransform.y = 0;
                self._durationTransform.skewX = 0;
                self._durationTransform.skewY = 0;
                self._durationTransform.scaleX = 0;
                self._durationTransform.scaleY = 0;
            }
        };
        p._onUpdateFrame = function (isUpdate) {
            var self = this;
            if (self._tweenTransform || self._tweenRotate || self._tweenScale) {
                _super.prototype._onUpdateFrame.call(this, isUpdate);
                if (self._tweenTransform) {
                    if (self._tweenTransform == 1 /* Once */) {
                        self._tweenTransform = 0 /* None */;
                    }
                    if (self._animationState.additiveBlending) {
                        self._transform.x = self._currentTransform.x + self._durationTransform.x * self._tweenProgress;
                        self._transform.y = self._currentTransform.y + self._durationTransform.y * self._tweenProgress;
                    }
                    else {
                        self._transform.x = self._originTransform.x + self._currentTransform.x + self._durationTransform.x * self._tweenProgress;
                        self._transform.y = self._originTransform.y + self._currentTransform.y + self._durationTransform.y * self._tweenProgress;
                    }
                }
                if (self._tweenRotate) {
                    if (self._tweenRotate == 1 /* Once */) {
                        self._tweenRotate = 0 /* None */;
                    }
                    if (self._animationState.additiveBlending) {
                        self._transform.skewX = self._currentTransform.skewX + self._durationTransform.skewX * self._tweenProgress;
                        self._transform.skewY = self._currentTransform.skewY + self._durationTransform.skewY * self._tweenProgress;
                    }
                    else {
                        self._transform.skewX = self._originTransform.skewX + self._currentTransform.skewX + self._durationTransform.skewX * self._tweenProgress;
                        self._transform.skewY = self._originTransform.skewY + self._currentTransform.skewY + self._durationTransform.skewY * self._tweenProgress;
                    }
                }
                if (self._tweenScale) {
                    if (self._tweenScale == 1 /* Once */) {
                        self._tweenScale = 0 /* None */;
                    }
                    if (self._animationState.additiveBlending) {
                        self._transform.scaleX = self._currentTransform.scaleX + self._durationTransform.scaleX * self._tweenProgress;
                        self._transform.scaleY = self._currentTransform.scaleY + self._durationTransform.scaleY * self._tweenProgress;
                    }
                    else {
                        self._transform.scaleX = self._originTransform.scaleX * (self._currentTransform.scaleX + self._durationTransform.scaleX * self._tweenProgress);
                        self._transform.scaleY = self._originTransform.scaleY * (self._currentTransform.scaleY + self._durationTransform.scaleY * self._tweenProgress);
                    }
                }
                self.bone.invalidUpdate();
            }
        };
        p.fadeOut = function () {
            var self = this;
            self._transform.skewX = dragonBones.Transform.normalizeRadian(self._transform.skewX);
            self._transform.skewY = dragonBones.Transform.normalizeRadian(self._transform.skewY);
        };
        p.update = function (time) {
            var self = this;
            _super.prototype.update.call(this, time);
            // Blend animation state.
            var weight = self._animationState._weightResult;
            if (weight > 0) {
                if (self.bone._blendIndex == 0) {
                    self._boneTransform.x = self._transform.x * weight;
                    self._boneTransform.y = self._transform.y * weight;
                    self._boneTransform.skewX = self._transform.skewX * weight;
                    self._boneTransform.skewY = self._transform.skewY * weight;
                    self._boneTransform.scaleX = (self._transform.scaleX - 1) * weight + 1;
                    self._boneTransform.scaleY = (self._transform.scaleY - 1) * weight + 1;
                }
                else {
                    self._boneTransform.x += self._transform.x * weight;
                    self._boneTransform.y += self._transform.y * weight;
                    self._boneTransform.skewX += self._transform.skewX * weight;
                    self._boneTransform.skewY += self._transform.skewY * weight;
                    self._boneTransform.scaleX += (self._transform.scaleX - 1) * weight;
                    self._boneTransform.scaleY += (self._transform.scaleY - 1) * weight;
                }
                self.bone._blendIndex++;
                var fadeProgress = self._animationState._fadeProgress;
                if (fadeProgress < 1) {
                    self.bone.invalidUpdate();
                }
            }
        };
        return BoneTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.BoneTimelineState = BoneTimelineState;
    egret.registerClass(BoneTimelineState,'dragonBones.BoneTimelineState');
    /**
     * @private
     */
    var SlotTimelineState = (function (_super) {
        __extends(SlotTimelineState, _super);
        function SlotTimelineState() {
            _super.call(this);
            this._color = new dragonBones.ColorTransform();
            this._durationColor = new dragonBones.ColorTransform();
        }
        var d = __define,c=SlotTimelineState,p=c.prototype;
        SlotTimelineState.toString = function () {
            return "[Class dragonBones.SlotTimelineState]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            self.slot = null;
            self._colorDirty = false;
            self._tweenColor = 0 /* None */;
            self._slotColor = null;
            self._color.identity();
            self._durationColor.identity();
        };
        p._onFadeIn = function () {
            this._slotColor = this.slot._colorTransform;
        };
        p._onArriveAtFrame = function (isUpdate) {
            var self = this;
            _super.prototype._onArriveAtFrame.call(this, isUpdate);
            if (self._animationState._isDisabled(self.slot)) {
                self._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                self._curve = null;
                self._tweenColor = 0 /* None */;
                return;
            }
            if (self.slot._displayDataSet) {
                var displayIndex = self._currentFrame.displayIndex;
                if (self.slot.displayIndex >= 0 && displayIndex >= 0) {
                    if (self.slot._displayDataSet.displays.length > 1) {
                        self.slot._setDisplayIndex(displayIndex);
                    }
                }
                else {
                    self.slot._setDisplayIndex(displayIndex);
                }
                self.slot._updateMeshData(true);
            }
            if (self._currentFrame.displayIndex >= 0) {
                self._tweenColor = 0 /* None */;
                var currentColor = self._currentFrame.color;
                if (self._keyFrameCount > 1 && (self._tweenEasing != dragonBones.DragonBones.NO_TWEEN || self._curve)) {
                    var nextFrame = self._currentFrame.next;
                    var nextColor = nextFrame.color;
                    if (currentColor != nextColor && nextFrame.displayIndex >= 0) {
                        self._durationColor.alphaMultiplier = nextColor.alphaMultiplier - currentColor.alphaMultiplier;
                        self._durationColor.redMultiplier = nextColor.redMultiplier - currentColor.redMultiplier;
                        self._durationColor.greenMultiplier = nextColor.greenMultiplier - currentColor.greenMultiplier;
                        self._durationColor.blueMultiplier = nextColor.blueMultiplier - currentColor.blueMultiplier;
                        self._durationColor.alphaOffset = nextColor.alphaOffset - currentColor.alphaOffset;
                        self._durationColor.redOffset = nextColor.redOffset - currentColor.redOffset;
                        self._durationColor.greenOffset = nextColor.greenOffset - currentColor.greenOffset;
                        self._durationColor.blueOffset = nextColor.blueOffset - currentColor.blueOffset;
                        if (self._durationColor.alphaMultiplier != 0 ||
                            self._durationColor.redMultiplier != 0 ||
                            self._durationColor.greenMultiplier != 0 ||
                            self._durationColor.blueMultiplier != 0 ||
                            self._durationColor.alphaOffset != 0 ||
                            self._durationColor.redOffset != 0 ||
                            self._durationColor.greenOffset != 0 ||
                            self._durationColor.blueOffset != 0) {
                            self._tweenColor = 2 /* Always */;
                        }
                    }
                }
                if (self._tweenColor == 0 /* None */) {
                    self._durationColor.alphaMultiplier = currentColor.alphaMultiplier - self._slotColor.alphaMultiplier;
                    self._durationColor.redMultiplier = currentColor.redMultiplier - self._slotColor.redMultiplier;
                    self._durationColor.greenMultiplier = currentColor.greenMultiplier - self._slotColor.greenMultiplier;
                    self._durationColor.blueMultiplier = currentColor.blueMultiplier - self._slotColor.blueMultiplier;
                    self._durationColor.alphaOffset = currentColor.alphaOffset - self._slotColor.alphaOffset;
                    self._durationColor.redOffset = currentColor.redOffset - self._slotColor.redOffset;
                    self._durationColor.greenOffset = currentColor.greenOffset - self._slotColor.greenOffset;
                    self._durationColor.blueOffset = currentColor.blueOffset - self._slotColor.blueOffset;
                    if (self._durationColor.alphaMultiplier != 0 ||
                        self._durationColor.redMultiplier != 0 ||
                        self._durationColor.greenMultiplier != 0 ||
                        self._durationColor.blueMultiplier != 0 ||
                        self._durationColor.alphaOffset != 0 ||
                        self._durationColor.redOffset != 0 ||
                        self._durationColor.greenOffset != 0 ||
                        self._durationColor.blueOffset != 0) {
                        self._tweenColor = 1 /* Once */;
                    }
                }
            }
            else {
                self._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                self._curve = null;
                self._tweenColor = 0 /* None */;
            }
        };
        p._onUpdateFrame = function (isUpdate) {
            var self = this;
            _super.prototype._onUpdateFrame.call(this, isUpdate);
            if (self._tweenColor) {
                if (self._tweenColor == 1 /* Once */) {
                    self._tweenColor = 0 /* None */;
                }
                var currentColor = self._currentFrame.color;
                self._color.alphaMultiplier = currentColor.alphaMultiplier + self._durationColor.alphaMultiplier * self._tweenProgress;
                self._color.redMultiplier = currentColor.redMultiplier + self._durationColor.redMultiplier * self._tweenProgress;
                self._color.greenMultiplier = currentColor.greenMultiplier + self._durationColor.greenMultiplier * self._tweenProgress;
                self._color.blueMultiplier = currentColor.blueMultiplier + self._durationColor.blueMultiplier * self._tweenProgress;
                self._color.alphaOffset = currentColor.alphaOffset + self._durationColor.alphaOffset * self._tweenProgress;
                self._color.redOffset = currentColor.redOffset + self._durationColor.redOffset * self._tweenProgress;
                self._color.greenOffset = currentColor.greenOffset + self._durationColor.greenOffset * self._tweenProgress;
                self._color.blueOffset = currentColor.blueOffset + self._durationColor.blueOffset * self._tweenProgress;
                self._colorDirty = true;
            }
        };
        p.fadeOut = function () {
            this._tweenColor = 0 /* None */;
        };
        p.update = function (time) {
            var self = this;
            _super.prototype.update.call(this, time);
            // Fade animation.
            if (self._tweenColor != 0 /* None */ || self._colorDirty) {
                var weight = self._animationState._weightResult;
                if (weight > 0) {
                    var fadeProgress = self._animationState._fadeProgress;
                    if (fadeProgress < 1) {
                        self._slotColor.alphaMultiplier += (self._color.alphaMultiplier - self._slotColor.alphaMultiplier) * fadeProgress;
                        self._slotColor.redMultiplier += (self._color.redMultiplier - self._slotColor.redMultiplier) * fadeProgress;
                        self._slotColor.greenMultiplier += (self._color.greenMultiplier - self._slotColor.greenMultiplier) * fadeProgress;
                        self._slotColor.blueMultiplier += (self._color.blueMultiplier - self._slotColor.blueMultiplier) * fadeProgress;
                        self._slotColor.alphaOffset += (self._color.alphaOffset - self._slotColor.alphaOffset) * fadeProgress;
                        self._slotColor.redOffset += (self._color.redOffset - self._slotColor.redOffset) * fadeProgress;
                        self._slotColor.greenOffset += (self._color.greenOffset - self._slotColor.greenOffset) * fadeProgress;
                        self._slotColor.blueOffset += (self._color.blueOffset - self._slotColor.blueOffset) * fadeProgress;
                        self.slot._colorDirty = true;
                    }
                    else if (self._colorDirty) {
                        self._colorDirty = false;
                        self._slotColor.alphaMultiplier = self._color.alphaMultiplier;
                        self._slotColor.redMultiplier = self._color.redMultiplier;
                        self._slotColor.greenMultiplier = self._color.greenMultiplier;
                        self._slotColor.blueMultiplier = self._color.blueMultiplier;
                        self._slotColor.alphaOffset = self._color.alphaOffset;
                        self._slotColor.redOffset = self._color.redOffset;
                        self._slotColor.greenOffset = self._color.greenOffset;
                        self._slotColor.blueOffset = self._color.blueOffset;
                        self.slot._colorDirty = true;
                    }
                }
            }
        };
        return SlotTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.SlotTimelineState = SlotTimelineState;
    egret.registerClass(SlotTimelineState,'dragonBones.SlotTimelineState');
    /**
     * @private
     */
    var FFDTimelineState = (function (_super) {
        __extends(FFDTimelineState, _super);
        function FFDTimelineState() {
            _super.call(this);
            this._ffdVertices = [];
        }
        var d = __define,c=FFDTimelineState,p=c.prototype;
        FFDTimelineState.toString = function () {
            return "[Class dragonBones.FFDTimelineState]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            self.slot = null;
            self._tweenFFD = 0 /* None */;
            self._slotFFDVertices = null;
            if (self._durationFFDFrame) {
                self._durationFFDFrame.returnToPool();
                self._durationFFDFrame = null;
            }
            if (self._ffdVertices.length) {
                self._ffdVertices.length = 0;
            }
        };
        p._onFadeIn = function () {
            var self = this;
            self._slotFFDVertices = self.slot._ffdVertices;
            self._durationFFDFrame = dragonBones.BaseObject.borrowObject(dragonBones.ExtensionFrameData);
            self._durationFFDFrame.tweens.length = self._slotFFDVertices.length;
            self._ffdVertices.length = self._slotFFDVertices.length;
            for (var i = 0, l = self._durationFFDFrame.tweens.length; i < l; ++i) {
                self._durationFFDFrame.tweens[i] = 0;
            }
            for (var i = 0, l = self._ffdVertices.length; i < l; ++i) {
                self._ffdVertices[i] = 0;
            }
        };
        p._onArriveAtFrame = function (isUpdate) {
            var self = this;
            _super.prototype._onArriveAtFrame.call(this, isUpdate);
            self._tweenFFD = 0 /* None */;
            if (self._tweenEasing != dragonBones.DragonBones.NO_TWEEN || self._curve) {
                self._tweenFFD = self._updateExtensionKeyFrame(self._currentFrame, self._currentFrame.next, self._durationFFDFrame);
            }
            if (self._tweenFFD == 0 /* None */) {
                var currentFFDVertices = self._currentFrame.tweens;
                for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    if (self._slotFFDVertices[i] != currentFFDVertices[i]) {
                        self._tweenFFD = 1 /* Once */;
                        break;
                    }
                }
            }
        };
        p._onUpdateFrame = function (isUpdate) {
            var self = this;
            _super.prototype._onUpdateFrame.call(this, isUpdate);
            if (self._tweenFFD != 0 /* None */) {
                if (self._tweenFFD == 1 /* Once */) {
                    self._tweenFFD = 0 /* None */;
                }
                var currentFFDVertices = self._currentFrame.tweens;
                var nextFFDVertices = self._durationFFDFrame.tweens;
                for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    self._ffdVertices[i] = currentFFDVertices[i] + nextFFDVertices[i] * self._tweenProgress;
                }
                self.slot._ffdDirty = true;
            }
        };
        p.update = function (time) {
            var self = this;
            _super.prototype.update.call(this, time);
            // Blend animation.
            var weight = self._animationState._weightResult;
            if (weight > 0) {
                if (self.slot._blendIndex == 0) {
                    for (var i = 0, l = self._ffdVertices.length; i < l; ++i) {
                        self._slotFFDVertices[i] = self._ffdVertices[i] * weight;
                    }
                }
                else {
                    for (var i = 0, l = self._ffdVertices.length; i < l; ++i) {
                        self._slotFFDVertices[i] += self._ffdVertices[i] * weight;
                    }
                }
                self.slot._blendIndex++;
                var fadeProgress = self._animationState._fadeProgress;
                if (fadeProgress < 1) {
                    self.slot._ffdDirty = true;
                }
            }
        };
        return FFDTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.FFDTimelineState = FFDTimelineState;
    egret.registerClass(FFDTimelineState,'dragonBones.FFDTimelineState');
})(dragonBones || (dragonBones = {}));
