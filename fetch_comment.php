//I used phpmyadmin for this. 
//Databse name is testing. 
//Table name is tbl_comment

/*
   There are 5 boxes in the table (used in both storing and fetching the user info)
   1. comment_id      type: int          length/value: 11                                     extra: Auto_Increment (Remember to check the checkbox that says A.I)  
   2. comment_id      type: int          length/value: 11                                     extra: 
   3. comment_id      type: varchar      length/value: 200    collation: utf8_general_ci      extra:   
   4. comment_id      type: varchar      length/value: 40     collation: utf8_general_ci      extra:   
   5. comment_id      type: timestamp    length/value: N/A                                    extra: N/A  
*/

<?php

//fetch_comment.php

$connect = new PDO('mysql:host=localhost;dbname=testing', 'root', ''); //Goes like this: 'database path, username, password' 
                                                                       //As default there is no password so leave it blank unless you create your phpmyadmim with a password. 

$query = "
SELECT * FROM tbl_comment 
WHERE parent_comment_id = '0' 
ORDER BY comment_id DESC
";

$statement = $connect->prepare($query);

$statement->execute();

$result = $statement->fetchAll();
$output = '';
foreach($result as $row)
{
 $output .= '
 <div class="panel panel-default" style= "border-color: white;">
  <div class="panel-heading" style="border-color: white; color: white; background-color: pink;">By <b>'.$row["comment_sender_name"].'</b> on <i>'.$row["date"].'</i></div>
  <div class="panel-body" style="border-color: white; color: white; background-color: pink;">'.$row["comment"].'</div>
  <div class="panel-footer" align="right" style="border-color: white; color: white; background-color: pink;"><button type="button" class="btn btn-default reply" style="border: none; color: white; background-color: pink; outline: none;" id="'.$row["comment_id"].'">Reply</button></div>
 </div>
 ';
 $output .= get_reply_comment($connect, $row["comment_id"]);
}

echo $output;

function get_reply_comment($connect, $parent_id = 0, $marginleft = 0)
{
 $query = "
 SELECT * FROM tbl_comment WHERE parent_comment_id = '".$parent_id."'
 ";
 $output = '';
 $statement = $connect->prepare($query);
 $statement->execute();
 $result = $statement->fetchAll();
 $count = $statement->rowCount();
 if($parent_id == 0)
 {
  $marginleft = 0;
 }
 else
 {
  $marginleft = $marginleft + 48;
 }
 if($count > 0)
 {
  foreach($result as $row)
  {
   $output .= '
   <div class="panel panel-default" style="border-color: white; margin-left:'.$marginleft.'px">
    <div class="panel-heading" style="border-color: white; background-color: pink; color: white;">By <b>'.$row["comment_sender_name"].'</b> on <i>'.$row["date"].'</i></div>
    <div class="panel-body" style="border-color: white; color: white; background-color: pink;">'.$row["comment"].'</div>
    <div class="panel-footer" align="right" style="background-color: pink; border-color: white;"><button type="button" class="btn btn-default reply" id="'.$row["comment_id"].'" style="border: none; outline: none; color: white; background-color: pink;">Reply</button></div>
   </div>
   ';
   $output .= get_reply_comment($connect, $row["comment_id"], $marginleft);
  }
 }
 return $output;
}

?>
