<?php
	/****************************
	**
	**	this function sets up an admin page depending on the users credentials.
	**	Site administrators get one screen, accounts get another.
	**	The framework is code igniter so the function sets up $data to hold the javascript and style dependencies.
	**	Content is loaded into the view depending on user role (admin, client or agent).
	**
	***************************/
	function load_admin_page() {
		$data['scripts'][] =  '/assets/scripts/jquery-1.10.2.js';
		$data['scripts'][] = '/assets/scripts/bootstrap.js';
		$data['css'][] = '/assets/css/bootstrap.css';
		$data['css'][] = '/assets/css/main.css';
		$data['css'][] = '/assets/css/client.css';
		$greeting = '';
		if (current_user_is('administrator')) {
			$greeting = "Administrator";
			$data['scripts'][] = '/assets/scripts/admin.js';
		}
		if (current_user_is('client')) {
			$greeting = "Client";
			$data['scripts'][] = '/assets/scripts/client.js';
		}
		if (current_user_is('agent')) {
			$greeting = "Agent";
			$data['scripts'][] = '/assets/scripts/agent.js';
		}
		$data['title'] = "$greeting {$_SESSION['user']->user_first_name}";
		$this->load->view('includes/header.php',$data);
		$this->load->model('admin_model');
		$content = $this->admin_model->get_content($_SESSION['user']->user_role);
		$this->load->view('admin/admin_menu.php');
		$this->load->view('admin/admin_home.php', $content);
	}
?>