var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 龙骨数据，包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    var DragonBonesData = (function (_super) {
        __extends(DragonBonesData, _super);
        /**
         * @private
         */
        function DragonBonesData() {
            _super.call(this);
            /**
             * @language zh_CN
             * 所有的骨架数据。
             * @see dragonBones.ArmatureData
             * @version DragonBones 3.0
             */
            this.armatures = {};
            this._armatureNames = [];
        }
        var d = __define,c=DragonBonesData,p=c.prototype;
        /**
         * @private
         */
        DragonBonesData.toString = function () {
            return "[Class dragonBones.DragonBonesData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            var self = this;
            self.autoSearch = false;
            self.frameRate = 0;
            self.name = null;
            for (var i in self.armatures) {
                self.armatures[i].returnToPool();
                delete self.armatures[i];
            }
            if (self._armatureNames.length) {
                self._armatureNames.length = 0;
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨架。
         * @param name 骨架数据骨架名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        p.getArmature = function (name) {
            return this.armatures[name];
        };
        /**
         * @private
         */
        p.addArmature = function (value) {
            if (value && value.name && !this.armatures[value.name]) {
                this.armatures[value.name] = value;
                this._armatureNames.push(value.name);
                value.parent = this;
            }
            else {
                throw new Error();
            }
        };
        d(p, "armatureNames"
            /**
             * @language zh_CN
             * 所有的骨架数据名称。
             * @see #armatures
             * @version DragonBones 3.0
             */
            ,function () {
                return this._armatureNames;
            }
        );
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        p.dispose = function () {
            this.returnToPool();
        };
        return DragonBonesData;
    }(dragonBones.BaseObject));
    dragonBones.DragonBonesData = DragonBonesData;
    egret.registerClass(DragonBonesData,'dragonBones.DragonBonesData');
})(dragonBones || (dragonBones = {}));