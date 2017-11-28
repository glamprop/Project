//Self-invoking function (a "Closure")
//that only runs ONCE
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

		//Prevent form from being submitted
		$('#search_form').submit(function(e) {
			e.preventDefault();
		});
		
		//Init FancyBox
		$('[data-fancybox]').fancybox();
	})
})();