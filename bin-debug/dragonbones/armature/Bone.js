var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 骨骼，一个骨架中可以包含多个骨骼，骨骼以树状结构组成骨架。
     * 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现。
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    var Bone = (function (_super) {
        __extends(Bone, _super);
        /**
         * @private
         */
        function Bone() {
            _super.call(this);
            /**
             * @private
             */
            this._animationPose = new dragonBones.Transform();
            /**
             * @private
             */
            this._bones = [];
            /**
             * @private
             */
            this._slots = [];
        }
        var d = __define,c=Bone,p=c.prototype;
        /**
         * @private
         */
        Bone.toString = function () {
            return "[Class dragonBones.Bone]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            self.inheritTranslation = false;
            self.inheritRotation = false;
            self.inheritScale = false;
            self.ikBendPositive = false;
            self.ikWeight = 0;
            self.length = 0;
            self._transformDirty = 2 /* All */; // Update
            self._blendIndex = 0;
            self._cacheFrames = null;
            self._animationPose.identity();
            self._visible = true;
            self._ikChain = 0;
            self._ikChainIndex = 0;
            self._ik = null;
            if (self._bones.length) {
                self._bones.length = 0;
            }
            if (self._slots.length) {
                self._slots.length = 0;
            }
        };
        /**
         * @private
         */
        p._updateGlobalTransformMatrix = function () {
            var self = this;
            if (self._parent) {
                var parentRotation = self._parent.global.skewY; // Only inherit skew y.
                var parentMatrix = self._parent.globalTransformMatrix;
                if (self.inheritScale) {
                    if (!self.inheritRotation) {
                        self.global.skewX -= parentRotation;
                        self.global.skewY -= parentRotation;
                    }
                    self.global.toMatrix(self.globalTransformMatrix);
                    self.globalTransformMatrix.concat(parentMatrix);
                    if (!self.inheritTranslation) {
                        self.globalTransformMatrix.tx = self.global.x;
                        self.globalTransformMatrix.ty = self.global.y;
                    }
                    self.global.fromMatrix(self.globalTransformMatrix);
                }
                else {
                    if (self.inheritTranslation) {
                        var x = self.global.x;
                        var y = self.global.y;
                        self.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                        self.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
                    }
                    if (self.inheritRotation) {
                        self.global.skewX += parentRotation;
                        self.global.skewY += parentRotation;
                    }
                    self.global.toMatrix(self.globalTransformMatrix);
                }
            }
            else {
                self.global.toMatrix(self.globalTransformMatrix);
            }
        };
        /**
         * @private
         */
        p._computeIKA = function () {
            var self = this;
            var ikGlobal = self._ik.global;
            var x = self.globalTransformMatrix.a * self.length;
            var y = self.globalTransformMatrix.b * self.length;
            var ikRadian = (Math.atan2(ikGlobal.y - self.global.y, ikGlobal.x - self.global.x) +
                self.offset.skewY -
                self.global.skewY * 2 +
                Math.atan2(y, x)) * self.ikWeight; // Support offset.
            self.global.skewX += ikRadian;
            self.global.skewY += ikRadian;
            self.global.toMatrix(self.globalTransformMatrix);
        };
        /**
         * @private
         */
        p._computeIKB = function () {
            var self = this;
            var parentGlobal = self._parent.global;
            var ikGlobal = self._ik.global;
            var x = self.globalTransformMatrix.a * self.length;
            var y = self.globalTransformMatrix.b * self.length;
            var lLL = x * x + y * y;
            var lL = Math.sqrt(lLL);
            var dX = self.global.x - parentGlobal.x;
            var dY = self.global.y - parentGlobal.y;
            var lPP = dX * dX + dY * dY;
            var lP = Math.sqrt(lPP);
            dX = ikGlobal.x - parentGlobal.x;
            dY = ikGlobal.y - parentGlobal.y;
            var lTT = dX * dX + dY * dY;
            var lT = Math.sqrt(lTT);
            var ikRadianA = 0;
            if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
                ikRadianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x) + self._parent.offset.skewY; // Support offset.
                if (lL + lP <= lT) {
                }
                else if (lP < lL) {
                    ikRadianA += Math.PI;
                }
            }
            else {
                var h = (lPP - lLL + lTT) / (2 * lTT);
                var r = Math.sqrt(lPP - h * h * lTT) / lT;
                var hX = parentGlobal.x + (dX * h);
                var hY = parentGlobal.y + (dY * h);
                var rX = -dY * r;
                var rY = dX * r;
                if (self.ikBendPositive) {
                    self.global.x = hX - rX;
                    self.global.y = hY - rY;
                }
                else {
                    self.global.x = hX + rX;
                    self.global.y = hY + rY;
                }
                ikRadianA = Math.atan2(self.global.y - parentGlobal.y, self.global.x - parentGlobal.x) + self._parent.offset.skewY; // Support offset.
            }
            ikRadianA = (ikRadianA - parentGlobal.skewY) * self.ikWeight;
            parentGlobal.skewX += ikRadianA;
            parentGlobal.skewY += ikRadianA;
            parentGlobal.toMatrix(self._parent.globalTransformMatrix);
            self._parent._transformDirty = 1 /* Self */;
            self.global.x = parentGlobal.x + Math.cos(parentGlobal.skewY) * lP;
            self.global.y = parentGlobal.y + Math.sin(parentGlobal.skewY) * lP;
            var ikRadianB = (Math.atan2(ikGlobal.y - self.global.y, ikGlobal.x - self.global.x) + self.offset.skewY -
                self.global.skewY * 2 + Math.atan2(y, x)) * self.ikWeight; // Support offset.
            self.global.skewX += ikRadianB;
            self.global.skewY += ikRadianB;
            self.global.toMatrix(self.globalTransformMatrix);
        };
        /**
         * @inheritDoc
         */
        p._setArmature = function (value) {
            var self = this;
            if (self._armature == value) {
                return;
            }
            self._ik = null;
            var oldSlots = null;
            var oldBones = null;
            if (self._armature) {
                oldSlots = self.getSlots();
                oldBones = self.getBones();
                self._armature._removeBoneFromBoneList(this);
            }
            self._armature = value;
            if (self._armature) {
                self._armature._addBoneToBoneList(this);
            }
            if (oldSlots) {
                for (var i = 0, l = oldSlots.length; i < l; ++i) {
                    var slot = oldSlots[i];
                    if (slot.parent == this) {
                        slot._setArmature(self._armature);
                    }
                }
            }
            if (oldBones) {
                for (var i = 0, l = oldBones.length; i < l; ++i) {
                    var bone = oldBones[i];
                    if (bone.parent == this) {
                        bone._setArmature(self._armature);
                    }
                }
            }
        };
        /**
         * @private
         */
        p._setIK = function (value, chain, chainIndex) {
            var self = this;
            if (value) {
                if (chain == chainIndex) {
                    var chainEnd = self._parent;
                    if (chain && chainEnd) {
                        chain = 1;
                    }
                    else {
                        chain = 0;
                        chainIndex = 0;
                        chainEnd = this;
                    }
                    if (chainEnd == value || chainEnd.contains(value)) {
                        value = null;
                        chain = 0;
                        chainIndex = 0;
                    }
                    else {
                        var ancestor = value;
                        while (ancestor.ik && ancestor.ikChain) {
                            if (chainEnd.contains(ancestor.ik)) {
                                value = null;
                                chain = 0;
                                chainIndex = 0;
                                break;
                            }
                            ancestor = ancestor.parent;
                        }
                    }
                }
            }
            else {
                chain = 0;
                chainIndex = 0;
            }
            self._ik = value;
            self._ikChain = chain;
            self._ikChainIndex = chainIndex;
            if (self._armature) {
                self._armature._bonesDirty = true;
            }
        };
        /**
         * @private
         */
        p._update = function (cacheFrameIndex) {
            var self = this;
            self._blendIndex = 0;
            if (cacheFrameIndex >= 0) {
                var cacheFrame = self._cacheFrames[cacheFrameIndex];
                if (self.globalTransformMatrix == cacheFrame) {
                    self._transformDirty = 0 /* None */;
                }
                else if (cacheFrame) {
                    self._transformDirty = 2 /* All */; // For update children and ik children.
                    self.globalTransformMatrix = cacheFrame;
                }
                else if (self._transformDirty == 2 /* All */ ||
                    (self._parent && self._parent._transformDirty != 0 /* None */) ||
                    (self._ik && self.ikWeight > 0 && self._ik._transformDirty != 0 /* None */)) {
                    self._transformDirty = 2 /* All */; // For update children and ik children.
                    self.globalTransformMatrix = self._globalTransformMatrix;
                }
                else if (self.globalTransformMatrix != self._globalTransformMatrix) {
                    self._transformDirty = 0 /* None */;
                    self._cacheFrames[cacheFrameIndex] = self.globalTransformMatrix;
                }
                else {
                    self._transformDirty = 1 /* Self */;
                    self.globalTransformMatrix = self._globalTransformMatrix;
                }
            }
            else if (self._transformDirty == 2 /* All */ ||
                (self._parent && self._parent._transformDirty != 0 /* None */) ||
                (self._ik && self.ikWeight > 0 && self._ik._transformDirty != 0 /* None */)) {
                self._transformDirty = 2 /* All */; // For update children and ik children.
                self.globalTransformMatrix = self._globalTransformMatrix;
            }
            if (self._transformDirty != 0 /* None */) {
                if (self._transformDirty == 2 /* All */) {
                    self._transformDirty = 1 /* Self */;
                }
                else {
                    self._transformDirty = 0 /* None */;
                }
                if (self.globalTransformMatrix == self._globalTransformMatrix) {
                    /*self.global.copyFrom(self.origin).add(self.offset).add(self._animationPose);*/
                    self.global.x = self.origin.x + self.offset.x + self._animationPose.x;
                    self.global.y = self.origin.y + self.offset.y + self._animationPose.y;
                    self.global.skewX = self.origin.skewX + self.offset.skewX + self._animationPose.skewX;
                    self.global.skewY = self.origin.skewY + self.offset.skewY + self._animationPose.skewY;
                    self.global.scaleX = self.origin.scaleX * self.offset.scaleX * self._animationPose.scaleX;
                    self.global.scaleY = self.origin.scaleY * self.offset.scaleY * self._animationPose.scaleY;
                    self._updateGlobalTransformMatrix();
                    if (self._ik && self._ikChainIndex == self._ikChain && self.ikWeight > 0) {
                        if (self.inheritTranslation && self._ikChain > 0 && self._parent) {
                            self._computeIKB();
                        }
                        else {
                            self._computeIKA();
                        }
                    }
                    if (cacheFrameIndex >= 0) {
                        self.globalTransformMatrix = dragonBones.BoneTimelineData.cacheFrame(self._cacheFrames, cacheFrameIndex, self._globalTransformMatrix);
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @version DragonBones 3.0
         */
        p.invalidUpdate = function () {
            this._transformDirty = 2 /* All */;
        };
        /**
         * @language zh_CN
         * 是否包含某个指定的骨骼或插槽。
         * @returns [true: 包含，false: 不包含]
         * @see dragonBones.TransformObject
         * @version DragonBones 3.0
         */
        p.contains = function (child) {
            if (child) {
                if (child == this) {
                    return false;
                }
                var ancestor = child;
                while (ancestor != this && ancestor) {
                    ancestor = ancestor.parent;
                }
                return ancestor == this;
            }
            return false;
        };
        /**
         * @language zh_CN
         * 所有的子骨骼。
         * @version DragonBones 3.0
         */
        p.getBones = function () {
            this._bones.length = 0;
            var bones = this._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                if (bone.parent == this) {
                    this._bones.push(bone);
                }
            }
            return this._bones;
        };
        /**
         * @language zh_CN
         * 所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        p.getSlots = function () {
            this._slots.length = 0;
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                if (slot.parent == this) {
                    this._slots.push(slot);
                }
            }
            return this._slots;
        };
        d(p, "ikChain"
            /**
             * @private
             */
            ,function () {
                return this._ikChain;
            }
        );
        d(p, "ikChainIndex"
            /**
             * @private
             */
            ,function () {
                return this._ikChainIndex;
            }
        );
        d(p, "ik"
            /**
             * @language zh_CN
             * 当前的 IK 约束目标。
             * @version DragonBones 4.5
             */
            ,function () {
                return this._ik;
            }
        );
        d(p, "visible"
            /**
             * @language zh_CN
             * 控制此骨骼所有插槽的显示。
             * @default true
             * @see dragonBones.Slot
             * @version DragonBones 3.0
             */
            ,function () {
                return this._visible;
            }
            ,function (value) {
                if (this._visible == value) {
                    return;
                }
                this._visible = value;
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    if (slot._parent == this) {
                        slot._updateVisible();
                    }
                }
            }
        );
        d(p, "slot"
            /**
             * @deprecated
             * @see dragonBones.Armature#getSlot()
             */
            ,function () {
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    if (slot.parent == this) {
                        return slot;
                    }
                }
                return null;
            }
        );
        return Bone;
    }(dragonBones.TransformObject));
    dragonBones.Bone = Bone;
    egret.registerClass(Bone,'dragonBones.Bone');
})(dragonBones || (dragonBones = {}));
