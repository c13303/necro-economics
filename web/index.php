<?php
$v = time();
$title = 'Jojal Idler Pro';
$unit = '€';
$isdev = filter_input(INPUT_GET, "dev",FILTER_SANITIZE_NUMBER_INT);
$message = filter_input(INPUT_GET, "message",FILTER_SANITIZE_STRING);

if($isdev){
    $title = "DEV";
    $v = time();
}
?><!DOCTYPE html>
<html>
    <head>
        <title><?= $title; ?></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>

        <script src="js/client.js?v=<?= $v; ?>"></script>
        <link rel="stylesheet" type="text/css" href="css/style.css?v=<?= $v; ?>">
       
        <link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet">
    </head>
    <body>
        
        <div class="header"><h1><?= $title; ?></h1></div>
        <div id="console">Wow, such amazing capitalist multiplayer game<br/>
            <span class="lastupdate">Last update : Marketing</span>
            <?= $message ? "<span class='infoupdate'>$message</span>" : ''; ?>
        </div>
        <div id="top">
            <form id="connect">
                <input type="text" id="username" placeholder="username" />
                <input type="password" placeholder="password" id="password" />
                <input type="submit" id="submit" value="login" />
                <div class="info">Log in or create account</div>
            </form> 
            <div id="productname">
                <form id="pname">
                    <p>What is the name of your product brand?</p>
                    <input type="text" id="prod" placeholder="" value="steak" />
                    <input type="submit" id="submitpname" value="submit" />
                </form>
            </div>
        </div>

        <div id="game">     
            <div id="company">
                <h2>Company</h2>
                <div id="money">
                    <p>Money : <span class="value stat" data-p="money"></span> <?= $unit; ?></p>
                    <p class="ajo">Overdraft charges : <span class="stat" data-p="ajo"></span> <?= $unit; ?></p>
                </div>
            </div>

            <div id="play">
                <h2>Sales, year <span class="stat" data-p="annee"></span>, day <span class="stat" data-p="jrestant"></span></h2>
                <p>Unit Price : <span class="stat" data-p="price">0</span> <?= $unit; ?>
                    <button class="command" data-c="lower" data-v="1">-</button>
                    <button class="command" data-c="raise" data-v="1">+</button>
                </p>                
                <p>Unsold : <span id="unsold" class="stat" data-p="unsold">0</span> <span class="prodnamedisplay stat" data-p="product"></span>(s) </p>
                <p>Public demand : <span id="demand" class="stat" data-p="demand">0</span> %</p>
                <div class="marketing">
                    <p>Commercials : <span class="stat" data-p="commercials"></span> <button class="command hcommand" data-min="money" data-minv="500" data-c="buy" data-v="marketing">Launch</button></p>
                    <p> Next : <span class="stat" data-p="nmc"></span><?= $unit; ?></p>
                </div>
            </div> 

            <div id="factory">
                <h2>Factory</h2>
                <p>Produced : <span id="score" class="stat" data-p="score">0</span> <span class="prodnamedisplay stat" data-p="product"></span>(s)</p>
                <button id="make" class="command" data-c="make" data-v="1">Make a <span class="stat" data-p="product"></span></button>
                <div id="workers">
                    <p><span class="nb stat" data-p="workers"></span> worker(s)
                    <button class="command hcommand" data-c="hire" data-v="1">Hire</button>
                    <button class="command hcommand" data-c="fire" data-v="1">Fire</button>
                    </p>
                    <p>Actual  : <span class="worker_cost stat" data-p="actual_worker_cost"></span> <?= $unit; ?> / day<br/>
                        Next  : <span class="worker_cost stat" data-p="next_worker_cost"></span> <?= $unit; ?> / day</p>
                </div>
            </div>
            <div id="clientsbox">
                <h2>Stock Market</h2>
                <!--<p><button class="command" data-c="refresh" data-v="1" >Refresh</button></p> -->
                <div id="clients">                    
                </div>
            </div>
            <div id="stats" class="hidden">
                <h2>Accountant Data</h2>
                <h3><span class="stat" data-p="statrange"></span>-Period</h3>
                <p>Sales  : <span class="stat" data-p="period_sales"></span></p>
                <p>Sales per day : <span class="stat" data-p="period_salesperday"></span></p>
                <p>Money per day : <span class="stat" data-p="period_moneyperday"></span> <?= $unit; ?></p>
                <h3>All time</h3>
                <p>Days of activity : <span class="stat" data-p="totalticks"></span></p>
                <p>Sales  : <span class="stat" data-p="sold"></span></p>
                <p>Sales per day : <span class="stat" data-p="salesperday"></span></p>
                <p>Money per day : <span class="stat" data-p="moneyperday"></span> <?= $unit; ?></p>
            </div>
            <div id="tools" class="hidden">
                <h2>Strategic Operations</h2>
                <div class="container">
                   <!--  <div id="buy_consulting" class="operation command" data-c="buy" data-v="consulting" >Accountant (100<?= $unit; ?>)</div>                    
                    <div id="buy_marketing" class="operation command" data-c="buy" data-v="marketing" >Marketing Departement (500<?= $unit; ?>)</div>   -->                  

                </div>
            </div>
            <div id="account">
             <button class="command" data-c="reset" data-v="1">Reset account</button>
        </div>
        </div>
        
        <?php if($isdev) $port = 8081; else $port = 8080; ?>
        <input type="hidden" id="porc" value="<?= $port; ?>" />
       <input type="hidden" id="isdev" value="<?= $isdev; ?>" />
    </body>
</html>
