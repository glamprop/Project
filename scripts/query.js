var QueryData = (function() {
	var query, results;
	
	this.setQueryData = function(q, data) {
		this.query = q;
		this.results = data;
	};
	
	this.getQuery = function() {
		return this.query;
	};
	
	this.getResultsJSON = function() {
		return this.results;
	};
	
	this.setQueryJSON = function(data) {
		this.results = data;
	};
	
	this.getNextPageToken = function() {
		return this.results.nextPageToken;
	};
	
	this.getPrevPageToken = function() {
		return this.results.prevPageToken;
	};
	
	return {
		setQueryData	 : setQueryData,
		getQuery		 : getQuery,
		setQueryJSON	 : setQueryJSON,
		getResultsJSON	 : getResultsJSON,
		getNextPageToken : getNextPageToken,
		getPrevPageToken : getPrevPageToken
	}
})();