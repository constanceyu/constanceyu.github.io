
//0 is opening
//1 is walking
//2 is wolf dialogue
//3 is sheep dialogue
var screen, background;
var open_text, arrow, arrow_display, op_gs, op_td, op_tl;
var bgm_1, bgm_2, walk_sound;
var mainchara, after_dia;
var wolf, wolf_bubble, wolf_talk;
var sheep, sheep_bubble, sheep_talk, bubble_display;
var grass_big, grass_small, tree_dark, tree_light;
var data, str, num, font_size;
//pos1 is for wolf and sheep
var pos1, pos_gb, pos_gs, pos_td, pos_tl;
//firsttime is for the introductory dialogue of the sheep and wolf
var firsttime;


function preload(){
    background = loadImage('background.png');
    open_text = loadImage('titleText.png');
    arrow = loadImage('arrow.png');
    mainchara = loadImage('mainChara.png');
    wolf = loadImage('wolf.png');
    wolf_bubble = loadImage('wolfDialogue.png');
    wolf_talk = loadImage('wolfNeed.png');
    sheep = loadImage('sheep.png');
    sheep_bubble = loadImage('sheepDialogue.png');
    sheep_talk = loadImage('sheepWant.png');
    grass_big = loadImage('grassBig.png');
    grass_small = loadImage('grassSmall.png');
    tree_dark = loadImage('treeDarker.png');
    tree_light = loadImage('treeLighter.png');
    
    data = loadStrings('results.txt');
    mainchara = loadAnimation("mainchara/mainchara_00000.png", "mainchara/mainchara_00031.png");
    
    bgm_1 = loadSound('bgm_1.mp3');
    bgm_2 = loadSound('bgm_2.m4a');
    walk_sound = loadSound('walk_sound.mp3');
}

function setup() { 
    createCanvas(windowWidth, windowHeight);
    screen = 0;
    op_gs = 0;
    op_td = 0;
    op_tl = 0;
    pos1 = 0.7*width;
    pos_gb = 0;
    pos_gs = 0;
    pos_tl = 0;
    pos_td = 0;
    font_size = floor(0.021*width);
    arrow_display = true;
    after_dia = false;
    bubble_display = true;
    num = floor(random(data.length));
    firsttime = true;
}

function draw() {
    // music
    if(!bgm_1.isPlaying()){
        bgm_1.play();
    }
    if(!bgm_2.isPlaying()){
        bgm_2.play();
    }

    if(screen == 0)
        drawScreen0();
    else if(screen == 1)
        drawScreen1();
    else if(screen == 2)
        drawScreen2();
    else if(screen == 3)
        drawScreen3();
}

function drawScreen0() {
    op_td -= 0.9;
    op_gs -= 0.5;
    op_tl -= 0.3;
    op_tl -= 0.2;
    
    if(op_gs <= -width){
        op_gs = width;
    }
    if(op_td <= -width){
        op_td = width;
    }
    if(op_tl <= -width){
        op_tl = width;
    }
    
    image(background, 0, 0, width, height);
    image(tree_light, op_tl, 0, width, height);
    image(grass_small, op_gs, 0, width, height);
    image(tree_dark, op_td, 0, width, height);
    image(open_text, 0, -0.03*height, width, height);
    animation(mainchara, width*0.5, height*0.6);
}

function drawScreen1() {
    image(background, 0, 0, width, height);
    if(keyIsDown(RIGHT_ARROW)){
        arrow_display = false;
        pos_gb -= 9;
        pos1 -= 7;
        pos_td -= 5;
        pos_gs -= 3;
        pos_tl -= 2;
        if(pos1 <= 0 && !after_dia){
            screen = 2;
        }
        if(!walk_sound.isPlaying())
            walk_sound.play();
        mainchara.play();
    }
    else{
        mainchara.stop();
        walk_sound.stop();
    }
    // check pos of wolf and sheep
    if(pos1 <= -width){
        pos1 = 0.7*width;
        after_dia = false;
        bubble_display = true;
    }
    // check pos of grasses
    if(pos_gs <= -width){
        pos_gs = width;
    }
    if(pos_gb <= -width){
        pos_gb = width;
    }
    // check pos of trees
    if(pos_td <= -width){
        pos_td = width;
    }
    if(pos_tl <= -width){
        pos_tl = width;
    }
    // tree height: 688
    // ground 511
    // 511/1200
    image(tree_light, pos_tl, 0, width, height);
    image(grass_small, pos_gs, 0, width, height);
    image(tree_dark, pos_td, 0, width, height);
    if(bubble_display)
        image(wolf_bubble, pos1, 0, width, height);
    image(wolf, pos1, 0, width, height);
//    push();
//    scale(height/1000);
//    animation(mainchara, width*(height/2000), height*(height*0.6/1000));
//    pop();
    animation(mainchara, width*0.5, height*0.6);
    image(sheep, pos1, 100, width, height);
    if(bubble_display)
        image(sheep_bubble, pos1, 0, width, height);
    image(grass_big, pos_gb, 0, width, height);
    if(arrow_display)
            image(arrow, 0, height*0.4, width, height);
}

function drawScreen2() {
    walk_sound.stop();
    image(wolf_talk, 0, 0, width, height);
    if(num%2 == 1)
        num--;
    textSize(font_size);
    fill(255);
    textFont('Raleway');
    if(firsttime){
        str = "Oh, hello there. I am the sheep of this forest. I know what you’re thinking. “What big teeth you have there, sheep!” But not everything is as it seems in this forest...";
    }
    else {
        str = data[num].replace(/\*/g, '\n');
    }  
    text(str, width*0.06, height*0.75, width*0.9); 

}

function drawScreen3() {
    image(sheep_talk, 0, 0, width, height);
    textSize(font_size);
    fill('#0D1421');
    textFont('Raleway');
    if(firsttime){
        str = "Hi, you’re looking for something. I am the wolf of the forest. I know what you’re thinking. But sometimes things that appear harsh on the outside aren’t really that when you look closely enough. I have a feeling we will see each other again...";
    }
    else {
        str = data[num].replace(/\*/g, '\n');
    }
    text(str, width*0.06, height*0.75, width*0.9);
    after_dia = true;
    bubble_display = false;
}


function mousePressed() {
    if(screen == 0){
        screen = 1;
    }
}

function keyPressed() {
    if((screen == 2) && (keyCode == RIGHT_ARROW)){
        screen = 3;
        num++;
    }
    else if((screen == 3) && (keyCode == RIGHT_ARROW)){
        screen = 1;
        firsttime = false;
        num = floor(random(data.length));
    }
        
}