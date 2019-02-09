const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(28, 28);

context.fillStyle = '#3B1B2B';
context.fillRect(0, 0, canvas.width, canvas.height);

const matrix = [
  [0, 0, 0],
  [1, 1, 0],
  [0, 1, 1],
];

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = 'purple';
        context.fillRect(x + offset.x,
                         y + offset.y,
                         1, 1);
      }
    });
  });
}

drawMatrix(matrix, {x: 5, y: 5});
