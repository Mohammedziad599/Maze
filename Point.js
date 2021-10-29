function Point(x, y) {
  this.x = x;
  this.y = y;
}

// used in the Heuristic to calculate the Distance.
Point.prototype.manhattanDistance = function(point){
  let xDistance = abs(this.x - point.x);
  let yDistance = abs(this.y - point.y);
  return xDistance + yDistance;
}

//this is used when there is a tie in the A star algo.
Point.prototype.tieBreak = function(point){
  if (this.y < point.y && this.x > point.x){
    return this;
  }
  if(point.y < this.y && point.x > this.x){
    return point;
  }
  if (point.y == this.y){
    if (point.x > this.x){
      return point;
    }else{
      return this;
    }
  }
  if (point.x == this.x){
    if (point.y > this.y){
      return point;
    }else{
      return this;
    }
  }
  return this;
}