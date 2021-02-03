var fs = require('fs');
var youtubedl = require('youtube-dl');
import path from 'path'

var rootDir = path.dirname(__dirname);
console.log(rootDir)

export default function download(videoId, onEnd) {
    var video = youtubedl('http://www.youtube.com/watch?v=' + videoId, ['--format=18'], {cwd: rootDir, maxBuffer: Infinity});

    video.on('info', function (info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
    });

    var videoFile = rootDir + '/' + videoId + '.mp4';
    video.pipe(fs.createWriteStream(videoFile));
    console.log(videoFile)
    
    video.on('end', () => {
        onEnd(videoFile)
    })
}
