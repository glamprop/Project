/***
The Helper variable acts like a Shared (Static) class.
We can declare as many members as we like
and return only those we want to make visible (public).
Then, we can call a function like this:
Helper.<function-name> e.g. Helper.addDotSeparator(123);
*/ 
var Helper = (function() {
	
	// Add dot separator to numeric values
	var addDotSeparator = function(number) {
		if(number > 999) {
			return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
		}
		else {
			return number;
		}
	};

	// Get ISO8601 Date
	var getPublishedDate = function(publishedAt) {
		var temp = new Date(Date.parse(publishedAt));
		return temp.toString();
	};

	// Convert ISO 8601 to Seconds
	//var convertISO8601ToSeconds = function(input) {
	var convertISO8601ToSeconds = function(input) {
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

	// Renders NEXT and PREVIOUS buttons on the page
	var renderButtons = function(q, prevPageToken, nextPageToken) {
		// Build buttons HTML
		var btnOutput = '<div class="button_container">';
		if (prevPageToken) {
			btnOutput += '<button id="prev-button" class="paging-button" data-token="' + prevPageToken + 
						 '" data-query="' + q +'"' + 'onclick="Handlers.changePage(this);">Prev Page</button>';
		}
		btnOutput += '<button id="next-button" class="paging-button" data-token="' + nextPageToken + 
					 '" data-query="' + q +'"' + 'onclick="Handlers.changePage(this);">Next Page</button></div>';
		
		/*if (!prevPageToken) {
			btnOutput += '<button id="next-button" class="paging-button" data-token="' + nextPageToken + 
						 '" data-query="' + q + '"' + 'onclick="changePage(\'next\');">Next Page</button></div>';
		}
		else {
			btnOutput += '<button id="prev-button" class="paging-button" data-token="' + prevPageToken + 
						 '" data-query="' + q +'"' + 'onclick="changePage(\'prev\');">Prev Page</button>' +
						 '<button id="next-button" class="paging-button" data-token="' + nextPageToken + 
						 '" data-query="' + q +'"' + 'onclick="changePage(\'next\');">Next Page</button></div>';
		}*/
		// Render buttons
		$('#buttons_container').append(btnOutput);
	};
	
	// Outputs content from query results.
	// This function is supposed to be called iteravitely
	var renderResult = function(item, index) {
		// Build output string
		var altRowClass = 'alt-row';//(index % 2 == 0) ? 'alt-row' : '';
		var output = '<li class="' +
		altRowClass + 
		'"><div class="list-left"><div class="in-image-label">' + 
		'WATCHED</div><a data-fancybox data-type="iframe" href="http://www.youtube.com/embed/' + 
		item.id.videoId + 
		'"><img src="' 
		+ item.snippet.thumbnails.high.url + 
		'"></a></div><div class="list-right"><h3><a data-fancybox data-type="iframe" href="http://www.youtube.com/embed/' + 
		item.id.videoId + 
		'">' + 
		item.snippet.title + 
		'</a></h3>' +
		'<small>By <span class="cTitle">' +
		item.snippet.channelTitle + 
		'</span> on ' + 
		Helper.getPublishedDate(item.snippet.publishedAt) + 
		'</small></div></li><div class="clearfix"></div>';
		// Render output
		$('#search_results').append(output);
		moreVideoInfo(item.id.videoId, index);
	};
	
	// Gets additional metadata for each result.
	// This function is supposed to be called iteratively.
	var moreVideoInfo = function(videoId, index){
		$.get(
			"https://www.googleapis.com/youtube/v3/videos", {
				key: 'AIzaSyBAN-71jVHKbUzBIuoQS_OVMb9mLctpEUU',
				id: videoId, index,
				fields:'items(contentDetails(duration),statistics,snippet(description))',
				part: 'contentDetails,statistics,snippet'
			},
			function(data){
				$.each(data.items, function(i, item) {
					// Set Output
					var output = '<p>duration: ' + 
					Helper.convertISO8601ToSeconds(item.contentDetails.duration) +
					'&nbsp;Views: ' + 
					Helper.addDotSeparator(item.statistics.viewCount ? item.statistics.viewCount : ' ') +
					'<br /><img src="img/like.png" width="20" height="20" /> ' + 
					Helper.addDotSeparator(item.statistics.likeCount ? item.statistics.likeCount : ' ') +
					'&nbsp;<img src="img/dislike.png" width="18" height="18" /> ' + 
					Helper.addDotSeparator(item.statistics.dislikeCount ? item.statistics.dislikeCount : ' ') +
					'&nbsp;<img src="img/comment.jpg" width="16" height="16" /> ' + 
					Helper.addDotSeparator(item.statistics.commentCount ? item.statistics.commentCount : ' ') + '</p>'+
					'<span class="inline desc-par">Video description: ' + 
					item.snippet.description +
					'&nbsp;</span><a class="more-less move-up" onclick="Handlers.showMoreLess(this);">More</a>';
					// Show output
					$('#search_results li')[index].children[1].innerHTML += output;
				});
			}
		);
	};
	
	//Return public functions
	return {
		addDotSeparator 		: addDotSeparator,
		getPublishedDate		: getPublishedDate,
		convertISO8601ToSeconds	: convertISO8601ToSeconds,
		renderButtons			: renderButtons,
		renderResult			: renderResult,
		moreVideoInfo			: moreVideoInfo
	};
	
})();
