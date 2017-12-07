//Self-invoking function (a "Closure") that only runs ONCE
(function() {
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
					right: '55%'
				}, 400, function() {});
			}
		});
		
		// Init FancyBox
		$('[data-fancybox]').fancybox();
		
		// Search Options drop-down handlers
		$('.sort-by-link').on('click', Settings.changeSortingOption);
		$('.video-length-link').on('click', Settings.changeVideoLengthOption);
		$('.max-results-link').on('click', Settings.changeResultsCountOption);
				
		// Wire submit handler on search form
		$('#search-form').on('submit', function(e) {
			//prevent form from being submitted
			e.preventDefault();
			//execute search
			api.search();
		});
	})
})();