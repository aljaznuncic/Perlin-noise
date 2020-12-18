let colorRange = 1024;

let microphone;
let fft;

let selectMusic;

var pause = false;
var musicPlaying = false;
var PlayStopMusic_btn;

var backgroundColor;

/*
function Song() {
  this.name = "";
  this.pointer = "";
}

// This is an example of how we define songs from the "musics" folder. 
// This is done in the "songs.js" file where there are additional instructions.

var songs = [];
songs[0] = new Song();
songs[0].name = "Lina Kuduzović - Man like u";
*/

function addMusicOption(evt) {
  selectMusic.option(evt.file.substring(7, evt.file.length - 4));
}

function preloadMusics() {

  for(var i = 0; i < songs.length; i++) {
    songs[i].pointer = loadSound("musics/" + songs[i].name + ".mp3", addMusicOption);
  }
  /*
  songs[0].pointer = loadSound("musics/" + songs[0].name + ".mp3", function () { selectMusic.option(songs[0].name);});
  songs[1].pointer = loadSound("musics/" + songs[1].name + ".mp3", function () { selectMusic.option(songs[1].name);});
  songs[2].pointer = loadSound("musics/" + songs[2].name + ".mp3", function () { selectMusic.option(songs[2].name);});
  songs[3].pointer = loadSound("musics/" + songs[3].name + ".mp3", function () { selectMusic.option(songs[3].name);});
  songs[4].pointer = loadSound("musics/" + songs[4].name + ".mp3", function () { selectMusic.option(songs[4].name);});
  songs[5].pointer = loadSound("musics/" + songs[5].name + ".mp3", function () { selectMusic.option(songs[5].name);});
  songs[6].pointer = loadSound("musics/" + songs[6].name + ".mp3", function () { selectMusic.option(songs[6].name);});
  songs[7].pointer = loadSound("musics/" + songs[7].name + ".mp3", function () { selectMusic.option(songs[7].name);});
  songs[8].pointer = loadSound("musics/" + songs[8].name + ".mp3", function () { selectMusic.option(songs[8].name);});
  songs[9].pointer = loadSound("musics/" + songs[9].name + ".mp3", function () { selectMusic.option(songs[9].name);});
  */
}

var inc = 0.1;
var scl = 10;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];

var flowfield;

function setup() {
  background_text = createElement("h8", "Background: ");
  background_text.addClass("textBlack");
  backgroundColorPicker = createColorPicker("#2c2d2e");
  backgroundColorPicker.changed(() => {
    background(backgroundColorPicker.color());
  });
  
  reset_btn = createButton("Reset");
  reset_btn.addClass("musicStop button");
  
  Play_btn = createButton("Pause Visualization");
  Play_btn.addClass("button pause");
  
  selectMusic = createSelect();
  selectMusic.addClass("button");
  selectMusic.changed(playStopMusic_fun);
  
  PlayStopMusic_btn = createButton("Play music");
  PlayStopMusic_btn.addClass("button musicPlay");
  preloadMusics();
  
  //importSong = createFileInput(gotSongFile);
  importSong = createElement("h8", "Drop own song here");
  importSong.addClass("textBlack dropNoFullscreen");
  importSong.drop(gotSongFile);
  
  SaveImage_btn = createButton("Export image");
  SaveImage_btn.addClass("button");
  SaveImage_btn.mousePressed(() => {
    saveCanvas("myVoicePicture", "jpg");
  });
  
  //var he = window.screen.height * 0.8;
  //var wi = window.screen.width * 0.985;
  
  createCanvas(windowWidth, windowHeight * 0.9);
  var canvasArea = windowWidth * (windowHeight * 0.9);
  colorMode(HSB, 255);
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');

  flowfield = new Array(cols * rows);
  
  var numOfParticles = floor(canvasArea / 6000);
  console.log(numOfParticles);

  for (var i = 0; i < numOfParticles; i++) {
    particles[i] = new Particle();
  }
  background("#2c2d2e");
  
  microphone = new p5.AudioIn();
  microphone.start();
  fft = new p5.FFT(0.2, colorRange);
  fft.setInput(microphone);
  
  reset_btn.mousePressed(() => {
    background("#2c2d2e");
  });
  
  Play_btn.mousePressed(() => {
    pause_fun();
  });
  
  PlayStopMusic_btn.mousePressed(() => {
    playStopMusic_fun();
  });
}

function draw() {
  if(!pause) {
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var index = x + y * cols;
        var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(1);
        flowfield[index] = v;
        xoff += inc;
        stroke(0, 50);
      }
      yoff += inc;

      zoff += 0.0003;
    }

    for (var i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }

    //fr.html(floor(frameRate()));
  }
}

function pause_fun() {
  if(pause) {
    pause = false;
    Play_btn.html("Pause Visualization");
    Play_btn.removeClass("musicPlay");
    Play_btn.addClass("pause");
  } else {
    pause = true;
    Play_btn.html("Continue Visualization");
    Play_btn.removeClass("pause");
    Play_btn.addClass("musicPlay");
  }
}

function playStopMusic_fun() {
  if(musicPlaying) {
    stopMusic();
    musicPlaying = false;
    PlayStopMusic_btn.html("Play music");
    PlayStopMusic_btn.removeClass("musicStop");
    PlayStopMusic_btn.addClass("musicPlay");
  } else {
    stopMusic();
    mySelectMusicEvent();
    musicPlaying = true;
    PlayStopMusic_btn.html("Stop music");
    PlayStopMusic_btn.removeClass("musicPlay");
    PlayStopMusic_btn.addClass("musicStop");
  }
}

// Songs
function mySelectMusicEvent() {
  let selectedMusic = selectMusic.value();
  print(selectedMusic);
  for(var i = 0; i < songs.length; i++) {
    if(selectedMusic.valueOf() == songs[i].name.valueOf() ) {
      songs[i].pointer.loop();
      break;
    }
  }
  /*
  switch(selectedMusic) {
    case("Lina Kuduzović - Man like u"):
      song_ManLikeU.loop();
      break;
    case("Zoe Wees - Control"):
      song_Control.loop();
      break;
  }*/
}

// Songs
function stopMusic() {
  for(var i = 0; i < songs.length; i++) {
    songs[i].pointer.stop();
  }
  /*
  song_ManLikeU.stop();
  song_Control.stop();
  */
  PlayStopMusic_btn.html("Play music");
}

function gotSongFile(file) {
  // If it's an audio file
  if (file.type === 'audio') {
    songs.push(new Song());
    songs[songs.length - 1].name = file.name;
    songs[songs.length - 1].pointer = loadSound(file.data, function () { selectMusic.option(file.name);});
  } else {
    console.log('Not an audio file!');
  }
}

function keyPressed() {
  var needsReset = 0;
  switch(keyCode) {
    // fullscreen
    case 70: // F
      var fs = fullscreen();
      /*
      if(fs) {
        background_text.removeClass("textWhite");
        background_text.addClass("textBlack");
        importSong.removeClass("textWhite");
        importSong.removeClass("dropFullscreen");
        importSong.addClass("textBlack dropNoFullscreen");
      } else {
        background_text.removeClass("textBlack");
        background_text.addClass("textWhite");
        importSong.removeClass("textBlack");
        importSong.removeClass("dropNoFullscreen");
        importSong.addClass("textWhite dropFullscreen");
      }
      */
      fullscreen(!fs);
      break;
            
    // turn visualization on/off (pause)
    case 32: // Space
      pause_fun();
      break;
    }
}
