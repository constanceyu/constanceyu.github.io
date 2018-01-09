var v_rec;
var r, v_alpha, joy_color, sad_color, scr;
r = 0;
v_alpha = 55;
/*
0 - grey (neutral)
1 - joy
2 - sadness
3 - joy_prompt
4 - sad_prompt
*/
scr = 0;

var joy_fence, sad_fence, cur_pos;
var joy_dis, sad_dis;
var neu_bgm, joy_bgm, sad_bgm, neu_amp, joy_amp, sad_amp;
var ear, greeting;

// assets for sad scene
var sad_img1, sad_img2;
var mom_call;

// assets for joy scene
var joy_img1, joy_img2, roomie_voicemail;
var voicemail_checked;


function preload(){
  // background music
	neu_bgm = loadSound('neutral.mp3');
  joy_bgm = loadSound('joy.mp3');
  sad_bgm = loadSound('sad.mp3');
  neu_amp = new p5.Amplitude();
  joy_amp = new p5.Amplitude();
  sad_amp = new p5.Amplitude();
  neu_amp.setInput(neu_bgm);
  joy_amp.setInput(joy_bgm);
  sad_amp.setInput(sad_bgm);
  
  // geolocation
  cur_pos = getCurrentPosition();
  
  // images
  ear = loadImage('ear.png');
  sad_img1 = loadImage('call_mom.PNG');
  sad_img2 = loadImage('call_mom_end.PNG');
  joy_img1 = loadImage('roomie_voicemail_1.jpeg');
  joy_img2 = loadImage('roomie_voicemail_2.PNG');
  
  // audio assets
  greeting = loadSound('greeting.m4a');
  mom_call = loadSound('mom_call.m4a');
  roomie_voicemail = loadSound('roomie_voicemail.m4a');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  joy_color = color('rgba(255, 204, 30, 0.3)');
  sad_color = color('rgba(87, 134, 209, 0.3)');
  
  // joy - apartment, sadness - haines hall
	joy_fence = new geoFenceCircle(34.066784, -118.453136, 0.2, in_joy, out, 'mi');
  sad_fence = new geoFenceCircle(34.072879, -118.441136, 0.2, in_sad, out, 'mi');
	
  // voice recognition
  v_rec = new p5.SpeechRec();
	v_rec.continuous = true;
  v_rec.interimResults = true;
  v_rec.onResult = handleSpeech();
  v_rec.start();
  
  //greeting.play();
  
  // sad scene
  call_ended = false;
  
  // joy scene
  voicemail_checked = false;
	
}

function draw() { 
  background(255);
  geolocationCheck();
  if(scr == 0 || scr == 1 || scr == 2){
    handleSpeech();
  	drawCircles();
    if(scr == 0)
    	drawEar();
  }
  geolocationPrompt();
}

function mousePressed() {
  if(scr == 0) {
    if(!neu_bgm.isPlaying())
  		neu_bgm.loop();
    joy_bgm.stop();
    sad_bgm.stop();
  }
  else if(scr == 1){
    if(!joy_bgm.isPlaying())	
    	joy_bgm.loop();
    sad_bgm.stop();
    neu_bgm.stop();
  }
  else if(scr == 2){
    if(!sad_bgm.isPlaying())	
    	sad_bgm.loop();
    joy_bgm.stop();
    neu_bgm.stop();
  }
  else if(scr == 3){
    if((mouseY > 0.15*windowWidth) && (mouseY < 0.4*windowWidth)) {
      voicemail_checked = true;
      if(!roomie_voicemail.isPlaying())
      	roomie_voicemail.play();
    }
  }
  else if(scr == 4){
  	if((mouseX > 0.5*windowWidth) && (mouseY > 0.75*windowHeight)){
      if(!mom_call.isPlaying())
    		mom_call.play();
    } else {
      mom_call.stop();
      call_ended = true;
    }
  }
}

function handleSpeech() {
  console.log(v_rec.resultString);
  if(v_rec.resultValue == true){
    if(v_rec.resultString == 'joy' || v_rec.resultString == 'Joy') {
      scr = 1;
      neu_bgm.stop();
      joy_bgm.stop();
    	sad_bgm.stop();
    }
    if(v_rec.resultString == 'sadness' || v_rec.resultString == 'Sadness') {
      scr = 2;
      neu_bgm.stop();
      joy_bgm.stop();
    	sad_bgm.stop();
    }
  }
}

function in_joy() {
  scr = 1;
  neu_bgm.stop();
  sad_bgm.stop();
  drawEar();
	
}

function in_sad() {
	scr = 2;
  neu_bgm.stop();
  joy_bgm.stop();
  drawEar();
}

function out() {
  if(scr == 1 || scr == 2)
		scr = 0;
}

function drawEar() {
  if((!neu_bgm.isPlaying()) && (!joy_bgm.isPlaying()) && (!sad_bgm.isPlaying()))
    image(ear, 0.5*windowWidth, 0.5*windowHeight);
}

function geolocationCheck(){
  joy_dis = calcGeoDistance(cur_pos.latitude, cur_pos.longitude, 34.066784, -118.453136, 'mi');
  sad_dis = calcGeoDistance(cur_pos.latitude, cur_pos.longitude, 34.072879, -118.441136, 'mi');
	
  if(joy_dis < 0.01) {
		scr = 3;
  }
  else if(sad_dis < 0.01) {
    scr = 4;
  }
}

function drawCircles() {
  	if(scr == 0)
      fill(100, 40);
    else if(scr == 1)
      fill(joy_color);
    else if(scr == 2)
      fill(sad_color);

    noStroke();
    var neu_level = neu_amp.getLevel();
    var joy_level = joy_amp.getLevel();
    var sad_level = sad_amp.getLevel();
    var neu_r = neu_level * 735;
    var joy_r = joy_level * 1050;
    var sad_r = sad_level * 1000;

    if(scr == 0){
      ellipse(width/2, height/2, 330, 330);
      ellipse(width/2, height/2, 240, 240);
      ellipse(width/2, height/2, 150, 150);
      ellipse(width/2, height/2, neu_r, neu_r);
    }
    else if(scr == 1){
      ellipse(width/2, height/2, 330, 330);
      ellipse(width/2, height/2, 240, 250);
      ellipse(width/2, height/2, 150, 150);
      ellipse(width/2, height/2, joy_r, joy_r);
    }
    else if(scr == 2){
      ellipse(width/2, height/2, 330, 330);
      ellipse(width/2, height/2, 240, 250);
      ellipse(width/2, height/2, 150, 150);
      ellipse(width/2, height/2, sad_r, sad_r);
    }


    if(scr == 0)
      fill(100, v_alpha);
    else if(scr == 1)
      fill(255, 204, 30, v_alpha);
    else if(scr == 2)
      fill(87, 134, 209, v_alpha);
    ellipse(width/2, height/2, r, r);
    r += 2;
    v_alpha -= 0.13;
    if(v_alpha < -1) {
      v_alpha = 55;
      r = 0;
    }
}

function geolocationPrompt(){
  if(scr == 3){
    if(voicemail_checked)
      image(joy_img2, width/2, height/2, windowWidth, windowHeight);
    else
  		image(joy_img1, width/2, height/2, windowWidth, windowHeight);
  }
  else if(scr == 4) {
    if(call_ended)
      image(sad_img2, width/2, height/2, windowWidth, windowHeight);
    else
  		image(sad_img1, width/2, height/2, windowWidth, windowHeight);
  }
}
