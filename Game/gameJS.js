
var canvas;
var gl;
// var colors = [
//     vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
//     vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
// ];
var color;


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );


    gl.clearColor( 0, 0, 0, 1.0 );
		vBuffer = gl.createBuffer();

    //
    //  Load shaders and initialize attribute buffers
    //

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );



    render();
};

//-------------------------------------------------------------------------------
//key listeners

var leftPressed = 0;
var rightPressed=0;
window.addEventListener("keydown", keyDown, false); //for detecting keydown
window.addEventListener("keyup", keyUp, false); //for detecting key up
function keyDown(key) {
  if (key.key == "ArrowLeft"){
    leftPressed=1;
  }
  if (key.key == "ArrowRight"){
    rightPressed=1;
  }
}
function keyUp(key) {
  if (key.key == "ArrowLeft"){
    leftPressed=0;
  }
  if (key.key == "ArrowRight"){
    rightPressed=0;
  }
}

window.addEventListener("keypress", keyPress, false);
function keyPress(key) {
	if (key.key == " "){
		playerFire=1;
	}
}

//vairables involved in drawing the game
var redWidth= 0.1;
var maxX= 1-redWidth;
var minX= -1+redWidth;
var redDownSpeed= 2000; //changes the time between each interval of it coming down
var redBoxRandomness=0; //changes how frequently you want the boxes to change directions **MESSES UP THE COLLISION OCCASIONALLY so it's disabled for now**
var redBoxXSpeed=0.005;
var redInitialBoxNum=5;
var redBoxCollisionPadding=0.01;

//first row
var firstRowY=0.95;
var firstRowX=new Array(5);
var firstRowXDirection=new Array(5);


//second row
var secondRowY= 0.70;
var secondRowX=new Array(5);
var secondRowXDirection=new Array(5);

//player controlled greenbox
var greenSpeed= 0.01;
var greenWidth=redWidth;
var greenX=-0.05; //green starting location
var greenY=(-1+2*greenWidth);


//for loop for filling up the arrays
for(var i=0;i<redInitialBoxNum;i++){
	firstRowX[i]= (minX)+(maxX*2/redInitialBoxNum*i);
	secondRowX[i]= (minX)+(maxX*2/redInitialBoxNum*i);

	//direction arrays
	firstRowXDirection[i]=Math.floor(Math.random()*(2)); //fils it up with 1 or -1
	secondRowXDirection[i]=Math.floor(Math.random()*(2)); //fills it up with 1 or -1
}

//for moving the boxes down
setInterval(function(){
	if(firstRowY && secondRowY>= -0.7){
		firstRowY+= -0.1;
		secondRowY+= -0.1;
	}
},redDownSpeed);


//bullets section------------

//player bullets
var greenBulletStartY=(-0.85+greenWidth);
var greenBulletY=greenBulletStartY;
var greenBulletBase=0.03;
var greenBulletHeight=0.05;
var greenBulletX;
var playerFire=0;
var greenBullets=[]; //bullet vertices array
var greenShotsDelay=1; //controls how long in between each shot
var bulletStopper=greenShotsDelay; //starts the timer
var greenBulletSpeed=0.03;

//render---------------------------------------
function render() {

// Six Vertices
	var redBoxesFirstRow = [
		vec2 (firstRowX[0], firstRowY),
		vec2 (firstRowX[0]+redWidth, firstRowY),
		vec2 (firstRowX[0]+redWidth, firstRowY-(2*redWidth)),
		vec2 (firstRowX[0], firstRowY),
		vec2 (firstRowX[0]+redWidth, firstRowY-(2*redWidth)),
		vec2 (firstRowX[0], firstRowY-(2*redWidth)),

		vec2 (firstRowX[1], firstRowY),
		vec2 (firstRowX[1]+redWidth, firstRowY),
		vec2 (firstRowX[1]+redWidth, firstRowY-(2*redWidth)),
		vec2 (firstRowX[1], firstRowY),
		vec2 (firstRowX[1]+redWidth, firstRowY-(2*redWidth)),
		vec2 (firstRowX[1], firstRowY-(2*redWidth)),

		vec2 (firstRowX[2], firstRowY),
		vec2 (firstRowX[2]+redWidth, firstRowY),
		vec2 (firstRowX[2]+redWidth, firstRowY-(2*redWidth)),
		vec2 (firstRowX[2], firstRowY),
		vec2 (firstRowX[2]+redWidth, firstRowY-(2*redWidth)),
		vec2 (firstRowX[2], firstRowY-(2*redWidth)),

		vec2 (firstRowX[3], firstRowY),
		vec2 (firstRowX[3]+redWidth, firstRowY),
		vec2 (firstRowX[3]+redWidth, firstRowY-(2*redWidth)),
		vec2 (firstRowX[3], firstRowY),
		vec2 (firstRowX[3]+redWidth, firstRowY-(2*redWidth)),
		vec2 (firstRowX[3], firstRowY-(2*redWidth)),

		vec2 (firstRowX[4], firstRowY),
		vec2 (firstRowX[4]+redWidth, firstRowY),
		vec2 (firstRowX[4]+redWidth, firstRowY-(2*redWidth)),
		vec2 (firstRowX[4], firstRowY),
		vec2 (firstRowX[4]+redWidth, firstRowY-(2*redWidth)),
		vec2 (firstRowX[4], firstRowY-(2*redWidth))
	];


	var redBoxesSecondRow=[

		vec2 (secondRowX[0], secondRowY),
		vec2 (secondRowX[0]+redWidth, secondRowY),
		vec2 (secondRowX[0]+redWidth, secondRowY-(2*redWidth)),
		vec2 (secondRowX[0], secondRowY),
		vec2 (secondRowX[0]+redWidth, secondRowY-(2*redWidth)),
		vec2 (secondRowX[0], secondRowY-(2*redWidth)),

		vec2 (secondRowX[1], secondRowY),
		vec2 (secondRowX[1]+redWidth, secondRowY),
		vec2 (secondRowX[1]+redWidth, secondRowY-(2*redWidth)),
		vec2 (secondRowX[1], secondRowY),
		vec2 (secondRowX[1]+redWidth, secondRowY-(2*redWidth)),
		vec2 (secondRowX[1], secondRowY-(2*redWidth)),

		vec2 (secondRowX[2], secondRowY),
		vec2 (secondRowX[2]+redWidth, secondRowY),
		vec2 (secondRowX[2]+redWidth, secondRowY-(2*redWidth)),
		vec2 (secondRowX[2], secondRowY),
		vec2 (secondRowX[2]+redWidth, secondRowY-(2*redWidth)),
		vec2 (secondRowX[2], secondRowY-(2*redWidth)),

		vec2 (secondRowX[3], secondRowY),
		vec2 (secondRowX[3]+redWidth, secondRowY),
		vec2 (secondRowX[3]+redWidth, secondRowY-(2*redWidth)),
		vec2 (secondRowX[3], secondRowY),
		vec2 (secondRowX[3]+redWidth, secondRowY-(2*redWidth)),
		vec2 (secondRowX[3], secondRowY-(2*redWidth)),

		vec2 (secondRowX[4], secondRowY),
		vec2 (secondRowX[4]+redWidth, secondRowY),
		vec2 (secondRowX[4]+redWidth, secondRowY-(2*redWidth)),
		vec2 (secondRowX[4], secondRowY),
		vec2 (secondRowX[4]+redWidth, secondRowY-(2*redWidth)),
		vec2 (secondRowX[4], secondRowY-(2*redWidth)),


	];


  var greenBox=[
    //greenbox, player controlled
    vec2 (greenX, greenY),
		vec2 (greenX+greenWidth, greenY),
		vec2 (greenX+greenWidth, greenY-(2*greenWidth)),
		vec2 (greenX, greenY),
		vec2 (greenX+greenWidth, greenY-(2*greenWidth)),
		vec2 (greenX, greenY-(2*greenWidth))
  ]
	//BULLETS

	greenBulletStartX=(greenX+(greenWidth/2)); //tracking the greenbox


	if(playerFire==1){
		playerFire=0;
		if( bulletStopper>=greenShotsDelay){
			bulletStopper=0;
			greenBullets.push(vec2(greenBulletStartX,greenBulletStartY));
			greenBullets.push(vec2(greenBulletStartX-(greenBulletBase/2),greenBulletStartY-greenBulletHeight));
			greenBullets.push(vec2(greenBulletStartX+(greenBulletBase/2),greenBulletStartY-greenBulletHeight));
		}

	}

	for(var k=0;k<(greenBullets.length/3);k++){
		greenBullets[(k*3)][1]+=greenBulletSpeed;
		greenBullets[(k*3)+1][1]+=greenBulletSpeed;
		greenBullets[(k*3)+2][1]+=greenBulletSpeed;
	}
	bulletStopper+=1; //counts up


//detecting green missle collision with red boxes

	//bottomrow
	for(var j=0;j<secondRowX.length;j++){
		for(var i=0;i<greenBullets.length/3;i++){

				//second row
			if (greenBullets.length>=3 && redBoxesSecondRow.length>=6){
				if (greenBullets[i*3][0]>=secondRowX[j] && greenBullets[i*3][0]<=secondRowX[j]+redWidth && greenBullets[i*3][1]>=secondRowY-redWidth && greenBullets[i][1]<=secondRowY){
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);

					secondRowX.splice(j,1);
					secondRowXDirection.splice(j,1);
					redBoxesSecondRow.splice(j*6,6)//6 times because 6 verticies

				}
				//detecting collision for left vertice
				else if (greenBullets[i*3+1][0]>=secondRowX[j] && greenBullets[i*3+1][0]<=secondRowX[j]+redWidth && greenBullets[i*3+1][1]>=secondRowY-redWidth && greenBullets[i+1][1]<=secondRowY){
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);

					secondRowX.splice(j,1);
					secondRowXDirection.splice(j,1);
					redBoxesSecondRow.splice(j*6,6);//6 times because 6 verticies

				}
				//detecting collision for right vertice
				else if (greenBullets[i*3+2][0]>=secondRowX[j] && greenBullets[i*3+2][0]<=secondRowX[j]+redWidth && greenBullets[i*3+2][1]>=secondRowY-redWidth && greenBullets[i*3+2][1]<=secondRowY){
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);

					secondRowX.splice(j,1);
					secondRowXDirection.splice(j,1);
					redBoxesSecondRow.splice(j*6,6);//6 times because 6 verticies

				}
			}
		}
	}

	//toprow
	for(var j=0;j<firstRowX.length;j++){
		for(var i=0;i<greenBullets.length/3;i++){

			//detecting collision for top vertice
			if (greenBullets.length>=3){

				//firstrow
				if (greenBullets[i*3][0]>=firstRowX[j] && greenBullets[i*3][0]<=firstRowX[j]+redWidth && greenBullets[i*3][1]>=firstRowY-redWidth && greenBullets[i][1]<=firstRowY){
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);

					firstRowX.splice(j,1);
					firstRowXDirection.splice(j,1);
					redBoxesSecondRow.splice(j*6,6);//6 times because 6 verticies
				}
				//detecting collision for left vertice
				else if (greenBullets[i*3+1][0]>=firstRowX[j] && greenBullets[i*3+1][0]<=firstRowX[j]+redWidth && greenBullets[i*3+1][1]>=firstRowY-redWidth && greenBullets[i+1][1]<=firstRowY){
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);

					firstRowX.splice(j,1);
					firstRowXDirection.splice(j,1);
					redBoxesSecondRow.splice(j*6,6);//6 times because 6 verticies
				}
				//detecting collision for right vertice
				else if (greenBullets[i*3+2][0]>=firstRowX[j] && greenBullets[i*3+2][0]<=firstRowX[j]+redWidth && greenBullets[i*3+2][1]>=firstRowY-redWidth && greenBullets[i*3+2][1]<=firstRowY){
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);
					greenBullets.splice(i*3,1);

					firstRowX.splice(j,1);
					firstRowXDirection.splice(j,1);
					redBoxesSecondRow.splice(j*6,6);//6 times because 6 verticies
				}


			}
		}
	}


//moving the boxes side to side randomly

	//firstrow
	for(var j=0; j<redBoxesFirstRow.length/6;j++){

		if(firstRowXDirection[j]==1){
			firstRowX[j]+=redBoxXSpeed;

		}
		else if(firstRowXDirection[j]==0){
			firstRowX[j]-=redBoxXSpeed;
		}


		//detecting collision with each other
		for(var m=0;m<redBoxesFirstRow.length/6;m++){
			if((firstRowX[j]+redWidth+redBoxCollisionPadding)>=firstRowX[m] && (firstRowX[j]+redWidth+redBoxCollisionPadding/5)<= firstRowX[m] && j!=m && firstRowXDirection[j]==1){
				if(firstRowXDirection[j]==1){
					firstRowXDirection[j]=0;
				}
				else if(firstRowXDirection[j]==0){
					firstRowXDirection[j]=1;
				}

				if(firstRowXDirection[m]==1){
					firstRowXDirection[m]=0;
				}
				else if(firstRowXDirection[m]==0){
					firstRowXDirection[m]=1;
				}
			}
		}

		if(Math.floor(Math.random()*(redBoxRandomness))==1 || (firstRowX[j])<=(minX-redWidth) || firstRowX[j]>= maxX){
			if(firstRowXDirection[j]==1){
				firstRowXDirection[j]=0;
			}
			else if(firstRowXDirection[j]==0){
				firstRowXDirection[j]=1;
			}
		}
	}

	//second row stuffs
	for(var j=0; j<redBoxesSecondRow.length/6;j++){

		if(secondRowXDirection[j]==1){
			secondRowX[j]+=redBoxXSpeed;

		}
		else if(secondRowXDirection[j]==0){
			secondRowX[j]-=redBoxXSpeed;
		}

		//detecting collision with each other
		for(var m=0;m<redBoxesSecondRow.length/6;m++){

			if((secondRowX[j]+redWidth+redBoxCollisionPadding)>=secondRowX[m] && (secondRowX[j]+redWidth+redBoxCollisionPadding/5)<= secondRowX[m] && j!=m && secondRowXDirection[j]==1){
				if(secondRowXDirection[j]==1 ){
					secondRowXDirection[j]=0;
				}
				else if(secondRowXDirection[j]==0 ){
					secondRowXDirection[j]=1;
				}

				if(secondRowXDirection[m]==1 ){
					secondRowXDirection[m]=0;
				}
				else if(secondRowXDirection[m]==0 ){
					secondRowXDirection[m]=1;
				}
			}
		}

		if(Math.floor(Math.random()*(redBoxRandomness))==1 || (secondRowX[j])<=(minX-redWidth) || secondRowX[j]>= (maxX)){
			if(secondRowXDirection[j]==1){
				secondRowXDirection[j]=0;
			}
			else if(secondRowXDirection[j]==0){
				secondRowXDirection[j]=1;
			}
		}

	}

  //moving the green box
  if (leftPressed==1 && greenX>=-1){
    greenX-=greenSpeed;
  }
  if (rightPressed==1 && greenX+greenWidth<=1){
    greenX+=greenSpeed;
  }

	// Binding the vertex buffer\
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.clear( gl.COLOR_BUFFER_BIT );

  //boxes
	gl.bufferData( gl.ARRAY_BUFFER, flatten(redBoxesFirstRow), gl.STATIC_DRAW );
  color=vec4(1,0,0,1);
  colorLoc=gl.getUniformLocation(program,"color");
  gl.uniform4fv(colorLoc,color);
  gl.drawArrays( gl.TRIANGLES, 0, redBoxesFirstRow.length ); //changed to length so that it's not hard coded in and will self update

	gl.bufferData( gl.ARRAY_BUFFER, flatten(redBoxesSecondRow), gl.STATIC_DRAW );
  color=vec4(1,0,0,1);
  colorLoc=gl.getUniformLocation(program,"color");
  gl.uniform4fv(colorLoc,color);
  gl.drawArrays( gl.TRIANGLES, 0, redBoxesSecondRow.length ); //changed to length so that it's not hard coded in and will self update

  //green box drawing
  gl.bufferData( gl.ARRAY_BUFFER, flatten(greenBox), gl.STATIC_DRAW );
  color=vec4(0,1,0,1);
  colorLoc=gl.getUniformLocation(program,"color");
  gl.uniform4fv(colorLoc,color);
  gl.drawArrays( gl.TRIANGLES, 0, greenBox.length );

	if(greenBullets.length>0){
		gl.bufferData(gl.ARRAY_BUFFER, flatten(greenBullets), gl.STATIC_DRAW);
    color=vec4(0,1,0,1);
    colorLoc=gl.getUniformLocation(program,"color");
    gl.uniform4fv(colorLoc,color);
		gl.drawArrays( gl.TRIANGLES, 0, greenBullets.length );

		//removing the bullets after it went past
		if((greenBullets[greenBullets.length-2][1])>=1){ //finds the heighest bullet
			greenBullets.pop();//pops three times to get rid of all three vertices
			greenBullets.pop();
			greenBullets.pop();
		}
	}




  window.requestAnimationFrame(render);
}
