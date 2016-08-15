var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 插槽。
     * @version DragonBones 3.0
     */
    var EgretSlot = (function (_super) {
        __extends(EgretSlot, _super);
        /**
         * @language zh_CN
         * 创建一个空的插槽。
         * @version DragonBones 3.0
         */
        function EgretSlot() {
            _super.call(this);
        }
        var d = __define,c=EgretSlot,p=c.prototype;
        /**
         * @private
         */
        EgretSlot.toString = function () {
            return "[Class dragonBones.EgretSlot]";
        };
        /**
         * @inheritDoc
         */
        p._onClear = function () {
            _super.prototype._onClear.call(this);
            this.transformUpdateEnabled = false;
            this._renderDisplay = null;
            this._colorFilter = null;
        };
        /**
         * @private
         */
        p._onUpdateDisplay = function () {
            var self = this;
            if (!self._rawDisplay) {
                self._rawDisplay = new egret.Bitmap();
            }
            self._renderDisplay = (self._display || self._rawDisplay);
        };
        /**
         * @private
         */
        p._initDisplay = function (value) {
        };
        /**
         * @private
         */
        p._addDisplay = function () {
            var container = this._armature._display;
            container.addChild(this._renderDisplay);
        };
        /**
         * @private
         */
        p._replaceDisplay = function (value) {
            var container = this._armature._display;
            var prevDisplay = value;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
        };
        /**
         * @private
         */
        p._removeDisplay = function () {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        };
        /**
         * @private
         */
        p._disposeDisplay = function (value) {
        };
        /**
         * @private
         */
        p._updateVisible = function () {
            this._renderDisplay.visible = this._parent.visible;
        };
        /**
         * @private
         */
        p._updateBlendMode = function () {
            if (this._blendMode < EgretSlot.BLEND_MODE_LIST.length) {
                var blendMode = EgretSlot.BLEND_MODE_LIST[this._blendMode];
                if (blendMode) {
                    this._renderDisplay.blendMode = blendMode;
                }
            }
        };
        /**
         * @private
         */
        p._updateColor = function () {
            var self = this;
            if (self._colorTransform.redMultiplier != 1 ||
                self._colorTransform.greenMultiplier != 1 ||
                self._colorTransform.blueMultiplier != 1 ||
                self._colorTransform.redOffset != 0 ||
                self._colorTransform.greenOffset != 0 ||
                self._colorTransform.blueOffset != 0) {
                if (!self._colorFilter) {
                    self._colorFilter = new egret.ColorMatrixFilter();
                }
                var colorMatrix = self._colorFilter.matrix;
                colorMatrix[0] = self._colorTransform.redMultiplier;
                colorMatrix[6] = self._colorTransform.greenMultiplier;
                colorMatrix[12] = self._colorTransform.blueMultiplier;
                colorMatrix[18] = self._colorTransform.alphaMultiplier;
                colorMatrix[4] = self._colorTransform.redOffset;
                colorMatrix[9] = self._colorTransform.greenOffset;
                colorMatrix[14] = self._colorTransform.blueOffset;
                colorMatrix[19] = self._colorTransform.alphaOffset;
                self._colorFilter.matrix = colorMatrix;
                var filters = self._renderDisplay.filters;
                if (!filters) {
                    filters = [];
                }
                if (filters.indexOf(self._colorFilter) < 0) {
                    filters.push(self._colorFilter);
                }
                self._renderDisplay.filters = filters;
            }
            else {
                if (self._colorFilter) {
                    self._colorFilter = null;
                    self._renderDisplay.filters = null;
                }
                self._renderDisplay.$setAlpha(self._colorTransform.alphaMultiplier);
            }
        };
        /**
         * @private
         */
        p._updateFilters = function () { };
        /**
         * @private
         */
        p._updateFrame = function () {
            var self = this;
            var frameDisplay = self._renderDisplay;
            if (self._display && self._displayIndex >= 0) {
                var rawDisplayData = self._displayIndex < self._displayDataSet.displays.length ? self._displayDataSet.displays[self._displayIndex] : null;
                var replacedDisplayData = self._displayIndex < self._replacedDisplayDataSet.length ? self._replacedDisplayDataSet[self._displayIndex] : null;
                var currentDisplayData = replacedDisplayData || rawDisplayData;
                var currentTextureData = currentDisplayData.textureData;
                if (currentTextureData) {
                    var textureAtlasTexture = currentTextureData.parent.texture;
                    if (!currentTextureData.texture && textureAtlasTexture) {
                        currentTextureData.texture = new egret.Texture();
                        currentTextureData.texture._bitmapData = textureAtlasTexture._bitmapData;
                        currentTextureData.texture.$initData(currentTextureData.region.x, currentTextureData.region.y, currentTextureData.region.width, currentTextureData.region.height, 0, 0, currentTextureData.region.width, currentTextureData.region.height, textureAtlasTexture.textureWidth, textureAtlasTexture.textureHeight);
                    }
                    var texture = self._armature._replacedTexture || currentTextureData.texture;
                    if (texture) {
                        if (self._meshData && self._display == self._meshDisplay) {
                            var meshDisplay = self._meshDisplay;
                            var meshNode = meshDisplay.$renderNode;
                            for (var i = 0, l = self._meshData.vertices.length; i < l; ++i) {
                                meshNode.uvs[i] = self._meshData.uvs[i];
                                meshNode.vertices[i] = self._meshData.vertices[i];
                            }
                            for (var i = 0, l = self._meshData.vertexIndices.length; i < l; ++i) {
                                meshNode.indices[i] = self._meshData.vertexIndices[i];
                            }
                            meshDisplay.$setBitmapData(texture);
                            meshDisplay.$updateVertices();
                            meshDisplay.$invalidateTransform();
                        }
                        else {
                            var rect = currentTextureData.frame || currentTextureData.region;
                            var width = rect.width;
                            var height = rect.height;
                            if (currentTextureData.rotated) {
                                width = rect.height;
                                height = rect.width;
                            }
                            var pivotX = currentDisplayData.pivot.x;
                            var pivotY = currentDisplayData.pivot.y;
                            if (currentDisplayData.isRelativePivot) {
                                pivotX = width * pivotX;
                                pivotY = height * pivotY;
                            }
                            if (currentTextureData.frame) {
                                pivotX += currentTextureData.frame.x;
                                pivotY += currentTextureData.frame.y;
                            }
                            if (rawDisplayData && replacedDisplayData) {
                                pivotX += rawDisplayData.transform.x - replacedDisplayData.transform.x;
                                pivotY += rawDisplayData.transform.y - replacedDisplayData.transform.y;
                            }
                            frameDisplay.$setBitmapData(texture);
                            frameDisplay.$setAnchorOffsetX(pivotX);
                            frameDisplay.$setAnchorOffsetY(pivotY);
                        }
                        self._updateVisible();
                        return;
                    }
                }
            }
            frameDisplay.visible = false;
            frameDisplay.$setBitmapData(null);
            frameDisplay.$setAnchorOffsetX(0);
            frameDisplay.$setAnchorOffsetY(0);
            frameDisplay.x = 0;
            frameDisplay.y = 0;
        };
        /**
         * @private
         */
        p._updateMesh = function () {
            var self = this;
            var meshDisplay = self._meshDisplay;
            var meshNode = meshDisplay.$renderNode;
            var hasFFD = self._ffdVertices.length > 0;
            if (self._meshData.skinned) {
                for (var i = 0, iF = 0, l = self._meshData.vertices.length; i < l; i += 2) {
                    var iH = i / 2;
                    var boneIndices = self._meshData.boneIndices[iH];
                    var boneVertices = self._meshData.boneVertices[iH];
                    var weights = self._meshData.weights[iH];
                    var xG = 0, yG = 0;
                    for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        var bone = self._meshBones[boneIndices[iB]];
                        var matrix = bone.globalTransformMatrix;
                        var weight = weights[iB];
                        var xL = 0, yL = 0;
                        if (hasFFD) {
                            xL = boneVertices[iB * 2] + self._ffdVertices[iF];
                            yL = boneVertices[iB * 2 + 1] + self._ffdVertices[iF + 1];
                        }
                        else {
                            xL = boneVertices[iB * 2];
                            yL = boneVertices[iB * 2 + 1];
                        }
                        xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                        yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                        iF += 2;
                    }
                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }
                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
            else if (hasFFD) {
                var vertices = self._meshData.vertices;
                for (var i = 0, l = self._meshData.vertices.length; i < l; i += 2) {
                    var xG = vertices[i] + self._ffdVertices[i];
                    var yG = vertices[i + 1] + self._ffdVertices[i + 1];
                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }
                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
        };
        /**
         * @private
         */
        p._updateTransform = function () {
            var self = this;
            self._renderDisplay.$setMatrix(self.globalTransformMatrix, self.transformUpdateEnabled);
        };
        /**
         * @private
         */
        EgretSlot.BLEND_MODE_LIST = [
            egret.BlendMode.NORMAL,
            egret.BlendMode.ADD,
            null,
            null,
            null,
            egret.BlendMode.ERASE,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ];
        return EgretSlot;
    }(dragonBones.Slot));
    dragonBones.EgretSlot = EgretSlot;
    egret.registerClass(EgretSlot,'dragonBones.EgretSlot');
})(dragonBones || (dragonBones = {}));
