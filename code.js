var guessInput = 0;
image("imageLoadingScreen", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI36XQvjI3IscKZkhuKdJ0GFmMWjR6uY_EPg&s");
setProperty("imageLoadingScreen", "width", 300);
var wordAnswers = getColumn("Wordle", "validWordleAnswer");
//A list that never changes 8/3
var permanentWordsList = [];
//If you add a word to any list, make sure you add onto 2308+
var wordsList = [];
var tempWordsList = [];
var tempLetter = "";
var tempLetter2 = "";
var tempLetter3 = "";
var tempLetter4 = "";
var tempLetter5 = "";
var tempList = [];
var tempList2 = [];
var suggestionList = [];
var suggestionList1 = [];
var suggestionList2 = [];
var suggestionList3 = [];
var suggestionListFinal = [];
var counter = 0;
var gamemode = "";
var greenIndicator = [0, 0, 0, 0, 0];
var yellowIndicator = [0, 0, 0, 0, 0];
var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var letters = {
  "a": 0,
  "b": 0,
  "c": 0,
  "d": 0,
  "e": 0,
  "f": 0,
  "g": 0,
  "h": 0,
  "i": 0,
  "j": 0,
  "k": 0,
  "l": 0,
  "m": 0,
  "n": 0,
  "o": 0,
  "p": 0,
  "q": 0,
  "r": 0,
  "s": 0,
  "t": 0,
  "u": 0,
  "v": 0,
  "w": 0,
  "x": 0,
  "y": 0,
  "z": 0,
};
var buttonColors = ["Green", "Yellow"];
textInput("text_inputGuess", "");
hideElement("text_inputGuess");
deleteElement("imageLoadingScreen");
setProperty("screen1", "image", "https://angiemcmonigal.com/wp-content/uploads/2018/08/so-close-yet-so-far-2400.jpg");
textLabel("labelLetterHolder", "text");
hideElement("labelLetterHolder");
for (var i = 1; i < 4; i++) {
  textLabel("labelLetterHolder" + i, "text");
  hideElement("labelLetterHolder" + i);
}
textLabel("labelWordleCracker", "Wordle Cracker");
setPosition("labelWordleCracker", "75", "0", "200", "100");
setProperty("labelWordleCracker", "font-size", "35");
setProperty("labelWordleCracker", "text-color", "white");
button("buttonContinue", "Continue");
setPosition("buttonContinue", 110, 300, 100, 50);
hideElement("buttonContinue");
button("buttonStart", "Start");
setPosition("buttonStart", "110", "225", "100", "50" );
onEvent("buttonStart", "click", function( ) {
  deleteElement("buttonStart");
  deleteElement("labelWordleCracker");
  button("buttonNyTimes", "Ny Times Version");
  setPosition("buttonNyTimes", 30, 180, 100, 100);
  button("buttonAllWordle", "Any Wordle Game");
  setPosition("buttonAllWordle", 190, 180, 100, 100);
  onEvent("buttonNyTimes", "click", function( ) {
    gamemode = "NyTimes";
    deleteElement("buttonNyTimes");
    deleteElement("buttonAllWordle");
    setProperty("screen1", "image", "");
    image("imageLoadingScreen", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI36XQvjI3IscKZkhuKdJ0GFmMWjR6uY_EPg&s");
    setProperty("imageLoadingScreen", "width", 300);
    for (var counter = 0; counter < 2308; counter++) {
      appendItem(wordsList, wordAnswers[counter]);
      appendItem(permanentWordsList, wordAnswers[counter]);
    }
    deleteElement("imageLoadingScreen");
    setProperty("screen1", "image", "https://angiemcmonigal.com/wp-content/uploads/2018/08/so-close-yet-so-far-2400.jpg");
    runWordle();
  });
  onEvent("buttonAllWordle", "click", function( ) {
    gamemode = "AllWordle";
    deleteElement("buttonNyTimes");
    deleteElement("buttonAllWordle");
    setProperty("screen1", "image", "");
    image("imageLoadingScreen", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI36XQvjI3IscKZkhuKdJ0GFmMWjR6uY_EPg&s");
    setProperty("imageLoadingScreen", "width", 300);
    for (var counter = 0; counter < wordOptions.length; counter++) {
      appendItem(wordsList, wordOptions[counter]);
    }
    deleteElement("imageLoadingScreen");
    setProperty("screen1", "image", "https://angiemcmonigal.com/wp-content/uploads/2018/08/so-close-yet-so-far-2400.jpg");
    runWordle();
  });
});
function runWordle() {
  setProperty("screen1", "image", "https://angiemcmonigal.com/wp-content/uploads/2018/08/so-close-yet-so-far-2400.jpg");
  showElement("text_inputGuess");
  setText("text_inputGuess", "");
  setPosition("text_inputGuess", 85, 75, 150, 30);
  onEvent("text_inputGuess", "input", function( ) {
  guessInput = getText("text_inputGuess");
  for (var i = 1; i < guessInput.length + 1; i++) {
    setText("textLabel" + i, guessInput.substring(i - 1, i));
    setProperty("textLabel" + i, "text-color", "white");
  }
  if (guessInput.length >= 5) {
    hideElement("text_inputGuess");
  }
});
  button("buttonReset", "Reset");
  onEvent("buttonReset", "click", function( ) {
    showElement("text_inputGuess");
    setText("text_inputGuess", "");
    for (var i = 1; i < guessInput.length + 1; i++) {
    setText("textLabel" + i, "");
  }
  });
  for (var i = 1; i < 6; i++) {
    textLabel("textLabel" + i, "");
    setPosition("textLabel" + i, 40 + (50 * (i - 1)), 170, 40, 30);
  }
  for (var i = 0; i < 2; i++) {
    for (var j = 1; j < 6; j++) {
      button("button" + buttonColors[i] + j, "");
      setPosition("button" + buttonColors[i] + j, 45 + (50 * (j - 1)), 120 + (100 * i), 30, 30);
      setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
    }
  }
  button("buttonConfirm", "confirm");
  setPosition("buttonConfirm", 110, 300, 100, 50);
  onEvent("buttonGreen1", "click", function( ) {
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j < 6; j++) {
        setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
      }
    }
    setProperty("buttonGreen1", "background-color", "red");
    setProperty("buttonGreen1", "hidden", true);
    setProperty("buttonYellow1", "hidden", true);
    greenIndicator[0] = 1;
    greenButton();
  });
  onEvent("buttonGreen2", "click", function( ) {
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j < 6; j++) {
        setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
      }
    }
    setProperty("buttonGreen2", "background-color", "red");
    setProperty("buttonGreen2", "hidden", true);
    setProperty("buttonYellow2", "hidden", true);
    greenIndicator[1] = 2;
    greenButton();
  });
  onEvent("buttonGreen3", "click", function( ) {
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j < 6; j++) {
        setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
      }
    }
    setProperty("buttonGreen3", "background-color", "red");
    setProperty("buttonGreen3", "hidden", true);
    setProperty("buttonYellow3", "hidden", true);
    greenIndicator[2] = 3;
    greenButton();
  });
  onEvent("buttonGreen4", "click", function( ) {
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j < 6; j++) {
        setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
      }
    }
    setProperty("buttonGreen4", "background-color", "red");
    setProperty("buttonGreen4", "hidden", true);
    setProperty("buttonYellow4", "hidden", true);
    greenIndicator[3] = 4;
    greenButton();
  });
  onEvent("buttonGreen5", "click", function( ) {
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j < 6; j++) {
        setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
      }
    }
    setProperty("buttonGreen5", "background-color", "red");
    setProperty("buttonGreen5", "hidden", true);
    setProperty("buttonYellow5", "hidden", true);
    greenIndicator[4] = 5;
    greenButton();
  });
  onEvent("buttonYellow1", "click", function( ) {
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j < 6; j++) {
        setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
      }
    }
    setProperty("buttonYellow1", "background-color", "red");
    setProperty("buttonGreen1", "hidden", true);
    setProperty("buttonYellow1", "hidden", true);
    yellowIndicator[0] = 1;
    yellowButton();
  });
  onEvent("buttonYellow2", "click", function( ) {
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j < 6; j++) {
        setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
      }
    }
    setProperty("buttonYellow2", "background-color", "red");
    setProperty("buttonGreen2", "hidden", true);
    setProperty("buttonYellow2", "hidden", true);
    yellowIndicator[1] = 2;
    yellowButton();
  });
  onEvent("buttonYellow3", "click", function( ) {
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j < 6; j++) {
        setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
      }
    }
    setProperty("buttonYellow3", "background-color", "red");
    setProperty("buttonGreen3", "hidden", true);
    setProperty("buttonYellow3", "hidden", true);
    yellowIndicator[2] = 3;
    yellowButton();
  });
  onEvent("buttonYellow4", "click", function( ) {
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j < 6; j++) {
        setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
      }
    }
    setProperty("buttonYellow4", "background-color", "red");
    setProperty("buttonGreen4", "hidden", true);
    setProperty("buttonYellow4", "hidden", true);
    yellowIndicator[3] = 4;
    yellowButton();
  });
  onEvent("buttonYellow5", "click", function( ) {
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j < 6; j++) {
        setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
      }
    }
    setProperty("buttonYellow5", "background-color", "red");
    setProperty("buttonGreen5", "hidden", true);
    setProperty("buttonYellow5", "hidden", true);
    yellowIndicator[4] = 5;
    yellowButton();
  });
  onEvent("buttonConfirm", "click", function( ) {
    deleteElement("buttonReset");
    blackButton();
  });
}
onEvent("buttonContinue", "click", function( ) {
  hideElement("buttonContinue");
  setProperty("buttonContinue", "background-color", "red");
  greenIndicator = [0, 0, 0, 0, 0];
  yellowIndicator = [0, 0, 0, 0, 0];
  for (var i = 0; i < 26; i++) {
    letters[alphabet[i]] = 0;
  }
  tempList = [];
  tempList2 = [];
  suggestionList = [];
  suggestionList1 = [];
  suggestionList2 = [];
  suggestionList3 = [];
  suggestionListFinal = [];
  deleteElement("textAreaSuggestion");
  deleteElement("textLabelSuggestions");
  deleteElement("textAreaOptions");
  deleteElement("textLabelOptions");
  runWordle();
    });
function greenButton() {
  for (var i = 1; i < 6; i++) {
    if (getProperty("buttonGreen" + i, "background-color") == "red") {
      tempLetter = getText("textLabel" + i);
      for (var j = 0; j < 26; j++) {
          if (alphabet[j] == tempLetter) {
            (letters[(alphabet[j])])++;
          }
        }
      for (counter = wordsList.length - 1; counter > -1; counter--) {
        if (wordsList[counter].substring(i - 1, i) == tempLetter.toLowerCase()) {
          appendItem(tempWordsList, wordsList[counter]);
        }
      }
    }
  }
  wordsList = tempWordsList;
  tempWordsList = [];
}
function yellowButton() {
  //On july 30th, I made this change. Im never wrong
  for (var i = 1; i < 6; i++) {
    if (getProperty("buttonYellow" + i, "background-color") == "red") {
      tempLetter = getText("textLabel" + i);
      for (var j = 0; j < 26; j++) {
        if (alphabet[j] == tempLetter) {
          (letters[(alphabet[j])])++;
        }
      }
      for (counter = wordsList.length - 1; counter > -1; counter--) {
        var howManyLettersInWord = 0;
        for (var j = 1; j < 6; j++) {
          if (wordsList[counter].substring(j-1, j) == tempLetter) {
            howManyLettersInWord++;
          }
        }
        if (wordsList[counter].substring(i - 1, i) == tempLetter.toLowerCase() || letters[tempLetter] > howManyLettersInWord) {
          removeItem(wordsList, counter);
        }
      }
    }
  }
}
function blackButton() {
  for (var i = 1; i < 6; i++) {
    tempLetter = getText("textLabel" + i);
    //Looks for amount of letters in a word
    if (greenIndicator[i - 1] == 0 && yellowIndicator[i - 1] == 0) {
      for (var k = wordsList.length - 1; k > -1; k--) {
        var howManyLettersInWord = 0;
        for (var j = 1; j < 6; j++) {
          if (wordsList[k].substring(j-1, j) == tempLetter) {
            howManyLettersInWord++;
          }
        }
        if (howManyLettersInWord != letters[tempLetter]) {
          removeItem(wordsList, k);
        }
      }
    }
  }
  tempLetter2 = tempLetter;
  tempList = wordsList;
  tempList2 = suggestionList;
  listMaker();
  suggestionList3 = tempList;
  suggestionListFinal = tempList2;
  for (var i = 1; i < 6; i++) {
    deleteElement("textLabel" + i);
  }
  for (var i = 0; i < 2; i++) {
    for (var j = 1; j < 6; j++) {
      deleteElement("button" + buttonColors[i] + j);
    }
  }
  deleteElement("buttonConfirm");
  textArea("textAreaOptions");
  setProperty("textAreaOptions", "readonly", true);
  setPosition("textAreaOptions", 30, 90, 100, 200);
  setProperty("textAreaOptions", "background-color", "	#ADD8E6");
  textLabel("textLabelOptions", "All Options");
  setProperty("textLabelOptions", "text-color", "white");
  setPosition("textLabelOptions", 30, 40, 50, 50);
  textArea("textAreaSuggestion");
  setProperty("textAreaSuggestion", "readonly", true);
  if (gamemode == "NyTimes") {
    if (suggestionListFinal == "") {
      if (suggestionList3 == "") {
        if (suggestionList2 == "") {
          if (suggestionList == "") {
            setText("textAreaSuggestion", wordsList);
          } else {
            setText("textAreaSuggestion", suggestionList);
          }
        } else {
          setText("textAreaSuggestion", suggestionList2);
        }
      } else {
        setText("textAreaSuggestion", suggestionList3);
      }
    } else {
      setText("textAreaSuggestion", suggestionListFinal[0]);
    }
  } else {
    setText("textAreaSuggestion", suggestionListFinal.join("\n"));
  }
  setPosition("textAreaSuggestion", 190, 90, 100, 200);
  setProperty("textAreaSuggestion", "background-color", "	#ADD8E6");
  textLabel("textLabelSuggestions", "Top Suggestion");
  setProperty("textLabelSuggestions", "text-color", "white");
  setPosition("textLabelSuggestions", 190, 40, 50, 50);
  setText("textAreaOptions", wordsList.join("\n"));
  showElement("buttonContinue");
}
function listMaker() {
  //Making list as large as the list of words 8/3
  var valueList = [];
  for (var i = 0; i < permanentWordsList.length; i++) {
    appendItem(valueList, 0);
  }
  for (var i = 1; i < 6; i++) {
    if (greenIndicator[i-1] == 0) {
      for (counter = tempList.length - 1; counter > -1; counter--) {
        for (var j = 0; j < 26; j++) {
          if (tempList[counter].substring(i-1,i) == alphabet[j]) {
            letters[(alphabet[j])]++;
          }
        }
      }
      for (var j = 0; j < 26; j++) {
          letters[(alphabet[j])] = Math.abs((tempList.length / 2) - letters[alphabet[j]]);
        }
      if (tempList.length > 2) {
        for (var j = 0; j < permanentWordsList.length; j++) {
          var wordValue = 0;
          for (var k = 0; k < alphabet.length; k++) {
            if (permanentWordsList[j].substring(i-1,i) == alphabet[k]) {
              wordValue = wordValue + letters[(alphabet[k])];
            }
          }
          valueList[j] = valueList[j] + wordValue;
        }
        for (var j = 0; j < 26; j++) {
        letters[alphabet[j]] = 0;
        }
      }
      //Rates every word and give it a value
      //Changing all value to how close they are to half the list
    }
  }
  //Adding the word with the least value to list
  if (tempList.length > 2) {
    var temp = 1000000;
    for (var i = 0; i < valueList.length; i++) {
      if (valueList[i] < temp) {
        insertItem(tempList2, 0, permanentWordsList[i]);
        temp = valueList[i];
      }
    }
  } else {
    insertItem(tempList2, 0, tempList[0]);
  }
}
