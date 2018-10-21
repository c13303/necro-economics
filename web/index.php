<?php
$statut = 'Last update : V0.1 - BTC mining & global warming';

$v = time();
$title = 'Necro-Economics<br/> Idler Pro';
$unit = '€';
$isdev = filter_input(INPUT_GET, "dev", FILTER_SANITIZE_NUMBER_INT);
$message = filter_input(INPUT_GET, "message", FILTER_SANITIZE_STRING);
$reconnect = filter_input(INPUT_GET, "reconnect", FILTER_SANITIZE_STRING);
$disablereconnect = filter_input(INPUT_GET, "disablereconnect", FILTER_SANITIZE_STRING);

if ($isdev) {
    $title .= " Dev";
    $v = time();
}
?><!DOCTYPE html>
<html>
    <head>
        <title><?= strip_tags($title); ?></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
        <link rel="stylesheet" type="text/css" href="bootstrap/bootstrap.min.css">
        <script src="bootstrap/bootstrap.min.js"></script>       
        <script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>
        <link rel="icon" type="image/png" href="favicon.png" />       
        <script src="js/client.js?v=<?= $v; ?>"></script>
        <link rel="stylesheet" type="text/css" href="css/style.css?v=<?= $v; ?>">
        <link rel="stylesheet" type="text/css" href="css/extra.css?v=<?= $v; ?>">

 <!-- <script src="https://d3js.org/d3.v5.min.js"></script> -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js"></script>


        <link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet">
    </head>
    <body class="<?= $isdev ? "dev" : ""; ?>">

        <div class="header">
            <div class="logo"><img src="/img/JID.png" alt="<?= $title; ?>" /></div>
            <div class="title"><h1><?= $title; ?></h1></div>
            <div id="console">Wow, such amazing capitalist multiplayer game<br/>
                <span class="lastupdate"><?= $statut; ?></span>
                <?= $message ? "<span class='infoupdate'>$message</span>" : ''; ?>
            </div>
        </div>
        <div id="hobby_window" class="hidden">
            <div class="hobbyist" >
                <img src="/img/parly.png" alt="cahuzac" />
                <div class="speaker">"Wanna dodge taxes ?"</div>
                <button class="command security" data-nostratsecurity="lobbyprice" data-c="getlob" data-v="1"><span class="stat" data-p="hobbyprice"></span></button>
            </div>
        </div>

        <div id="top">
            <form id="connect">
                <input type="text" id="username" placeholder="username" />
                <input type="password" placeholder="password" id="password" />
                <input type="submit" id="submit" value="login" />
                <div class="info">Log in or create account</div>

            </form> 
            <div class="autoreconnect hidden">Automatic reconnexion in progress ....</div>
            <div id="productname">
                <form id="pname">
                    <p>What is the name of your product brand?</p>
                    <input type="text" id="prod" placeholder="" value="steak" />
                    <input type="submit" id="submitpname" value="submit" />
                </form>
            </div>
        </div>
        <div id="satan" class="hidden">

        </div>
        <div id="game">

            <div class="row">
                <div id="company">
                    <h2>Company</h2>
                    <div id="money">
                        <p>Money : <span class="red value stat" data-p="moneydisplay"></span> <?= $unit; ?></p>
                        <p class="ajo">Overdraft charges : <span class="stat" data-p="ajo"></span> <?= $unit; ?></p>
                        <p class="reputation hidden">Reputation : <span class="value stat" data-p="reputation"></span></p>
                    </div>
                    <div id="stats" class="strategic" data-strat="accountant">
                        <h2>Accountant Data</h2>
                        <p>Daily Sales : <span class="stat" data-p="dailysales"></span> <span class="prodnamedisplay stat" data-p="product"></span>(s)</p>
                        <p>Daily Income : <span class="stat" data-p="dailybalance"></span> <?= $unit; ?></p>
                        <p>Worker Avg. : <span class="stat" data-p="workeravg"></span> <?= $unit; ?></p>
                         <div class="regchart">
                            <canvas id="cash" ></canvas>
                         </div>

                    </div>

                </div>

                <div id="play">
                    <h2>Sales, year <span class="stat" data-p="annee"></span>, day <span class="stat" data-p="jrestant"></span></h2>
                    <p>Unit Price : <span class="stat statprice" data-p="price">0</span> <?= $unit; ?><br/>
                        <button class="command" data-c="lower" data-v="0.1">-0,1</button>
                        <button class="command" data-c="raise" data-v="0.1">+0,1</button>
                        <button class="command" data-c="lower" data-v="1">-1</button>
                        <button class="command" data-c="raise" data-v="1">+1</button>
                    </p>                
                    <p>Unsold : <span id="unsold" class="stat" data-p="unsold">0</span> <span class="prodnamedisplay stat" data-p="product"></span>(s) </p>
                    <p>Public demand : <span id="demand" class="stat" data-p="demand">0</span> %</p>
                    <div class="marketing strategic" data-strat="marketing">
                        <p>Commercials : <span class="stat" data-p="commercials"></span> 
                            <button class="comlaunch security command hcommand" data-nostratsecurity="nmc" data-c="commercialbuy" data-v="1">Launch</button></p>
                        <p> Next : <span class="stat" data-p="nmc"></span><?= $unit; ?></p>
                    </div>
                    
                </div> 

                <div id="factory">
                    <h2>Factory<span class="strategic" data-strat="onstrike">- On Strike! -</span></h2>
                    <p>Produced : <span id="score" class="red stat" data-p="score">0</span> <span class="prodnamedisplay stat" data-p="product"></span>(s) 
                        <br/>(<span class="stat" data-p="dp"></span> per day)
                    </p>
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
                    <div class="strategic" data-strat="btc">
                        <h2>Bitcoin mining</h2>
                        <p>BTC : <span class="stat" data-s="btcprod"></span></p>
                        <p>Farms : <span class="stat" data-s="farm"></span> 
                            <button class="command hcommand security" data-security="farm_next_cost" data-c="buildfarm" data-v="1">+1</button> 
                            <button class="command hcommand security" data-security="farm_next_cost100" data-c="buildfarm" data-v="100">+100</button> 
                        <br/>Cost : <span class="farm_next_cost stat" data-s="farm_next_cost"></span> €
                        <span class="hidden farm_next_cost stat" data-s="farm_next_cost100"></span>
                        </p>
                        <div class="warming">
                            <span class="stat" data-s="warm"></span>°C
                        </div>
                    </div>
                    
                </div>
                <div id="international" class="strategic" data-strat="army">
                    <h2>International Operations</h2>
                    <p>Army Partnership Programs : <span class="stat" data-s="army_p"></span><br/>
                        Next Cost : <span class="stat" data-s="army_p_nc"></span> € 
                        <button class="command security" data-security="army_p_nc" data-c="armyprog" data-v="1">Launch</button></p>               
                    <p>Killed : <span class="stat" data-p="killed"></span></p>
                    <div class="strategic" data-strat="magic">
                        <h2>R&D</h2>
                        <p>Black Energy : <span class="stat" data-p="magicpower"></span></p>
                        <button class="command consume security" data-security-entity="killed" data-security="magicnextcost" data-c="consume" data-v="1">Consume</button>
                        <p>Cost : <span class="stat" data-s="magicnextcost"></span> corpses</p>
                    </div>

                </div>


            </div>
            <div class="row">
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
                    <div id="multivizu" class="">
                        <canvas id="multi" ></canvas>
                    </div>
                    
                </div>
               
            </div>
            <div class="row" >
                 
            </div>
            
            
            
            
            
            <div id="account">
                <button class="command" data-c="reset" data-v="1">Reset account</button>
            </div>

        </div>

        <?php
        if ($isdev) {
            $port = 8081;
            ?><div class="hackcontainer">
                What : <input type="text" id="hack" value="money" /> Value : <input type="text" id="hackvalue" value="100000000" />
                <button id="hacksubmit" >hack</button>    
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
                            <p><span class="field" data-f="name"></span> <span class="field" data-f="reputation"></span></p>
                            <p><span class="field" data-f="money"></span> <span class="field" data-f="income"></span></p>
                            <p><span class="field" data-f="product"></span> <span class="field" data-f="price"></span></p>
                            <p><span class="field" data-f="unsold"></span> <span class="field" data-f="score"></span></p>

                            <p class="field" data-f="strats"></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div class="modal fade" id="infomodal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog" >
                <div class="modal-content">

                    <div class="modal-body">

                        <h2>Breaking News</h2>
                        <div id="infomodal_content">
                        </div>
                    </div>

                </div>
            </div>
        </div>  

        <?php if (!$disablereconnect): ?>
            <input type="hidden" id="reconnect" value="1" />
        <?php endif; ?>
        <div class="footer" style="float: right;">
            <a href="https://twitter.com/ChineGames" target="_blank">2018 Charline Chie</a>
        </div>
    </body>
</html>
