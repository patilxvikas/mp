var actx = new AudioContext();
var status = 1;
var canvas = document.getElementById('canvas');
canvas.width = 1200;
canvas.height = 540;
var status = 0;


var bSrc = actx.createBufferSource();


document.getElementById('music').addEventListener('change', function () {

    if (status === 1) {
        bSrc.stop(0);
    }
    var fr = new FileReader();
    fr.onload = function (e) {
        actx.decodeAudioData(e.target.result, function (buffer) {
            var analyser = actx.createAnalyser();
            bSrc.connect(analyser).connect(actx.destination);
            bSrc.buffer = buffer;
            bSrc.start(0);
            status = 1;
            draw(analyser);
        });
    }

    fr.readAsArrayBuffer(this.files[0]);
});


function draw(analyser) {
    ctx = canvas.getContext('2d');
    cwidth = canvas.width;
    cheight = canvas.height - 2;
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    ctx.fillRect(0, 0, cwidth, cheight);
    ctx.lineWidth = 3;

    ctx.strokeStyle = 'rgb(255, 0, 0)';
    // console.log(3);

    var drawMeter = function () {
        analyser.getByteTimeDomainData(dataArray);

        var sliceWidth = cwidth * 1.0 / bufferLength;
        var x = 0;
        ctx.clearRect(0, 0, cwidth, cheight);
        ctx.beginPath();
        for (var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * cheight / (2.5);

            if (i === 0) {
                ctx.moveTo(x, cheight / (2.5));
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth * 1.5;
        }
        ctx.lineTo(canvas.width, canvas.height / (2.5));
        ctx.stroke();

        requestAnimationFrame(drawMeter);
    }

    requestAnimationFrame(drawMeter);
}



