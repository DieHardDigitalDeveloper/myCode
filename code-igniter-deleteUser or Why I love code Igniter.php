<?php
	function deleteUser() {
		if (current_user_is('administrator')) {
			$id = $this->input->post('user_id', true);
			if (!empty($id)) {
				$this->load->model('user_model');
				$this->user_model->deleteUser($id);
				if ($this->db->affected_rows()>0) {
					echo(json_encode(array('status'=>'success')));
				} else {
					echo(json_encode(array('status'=>'failed')));
				}
			}
		}
	}
?>
