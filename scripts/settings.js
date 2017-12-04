var Settings = {
	changeSortingOption : function() {
		var that = $(this);
		this.sortBy = that.text();
		$('.sort-by-link').parent().removeClass('active');
		that.parent().addClass('active');
		that.parent().parent().prev().html('Sort by: ' + that.text() + ' <span class="caret"></span>');
		$('.dropdown').removeClass('open');
		return false;
	},

	changeVideoLengthOption : function() {
		var that = $(this);
		this.videoLength = that.text();
		$('.video-length-link').parent().removeClass('active');
		that.parent().addClass('active');
		that.parent().parent().prev().html('Video length: ' + that.text() + ' <span class="caret"></span>');
		$('.dropdown').removeClass('open');
		return false;
	},

	changeResultsCountOption : function() {
		var that = $(this);
		this.resultsCount = that.text();
		$('.max-results-link').parent().removeClass('active');
		that.parent().addClass('active');
		that.parent().parent().prev().html('Number of results: ' + that.text() + ' <span class="caret"></span>');
		this.resultsCount = that.text();
		$('.dropdown').removeClass('open');
		return false;
	}
}