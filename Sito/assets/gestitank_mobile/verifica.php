<!DOCTYPE html>
<html>
<head>
    <style>
        .maxwidth{max-width: 200px;}
    </style>
    <!-- Latest compiled and minified CSS -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
    <?php include 'funzioni.php' ?>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title></title>
</head>
<body>


<div class="container">

    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            <fieldset>
                <!-- Form Name -->
                <legend >Inserisci il codice fornito</legend>
                <form class="form-horizontal;border-right-style: 200;" role="form" action="/gestitank_mobile/verifica.php">
                    <div class="form-group">
                        <input type="text" class="form-control maxwidth" id="lastname"
                               placeholder="Inserisci codice" name="code">
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-default">Verifica codice</button>
                    </div>
                </form>
                <?php
                if(!isset($_GET['code'])) {
                    return;
                }
                $code=htmlspecialchars($_GET["code"]);
                if($code=='')
                    return;
                if(checkCode($code)){
                    header('Location: /gestitank_mobile/Gestitank_Mobile.apk');
                }
                else{
                    echo "<div class='alert alert-danger' role='alert'>";
                    echo "Il codice non &egrave; valido. Controlla la corretta immissione del codice.";
                    echo "</div>";
                }
                ?>
            </fieldset>
        </div>

    </div>

</div>
</body>
</html>
