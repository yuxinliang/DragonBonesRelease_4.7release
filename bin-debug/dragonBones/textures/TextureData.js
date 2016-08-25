var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 贴图集数据。
     * @version DragonBones 3.0
     */
    var TextureAtlasData = (function (_super) {
        __extends(TextureAtlasData, _super);
        /**
         * @private
         */
        function TextureAtlasData() {
            _super.call(this);
            /**
             * @private
             */
            this.textures = {};
        }
        var d = __define,c=TextureAtlasData,p=c.prototype;
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            this.autoSearch = false;
            this.scale = 1;
            this.name = null;
            this.imagePath = null;
            for (var i in this.textures) {
                this.textures[i].returnToPool();
                delete this.textures[i];
            }
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        p.dispose = function () {
            this.returnToPool();
        };
        /**
         * @private
         */
        p.addTexture = function (value) {
            if (value && value.name && !this.textures[value.name]) {
                this.textures[value.name] = value;
                value.parent = this;
            }
            else {
            }
        };
        /**
         * @private
         */
        p.getTexture = function (name) {
            return this.textures[name];
        };
        return TextureAtlasData;
    }(dragonBones.BaseObject));
    dragonBones.TextureAtlasData = TextureAtlasData;
    egret.registerClass(TextureAtlasData,'dragonBones.TextureAtlasData');
    /**
     * @private
     */
    var TextureData = (function (_super) {
        __extends(TextureData, _super);
        function TextureData() {
            _super.call(this);
            this.region = new dragonBones.Rectangle();
        }
        var d = __define,c=TextureData,p=c.prototype;
        TextureData.generateRectangle = function () {
            return new dragonBones.Rectangle();
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            this.rotated = false;
            this.name = null;
            this.frame = null;
            this.parent = null;
            this.region.clear();
        };
        return TextureData;
    }(dragonBones.BaseObject));
    dragonBones.TextureData = TextureData;
    egret.registerClass(TextureData,'dragonBones.TextureData');
})(dragonBones || (dragonBones = {}));
