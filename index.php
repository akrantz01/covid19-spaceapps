<?php
	date_default_timezone_set('America/Toronto');
?>

<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <head>
	<link rel="shortcut icon" href="Icons/Icons4.ico">
	<title>UNWISE-LOGIN.com</title>
	<script src = "js/script.js"></script>
	<link rel="stylesheet" href="css/style5.css">
	<link href="https://fonts.googleapis.com/css2?family=Chelsea+Market&display=swap" rel="stylesheet">
	<link href="/your-path-to-fontawesome/css/fontawesome.css" rel="stylesheet">
 	<link href="/your-path-to-fontawesome/css/brands.css" rel="stylesheet">
 	<link href="/your-path-to-fontawesome/css/solid.css" rel="stylesheet">
	<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">
	<link href="https://fonts.googleapis.com/css2?family=Anton&family=Staatliches&display=swap" rel="stylesheet">
    	<link href="https://fonts.googleapis.com/css2?family=Satisfy&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Acme&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Crete+Round&display=swap" rel="stylesheet">
    </head>
    <body>
	<div class=main-container>
		<a href="#"><img src="image/Astronaut.png" class="Astronaut"></a>
		<div class="ringBell">
  			<a href="#"><span class="-count">3</span></a>
			<button class='btn6' name='submit' type='submit'>POST</button> 
		</div>
		<center><h1>Hi ANONYMOUS!</h1></center>
		<center><p>It is a long established fact that a reader will be distracted by the readable content...</p></center>
		<div class="toggle-switch">
  			<input type="checkbox" id="chkTest" name="chkTest">
  			<label for="chkTest">
    				<span class="toggle-track"></span>
  			</label>
		</div>
		<?php 
			echo "<form>
				<h5>Comments</h5>
				<input type='hidden' name='uid' value='Anonymous'>
				<input type='hidden' name='date' value='".date('Y-m-d H:i:s')."'> 
				<textarea name='message'></textarea><br>
				<button class='btn5' name='submit' type='submit'>Submit</button> 
			</form>"; 
		?>
	</div>
    </body>
</html>