const axios = require("axios");

const startTranscodeVideo = async(videoId) => {
  return axios.post(`${process.env.ENPOINT_TRANSCODE}/videos`, { id: videoId });
}

const startTranscodeLive = async(liveKey) => {
  return axios.post(`${process.env.ENPOINT_TRANSCODE}/lives`, { liveKey: liveKey });
}

module.exports = { startTranscodeVideo, startTranscodeLive }