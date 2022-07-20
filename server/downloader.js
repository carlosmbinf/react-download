var fs = require("fs");
var youtubedl = require("youtube-dl");
import path from "path";
var appRoot = require("app-root-path");
console.log(appRoot.path);

export default function download(videoId, onEnd) {
  var video = youtubedl(
    "http://www.youtube.com/watch?v=" + videoId,
    ["--format=18"],
    { cwd: appRoot.path, maxBuffer: Infinity }
  );

  video.on("info", function (info) {
    console.log("Download started");
    console.log("filename: " + info._filename);
    console.log("size: " + info.size);
  });
  var videoFile = appRoot.path + "/public/videos/" + videoId + ".mp4";
  !fs.existsSync(appRoot.path + "/public/videos")
    ? fs.mkdir(appRoot.path + "/public/videos/")
    : "";

  video.pipe(fs.createWriteStream(videoFile));
  video.on("end", () => {
    onEnd(videoFile);
  });
}
