const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(28, 28);

// const matrix = [
//   [0, 0, 0],
//   [1, 1, 0],
//   [0, 1, 1],
// ];

//to clear the line(s) witch is filled with bricks
function arenaSweep() {
  let rowCount = 1;
  //we check if there is a line without 0, continue till we find it
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
    //we get the full row,fill it with zeros and place on top
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;

    player.lines += 1;
    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

//function detecting a collision
function collide(arena, player) {
  //breaking out player matrix and position
  const [m, o] = [player.matrix, player.pos];
  //we iterate over the player
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
        //we check if arena row exists (o is offset)
          (arena[y + o.y] &&
            //and check if column exists
           arena[y + o.y][x + o.x]) !== 0) {
        //returning true because collision happened
           return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h) {
  const matrix = [];
  //while height is not zero we decrease it by one
  while (h--) {
    //we push a new width array filled with zeros (empty line)
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function createPiece(type) {
  if (type === 'Z') {
    return [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ];
  } else if (type === 'O') {
    return [
        [2, 2],
        [2, 2],
    ];
  } else if (type === 'I') {
    return [
        [0, 3, 0, 0],
        [0, 3, 0, 0],
        [0, 3, 0, 0],
        [0, 3, 0, 0],
    ];
  } else if (type === 'S') {
    return [
        [0, 4, 4],
        [4, 4, 0],
        [0, 0, 0],
    ];
  } else if (type === 'L') {
    return [
        [0, 5, 0],
        [0, 5, 0],
        [0, 5, 5],
    ];
  } else if (type === 'J') {
    return [
        [0, 6, 0],
        [0, 6, 0],
        [6, 6, 0],
    ];
  } else if (type === 'T') {
    return [
        [7, 7, 7],
        [0, 7, 0],
        [0, 0, 0],
    ];
  }
}

//draw function
function draw() {
  context.fillStyle = '#0C1C2D';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {x: 0, y: 0});""
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x,
                         y + offset.y,
                         1, 1);
      }
    });
  });
}

//function to copy the values of the player and merge it into arena at correct positions
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    //if collision occured - set player back to top
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateLines();
    updateScore();
  }
  dropCounter = 0;
}

//moves the puzzle nad checks if there is a collision( doesn't let to go over other puzzle or outside game canvas)
function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerReset() {
  const pieces = 'ZOISLJT';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  //we place player at the top
  player.pos.y = 0;
  //and in the middle
  player.pos.x = (arena[0].length / 2 | 0) -
                 (player.matrix[0].length / 2 | 0);
  //to check if game is over(puzzles reached the top)
  if (collide(arena, player)) {
    //clear the arena to start again
    arena.forEach(row => row.fill(0));
    player.lines = 0;
    player.score = 0;
    updateLines();
    updateScore();
  }
}

function playerRotate (dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while(collide(arena, player)) {
    //if we collide we move the player by offset(1)
    player.pos.x += offset;
    //if we still collide we need to have another offset
    offset = -(offset + (offset > 0 ? 1 : -1));
    //check if offset is more than player matrix first rows length
    //means that we moved too much and we need to rotate back
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
};

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [
            matrix[x][y],
            matrix[y][x],
      ] = [
            matrix[y][x],
            matrix[x][y],
      ];
    }
  }
  //we check direction, if positive - reverse the row, if no - reverse the matrix
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

let dropCounter = 0;
//drops every 1 second
let dropInterval = 1000;

let lastTime = 0;

//update function to draw continuously
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

function updateLines() {
  document.getElementById('lines').innerText = player.lines;
}

function updateScore() {
  document.getElementById('score').innerText = player.score;
}

const colors = [
  null,
  'purple',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'aqua'
];

//arena - the whole canvas area where we set width  with 12 units and hight with 20 units
const arena = createMatrix(12, 20);

//player structure that has a position and matrix
const player = {
  pos: {x: 0, y: 0},
  matrix: null,
  score: 0,
  lines: 0,
};

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    //goes left if press left arrow
    playerMove(-1);
  } else if (event.keyCode === 39) {
    playerMove(1);
  } else if (event.keyCode === 40) {
    playerDrop();
  } else if (event.keyCode === 65) {
    playerRotate(-1);
  } else if (event.keyCode === 83) {
    playerRotate(1);
  }
})

playerReset();
updateLines();
updateScore();
update();



















