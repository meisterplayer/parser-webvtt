WebVTT Plugin for Meister
====

This plugin allows WebVTT subtitles in the Meister player. It uses the HTML5 ```<track>``` element to play the subtitles.

Getting started
----

Simply add ```WebVtt``` to the Meister config and set an item to use subtitles:

``` JavaScript
var meisterPlayer = new Meister('#player', {
    WebVtt: {}
});

meisterPlayer.setItem({
    captions: [
        {
            lang: 'nl', // Language short
            src: 'URL_TO_WEBVTT_HERE',
            title: 'Dutch', // Title shown in captions selector
            type: 'webvtt',
        }
    ],
    src: 'MP4_URL_HERE',
    type: 'mp4'
});

```

