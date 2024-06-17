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
  }
}

class KnightTour {
  constructor(
    chessboard,
    startPoint,
    isCompleteTour,
    iterationsLimit,
    iFeelLucky
  ) {
    this.chessboard = chessboard;
    this.startPoint = startPoint;
    this.iterationsLimit = iterationsLimit;
    this.isCompleteTour = isCompleteTour;
    this.iFeelLucky = iFeelLucky;

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
    const startTime = new Date();
    if (this.checkKnownOddLimit()) {
      {
        return false;
      }
    }
    const path = [];

    const result = this.solveNextStep(
      this.startPoint[0],
      this.startPoint[1],
      1,
      path
    );
    const endTime = new Date();
    const executionTime = endTime - startTime;
    if (result) {
      console.log("result path, ", path);
      console.log("Total iterations: ", this.iterations);
      console.log(`Execution time: ${executionTime} ms`);
      return path.map((move) => this.convertToChessNotation(move));
    } else {
      console.log(`Execution time: ${executionTime} ms`);
      console.log("Total iterations: ", this.iterations);
      return false;
    }
  }
  checkKnownOddLimit() {
    if (
      this.chessboard.width === this.chessboard.height &&
      this.chessboard.width % 2 !== 0
    ) {
      const [x, y] = this.startPoint;
      return (x + y) % 2 !== 0;
    }
    return false;
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
            return true;
          }
        }
      } else {
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
    const moves = this.getValidMoves(x, y, ignoreStart).map((move) => ({
      move,
      degree: this.getLocationDegrees(move[0], move[1]),
      distanceFromCenter: this.getDistanceFromCenter(move[0], move[1]),
    }));

    if (this.iFeelLucky) {
      const uniqueRandomValues = this.generateUniqueRandomValues(
        moves.length,
        0,
        10
      );
      moves.forEach((move, index) => {
        move.tiebreak = uniqueRandomValues[index];
      });
    } else {
      moves.forEach((move) => {
        move.tiebreak = move.distanceFromCenter;
      });
    }
    return moves
      .sort((a, b) => a.degree - b.degree || b.tiebreak - a.tiebreak)
      .map(({ move }) => move);
  }

  generateUniqueRandomValues(count, min, max) {
    const uniqueValues = new Set();
    while (uniqueValues.size < count) {
      uniqueValues.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(uniqueValues);
  }

  getValidMoves(x, y, ignoreStart = false) {
    return this.knightMoves
      .map((move) => [x + move[0], y + move[1]])
      .filter(([nextX, nextY]) => this.isValidMove(nextX, nextY, ignoreStart));
  }

  getDistanceFromCenter(x, y) {
    const centerX = (this.chessboard.width - 1) / 2;
    const centerY = (this.chessboard.height - 1) / 2;
    return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
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
    return `${String.fromCharCode(65 + x)}${this.chessboard.height - y}`;
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
    ChessboardRenderer.IS_I_FEEL_LUCKY =
      document.getElementById("ifeelLucky").checked;

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
        cell.addEventListener("mouseover", (e) =>
          this.onCellMouseOver(e, cell, x, y)
        );
        cell.addEventListener("mouseout", () => this.onCellMouseOut(cell));
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
    const knightTour = new KnightTour(
      chessboard,
      [x, y],
      ChessboardRenderer.IS_COMPLETE_TOUR,
      ChessboardRenderer.ITERATIONS_LIMIT,
      ChessboardRenderer.IS_I_FEEL_LUCKY
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
        document.getElementById(
          "iterations"
        ).textContent = `Iterations: ${knightTour.iterations}`;
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
        document.getElementById(
          "iterations"
        ).textContent = `Iterations: ${knightTour.iterations}`;
        const row = document.createElement("tr");
        const resultElement = document.createElement("td");
        resultElement.colSpan = ChessboardRenderer.CHESSBOARD_WIDTH + 2;
        resultElement.textContent = error?.message
          ? error.message
          : `Not completed`;
        row.appendChild(resultElement);
        chessboardElement.appendChild(row);
      });
  }

  static onCellMouseOver(event, cell, x, y) {
    this.removeTooltip(); // Remove any existing tooltip
    cell.style.outline = "2px solid red";
    const tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#fff";
    tooltip.style.border = "1px solid #ccc";
    tooltip.style.padding = "5px";
    tooltip.style.pointerEvents = "none";
    tooltip.textContent = `${String.fromCharCode(65 + x)}${
      ChessboardRenderer.CHESSBOARD_HEIGHT - y
    }`;
    document.body.appendChild(tooltip);
    const cellRect = cell.getBoundingClientRect();
    tooltip.style.left = `${cellRect.right + window.scrollX + 10}px`;
    tooltip.style.top = `${cellRect.top + window.scrollY}px`;
  }

  static onCellMouseOut(cell) {
    cell.style.outline = "";
    this.removeTooltip();
  }

  static removeTooltip() {
    const tooltip = document.getElementById("tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  }

  static restart() {
    ChessboardRenderer.render();
    document.getElementById("iterations").textContent = "Iterations: 0";
  }
}
ChessboardRenderer.render();
