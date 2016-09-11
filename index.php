<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">

		<title>Code | taylortom.co.uk</title>

        <link href='http://fonts.googleapis.com/css?family=Oxygen:400,700,300|Source+Code+Pro:400,700' rel='stylesheet' type='text/css'>

        <link rel="stylesheet" href="theme.css" />

		<script type="text/javascript" src="js/libs/jquery-1.10.2.min.js"></script>
		<script type="text/javascript" src="js/main.js"></script>
	</head>
	<body>
		<style>
		body {
			font-family: 'Source Code Pro', monospace;
			background-color: black;
			color: white;
		}
		.page {
			max-width: 800px;
			margin-top: 25px;
			margin: 0 auto;
		}
		.page > .title {
			margin: 35px 0 25px 0;
			font-size: 32px;
			font-weight: bold;
		}
		.page .group {
			margin-bottom: 30px;
		}
		.page .group > .title {
			margin-bottom: 15px;
			padding: 5px;
			background-color: white;
			color: black;
			font-size: 21px;
			font-weight: bold;
		}
		.project {
			padding: 10px;
			margin-bottom: 10px;
			border: 1px solid black;
			border-radius: 3px;
		}
		.project .name {
			display: inline-block;
			width: 35%;
			padding-right: 10px;
			font-size: 18px;
			vertical-align: top;
			word-break: break-all;
		}
		.project .description {
			display: inline-block;
			padding-left: 15px;
			border-left: 2px solid white;
			max-width: 62%;
		}
		.project .description .text {
			padding-bottom: 10px;
		}
		.project a {
			display: block;
			text-decoration: none;
			padding: 3px;
			border: 2px solid white;
			border-radius: 3px;
			width: 50px;
			text-align: center;
			color: white;
			cursor: pointer;
		}
		.project a:hover {
			background-color: white;
			color: black;
		}
		.project a:focus {
			outline: none;
			background-color: white;
			color: black !important;
		}
		.footer {
			margin-bottom: 50px;
			font-size: 80%;
		}
		</style>
		<?php
		function listDir($dir) {
			$dirs = scandir($dir);
			foreach ($dirs as $key => $value) {
				if('.' !== $value && '..' !== $value) {
					$text = @file_get_contents('./' . $dir . $value . '/README.txt');
					echo '<div class="project">';
						echo '<div class="name">> ' . $value . '</div>';
						echo '<div class="description">';
							if($text) echo '<div class="text">' . $text . '</div>';
							echo '<a href="' . $dir . $value . '" target="_blank">View</a>';
						echo '</div>';
					echo '</div>';
				}
			}
		}
		?>
		<div class="page">
			<div class="title">> code.taylortom.co.uk</div>
			<div class="examples group">
				<div class="title">examples</div>
				<?php listDir('examples/'); ?>
			</div>
			<div class="tests group">
				<div class="title">sandbox</div>
				<?php listDir('tests/'); ?>
			</div>
			<div class="footer">Marginally better code available at <a href="//www.github.com/taylortom">@taylortom</a> on GitHub (no guarantees made).</div>
		</div>
	</body>
</html>
