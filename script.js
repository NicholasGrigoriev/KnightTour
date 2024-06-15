class Chessboard {
  constructor(size) {
    this.size = size;
    this.chessBoardState = [];
    this.startPoint = [];
    for (let i = 0; i < size; i++) {
      this.chessBoardState.push([]);
      for (let j = 0; j < size; j++) {
        this.chessBoardState[i].push(0);
      }
    }
    console.log("initiated chessboard: ", this.chessBoardState);
  }
}

class KnightTour {
  constructor(chessboard) {
    this.chessboard = chessboard;
    this.knightMoves = [
      [2, 1],
      [1, 2],
      [-1, 2],
      [-2, 1],
      [-2, -1],
      [-1, -2],
      [1, -2],
      [2, -1],
    ];
    this.iterations = 0;
  }

  solveKnightTour(x, y, completeTour) {
    console.log("solving for ", x, y);
    this.startPoint = [x, y];
    const path = [];
    this.iterations = 0; // Reset iteration counter
    console.log("solveKnightTour");
    try {
      if (this.solveNextStep(x, y, 1, path, completeTour)) {
        console.log("result path, ", path);
        console.log("Total iterations: ", this.iterations);
        document.getElementById(
          "iterations"
        ).textContent = `Iterations: ${this.iterations}`;
        return path.map((move) => this.convertToChessNotation(move));
      } else {
        console.log("Total iterations: ", this.iterations);
        document.getElementById(
          "iterations"
        ).textContent = `Iterations: ${this.iterations}`;
        return false;
      }
    } catch (ex) {
      console.log("error in solveKnightTour", ex);
    }
  }

  solveNextStep(x, y, depth, path, completeTour) {
    this.iterations++;
    this.chessboard.chessBoardState[x][y] = depth;
    path.push([x, y]);
    // we walked over all the cells
    if (depth === this.chessboard.size * this.chessboard.size) {
      if (completeTour) {
        // Check if the starting point is a valid move from the current position
        for (const move of this.getValidMovesWithDegrees(x, y, true)) {
          if (
            move[0] === this.startPoint[0] &&
            move[1] === this.startPoint[1]
          ) {
            console.log("we are done at ", depth);
            return true;
          }
        }
      } else {
        console.log("we are done at ", depth);
        return true;
      }
    }

    for (const nextMove of this.getValidMovesWithDegrees(x, y)) {
      if (
        this.solveNextStep(
          nextMove[0],
          nextMove[1],
          depth + 1,
          path,
          completeTour
        )
      ) {
        return true;
      }
    }
    this.chessboard.chessBoardState[x][y] = 0;
    path.pop();
    return false;
  }

  //*returns array of objects [{[x,y], degree:n}] degree is the number of available moves from x,y.

  getValidMovesWithDegrees(x, y, ignoreStart = false) {
    return this.getValidMoves(x, y, ignoreStart)
      .map((move) => ({
        move,
        degree: this.getLocationDegrees(move[0], move[1]),
      }))
      .sort((a, b) => a.degree - b.degree)
      .map(({ move }) => move);
  }

  getValidMoves(x, y, ignoreStart = false) {
    return this.knightMoves
      .map((move) => [x + move[0], y + move[1]])
      .filter(([nextX, nextY]) => this.isValidMove(nextX, nextY, ignoreStart));
  }
  //return the number of valid moves (degree) for the point x,y
  getLocationDegrees(x, y) {
    let moveDegree = 0;
    for (const move of this.knightMoves) {
      const nextX = x + move[0];
      const nextY = y + move[1];
      if (this.isValidMove(nextX, nextY)) {
        moveDegree += 1;
      }
    }
    return moveDegree;
  }

  isValidMove(x, y, ignoreStart = false) {
    return (
      0 <= x &&
      x < this.chessboard.size &&
      0 <= y &&
      y < this.chessboard.size &&
      (ignoreStart || this.chessboard.chessBoardState[x][y] === 0)
    );
  }

  convertToChessNotation([x, y]) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return `${letters[x]}${this.chessboard.size - y}`;
  }
}

// --- CODING SECTION END ---

class ChessboardRenderer {
  static CHESSBOARD_SIZE = 8;
  static render() {
    const chessboardElement = document.getElementById("chessboard");
    chessboardElement.innerHTML = "";

    const size = parseInt(document.getElementById("boardSize").value);
    ChessboardRenderer.CHESSBOARD_SIZE = size;

    const colLabelRowTop = document.createElement("tr");
    colLabelRowTop.innerHTML = '<td class="column-label"></td>';
    for (let x = 0; x < size; x++) {
      const colLabelCell = document.createElement("td");
      colLabelCell.textContent = String.fromCharCode(65 + x);
      colLabelRowTop.appendChild(colLabelCell);
    }
    chessboardElement.appendChild(colLabelRowTop);

    for (let y = 0; y < size; y++) {
      const row = document.createElement("tr");
      const numberLabelCellLeft = document.createElement("td");
      numberLabelCellLeft.className = "row-label";
      numberLabelCellLeft.textContent = size - y;
      row.appendChild(numberLabelCellLeft);
      for (let x = 0; x < size; x++) {
        const cell = document.createElement("td");
        cell.id = `${String.fromCharCode(65 + x)}${size - y}`;
        cell.className = (y + x) % 2 === 0 ? "light" : "dark";
        cell.addEventListener("click", () => this.onCellClick(x, y));
        row.appendChild(cell);
      }
      const numberLabelCellRight = document.createElement("td");
      numberLabelCellRight.className = "row-label";
      numberLabelCellRight.textContent = size - y;
      row.appendChild(numberLabelCellRight);
      chessboardElement.appendChild(row);
    }
    const colLabelRowBottom = document.createElement("tr");
    colLabelRowBottom.innerHTML = '<td class="column-label"></td>';
    for (let x = 0; x < size; x++) {
      const colLabelCell = document.createElement("td");
      colLabelCell.textContent = String.fromCharCode(65 + x);
      colLabelRowBottom.appendChild(colLabelCell);
    }
    chessboardElement.appendChild(colLabelRowBottom);
  }

  static onCellClick(x, y) {
    ChessboardRenderer.render();
    const chessboard = new Chessboard(ChessboardRenderer.CHESSBOARD_SIZE);
    const knightTour = new KnightTour(chessboard);
    const completeTour = document.getElementById("completeTour").checked;
    new Promise((resolve, reject) => {
      const result = knightTour.solveKnightTour(x, y, completeTour);
      return result ? resolve(result) : reject();
    })
      .then((result) => {
        const chessboardElement = document.getElementById("chessboard");
        if (result instanceof Array) {
          result.forEach((key, idx) => {
            const cellElement = document.getElementById(key);
            if (cellElement) {
              const keyTextElement = document.createElement("span");
              keyTextElement.textContent = idx + 1;
              const depth = idx + 1;
              const colorIntensity = Math.min(
                255,
                Math.floor(
                  (depth /
                    (ChessboardRenderer.CHESSBOARD_SIZE *
                      ChessboardRenderer.CHESSBOARD_SIZE)) *
                    255
                )
              );
              cellElement.style.backgroundColor = `rgb(${
                255 - colorIntensity
              }, ${255 - colorIntensity}, ${255})`;
              cellElement.appendChild(keyTextElement);
            }
          });
        }
        const row = document.createElement("tr");
        const resultElement = document.createElement("td");
        resultElement.colSpan = ChessboardRenderer.CHESSBOARD_SIZE + 2;
        resultElement.textContent =
          result instanceof Array
            ? result.map((key, idx) => `${idx + 1}. ${key}`).join("; ")
            : result;
        row.appendChild(resultElement);
        chessboardElement.appendChild(row);
      })
      .catch((error) => {
        console.log("error in solving: ", error);
        const chessboardElement = document.getElementById("chessboard");
        const row = document.createElement("tr");
        const resultElement = document.createElement("td");
        resultElement.colSpan = ChessboardRenderer.CHESSBOARD_SIZE + 2;
        resultElement.textContent = error ? error : `Not completed`;
        row.appendChild(resultElement);
        chessboardElement.appendChild(row);
      });
  }

  static restart() {
    ChessboardRenderer.render();
    document.getElementById("iterations").textContent = "Iterations: 0";
  }
}

ChessboardRenderer.render();
