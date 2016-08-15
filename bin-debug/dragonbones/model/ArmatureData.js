var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 骨架数据。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var ArmatureData = (function (_super) {
        __extends(ArmatureData, _super);
        /**
         * @private
         */
        function ArmatureData() {
            _super.call(this);
            /**
             * @private
             */
            this.parent = null;
            /**
             * @language zh_CN
             * 所有的骨骼数据。
             * @see dragonBones.BoneData
             * @version DragonBones 3.0
             */
            this.bones = {};
            /**
             * @language zh_CN
             * 所有的插槽数据。
             * @see dragonBones.SlotData
             * @version DragonBones 3.0
             */
            this.slots = {};
            /**
             * @language zh_CN
             * 所有的皮肤数据。
             * @see dragonBones.SkinData
             * @version DragonBones 3.0
             */
            this.skins = {};
            /**
             * @language zh_CN
             * 所有的动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 3.0
             */
            this.animations = {};
            /**
             * @private
             */
            this.actions = [];
            this._sortedBones = [];
            this._sortedSlots = [];
            this._bonesChildren = {};
        }
        var d = __define,c=ArmatureData,p=c.prototype;
        ArmatureData._onSortSlots = function (a, b) {
            return a.zOrder > b.zOrder ? 1 : -1;
        };
        /**
         * @private
         */
        ArmatureData.toString = function () {
            return "[Class dragonBones.ArmatureData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            self.frameRate = 0;
            self.cacheFrameRate = 0;
            self.type = 0 /* Armature */;
            self.name = null;
            self.parent = null;
            for (var i in self.bones) {
                self.bones[i].returnToPool();
                delete self.bones[i];
            }
            for (var i in self.slots) {
                self.slots[i].returnToPool();
                delete self.slots[i];
            }
            for (var i in self.skins) {
                self.skins[i].returnToPool();
                delete self.skins[i];
            }
            for (var i in self.animations) {
                self.animations[i].returnToPool();
                delete self.animations[i];
            }
            if (self.actions.length) {
                for (var i = 0, l = self.actions.length; i < l; ++i) {
                    self.actions[i].returnToPool();
                }
                self.actions.length = 0;
            }
            self._boneDirty = false;
            self._slotDirty = false;
            self._defaultSkin = null;
            self._defaultAnimation = null;
            if (self._sortedBones.length) {
                self._sortedBones.length = 0;
            }
            if (self._sortedSlots.length) {
                self._sortedSlots.length = 0;
            }
            for (var i in self._bonesChildren) {
                delete self._bonesChildren[i];
            }
        };
        p._sortBones = function () {
            var self = this;
            var total = self._sortedBones.length;
            if (!total) {
                return;
            }
            var sortHelper = self._sortedBones.concat();
            var index = 0;
            var count = 0;
            self._sortedBones.length = 0;
            while (count < total) {
                var bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }
                if (self._sortedBones.indexOf(bone) >= 0) {
                    continue;
                }
                if (bone.parent && self._sortedBones.indexOf(bone.parent) < 0) {
                    continue;
                }
                if (bone.ik && self._sortedBones.indexOf(bone.ik) < 0) {
                    continue;
                }
                if (bone.ik && bone.chain > 0 && bone.chainIndex == bone.chain) {
                    self._sortedBones.splice(self._sortedBones.indexOf(bone.parent) + 1, 0, bone);
                }
                else {
                    self._sortedBones.push(bone);
                }
                count++;
            }
        };
        p._sortSlots = function () {
            this._sortedSlots.sort(ArmatureData._onSortSlots);
        };
        /**
         * @private
         */
        p.cacheFrames = function (value) {
            var self = this;
            if (self.cacheFrameRate == value) {
                return;
            }
            self.cacheFrameRate = value;
            var frameScale = self.cacheFrameRate / self.frameRate;
            for (var i in self.animations) {
                self.animations[i].cacheFrames(frameScale);
            }
        };
        /**
         * @private
         */
        p.addBone = function (value, parentName) {
            var self = this;
            if (value && value.name && !self.bones[value.name]) {
                if (parentName) {
                    var parent_1 = self.getBone(parentName);
                    if (parent_1) {
                        value.parent = parent_1;
                    }
                    else {
                        (self._bonesChildren[parentName] = self._bonesChildren[parentName] || []).push(value);
                    }
                }
                var children = self._bonesChildren[value.name];
                if (children) {
                    for (var i = 0, l = children.length; i < l; ++i) {
                        children[i].parent = value;
                    }
                    delete self._bonesChildren[value.name];
                }
                self.bones[value.name] = value;
                self._sortedBones.push(value);
                self._boneDirty = true;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        p.addSlot = function (value) {
            if (value && value.name && !this.slots[value.name]) {
                this.slots[value.name] = value;
                this._sortedSlots.push(value);
                this._slotDirty = true;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        p.addSkin = function (value) {
            if (value && value.name && !this.skins[value.name]) {
                this.skins[value.name] = value;
                if (!this._defaultSkin) {
                    this._defaultSkin = value;
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        p.addAnimation = function (value) {
            if (value && value.name && !this.animations[value.name]) {
                this.animations[value.name] = value;
                if (!this._defaultAnimation) {
                    this._defaultAnimation = value;
                }
            }
            else {
                throw new Error();
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨骼数据。
         * @param name 骨骼数据名称。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        p.getBone = function (name) {
            return this.bones[name];
        };
        /**
         * @language zh_CN
         * 获取指定名称的插槽数据。
         * @param name 插槽数据名称。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        p.getSlot = function (name) {
            return this.slots[name];
        };
        /**
         * @language zh_CN
         * 获取指定名称的皮肤数据。
         * @param name 皮肤数据名称。
         * @see dragonBones.SkinData
         * @version DragonBones 3.0
         */
        p.getSkin = function (name) {
            return name ? this.skins[name] : this._defaultSkin;
        };
        /**
         * @language zh_CN
         * 获取指定名称的动画数据。
         * @param name 动画数据名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        p.getAnimation = function (name) {
            return name ? this.animations[name] : this._defaultAnimation;
        };
        d(p, "sortedBones"
            /**
             * @private
             */
            ,function () {
                if (this._boneDirty) {
                    this._boneDirty = false;
                    this._sortBones();
                }
                return this._sortedBones;
            }
        );
        d(p, "sortedSlots"
            /**
             * @private
             */
            ,function () {
                if (this._slotDirty) {
                    this._slotDirty = false;
                    this._sortSlots();
                }
                return this._sortedSlots;
            }
        );
        d(p, "defaultSkin"
            /**
             * @language zh_CN
             * 获取默认的皮肤数据。
             * @see dragonBones.SkinData
             * @version DragonBones 4.5
             */
            ,function () {
                return this._defaultSkin;
            }
        );
        d(p, "defaultAnimation"
            /**
             * @language zh_CN
             * 获取默认的动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 4.5
             */
            ,function () {
                return this._defaultAnimation;
            }
        );
        return ArmatureData;
    }(dragonBones.BaseObject));
    dragonBones.ArmatureData = ArmatureData;
    egret.registerClass(ArmatureData,'dragonBones.ArmatureData');
    /**
     * @language zh_CN
     * 骨骼数据。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    var BoneData = (function (_super) {
        __extends(BoneData, _super);
        /**
         * @private
         */
        function BoneData() {
            _super.call(this);
            /**
             * @private
             */
            this.transform = new dragonBones.Transform();
        }
        var d = __define,c=BoneData,p=c.prototype;
        /**
         * @private
         */
        BoneData.toString = function () {
            return "[Class dragonBones.BoneData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            self.inheritTranslation = false;
            self.inheritRotation = false;
            self.inheritScale = false;
            self.bendPositive = false;
            self.chain = 0;
            self.chainIndex = 0;
            self.weight = 0;
            self.length = 0;
            self.name = null;
            self.parent = null;
            self.ik = null;
            self.transform.identity();
        };
        return BoneData;
    }(dragonBones.BaseObject));
    dragonBones.BoneData = BoneData;
    egret.registerClass(BoneData,'dragonBones.BoneData');
    /**
     * @language zh_CN
     * 插槽数据。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    var SlotData = (function (_super) {
        __extends(SlotData, _super);
        /**
         * @private
         */
        function SlotData() {
            _super.call(this);
            /**
             * @private
             */
            this.actions = [];
        }
        var d = __define,c=SlotData,p=c.prototype;
        /**
         * @private
         */
        SlotData.generateColor = function () {
            return new dragonBones.ColorTransform();
        };
        /**
         * @private
         */
        SlotData.toString = function () {
            return "[Class dragonBones.SlotData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            self.displayIndex = 0;
            self.zOrder = 0;
            self.blendMode = 0 /* Normal */;
            self.name = null;
            self.parent = null;
            self.color = null;
            if (self.actions.length) {
                for (var i = 0, l = self.actions.length; i < l; ++i) {
                    self.actions[i].returnToPool();
                }
                self.actions.length = 0;
            }
        };
        /**
         * @private
         */
        SlotData.DEFAULT_COLOR = new dragonBones.ColorTransform();
        return SlotData;
    }(dragonBones.BaseObject));
    dragonBones.SlotData = SlotData;
    egret.registerClass(SlotData,'dragonBones.SlotData');
    /**
     * @language zh_CN
     * 皮肤数据。
     * @version DragonBones 3.0
     */
    var SkinData = (function (_super) {
        __extends(SkinData, _super);
        /**
         * @private
         */
        function SkinData() {
            _super.call(this);
            /**
             * @language zh_CN
             * 数据名称。
             * @version DragonBones 3.0
             */
            this.name = null;
            /**
             * @private
             */
            this.slots = {};
        }
        var d = __define,c=SkinData,p=c.prototype;
        /**
         * @private
         */
        SkinData.toString = function () {
            return "[Class dragonBones.SkinData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            self.name = null;
            for (var i in self.slots) {
                self.slots[i].returnToPool();
                delete self.slots[i];
            }
        };
        /**
         * @private
         */
        p.addSlot = function (value) {
            if (value && value.slot && !this.slots[value.slot.name]) {
                this.slots[value.slot.name] = value;
            }
            else {
                throw new Error();
            }
        };
        /**
         * @private
         */
        p.getSlot = function (name) {
            return this.slots[name];
        };
        return SkinData;
    }(dragonBones.BaseObject));
    dragonBones.SkinData = SkinData;
    egret.registerClass(SkinData,'dragonBones.SkinData');
    /**
     * @private
     */
    var SlotDisplayDataSet = (function (_super) {
        __extends(SlotDisplayDataSet, _super);
        function SlotDisplayDataSet() {
            _super.call(this);
            this.displays = [];
        }
        var d = __define,c=SlotDisplayDataSet,p=c.prototype;
        SlotDisplayDataSet.toString = function () {
            return "[Class dragonBones.SlotDisplayDataSet]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            this.slot = null;
            if (this.displays.length) {
                for (var i = 0, l = this.displays.length; i < l; ++i) {
                    this.displays[i].returnToPool();
                }
                this.displays.length = 0;
            }
        };
        return SlotDisplayDataSet;
    }(dragonBones.BaseObject));
    dragonBones.SlotDisplayDataSet = SlotDisplayDataSet;
    egret.registerClass(SlotDisplayDataSet,'dragonBones.SlotDisplayDataSet');
    /**
     * @private
     */
    var DisplayData = (function (_super) {
        __extends(DisplayData, _super);
        function DisplayData() {
            _super.call(this);
            this.pivot = new dragonBones.Point();
            this.transform = new dragonBones.Transform();
        }
        var d = __define,c=DisplayData,p=c.prototype;
        DisplayData.toString = function () {
            return "[Class dragonBones.DisplayData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            self.isRelativePivot = false;
            self.type = 0 /* Image */;
            self.name = null;
            self.textureData = null;
            self.armatureData = null;
            if (self.meshData) {
                self.meshData.returnToPool();
                self.meshData = null;
            }
            self.pivot.clear();
            self.transform.identity();
        };
        return DisplayData;
    }(dragonBones.BaseObject));
    dragonBones.DisplayData = DisplayData;
    egret.registerClass(DisplayData,'dragonBones.DisplayData');
    /**
     * @private
     */
    var MeshData = (function (_super) {
        __extends(MeshData, _super);
        function MeshData() {
            _super.call(this);
            this.slotPose = new dragonBones.Matrix();
            this.uvs = []; // vertices * 2
            this.vertices = []; // vertices * 2
            this.vertexIndices = []; // triangles * 3
            this.boneIndices = []; // vertices bones
            this.weights = []; // vertices bones
            this.boneVertices = []; // vertices bones * 2
            this.bones = []; // bones
            this.inverseBindPose = []; // bones
        }
        var d = __define,c=MeshData,p=c.prototype;
        MeshData.toString = function () {
            return "[Class dragonBones.MeshData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            self.skinned = false;
            self.slotPose.identity();
            if (self.uvs.length) {
                self.uvs.length = 0;
            }
            if (self.vertices.length) {
                self.vertices.length = 0;
            }
            if (self.vertexIndices.length) {
                self.vertexIndices.length = 0;
            }
            if (self.boneIndices.length) {
                self.boneIndices.length = 0;
            }
            if (self.weights.length) {
                self.weights.length = 0;
            }
            if (self.boneVertices.length) {
                self.boneVertices.length = 0;
            }
            if (self.bones.length) {
                self.bones.length = 0;
            }
            if (self.inverseBindPose.length) {
                self.inverseBindPose.length = 0;
            }
        };
        return MeshData;
    }(dragonBones.BaseObject));
    dragonBones.MeshData = MeshData;
    egret.registerClass(MeshData,'dragonBones.MeshData');
})(dragonBones || (dragonBones = {}));
