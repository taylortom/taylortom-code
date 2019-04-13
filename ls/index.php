<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<link rel="shortcut icon" href="../favicon.png">

		<title>ls Code | Thomas Taylor</title>

		<script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha256-/SIrNqv8h6QGKDuNoLGA4iret+kyesCkHGzVUUV0shc=" crossorigin="anonymous"></script>
	</head>
	<body>
		<style>
		body {
			background-color: black;
			background-image: url(/bg.png);
			background-attachment: fixed;
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
		.page .group:hover {
			text-decoration: none;
		}
		.page .group > .title {
			margin-bottom: 15px;
			padding: 3px 5px;
			background-color: white;
			color: black;
			font-size: 140%;
			font-weight: bold;
		}
		.page .group > .title:hover {
			background-color: #efefef;
			padding-left: 10px;
			text-decoration: none;
			transition-property: padding-left;
			transition-duration: 0.2s;
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
		}

		.display-none {
			display: none;
		}
		</style>
		<?php
		include_once("../analyticstracking.php");

		function createGroups() {
			$dirs = scandir('./');
			foreach ($dirs as $key => $value) {
				if('.' === $value || '..' === $value || !is_dir('./'.$value)) {
					continue;
				}
				echo '<a href="./'.$value.'" class="'.$value.' group display-none"><div class="title">'.$value.'</div></a>';
			}
		}
		?>
		<div class="page">
			<div class="title"><span class="caret">>></span><span class="titletext">code.tomtaylor.name</span><div class="cursor"></div></div>
			<?php createGroups(); ?>
			<div class="footer display-none">Marginally better code available at <a href="//www.github.com/taylortom">@taylortom</a> on GitHub (no guarantees made).</div>
		</div>
	</body>
	<link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet">
	<script type="text/javascript">
		showItems();

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
			}, 100);
		}

		function showElement(el) {
			el.className = el.className.replace('display-none', '');
		}
	</script>
</html>
