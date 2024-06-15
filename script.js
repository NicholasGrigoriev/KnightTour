class Chessboard {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.chessBoardState = [];
    for (let i = 0; i < width; i++) {
      this.chessBoardState.push([]);
      for (let j = 0; j < height; j++) {
        this.chessBoardState[i].push(0);
      }
    }
    console.log("initiated chessboard: ", this.chessBoardState);
  }
}

class KnightTour {
  constructor(chessboard, startPoint, isCompleteTour, iterationsLimit) {
    this.chessboard = chessboard;
    this.startPoint = startPoint;
    this.iterationsLimit = iterationsLimit;
    this.isCompleteTour = isCompleteTour;

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

  solveKnightTour() {
    console.log("solvin Knight Tour for:", JSON.stringify(this, null, 2));
    const path = [];
    if (this.solveNextStep(this.startPoint[0], this.startPoint[1], 1, path)) {
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
  }

  solveNextStep(x, y, depth, path) {
    this.iterations++;
    if (this.iterations >= this.iterationsLimit) {
      throw new Error("Stopped due to iteration limit");
    }
    this.chessboard.chessBoardState[x][y] = depth;
    path.push([x, y]);
    // we walked over all the cells
    if (depth === this.chessboard.width * this.chessboard.height) {
      if (this.isCompleteTour) {
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
      if (this.solveNextStep(nextMove[0], nextMove[1], depth + 1, path)) {
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
      x < this.chessboard.width &&
      0 <= y &&
      y < this.chessboard.height &&
      (ignoreStart || this.chessboard.chessBoardState[x][y] === 0)
    );
  }

  convertToChessNotation([x, y]) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return `${letters[x]}${this.chessboard.height - y}`;
  }
}

class ChessboardRenderer {
  static CHESSBOARD_WIDTH;
  static CHESSBOARD_HEIGHT;
  static ITERATIONS_LIMIT;
  static IS_COMPLETE_TOUR;

  static render() {
    const chessboardElement = document.getElementById("chessboard");
    chessboardElement.innerHTML = "";

    ChessboardRenderer.CHESSBOARD_WIDTH = parseInt(
      document.getElementById("boardWidth").value
    );
    ChessboardRenderer.CHESSBOARD_HEIGHT = parseInt(
      document.getElementById("boardHeight").value
    );
    ChessboardRenderer.ITERATIONS_LIMIT = parseInt(
      document.getElementById("iterationsLimit").value
    );
    ChessboardRenderer.IS_COMPLETE_TOUR =
      document.getElementById("completeTour").checked;

    const colLabelRowTop = document.createElement("tr");
    colLabelRowTop.innerHTML = '<td class="column-label"></td>';
    for (let x = 0; x < ChessboardRenderer.CHESSBOARD_WIDTH; x++) {
      const colLabelCell = document.createElement("td");
      colLabelCell.textContent = String.fromCharCode(65 + x);
      colLabelRowTop.appendChild(colLabelCell);
    }
    chessboardElement.appendChild(colLabelRowTop);

    for (let y = 0; y < ChessboardRenderer.CHESSBOARD_HEIGHT; y++) {
      const row = document.createElement("tr");
      const numberLabelCellLeft = document.createElement("td");
      numberLabelCellLeft.className = "row-label";
      numberLabelCellLeft.textContent =
        ChessboardRenderer.CHESSBOARD_HEIGHT - y;
      row.appendChild(numberLabelCellLeft);
      for (let x = 0; x < ChessboardRenderer.CHESSBOARD_WIDTH; x++) {
        const cell = document.createElement("td");
        cell.id = `${String.fromCharCode(65 + x)}${
          ChessboardRenderer.CHESSBOARD_HEIGHT - y
        }`;
        cell.className = (y + x) % 2 === 0 ? "light" : "dark";
        cell.addEventListener("click", () => this.onCellClick(x, y));
        row.appendChild(cell);
      }
      const numberLabelCellRight = document.createElement("td");
      numberLabelCellRight.className = "row-label";
      numberLabelCellRight.textContent =
        ChessboardRenderer.CHESSBOARD_HEIGHT - y;
      row.appendChild(numberLabelCellRight);
      chessboardElement.appendChild(row);
    }
    const colLabelRowBottom = document.createElement("tr");
    colLabelRowBottom.innerHTML = '<td class="column-label"></td>';
    for (let x = 0; x < ChessboardRenderer.CHESSBOARD_WIDTH; x++) {
      const colLabelCell = document.createElement("td");
      colLabelCell.textContent = String.fromCharCode(65 + x);
      colLabelRowBottom.appendChild(colLabelCell);
    }
    chessboardElement.appendChild(colLabelRowBottom);
  }

  static onCellClick(x, y) {
    ChessboardRenderer.render();
    const chessboard = new Chessboard(
      ChessboardRenderer.CHESSBOARD_WIDTH,
      ChessboardRenderer.CHESSBOARD_HEIGHT
    );
    console.log(
      "before calling, ChessboardRenderer.IS_COMPLETE_TOUR",
      ChessboardRenderer.IS_COMPLETE_TOUR
    );
    const knightTour = new KnightTour(
      chessboard,
      [x, y],
      ChessboardRenderer.IS_COMPLETE_TOUR,
      ChessboardRenderer.ITERATIONS_LIMIT
    );
    new Promise((resolve, reject) => {
      const result = knightTour.solveKnightTour();
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
                    (ChessboardRenderer.CHESSBOARD_WIDTH *
                      ChessboardRenderer.CHESSBOARD_HEIGHT)) *
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
        resultElement.colSpan = ChessboardRenderer.CHESSBOARD_WIDTH + 2;
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
        resultElement.colSpan = ChessboardRenderer.CHESSBOARD_WIDTH + 2;
        resultElement.textContent = error.message
          ? error.message
          : `Not completed`;
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
