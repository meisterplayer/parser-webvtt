import packageJson from '../../package.json';

class WebVtt extends Meister.ParserPlugin {
    constructor(config, meister) {
        super(config, meister);

        this.currentCaptions = [];

        this.on('requestCaptions', this.onRequestCaptions.bind(this));
        this.on('itemUnloaded', this.onItemUnloaded.bind(this));
        this.on('playlistMetadata', this.onPlaylistMetadata.bind(this));
    }

    static get pluginName() {
        return 'WebVtt';
    }

    static get pluginVersion() {
        return packageJson.version;
    }

    onItemUnloaded() {
        // No need to remove tracks that aren't there
        if (!this.meister.playerPlugin || !(this.meister.playerPlugin.mediaElement instanceof HTMLMediaElement)) return;

        this.currentCaptions = [];
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

    createTrack(caption) {
        const track = document.createElement('track');

        track.kind = 'captions';
        track.label = caption.title;
        track.srclang = caption.lang;
        track.src = caption.src;

        return {
            lang: caption.lang,
            trackEl: track,
        };
    }

    onPlaylistMetadata(item) {
        const captions = item.captions;

        if (captions && captions.length) {
            this.currentCaptions = captions.map(caption => this.createTrack(caption));
        }

        if (captions && !captions.length) {
            this.currentCaptions = [this.createTrack(captions)];
        }

        if (this.meister.playerPlugin && this.meister.playerPlugin.mediaElement && this.meister.playerPlugin.mediaElement.readyState >= 2) {
            this.currentCaptions.forEach((track) => {
                this.meister.playerPlugin.mediaElement.appendChild(track.trackEl);
            });
        } else {
            this.on('playerLoadedMetadata', () => {
                this.currentCaptions.forEach((track) => {
                    this.meister.playerPlugin.mediaElement.appendChild(track.trackEl);
                });
            });
        }
    }

    async onRequestCaptions(captions) {
        this.currentCaptions.forEach((track) => {
            if (track.lang === captions.lang) {
                track.trackEl.track.mode = 'showing';
            } else {
                track.trackEl.track.mode = 'hidden';
            }
        });
    }
}

Meister.registerPlugin(WebVtt.pluginName, WebVtt);
Meister.registerPlugin('webvtt', WebVtt);

export default WebVtt;
