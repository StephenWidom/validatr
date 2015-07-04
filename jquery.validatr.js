// validatr by Stephen Widom 2015-06-12 - stephenwidom.com
(function($){ // Simple form validation w/ AJAX form submission

	var time = 0; setInterval(setTime,1000); function setTime(){++time;} // Timing how long it takes to complete - for spam prevention purposes

	$.fn.validatr = function(o){
		var s = $.extend({
			statusElement: 		'.status', 					// Element that will display the status returned
			requiredClass: 		'req',						// Class of required form elements
			errorClass: 		'error', 					// Class to add to inputs with errors
			validateOnBlur: 	true,						// Check value on input's blur
			useFontAwesome: 	false,						// Add an .fa-warning to error messages
			filterSpam: 		false,						// Submit a value for $_POST['timer']
			useAJAX: 			false,						// Submit the form asynchronously
			handlerPath: 		'handleForm.php',			// Where to submit the form (if using AJAX)
			disableOnSuccess: 	true,						// Disable form controls on success
			successStatus: 		'success',					// What a successful submission will return
			successMessage: 	'Thanks for contacting us!',// Success message to be displayed
			errorMessage: 		'Please complete all required fields' // Error message
		},o);

		var $form = $(this); // Don't want to lose this...

		$form.on("submit",function(e){ // Catch form submission
			e.preventDefault(); // Don't submit the form by default
			$form.find('.' + s.errorClass).removeClass(s.errorClass); // Remove error styling from form elements
			var error = false; // No errors so far...
			$form.find('.' + s.requiredClass).each(function(){ // Gather each required form input
				if(!isValid($(this))){ // Check if the value of said input is valid. If not..
					error = true; // We've encountered an error
					$(this).addClass(s.errorClass); // Add error class to the input in question
				}
			});
			if(error){ // If a required field is invalid
				var errorMessage  = s.errorMessage; // Error message
				if(s.useFontAwesome) errorMessage = '<i class="fa fa-warning"></i> ' + errorMessage; // Add warning sign icon to error message if FontAwesome is enabled
				$form.find(s.statusElement).html(errorMessage); // Display error message in status element
			} else { // If everything is cool
				if(s.filterSpam) $form.append('<input type="hidden" name="timer" value="' + time + '"/>'); // If we're filtering spam, append a hidden field with the value of timer
				if(s.useAJAX){ // If we're going to submit the form asynchronously
					$.post(s.handlerPath,$form.serialize(),function(data){ // Post form info to form handler
						if(data == s.successStatus){ // If form handler says everything is cool
							$form.find(s.statusElement).html(s.successMessage); // Display success message
							if(s.disableOnSuccess) $('input, textarea, select').prop("disabled",true).css("cursor","auto"); // Disable form controls (to prevent duplicate submissions)
						} else { // If handler returns an error
							$(s.statusElement).html(data); // Display error message returned from handler
						}
					});
				} else { // If we're not using AJAX, just submit form normally
					$form.unbind().submit(); // Have to unbind "submit"-triggered validation first
				}
			}
		});

		if(s.validateOnBlur){ // If we're validating on input blur
			$form.find('.' + s.requiredClass).on("blur",function(){
				if(isValid($(this))){ // If everything is cool..
					$(this).removeClass(s.errorClass); // Make sure input isn't in error state
				} else { // If value is invalid
					$(this).addClass(s.errorClass); // Add error class to input in question
				}
			});
		}

		// Functions

		function isValid($object){ // Check if input's value is valid
			var value = $object.val().trim(); // Get the value of said input
			var name = $object.attr("name"); // Get the name of said input (in case it's being used as a placeholder)
			return (value == "" || value.toLowerCase() == name.toLowerCase()) ? false : true; // Check if input value is blank or equal to its name (placeholder)
		}

		function IsEmail(email){ // Real basic email validation
			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return regex.test(email);
		}

		return this;
	}
}(jQuery));