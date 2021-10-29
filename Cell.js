function Cell(x, y, w, start, end) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.start = start;
  this.end = end;
  this.wall = true;
  this.f = Number.MAX_SAFE_INTEGER;
  this.g = Number.MAX_SAFE_INTEGER;
  this.h = Number.MAX_SAFE_INTEGER;
  this.neighbors = [];
  this.previous;
}

Cell.prototype.show = function() {
  stroke(0);
  if (this.wall) {
    fill(0);
  } else {
    fill(255);
  }
  rect(this.x, this.y, this.w, this.w);
  if (this.start) {
    this.wall = false;
    this.h = heuristic(start.getIndex(),end.getIndex());
    this.g = 0;
    this.f = this.h+this.g;
    fill(127, 0, 0);
    circle(this.x + this.w / 2, this.y + this.w / 2, this.w / 2);
  } else if (this.end) {
    fill(0, 127, 0);
    this.wall = false;
    circle(this.x + this.w / 2, this.y + this.w / 2, this.w / 2);
  }
}

Cell.prototype.toggleWall = function(x, y) {
  if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w) {
    this.wall = !this.wall;
    return true;
  }
  return false;
}

Cell.prototype.makeStart = function(x, y) {
  if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w) {
    if (!this.end && !this.wall){
      this.start = true;
      return true;
    }
  }
  return false;
}

Cell.prototype.makeEnd = function(x, y) {
  if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w) {
    if (!this.start && !this.wall){
      this.end = true;
      return true;
    }
  }
  return false;
}

Cell.prototype.getIndex = function(){
  let point = new Point();
  point.x = this.x / this.w;
  point.y = this.y / this.w;
  return point;
}

Cell.prototype.addNeighbors = function(grid) {
  var i = this.getIndex().x;
  var j = this.getIndex().y;
  if (i < cols - 1) {
    this.neighbors.push(grid[i + 1][j]);
  }
  if (i > 0) {
    this.neighbors.push(grid[i - 1][j]);
  }
  if (j < rows - 1) {
    this.neighbors.push(grid[i][j + 1]);
  }
  if (j > 0) {
    this.neighbors.push(grid[i][j - 1]);
  }
  if(allowDiagonalMove){
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  }
};

Cell.prototype.showWithColor = function(col) {
  fill(col);
  rect(this.x,this.y,w,w);
}