<!DOCTYPE html>
<html>
<head lang="en">
    <style>
        .top-buffer { margin-top:20px; }
        .maxwidth{max-width: 200px;}
    </style>
    <meta charset="UTF-8">
    <!-- Latest compiled and minified CSS -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>

    <?php include 'funzioni.php';?>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title> Titolo</title>
</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            <form class="form-horizontal " action="genera.php" method="post">
                <fieldset>

                    <!-- Form Name -->
                    <legend >Genera codice</legend>

                    <!-- Button -->
                    <div class="control-group">
                        <label class="text-muted">Genera codice</label>

                        <div class="controls ">
                            <input type="password" class="form-control maxwidth" id="passw"
                                   placeholder="Inserisci password" name="passw">
                            <button id="btGenera" type="submit"   name="btGenera" class="btn btn-primary top-buffer" >Genera</button>
                        </div>
                    </div>


                </fieldset>
            </form>
        </div>

    </div>
    <div class="row top-buffer">
        <div class="col-md-6 col-md-offset-3">
            <div class="table-responsive">


                <div class="alert alert-success" role="alert">
                    <?php
                        if(!isset($_POST['btGenera'])) {
                            echo "Clicca il bottone \"Genera\" per generarle un codice<br>";
                            return;
                        }
                        if(!isset($_POST['passw'])){
                            echo "Clicca il bottone \"Genera\" per generarle un codice<br>";
                            return;
                        }
                        $passw=$_POST['passw'];
                        if($passw!="12345"){
                            echo "Password sbagliata <br>";
                            return;
                        }
                        $myfile = fopen("testfile.txt", "a+")or die("Unable to open file!");
                        fclose($myfile);
                        $code="";
                        do {
                            $code=generate();
                        } while (fileContains($code));
                        $myfile = fopen("testfile.txt", "a+")or die("Unable to open file!");
                        fwrite($myfile,"$code\n");
                        fclose($myfile);
                        echo "Codice $code generato.<br>";
                    ?>
                </div>

            </div>
        </div>
    </div>
</div>

</body>
</html>