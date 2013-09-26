<!-- This page contains the bootstrap markup for the nav, tabs and modalsS -->
<div class="container">
      	<div id="logout">Logout</div>
  <div id="logos-wrapper">
    <div id="start-logo" class="clearfix">
      <img src="<?php echo base_url();?>assets/img/logo75x75.jpg" />
    </div>
  </div>
  <div class="row">
  	<div class="col-lg-1"></div>
    <div class="col-lg-10">
    	<h1>Shout Admin</h1>
        <div style="float:right;"><a href="/admin/show_info" target="_blank">Show PHP Info</a></div>
     		<div class="clearfix"></div>
        <ul class="nav nav-tabs">
          <li class="active"><a href="#groups" data-toggle="tab">Groups</a></li>
          <li><a href="#accounts" data-toggle="tab">Accounts</a></li>
        </ul>
        <div class="tab-content">
        	<div class="tab-pane active panel panel-primary fade" id="groups" style="opacity:1">
              <div class="panel-heading"><p style="font-weight:bold;">Groups:<span id="upload_list"><img src="/assets/img/add.png" style="margin-left:12px;" align="baseline" />Upload Contacts List</span></p>
              </div>
<?php
          if ($groups->num_rows()>0) {
?>					
              <div class="panel-body">
              <table class="table table-hover">
<?php
           foreach ($groups->result() as $group) {
?>
              <tr group="<?=$group->group_id?>">
                <td>
                  <?=$group->group_name?>
                </td>
                <td>
                  <img src="/assets/img/email.png" class="send_email" group="<?=$group->group_id?>" />
                  <img src="/assets/img/delete.png" class="delete_group" group="<?=$group->group_id?>" />
                </td>
              </tr>
<?php
           }	//	($group = $groups->row())
?>
							</table>
              </div>
<?php
         }	//	($groups->num_rows()>0)
?>
       </div>	<!--	tab-pane groups	-->
      <div class="tab-pane panel panel-primary fade" id="accounts">
      	<div class="panel-heading">
          <p style="font-weight:bold;">Accounts:<span id="new_account"><img src="/assets/img/add.png" id="add_account" style="margin-left:12px;" align="baseline" />Add New Account</span></p>
        </div>
<?php
				if ($accounts->num_rows()>0) {
?>
					<div class="panel-body">
          	<table class="table table-hover">
            	<tr>
              	<th>Name</th>
                <th>Identifier</th>
                <th>Edit</th>
              </tr>
<?php
					foreach ($accounts->result() as $account) {
?>
							<tr>
              	<td>
          				<?=$account->name?>
                </td>
                <td align="center">
                	<?=$account->identifier?>
                </td>
                <td align="center">
                 	<a  class="edit_account" account="<?=$account->id?>"><img src="/assets/img/edit.png" align="texttop" border='0' account="<?=$account->id?>" /></a>
                </td>
            	</tr>
<?php
					}
?>
						</table>
          </div>
<?php
				}
?>
        </div><!--	tab-pane accounts	-->
      </div><!--	tab-content	-->
		</div>
    <div class="col-lg-1"></div>
	</div>
<!--
	Page ends here
	Modal Dialog Boxes
  upload_list_modal contains the complete upload routines.
  delete_modal is for deleting things.
  
-->
<div class="modal fade" id="upload_list_modal">
  <div class="modal-dialog" style="width: 90%;">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Upload List</h3>
      </div>
      <div class="modal-body">
        <p id="instructions"></p>
        <p id="data_form">
          <form id="upload_form" enctype="multipart/form-data" method="post" action="" onsubmit="return false;">
            <input type="file" name="data_file" id="data_file" onchange="fileSelected(this);" accept="text/plain, text/csv" /><br />
            <input type="text" name='group_name' placeholder="Group Name" id="group_name" />
            <input type="hidden" name="submit" value="upload" />
          </form>
          <div id="fileinfo">
            <div id="filename"></div>
            <div id="filesize"></div>
            <div id="filetype"></div>
          </div>
          <div id="progressNumber" align='center' style='width:380px;text-align:center;'></div>
          <div id="progressContainer" style="display:none;"><div id="progressBar"></div></div>
        </p>
        <p id="data_content"></p>
          <div id="insertProgressNumber" align='center' style='width:380px;text-align:center;'></div>
          <div id="insertProgressContainer" style="display:none;"><div id="insertProgressBar"></div></div>
      </div>
      <div class="modal-footer">
        <a href="#" class="btn"data-dismiss="modal">Cancel</a>
        <button class="btn btn-primary" id="next_step" step="1">Next ></button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="delete_modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Confirm Delete</h3>
      </div>
      <div class="modal-body">
        <p id="delete_info"></p>
      </div>
      <div class="modal-footer">
        <a href="#" class="btn"data-dismiss="modal">Cancel</a>
        <button class="btn btn-primary" id="do_delete_button" user_id=''>Confirm</button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="account_edit_modal">
  <div class="modal-dialog" style="width: 70%;">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Edit Account</h3>
      </div>
      <div class="modal-body">
        <p id="account_edit_info">
        	<form id="account_edit_form" onsubmit="return false;" role="form">
          	<table width="100%" cellpadding="4">
            	<tr>
              	<th>Name</th>
              	<th>identifier</th>
              	<th>description</th>
              	<th>logo</th>
              </tr>
              <tr>
              	<td valign="top"><div class="form-group"><input type="text" name="txtAccountName" class="form-control"  /></div></td>
                <td valign="top"><div class="form-group"><input type="text" name="txtAccountIdentifier" class="form-control"  /></td>
                <td valign="top"><div class="form-group"><textarea name="taAccountDescription" class="form-control"></textarea></td>
                <td valign="top"><div class="form-group"><input type="text" name="txtAccountLogo" class="form-control"  /></div></td>
              </tr>
            </table>
              
          </form>
        </p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" id="do_edit_button" user_id=''>Commit Changes</button>
        <button class="btn btn-default" data-dismiss="modal">Cancel</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="account_edit_modal2">
  <div class="modal-dialog" style="width: 70%;">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Edit Account</h3>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" id="do_edit_button" user_id=''>Commit Changes</button>
        <button class="btn btn-default" data-dismiss="modal">Cancel</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="error_modal">
  <div class="modal-dialog" style="width: 90%;">
    <div class="modal-content">
      <div class="modal-header error">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Errors Found</h3>
      </div>
      <div class="modal-body" id="error_container">
      </div>
      <div class="modal-footer">
        <a href="#" class="btn" data-dismiss="modal">Ok</a>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="confirmDelete">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header modal-warning">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3 class="modal-title warning">Confirm Delete</h3>
      </div>
      <div class="modal-body" id="confirmContainer">
      </div>
      <div class="modal-footer">
        <a href="#" class="btn btn-primary" data-dismiss="modal">Delete it</a>
        <a href="#" class="btn btn-default" data-dismiss="modal">Cancel</a>
      </div>
    </div>
  </div>
</div>
