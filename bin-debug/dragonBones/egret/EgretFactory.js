var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 工厂。
     * @version DragonBones 3.0
     */
    var EgretFactory = (function (_super) {
        __extends(EgretFactory, _super);
        /**
         * @language zh_CN
         * 创建一个工厂。 (通常只需要一个全局工厂实例)
         * @param dataParser 龙骨数据解析器，如果不设置，则使用默认解析器。
         * @version DragonBones 3.0
         */
        function EgretFactory(dataParser) {
            if (dataParser === void 0) { dataParser = null; }
            _super.call(this, dataParser);
            if (!dragonBones.EventObject._soundEventManager) {
                dragonBones.EventObject._soundEventManager = new dragonBones.EgretArmatureDisplay();
            }
        }
        var d = __define,c=EgretFactory,p=c.prototype;
        d(EgretFactory, "factory"
            /**
             * @language zh_CN
             * 一个可以直接使用的全局工厂实例.
             * @version DragonBones 4.7
             */
            ,function () {
                if (!EgretFactory._factory) {
                    EgretFactory._factory = new EgretFactory();
                }
                return EgretFactory._factory;
            }
        );
        /**
         * @private
         */
        p._generateTextureAtlasData = function (textureAtlasData, textureAtlas) {
            if (textureAtlasData) {
                textureAtlasData.texture = textureAtlas;
            }
            else {
                textureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.EgretTextureAtlasData);
            }
            return textureAtlasData;
        };
        /**
         * @private
         */
        p._generateArmature = function (dataPackage) {
            var armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
            var armatureDisplayContainer = new dragonBones.EgretArmatureDisplay();
            armature._armatureData = dataPackage.armature;
            armature._skinData = dataPackage.skin;
            armature._animation = dragonBones.BaseObject.borrowObject(dragonBones.Animation);
            armature._display = armatureDisplayContainer;
            armatureDisplayContainer._armature = armature;
            armature._animation._armature = armature;
            armature.animation.animations = dataPackage.armature.animations;
            return armature;
        };
        /**
         * @private
         */
        p._generateSlot = function (dataPackage, slotDisplayDataSet) {
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.EgretSlot);
            var slotData = slotDisplayDataSet.slot;
            var displayList = [];
            slot.name = slotData.name;
            slot._rawDisplay = new egret.Bitmap();
            for (var i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                var displayData = slotDisplayDataSet.displays[i];
                switch (displayData.type) {
                    case 0 /* Image */:
                        if (!displayData.textureData) {
                            displayData.textureData = this._getTextureData(dataPackage.dataName, displayData.name);
                        }
                        displayList.push(slot._rawDisplay);
                        break;
                    case 2 /* Mesh */:
                        if (!displayData.textureData) {
                            displayData.textureData = this._getTextureData(dataPackage.dataName, displayData.name);
                        }
                        if (egret.Capabilities.renderMode == "webgl") {
                            if (!slot._meshDisplay) {
                                slot._meshDisplay = new egret.Mesh();
                            }
                            displayList.push(slot._meshDisplay);
                        }
                        else {
                            displayList.push(slot._rawDisplay);
                        }
                        break;
                    case 1 /* Armature */:
                        var childArmature = this.buildArmature(displayData.name, dataPackage.dataName);
                        if (childArmature) {
                            if (!slot.inheritAnimation) {
                                var actions = slotData.actions.length > 0 ? slotData.actions : childArmature.armatureData.actions;
                                if (actions.length > 0) {
                                    for (var i_1 = 0, l_1 = actions.length; i_1 < l_1; ++i_1) {
                                        childArmature._bufferAction(actions[i_1]);
                                    }
                                }
                                else {
                                    childArmature.animation.play();
                                }
                            }
                            displayData.armatureData = childArmature.armatureData; // 
                        }
                        displayList.push(childArmature);
                        break;
                    default:
                        displayList.push(null);
                        break;
                }
            }
            slot._setDisplayList(displayList);
            return slot;
        };
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @returns 骨架的显示容器。
         * @see dragonBones.IArmatureDisplayContainer
         * @version DragonBones 4.5
         */
        p.buildArmatureDisplay = function (armatureName, dragonBonesName, skinName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            var armature = this.buildArmature(armatureName, dragonBonesName, skinName);
            var armatureDisplay = armature ? armature._display : null;
            if (armatureDisplay) {
                armatureDisplay.advanceTimeBySelf(true);
            }
            return armatureDisplay;
        };
        /**
         * @language zh_CN
         * 获取带有指定贴图的显示对象。
         * @param textureName 指定的贴图名称。
         * @param dragonBonesName 指定的龙骨数据名称，如果未设置，将检索所有的龙骨数据。
         * @version DragonBones 3.0
         */
        p.getTextureDisplay = function (textureName, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            var textureData = this._getTextureData(dragonBonesName, textureName);
            if (textureData) {
                return new egret.Bitmap(textureData.texture);
            }
            return null;
        };
        d(p, "soundEventManater"
            /**
             * @language zh_CN
             * 获取全局声音事件管理器。
             * @version DragonBones 4.5
             */
            ,function () {
                return dragonBones.EventObject._soundEventManager;
            }
        );
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addDragonBonesData()
         */
        p.addSkeletonData = function (dragonBonesData, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            this.addDragonBonesData(dragonBonesData, dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getDragonBonesData()
         */
        p.getSkeletonData = function (dragonBonesName) {
            return this.getDragonBonesData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeSkeletonData()
         */
        p.removeSkeletonData = function (dragonBonesName) {
            this.removeDragonBonesData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addTextureAtlasData()
         */
        p.addTextureAtlas = function (textureAtlasData, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            this.addTextureAtlasData(textureAtlasData, dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getTextureAtlasData()
         */
        p.getTextureAtlas = function (dragonBonesName) {
            return this.getTextureAtlasData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        p.removeTextureAtlas = function (dragonBonesName) {
            this.removeTextureAtlasData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#buildArmature()
         */
        p.buildFastArmature = function (armatureName, dragonBonesName, skinName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            return this.buildArmature(armatureName, dragonBonesName, skinName);
        };
        EgretFactory._factory = null;
        return EgretFactory;
    }(dragonBones.BaseFactory));
    dragonBones.EgretFactory = EgretFactory;
    egret.registerClass(EgretFactory,'dragonBones.EgretFactory');
})(dragonBones || (dragonBones = {}));
