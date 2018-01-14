var sortBy, videoLength, resultsCount;			

function saveSearchOptions() {
			// Set Sort By option value
			sortBy = $('#sort-by-list li.active').children()[0].getAttribute('data-value');
			// Set Video Length option value
			videoLength = $('#video-length-list li.active').children()[0].innerText;		
			// Set Results Count option value
			resultsCount = $('#max-results-list li.active').children()[0].innerText;
}	
 
 var SearchOptions = {
	getSortingOption: function() {
		return sortBy;
	},

	getVideoLengthOption: function() {
		return videoLength;
	},

	getResultsCountOption: function() {
		return resultsCount;
	}
};