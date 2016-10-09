var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 贴图集数据。
     * @version DragonBones 3.0
     */
    var EgretTextureAtlasData = (function (_super) {
        __extends(EgretTextureAtlasData, _super);
        /**
         * @private
         */
        function EgretTextureAtlasData() {
            _super.call(this);
        }
        var d = __define,c=EgretTextureAtlasData,p=c.prototype;
        /**
         * @private
         */
        EgretTextureAtlasData.toString = function () {
            return "[class dragonBones.EgretTextureAtlasData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                //this.texture.dispose();
                this.texture = null;
            }
        };
        /**
         * @private
         */
        p.generateTextureData = function () {
            return dragonBones.BaseObject.borrowObject(EgretTextureData);
        };
        return EgretTextureAtlasData;
    }(dragonBones.TextureAtlasData));
    dragonBones.EgretTextureAtlasData = EgretTextureAtlasData;
    egret.registerClass(EgretTextureAtlasData,'dragonBones.EgretTextureAtlasData');
    /**
     * @private
     */
    var EgretTextureData = (function (_super) {
        __extends(EgretTextureData, _super);
        function EgretTextureData() {
            _super.call(this);
        }
        var d = __define,c=EgretTextureData,p=c.prototype;
        EgretTextureData.toString = function () {
            return "[class dragonBones.EgretTextureData]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                this.texture.dispose();
                this.texture = null;
            }
        };
        return EgretTextureData;
    }(dragonBones.TextureData));
    dragonBones.EgretTextureData = EgretTextureData;
    egret.registerClass(EgretTextureData,'dragonBones.EgretTextureData');
})(dragonBones || (dragonBones = {}));
//# sourceMappingURL=EgretTextureData.js.map