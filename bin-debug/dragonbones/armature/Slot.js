var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 插槽，附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     */
    var Slot = (function (_super) {
        __extends(Slot, _super);
        /**
         * @private
         */
        function Slot() {
            _super.call(this);
            /**
             * @private
             */
            this._colorTransform = new dragonBones.ColorTransform();
            /**
             * @private
             */
            this._ffdVertices = [];
            /**
             * @private
             */
            this._replacedDisplayDataSet = [];
            /**
             * @private
             */
            this._localMatrix = new dragonBones.Matrix();
            /**
             * @private
             */
            this._displayList = [];
            /**
             * @private
             */
            this._meshBones = [];
        }
        var d = __define,c=Slot,p=c.prototype;
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            _super.prototype._onClear.call(this);
            var disposeDisplayList = [];
            for (var i = 0, l = self._displayList.length; i < l; ++i) {
                var eachDisplay = self._displayList[i];
                if (eachDisplay != self._rawDisplay && eachDisplay != self._meshDisplay &&
                    disposeDisplayList.indexOf(eachDisplay) < 0) {
                    disposeDisplayList.push(eachDisplay);
                }
            }
            for (var i = 0, l = disposeDisplayList.length; i < l; ++i) {
                var eachDisplay = disposeDisplayList[i];
                if (eachDisplay instanceof dragonBones.Armature) {
                    eachDisplay.returnToPool();
                }
                else {
                    self._disposeDisplay(eachDisplay);
                }
            }
            if (self._meshDisplay && self._meshDisplay != self._rawDisplay) {
                self._disposeDisplay(self._meshDisplay);
            }
            if (self._rawDisplay) {
                self._disposeDisplay(self._rawDisplay);
            }
            self.inheritAnimation = true;
            self.displayController = null;
            self._colorDirty = false;
            self._ffdDirty = false;
            self._blendIndex = 0;
            self._zOrder = 0;
            self._displayDataSet = null;
            self._meshData = null;
            self._cacheFrames = null;
            self._rawDisplay = null;
            self._meshDisplay = null;
            self._colorTransform.identity();
            if (self._ffdVertices.length) {
                self._ffdVertices.length = 0;
            }
            if (self._replacedDisplayDataSet.length) {
                self._replacedDisplayDataSet.length = 0;
            }
            self._displayDirty = false;
            self._blendModeDirty = false;
            self._originDirty = false;
            self._transformDirty = false;
            self._displayIndex = 0;
            self._blendMode = 0 /* Normal */;
            self._display = null;
            self._childArmature = null;
            self._localMatrix.identity();
            if (self._displayList.length) {
                self._displayList.length = 0;
            }
            if (self._meshBones.length) {
                self._meshBones.length = 0;
            }
        };
        /**
         * @private
         */
        p._isMeshBonesUpdate = function () {
            for (var i = 0, l = this._meshBones.length; i < l; ++i) {
                if (this._meshBones[i]._transformDirty != 0 /* None */) {
                    return true;
                }
            }
            return false;
        };
        /**
         * @private
         */
        p._updateDisplay = function () {
            var self = this;
            var prevDisplay = self._display || self._rawDisplay;
            var prevChildArmature = self._childArmature;
            if (self._displayIndex >= 0 && self._displayIndex < self._displayList.length) {
                self._display = self._displayList[self._displayIndex];
                if (self._display instanceof dragonBones.Armature) {
                    self._childArmature = self._display;
                    self._display = self._childArmature._display;
                }
                else {
                    self._childArmature = null;
                }
            }
            else {
                self._display = null;
                self._childArmature = null;
            }
            var currentDisplay = self._display || self._rawDisplay;
            if (currentDisplay != prevDisplay) {
                self._onUpdateDisplay();
                if (prevDisplay) {
                    self._replaceDisplay(prevDisplay);
                }
                else {
                    self._addDisplay();
                }
                self._blendModeDirty = true;
                self._colorDirty = true;
            }
            // Update origin.
            if (self._displayDataSet && self._displayIndex >= 0 && self._displayIndex < self._displayDataSet.displays.length) {
                self.origin.copyFrom(self._displayDataSet.displays[self._displayIndex].transform);
                self._originDirty = true;
            }
            // Update meshData.
            self._updateMeshData(false);
            // Update frame.
            if (currentDisplay == self._rawDisplay || currentDisplay == self._meshDisplay) {
                self._updateFrame();
            }
            // Update child armature.
            if (self._childArmature != prevChildArmature) {
                if (prevChildArmature) {
                    prevChildArmature._parent = null; // Update child armature parent.
                    if (self.inheritAnimation) {
                        prevChildArmature.animation.reset();
                    }
                }
                if (self._childArmature) {
                    self._childArmature._parent = this; // Update child armature parent.
                    if (self.inheritAnimation) {
                        // Set child armature frameRate.
                        var cacheFrameRate = self._armature.cacheFrameRate;
                        if (cacheFrameRate) {
                            self._childArmature.cacheFrameRate = cacheFrameRate;
                        }
                        var slotData = self._armature.armatureData.getSlot(self.name);
                        if (slotData.actions.length > 0) {
                            self._childArmature._action = slotData.actions[slotData.actions.length - 1];
                        }
                        else {
                            self._childArmature.animation.play();
                        }
                    }
                }
            }
        };
        /**
         * @private
         */
        p._updateLocalTransformMatrix = function () {
            var self = this;
            self.global.copyFrom(self.origin).add(self.offset).toMatrix(self._localMatrix);
        };
        /**
         * @private
         */
        p._updateGlobalTransformMatrix = function () {
            var self = this;
            self.globalTransformMatrix.copyFrom(self._localMatrix);
            self.globalTransformMatrix.concat(self._parent.globalTransformMatrix);
            self.global.fromMatrix(self.globalTransformMatrix);
        };
        /**
         * @inheritDoc
         */
        p._setArmature = function (value) {
            var self = this;
            if (self._armature == value) {
                return;
            }
            if (self._armature) {
                self._armature._removeSlotFromSlotList(this);
            }
            self._armature = value;
            self._onUpdateDisplay();
            if (self._armature) {
                self._armature._addSlotToSlotList(this);
                self._addDisplay();
            }
            else {
                self._removeDisplay();
            }
        };
        /**
         * @private Armature
         */
        p._updateMeshData = function (isTimelineUpdate) {
            var self = this;
            var prevMeshData = self._meshData;
            if (self._display == self._meshDisplay && self._displayDataSet && self._displayIndex >= 0 && self._displayIndex < self._displayDataSet.displays.length) {
                self._meshData = self._displayDataSet.displays[self._displayIndex].meshData;
            }
            else {
                self._meshData = null;
            }
            if (self._meshData != prevMeshData) {
                if (self._meshData) {
                    if (self._meshData.skinned) {
                        self._meshBones.length = self._meshData.bones.length;
                        for (var i = 0, l = self._meshBones.length; i < l; ++i) {
                            self._meshBones[i] = self._armature.getBone(self._meshData.bones[i].name);
                        }
                        var ffdVerticesCount = 0;
                        for (var i = 0, l = self._meshData.boneIndices.length; i < l; ++i) {
                            ffdVerticesCount += self._meshData.boneIndices[i].length;
                        }
                        self._ffdVertices.length = ffdVerticesCount * 2;
                    }
                    else {
                        self._meshBones.length = 0;
                        self._ffdVertices.length = self._meshData.vertices.length;
                    }
                    for (var i = 0, l = self._ffdVertices.length; i < l; ++i) {
                        self._ffdVertices[i] = 0;
                    }
                    self._ffdDirty = true;
                }
                else {
                    self._meshBones.length = 0;
                    self._ffdVertices.length = 0;
                }
                if (isTimelineUpdate) {
                    self._armature.animation._updateFFDTimelineStates();
                }
            }
        };
        /**
         * @private Armature
         */
        p._update = function (cacheFrameIndex) {
            var self = this;
            self._blendIndex = 0;
            if (self._displayDirty) {
                self._displayDirty = false;
                self._updateDisplay();
            }
            if (!self._display) {
                return;
            }
            if (self._blendModeDirty) {
                self._blendModeDirty = false;
                self._updateBlendMode();
            }
            if (self._colorDirty) {
                self._colorDirty = false;
                self._updateColor();
            }
            if (self._meshData) {
                if (self._ffdDirty || (self._meshData.skinned && self._isMeshBonesUpdate())) {
                    self._ffdDirty = false;
                    self._updateMesh();
                }
                if (self._meshData.skinned) {
                    return;
                }
            }
            if (self._originDirty) {
                self._originDirty = false;
                self._transformDirty = true;
                self._updateLocalTransformMatrix();
            }
            if (cacheFrameIndex >= 0) {
                var cacheFrame = self._cacheFrames[cacheFrameIndex];
                if (self.globalTransformMatrix == cacheFrame) {
                    self._transformDirty = false;
                }
                else if (cacheFrame) {
                    self._transformDirty = true;
                    self.globalTransformMatrix = cacheFrame;
                }
                else if (self._transformDirty || self._parent._transformDirty != 0 /* None */) {
                    self._transformDirty = true;
                    self.globalTransformMatrix = self._globalTransformMatrix;
                }
                else if (self.globalTransformMatrix != self._globalTransformMatrix) {
                    self._transformDirty = false;
                    self._cacheFrames[cacheFrameIndex] = self.globalTransformMatrix;
                }
                else {
                    self._transformDirty = true;
                    self.globalTransformMatrix = self._globalTransformMatrix;
                }
            }
            else if (self._transformDirty || self._parent._transformDirty != 0 /* None */) {
                self._transformDirty = true;
                self.globalTransformMatrix = self._globalTransformMatrix;
            }
            if (self._transformDirty) {
                self._transformDirty = false;
                if (self.globalTransformMatrix == self._globalTransformMatrix) {
                    self._updateGlobalTransformMatrix();
                    if (cacheFrameIndex >= 0) {
                        self.globalTransformMatrix = dragonBones.SlotTimelineData.cacheFrame(self._cacheFrames, cacheFrameIndex, self._globalTransformMatrix);
                    }
                }
                self._updateTransform();
            }
        };
        /**
         * @private Factory
         */
        p._setDisplayList = function (value) {
            var self = this;
            if (value && value.length) {
                if (self._displayList.length != value.length) {
                    self._displayList.length = value.length;
                }
                for (var i = 0, l = self._displayList.length; i < l; ++i) {
                    var eachDisplay = value[i];
                    if (eachDisplay && eachDisplay != self._rawDisplay && eachDisplay != self._meshDisplay && !(eachDisplay instanceof dragonBones.Armature) &&
                        self._displayList.indexOf(eachDisplay) < 0) {
                        self._initDisplay(eachDisplay);
                    }
                    self._displayList[i] = eachDisplay;
                }
            }
            else if (self._displayList.length) {
                self._displayList.length = 0;
            }
            if (self._displayIndex >= 0 && self._displayIndex < self._displayList.length) {
                self._displayDirty = self._display != self._displayList[self._displayIndex];
            }
            else {
                self._displayDirty = self._display != null;
            }
            return self._displayDirty;
        };
        /**
         * @private Factory
         */
        p._setDisplayIndex = function (value) {
            if (this._displayIndex == value) {
                return false;
            }
            this._displayIndex = value;
            this._displayDirty = true;
            return this._displayDirty;
        };
        /**
         * @private Factory
         */
        p._setBlendMode = function (value) {
            if (this._blendMode == value) {
                return false;
            }
            this._blendMode = value;
            this._blendModeDirty = true;
            return true;
        };
        /**
         * @private Factory
         */
        p._setColor = function (value) {
            this._colorTransform.copyFrom(value);
            this._colorDirty = true;
            return true;
        };
        /**
         * @language zh_CN
         * 在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         */
        p.invalidUpdate = function () {
            this._displayDirty = true;
        };
        d(p, "rawDisplay"
            /**
             * @private
             */
            ,function () {
                return this._rawDisplay;
            }
        );
        d(p, "MeshDisplay"
            /**
             * @private
             */
            ,function () {
                return this._meshDisplay;
            }
        );
        d(p, "displayIndex"
            /**
             * @language zh_CN
             * 此时显示的显示对象在显示列表中的索引。
             * @version DragonBones 4.5
             */
            ,function () {
                return this._displayIndex;
            }
            ,function (value) {
                if (this._setDisplayIndex(value)) {
                    this._update(-1);
                }
            }
        );
        d(p, "displayList"
            /**
             * @language zh_CN
             * 包含显示对象或子骨架的显示列表。
             * @version DragonBones 3.0
             */
            ,function () {
                return this._displayList.concat();
            }
            ,function (value) {
                var self = this;
                var backupDisplayList = self._displayList.concat(); // Copy.
                var disposeDisplayList = [];
                if (self._setDisplayList(value)) {
                    self._update(-1);
                }
                // Release replaced render displays.
                for (var i = 0, l = backupDisplayList.length; i < l; ++i) {
                    var eachDisplay = backupDisplayList[i];
                    if (eachDisplay != self._rawDisplay && eachDisplay != self._meshDisplay &&
                        self._displayList.indexOf(eachDisplay) < 0 &&
                        disposeDisplayList.indexOf(eachDisplay) < 0) {
                        disposeDisplayList.push(eachDisplay);
                    }
                }
                for (var i = 0, l = disposeDisplayList.length; i < l; ++i) {
                    var eachDisplay = disposeDisplayList[i];
                    if (eachDisplay instanceof dragonBones.Armature) {
                        (eachDisplay).returnToPool();
                    }
                    else {
                        self._disposeDisplay(eachDisplay);
                    }
                }
            }
        );
        d(p, "display"
            /**
             * @language zh_CN
             * 此时显示的显示对象。
             * @version DragonBones 3.0
             */
            ,function () {
                return this._display;
            }
            ,function (value) {
                var self = this;
                if (self._display == value) {
                    return;
                }
                var displayListLength = self._displayList.length;
                if (self._displayIndex < 0 && displayListLength == 0) {
                    self._displayIndex = 0;
                }
                if (self._displayIndex < 0) {
                    return;
                }
                else {
                    var replaceDisplayList = self.displayList; // Copy.
                    if (displayListLength <= self._displayIndex) {
                        replaceDisplayList.length = self._displayIndex + 1;
                    }
                    replaceDisplayList[self._displayIndex] = value;
                    self.displayList = replaceDisplayList;
                }
            }
        );
        d(p, "childArmature"
            /**
             * @language zh_CN
             * 此时显示的子骨架。
             * @see dragonBones.Armature
             * @version DragonBones 3.0
             */
            ,function () {
                return this._childArmature;
            }
            ,function (value) {
                if (this._childArmature == value) {
                    return;
                }
                this.display = value;
            }
        );
        /**
         * @deprecated
         * @see #display
         */
        p.getDisplay = function () {
            return this._display;
        };
        /**
         * @deprecated
         * @see #display
         */
        p.setDisplay = function (value) {
            this.display = value;
        };
        return Slot;
    }(dragonBones.TransformObject));
    dragonBones.Slot = Slot;
    egret.registerClass(Slot,'dragonBones.Slot');
})(dragonBones || (dragonBones = {}));
