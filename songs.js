function Song() {
  this.name = "";
  this.pointer = null;
}

/*
To add your own song inside aplication, you should add a mp3 file in folder "musics".
Then you should add here two lines for each song, where <index> is the next natural number of those already occupied:
songs[<index>] = new Song();
songs[<index>].name = "<Name of a file without .mp3 extension>";
*/

var songs = [];
songs[0] = new Song();
songs[0].name = "Lina Kuduzović - Man like u";
songs[1] = new Song();
songs[1].name = "Zoe Wees - Control";
songs[2] = new Song();
songs[2].name = "Rihanna - Diamonds";
songs[3] = new Song();
songs[3].name = "Adele - Send my love";
songs[4] = new Song();
songs[4].name = "Alenka Gotar - Cvet z juga";
songs[5] = new Song();
songs[5].name = "Ana Soklič - Voda";
songs[6] = new Song();
songs[6].name = "Ellie Goulding - Love me like you do";
songs[7] = new Song();
songs[7].name = "Sam Smith - Too good at goodbyes";
songs[8] = new Song();
songs[8].name = "Lordi - Hard rock hallelujah";
songs[9] = new Song();
songs[9].name = "Johnny Cash - Sixteen tons";