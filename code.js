// ==============================================
// CONSTANTS
// ==============================================
var WORD_LENGTH = 5;
var INITIAL_WORD_COUNT = 2308;
var BUTTON_STATE_SELECTED = "red";
var OPTIMAL_DISTANCE = 0.5; // Half the remaining list

// ==============================================
// GLOBAL VARIABLES
// ==============================================
var guessInput = 0;
image("imageLoadingScreen", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI36XQvjI3IscKZkhuKdJ0GFmMWjR6uY_EPg&s");
setProperty("imageLoadingScreen", "width", 300);
var wordAnswers = getColumn("Wordle", "validWordleAnswer");

// Word list management - consolidated from tempWordsList, tempList, tempList2, etc.
var permanentWordsList = []; // Original, unmodified list (never changes)
var wordsList = []; // Current working list of remaining valid words
var remainingWords = []; // Filtered words after latest guess
var bestSuggestions = []; // Top suggested words ranked by probability
var allRemainingOptions = []; // All current options available

// Game state tracking - consolidated from tempLetter, tempLetter2, etc.
var currentSelectedLetter = ""; // Letter user just marked (Green/Yellow/Black)
var confirmedLetters = [0, 0, 0, 0, 0]; // Green letters at correct positions
var misplacedLetters = [0, 0, 0, 0, 0]; // Yellow letters at wrong positions
var counter = 0;
var gamemode = "";
// Letter frequency tracker - counts how many times each letter appears in remaining words
var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var letterFrequency = {
  "a": 0, "b": 0, "c": 0, "d": 0, "e": 0, "f": 0, "g": 0, "h": 0,
  "i": 0, "j": 0, "k": 0, "l": 0, "m": 0, "n": 0, "o": 0, "p": 0,
  "q": 0, "r": 0, "s": 0, "t": 0, "u": 0, "v": 0, "w": 0, "x": 0,
  "y": 0, "z": 0
};
var buttonColors = ["Green", "Yellow"];

// ==============================================
// UTILITY FUNCTIONS FOR STATE MANAGEMENT
// ==============================================

/**
 * Reset letter frequency counter
 */
function resetLetterFrequency() {
  for (var i = 0; i < 26; i++) {
    letterFrequency[alphabet[i]] = 0;
  }
}

/**
 * Increment letter frequency for a given letter
 * @param {string} letter - The letter to increment
 */
function incrementLetterFrequency(letter) {
  if (letterFrequency.hasOwnProperty(letter)) {
    letterFrequency[letter]++;
  }
}

/**
 * Count how many times a letter appears in all words of a word list
 * @param {string} letter - Letter to count
 * @param {array} wordList - List of words to search
 * @returns {number} - Total count of the letter across all words
 */
function countLetterInWords(letter, wordList) {
  var count = 0;
  for (var i = 0; i < wordList.length; i++) {
    for (var j = 0; j < WORD_LENGTH; j++) {
      if (wordList[i].substring(j, j + 1) == letter) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Count how many times a specific letter appears in a single word
 * @param {string} letter - Letter to count
 * @param {string} word - Word to search
 * @returns {number} - Count of letter in this word
 */
function countLetterInWord(letter, word) {
  var count = 0;
  for (var j = 0; j < WORD_LENGTH; j++) {
    if (word.substring(j, j + 1) == letter) {
      count++;
    }
  }
  return count;
}

/**
 * Reset game state for next round
 */
function resetGameState() {
  hideElement("buttonContinue");
  setProperty("buttonContinue", "background-color", BUTTON_STATE_SELECTED);
  confirmedLetters = [0, 0, 0, 0, 0];
  misplacedLetters = [0, 0, 0, 0, 0];
  resetLetterFrequency();
  remainingWords = [];
  bestSuggestions = [];
  allRemainingOptions = [];
  deleteElement("textAreaSuggestion");
  deleteElement("textLabelSuggestions");
  deleteElement("textAreaOptions");
  deleteElement("textLabelOptions");
}

/**
 * Validate that input is a valid 5-letter word with only alphabetic characters
 * @param {string} guess - The guessed word to validate
 * @returns {object} - {isValid: boolean, error: string message if invalid}
 */
function validateGuess(guess) {
  // Check length
  if (guess.length !== WORD_LENGTH) {
    return {isValid: false, error: "Guess must be exactly " + WORD_LENGTH + " letters"};
  }
  
  // Check for only alphabetic characters
  for (var i = 0; i < guess.length; i++) {
    var char = guess.substring(i, i + 1);
    if ((char < "a" || char > "z") && (char < "A" || char > "Z")) {
      return {isValid: false, error: "Guess must contain only alphabetic characters"};
    }
  }
  
  return {isValid: true, error: ""};
}

/**
 * Display error message to user
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
  // For Code.org App Lab, we'll log to console and display via console warning
  // In production, you might show a toast or dialog
  console.log("ERROR: " + message);
}

/**
 * Safely access wordsList with error handling
 * @returns {array} - Current word list or empty array if invalid
 */
function getSafeWordsList() {
  if (!wordsList || wordsList.length === 0) {
    showErrorMessage("No words remaining. The game may have ended.");
    return [];
  }
  return wordsList;
}

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
    for (var counter = 0; counter < INITIAL_WORD_COUNT; counter++) {
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

/**
 * Parameterized handler for color button clicks (Green/Yellow)
 * Replaces all 10 duplicate greenButton1-5 and yellowButton1-5 handlers
 * @param {number} position - Button position (1-5)
 * @param {string} color - "Green" or "Yellow"
 */
function handleColorButtonClick(position, color) {
  // Reset all button colors
  for (var i = 0; i < 2; i++) {
    for (var j = 1; j < 6; j++) {
      setProperty("button" + buttonColors[i] + j, "background-color", buttonColors[i]);
    }
  }
  
  // Mark selected button as red and hide both Green/Yellow at this position
  setProperty("button" + color + position, "background-color", BUTTON_STATE_SELECTED);
  setProperty("button" + color + position, "hidden", true);
  
  // Hide the opposite color button at this position
  var oppositeColor = (color == "Green") ? "Yellow" : "Green";
  setProperty("button" + oppositeColor + position, "hidden", true);
  
  // Track selection in appropriate indicator array and trigger filter
  if (color == "Green") {
    confirmedLetters[position - 1] = position;
    filterByGreen();
  } else {
    misplacedLetters[position - 1] = position;
    filterByYellow();
  }
}

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
  
  // Setup event handlers for all color buttons (Green1-5, Yellow1-5)
  // Uses parameterized handleColorButtonClick to eliminate 10 duplicate handlers
  for (var colorIdx = 0; colorIdx < 2; colorIdx++) {
    for (var position = 1; position < 6; position++) {
      (function(color, pos) {
        var buttonName = "button" + color + pos;
        onEvent(buttonName, "click", function() {
          handleColorButtonClick(pos, color);
        });
      })(buttonColors[colorIdx], position);
    }
  }
  
  onEvent("buttonConfirm", "click", function( ) {
    deleteElement("buttonReset");
    filterByBlack();
  });
}
onEvent("buttonContinue", "click", function( ) {
  resetGameState();
  runWordle();
    });

/**
 * Filter words where letter is in confirmed position (Green button)
 * Keeps only words with the guessed letter at the correct position
 * OPTIMIZED: Filters sequentially to avoid duplicate accumulation
 * FIXED: Sequential filtering prevents duplicates when multiple green buttons are marked
 */
function filterByGreen() {
  if (wordsList.length === 0) {
    showErrorMessage("No words available to filter");
    return;
  }
  
  // Process each position sequentially, filtering wordsList as we go
  for (var position = 1; position < 6; position++) {
    if (confirmedLetters[position - 1] !== 0) {
      var letter = getText("textLabel" + position);
      incrementLetterFrequency(letter);
      
      var filteredWords = [];
      for (counter = wordsList.length - 1; counter > -1; counter--) {
        if (wordsList[counter].substring(position - 1, position) == letter.toLowerCase()) {
          appendItem(filteredWords, wordsList[counter]);
        }
      }
      
      if (filteredWords.length === 0) {
        showErrorMessage("No words match the green letter at position " + position);
        return;
      }
      
      // Update wordsList immediately with filtered results
      wordsList = filteredWords;
    }
  }
}

/**
 * Filter words containing letter but NOT at guessed position (Yellow button)
 * Removes words that have the letter at this position or lack sufficient letter count
 */
function filterByYellow() {
  if (wordsList.length === 0) {
    showErrorMessage("No words available to filter");
    return;
  }
  
  for (var position = 1; position < 6; position++) {
    if (misplacedLetters[position - 1] !== 0) {
      var letter = getText("textLabel" + position);
      incrementLetterFrequency(letter);
      
      for (counter = wordsList.length - 1; counter > -1; counter--) {
        var letterCountInWord = countLetterInWord(letter, wordsList[counter]);
        
        // Remove if: letter is at guessed position OR letter count doesn't match expectation
        if (wordsList[counter].substring(position - 1, position) == letter.toLowerCase() || letterFrequency[letter] > letterCountInWord) {
          removeItem(wordsList, counter);
        }
      }
    }
  }
  
  if (wordsList.length === 0) {
    showErrorMessage("No words match the yellow letter filter");
  }
}

/**
 * Filter words by letters marked as black (not in word)
 * Removes words with incorrect letter counts for black letters
 */
function filterByBlack() {
  if (wordsList.length === 0) {
    showErrorMessage("No words available to filter");
    return;
  }
  
  for (var position = 1; position < 6; position++) {
    var letter = getText("textLabel" + position);
    
    // Only process if this position wasn't marked Green or Yellow
    if (confirmedLetters[position - 1] == 0 && misplacedLetters[position - 1] == 0) {
      for (var k = wordsList.length - 1; k > -1; k--) {
        var letterCountInWord = countLetterInWord(letter, wordsList[k]);
        
        // Remove if letter count doesn't match what we've confirmed
        if (letterCountInWord != letterFrequency[letter]) {
          removeItem(wordsList, k);
        }
      }
    }
  }
  
  if (wordsList.length === 0) {
    showErrorMessage("No words match the black letter filter");
  }
  
  currentSelectedLetter = letter;
  remainingWords = wordsList;
  bestSuggestions = [];
  rankAndSuggestWords();
  allRemainingOptions = remainingWords;
  bestSuggestions = bestSuggestions;
  
  // Clear UI elements
  for (var i = 1; i < 6; i++) {
    deleteElement("textLabel" + i);
  }
  for (var i = 0; i < 2; i++) {
    for (var j = 1; j < 6; j++) {
      deleteElement("button" + buttonColors[i] + j);
    }
  }
  deleteElement("buttonConfirm");
  
  // Display results
  textArea("textAreaOptions");
  setProperty("textAreaOptions", "readonly", true);
  setPosition("textAreaOptions", 30, 90, 100, 200);
  setProperty("textAreaOptions", "background-color", "#ADD8E6");
  textLabel("textLabelOptions", "All Options");
  setProperty("textLabelOptions", "text-color", "white");
  setPosition("textLabelOptions", 30, 40, 50, 50);
  
  textArea("textAreaSuggestion");
  setProperty("textAreaSuggestion", "readonly", true);
  
  if (gamemode == "NyTimes") {
    if (bestSuggestions.length > 0) {
      setText("textAreaSuggestion", bestSuggestions[0]);
    } else if (remainingWords.length > 0) {
      setText("textAreaSuggestion", remainingWords[0]);
    } else {
      setText("textAreaSuggestion", wordsList[0]);
    }
  } else {
    if (bestSuggestions.length > 0) {
      setText("textAreaSuggestion", bestSuggestions.join("\n"));
    } else {
      setText("textAreaSuggestion", remainingWords.join("\n"));
    }
  }
  
  setPosition("textAreaSuggestion", 190, 90, 100, 200);
  setProperty("textAreaSuggestion", "background-color", "#ADD8E6");
  textLabel("textLabelSuggestions", "Top Suggestion");
  setProperty("textLabelSuggestions", "text-color", "white");
  setPosition("textLabelSuggestions", 190, 40, 50, 50);
  setText("textAreaOptions", wordsList.join("\n"));
  showElement("buttonContinue");
}

/**
 * Rank all candidate words from permanentWordsList by letter frequency
 * Suggests the most informative words (with letters closest to optimal distribution)
 * Updates bestSuggestions array with ranked suggestions
 * OPTIMIZED: Early exit for small word lists, cached letter calculations
 */
function rankAndSuggestWords() {
  // Early exit for small word lists
  if (remainingWords.length <= 2) {
    if (remainingWords.length > 0) {
      insertItem(bestSuggestions, 0, remainingWords[0]);
    }
    return;
  }
  
  var valueList = [];
  for (var i = 0; i < permanentWordsList.length; i++) {
    appendItem(valueList, 0);
  }
  
  // For each unfilled position, calculate letter frequency and word values
  for (var position = 1; position < 6; position++) {
    if (confirmedLetters[position - 1] == 0) {
      // Count letter frequencies at this position in remaining words
      // OPTIMIZATION: Reset within scope only for needed letters
      for (var j = 0; j < 26; j++) {
        letterFrequency[alphabet[j]] = 0;
      }
      
      for (counter = remainingWords.length - 1; counter > -1; counter--) {
        for (var j = 0; j < 26; j++) {
          if (remainingWords[counter].substring(position - 1, position) == alphabet[j]) {
            letterFrequency[alphabet[j]]++;
          }
        }
      }
      
      // Calculate distance from optimal (half the remaining list)
      var optimalValue = remainingWords.length * OPTIMAL_DISTANCE;
      for (var j = 0; j < 26; j++) {
        if (letterFrequency[alphabet[j]] > 0) {
          letterFrequency[alphabet[j]] = Math.abs(optimalValue - letterFrequency[alphabet[j]]);
        }
      }
      
      // Score each word from permanentWordsList
      for (var j = 0; j < permanentWordsList.length; j++) {
        var wordValue = 0;
        var wordLetter = permanentWordsList[j].substring(position - 1, position);
        // OPTIMIZATION: Only look up the specific letter, not all 26
        for (var k = 0; k < alphabet.length; k++) {
          if (wordLetter == alphabet[k]) {
            wordValue = letterFrequency[alphabet[k]];
            break;
          }
        }
        valueList[j] = valueList[j] + wordValue;
      }
    }
  }
  
  // Find words with lowest values (most informative) and add to suggestions
  var minValue = 1000000;
  for (var i = 0; i < valueList.length; i++) {
    if (valueList[i] < minValue) {
      insertItem(bestSuggestions, 0, permanentWordsList[i]);
      minValue = valueList[i];
    }
  }
}

/**
 * DEPRECATED - Use filterByGreen() instead
 */
function greenButton() {
  for (var i = 1; i < 6; i++) {
    if (getProperty("buttonGreen" + i, "background-color") == "red") {
      currentSelectedLetter = getText("textLabel" + i);
      for (var j = 0; j < 26; j++) {
          if (alphabet[j] == currentSelectedLetter) {
            incrementLetterFrequency(currentSelectedLetter);
          }
        }
      for (counter = wordsList.length - 1; counter > -1; counter--) {
        if (wordsList[counter].substring(i - 1, i) == currentSelectedLetter.toLowerCase()) {
          appendItem(remainingWords, wordsList[counter]);
        }
      }
    }
  }
  wordsList = remainingWords;
  remainingWords = [];
}

/**
 * DEPRECATED - Use filterByYellow() instead
 */
function yellowButton() {
  //On july 30th, I made this change. Im never wrong
  for (var i = 1; i < 6; i++) {
    if (getProperty("buttonYellow" + i, "background-color") == "red") {
      currentSelectedLetter = getText("textLabel" + i);
      for (var j = 0; j < 26; j++) {
        if (alphabet[j] == currentSelectedLetter) {
          incrementLetterFrequency(currentSelectedLetter);
        }
      }
      for (counter = wordsList.length - 1; counter > -1; counter--) {
        var howManyLettersInWord = countLetterInWord(currentSelectedLetter, wordsList[counter]);
        if (wordsList[counter].substring(i - 1, i) == currentSelectedLetter.toLowerCase() || letterFrequency[currentSelectedLetter] > howManyLettersInWord) {
          removeItem(wordsList, counter);
        }
      }
    }
  }
}

/**
 * DEPRECATED - Use filterByBlack() instead
 */
function blackButton() {
  for (var i = 1; i < 6; i++) {
    currentSelectedLetter = getText("textLabel" + i);
    //Looks for amount of letters in a word
    if (confirmedLetters[i - 1] == 0 && misplacedLetters[i - 1] == 0) {
      for (var k = wordsList.length - 1; k > -1; k--) {
        var howManyLettersInWord = countLetterInWord(currentSelectedLetter, wordsList[k]);
        if (howManyLettersInWord != letterFrequency[currentSelectedLetter]) {
          removeItem(wordsList, k);
        }
      }
    }
  }
  currentSelectedLetter = currentSelectedLetter;
  remainingWords = wordsList;
  bestSuggestions = [];
  rankAndSuggestWords();
  allRemainingOptions = remainingWords;
  bestSuggestions = bestSuggestions;
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
    if (bestSuggestions == "") {
      if (allRemainingOptions == "") {
        if (remainingWords == "") {
          if ([] == "") {
            setText("textAreaSuggestion", wordsList);
          } else {
            setText("textAreaSuggestion", []);
          }
        } else {
          setText("textAreaSuggestion", remainingWords);
        }
      } else {
        setText("textAreaSuggestion", allRemainingOptions);
      }
    } else {
      setText("textAreaSuggestion", bestSuggestions[0]);
    }
  } else {
    setText("textAreaSuggestion", bestSuggestions.join("\n"));
  }
  setPosition("textAreaSuggestion", 190, 90, 100, 200);
  setProperty("textAreaSuggestion", "background-color", "	#ADD8E6");
  textLabel("textLabelSuggestions", "Top Suggestion");
  setProperty("textLabelSuggestions", "text-color", "white");
  setPosition("textLabelSuggestions", 190, 40, 50, 50);
  setText("textAreaOptions", wordsList.join("\n"));
  showElement("buttonContinue");
}

/**
 * DEPRECATED - Use rankAndSuggestWords() instead
 */
function listMaker() {
  var valueList = [];
  for (var i = 0; i < permanentWordsList.length; i++) {
    appendItem(valueList, 0);
  }
  for (var i = 1; i < 6; i++) {
    if (confirmedLetters[i-1] == 0) {
      for (counter = remainingWords.length - 1; counter > -1; counter--) {
        for (var j = 0; j < 26; j++) {
          if (remainingWords[counter].substring(i-1,i) == alphabet[j]) {
            letterFrequency[(alphabet[j])]++;
          }
        }
      }
      for (var j = 0; j < 26; j++) {
        letterFrequency[(alphabet[j])] = Math.abs((remainingWords.length / 2) - letterFrequency[alphabet[j]]);
      }
      if (remainingWords.length > 2) {
        for (var j = 0; j < permanentWordsList.length; j++) {
          var wordValue = 0;
          for (var k = 0; k < alphabet.length; k++) {
            if (permanentWordsList[j].substring(i-1,i) == alphabet[k]) {
              wordValue = wordValue + letterFrequency[(alphabet[k])];
            }
          }
          valueList[j] = valueList[j] + wordValue;
        }
        for (var j = 0; j < 26; j++) {
          letterFrequency[alphabet[j]] = 0;
        }
      }
    }
  }
  if (remainingWords.length > 2) {
    var temp = 1000000;
    for (var i = 0; i < valueList.length; i++) {
      if (valueList[i] < temp) {
        insertItem(bestSuggestions, 0, permanentWordsList[i]);
        temp = valueList[i];
      }
    }
  } else {
    insertItem(bestSuggestions, 0, remainingWords[0]);
  }
}

