// This file sets up some click handlers and the tabbed navigation.  functions include CRUD for contact lists.
$(document).ready(function(){
	$('#admin-menu div').click(function(e) {
		clicked_element = e.target;
		tab_to_show = $(clicked_element).attr('data-target')
		$('#content div.tab').hide();
		$('#'+tab_to_show).show();
	})
	$('#admin-options').click(function() {
		document.location.href="/admin/logout/";
	})
	$('#form_modal .btn-primary').click(function(e) {
		saveForm(e);
	})
	$('#account_form_modal .btn-primary').click(function(e) {
		saveAccountForm(e);
	})
	$('#error_modal [data-dismiss="modal"]').click(function(){
		$('#form_modal').modal('show');
	})
	$('#new_contact, #contact_table').on('click','.edit_contact_button',function() {
		alert('edit contact')
	})
	$('#new_list').on('click', function(){
		$('#upload_list_modal').modal('show');
	})
	$('#upload_list_modal #next_step').on('click', function(){fnNextStep(this)});
})

function fnNextStep(btn) {
	step = $(btn).attr('step');
	switch (step) {
		case '1':
			f = $('#data_file')[0].files[0]
			uploadFile(f);
		break;
		case '2':
			batchSize = 10;
			insertContacts();
		break;
	}
}
function fileSelected(el) {
	//	Clear error condition if any
	$('#fileinfo').removeClass('text-danger');
	f = el.files[0]
	//	Update file information
	$('#filename').html('Filename: '+f.name);
	$('#filesize').html('File Size: '+fixFileSize(parseInt(f.size)));
	$('#filetype').html('File Type: '+f.type);
	//	Make sure the file type is text or csv
	if ((f.type!='text/plain')&&(f.type!='text/csv')) {
		$('#fileinfo').addClass('text-danger');
		$('#filetype').html('File Type: <strong>Invalid File Type</strong>');
		f.files = null;
	}
}
function fixFileSize(size) {
	append_string = new Array(" Bytes", " KB", " MB", " GB", " TB");
	pointer = 0;
	while (size>1024) {
		size = size/1024;
		pointer++;
	}
	return (parseInt(size*100)/100)+append_string[pointer];
}
function uploadFile(f) {
	var fd = new FormData();
	fd.append("data_file", f);
	fd.append('submit', 'Upload');
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	xhr.open("POST", "/ajax/receiveUploadedList");
	xhr.send(fd);
}
function uploadProgress(evt) {
	if (evt.lengthComputable) {
		$('#progressContainer').show();
	  var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	  width_to_set = (percentComplete/100)*380;
	  $('#progressBar').css('width',width_to_set);
	  $('#progressNumber').html(percentComplete.toString() + '%');
	}
	else {
	  document.getElementById('progressNumber').innerHTML = 'Progress display not supported by browser.';
	}
}

function uploadComplete(evt) {
	/* This event is raised when the server send back a response */
	if (typeof console != 'undefined') {
		console.log('evt::');
		console.log(evt);
	}
	$('#progressNumber').html('File Complete');
	$('#progressBar').css('width', 380);
	$('#uploadTarget').html(evt.target.responseText);
	data = eval('('+evt.target.responseText+')')
	if (typeof console != 'undefined') {
		console.log('data::');
		console.log(data);
	}
	if (data) {
		if (data.data[0].length) {
			sel = document.createElement('select');
			sel.name = 'field[]';
			$(sel).addClass('fields')
			//	Set up the default options...
			default_options = new Array('Do Not Import', 'First Name', 'Last Name', 'Phone Number', 'Email Address');
			for (i=0;default_options[i];i++) {
				$('<option />').val(default_options[i].replace(/ /g, '_').replace(/\'/g, '')).html(default_options[i]).appendTo(sel);
			}
			//	Add options not covered in the defaults like Pin or Address 1.
			for (i=0;data['data'][0][i];i++) {
				default_options = new Array('first name', 'last name', 'phone', 'phone number', 'email', 'email address');
				if ($.inArray(data['data'][0][i].toLowerCase(), default_options)<0) {
					$('<option />').val(data['data'][0][i].replace(/ /g, '_').replace(/\'/g, '')).html(data['data'][0][i]).appendTo(sel);
				}
			}
			//	Create a table with drop-downs in the first row and the first five rows in the data file.
			tbl = $('<table />');
			$(tbl).attr('id', "import-table");
			$(tbl).addClass('table');
			$(tbl).addClass('table-hover');
			$('#upload_form').data('original_file_name', data['file_name']);
			$('#upload_form').data('batch_size', 10)
			tr = $(tbl).append($('<tr />'));
			//	First row is for the drop-downs
			for (i=0;data['data'][0][i];i++) {
				$('<td />').append($(sel).clone()).appendTo($(tbl).find('tr'));
			}
			$('#data_content').append(tbl);
			strTemp = ''
			//	Assume the first row of the data is headers.
			for (i=1;i<Math.min(6,data.data.length);i++) {
				strTemp += '<tr>';
				for (j=0;data['data'][i][j];j++) {
					strTemp += '<td>'+data['data'][i][j]+'</td>';
				}
				strTemp += '</tr>';
			}
			$(tbl).append(strTemp);
			//	Kick it to the next step
			$('#next_step').attr('step', 2);
		}
	}
}

function uploadFailed(evt) {
	$('#uploadTarget').html("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
	$('#uploadTarget').html("The upload has been canceled by the user or the browser dropped the connection.");
}
function insertContacts(batch_size) {
	fields = new Object();
	firstNameCount = lastNameCount = phoneNumberCount = emailAddressCount = do_not_import = fieldCount = 0;
	errors = new Array();
	//	Get the values of the drop downs
	$('.fields').each(function(ndx) {
		val = $(this).val();
		fieldCount++;
		switch(val) {
			case 'First_Name':
				fields['firstName'] = ndx;
				firstNameCount++;
			break;
			case 'Last_Name':
				fields['lastName'] = ndx;
				lastNameCount++;
			break;
			case 'Phone_Number':
				fields['phoneNumber'] = ndx;
				phoneNumberCount++;
			break;
			case 'Email_Address':
				fields['emailAddress'] = ndx;
				emailAddressCount++;
			break;
			case 'Do_Not_Import':
				do_not_import++;
			break;
			default:
				fields[val]= ndx;
			break;
		}
	})
	//	Make sure there are no duplicates
	if (firstNameCount>1) {
			errors.push('<li>First name was selected more than once.</li>');
	}
	if (lastNameCount>1) {
			errors.push('<li>Last name was selected more than once.</li>');
	}
	if (phoneNumberCount>1) {
			errors.push('<li>Phone number was selected more than once.</li>');
	}
	if (emailAddressCount>1) {
			errors.push('<li>Email address was selected more than once.</li>');
	}
	//	Make sure something was selected for import
	if (fieldCount == do_not_import) {
		errors.push('<li>No fields were chosen for import</li>');
	}
	if (errors.length>0) {
		$('#error_message').html('');
		$('<ul />').append(errors.join()).appendTo('#error_message');
		$('#error_modal').modal('show');
	} else {
		aData = new Object();
		aData.file_name = $('#upload_form').data('original_file_name');
		aData.fields = fields;
		if (typeof console != 'undefined') {
			console.log(aData);
		}
		$('#data_content').html('Loading Contacts...');
		$.ajax({
			url:'/ajax/loadContacts',
			data:aData,
			type:'POST',
			dataType:'json',
			success: function(trn){
				if (trn.status == 'success') {
					$('#data_content').html('<div id="insertProgressNumber"></div><div id="insertProgressContainer"><div id="insertProgressBar"></div></div>');
					do_inserts(0,$('#upload_form').data('batch_size'), trn.rows, $('#upload_form').data('original_file_name'));
				} else {
					$('#error_message').html('There was a problem loading the contacts.  Please try again.');
					$('#error_modal').modal('show');
				}
			}
			
		})
	}
}
function do_inserts(start, batch_size, total, file_name) {
	$.ajax({
		url: '/ajax/do_insert',
		data:{'start':start,'batch_size':batch_size, 'file_name':file_name},
		dataType:'json',
		type:'POST',
		success: function(trn) {
			if (typeof console != 'undefined') {
				console.log(trn);
			}
			if (trn.status=='continue') {
				$('#insertProgressNumber').html(trn.next+' of '+total);
				$('#insertProgressBar').css('width', parseInt((trn.next/total)*380));
				do_inserts(trn.next, trn.batch_size, total, trn.file_name);
			} else {
				$('#data_content').html('Finished!');
			}
		}
	})
}