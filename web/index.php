<?php
$v = time();
$title = 'Jojal Idler Pro';
$unit = '€';
$isdev = filter_input(INPUT_GET, "dev", FILTER_SANITIZE_NUMBER_INT);
$message = filter_input(INPUT_GET, "message", FILTER_SANITIZE_STRING);

if ($isdev) {
    $title = "Jojal Idler Pro Dev";
    $v = time();
}
?><!DOCTYPE html>
<html>
    <head>
        <title><?= $title; ?></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
        <link rel="stylesheet" type="text/css" href="bootstrap/bootstrap.min.css">
        <script src="bootstrap/bootstrap.min.js"></script>
        <script src="js/client.js?v=<?= $v; ?>"></script>
        <link rel="stylesheet" type="text/css" href="css/style.css?v=<?= $v; ?>">




        <link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet">
    </head>
    <body>

        <div class="header">
            <div class="logo"><img src="/img/JID.png" alt="<?= $title; ?>" /></div>
            <div class="title"><h1><?= $title; ?></h1></div>
            <div id="console">Wow, such amazing capitalist multiplayer game<br/>
                <span class="lastupdate">Last update : Spy & Defame</span>
                <?= $message ? "<span class='infoupdate'>$message</span>" : ''; ?>
            </div>
        </div>
        <div id="hobby_window" class="hidden">
            <div class="hobbyist command" data-c="getlob" data-v="1">
                <img src="/img/politic.png" alt="cahuzac" />
                <div class="speaker">"I may help your taxes revision ... "</div>
                <button><span class="stat" data-p="hobbyprice"></span></button>
            </div>
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
                    <p>Money : <span class="value stat" data-p="moneydisplay"></span> <?= $unit; ?></p>
                    <p class="ajo">Overdraft charges : <span class="stat" data-p="ajo"></span> <?= $unit; ?></p>
                    <p class="reputation hidden">Reputation : <span class="value stat" data-p="reputation"></span></p>
                </div>
                <div id="stats" class="strategic" data-strat="accountant">
                    <h2>Accountant Data</h2>
                    <p>Daily Sales : <span class="stat" data-p="dailysales"></span> <span class="prodnamedisplay stat" data-p="product"></span>(s)</p>
                   <!-- <p>Daily Income : <span class="stat" data-p="dailyincome"></span> <?= $unit; ?></p>
                    <p>Daily Costs : <span class="stat" data-p="dailycost"></span> <?= $unit; ?></p> -->
                    <p>Daily Income : <span class="stat" data-p="dailybalance"></span> <?= $unit; ?></p>
                   <!-- <h3><span class="stat" data-p="statrange"></span>-Period</h3>
                    <p>Daily Income : <span class="stat" data-p="period_dailyincome"></span> <?= $unit; ?></p>
                    <p>Sales : <span class="stat" data-p="period_sales"></span> <?= $unit; ?></p> -->

                    <!-- <h3>All time</h3>
                    <p>Days of activity : <span class="stat" data-p="totalticks"></span></p>
                    <p>Sales  : <span class="stat" data-p="sold"></span></p>
                    <p>Sales per day : <span class="stat" data-p="salesperday"></span></p>
                    <p>Money per day : <span class="stat" data-p="moneyperday"></span> <?= $unit; ?></p> -->
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
                <div class="marketing strategic" data-strat="marketing">
                    <p>Commercials : <span class="stat" data-p="commercials"></span> 
                        <button class="command hcommand" data-c="commercialbuy" data-v="1">Launch</button></p>
                    <p> Next : <span class="stat" data-p="nmc"></span><?= $unit; ?></p>
                </div>
            </div> 

            <div id="factory">
                <h2>Factory</h2>
                <p>Produced : <span id="score" class="stat" data-p="score">0</span> <span class="prodnamedisplay stat" data-p="product"></span>(s)</p>
                <button id="make" >Make a <span class="stat" data-p="product"></span></button>
                <div id="workers" class="strategic" data-strat="workers">
                    <p><span class="nb stat" data-p="workers"></span> worker(s)
                        <button class="command hcommand" data-c="hire" data-v="1">Hire</button>
                        <button class="command hcommand" data-c="fire" data-v="1">Fire</button>
                    </p>
                    <p>Actual  : <span class="worker_cost stat" data-p="actual_worker_cost"></span> <?= $unit; ?> / day<br/>
                        Next  : <span class="worker_cost stat" data-p="next_worker_cost"></span> <?= $unit; ?> / day</p>
                </div>
                <div class="strategic" data-strat="children">
                    <p><span class="nb stat" data-p="children"></span> low-cost worker(s)
                        <button class="command hcommand" data-c="hirechildren" data-v="1">Hire</button>
                        <button class="command hcommand" data-c="firechildren" data-v="1">Fire</button>
                    </p>
                </div>
            </div>


            <div id="tools" class="">
                <h2>Strategic Operations</h2>
                <div class="container">

                </div>
            </div>
            <div id="clientsbox">
                <h2>Stock Market</h2>
                <!--<p><button class="command" data-c="refresh" data-v="1" >Refresh</button></p> -->
                <div id="clients">                    
                </div>
            </div>
            <div id="account">
                <button class="command" data-c="reset" data-v="1">Reset account</button>
            </div>

        </div>

        <?php
        if ($isdev) {
            $port = 8081;
            ?><div class="hackcontainer">
                What : <input type="text" id="hack" /> Value : <input type="text" id="hackvalue" /><button id="hacksubmit" >hack</button>    
            </div> <?php
        } else
            $port = 8080;
        ?>
        <input type="hidden" id="porc" value="<?= $port; ?>" />
        <input type="hidden" id="isdev" value="<?= $isdev; ?>" />


        <!-- Modal -->
        <div class="modal fade" id="spymodal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog" >
                <div class="modal-content">

                    <div class="modal-body">
                        <div id="spydata">
                            <h2>Spy Report</h2>
                            <p class="field" data-f="day"></p>
                            <p class="field" data-f="name"></p>
                            <p class="field" data-f="money"></p>
                            <p class="field" data-f="product"></p>
                            <p class="field" data-f="unsold"></p>
                            <p class="field" data-f="commercials"></p>
                            <p class="field" data-f="reputation"></p>
                            <p class="field" data-f="score"></p>
                            <p class="field" data-f="workers"></p>
                            <p class="field" data-f="strats"></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </body>
</html>
