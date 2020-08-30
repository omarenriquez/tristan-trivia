
// https://docs.google.com/spreadsheets/d/1Q3MQCmvY8W1rD2621TwZ_yZWIetTKfcT9Qp_xLyil5M/edit?usp=sharing
// Client Secret: 1p7r-ygSmVtZg6-LnUg3QTMt
// API Key: AIzaSyCRalemSzGApEH_jacbcWfNLLRTIVw8g4E
// CLIENT ID: 1096823005728-io71qpv3ka0fov3rs26efp9gv01u7m54.apps.googleusercontent.com
// Range: 'Sheet1!A2:C9'
// SpreadsheetID: 1Q3MQCmvY8W1rD2621TwZ_yZWIetTKfcT9Qp_xLyil5M
// Published spreadsheet: https://docs.google.com/spreadsheets/d/e/2PACX-1vSkBG8oF6Jw56MruuLe-lQslOBDK-kE44IVuSH5NZvObs2nBNQnk8cGAk4TSZcrt1xViuELKJUo0Ai1/pub?gid=0&single=true&output=csv



var spreadsheetUrl = 'https://spreadsheets.google.com/feeds/cells/1Q3MQCmvY8W1rD2621TwZ_yZWIetTKfcT9Qp_xLyil5M/1/public/values?alt=json-in-script&callback=doData';


// The callback function the JSONP request will execute to load data from API
function doData(data) {
    // Final results will be stored here	
    var results = [];

    // Get all entries from spreadsheet
    var entries = data.feed.entry;

    // Set initial previous row, so we can check if the data in the current cell is from a new row
    var previousRow = 0;

    // Iterate all entries in the spreadsheet
    for (var i = 0; i < entries.length; i++) {
        // check what was the latest row we added to our result array, then load it to local variable
        var latestRow = results[results.length - 1];

        // get current cell
        var cell = entries[i];

        // get text from current cell
        var text = cell.content.$t;

        // get the current row
        var row = cell.gs$cell.row;

        // Determine if the current cell is in the latestRow or is a new row
        if (row > previousRow) {
            // this is a new row, create new array for this row
            var newRow = [];

            // add the cell text to this new row array  
            newRow.push(text);

            // store the new row array in the final results array
            results.push(newRow);

            // Increment the previous row, since we added a new row to the final results array
            previousRow++;
        } else {
            // This cell is in an existing row we already added to the results array, add text to this existing row
            latestRow.push(text);
        }

    }
    handleResults(results);
}

// Take final array, sort it, and assign it to each row for display the leaderboard
function handleResults(arr) {
	
	// Convert second object of multidimensional array into int for proper sorting
	arr = arr.map(function (obj) {
		return [obj[0],parseInt(obj[1]),obj[2]];
	});
	
	// Sort the array by the PTS object (object #2)
	arr.sort(compareSecondColumn);

		function compareSecondColumn(a, b) {
			if (a[1] === b[1]) {
				return 0;
			}
			else {
				return (a[1] > b[1]) ? -1 : 1;
			}
		}
	
	// Loop through the name text of the array and loop through rank 1-11 to assign it to the name field
	console.log(arr);
	for (var i = 1; i < 11; i++) {;
		var nameid = ('rank-name-' + i);
		if ((arr.length) > i) {
			document.getElementById(nameid).innerHTML = arr[i][0]
		} else {
			document.getElementById(nameid).innerHTML = "Open Slot"
		}
	}

	// Loop through the Points text of the array and loop through rank 1-11 to assign it to the Points field text
	for (var i = 1; i < 11; i++) {;
		var pointsid = ('rank-pts-' + i);
		if ((arr.length) > i) {
			document.getElementById(pointsid).innerHTML = ((arr[i][1])+ " Pts")
		} else {
			document.getElementById(pointsid).innerHTML = "-- Pts"
		}
	}
	
	// Loop through the Picture Source text of the array and loop through img source 1-11 to assign it to the Picture source 
	for (var i = 1; i < 11; i++) {;
		var pictureid = ('profile-pic-' + i);
		if ((arr.length) > i) {
			document.getElementById(pictureid).src = arr[i][2];
		} else {
			document.getElementById(pictureid).src = "https://www.onlydogs.info/wp-content/uploads/2016/05/Border-Collie-1-1000x1000.jpg"
		}
	}	
}

// Create JSONP Request to Google Docs API, then execute the callback function doData
$.ajax({
    url: spreadsheetUrl,
    jsonp: 'doData',
    dataType: 'jsonp'
});
