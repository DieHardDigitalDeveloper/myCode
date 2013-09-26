/*
	The document.ready sets up the text fields to do what HTML5 does naturally with the placeholder attribute.
	
	the check form function sets up an ok flag and an errMsg array.  Checks on the form set an errMsg element.
	
	At the end of the form, either a join is performed on errMsg and displayed.  The flag ok is returned as either true (submit the form) or false (errors discovered).
*/
$(document).ready(function(){
	if (document.forms.length>0) {
		document.forms[0].action = 'add_user.php';
	}
	$(":text").focus(function(){
		if (this.value==this.defaultValue) {
			this.value = "";
		}
	});
	$(":text").blur(function(){
		if (this.value=="") {
			this.value = this.defaultValue
		}
	});
});
function fnCheckForm(f) {
	ok = true;
	errMsg = new Array();
	var chkEmail= /[mailto:]?[a-zA-Z0-9]+[a-zA-Z\-\_0-9\.]*@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,3}[\.a-zA-Z]*/

	$(f.name, f.email_address).css('background-color', '#FFDC7C');
	if ((f.name.value=="") || (f.name.value == f.name.defaultValue)) {
		ok = false;
		errMsg.push("Please enter your name.");
		$(f.name).css('background-color', '#FFCCCC');
	}
	if ((f.email_address.value=='') || (f.email_address.value==f.email_address.defaultValue)) {
		ok = false;
		errMsg.push("I&apos;ll need your email address to notify you of new free videos and upcoming class offerings.")
		$(f.email_address).css('background-color', '#FFCCCC');
	}
	if (!chkEmail.test(f.email_address.value)) {
		ok = false;
		if (errMsg.length==0) {
			f.email_address.focus();
		}
		errMsg.push('Could not validate email address.');
		f.email_address.style.backgroundColor = '#FFA194;'
	}

	if (errMsg.length>0) {
		$('#errDiv').html(errMsg.join('<br>')).show();;
	}
	return ok
}