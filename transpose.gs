 var ss = SpreadsheetApp.getActiveSpreadsheet();
var spread = SpreadsheetApp.getActiveSheet();
var sheet = ss.getSheets()[0];

function doGet(req) {
  //I've deleted the table corresponding to this data
  var verses = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(1,1,114,1).getValues();
  var table = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(2,2,10522,6).getValues();
  var quran = new Array;
  var e = 0;
  for (let i = 0; i < 114; i++) {
    var sura = new Array;
    var b = verses[i];
    //probably where the problem is
    for (let a = 0; a < b; a++) {
      var aya = new Array;
      var d = table[e][5]
      for (let c = 0; c < d; c++, e++) {
        var start = table[e][3];
        var end = table[e][4];
        var segs = table[e][5];
        aya.push([start, end, segs]);
      }
      sura.push(aya);
    }
    quran.push(sura)
  } 
  return ContentService.createTextOutput(JSON.stringify(quran)).setMimeType(ContentService.MimeType.JSON)
  
}

function setup() {
  PropertiesService.getScriptProperties().setProperty("key", ss.getId());

}

function trans() {
  var main = new Array;
  var table = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(2,1,10522,5).getValues();
  for (let a = 0; a < 3; a++) {
    var rel = table[a];
    var sura = rel[0];
    var aya = rel[1];
    var start = rel[3];
    var end = rel[4];
    var url = "https://api.quranwbw.com/";
    var data = JSON.parse(UrlFetchApp.fetch(url.concat(sura).concat("/").concat(aya)));
    var str = ""; 
    for (let i = start; i < end; i++) {
      var words = data["words"][i]["word_translation"];
      str = str.concat(words).concat(" ");          
    }
    main.push([str.trim()]);
  }
  Logger.log(main)

  // SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(9012,7,1510,1).setValues(main)
}
function transwbw() {
  var main = new Array;
  var table = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(2,1,10522,5).getValues();
  for (let a = 9000; a < 10523; a++) {
    var rel = table[a];
    var sura = rel[0];
    var aya = rel[1];
    var start = rel[3];
    var end = rel[4];
    var url = "https://api.quranwbw.com/";
    var data = JSON.parse(UrlFetchApp.fetch(url.concat(sura).concat("/").concat(aya)));
    var temp = new Array;
    for (let i = start; i < end; i++) {
      var enWord = data["words"][i]["word_translation"];
      var arWord = data["words"][i]["word_arabic_uthmani"];
      temp.push(arWord, enWord);
    }
    for (let i = temp.length; i < 98; i++) {
      temp.push("");
    }
    main.push(temp);
  }
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(9002,8,1523,98).setValues(main)
}
function test() {
  var url = "https://api.quranwbw.com/";
  var data = JSON.parse(UrlFetchApp.fetch(url.concat("2").concat("/").concat("83")));
  var temp = new Array;
  var a = 0;
  for (let i = 0; i < 29; i++, a++) {
    var enWord = data["words"][i]["word_translation"];
    var arWord = data["words"][i]["word_arabic_uthmani"];
    temp.push(arWord, enWord);
  }
  Logger.log(a)
  Logger.log("length of the row before:" + String(temp.length));
  var q = 0;
  for (let i = temp.length; i < 49; i++, q++) {
    temp.push("");
  }
  Logger.log(q)
}
function transwbwnotes() {
  //Creates a new array called main to hold all the gathered data
  var main = new Array;
  //Gets the data table with segment data
  var table = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(2,1,10522,5).getValues();
  //creates a for loop to loop through the rows of data from table
  for (let a = 50; a < 1050; a++) {
    //Gets the row that corresponds to the loop count
    var rel = table[a];
    //the first data point in the row corresponds to data in the first column
    var sura = rel[0];
    //data in the second column
    var aya = rel[1];
    //data in the fourth column (we don't use the 3rd for this process)
    var start = rel[3];
    //data in the fifth column
    var end = rel[4];
    //Where the api for word to word translation exists
    var url = "https://api.quranwbw.com/";
    //concats a url based on the data gathered in this run of the loop
    var data = JSON.parse(UrlFetchApp.fetch(url.concat(sura).concat("/").concat(aya)));
    //declares a new array BEFORE the following for loop so it can be accessed outside of it
    var temp = new Array;
    //loops through the words of the given segment
    for (let i = start; i < end; i++) {
      if (data["words"][i] === 'undefined') {
        Logger.log("exceeded index:row number:" + String(a))
        Logger.log("exceeded index:data" + String(data["words"]))
        Logger.log(i)
      } else {
        //gets the english word from the api
        var enWord = data["words"][i]["word_translation"];
        //gets the arabic word from the api
        var arWord = data["words"][i]["word_arabic_uthmani"];
      }
      //adds both the english and arabic to the new array 'temp'
      temp.push(arWord, enWord);
    }
    //Every row in the array data must have the same number of columns.
    //The max number of words a segment has is 49, so we can calculate how many empty cells we need to add
    //For loop adds empty cells
    if (temp.length > 49) {
      Logger.log("exceeded length:sura" + String(sura))
      Logger.log("exceeded length:aya" + String(aya))
      Logger.log("exceeded length:row" + String(a))
      Logger.log("exceeded length:data" + String(data["words"]))

    }
    for (let i = temp.length; i < 49; i++) {
      temp.push("")
    }
    //Pushes the final row into the main array
    main.push(temp);
  }
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(159,8,1000,49).setValues(main)
}

