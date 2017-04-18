class WebVtt extends Meister.ParserPlugin {
    constructor(config, meister) {
        super(config, meister);

        this.currentCaptions = [];

        this.on('requestCaptions', this.onRequestCaptions.bind(this));
        this.on('itemUnloaded', this.onItemUnloaded.bind(this));
    }

    static get pluginName() {
        return 'WebVtt';
    }

    onItemUnloaded() {
        // No need to remove tracks that aren't there
        if (!this.meister.playerPlugin || !this.meister.playerPlugin.mediaElement) return;
        this.removeTracks();
    }

    removeTracks() {
        const tracks = this.meister.playerPlugin.mediaElement.textTracks;
        for (let i = 0; i < tracks.length; i += 1) {
            const track = tracks[i];
            track.default = false;
            track.mode = 'hidden';
        }
        const trackNodes = this.meister.playerPlugin.mediaElement.childNodes;
        for (let i = 0; i < trackNodes.length; i += 1) {
            const child = trackNodes.item(i);
            if (child.nodeName.toLowerCase() === 'track') {
                this.meister.playerPlugin.mediaElement.removeChild(child);
            }
        }
    }

    onRequestCaptions(captions) {
        if (captions.newLanguage === 'none') {
            this.removeTracks();
            return;
        }

        if (captions.type !== 'webvtt') return;

        // First remove all non default tracks
        this.removeTracks();

        const track = document.createElement('track');
        track.kind = 'captions';
        track.label = captions.title;
        track.scrlang = captions.lang;
        track.default = true;
        track.src = captions.src;

        track.addEventListener('load', () => {
            track.mode = 'showing';
        });

        this.meister.playerPlugin.mediaElement.appendChild(track);
    }
}

Meister.registerPlugin(WebVtt.pluginName, WebVtt);
Meister.registerPlugin('webvtt', WebVtt);

export default WebVtt;
