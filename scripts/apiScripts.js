function search() {
	// Clear Results
	$('#search_results').html('');
	$('#buttons_container').html('');

	// Get Form Input
	var q = $('#query').val();

	// Check if empty
	if(q){
		// Set Sort By option value
		Settings.sortBy = $('#sort-by-list li.active').children()[0].innerText;		
		// Set Video Length option value
		Settings.videoLength = $('#video-length-list li.active').children()[0].innerText;		
		// Set Max Results option value
		Settings.maxResults = $('#max-results-list li.active').children()[0].innerText;
		
		$.get(
			"https://www.googleapis.com/youtube/v3/search", {
				part: 'id, snippet',
				q: q,
				type: 'video',
				key: 'AIzaSyBAN-71jVHKbUzBIuoQS_OVMb9mLctpEUU',
				order: Settings.sortBy,
				videoDuration: Settings.videoLength,
				maxResults: Settings.maxResults
			}
		)
		.done(function(data) {
			QueryData.setQueryData(q, data);
			$.each(data.items, function(i, item) {
				renderOutput(item, i);				
			});
			renderButtons(QueryData.getQuery(), QueryData.getPrevPageToken(), QueryData.getNextPageToken());
		})
		.fail(function(e) {
			Query.setQueryData(null, null);
		})
		.always(function() {
			(console.log('Finished'));
		});		
	}
}

// New Page Buttons Function
function changePage(page){
	var token = $('#' + page + '_button').data('token');
	$('#query').val(QueryData.getQuery());

    // Clear Results
    $('#search_results').html('');
    $('#buttons_container').html('');

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
			maxResults: Settings.maxResults
		},
		function(data) {
			QueryData.setQueryJSON(data);
			$.each(data.items, function(i, item) {
				renderOutput(item, i);
			});
			renderButtons(QueryData.getQuery(), QueryData.getPrevPageToken(), QueryData.getNextPageToken());
		}
    );
}

function renderOutput(item, index) {
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
}

function moreVideoInfo(videoId, index){
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
				'&nbsp;</span><a class="more-less move-up" onclick="showMoreLess(this)">More</a>';
				// Show output
				$('#search_results li')[index].children[1].innerHTML += output;
			});
		}
	);

}

function showMoreLess(elem){	
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
}

function renderButtons(q, prevPageToken, nextPageToken) {
	// Build buttons HTML
	var btnOutput = '<div class="button_container">';
	if (!prevPageToken) {
		btnOutput += '<button id="next_button" class="paging_button" data-token="' + nextPageToken + 
					 '" data-query="' + q + '"' + 'onclick="changePage(\'next\');">Next Page</button></div>';
	}
	else {
		btnOutput += '<button id="prev_button" class="paging_button" data-token="' + prevPageToken + 
					 '" data-query="' + q +'"' + 'onclick="changePage(\'prev\');">Prev Page</button>' +
					 '<button id="next_button" class="paging_button" data-token="' + nextPageToken + 
					 '" data-query="' + q +'"' + 'onclick="changePage(\'next\');">Next Page</button></div>';
	}
	// Render buttons
	$('#buttons_container').append(btnOutput);
}

function changeVideoLengthOption(selectedAnchor) {
	var a = $(selectedAnchor);
	$.each(a.parent().siblings(), function(k, v) {
		$(v).removeClass('active');
	});
	a.parent().addClass('active');
	a.parent().parent().prev().html('Video length: ' + a.text() + ' <span class="caret"></span>');
}

function changeSortingOption(selectedAnchor) {
	var a = $(selectedAnchor);
	$.each(a.parent().siblings(), function(k, v) {
		$(v).removeClass('active');
	});
	a.parent().addClass('active');
	a.parent().parent().prev().html('Sort by: ' + a.text() + ' <span class="caret"></span>');
}
function changeResultsNumberOption(selectedAnchor) {
	var a = $(selectedAnchor);
	$.each(a.parent().siblings(), function(k, v) {
		$(v).removeClass('active');
	});
	a.parent().addClass('active');
	a.parent().parent().prev().html('Number of results: ' + a.text() + ' <span class="caret"></span>');
}