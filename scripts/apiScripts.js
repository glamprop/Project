// Single member object ("search")
var api = (function() {
	var search = function() {
		// Clear Results
		$('#search-results').html('');
		$('#button-container').html('');

		// Get Form Input
		var searchQuery = $('#query').val();

		// Check if empty
		if(searchQuery){
			// Set Sort By option value
			var sortBy = $('#sort-by-list li.active').children()[0].getAttribute('data-value');
			// Set Video Length option value
			var videoLength = $('#video-length-list li.active').children()[0].innerText;		
			// Settings.resultsCount = $('#max-results-list li.active').children()[0].innerText;
			var resultsCount = $('#max-results-list li.active').children()[0].innerText;
			
			$.get(
				"https://www.googleapis.com/youtube/v3/search", {
					part: 'id, snippet',
					q: searchQuery,
					type: 'video',
					key: 'AIzaSyBAN-71jVHKbUzBIuoQS_OVMb9mLctpEUU',
					order: sortBy,
					videoDuration: videoLength,
					maxResults: resultsCount
				}
			)
			.done(function(data) {
				QueryData.setQueryData(searchQuery, data);
				//for each item, render its output
				$.each(data.items, function(i, item) {
					Renderer.renderResult(item, i);				
				});
				//render NEXT and PREVIOUS buttons
				Renderer.renderButtons(QueryData.getQuery(), QueryData.getPrevPageToken(), QueryData.getNextPageToken());
			})
			.fail(function(e) {
				QueryData.setQueryData(null, null);
				//error handling needed
				console.log(e.responseText);
			})
			.always(function() {
				(console.log('Finished.'));
				//$('.collapsible-desc').on('click', Handlers.onCollapse);
			});
		}
	};
		
	
	// Return public functions.
	// In this case, only search() is public.
	return {
		search 		: search
	};
	
})();
