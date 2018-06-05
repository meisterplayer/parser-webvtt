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

        return track;
    }

    onPlaylistMetadata(item) {
        const captions = item.captions;

        /** @type {HTMLTrackElement[]} */
        let tracks = [];

        if (captions && captions.length) {
            tracks = captions.map(caption => this.createTrack(caption));
        }

        if (captions && !captions.length) {
            tracks = [this.createTrack(captions)];
        }

        if (this.meister.playerPlugin && this.meister.playerPlugin.mediaElement) {
            tracks.forEach((track) => {
                this.meister.playerPlugin.mediaElement.appendChild(track);
            });
        } else {
            this.on('playerCreated', () => {
                tracks.forEach((track) => {
                    this.meister.playerPlugin.mediaElement.appendChild(track);
                });
            });
        }
    }

    async onRequestCaptions(captions) {

        /** @type {HTMLVideoElement} */
        const mediaElement = this.meister.playerPlugin.mediaElement;
        const tracks = mediaElement.getElementsByTagName('track');

        for (let index = 0; index < tracks.length; index += 1) {
            const track = tracks[index];

            if (track.srclang === captions.lang) {
                track.default = true;
                track.setAttribute('mode', 'showing');
                track.track.mode = 'showing';
            } else {
                track.default = false;
                track.setAttribute('mode', 'hidden');
                track.track.mode = 'hidden';
            }
        }
    }
}

Meister.registerPlugin(WebVtt.pluginName, WebVtt);
Meister.registerPlugin('webvtt', WebVtt);

export default WebVtt;
