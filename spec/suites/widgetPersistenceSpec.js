describe("BTGS.Widgets persistence", function() {
	var sharedContext = {};
	
	beforeEach(function() {
		 defaultFixturesPath = jasmine.getFixtures().fixturesPath;
		 jasmine.getFixtures().fixturesPath = '/spec/fixtures';// we need to prefix path with "/test" so fixtures could be picked up by jsTestDriver.
		 jasmine.getFixtures().clearCache();
	});
	
	describe("Widgets Interaction ", function() {
		
		beforeEach(function(){
			affix('#mediator div.widget');
			spyOnEvent($('#mediator'), 'persistenceChanged');
		});
		
		// example of async test. After clicking mediator we wait for 100ms before checking triggering of event
		it("should pass when widget notifies mediator after it has been dragged to a new position", function() {
			runs(function() {
				$('#mediator').trigger('persistenceChanged');
			});
			
			waits(100);
			
			runs(function() {
				expect('persistenceChanged').toHaveBeenTriggeredOn($('#mediator'));
			});
		});
	});
	
	describe("AJAX call to persistence API ", function() {
		var request,
			response,
			responseJSON,
			onSuccess,
			onFailure;
	
		describe("when response is Success", function () {
			beforeEach(function() {
				responseJSON = readFixtures('persistenceSuccess.json');// fixtures should be loaded before jasmine.Ajax.useMock();
				
				jasmine.Ajax.useMock();
				
				onSuccess = jasmine.createSpy('success');
				onFailure = jasmine.createSpy('error');
				
				$.ajax({
					url: 'http://btgs.com/API',
					dataType: "json",
					success: onSuccess,
					error: onFailure
				});
				
				request = mostRecentAjaxRequest();
				console.log(request);
				response = {status: 200, contentType: "application/json", responseText: responseJSON};
				request.response( response );
				console.log(request);
				
				sharedContext.responseCallback = onSuccess;
				sharedContext.status = response.status;
				sharedContext.contentType = response.contentType;
				sharedContext.responseText = response.responseText;
			});
			
			// checking response status/contentType/ResponseText
			sharedAjaxResponseBehaviorForJQuery_Success( sharedContext );
			
			it("should call success callback", function() {
				expect(onSuccess).toHaveBeenCalled();
			});
			
			it("should not call failure callback", function() {
				expect(onFailure).not.toHaveBeenCalled();
			});
			
			it("should return JSON object", function() {
				expect(onSuccess.mostRecentCall.args[0]).toEqual( jQuery.parseJSON(responseJSON) );// fixture is loaded as a string so we need to convert it to JSON object
			});
			
			it("should contain JSON object's result returned without any errors", function() {
				expect(onSuccess.mostRecentCall.args[0].result).toEqual( "success" );
			});
			
		});
		
		describe("when response is Success, but returned result contains error", function () {
			beforeEach(function() {
				responseJSON = readFixtures('persistenceFailure.json');// fixtures should be loaded before jasmine.Ajax.useMock();
				
				jasmine.Ajax.useMock();
		
				onSuccess = jasmine.createSpy('success');
				onFailure = jasmine.createSpy('error');
		
				$.ajax({
					url: 'http://btgs.com/API',
					dataType: "json",
					success: onSuccess,
					error: onFailure
				});
						
				request = mostRecentAjaxRequest();
				response = {status: 200, contentType: "application/json", responseText: responseJSON};
				request.response( response );

			});
			
			it("should call success callback", function() {
				expect(onSuccess).toHaveBeenCalled();
			});
			
			it("should not call failure callback", function() {
				expect(onFailure).not.toHaveBeenCalled();
			});
			
			it("should return JSON object", function() {
				expect(onSuccess.mostRecentCall.args[0]).toEqual( jQuery.parseJSON(responseJSON) );// fixture is loaded as a string so we need to convert it to JSON object
			});
			
			it("should contains JSON object with errors", function() {
		        expect(onSuccess.mostRecentCall.args[0].result).toEqual( "error" );
		    });
			
		});
        
		describe('when response is 500 Error', function() {
			beforeEach(function() {
				jasmine.Ajax.useMock();
				
				onSuccess = jasmine.createSpy('success');
				onFailure = jasmine.createSpy('error');
				
				$.ajax({
					url: 'http://btgs.com/API',
					dataType: "json",
					success: onSuccess,
					error: onFailure
				});
				
				request = mostRecentAjaxRequest();
				response = {status: 500, contentType: "application/json", responseText: "nothing found"};
				request.response(response);
			});
			
			it("should not call the success callback", function() {
				expect(onSuccess).not.toHaveBeenCalled();
			});
			
			it("should call the failure callback", function() {
				expect(onFailure).toHaveBeenCalled();
			});
		});
		
        describe('when response is Timed out', function() {
        	beforeEach(function() {
        		jasmine.Clock.useMock();
				jasmine.Ajax.useMock();
		
				onSuccess = jasmine.createSpy('success');
				onFailure = jasmine.createSpy('error');
		
				$.ajax({
					url: 'http://btgs.com/API',
					dataType: "json",
					success: onSuccess,
					error: onFailure
				});
						
				request = mostRecentAjaxRequest();
				response = {contentType: "application/json", responseText: "{result:response timeout}"};
				request.responseTimeout(response);
			});
        	
            it("should not call the success callback", function() {
                expect(onSuccess).not.toHaveBeenCalled();
            });

            it("should call the failure callback", function() {
            	expect(onFailure).toHaveBeenCalled();
            });
        });
        
	});
	
});

function sharedAjaxResponseBehaviorForJQuery_Success(context) {
  describe("the success response", function () {
    var xhr;
    beforeEach(function() {
      xhr = context.responseCallback.mostRecentCall.args[2];
    });

    it("should have the expected status code", function() {
      expect(xhr.status).toEqual(context.status);
    });

    it("should have the expected content type", function() {
      expect(xhr.getResponseHeader('Content-type')).toEqual(context.contentType);
    });

    it("should have the expected response text", function() {
      expect(xhr.responseText).toEqual(context.responseText);
    });
  });
}