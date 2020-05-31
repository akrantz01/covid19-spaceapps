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

//add_comment.php

$connect = new PDO('mysql:host=localhost;dbname=testing', 'root', ''); //Goes like this: 'database path, username, password' 
                                                                       //As default there is no password so leave it blank unless you create your phpmyadmim with a password. 

$error = '';
$comment_name = '';
$comment_content = '';

if(empty($_POST["comment_name"]))
{
 $error .= '<p class="text-danger">Name is required</p>';
}
else
{
 $comment_name = $_POST["comment_name"];
}

if(empty($_POST["comment_content"]))
{
 $error .= '<p class="text-danger">Comment is required</p>';
}
else
{
 $comment_content = $_POST["comment_content"];
}

if($error == '')
{
 $query = "
 INSERT INTO tbl_comment 
 (parent_comment_id, comment, comment_sender_name) 
 VALUES (:parent_comment_id, :comment, :comment_sender_name)
 ";
 $statement = $connect->prepare($query);
 $statement->execute(
  array(
   ':parent_comment_id' => $_POST["comment_id"],
   ':comment'    => $comment_content,
   ':comment_sender_name' => $comment_name
  )
 );
 $error = '<label class="text-success" style="color:hotpink; margin-bottom: 20px;">Comment Added</label>';
}

$data = array(
 'error'  => $error
);

echo json_encode($data);

?>
