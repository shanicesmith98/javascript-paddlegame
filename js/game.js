    var canvas;
    var canvasContext;
    var userBGColor = prompt("What color do you want the background to be? (RED, BLUE, GREEN)");
    var userBallColor = prompt("What color do you want the ball to be? (RED, BLUE, GREEN)");
    
    var ballX = 50;
    var ballY = 50;
    var ballSpeedX = 5;
    var ballSpeedY = 5;

    var playerOneScore = 0;
    var playerTwoScore = 0;
    const WINNING_SCORE = prompt("Choose a winning score! (1 - 100)");

    var showingWinScreen = false;

    var paddleOneY = 250;
    var paddleTwoY =  250;
    const PADDLE_HEIGHT = 100; // can't change during gameplay
    const PADDLE_THICKNESS = 10;

    if (userBGColor == "red" || userBGColor == "Red" || userBGColor == "RED") {
      var bgColor = "#613333";
    }
    else if (userBGColor == "green" || userBGColor == "Green" || userBGColor == "GREEN") {
      bgColor = "#396133";
    }
    else if (userBGColor == "blue" || userBGColor == "Blue" || userBGColor == "BLUE") {
      bgColor = "#333361";
    } else {
          bgColor = "#000000";
    }

    if (userBallColor == "red" || userBallColor == "Red" || userBallColor == "RED") {
      var ballColor = "#cf7a7a";
    }
    else if (userBallColor == "green" || userBallColor == "Green" || userBallColor == "GREEN") {
      ballColor = "#85cf7a";
    }
    else if (userBallColor == "blue" || userBallColor == "Blue" || userBallColor == "BLUE") {
      ballColor = "#7aa6cf";
    } else {
        ballColor = "#ffffff";
      }

    function calculateMousePos(evt) { // recieve mouse coords from within canvas
      var rect = canvas.getBoundingClientRect();
      var root = document.documentElement;
      var mouseX = evt.clientX - rect.left - root.scrollLeft;
      var mouseY = evt.clientY - rect.top - root.scrollTop;
      return {
              x:mouseX,
              y:mouseY
      }
    }

    function handleMouseClick(evt) { // click screen to return to game
      if(showingWinScreen) {
        playerOneScore = 0;
        playerTwoScore = 0;
        showingWinScreen = false;
      }
    }

    window.onload = function() {
      canvas = document.getElementById('gameCanvas'); // for drawing grapics
      canvasContext = canvas.getContext('2d'); // for drawing graphics
      canvasContext.font = "30px Arial";

      var framesPerSecond = 30;
      setInterval(function() {
              moveEverything();
              drawEverything();
      }, 500/framesPerSecond); // frame rate

      canvas.addEventListener('mousedown', handleMouseClick); // calls function for mouse click

      canvas.addEventListener('mousemove',
              function(evt) {
                var mousePos = calculateMousePos(evt);
                paddleOneY = mousePos.y - (PADDLE_HEIGHT/2);
              }); // tracks mouse movement
    }

    function ballReset() { // sends ball back to starts
      if (playerOneScore > WINNING_SCORE || playerTwoScore > WINNING_SCORE) {
        showingWinScreen = true; // shows win screen when a player wins
      }

      ballSpeedX /= -1; // values switchs between pos and neg
      ballX = canvas.width/2;
      ballY = canvas.height/2;
    }

    function computerMovement() {
      var paddleTwoYCenter = paddleTwoY + (PADDLE_HEIGHT/2); // finds center of paddle
      if (paddleTwoYCenter < ballY - 35) {
        paddleTwoY += 10;
      } else if (paddleTwoYCenter > ballY + 35) {
        paddleTwoY -= 10;
      }

    }

    function moveEverything() {
      computerMovement();

      ballX += ballSpeedX; // moves ball verticallly
      ballY += ballSpeedY; // moves ball horizonally
      if (ballX < 0) {
        if (ballY > paddleOneY && ballY < paddleOneY + PADDLE_HEIGHT) {
            ballSpeedX /= -1;

            var deltaY = ballY - (paddleOneY+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            playerTwoScore++;
            ballReset(); // resets ball and gives other player a point
            
        }  
      }

      if (ballX > canvas.width) {
        if (ballY > paddleTwoY && ballY < paddleTwoY + PADDLE_HEIGHT) {
            ballSpeedX /= -1;

            var deltaY = ballY - (paddleTwoY+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            playerOneScore++;
            ballReset();
            
        }  
      }

      if (ballY > canvas.height) {
        ballSpeedY /= -1;
      }

      if (ballY < 0) {
        ballSpeedY /= -1;
      }
    }

    function drawNet() { // draws middle net
      for (var i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width/2 - 1, i, 2, 20, 'white');
      }
    }

    function drawEverything() {
      colorRect(0, 0, canvas.width, canvas.height, bgColor); // background

      if (showingWinScreen) {
        canvasContext.fillStyle = 'white';
        if (playerOneScore > WINNING_SCORE) {
          canvasContext.fillText("You won!", 330, 200);
        } else if (playerTwoScore > WINNING_SCORE) {
          canvasContext.fillText("Computer won!", 330, 200);
        }
        canvasContext.fillText("Click to continue!", 285, 500);
        return;
      }

      drawNet();

      colorCircle(ballX, ballY, 10, ballColor); // ball
      colorRect(0, paddleOneY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white'); // left paddle
      colorRect(canvas.width - PADDLE_THICKNESS, paddleTwoY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white'); // right paddle
      canvasContext.fillText(playerOneScore, 100, 100); // player 1 score text
      canvasContext.fillText(playerTwoScore, canvas.width - 100, 100); // player 2 score text
    }

    function colorRect(leftX, topY, width, height, drawColor) { // reuseable function for drawing rectangles/squares
      canvasContext.fillStyle = drawColor;
      canvasContext.fillRect(leftX, topY, width, height);
    }

    function colorCircle(centerX, centerY, radius, drawColor) { // reuseable function for drawing circles
      canvasContext.fillStyle = drawColor;
      canvasContext.beginPath();
      canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
      canvasContext.fill();
    }