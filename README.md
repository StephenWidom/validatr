## VALIDATR
A simple jQuery plugin for basic form validation

## USE:
```js
$('form').validatr();
```

## OPTIONS:
### statusElement: '.status' 
Element that will display the status returned (either errorMessage or successMessage)

### requiredClass: 'req'
Class of required form elements

### errorClass: 'error'
Class to add to inputs with errors

### validateOnBlur: true
Check value on input's blur

### validateEmail: false
Validate email inputs

### emailClass: 'email'
Class of inputs containing emails

### emailMessage: 'Please provide a valid email address'
Displayed when an invalid email is provided

### useFontAwesome: false
Add an .fa-warning to error messages

### filterSpam:	false
Submit a value for $_POST['timer'], which can be used by your form handler to determine if a submission is suspicious

### useAJAX: false
Submit the form asynchronously

### handlerPath: 'handleForm.php'
Where to submit the form (if using AJAX)

### disableOnSuccess: true
Disable form controls on success

### successStatus: 'success'
What a successful submission will return (from your form handler)

### successMessage: 'Thanks for contacting us!'
Success message to be displayed

### errorMessage: 'Please complete all required fields'
Error message displayed when form fails to validate

[See it in action](http://stephenwidom.com/projects/validatr)

*Developed by Stephen Widom - http://stephenwidom.com*