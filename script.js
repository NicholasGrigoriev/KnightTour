/**
 *
 * This test is to write solution for Knight's Route theory.
 * https://en.wikipedia.org/wiki/Knight%27s_tour
 *
 * For simplicity and calculation speed we are using 5x5 chessboard
 * piece and not full chessboard of 8x8.
 *
 * If you will not succeed with getting a working code.
 * Don't worry, as long as you provide enough information
 * about where things went wrong and if you applied some sort off
 * hardcoded pieces to go around it.
 *
 * Try to write clean and understandable code.
 * Go wild and free on your imagination and anything you would like
 * to do extra. JUST GO FOR IT!
 *
 */

// --- CODE SECTION START ---
/**
 * This is your starting point!
 * Those 2 classes are required, but you are free to make
 * more helper classes if needed.
 * You are also free to make any helper files that are needed.
 */

// This is a chessboard class that is used to draw the chessbord
class Chessboard {
  constructor(size) {
    this.size = size;
    this.chessBoardState = [];
    for (let i = 0; i < size; i++) {
      this.chessBoardState.push([]);
      for (let j = 0; j < size; j++) {
        this.chessBoardState[i].push(0);
      }
    }
    console.log("initiated chessboard: ", this.chessBoardState);
  }
}

// This class is responsible to do the knight's tour calculation
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

  /**
   * The function receives the starting position of the knight        <<<-------Nikolay's addition
   * This function is used to return the result in example format.
   * So it can be drawn by the renderer.
   * Result should be:
   * - Array of keys like in example (UPPERCASE)
   * - OR false, to trigger default failed rendering logic
   *
   * (You are always free to change output result and default rendering.)
   *
   * HINT! The example response is valid response for cliking
   * on the cell A5 (position 0:0) and can be used as example.
   * And for cell B5 it is also a valid response because there is no
   * solution for Knight's Tour from this cell.
   */

  /**
   * return example:
   * false - if there is no solution
   * [A5, C4....] - solution
   */
  solveKnightTour(x, y) {
    const path = [];
    this.iterations = 0; // Reset iteration counter
    console.log("solveKnightTour");
    try {
      if (this.solveNextStep(x, y, 1, path)) {
        console.log("result path, ", path);
        console.log("Total iterations: ", this.iterations);
        return path.map((move) => this.convertToChessNotation(move));
      } else {
        console.log("Total iterations: ", this.iterations);
        return false;
      }
    } catch (ex) {
      console.log("error in solveKnightTour", ex);
    }
  }

  solveNextStep(x, y, depth, path) {
    this.iterations++;
    this.chessboard.chessBoardState[x][y] = depth;
    path.push([x, y]);
    // we walked over all the cells
    if (depth === this.chessboard.size * this.chessboard.size) {
      console.log("we are done at ", depth);
      return true;
    }
    for (const move of this.knightMoves) {
      const nextX = x + move[0];
      const nextY = y + move[1];

      if (this.isValidMove(nextX, nextY)) {
        if (this.solveNextStep(nextX, nextY, depth + 1, path)) {
          console.log("next step is valid");
          return true;
        }
      }
    }
    this.chessboard.chessBoardState[x][y] = 0;
    path.pop();
    return false;
  }

  isValidMove(x, y) {
    return (
      0 <= x &&
      x < this.chessboard.size &&
      0 <= y &&
      y < this.chessboard.size &&
      this.chessboard.chessBoardState[x][y] === 0
    );
  }

  convertToChessNotation([x, y]) {
    const letters = "ABCDE";
    return `${letters[x]}${this.chessboard.size - y}`;
  }
}

// --- CODING SECTION END ---

/**
 * This section is responsible for rendering the chessboard.
 * This can be left untouched, but if there could be some improvements
 * made, go for it. But don't forget to comment what was changed.
 *
 * Clicking on cell will kick off the `solveKnightTour()` function
 * and print out the result. Now when clicking it always returns the
 * hardcoded result of `solveKnightTour()` function.
 *
 * (You are always free to change result rendering for your custom output.)
 */
class ChessboardRenderer {
  /**
   * For faster processing chessboard with 5x5 dementions
   * are more than enough for this practice.
   */
  static CHESSBOARD_SIZE = 5;
  /**
   * Renders the full board
   */
  static render() {
    const chessboardElement = document.getElementById("chessboard");
    chessboardElement.innerHTML = "";

    // create and attach column letters row on top of the chessboard
    const colLabelRowTop = document.createElement("tr");
    colLabelRowTop.innerHTML = '<td class="column-label"></td>';
    for (let x = 0; x < ChessboardRenderer.CHESSBOARD_SIZE; x++) {
      const colLabelCell = document.createElement("td");
      colLabelCell.textContent = String.fromCharCode(65 + x);
      colLabelRowTop.appendChild(colLabelCell);
    }
    chessboardElement.appendChild(colLabelRowTop);

    for (let y = 0; y < ChessboardRenderer.CHESSBOARD_SIZE; y++) {
      const row = document.createElement("tr");
      // create and attach row number on the left side of the chessboard
      const numberLabelCellLeft = document.createElement("td");
      numberLabelCellLeft.className = "row-label";
      numberLabelCellLeft.textContent = ChessboardRenderer.CHESSBOARD_SIZE - y;
      row.appendChild(numberLabelCellLeft);
      for (let x = 0; x < ChessboardRenderer.CHESSBOARD_SIZE; x++) {
        // create and attach cell element
        const cell = document.createElement("td");
        cell.id = `${String.fromCharCode(65 + x)}${
          ChessboardRenderer.CHESSBOARD_SIZE - y
        }`;
        cell.className = (y + x) % 2 === 0 ? "light" : "dark";
        cell.addEventListener("click", () => this.onCellClick(x, y));
        row.appendChild(cell);
      }
      // create and attach row number on the right side of the chessboard
      const numberLabelCellRight = document.createElement("td");
      numberLabelCellRight.className = "row-label";
      numberLabelCellRight.textContent = ChessboardRenderer.CHESSBOARD_SIZE - y;
      row.appendChild(numberLabelCellRight);
      // append generated cells row
      chessboardElement.appendChild(row);
    }
    // create and attach column letters row at the bottom of the chessboard
    const colLabelRowBottom = document.createElement("tr");
    colLabelRowBottom.innerHTML = '<td class="column-label"></td>';
    for (let x = 0; x < ChessboardRenderer.CHESSBOARD_SIZE; x++) {
      const colLabelCell = document.createElement("td");
      colLabelCell.textContent = String.fromCharCode(65 + x);
      colLabelRowBottom.appendChild(colLabelCell);
    }
    chessboardElement.appendChild(colLabelRowBottom);
  }
  /**
   * Handles on cell click even to start Knight's Tour calculation
   */
  static onCellClick(x, y) {
    ChessboardRenderer.render();
    const chessboard = new Chessboard(ChessboardRenderer.CHESSBOARD_SIZE);
    const knightTour = new KnightTour(chessboard);
    new Promise((resolve, reject) => {
      const result = knightTour.solveKnightTour(x, y);
      return result ? resolve(result) : reject();
    })
      .then((result) => {
        const chessboardElement = document.getElementById("chessboard");
        if (result instanceof Array) {
          result.forEach((key, idx) => {
            // find by cell key and attach step number following the result
            const cellElement = document.getElementById(key);
            if (cellElement) {
              // crete element with step to display
              const keyTextElement = document.createElement("span");
              keyTextElement.textContent = idx + 1;
              cellElement.appendChild(keyTextElement);
            }
          });
        }
        // create and attach result output at the bottom of chessboard
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
        // create and attach result output at the bottom of chessboard
        const row = document.createElement("tr");
        const resultElement = document.createElement("td");
        resultElement.colSpan = ChessboardRenderer.CHESSBOARD_SIZE + 2;
        resultElement.textContent = error ? error : `Not completed`;
        row.appendChild(resultElement);
        chessboardElement.appendChild(row);
      });
  }
}
ChessboardRenderer.render();
