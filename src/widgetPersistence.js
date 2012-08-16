/** 
 * Widget persistence
 */
widgetPersistence = {
	
	/**
	 * Persistence API url
	 */
	API_URL : 'http://btgs.com/API',
	
	/**
	 * Makes API call 
	 * Both paramaters are used for dependency injection so we could unitTest ajax call with spies
	 * 
	 * @param onSuccessCallback
	 * @param onFailureCallback
	 */
	makeAPIcall: function( data ) {
		
		var success = function( result ) {
				//TODO check if "result" was containing error or not
			};
		
		var failure = function( result ) {
				//TODO do something
			};
		
		this._makeAPIcall( success, failure );
	},
	
	/**
	 * Makes API call 
	 * Both paramaters are used for dependency injection so we could unitTest ajax call with spies
	 * 
	 * @param onSuccessCallback
	 * @param onFailureCallback
	 */
	_makeAPIcall: function( onSuccessCallback, onFailureCallback ) {
		$.ajax({
			url: this.API_URL,
			dataType: "json",
			success: onSuccessCallback,
			error: onFailureCallback
		});
	},
	
	/**
	 * Assigning event listeners to mediator and widgets.
	 */
	assignHandlers: function() {
		
	}
};