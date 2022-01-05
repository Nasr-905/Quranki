function order() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  // create a folder from the name of the spreadsheet
  folderName = ss.getName().toLowerCase().replace(/ /g,'_') + '_csv_' + new Date().getTime();
  // var folder = DriveApp.createFolder(folderName);
  Logger.log(folderName);
  
  var raw = ss.getActiveSheet().getRange(2,1,10522,111).getValues();
  data = new Array;
  for (var i = 0; i < raw.length; i++) {
    var filtered_input = raw[i].filter(String);
    data.push(filtered_input);
    }
  data.sort(function(a, b){
  return a.length - b.length;
  });

  data.shift();

  var single = new Array;
  for (var x = 0, prevLength = data[0].length, y = 0; x < data.length; x++) {
    if (data[x].length != prevLength || x == data.length - 1) {
      output = data.slice(y, x);
      // append ".csv" extension to the sheet name
      fileName = "quranki_" + String(data[x].length).padStart(2, '0') + ".csv";
      // convert all available sheet data to csv format
      var csvFile = convertRangeToCsvFile_(output);
      // create a file in the Docs List with the given name and the csv data
      if (csvFile != null) {
        // var file = folder.createFile(fileName, csvFile);
        prevLength = data[x].length;
      }
      else {
        single.push(output)
      }
      y = x;
    }
  }
  for (i in single) {
    Logger.log(single[i])
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[1].getRange(i+1,1).setValue(single[i])
  }
  

  function convertRangeToCsvFile_(data) {
  try {
    if (data.length > 1) {
      var rows = [];
      data.forEach(row => {
        var cols = [];
        row.forEach(col => {
          cols.push(`"${col.toString().replace(/"/g, '""')}"`);
        });

        rows.push(cols.join(','));
      });
      
      return rows.join('\n');
    }
  } catch(err) {
    Logger.log(err);
    Browser.msgBox(err);
    }
  }
}
