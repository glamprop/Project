/***
The Helper variable acts like a Shared (Static) class.
We can declare as many members as we like
and return only those we want to make visible (public).
Then, we can call a function like this:
Helper.<function-name> e.g. Helper.addDotSeparator(123);
*/ 
var Helper = (function() {
	
	// Add dot separator to numeric values
	this.addDotSeparator = function(number) {
		if(number > 999) {
			return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
		}
		else {
			return number;
		}
	};

	// Get ISO8601 Date
	this.getPublishedDate = function(publishedAt){
		var temp = new Date(Date.parse(publishedAt));
		return temp.toString();
	};

	// Convert ISO 8601 to Seconds
	this.convertISO8601ToSeconds = function(input) {
		var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
		var hours = 0, minutes = 0, seconds = 0, totalseconds;

		if (reptms.test(input)) {
			var matches = reptms.exec(input);
			if (matches[1]) hours = Number(matches[1]);
			if (matches[2]) minutes = Number(matches[2]);
			if (matches[3]) seconds = Number(matches[3]);
			totalseconds = hours * 3600  + minutes * 60 + seconds;
		}
		return (hours + "hr " + minutes + "min " + seconds + "sec");
	};

	this.getVidId = function(item){
		return item.id.videoId;
	};
	
	//Return public functions
	return {
		addDotSeparator 		: addDotSeparator,
		getPublishedDate		: getPublishedDate,
		convertISO8601ToSeconds	: convertISO8601ToSeconds,
		getVideoId				: getVidId
	};
	
})();
