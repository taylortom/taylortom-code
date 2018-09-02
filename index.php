<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<link rel="shortcut icon" href="favicon.png">

		<title>Code | Thomas Taylor</title>

		<script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha256-/SIrNqv8h6QGKDuNoLGA4iret+kyesCkHGzVUUV0shc=" crossorigin="anonymous"></script>
	</head>
	<body>
		<style>
		body {
			background-color: black;
			font-family: 'Share Tech Mono', monospace;
			font-size: 90%;
			color: white;
			margin: 0 20px;
			overflow-y: scroll;
		}
		a {
			color: white;
		}
		.page {
			max-width: 800px;
			margin: 0 auto;
		}
		.page > .title {
			margin: 35px 0 30px 0;
			font-size: 200%;
			font-weight: bold;
		}
		.page > .title > .caret {
			margin-right: 7px;
		  font-size: 80%;
		}
		.page > .title > .titletext {
			margin-right: 3px;
		}
		.page > .title > .cursor {
			display: inline-block;
			width: 10px;
		  border-bottom: 3px solid white;
		  margin-bottom: -2px;
			animation: blink 1s infinite;
		}
		@-webkit-keyframes blink {
			0%   { opacity: 1; }
	    50%  { opacity: 0; }
	    100% { opacity: 1; }
		}
		@-keyframes blink {
			0%   { opacity: 1; }
	    50%  { opacity: 0; }
	    100% { opacity: 1; }
		}

		.page .group {
			margin-bottom: 30px;
		}
		.page .group > .title {
			margin-bottom: 15px;
			padding: 5px;
			background-color: white;
			color: black;
			font-size: 140%;
			font-weight: bold;
		}
		.page .group > .description {
			padding-top: 10px;
			margin-bottom: 15px;
		}
		.project {
			display: inline-table;
			padding-top: 10px;
			margin-bottom: 10px;
			border: 1px solid black;
			border-radius: 3px;
			width: 47%;
		}
		.project.odd {
			margin-right: 30px;
		}
		.project .name {
			padding-bottom: 10px;
			padding-right: 10px;
			font-size: 130%;
			font-weight: bold;
			border-bottom: 2px solid white;
			vertical-align: top;
			word-break: break-all;
		}
		.project .description {
			display: inline-block;
			padding-top: 10px;
			padding-left: 15px;
			border-left: 2px solid white;
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
			font-size: 95%;
		}
		@media(max-width: 765px) {
			.page {
				max-width: 100%;
				margin: 20px 10px;
			}
			.page > .title {
				font-size: 19px;
			}
			.project {
				width: 100%;
			}
		}

		.display-none {
			display: none;
		}
		</style>
		<?php
		include_once("analyticstracking.php");

		function createGroups() {
			$root = "./structure/";
			$dirs = scandir($root);
			foreach ($dirs as $key => $value) {
				if('.' === $value || '..' === $value) {
					continue;
				}
				if(is_dir($root . $value)) {
					echo '<div class="' . $value . ' group display-none">';
						echo '<div class="title">' . $value . '</div>';
						listDir($root.$value.'/');
					echo '</div>';
		    }
			}
		}
		function listDir($dir) {
			$root = "/var/sites/c/code.tomtaylor.name/public_html/structure/";
			// try and load the description readme
			$desc = @file_get_contents('./' . $dir . '/README.txt');
			if($desc) {
				echo '<div class="description">' . $desc . '</div>';
			}
			$dirs = scandir($dir);
			$i = 1;
			foreach ($dirs as $key => $value) {
				if('.' === $value || '..' === $value) {
					continue;
				}
 				if(is_dir('./' . $dir . $value)) {
					$className = (($i++ % 2) === 0) ? 'even' : 'odd';
					$text = @file_get_contents('./' . $dir . $value . '/README.txt');
					echo '<div class="project display-none ' . $className . '">';
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
			<div class="title"><span class="caret">>></span><span class="titletext"></span><div class="cursor"></div></div>
			<?php createGroups(); ?>
			<div class="footer display-none">Marginally better code available at <a href="//www.github.com/taylortom">@taylortom</a> on GitHub (no guarantees made).</div>
		</div>
	</body>
	<link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet">
	<script type="text/javascript">
		function doAnimation() {
			type(function() {
				showItems();
			});
		}

		function type(done) {
			var message = "<?php echo  getenv('HTTP_HOST') ?>";
			var el = document.querySelector('.titletext');
			el.textContent = "";
			var interval = setInterval(function() {
				var textLength = el.textContent.length;
				if(textLength === message.length) {
					clearInterval(interval);
					return done();
				}
				el.textContent += message[textLength];
			}, 100);
		}

		function showItems() {
			var groups = document.querySelectorAll('.group');
			var i = 0;
			(function __showItems() {
				if(i >= groups.length) {
					showElement(document.querySelector('.footer'));
					return;
				}
				showGroup(groups[i++], __showItems);
			})();
		}

		function showGroup(group, done) {
			setTimeout(function() {
				showElement(group);
				var projects = group.querySelectorAll('.project');
				var i = 0;
				(function __showProjects() {
					if(i >= projects.length) return done();
					showProject(projects[i++], projects[i++], __showProjects);
				})();
			}, 500);
		}

		function showProject(project1, project2, done) {
			setTimeout(function() {
				if(project1) showElement(project1);
				if(project2) showElement(project2);
				done();
			}, 150);
		}

		function showElement(el) {
			el.className = el.className.replace('display-none', '');
		}
		// leave a bit of a delay before starting
		setTimeout(doAnimation, 500);
	</script>
</html>
