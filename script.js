let defaultProperties = {
  text: "",
  "font-weight": "",
  "font-style": "",
  "text-decoration": "",
  "text-align": "left",
  "background-color": "#ffffff",
  color: "#000000",
  "font-family": "Noto Sans",
  "font-size": "14px",
};

let cellData = {
  Sheet1: {},
};

let selectedSheet = "Sheet1";
let totalSheets = 1;
let lastlyAddedSheet = 1;

$(document).ready(function () {
  let cellContainer = $(".input-cell-container");

  // Generate column names (A, B, ..., Z, AA, AB, ..., ZZ, AAA, etc.)
  for (let i = 1; i <= 100; i++) {
    let ans = "";
    let n = i;

    while (n > 0) {
      let rem = n % 26;
      if (rem == 0) {
        ans = "Z" + ans;
        n = Math.floor(n / 26) - 1;
      } else {
        ans = String.fromCharCode(rem - 1 + 65) + ans;
        n = Math.floor(n / 26);
      }
    }

    let column = $(
      `<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`
    );
    $(".column-name-container").append(column);

    let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
    $(".row-name-container").append(row);
  }

  // Generate input cells
  for (let i = 1; i <= 100; i++) {
    let row = $(`<div class="cell-row"></div>`);
    for (let j = 1; j <= 100; j++) {
      let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
      let column = $(
        `<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="${colCode}"></div>`
      );
      row.append(column);
    }
    cellContainer.append(row);
  }

  $(".align-icon").click(function () {
    $(".align-icon.selected").removeClass("selected");
    $(this).addClass("selected");
  });

  $(".style-icon").click(function () {
    $(this).toggleClass("selected");
  });

  $(".input-cell").click(function (e) {
    if (e.ctrlKey) {
      let [rowId, colId] = getRowCol(this);
      if (rowId > 1) {
        let topCellSelected = $(`#row-${rowId - 1}-col-${colId}`).hasClass(
          "selected"
        );
        if (topCellSelected) {
          $(this).addClass("top-cell-selected");
          $(`#row-${rowId - 1}-col-${colId}`).addClass("bottom-cell-selected");
        }
      }
      if (rowId < 100) {
        let bottomCellSelected = $(`#row-${rowId + 1}-col-${colId}`).hasClass(
          "selected"
        );
        if (bottomCellSelected) {
          $(this).addClass("bottom-cell-selected");
          $(`#row-${rowId + 1}-col-${colId}`).addClass("top-cell-selected");
        }
      }
      if (colId > 1) {
        let leftCellSelected = $(`#row-${rowId}-col-${colId - 1}`).hasClass(
          "selected"
        );
        if (leftCellSelected) {
          $(this).addClass("left-cell-selected");
          $(`#row-${rowId}-col-${colId - 1}`).addClass("right-cell-selected");
        }
      }
      if (colId < 100) {
        let rightCellSelected = $(`#row-${rowId}-col-${colId + 1}`).hasClass(
          "selected"
        );
        if (rightCellSelected) {
          $(this).addClass("right-cell-selected");
          $(`#row-${rowId}-col-${colId + 1}`).addClass("left-cell-selected");
        }
      }

      $(".operations-button").removeClass("disabled-button");
      $(".operations-button").addClass("enabled-button");
      $(".calculate-sum.enabled-button").click(function () {
        let sum = 0;
        $(".input-cell.selected").each(function () {
          let cellValue = parseFloat($(this).text());
          if (!isNaN(cellValue)) {
            sum += cellValue;
          }
        });
        $(".result-container").addClass("result-enabled");
        $(".result-container").text("Sum of selected cells: " + sum);
        console.log("Sum of selected cells:", sum);
      });

      $(".calculate-average.enabled-button").click(function () {
        let sum = 0;
        let count = 0;
        $(".input-cell.selected").each(function () {
          let cellValue = parseFloat($(this).text());
          if (!isNaN(cellValue)) {
            sum += cellValue;
            count++;
          }
        });
        let average = count > 0 ? sum / count : 0;
        $(".result-container").addClass("result-enabled");
        $(".result-container").text("Average of selected cells: " + average);
        console.log("Average of selected cells:", average);
      });

      $(".calculate-count.enabled-button").click(function () {
        let count = 0;
        $(".input-cell.selected").each(function () {
          let cellValue = $(this).text();
          if (cellValue != "") {
            count++;
          }
        });
        $(".result-container").addClass("result-enabled");
        $(".result-container").text("Count of selected cells: " + count);
        console.log("Count of selected cells:", count);
      });

      $(".calculate-min.enabled-button").click(function () {
        let min = Number.MAX_VALUE;
        $(".input-cell.selected").each(function () {
          let cellValue = parseFloat($(this).text());
          if (!isNaN(cellValue)) {
            min = Math.min(min, cellValue);
          }
        });
        $(".result-container").addClass("result-enabled");
        $(".result-container").text("Minimum of selected cells: " + min);
        console.log("Minimum of selected cells:", min);
      });

      $(".calculate-max.enabled-button").click(function () {
        let max = Number.MIN_VALUE;
        $(".input-cell.selected").each(function () {
          let cellValue = parseFloat($(this).text());
          if (!isNaN(cellValue)) {
            max = Math.max(max, cellValue);
          }
        });
        $(".result-container").addClass("result-enabled");
        $(".result-container").text("Maximum of selected cells: " + max);
        console.log("Maximum of selected cells:", max);
      });
    } else {
      $(".input-cell.selected").removeClass(
        "selected top-cell-selected bottom-cell-selected left-cell-selected right-cell-selected"
      );
      $(".operations-button").addClass("disabled-button");
      $(".operations-button").removeClass("enabled-button");
      $(".result-container").removeClass("result-enabled");
      $(".result-container").text("OUTPUT");
    }
    $(this).addClass("selected");
    changeHeader(this);
  });

  function changeHeader(ele) {
    let [rowId, colId] = getRowCol(ele);
    let cellInfo = defaultProperties;
    if (
      cellData[selectedSheet][rowId] &&
      cellData[selectedSheet][rowId][colId]
    ) {
      cellInfo = cellData[selectedSheet][rowId][colId];
    }

    cellInfo["font-weight"]
      ? $(".icon-bold").addClass("selected")
      : $(".icon-bold").removeClass("selected");

    cellInfo["font-style"]
      ? $(".icon-italic").addClass("selected")
      : $(".icon-italic").removeClass("selected");

    cellInfo["text-decoration"]
      ? $(".icon-underline").addClass("selected")
      : $(".icon-underline").removeClass("selected");

    let alignment = cellInfo["text-align"];
    $(".align-icon.selected").removeClass("selected");
    $(".icon-align-" + alignment).addClass("selected");

    $(".background-color-picker").val(cellInfo["background-color"]);
    $(".text-color-picker").val(cellInfo["color"]);

    $(".font-family-selector").val(cellInfo["font-family"]);
    $(".font-family-selector").css("font-family", cellInfo["font-family"]);
    $(".font-size-selector").val(cellInfo["font-size"]);
  }

  $(".input-cell").click(function (e) {
    $(".input-cell-option").remove();
    $(".container").append(`<div class="input-cell-option">
      <button class="text-option options-trim" title="Trim"><div class="material-symbols-outlined icon-trim" style="font-size: 16px;">content_cut</div></button>
      <button class="text-option options-upper" title="Uppercase"><div class="material-symbols-outlined icon-upper" style="font-size: 16px;">uppercase</div></button>
      <button class="text-option options-lower" title="Lowercase"><div class="material-symbols-outlined icon-lower" style="font-size: 16px;">lowercase</div></div></button>`);
    $(".input-cell-option").css("left", e.pageX + "px");
    $(".input-cell-option").css("top", e.pageY + 25 + "px");
    // console.log(`Clicked cell at row: ${rowId}, column: ${colId}, x: ${x}, y: ${y}`);
  });

  $(document).on("click", ".icon-trim", function () {
    console.log("Trim clicked");
    $(".input-cell.selected").each(function () {
      let text = $(this).text().trim();
      updateCell("text", text);
      emptySheet();
      loadSheet();
    });
  });

  $(document).on("click", ".icon-upper", function () {
    console.log("Upper clicked");
    $(".input-cell.selected").each(function () {
      let text = $(this).text().toUpperCase();
      updateCell("text", text);
      emptySheet();
      loadSheet();
    });
  });
  $(document).on("click", ".icon-lower", function () {
    console.log("Lower clicked");
    $(".input-cell.selected").each(function () {
      let text = $(this).text().toLowerCase();
      updateCell("text", text);
      emptySheet();
      loadSheet();
    });
  });

  $(".input-cell").dblclick(function () {
    $(".input-cell-option").remove();
    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  $(".input-cell").blur(function () {
    $(".input-cell.selected").attr("contenteditable", "false");
    updateCell("text", $(this).text());
  });

  $(".input-cell-container").scroll(function () {
    $(".column-name-container").scrollLeft(this.scrollLeft);
    $(".row-name-container").scrollTop(this.scrollTop);
  });
});

function getRowCol(ele) {
  let id = $(ele).attr("id");
  let idArray = id.split("-");
  let rowId = parseInt(idArray[1]);
  let colId = parseInt(idArray[3]);
  return [rowId, colId];
}

function updateCell(property, value, defaultPossible) {
  $(".input-cell.selected").each(function () {
    $(this).css(property, value);
    let [rowId, colId] = getRowCol(this);
    if (cellData[selectedSheet][rowId]) {
      if (cellData[selectedSheet][rowId][colId]) {
        cellData[selectedSheet][rowId][colId][property] = value;
      } else {
        cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
        cellData[selectedSheet][rowId][colId][property] = value;
      }
    } else {
      cellData[selectedSheet][rowId] = {};
      cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
      cellData[selectedSheet][rowId][colId][property] = value;
    }
    if (
      defaultPossible &&
      JSON.stringify(cellData[selectedSheet][rowId][colId]) ===
        JSON.stringify(defaultProperties)
    ) {
      delete cellData[selectedSheet][rowId][colId];
      if (Object.keys(cellData[selectedSheet][rowId]).length == 0) {
        delete cellData[selectedSheet][rowId];
      }
    }
  });

  console.log(cellData);
}

$(".icon-bold").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("font-weight", "", true);
  } else {
    updateCell("font-weight", "bold", false);
  }
});

$(".icon-italic").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("font-style", "", true);
  } else {
    updateCell("font-style", "italic", false);
  }
});

$(".icon-underline").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("text-decoration", "", true);
  } else {
    updateCell("text-decoration", "underline", false);
  }
});

$(".icon-align-left").click(function () {
  if (!$(this).hasClass("selected")) {
    updateCell("text-align", "left", true);
  }
});

$(".icon-align-right").click(function () {
  if (!$(this).hasClass("selected")) {
    updateCell("text-align", "right", true);
  }
});

$(".icon-align-center").click(function () {
  if (!$(this).hasClass("selected")) {
    updateCell("text-align", "center", true);
  }
});

$(".color-fill-icon").click(function () {
  $(".background-color-picker").click();
});

$(".color-fill-text").click(function () {
  $(".text-color-picker").click();
});

$(".background-color-picker").change(function () {
  updateCell("background-color", $(this).val());
});

$(".text-color-picker").change(function () {
  updateCell("color", $(this).val());
});

$(".font-family-selector").change(function () {
  let fontFamily = $(this).val();
  updateCell("font-family", fontFamily);
  $(".font-family-selector").css("font-family", $(this).val());
});

$(".font-size-selector").change(function () {
  let fontSize = $(this).val();
  updateCell("font-size", fontSize);
});

$(".input-cell.selected").blur(function () {
  updateCell("text", $(this).text());
});

function emptySheet() {
  let sheetInfo = cellData[selectedSheet];
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      $(`#row-${i}-col-${j}`).text("");
      $(`#row-${i}-col-${j}`).css("background-color", "#ffffff");
      $(`#row-${i}-col-${j}`).css("color", "#000000");
      $(`#row-${i}-col-${j}`).css("text-align", "left");
      $(`#row-${i}-col-${j}`).css("font-weight", "");
      $(`#row-${i}-col-${j}`).css("font-style", "");
      $(`#row-${i}-col-${j}`).css("text-decoration", "");
      $(`#row-${i}-col-${j}`).css("font-family", "Noto Sans");
      $(`#row-${i}-col-${j}`).css("font-size", "14px");
    }
  }
}

function loadSheet() {
  let sheetInfo = cellData[selectedSheet];
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      let cellInfo = sheetInfo[i][j];
      $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
      $(`#row-${i}-col-${j}`).css(
        "background-color",
        cellInfo["background-color"]
      );
      $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
      $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
      $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
      $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
      $(`#row-${i}-col-${j}`).css(
        "text-decoration",
        cellInfo["text-decoration"]
      );
      $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
      $(`#row-${i}-col-${j}`).css("font-size", cellInfo["font-size"]);
    }
  }
}

$(".icon-add").click(function () {
  emptySheet();
  $(".sheet-tab.selected").removeClass("selected");
  let sheetName = "Sheet" + (lastlyAddedSheet + 1);
  cellData[sheetName] = {};
  totalSheets += 1;
  lastlyAddedSheet += 1;
  selectedSheet = sheetName;
  $(".sheet-tab-container").append(
    `<div class="sheet-tab selected">${sheetName}</div>`
  );
  addSheetEvents();
});

function addSheetEvents() {
  $(".sheet-tab.selected").click(function () {
    if (!$(this).hasClass("selected")) {
      selectSheet(this);
    }
  });

  $(".sheet-tab.selected").contextmenu(function (e) {
    e.preventDefault();
    selectSheet(this);

    // console.log($(".sheet-options-modal").length);
    if ($(".sheet-options-modal").length == 0) {
      $(".container").append(
        `<div class="sheet-options-modal">
        <div class="sheet-rename">Rename</div>
        <div class="sheet-delete">Delete</div>
      </div>`
      );
      $(".sheet-rename").click(function () {
        $(".container").append(`<div class="sheet-rename-modal">
      <h4 class="modal-title">Rename Sheet</h4>
      <input type="text" class="new-sheet-name" placeholder="Sheet Name" />
      <div class="action-buttons">
        <div class="button rename-button">Rename</div>
        <div class="button cancel-button">Cancel</div>
      </div>
    </div>`);

        $(".cancel-button").click(function () {
          $(".sheet-rename-modal").remove();
        });

        $(".rename-button").click(function () {
          let newSheetName = $(".new-sheet-name").val();
          $(".sheet-tab.selected").text(newSheetName);
          let newCellData = {};
          for (let key in cellData) {
            if (key != selectedSheet) {
              newCellData[key] = cellData[key];
            } else {
              newCellData[newSheetName] = cellData[key];
            }
          }
          cellData = newCellData;
          selectedSheet = newSheetName;
          $(".sheet-rename-modal").remove();
          console.log(cellData);
        });
      });

      $(".sheet-delete").click(function () {
        if (Object.keys(cellData).length > 1) {
          let currSheetName = selectedSheet;
          let currSheet = $(".sheet-tab.selected");
          let currentSheetIndex = Object.keys(cellData).indexOf(selectedSheet);
          if (currentSheetIndex == 0) {
            $(".sheet-tab.selected").next().click();
          } else {
            $(".sheet-tab.selected").prev().click();
          }
          delete cellData[currSheetName];
          currSheet.remove();
          // selectSheet();
        } else {
          alert("Can't delete the only sheet");
        }
      });
    }

    $(".sheet-options-modal").css("left", e.pageX + "px");
  });
}

$(".container").click(function () {
  $(".sheet-options-modal").remove();
});

$(".icon-left-scroll").click(function () {
  $(".sheet-tab.selected").prev().click();
});

$(".icon-right-scroll").click(function () {
  $(".sheet-tab.selected").next().click();
});

addSheetEvents();

function selectSheet(ele) {
  $(".sheet-tab.selected").removeClass("selected");
  $(ele).addClass("selected");
  emptySheet();
  selectedSheet = $(ele).text();
  loadSheet();
}

let selectedCell = [];
let cut = false;

$(".icon-copy").click(function () {
  $(".input-cell.selected").each(function () {
    selectedCell.push(getRowCol(this));
  });
});

$(".icon-cut").click(function () {
  $(".input-cell.selected").each(function () {
    selectedCell.push(getRowCol(this));
  });
  cut = true;
});

$(".icon-paste").click(function () {
  emptySheet();
  let [rowId, colId] = getRowCol($(".input-cell.selected")[0]);
  let rowDistance = rowId - selectedCell[0][0];
  let colDistance = colId - selectedCell[0][1];
  for (let cell of selectedCell) {
    let newRowId = cell[0] + rowDistance;
    let newColId = cell[1] + colDistance;
    if (!cellData[selectedSheet][newRowId]) {
      cellData[selectedSheet][newRowId] = {};
    }
    cellData[selectedSheet][newRowId][newColId] = {
      ...cellData[selectedSheet][cell[0]][cell[1]],
    };

    if (cut) {
      delete cellData[selectedSheet][cell[0]][cell[1]];
      if (Object.keys(cellData[selectedSheet][cell[0]]).length == 0) {
        delete cellData[selectedSheet][cell[0]];
      }
    }
  }
  if (cut) {
    cut = false;
    selectedCell = [];
  }

  loadSheet();
});

// $(".input-cell").contextmenu(function (e) {
//   e.preventDefault();
//   console.log("right click");
//   // e.stopPropagation();
// });

$(".container").click(function () {
  $(".input-cell-options-modal").remove();
});
