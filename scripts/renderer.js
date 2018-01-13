var Renderer = (function() {
	
	// Renders NEXT and PREVIOUS buttons on the page.
	var renderButtons = function(q, prevPageToken, nextPageToken) {
		// Build buttons HTML
		var btnOutput = '<div class="button-container">';
		if (prevPageToken) {
			btnOutput += '<button id="prev-button" class="paging-button btn-dark btn-lg" data-token="' + prevPageToken + 
						 '" data-query="' + q +'"' + 'onclick="Handlers.changePage(this);">Prev Page</button>';
		}
		btnOutput += '<button id="next-button" class="paging-button btn-lg btn-dark" data-token="' + nextPageToken + 
					 '" data-query="' + q +'"' + 'onclick="Handlers.changePage(this);">Next Page</button></div>';
		// Render buttons
		$('#button-container').append(btnOutput);
	};
	
	// Outputs content from query results.
	// This function is supposed to be called iteravitely.
	var renderResult = function(item, index) {
		// Build output string
		// var output = '<li><div class="list-left"><div class="in-image-label">' + 
		var output = '<div class="row"><div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12"><div class="in-image-label">' + 
		'WATCHED</div><a data-fancybox data-type="iframe" href="https://www.youtube.com/embed/' + 
		item.id.videoId + '"><img src="' 
		+ item.snippet.thumbnails.high.url + 
		'"></a></div><div class="details col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12"><h3><a data-fancybox data-type="iframe" href="http://www.youtube.com/embed/' + 
		item.id.videoId + '">' + 
		item.snippet.title + '</a></h3>' +
		'</div>'
		'<small>By <span class="cTitle">' +
		item.snippet.channelTitle + '</span> on ' + 
		Helper.getPublishedDate(item.snippet.publishedAt) + 
		'</small></div></div><div class="clearfix"><br /><br /><br />';
		//'</small></div></li><div class="clearfix"></div>';
		// Render output
		//$('#search-results').append(output);
		document.getElementById('search-results').innerHTML += output;
		moreVideoInfo(item.id.videoId, index);
	};
	
	// A private function that gets additional metadata for each result.
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
					'<br /><img src="img/like.png" alt="Likes: " title="Likes" width="20" height="20" /> ' + 
					Helper.addDotSeparator(item.statistics.likeCount ? item.statistics.likeCount : ' ') +
					'&nbsp;<img src="img/dislike.png" alt="Dislikes: " title="Dislikes" width="18" height="18" /> ' + 
					Helper.addDotSeparator(item.statistics.dislikeCount ? item.statistics.dislikeCount : ' ') +
					'&nbsp;<img src="img/comment.jpg" alt="Comments: " title="Comments" width="16" height="16" /> ' + 
					Helper.addDotSeparator(item.statistics.commentCount ? item.statistics.commentCount : ' ') + '</p>'+
					'<span class="inline desc-par">Video description: ' + //class="collapse" id="detail-' + index.toString() + '">Video description: ' + //class="inline desc-par">Video description: ' + 
					item.snippet.description +
					'&nbsp;</span><a class="more-less move-up" onclick="Handlers.showMoreLess(this);">More</a>';//</span><button class="collapsible-desc btn btn-light" data-toggle="collapse" data-target="#detail-' + index.toString() + '">Description...  </button>'
					// Show output
					$('.details')[index].innerHTML += output;
				});				
			}
		);
	};
	
	//Return public functions
	return {
		renderButtons			: renderButtons,
		renderResult			: renderResult,
	};
	
})();