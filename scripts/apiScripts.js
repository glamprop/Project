//Global Variables
var search_option_value;
var videoLength_value;
var maxresults_value;
var q;

// Searchbar Handler
$(function() {
	var searchField = $('#query');
	var icon = $('#search_btn');

	// Focus Event Handler
	$(searchField).on('focus', function() {
		$(this).animate({
			width: '100%'
		}, 400);
		$(icon).animate({
			right: '10px'
		}, 400);
	});

	// Blur Event Handler
	$(searchField).on('blur', function() {
		if (searchField.val() == '') {
			$(searchField).animate({
				width: '45%'
			}, 400, function() {});
			$(icon).animate({
				right: '360px'
			}, 400, function() {});
		}
	});

	$('#search_form').submit(function(e) {
		e.preventDefault();
	});
})

function search() {
	// Clear Results
	$('#search_results').html('');
	$('#buttons_container').html('');

	// Get Form Input
	q = $('#query').val();

	// Check if empty
	if(q){
		// Get new Search Option
		search_option_value = getRadioVal( document.getElementById('searchForm'), 'searchOption' );

		// Get new Video Length Option
		videoLength_value = getRadioVal( document.getElementById('videoLengthForm'), 'videoLengthOption' );

		// Get new Max Results Option
		maxresults_value = document.getElementById("resultsList").value;

		// Run GET Request on API
		$.get(
			"https://www.googleapis.com/youtube/v3/search", {
			part: 'id, snippet',
			q: q,
			type: 'video',
			key: 'AIzaSyBAN-71jVHKbUzBIuoQS_OVMb9mLctpEUU',
			order: search_option_value,
			videoDuration: videoLength_value,
			maxResults: maxresults_value
			},
			function(data) {
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				$.each(data.items, function(i, item) {
					// Get and Display Output
					getOutput(item, i);
				});

				var buttons = getButtons(prevPageToken, nextPageToken);

				// Display Buttons
				$('#buttons_container').append(buttons);
			}
		);
	}
}

// New Page Buttons Function
function changePage(page){
	var token = $('#'+page+'_button').data('token');
	$('#query').val(q);

    // Clear Results
    $('#search_results').html('');
    $('#buttons_container').html('');

    // Run GET Request on API
    $.get(
      "https://www.googleapis.com/youtube/v3/search", {
        part: 'snippet, id',
        q: q,
        pageToken: token,
        type: 'video',
        key: 'AIzaSyBAN-71jVHKbUzBIuoQS_OVMb9mLctpEUU',
		order: search_option_value,
		videoDuration: videoLength_value,
		maxResults: maxresults_value
		},
		function(data) {
			var nextPageToken = data.nextPageToken;
			var prevPageToken = data.prevPageToken;

			$.each(data.items, function(i, item) {
			  // Get Output
			  var output = getOutput(item, i);

			  // Display Results
			  $('#search_results').append(output);
			});

			var buttons = getButtons(prevPageToken, nextPageToken);

			// Display Buttons
			$('#buttons_container').append(buttons);
		}
    );
}

// Build Output
function getOutput(item, index) {
	// Build Output String
	var output = '<li>' +
	'<div class="list_left">' +
	'<a data-fancybox data-type="iframe" href="http://www.youtube.com/embed/'+item.id.videoId+'"><img src="' + item.snippet.thumbnails.high.url + '"></a>' +
    '</div>' +
    '<div class="list_right">' +
	'<h3><a data-fancybox data-type="iframe" href="http://www.youtube.com/embed/'+item.id.videoId+'">'+item.snippet.title+'</a></h3>' +
    '<small>By <span class="cTitle">'+item.snippet.channelTitle+'</span> on '+getPublishedDate(item.snippet.publishedAt)+'</small>' +
	'</div>' +
    '</li>' +
    '<div class="clearfix"></div>' +
    '';
	$('#search_results').append(output);
	moreVideoInfo(item.id.videoId, index);
}

function moreVideoInfo(vidid, index){
	$.get(
		"https://www.googleapis.com/youtube/v3/videos",{
			key: 'AIzaSyBAN-71jVHKbUzBIuoQS_OVMb9mLctpEUU',
				id: vidid,
				part: 'contentDetails,statistics,snippet'
		},
		function(data){
			$.each(data.items, function(i, item) {
				// Get Output
				var output = '<p>duration: '+convertISO8601ToSeconds(item.contentDetails.duration)+
				'&nbsp;Views: '+addDotSeparator(item.statistics.viewCount)+
				'<br />Likes: '+addDotSeparator(item.statistics.likeCount)+
				'&nbsp;Dislikes: '+addDotSeparator(item.statistics.dislikeCount)+
				'&nbsp;Comments: '+addDotSeparator(item.statistics.commentCount)+ '</p>'+
				'<span class="inline descriptionP">Video description: '+item.snippet.description+'&nbsp;</span>'+
				'<a class="more_less move_up" onclick="showMoreLess(this)">More</a>';
				$('#search_results li')[index].children[1].innerHTML+=output;
			});
		}
	);

}

function showMoreLess(elem){	

}

// Build the Buttons
function getButtons(prevPageToken, nextPageToken) {
	if (!prevPageToken) {
		var btnoutput = '<div class="button_container">' +
		'<button id="next_button" class="paging_button" data-token="'+nextPageToken+'" data-query="'+q+'"' + 'onclick="changePage(\'next\');">Next Page</button></div>';
	} else {
		var btnoutput = '<div class="button_container">' +
		'<button id="prev_button" class="paging_button" data-token="'+prevPageToken+'" data-query="'+q+'"' + 'onclick="changePage(\'prev\');">Prev Page</button>' +
		'<button id="next_button" class="paging_button" data-token="'+nextPageToken+'" data-query="'+q+'"' + 'onclick="changePage(\'next\');">Next Page</button></div>';
	}
	return btnoutput;
}

// Get Radio Button Value
function getRadioVal(form, name) {
     /* var val;
    // get list of radio buttons with specified name
    var radios = form.elements[name];

    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) {
            val = radios[i].value;
            break;
        }
    }
    return val;
*/
    
    if(name==='searchOption')
        return $($('#divOrderBy > button.active')[0]).attr('data-value');
    else if(name === 'videoLengthOption')
        return $($('#divVideoLength > button.active')[0]).attr('data-value');
}

// Get Video Id
function getVidId(item){
	return item.id.videoId;
}

// Add dot separator to numeric values
function addDotSeparator(number) {
	if(number>999)
		return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
	else
		return number;
}

// Get ISO8601 Date
function getPublishedDate(publishedAt){
	var temp = new Date(Date.parse(publishedAt));
	return temp.toString();
}

// Convert ISO 8601 to Seconds
function convertISO8601ToSeconds(input) {
	var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
	var hours = 0, minutes = 0, seconds = 0, totalseconds;

	if (reptms.test(input)) {
		var matches = reptms.exec(input);
		if (matches[1]) hours = Number(matches[1]);
		if (matches[2]) minutes = Number(matches[2]);
		if (matches[3]) seconds = Number(matches[3]);
		totalseconds = hours * 3600  + minutes * 60 + seconds;
	}
	return (hours+"hr "+minutes+"min "+seconds+"sec");
}