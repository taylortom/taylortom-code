<?php
  $data = $_POST['data'];
  $ret = file_put_contents('/var/sites/c/code.tomtaylor.name/public_html/2_portfolio-pieces/card-sort/data/'.time().'.json', $data, FILE_APPEND | LOCK_EX);
  if($ret === false) die('There was an error writing the file');
  else echo "$ret bytes written to file";
?>
