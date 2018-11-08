<?php
$version = '0.2';
$statut = 'BETA ! see changelog for info';

$v = time();
$title = 'Necro-Economics<br/> Idler Pro';
$isdev = filter_input(INPUT_GET, "dev", FILTER_SANITIZE_NUMBER_INT);
$message = filter_input(INPUT_GET, "message", FILTER_SANITIZE_STRING);
$reconnect = filter_input(INPUT_GET, "reconnect", FILTER_SANITIZE_STRING);
$disablereconnect = filter_input(INPUT_GET, "disablereconnect", FILTER_SANITIZE_STRING);

if ($isdev) {
    $title .= " Dev";
    $v = time();
    $devclass="dev";
}


?><!DOCTYPE html>
<html>
    <head>
        <title><?= strip_tags($title); ?></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Sci-fi Dystopian Multiplayer Incremental Capitalist Game !" />

        <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
        <link rel="stylesheet" type="text/css" href="bootstrap/bootstrap.min.css">
        <script src="bootstrap/bootstrap.min.js"></script> 
    <!--    <script src="lib/popper.min.js"></script>
        <script src="lib/tooltip.min.js"></script> -->
        <script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>
        <link rel="icon" type="image/png" href="favicon.png" />       
        <script src="js/client.js?v=<?= $v; ?>"></script>
        <link rel="stylesheet" type="text/css" href="css/style.css?v=<?= $v; ?>">
        <link rel="stylesheet" type="text/css" href="css/extra.css?v=<?= $v; ?>">
        <link rel="stylesheet" type="text/css" href="lib/balloon.css">

 <!-- <script src="https://d3js.org/d3.v5.min.js"></script> -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js"></script>


        <link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet">
    </head>
    <body class="<?= $isdev ? "dev" : ""; ?>">

        <div class="header">
            <div class="logo"><img src="/img/JID.png" alt="<?= $title; ?>" /></div>
            <div class="title"><h1><?= $title; ?></h1></div>
            <div id="console" class="<?=$devclass;?>">Necro-Economics Idler Pro is a multiplayer idle incremental game, based on true facts and anticipation of human society history and especially capitalism.<br/>
                <span class="lastupdate"><?= $statut; ?></span>
                <?= $message ? "<span class='infoupdate'>$message</span>" : ''; ?>               
            </div>             
        </div>
        <div class="row">
            
        <div  class="strategic hidden  rowshout" data-strat="shout">
            <div class="shout">
                <form class="shoutax">
                    <input type="text" id="shout" /> 
                    <button type="submit" class="shout">broadcast</button>
                </form>
            </div>
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
                    <input type="text" id="prod" placeholder="" value="steak"  maxlength="15" />
                    <input type="submit" id="submitpname" value="submit" />
                </form>
            </div>
        </div>
        <div id="satan" class="hidden">
            <div class="inner">

            </div>
            <a href="/?disablereconnect=1"><button>Quit</button></a> <button class="command" data-c="reset" data-v="1">Reset account</button>
        </div>
        <div id="game">

            <div class="row">
                <div id="company">
                    <h2>Company</h2>
                    <div id="money">
                        <p>Money : <span class="red value stat" data-p="moneydisplay"></span> €</p>
                        <p class="ajo">Overdraft charges : <span class="stat" data-p="ajo"></span> €</p>
                        <p class="reputation hidden">Reputation : <span class="value stat" data-p="reputation"></span></p>
                    </div>
                    <div id="stats" class="strategic" data-strat="accountant">
                        <h2>Accountant Data</h2>
                        <p>Daily Sales : <span class="stat" data-p="dailysales"></span> <span class="prodnamedisplay stat" data-p="product"></span>(s)</p>
                        <p>Daily Income : <span class="stat" data-p="dailybalance"></span> €</p>
                        <p>Worker Avg. : <span class="stat" data-p="workeravg" ></span> €</p>
                        <div class="regchart">
                            <canvas id="cash" ></canvas>
                        </div>
                    </div>
                    <div class="strategic" data-strat="greenwashing">
                        <h2>Greenwashing</h2>
                        <p>Children Care support : <span class="stat" data-s="ngo"></span>% / day<br/>
                           
                            <input type="range" id="ngo" value="0" min="0" max="100" />
                        </p>                        
                    </div>
                    <div class="strategic" data-strat="lawyers">
                        <h2>Lawyers</h2>
                        <p>Laywers : <span class="stat" data-s="avocats"></span>
                            <button class="comlaunch security command hcommand" data-security="avocat_next_cost" data-c="avocatbuy" data-v="1">Hire</button> Cost : <span class="stat avoca_cost" data-s="avocat_next_cost"></span>€</p>

                        </p>
                       
                    </div>

                </div>


                <div id="play">
                    <h2>Sales, year <span class="annee" ></span>, day <span class="jrestant"></span></h2>
                    <p>Unit Price : <span class="stat statprice" data-p="price">0</span> €<br/>
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
                        <p> Next : <span class="stat" data-p="nmc"></span>€</p>
                    </div>
                    <div class="strategic" data-strat="recycle">
                        <h2>Purgatory</h2>                        
                        <p>Planets destroyed : <span class="strat" data-s="worlds"></span></p>
                        
                        <p><button class="rebirthvalid" type="submit" data-c="rebirth" data-v="1">Recycle this planet</button></p>
                    </div>


                </div> 

                <div id="factory">
                    <h2>Factory<span class="strategic" data-strat="onstrike">- On Strike! -</span></h2>
                    <div id="piston" class="">
                        <div class="inner"></div>
                    </div>
                    <p>Produced : <span id="score" class="red stat" data-p="score">0</span> <span class="prodnamedisplay stat" data-p="product"></span>(s) 
                        <br/>(<span class="stat" data-p="dp"></span> per day)
                    </p>
                    <button id="make" >Make a <span class="stat" data-p="product"></span></button>
                    <div id="workers" class="strategic" data-strat="workers">
                        <p><span class="nb stat" data-p="workers"></span> <span class="workertype">worker</span>(s)
                            <button class="command hcommand" data-c="hire" data-v="1">Hire</button>
                            <button class="command hcommand" data-c="fire" data-v="1">Fire</button>
                        </p>
                        <p>Actual  : <span class="worker_cost stat" data-p="actual_worker_cost"></span> € / day<br/>
                            Next  : <span class="worker_cost stat" data-p="next_worker_cost"></span> € / day</p>
                    </div>
                    <div class="strategic" data-strat="children">
                        <p><span class="nb stat" data-p="children" data-balloon="1€ per day" data-balloon-pos="up"></span> low-cost worker(s)
                            <button class="command hcommand security" data-security="children_next_cost" data-c="hirechildren" data-v="1">Hire</button>
                            <button class="command hcommand" data-c="firechildren" data-v="1">Fire</button><br/>
                            Next migration fees <span class="stat" data-s="children_next_cost"></span> € 
                        </p>
                    </div>
                    <div class="strategic" data-strat="btc">
                        <h2>Bitcoin mining</h2>
                        <p>BTC : <span class="stat btcprod" data-p="btc"></span></p>
                        <p>Farms : <span class="stat" data-s="farm"></span> 
                            <button class="command hcommand security" data-security="farm_next_cost" data-c="buildfarm" data-v="1">+1</button> 
                            <button class="command hcommand security" data-security="farm_next_cost100" data-c="buildfarm" data-v="100">+100</button> 
                            <br/>Cost : <span class="farm_next_cost stat" data-s="farm_next_cost"></span> €
                            <span class="hidden farm_next_cost stat" data-s="farm_next_cost100"></span>
                        </p>
                        <p>Exchange : <span class="btcprice" data-balloon="coinmarketcap.com" data-balloon-pos="up"></span>€ 
                            <button class="command htmlsecurity" data-security="btcprod" data-securityvalue="0" data-c="sellbtc" data-v="1">Sell</button></p>
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
                    
                    <p>Killed : <span class="stat" data-p="killed"></span> (<span class="stat" data-s="dailykilled"></span>/day)</p>
                    <p>Humans left  : <span class="stat" data-p="humans_left"></span></p>
                    <div class="strategic" data-strat="meat">
                        <span data-balloon="Convert kills into production" data-balloon-pos="up">Soylent Green program activated</span>

                    </div>
                    <div class="strategic" data-strat="magic">
                        <h2>R&D</h2>
                        <p>Black Energy : <span class="stat" data-p="magicpower"></span></p>
                        <button class="command consume security" data-security-entity="killed" data-security="magicnextcost" data-c="consume" data-v="1">Consume</button>
                        <p>Cost : <span class="stat" data-s="magicnextcost"></span> corpses</p>
                        <div class="strategic" data-strat="autocorpse">
                            <input type="checkbox" id="autoconsume" value="1" /> auto-consume corpses
                        </div>
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


                    <table id="clients2" class="">

                    </table>
                    <div id="clientsmodele" class="hidden">
                        <table >
                            <tbody class="mp-coms-player">
                                <tr>
                                    <td class="name"><b></b></td>
                                    <td class="money"></td>
                                    <td class="score"></td>
                                    <td class="product"></td>
                                </tr>
                                <tr>
                                    <td colspan="4" class="lined mp-coms">
                                        <button class="command mp-spy" data-c="spy" data-v="" data-balloon="Gather data about this person. Beware of fake news ..." data-balloon-pos="down">spy (1&nbsp;000€)</button>
                                        <button class="command mp-defame noself" data-c="defame" data-balloon="Your reputation against his/her reputation" data-balloon-pos="down" data-v="">defame (100&nbsp;000€)</button>
                                        <button class="command mp-badbuzz noself" data-c="badbuzz" data-balloon="Lower his/her reputation" data-balloon-pos="down" data-v="">bad buzz (1.00M€)</button>
                                        <button class="command mp-strike noself" data-c="strike" data-balloon="Their worker will stop working for some time" data-balloon-pos="down" data-v="">strike (10M€)</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
                            <p><span class="field" data-f="killed"></span> <span class="field" data-f="magicpower"></span></p>
                            <p><span class="field" data-f="humans_left"></span></p>
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
        
        <div class="modal fade" id="devlog" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog" >
                <div class="modal-content">

                    <div class="modal-body">

                        <h2>About</h2>
                        <p>Charline "where's my bottle of air" Chie, Chien Games 2018</p>
                        <p></p>
                        <p><a href="https://twitter.com/ChineGames" target="_blank">Twitter</a></p>
                        <p><a href="https://charline-chie.itch.io/" target="_blank">Itch.IO</a></p>
                        <p><a href="http://chiengames.5tfu.org/" target="_blank">Chien Games</a></p>
                    </div>

                </div>
            </div>
        </div>
        
        
        <div class="modal fade" id="changelog" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog" >
                <div class="modal-content">

                    <div class="modal-body">

                        <h2>Changelog</h2>
                        <p>8.11.2018 : SSL added, new URL & fixes. New end of game with a new game++ operation. </p>
                        
                    </div>

                </div>
            </div>
        </div>

        <?php if (!$disablereconnect): ?>
            <input type="hidden" id="reconnect" value="1" />
        <?php endif; ?>
        <div id="footer">
            Charline Chie 2018 - V <?=$version; ?> - <a href="#lol" data-toggle="modal" data-target="#devlog">About this</a> - <a href="#lol" data-toggle="modal" data-target="#changelog">Changelog</a>
        </div>
        <!-- deco -->
        <div class="deco">
            <div class="corners">
                <div class="corner1"></div>  <div class="corner2"></div>  <div class="corner3"></div>  <div class="corner4"></div>
            </div>
        </div>
        
    </body>
</html>
