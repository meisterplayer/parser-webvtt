var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var WebVtt$1 = function (_Meister$ParserPlugin) {
    inherits(WebVtt, _Meister$ParserPlugin);

    function WebVtt(config, meister) {
        classCallCheck(this, WebVtt);

        var _this = possibleConstructorReturn(this, (WebVtt.__proto__ || Object.getPrototypeOf(WebVtt)).call(this, config, meister));

        _this.currentCaptions = [];

        _this.on('requestCaptions', _this.onRequestCaptions.bind(_this));
        _this.on('itemUnloaded', _this.onItemUnloaded.bind(_this));
        return _this;
    }

    createClass(WebVtt, [{
        key: 'onItemUnloaded',
        value: function onItemUnloaded() {
            // No need to remove tracks that aren't there
            if (!this.meister.playerPlugin || !this.meister.playerPlugin.mediaElement) return;
            this.removeTracks();
        }
    }, {
        key: 'removeTracks',
        value: function removeTracks() {
            var tracks = this.meister.playerPlugin.mediaElement.textTracks;
            for (var i = 0; i < tracks.length; i++) {
                var track = tracks[i];
                track.default = false;
                track.mode = 'hidden';
            }
            var trackNodes = this.meister.playerPlugin.mediaElement.childNodes;
            for (var _i = 0; _i < trackNodes.length; _i++) {
                var child = trackNodes.item(_i);
                if (child.nodeName.toLowerCase() === 'track') {
                    this.meister.playerPlugin.mediaElement.removeChild(child);
                }
            }
        }
    }, {
        key: 'onRequestCaptions',
        value: function onRequestCaptions(captions) {
            if (captions.newLanguage === 'none') {
                this.removeTracks();
                return;
            }

            if (captions.type !== 'webvtt') return;

            // First remove all non default tracks
            this.removeTracks();

            var track = document.createElement('track');
            track.kind = 'captions';
            track.label = captions.title;
            track.scrlang = captions.lang;
            track.default = true;
            track.src = captions.src;

            track.addEventListener('load', function () {
                track.mode = 'showing';
            });

            this.meister.playerPlugin.mediaElement.appendChild(track);
        }
    }], [{
        key: 'pluginName',
        get: function get$$1() {
            return 'WebVtt';
        }
    }]);
    return WebVtt;
}(Meister.ParserPlugin);

Meister.registerPlugin(WebVtt$1.pluginName, WebVtt$1);

export default WebVtt$1;
//# sourceMappingURL=WebVtt.js.map
