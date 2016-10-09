var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 事件。
     * @version DragonBones 4.5
     */
    var EgretEvent = (function (_super) {
        __extends(EgretEvent, _super);
        /**
         * @private
         */
        function EgretEvent(type, bubbles, cancelable, data) {
            _super.call(this, type, bubbles, cancelable, data);
        }
        var d = __define,c=EgretEvent,p=c.prototype;
        d(p, "eventObject"
            /**
             * @language zh_CN
             * 事件对象。
             * @version DragonBones 4.5
             */
            ,function () {
                return this.data;
            }
        );
        d(p, "frameLabel"
            /**
             * @see dragonBones.EventObject#name
             */
            ,function () {
                return this.eventObject.name;
            }
        );
        d(p, "sound"
            /**
             * @see dragonBones.EventObject#name
             */
            ,function () {
                return this.eventObject.name;
            }
        );
        d(p, "animationName"
            /**
             * @see dragonBones.EventObject#animationName
             */
            ,function () {
                return this.eventObject.animationState.name;
            }
        );
        d(p, "armature"
            /**
             * @see dragonBones.EventObject#armature
             */
            ,function () {
                return this.eventObject.armature;
            }
        );
        d(p, "bone"
            /**
             * @see dragonBones.EventObject#bone
             */
            ,function () {
                return this.eventObject.bone;
            }
        );
        d(p, "slot"
            /**
             * @see dragonBones.EventObject#slot
             */
            ,function () {
                return this.eventObject.slot;
            }
        );
        d(p, "animationState"
            /**
             * @see dragonBones.EventObject#animationState
             */
            ,function () {
                return this.eventObject.animationState;
            }
        );
        d(p, "movementID"
            /**
             * @deprecated
             * @see #animationName
             */
            ,function () {
                return this.animationName;
            }
        );
        /**
         * @see dragonBones.EventObject.START
         */
        EgretEvent.START = dragonBones.EventObject.START;
        /**
         * @see dragonBones.EventObject.LOOP_COMPLETE
         */
        EgretEvent.LOOP_COMPLETE = dragonBones.EventObject.LOOP_COMPLETE;
        /**
         * @see dragonBones.EventObject.COMPLETE
         */
        EgretEvent.COMPLETE = dragonBones.EventObject.COMPLETE;
        /**
         * @see dragonBones.EventObject.FADE_IN
         */
        EgretEvent.FADE_IN = dragonBones.EventObject.FADE_IN;
        /**
         * @see dragonBones.EventObject.FADE_IN_COMPLETE
         */
        EgretEvent.FADE_IN_COMPLETE = dragonBones.EventObject.FADE_IN_COMPLETE;
        /**
         * @see dragonBones.EventObject.FADE_OUT
         */
        EgretEvent.FADE_OUT = dragonBones.EventObject.FADE_OUT;
        /**
         * @see dragonBones.EventObject.FADE_OUT_COMPLETE
         */
        EgretEvent.FADE_OUT_COMPLETE = dragonBones.EventObject.FADE_OUT_COMPLETE;
        /**
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        EgretEvent.FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
        /**
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        EgretEvent.SOUND_EVENT = dragonBones.EventObject.SOUND_EVENT;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        EgretEvent.ANIMATION_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        EgretEvent.BONE_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        EgretEvent.MOVEMENT_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
        /**
         * @deprecated
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        EgretEvent.SOUND = dragonBones.EventObject.SOUND_EVENT;
        return EgretEvent;
    }(egret.Event));
    dragonBones.EgretEvent = EgretEvent;
    egret.registerClass(EgretEvent,'dragonBones.EgretEvent');
    /**
     * @inheritDoc
     */
    var EgretArmatureDisplay = (function (_super) {
        __extends(EgretArmatureDisplay, _super);
        /**
         * @private
         */
        function EgretArmatureDisplay() {
            _super.call(this);
            if (!EgretArmatureDisplay._clock) {
                EgretArmatureDisplay._clock = new dragonBones.WorldClock();
                EgretArmatureDisplay._clock.time = egret.getTimer() * 0.001;
                egret.startTick(EgretArmatureDisplay._clockHandler, EgretArmatureDisplay);
            }
        }
        var d = __define,c=EgretArmatureDisplay,p=c.prototype;
        EgretArmatureDisplay._clockHandler = function (time) {
            time *= 0.001;
            var passedTime = EgretArmatureDisplay.passTime > 0 ? EgretArmatureDisplay.passTime : (time - EgretArmatureDisplay._clock.time);
            EgretArmatureDisplay._clock.advanceTime(passedTime);
            EgretArmatureDisplay._clock.time = time;
            return false;
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            this._armature = null;
            this._debugDrawer = null;
        };
        /**
         * @inheritDoc
         */
        p._dispatchEvent = function (eventObject) {
            var event = egret.Event.create(EgretEvent, eventObject.type);
            event.data = eventObject;
            this.dispatchEvent(event);
            egret.Event.release(event);
        };
        /**
         * @inheritDoc
         */
        p._debugDraw = function () {
            if (!this._debugDrawer) {
                this._debugDrawer = new egret.Shape();
            }
            this.addChild(this._debugDrawer);
            this._debugDrawer.graphics.clear();
            var bones = this._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                var boneLength = Math.max(bone.length, 5);
                var startX = bone.globalTransformMatrix.tx;
                var startY = bone.globalTransformMatrix.ty;
                var endX = startX + bone.globalTransformMatrix.a * boneLength;
                var endY = startY + bone.globalTransformMatrix.b * boneLength;
                this._debugDrawer.graphics.lineStyle(1, bone.ik ? 0xFF0000 : 0x00FF00, 0.5);
                this._debugDrawer.graphics.moveTo(startX, startY);
                this._debugDrawer.graphics.lineTo(endX, endY);
            }
        };
        /**
         * @inheritDoc
         */
        p.hasEvent = function (type) {
            return this.hasEventListener(type);
        };
        /**
         * @inheritDoc
         */
        p.addEvent = function (type, listener, target) {
            this.addEventListener(type, listener, target);
        };
        /**
         * @inheritDoc
         */
        p.removeEvent = function (type, listener, target) {
            this.removeEventListener(type, listener, target);
        };
        /**
         * @inheritDoc
         */
        p.advanceTimeBySelf = function (on) {
            if (on) {
                EgretArmatureDisplay._clock.add(this._armature);
            }
            else {
                EgretArmatureDisplay._clock.remove(this._armature);
            }
        };
        /**
         * @inheritDoc
         */
        p.dispose = function () {
            if (this._armature) {
                this.advanceTimeBySelf(false);
                this._armature.dispose();
                this._armature = null;
            }
        };
        d(p, "armature"
            /**
             * @inheritDoc
             */
            ,function () {
                return this._armature;
            }
        );
        d(p, "animation"
            /**
             * @inheritDoc
             */
            ,function () {
                return this._armature.animation;
            }
        );
        EgretArmatureDisplay.passTime = 0;
        EgretArmatureDisplay._clock = null;
        return EgretArmatureDisplay;
    }(egret.DisplayObjectContainer));
    dragonBones.EgretArmatureDisplay = EgretArmatureDisplay;
    egret.registerClass(EgretArmatureDisplay,'dragonBones.EgretArmatureDisplay',["dragonBones.IArmatureDisplay","dragonBones.IEventDispatcher"]);
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var AnimationEvent = (function (_super) {
        __extends(AnimationEvent, _super);
        function AnimationEvent() {
            _super.apply(this, arguments);
        }
        var d = __define,c=AnimationEvent,p=c.prototype;
        return AnimationEvent;
    }(EgretEvent));
    dragonBones.AnimationEvent = AnimationEvent;
    egret.registerClass(AnimationEvent,'dragonBones.AnimationEvent');
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var FrameEvent = (function (_super) {
        __extends(FrameEvent, _super);
        function FrameEvent() {
            _super.apply(this, arguments);
        }
        var d = __define,c=FrameEvent,p=c.prototype;
        return FrameEvent;
    }(EgretEvent));
    dragonBones.FrameEvent = FrameEvent;
    egret.registerClass(FrameEvent,'dragonBones.FrameEvent');
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var SoundEvent = (function (_super) {
        __extends(SoundEvent, _super);
        function SoundEvent() {
            _super.apply(this, arguments);
        }
        var d = __define,c=SoundEvent,p=c.prototype;
        return SoundEvent;
    }(EgretEvent));
    dragonBones.SoundEvent = SoundEvent;
    egret.registerClass(SoundEvent,'dragonBones.SoundEvent');
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    var EgretTextureAtlas = (function (_super) {
        __extends(EgretTextureAtlas, _super);
        function EgretTextureAtlas(texture, rawData, scale) {
            if (scale === void 0) { scale = 1; }
            _super.call(this);
            this._onClear();
            this.texture = texture;
            dragonBones.ObjectDataParser.getInstance().parseTextureAtlasData(rawData, this, scale);
        }
        var d = __define,c=EgretTextureAtlas,p=c.prototype;
        /**
         * @private
         */
        EgretTextureAtlas.toString = function () {
            return "[class dragonBones.EgretTextureAtlas]";
        };
        return EgretTextureAtlas;
    }(dragonBones.EgretTextureAtlasData));
    dragonBones.EgretTextureAtlas = EgretTextureAtlas;
    egret.registerClass(EgretTextureAtlas,'dragonBones.EgretTextureAtlas');
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    var EgretSheetAtlas = (function (_super) {
        __extends(EgretSheetAtlas, _super);
        function EgretSheetAtlas() {
            _super.apply(this, arguments);
        }
        var d = __define,c=EgretSheetAtlas,p=c.prototype;
        return EgretSheetAtlas;
    }(EgretTextureAtlas));
    dragonBones.EgretSheetAtlas = EgretSheetAtlas;
    egret.registerClass(EgretSheetAtlas,'dragonBones.EgretSheetAtlas');
    /**
     * @deprecated
     * @see dragonBones.EgretFactory#soundEventManater
     */
    var SoundEventManager = (function () {
        function SoundEventManager() {
        }
        var d = __define,c=SoundEventManager,p=c.prototype;
        /**
         * @deprecated
         * @see dragonBones.EgretFactory#soundEventManater
         */
        SoundEventManager.getInstance = function () {
            return dragonBones.EventObject._soundEventManager;
        };
        return SoundEventManager;
    }());
    dragonBones.SoundEventManager = SoundEventManager;
    egret.registerClass(SoundEventManager,'dragonBones.SoundEventManager');
    /**
     * @deprecated
     * @see dragonBones.Armature#cacheFrameRate
     * @see dragonBones.Armature#enableAnimationCache()
     */
    var AnimationCacheManager = (function () {
        function AnimationCacheManager() {
        }
        var d = __define,c=AnimationCacheManager,p=c.prototype;
        return AnimationCacheManager;
    }());
    dragonBones.AnimationCacheManager = AnimationCacheManager;
    egret.registerClass(AnimationCacheManager,'dragonBones.AnimationCacheManager');
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=EgretArmatureDisplay.js.map