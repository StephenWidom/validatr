// validatr by Stephen Widom | http://stephenwidom.com | Latest update: 2016-04-28
(function($){ // Simple form validation w/ AJAX form submission

	var time = 0; setInterval(setTime,1000); function setTime(){++time;} // Timing how long it takes to complete - for spam prevention purposes

	$.fn.validatr = function(o){

		var s = $.extend({
			statusElement: 		'.status', 					// Element that will display the status returned
			requiredClass: 		'req',						// Class of required form elements
			errorClass: 		'error', 					// Class to add to inputs with errors
			validateOnBlur: 	true,						// Check value on input's blur
			emailClass: 		'validateEmail', 			// Class of inputs containing emails to be validated
			zipClass: 			'validateZip', 				// Class of inputs containing zip codes to be validated
			useFontAwesome: 	false,						// Add an .fa-warning to error messages
			filterSpam: 		false,						// Submit a value for $_POST['timer']
			useAJAX: 			false,						// Submit the form asynchronously
			handlerPath: 		'handleForm.php',			// Where to submit the form (if using AJAX)
			disableOnSuccess: 	true,						// Disable form controls on success
			successStatus: 		'success',					// What a successful submission will return
			replaceForm: 		false,						// Replace form with success message when submitted
			clearInputs: 		false,						// Clear inputs within form element on success
			submitMessage: 		'Submitting...', 			// Message displayed while form is submitting
			successMessage: 	'Thanks for contacting us!',// Success message to be displayed
			errorMessage: 		'Please complete all required fields.', // Default error message
			statusHidden: 		false, 						// Start with status element hidden
			callback: 			function(){}				// Function called on success
		},o);

		var $form = $(this), // Don't want to lose this...
		 	$status = $form.find(s.statusElement),
		 	$required = $form.find('.' + s.requiredClass),
		 	$submitButton = $form.find('input[type=submit]'),
			submitMessage = s.submitMessage + ((s.useFontAwesome) ? ' <i class="fa fa-spinner fa-pulse"></i>' : '');

		if(s.statusHidden) $status.hide(); // Don't show anything - status element may have a background...

		$form.on("submit",function(e){ // Catch form submission
			e.preventDefault(); // Don't submit the form by default
			$submitButton.attr('disabled', true);
			$form.find('.' + s.errorClass).removeClass(s.errorClass); // Remove error styling from form elements
			var error = false; // No errors so far...
			$required.each(function(){ // Gather each required form input
				if(!isValid($(this))){ // Check if the value of said input is valid. If not..
					error = true; // We've encountered an error
					$(this).addClass(s.errorClass); // Add error class to the input in question
					errorMessage = ((s.useFontAwesome) ? '<i class="fa fa-warning"></i> ' : '') + s.errorMessage;
				}
			});
			validateFields(error); // Display error message or submit form
		});

		if(s.validateOnBlur){ // If we're validating on input blur
			$required.on("blur",function(){
				if(isValid($(this))){ // If everything is cool..
					$(this).removeClass(s.errorClass); // Make sure input isn't in error state
				} else { // If value is invalid
					$(this).addClass(s.errorClass); // Add error class to input in question
				}
			});
		}

		// Functions
		function validateFields(error){
			if(error){ // If a required field is invalid
				$status.html(errorMessage).show(); // Display error message in status element
				$submitButton.attr('disabled', false);
			} else { // If we haven't encountered an error yet (we may still have to validate emails & zip codes)
				var problemFields = [], // Set up an empty array to contain problematic inputs
					emailInputs = $form.find('.' + s.emailClass); // Grab all email inputs we're going to validate
				if(emailInputs.length > 0){ // If there are email inputs that need validating...
					emailInputs.each(function(){ // ...loop through each one
						var email = $(this).val().trim(); // Get value of email input
						if(!isEmail(email)){ // If an email provided is invalid
							error = true;
							problemFields.push("email address");
							$(this).addClass(s.errorClass); // Add error class to email input
						}
					});
				}
				var zipInputs = $form.find('.' + s.zipClass); // Grab all zip code inputs we're going to validate
				if(zipInputs.length > 0){ // If there are zip codes that need validating...
					zipInputs.each(function(){
						var zip = $(this).val().trim(); // Get value of zip code input
						if(!isZip(zip)){ // If zip code provided is invalid
							error = true;
							problemFields.push("zip code");
							$(this).addClass(s.errorClass); // Add error class to zip code input
						}
					});
				}
				if(error){ // Have to check for an error again in case we enountered one when validating an email or zip code
					errorMessage = ((s.useFontAwesome) ? '<i class="fa fa-warning"></i> ' : '') + "Please provide a valid " + problemFields[0] + ((problemFields.length > 1) ? " and " + problemFields[1] : "") + ".";
					validateFields(error);
				} else {
					if(s.filterSpam) $form.append('<input type="hidden" name="timer" value="' + time + '"/>'); // If we're filtering spam, append a hidden field with the value of timer
					if(s.useAJAX){ // If we're going to submit the form asynchronously
						$status.html(submitMessage).show(); // Tell user form is being submitted
						$.post(s.handlerPath,$form.serialize(),function(data){ // Post form info to form handler
							if(data == s.successStatus){ // If form handler says everything is cool
								var replaceTarget = (s.replaceForm) ? $form : $status;
								replaceTarget.html(s.successMessage); // Display success message
								if(s.disableOnSuccess){
									var allFormElements = $("input,textarea,select");
									$form.find(allFormElements).prop("disabled",true).css("cursor","auto"); // Disable form controls (to prevent duplicate submissions)
								}
								if(s.clearInputs){
									var allFormElements = $("input,textarea,select").not("[type=submit]");
									$form.find(allFormElements).val('');
								}
								o.callback.call(this); // Callback function
							} else { // If handler returns an error
								$status.html(data).show(); // Display error message returned from handler
							}
						});
					} else { // If we're not using AJAX, just submit form normally
						$form.unbind().submit(); // Have to unbind "submit"-triggered validation first
						$status.html(submitMessage).show(); // Tell user form is being submitted
					}
				}
			}
		}

		function isValid($object){ // Check if input's value is valid
			var type = $object.prop('type');
			if (type == "checkbox"){
				return $object.is(":checked");
			}
			if (type == "radio"){
				var name = $object.attr('name');
				return $('input[name='+name+']').filter(":checked").length > 0;
			}
			var value = $object.val().trim(); // Get the value of said input
			var name = $object.attr("name"); // Get the name of said input (in case it's being used as a placeholder)
			return (value == "" || value.toLowerCase() == name.toLowerCase()) ? false : true; // Check if input value is blank or equal to its name (placeholder)
		}

		function isEmail(email){ // Real basic email validation
			return /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);
		}

		function isZip(zip){ // Real basic zip code validation
			return /^\d{5}(-\d{4})?$/.test(zip);
		}

		return this;
	}
}(jQuery));