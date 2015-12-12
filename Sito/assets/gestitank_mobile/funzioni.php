<?php
        function generate() {
            $chars = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            $res = "";
            for ($i = 0; $i < 5; $i++) {
                $res .= $chars[mt_rand(0, strlen($chars)-1)];
            }
            return $res;
        }
        function connect(){
            $servername = "simonecogno.ch.mysql";
            $username = "simonecogno_ch";
            $password = "XvbbxdNh";
            $dbname = "simonecogno_ch";
            
            // Create connection
            $conn = new mysqli($servername, $username, $password,$dbname);
            
            // Check connection
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }
            return $conn;
        }
        function checkCode($code){
            if($code=="")
                return false;
            if(fileContains($code)){
                return true;
            }else{
                return false;
            }
        }
        function fileContains($code){
            $myfile = fopen("testfile.txt", "r")or die("Unable to open file!");
            while(!feof($myfile)){
                $line=fgets($myfile);
                if(strcmp($line,$code."\n")==0){
                    fclose($myfile);
                    return true;
                }
            }
            fclose($myfile);
            return false;
        }
?>