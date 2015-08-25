(function($){var time=0;setInterval(setTime,1000);function setTime(){++time;}$.fn.validatr=function(o){var s=$.extend({statusElement:'.status',requiredClass:'req',errorClass:'error',validateOnBlur:true,emailClass:'validateEmail',zipClass:'validateZip',useFontAwesome:false,filterSpam:false,useAJAX:false,handlerPath:'handleForm.php',disableOnSuccess:true,successStatus:'success',replaceForm:false,submitMessage:'Submitting...',successMessage:'Thanks for contacting us!',errorMessage:'Please complete all required fields.'},o);var $form=$(this),$status=$form.find(s.statusElement),$required=$form.find('.'+s.requiredClass),submitMessage=s.submitMessage+((s.useFontAwesome)?' <i class="fa fa-spinner fa-pulse"></i>':'');$status.hide();$form.on("submit",function(e){e.preventDefault();$form.find('.'+s.errorClass).removeClass(s.errorClass);var error=false;$required.each(function(){if(!isValid($(this))){error=true;$(this).addClass(s.errorClass);errorMessage=((s.useFontAwesome)?'<i class="fa fa-warning"></i> ':'')+s.errorMessage;}});validateFields(error);});if(s.validateOnBlur){$required.on("blur",function(){if(isValid($(this))){$(this).removeClass(s.errorClass);}else{$(this).addClass(s.errorClass);}});}function validateFields(error){if(error){$status.html(errorMessage).show();}else{var problemFields=[],emailInputs=$form.find('.'+s.emailClass);if(emailInputs.length>0){emailInputs.each(function(){var email=$(this).val().trim();if(!isEmail(email)){error=true;problemFields.push("email address");$(this).addClass(s.errorClass);}});}var zipInputs=$form.find('.'+s.zipClass);if(zipInputs.length>0){zipInputs.each(function(){var zip=$(this).val().trim();if(!isZip(zip)){error=true;problemFields.push("zip code");$(this).addClass(s.errorClass);}});}if(error){errorMessage=((s.useFontAwesome)?'<i class="fa fa-warning"></i> ':'')+"Please provide a valid "+problemFields[0]+((problemFields.length>1)?" and "+problemFields[1]:"")+".";validateFields(error);}else{if(s.filterSpam)$form.append('<input type="hidden" name="timer" value="'+time+'"/>');if(s.useAJAX){$status.html(submitMessage).show();$.post(s.handlerPath,$form.serialize(),function(data){if(data==s.successStatus){var replaceTarget=(s.replaceForm)?$form:$status;replaceTarget.html(s.successMessage);if(s.disableOnSuccess){var allFormElements=$("input,textarea,select");$form.find(allFormElements).prop("disabled",true).css("cursor","auto");}}else{$status.html(data).show();}});}else{$form.unbind().submit();$status.html(submitMessage).show();}}}}function isValid($object){var value=$object.val().trim();var name=$object.attr("name");return(value==""||value.toLowerCase()==name.toLowerCase())?false:true;}function isEmail(email){return/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email);}function isZip(zip){return/^\d{5}(-\d{4})?$/.test(zip);}return this;}}(jQuery));