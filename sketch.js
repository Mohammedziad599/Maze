//Maze
let cols;
let rows;
let w = 30;
let grid;

//A star
let openSet = [];
let closedSet = [];
let path = [];
let current;
let start;
let end;

//Flags
let userInput = false;
let recreate = false;
let solve = false;
let solved = false;
let justPrint = false;
let changeStart = false;
let changeEnd = false;
let alertUser = false;
let manhattanAndDistance = false;
let distanceOnly = false;
let allowDiagonalMove = true;

//Slider
let slider;
let prevSliderValue = 30;

//Buttons
let solveButton;
let modifyButton;
let recreateButton;
let helpButton;
let clearButton;
let setStartPointButton;
let setEndPointButton;
let twoHeuristicButton;
let euclideanHeuristicButton;
let manhattanHeuristicButton;
let toggleDiagonalButton;
let clearSolutionButton;


function heuristic(point1,point2){
  let d;
  if(manhattanAndDistance){
  d = point1.manhattanDistance(point2) + 
      abs(dist(point1.x,point1.y,point2.x,point2.y));
  }else if (distanceOnly){
    d = abs(dist(point1.x,point1.y,point2.x,point2.y));
  }else{
    d = point1.manhattanDistance(point2);
  }
  return d;
}

function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === elt) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

function make2DArray(cols, rows) {
  let array = new Array(cols);
  for (let i = 0; i < array.length; i++) {
    array[i] = new Array(rows);
  }
  return array;
}

function make2DArrayWithDefault(value){
  let array = make2DArray(cols,rows);
  for(let i=0;i<array.length;i++){
    array[i].fill(value);
  }
  return array;
}

//Depth-First Search Maze Generation
function mazeGeneration() {
  let maze = make2DArray(cols,rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      maze[i][j] = new Cell(i * w, j * w, w);
    }
  }
  let r = int(random(cols));
  while(r % 2 == 0){
    r = int(random(cols));
  }
  let c = int(random(rows));
  while(c % 2 == 0){
    c = int(random(rows));
  }
  maze[r][c].wall = false;

  recursion(maze,r,c);
  maze[1][1].start = true;
  maze[cols-2][rows-2].end = true;
  return maze;

}

//The recursive Part of the Algorithm
function recursion(maze,r,c){
  let randDirs = generateRandomDirection();
  for (let i = 0; i < randDirs.length; i++) {
    switch (randDirs[i]) {
      case 1: // Up
        if (c-2 <=0){
          continue;
        }
        if (maze[r][c-2].wall){
          maze[r][c-2].wall = false;
          maze[r][c-1].wall = false;
          recursion(maze,r,c-2);
        }
        break;
      case 2: // Right
        if(r+2 >= cols - 1){
          continue;
        }
        if(maze[r+2][c].wall){
          maze[r+2][c].wall = false;
          maze[r+1][c].wall = false;
          recursion(maze,r+2,c);
        }
        break;
      case 3: // Down
        if (c+2 >= rows - 1){
          continue;
        }
        if (maze[r][c+2].wall){
          maze[r][c+2].wall = false;
          maze[r][c+1].wall = false;
          recursion(maze,r, c+2);
        }
        break;
      case 4: // Left
        if (r-2 <= 0){
          continue;
        }
        if (maze[r-2][c].wall){
          maze[r-2][c].wall = false;
          maze[r-1][c].wall = false;
          recursion(maze,r-2,c);
        }
        break;
    }
  }
}

//create a suffled array that has for values {1,2,3,4}
function generateRandomDirection(){
  let randoms = [];
  for (let i = 0; i < 4; i++) {
    randoms.push(i+1);
  }
  shuffle(randoms,true);
  return randoms;
}

//handle user mouse input
function mousePressed() {
  if (userInput) {
    if (mouseButton == LEFT){
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let value = grid[i][j].toggleWall(mouseX, mouseY);
          if (value) {
            clearSolution();
            userInput = true;
            return;
          }
        }
      }
    }
  }else if(changeStart){
    if (mouseButton == LEFT){
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let value = grid[i][j].makeStart(mouseX,mouseY)
          if (value) {
            start.start = false;
            start = grid[i][j];
            start.start = true;
            clearSolution();
            return;
          }
        }
      }
    }
  }else if(changeEnd){
    if (mouseButton == LEFT){
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let value = grid[i][j].makeEnd(mouseX, mouseY);
          if (value) {
            end.end = false;
            end = grid[i][j];
            end.end = true;
            clearSolution();
            return;
          }
        }
      }
    }
  }
}

// handle userinput if 
// key == 'm' --> allow modify
// key == 's' --> solve the maze
// key == 'r' --> recreate the maze
// key == 'z' --> change the start point
// key == 'x' --> change the end point
// key == 'a' --> Use Both Manhattan and Euclidean distance
// key == 'd' --> Use Euclidean distance only
// key == 'q' --> Use Manhattan distance only
// key == 'e' --> toggle diagonal move
// key == 'w' --> clear the same maze
function keyTyped() {
  if (key === 'm') {
    modifyTheMaze();
  }
  if (key == 's' && !solved){
    solve = true;
  }
  if (key == 'r'){
    recreateTheMaze();
  }
  if(key == 'z'){
    changeStartingPoint();
  }
  if(key == 'x'){
    changeEndingPoin();
  }
  if(key == 'c'){
    clearMaze();
  }
  if(key == 'a'){
    changeToManhattanAndEuclidean();
  }
  if(key == 'd'){
    changeToEuclidean();
  }
  if(key == 'q'){
    changeToManhattan();
  }
  if(key == 'e'){
    toggleDiagonal();
  }
  if(key == 'w'){
    clearSolution();
  }
}

//this is called when the setStartPointButton pressed
function changeStartingPoint(){
  changeEnd = false;
  userInput = false;
  changeStart = true;
}

//this is called when the setEndPointButton pressed
function changeEndingPoint(){
  changeStart = false;
  userInput = false;
  changeEnd = true;
}

//this is called when the twoHeuristicButton pressed
function changeToManhattanAndEuclidean(){
  alert("you have change the Heuristic to both Euclidean and Manhattan");
  manhattanAndDistance = true;
  distanceOnly = false;
}

//this is called when the euclideanHeuristicButton pressed
function changeToEuclidean(){
  alert("you have change the Heuristic to Euclidean");
  manhattanAndDistance = false;
  distanceOnly = true;
}
//this is called when the manhattanHeuristicButton pressed
function changeToManhattan(){
  alert("you have change the Heuristic to Manhattan");
  manhattanAndDistance = false;
  distanceOnly = false;
}

//this is called when the toggleDiagonalButton pressed
function toggleDiagonal(){
  allowDiagonalMove = !allowDiagonalMove;
  if(allowDiagonalMove){
    alert("Diagonal move is turned on");
  }else{
    alert("Diagonal move is turned off");
  }
  clearSolution();
}

//this is called when solveButton is pressed
function solveTheMaze(){
  if (!solved){
    solve = true;
  }
}

//this is called when modifyButton is pressed
function modifyTheMaze() {
  changeStart = false;
  changeEnd = false;
  userInput = !userInput;
}

//this is called when recreateButton is pressed
function recreateTheMaze() {
  recreate = true;
}

//this is called when helpButton is pressed
function showHelp() {
  alert("You can use the keyboard for those tasks:\n"+
       "1- Press 'm' to toggle user input\n"+
       "2- Press 's' to solve the maze\n"+
       "3- Press 'r' to recreate the maze\n"+
       "4- Press 'z' to change the starting point\n"+
       "5- Press 'x' to change the ending point\n"+
       "6- Press 'a' to use Both Manhattan and Euclidean distance as a heuristic\n"+
       "7- Press 'd' to use Euclidean distance as a heuristic\n"+
       "8- Press 'q' to use Manhattan distance only 'it is also the default'\n"+
       "9- Press 'e' to toggle diagonal move\n"+
       "10- Press 'w' to clear the current maze solution");
}

function clearSolution(){
    recreate = false;
    justPrint = false;
    solved = false;
    solve = false;
    userInput = false;
    changeStart = false;
    changeEnd = false;
    alertUser = false;
    openSet = [];
    openSet.push(start);
    closedSet = [];
    for(let i = 0;i < cols;i++){
      for(let j = 0;j < rows;j++){
        grid[i][j].neighbors = [];
        grid[i][j].addNeighbors(grid);
        grid[i][j].h = Number.MAX_SAFE_INTEGER;
        grid[i][j].f = Number.MAX_SAFE_INTEGER;
        grid[i][j].g = Number.MAX_SAFE_INTEGER;
      }
    }
    start.g = 0;
    start.h = heuristic(start.getIndex(),end.getIndex());
    start.f = start.g + start.h;
}

function clearMaze(){
  for(let i = 0;i < cols;i++){
    for(let j = 0;j < rows;j++){
      grid[i][j].wall = false;
    }
  }
}

//this function in p5 js is fired once when the app is launched
function setup() {
  createCanvas(windowWidth, windowHeight - 40);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = mazeGeneration();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }
  start = grid[1][1];
  end = grid[cols-2][rows-2];
  openSet.push(start);
  //create the Slider
  slider = createSlider(10, 100, 30,10);
  slider.style('width', '200px');
  //create the buttons
  solveButton = createButton("Solve");
  solveButton.mousePressed(solveTheMaze);
  solveButton.style('margin-left','10px');
  modifyButton = createButton("Toggle Modify");
  modifyButton.mousePressed(modifyTheMaze);
  modifyButton.style('margin-left','10px');
  recreateButton = createButton("Hit To Recreate");
  recreateButton.mousePressed(recreateTheMaze);
  recreateButton.style('margin-left','10px');
  helpButton = createButton("Help");
  helpButton.mousePressed(showHelp);
  helpButton.style('margin-left','10px');
  clearButton = createButton("Clear walls");
  clearButton.mousePressed(clearMaze);
  clearButton.style('margin-left','10px');
  setStartPointButton = createButton("Change Start");
  setStartPointButton.mousePressed(changeStartingPoint);
  setStartPointButton.style('margin-left','10px');
  setEndPointButton = createButton("Change End");
  setEndPointButton.mousePressed(changeEndingPoint);
  setEndPointButton.style('margin-left','10px');
  twoHeuristicButton = createButton("H = M + E");
  twoHeuristicButton.mousePressed(changeToManhattanAndEuclidean);
  twoHeuristicButton.style('margin-left','10px');
  euclideanHeuristicButton = createButton("H = E");
  euclideanHeuristicButton.mousePressed(changeToEuclidean);
  euclideanHeuristicButton.style('margin-left','10px');
  manhattanHeuristicButton = createButton("H = M");
  manhattanHeuristicButton.mousePressed(changeToManhattan);
  manhattanHeuristicButton.style('margin-left','10px');
  toggleDiagonalButton = createButton("Toggle Diagonal");
  toggleDiagonalButton.mousePressed(toggleDiagonal);
  toggleDiagonalButton.style('margin-left','10px');
  clearSolutionButton = createButton("Clear Solution");
  clearSolutionButton.mousePressed(clearSolution);
  clearSolutionButton.style('margin-left','10px');
}

//this function is a continous loop and used to draw on the canvas 
function draw() {
  if (prevSliderValue != slider.value()){
    recreate = true;
    w = slider.value();
    prevSliderValue = slider.value();
  }
  background(0);
  if (recreate){
    //re-init everything
    createCanvas(windowWidth, windowHeight - 40);
    cols = floor(width / w);
    rows = floor(height / w);
    grid = mazeGeneration();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j].addNeighbors(grid);
      }
    }
    start = grid[1][1];
    end = grid[cols-2][rows-2];
    closedSet = [];
    openSet = [];
    openSet.push(start);
    recreate = false;
    justPrint = false;
    solved = false;
    solve = false;
    userInput = false;
    changeStart = false;
    changeEnd = false;
    alertUser = false;
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
  if (solve){
    //A star part
    if(openSet.length > 0){
      let winner = 0;
      for (let i = 0; i < openSet.length; i++) {
        if(openSet[i].f < openSet[winner].f){
          winner = i;
        }else if(openSet[i].f == openSet[winner].f){

          if (openSet[i].h < openSet[winner].h){
            winner = i;
          }else if(openSet[i].h == openSet[winner].h){
            //Tie Breaker
            let index1 = openSet[i].getIndex();
            let index2 = openSet[winner].getIndex();
            let index = index1.tieBreak(index2);
            if (index.x == index1.x && index.y == index1.y){
              winner = i;
            }
          }
        }
      }
      current = openSet[winner];
      if(current.getIndex().x == end.getIndex().x && current.getIndex().y == end.getIndex().y){
        solve = false;
        justPrint = true;
        solved = true;
        alertUser = true;
        console.log('DONE!');
      }
      openSet = removeFromArray(openSet, current);
      closedSet.push(current);

      let neighbors = current.neighbors;
      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        
        if(!closedSet.includes(neighbor) && !neighbor.wall){
          let tempF = current.g + heuristic(neighbor.getIndex(),end.getIndex()) + 1;
          let newPath = false;
          if (openSet.includes(neighbor)){
            let tempH = heuristic(neighbor.getIndex(),end.getIndex());
            if (tempF < neighbor.f){
              neighbor.g = current.g + 1;
              neighbor.h = heuristic(neighbor.getIndex(),end.getIndex());
              neighbor.f = tempF;
              newPath = true;
            }else if(tempF === neighbor.f){
              if (tempH < neighbor.h){
                neighbor.h = tempH;
                newPath = true;
              }
            }
          }else{
            neighbor.g = current.g + 1;
            neighbor.h = heuristic(neighbor.getIndex(),end.getIndex());
            neighbor.f = tempF;
            newPath = true;
            openSet.push(neighbor);
          }
          if (newPath){
            neighbor.g = current.g + 1;
            neighbor.h = heuristic(neighbor.getIndex(),end.getIndex());
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
      }
    }else{
      console.log('No Solution');
      alert("No Solution");
      solve = false;
      justPrint = true;
    }
  }

  if(solve || justPrint){
    //this used to color the closedSet
    for (let i = 0; i < closedSet.length; i++) {
      closedSet[i].showWithColor(color(255,0,0,90));
    }
    //this used to color the openSet
    for (let i = 0; i < openSet.length; i++) {
      openSet[i].showWithColor(color(0,0,255,90));
    }
    
    //find the path by backTracking.
    path = [];
    let temp = current;
    path.push(temp);
    while(temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }

    //draw the path as a coninous line.
    noFill();
    stroke(237, 34, 93);
    strokeWeight(w / 10);
    beginShape();
    for (var i = 0; i < path.length; i++) {
      vertex(path[i].x + w / 2, path[i].y + w / 2);
    }
    endShape();
    strokeWeight(1);
    if(alertUser){
      alertUser = false;
      alert("Path Found :-)");
    }
  }
}