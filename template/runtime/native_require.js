
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/tween/tween.js",
	"libs/modules/res/res.js",
	"libs/qrcode.js",
	"bin-debug/dragonbones/core/BaseObject.js",
	"bin-debug/dragonbones/animation/Animation.js",
	"bin-debug/dragonbones/animation/AnimationState.js",
	"bin-debug/dragonbones/animation/BaseTimelineState.js",
	"bin-debug/dragonbones/animation/TimelineState.js",
	"bin-debug/dragonbones/animation/WorldClock.js",
	"bin-debug/dragonbones/armature/Armature.js",
	"bin-debug/dragonbones/armature/TransformObject.js",
	"bin-debug/dragonbones/armature/Bone.js",
	"bin-debug/dragonbones/armature/IArmatureDisplay.js",
	"bin-debug/dragonbones/armature/Slot.js",
	"bin-debug/dragonbones/core/DragonBones.js",
	"bin-debug/dragonbones/events/EventObject.js",
	"bin-debug/dragonbones/textures/TextureData.js",
	"bin-debug/dragonbones/egret/EgretTextureData.js",
	"bin-debug/dragonbones/egret/EgretArmatureDisplay.js",
	"bin-debug/dragonbones/geom/ColorTransform.js",
	"bin-debug/dragonbones/factories/BaseFactory.js",
	"bin-debug/dragonbones/egret/EgretFactory.js",
	"bin-debug/dragonbones/egret/EgretSlot.js",
	"bin-debug/dragonbones/geom/Matrix.js",
	"bin-debug/dragonbones/geom/Point.js",
	"bin-debug/dragonbones/geom/Rectangle.js",
	"bin-debug/dragonbones/geom/Transform.js",
	"bin-debug/dragonbones/model/TimelineData.js",
	"bin-debug/dragonbones/model/AnimationData.js",
	"bin-debug/dragonbones/model/ArmatureData.js",
	"bin-debug/dragonbones/model/DragonBonesData.js",
	"bin-debug/dragonbones/model/FrameData.js",
	"bin-debug/dragonbones/parsers/DataParser.js",
	"bin-debug/dragonbones/parsers/ObjectDataParser.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	//----auto game_file_list end----
];

var window = {};

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "noScale",
		contentWidth: 1200,
		contentHeight: 900,
		showPaintRect: false,
		showFPS: true,
		fpsStyles: "x:0,y:0,size:30,textColor:0x00c200,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};