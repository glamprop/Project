var Handlers = {
	// Handles the NEXT and PREVIOUS buttons
	changePage: function(e){	//function(page) {
		//var token = $('#' + page + '-button').data('token');
		var token = $(e).data('token');
		$('#query').val(QueryData.getQuery());

		// Clear Results
		$('#search-results').html('');
		$('#button-container').html('');

		// Run GET Request on API
		$.get(
		  "https://www.googleapis.com/youtube/v3/search", {
				part: 'snippet, id',
				q: QueryData.getQuery(),
				pageToken: token,
				type: 'video',
				key: 'AIzaSyBAN-71jVHKbUzBIuoQS_OVMb9mLctpEUU',
				order: Settings.sortBy,
				videoDuration: Settings.videoLength,
				maxResults: Settings.resultsCount
			},
			function(data) {
				QueryData.setQueryJSON(data);
				$.each(data.items, function(i, item) {
					Renderer.renderResult(item, i);
				});
				Renderer.renderButtons(QueryData.getQuery(), QueryData.getPrevPageToken(), QueryData.getNextPageToken());
			}
		);
	},
		
	// Shows/hides the video description
	showMoreLess: function(elem){
		if(elem.previousSibling.className == 'inline desc-par'){
			$('a.more-less').not('.move-up').html('More').addClass('move-up');
			$('.expanded').addClass('inline desc-par').removeClass('expanded');
			elem.previousSibling.className='expanded';
			elem.innerHTML='Less';
			elem.className='more-less';
		}
		else{
			$('.desc-par').removeClass('expanded');
			elem.previousSibling.className='inline desc-par';
			elem.innerHTML = 'More';
			elem.className = 'more-less move-up';
		}
	},	
	
	onCollapse: function() {
		var that = $(this);
		//if (that.attributes['aria-expanded'] && that.attributes['aria-expanded'].value == 'true')
		if (that.innerText === 'Description...')
			that.innerText = 'Hide...';
		else
			that.innerText = 'Description...';
	}
	

};