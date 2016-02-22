/**
Use this on
http://www.multpl.com/s-p-500-historical-prices/table/by-year
http://www.multpl.com/cpi/table
http://www.multpl.com/s-p-500-dividend-yield/table
http://www.multpl.com/10-year-treasury-rate/table/by-year
*/
var data = document.querySelectorAll('.right'); var v = "";
for (var x = 0; x < data.length; x++){
  v += data[x].innerText+'\n';
}
copy(v);

//Then go to http://www.convertcsv.com/csv-to-json.htm to make into archive.js
