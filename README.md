# ull

1. `yarn install` then `yarn start`
1. Manifest will be at http://localhost:3104/manifest.mpd
1. POST to `http://localhost:3104/start` to start the ffmpeg transcoder
1. POST to `http://localhost:3104/stop` to stop the ffmpeg transcoder

Recommended DASH player: https://reference.dashif.org/dash.js/v2.9.3/samples/dash-if-reference-player/index.html (make sure to enable low-latency by clicking `Show options`

# Requirements:

* You should have ffmpeg installed on your machine
