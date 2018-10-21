/* fromage server */

var mysql = require('mysql');
var biz = require('./classes/business.js');
var port = 8080;
var clients = [];

var save_freq = 120;
var save_clock = 0;
var hobby_clock = 0;
var hobby_window = false;
var hobby_price = 0;

var data_example = {
    name: '',
    score: 0,
    unsold: 0,
    product: '',
    time: 0,
    money: 0,
    workers: 0,
    price: 5,
    totalticks: 0,
    killed: 0,
    daily: {},
    strategies: {},
    tools: {},
};


var opbible = require('./classes/operations.js');
opbible.initOp();


var params = require('./params.js');
var connection = mysql.createConnection({
    host: params.host,
    user: params.user,
    password: params.password,
    database: params.database
});
connection.connect();




/* command line args */
function flush() {
    var empty = JSON.stringify(data_example);
    var flushsessionquery = "UPDATE players SET data = ? ";
    connection.query(flushsessionquery, [empty], function (err, rows, fields) {
        console.log('sessions FLUSHED!');
    });
}

process.argv.forEach(function (val, index, array) {
    if (val === '-flush') { //flush all sessions
        flush();
    }

    if (val === '-dev') { //flush all sessions
        port = 8081;
    }
});




var stdin = process.openStdin();

stdin.addListener("data", function (d) {
    var commande = d.toString().trim();
    console.log("you entered: [" +
            commande + "]");
    if (commande === 'flush') {
        flush();
    }
    if (commande === 'clients') {
        console.log(clients.length);
    }
    if (commande === 'save') {
        wss.masssave();
    }


});




console.log('Lancement serveur port ' + port + '------------------------------------------------------');









function erreur(ws, what)
{
    console.log('ERREUR ' + what);
    index = clients.indexOf(ws);
    clients.splice(index, 1);
    ws.disconnect();
}
const userRequestMap = new WeakMap();

var WebSocketServer = require('ws').Server, wss = new WebSocketServer(
        {
            port: port,
            verifyClient: function (info, callback) {     /* AUTHENTIFICATION */
                var urlinfo = info.req.url;
                const ip = info.req.connection.remoteAddress;
                urlinfo = urlinfo.replace('/', '');
                urlinfo = urlinfo.split('-');
                var name = urlinfo[1].toLowerCase().replace(/\W/g, '');
                var token = urlinfo[0].replace(/\W/g, '');

                if (urlinfo[1].toLowerCase() !== name || urlinfo[0] !== token) {
                    console.log('illegal name');
                    callback(false);
                }


                for (i = 0; i < clients.length; i++) {
                    if (clients[i].name === name) {
                        callback(false);
                    }
                }
                connection.query('SELECT id,name,password FROM players WHERE name=?', [name], function (err, rows, fields) {
                    if (rows[0] && rows[0].id) {
                        if (rows[0].password === token) {
                            userRequestMap.set(info.req, rows[0]);
                            callback(true);
                        } else {
                            console.log(name + ' rejected');
                            callback(false);
                        }
                    } else {
                        console.log('-newplayer-');
                        var data = JSON.stringify(data_example);
                        connection.query('INSERT INTO players(name,password,data) VALUES (?,?,?)', [name, token, data], function (err) {
                            if (err)
                                console.log(err);
                            else {
                                var uzar = {
                                    'name': name,
                                    'password': token,
                                    'id': 'new'
                                };
                                userRequestMap.set(info.req, uzar);
                                callback(true);
                            }
                        });

                    }
                });

            }
        }
);

wss.broadcast = function broadcast(msg) {
    console.log(msg);
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};

wss.setAllStrategyBuffer = function setAllStrategyBuffer(what, value = null) {
    console.log('All Set Buffer ' + what + ' to ' + value);
    wss.clients.forEach(function each(client) {
        client.data.strategies[what] = value;
    });
};

wss.consoleAll = function consoleAll(msg) {
    console.log('broadcast : ' + msg);
    wss.clients.forEach(function each(client) {
        client.data.console.push(msg);
    });
};

function getOneClient(name) {
    for (i = 0; i < clients.length; i++) {
        var client = clients[i];
        if (client.name === name) {
            return client;
        }
    }
}


wss.massrefresh = function broadcast(msg) {
    wss.clients.forEach(function each(client) {
        if(client.data && !client.data.end)
            client.refresh();
    });
};

wss.masssave = function masssave() {
    wss.clients.forEach(function each(client) {
        client.save();
    });
};

function info_clients() {
    var infos = [];
    for (i = 0; i < clients.length; i++) {
        if (clients[i].data.init) {
            infos.push({
                'name': clients[i].name,
                'product': clients[i].data.product,
                'score': clients[i].data.score,
                'money': clients[i].data.money
            });
        }
    }
    return(infos);
}


wss.on('connection', function myconnection(ws, request) {
    /* recognize authentified player */
    console.log('---------------');
    var userinfo = userRequestMap.get(request);
    var name = userinfo.name.replace(/\W/g, '');
    var token = userinfo.password.replace(/\W/g, '');


    var id = userinfo.id;
    console.log(name + ' connected');
    connection.query('SELECT id,name,data FROM players WHERE name=? AND password=?', [name, token], function (err, rows, fields) {
        if (err)
            console.log(err);
        try {
            var data = JSON.parse(rows[0].data);
            ws.data = data;
            ws.name = rows[0].name;
            ws.data.name = ws.name;
            ws.id = rows[0].id;
            ws.data.console = [];
            ws.data.time = Date.now();
            ws.data.tooquick = 0;
            clients.push(ws);
            /*updateshit */
            if (!ws.data.totalticks)
                ws.data.totalticks = 0;
            if (!ws.data.totalticks)
                ws.data.killed = 0;

            if (!ws.data.strategies)
                ws.data.strategies = {};
            if (!ws.data.tools)
                ws.data.tools = {};
            if (!ws.data.daily)
                ws.data.daily = {};
            /* send upgrades to clients */
            ws.send(JSON.stringify({'opbible': opbible.operations}));
            if (ws.data.product) { /* already init, just load the player */
                ws.data.init = 1;
                ws.send(JSON.stringify({'init': 1, 'user': ws.name}));
                ws.refresh();
            } else {
                /* initialisation */
                var max = biz.getSpeed(ws);
                ws.send(JSON.stringify({'chooseproduct': 1, 'updatescore': ws.data.score, 'updatemax': max}));
            }
        } catch (e) {
            console.log(e);
        }

    });


    /* refresh player own information */
    ws.refresh = function refr(istick = true) {
        try {
            if (ws.data) {
                ws.send(JSON.stringify({
                    'r': 1,
                    'product': ws.data.product,
                    'money': ws.data.money,
                    'workers': ws.data.workers,
                    //   'worker_cost': biz.getWorkerCost(ws.data.workers),
                    'next_worker_cost': biz.getNextWorkerCost(ws),
                    'actual_worker_cost': biz.getActualWorkerCost(ws),
                    'score': ws.data.score,
                    'unsold': ws.data.unsold,
                    'demand': biz.getDemand(ws),
                    'price': ws.data.price,
                    'max': biz.getSpeed(ws), //max speed
                    'daily': ws.data.daily,
                    'refresh': info_clients(),
                    'tick': istick ? tic : null,
                    'totalticks': ws.data.totalticks,
                    'console': ws.data.console,
                    'strategies': ws.data.strategies,
                    'nmc': biz.getNextMarketingCost(ws),
                    'tools': ws.data.tools,
                    'reputation': biz.getReputation(ws),
                    'dailycost': biz.getDailyCost(ws),
                    'hw': ws.data.strategies.lobby ? hobby_window : null,
                    'killed': ws.data.killed,
                    'dp': biz.getDailyProduction(ws),
                    'magicpower': ws.data.magicpower
                }));
                ws.data.console = [];
            }

        } catch (e) {
            console.log(e);
        }
    };

    ws.save = function save(callback) {
        connection.query('UPDATE players SET data=? WHERE name= ?', [JSON.stringify(ws.data), ws.name], function (err, rows, fields) {
            if (err)
                console.log(err);
            console.log(ws.name + ' data saved');
            if (callback) {
                callback();
            }

        });

    };

    ws.disconnect = function () {
        console.log(ws.name + ' disconnected');
        var index = clients.indexOf(ws);
        clients.splice(index, 1);
    };

    ws.reset = function () {
        ws.data = data_example;
        ws.save();
        ws.send(JSON.stringify({'reset': 1}));
    };

    ws.banqueroute = function () {
        ws.send(JSON.stringify({'banqueroute': 1}));
        wss.consoleAll(ws.name + ' banqueroute !!!! ');
        ws.reset();
    };

    /*read messages from the client */
    ws.on('message', function incoming(message) {
        try
        {
            console.log(ws.name + ' : '+message);
           
             var json = JSON.parse(message);
            if (json.command === 'reset') {
                ws.reset();
            }
            if (ws.data && ws.data.end) {
                return null;
            }
            
            if (json.command === 'make') {
                var now = Date.now();
                var last = ws.data.time;
                var max = biz.getSpeed(ws);
                if (now - last > max) {
                    ws.data.score++;
                    ws.data.unsold++;
                    ws.data.time = now;

                } else {
                    console.log(ws.name + ' is tooquick' + now + ' ' + last + ' ' + max);
                    ws.data.tooquick++;
                    ws.send(JSON.stringify({'tooquick': 1}));
                }
            }


            if (json.command === 'submitproduct') {
                ws.data.init = 1;
                ws.data.product = json.value;

                ws.send(JSON.stringify({'init': 1, 'user': ws.name}));
            }

            if (json.command === 'raise') {
                ws.data.price += json.value;

            }
            if (json.command === 'lower' && ws.data.price > 1) {
                ws.data.price -= json.value;
            }

            if (json.command === 'consume' && ws.data.killed >= biz.getBlackMagicNextCost(ws)) {
                ws.data.killed -= biz.getBlackMagicNextCost(ws);
                ws.data.magicpower++;

            }
            
            
            if (json.command === 'buildfarm' && ws.data.money >= (biz.getBtcFarmNextCost(ws) * json.value)) {
                ws.data.money -= biz.getBtcFarmNextCost(ws);
                ws.data.strategies.farm+= json.value;

            }
            


            if (json.command === 'spy') {
                var spydata = getOneClient(json.value);
                var op = opbible.findOp('spy');
                var cost = op.actionprice;

                if (spydata && ws.data.money > cost) {
                    ws.data.money -= cost;
                    spydata.data.reputation = biz.getReputation(spydata);
                    ws.send(JSON.stringify({'spydata': spydata.data, 'tick': tic}));
                    wss.consoleAll(ws.name + ' watches ' + spydata.name);
                } else
                    console.log('spy target not found');

            }

            if (json.command === 'defame' && !ws.data.strategies.defamecooldown && ws.data.strategies.defamation) {
                var target = getOneClient(json.value);
                var op = opbible.findOp('defamation');
                var cost = op.actionprice;
                if (target && ws.data.money >= cost) {
                    ws.data.money -= cost;
                    var steal = -1 * target.data.money * (biz.getReputation(target) / biz.defame_ratio);
                    if (steal > 0) {
                        wss.consoleAll(ws.name + ' defames ' + target.name + ' for ' + steal.toLocaleString() + '€');
                        var notice = 'You have been defamed by ' + ws.name + ' and lost ' + steal.toLocaleString() + '€';
                        target.data.console.push(notice);
                        target.send(JSON.stringify({'modal': notice}));
                        ws.send(JSON.stringify({'modal': 'You defamed ' + target.name + ' and won ' + steal.toLocaleString() + '€'}));
                    }
                    if (steal < 0) {
                        wss.consoleAll(ws.name + ' failed to defame ' + target.name + ' and must pay ' + steal.toLocaleString() + '€');
                        ws.send(JSON.stringify({'modal': 'You failed to defame ' + target.name + ' and must pay ' + steal.toLocaleString() + '€'}));
                    }
                    if (steal === 0) {
                        wss.consoleAll(ws.name + ' failed to defame ' + target.name + '');
                        ws.send(JSON.stringify({'modal': 'You failed to defame ' + target.name + ''}));
                    }
                    ws.data.money += steal;
                    ws.data.strategies.defamecooldown = biz.defamecooldown;
                    target.data.money -= steal;

                } else
                    console.log('defame target not found');

            }

            if (json.command === 'badbuzz' && !ws.data.strategies.badbuzzcooldown && ws.data.strategies.badbuzz) {
                var target = getOneClient(json.value);
                var op = opbible.findOp('badbuzz');
                var cost = op.actionprice;
                if (target && ws.data.money >= cost) {
                    ws.data.money -= cost;
                    wss.consoleAll(ws.name + ' creates a bad buzz on ' + target.name + '');
                    var notice = 'You have been victim of a bad buzz from ' + ws.name + ' ! Your product marketing is divided and you have a bad reputation for ' + biz.badbuzzduration + ' days ';
                    target.data.console.push(notice);
                    target.send(JSON.stringify({'modal': notice}));
                    target.data.strategies.badbuzzvictim = biz.badbuzzduration;
                    ws.data.strategies.badbuzzcooldown = biz.badbuzzcooldown;
                    var notice = 'You successfully created a bad buzz around ' + target.name;
                    ws.send(JSON.stringify({'modal': notice}));
                } else {
                    console.log('refused bad buzz ' + ws.data.money + ' on ' + target);
                    console.log(op);
                }
            }


            if (json.command === 'strike' && !ws.data.strategies.strikecooldown && ws.data.strategies.strike) {
                var target = getOneClient(json.value);
                var op = opbible.findOp('strike');
                var cost = op.actionprice;
                if (target && ws.data.money >= cost) {
                    ws.data.money -= cost;
                    var notice = 'Your workers are on strike !! They stop working for ' + op.duration + ' days. ' + ws.name + ' seems behind that ...';
                    target.send(JSON.stringify({'modal': notice}));
                    wss.consoleAll(ws.name + ' triggers a strike at ' + target.name + '');
                    target.data.strategies.onstrike = op.duration;
                    ws.data.strategies.strikecooldown = op.cooldown;
                    var notice = 'You successfully created a strike at ' + target.name;
                    ws.send(JSON.stringify({'modal': notice}));
                }
            }


            if (json.command === 'hire') {
                ws.data.workers++;

            }
            if (json.command === 'fire' && ws.data.workers > 0) {
                var cost = biz.getFireCost(ws.data.workers);
                ws.data.money -= cost;
                ws.data.workers--;
                ws.data.console.push('Worker fired, cost : ' + cost + '€');

            }

            if (json.command === 'hirechildren') {
                ws.data.strategies.children++;

            }
            if (json.command === 'firechildren') {
                ws.data.strategies.children--;

            }

            

            if (json.command === 'armyprog' && ws.data.strategies.army) {
                var cost = biz.getArmyProgNextCost(ws);
                if (ws.data.money >= cost) {
                    ws.data.strategies.army_p++;
                    ws.data.strategies.army++;
                    ws.data.money -= cost;
                }
            }


            if (json.command === 'hack' && port === 8081) {
                console.log('HACK ' + json.what + ' : ' + json.value);
                ws.data[json.what] = json.value;

            }

            if (json.command === 'getlob' && hobby_window && ws.data.strategies.lobby) {
                hobby_window = false;
                console.log(ws.name + ' uses a lobbyist !!');
                wss.consoleAll(ws.name + ' catches the Tax Dodge ! Income x ' + biz.lobby_multiplicator);
                ws.data.money -= hobby_price;
                ws.data.strategies.tax_dogde = 2;

            }


            /* buy INIT operation */
            if (json.command === 'buy') {
                var op = opbible.findOp(json.value);
                if (ws.data[op.min] >= op.minv) { // requirements
                    var cost = op.price;
                    ws.data[op.price_entity] -= cost;
                    ws.data.strategies[op.name] = 1;
                    /*ws.data.console.push(op.title + ' acquired : ' + cost + '€');*/
                    wss.consoleAll(ws.name + ' acquired ' + op.title + ' for ' + cost.toLocaleString() + '€');
                }

            }



            if (json.command === 'commercialbuy') {
                var op = opbible.findOp('marketing');
                var cost = biz.getNextMarketingCost(ws);
                ws.data.money -= cost;
                ws.data.strategies.marketing++;

            }

            if (json.command) {
                ws.refresh(false);
            }


        } catch (e)
        {
            console.log('invalid json : ');
            console.log(e);

        }
    });







    ws.on('close', function (message) {
        var data = JSON.stringify(ws.data);
        ws.save(ws.disconnect);

    });
});


/* tick operations */
var tic = 0;


function tick() {
    tic++;

    for (i = 0; i < clients.length; i++) {
        /* cb de vendus */

        if (clients[i].data.init && clients[i].data.end) {
            console.log('ending ' + clients[i].name);
            var end = {};
            
            end.txt = "Magic power has been given to the hole. You consumed everything on earth for cash.<br/>";
          
            try {
                clients[i].send(JSON.stringify({'endoftimes': end,"data" : clients[i].data}));
            } catch (e) {
                console.log(e);
            }
        }

        if (clients[i].data.init && !clients[i].data.end) {


            if (isNaN(clients[i].data.score)) {
                console.log('ERRRREUUUR SCORE ');
                clients[i].data.score = 0;
            }

            /*workers*/

            var produced = biz.getDailyProduction(clients[i]);
            var cost = biz.getActualWorkerCost(clients[i]);

            if (isNaN(produced)) {
                console.log('ERRRREUUUR PRODUCTION');
                console.log(produced);
            }

            clients[i].data.score += produced;
            clients[i].data.unsold += produced;
            clients[i].data.money -= cost;



            /* sales */
            /*
             * Marketing 0
             * 
             * 10% = 1 chance sur 10 de vendre 1 steak
             * 100% = 1 steak par jour
             * 
             * 
             * 
             */
            var sale = biz.getIncome(clients[i]);
            clients[i].data.unsold = sale.unsold;
            clients[i].data.money += sale.income;
            clients[i].data.daily = {'income': sale.income, 'sales': sale.vendus};

            /* agios */
            clients[i].data.tools.ajo = 0;
            if (clients[i].data.money < 0) {
                var ajo = Math.ceil(clients[i].data.money * biz.ajo * -1);
                clients[i].data.money -= ajo;
                clients[i].data.tools.ajo = ajo;
            }
            if (clients[i].data.money < biz.banqueroute) {
                clients[i].banqueroute();
            }


            /* hobbying */
            hobby_clock++;
            if (hobby_clock === biz.hobby_freq) {
                wss.setAllStrategyBuffer('tax_dogde', null);
                hobby_price = biz.getRandomInt(10000) + biz.hobbybribemin;
                hobby_window = {'hw': true, 'price': hobby_price};
                console.log('hobby win open at ' + hobby_price);
            }
            if (hobby_clock >= (biz.hobby_freq + biz.hobby_window)) {
                hobby_window = false;
                hobby_clock = 0;
                console.log('hobby win close');
            }

            /* cooldowns */
            if (clients[i].data.strategies.defamecooldown > 0) {
                clients[i].data.strategies.defamecooldown--;
            }

            /* black magic */
            if (clients[i].data.strategies.magic) {
                if (!clients[i].data.magicpower)
                    clients[i].data.magicpower = 0;

                clients[i].data.strategies.magicnextcost = biz.getBlackMagicNextCost(clients[i]);

            }
            
            /* btc */
            if(clients[i].data.strategies.btc){
                if(!clients[i].data.strategies.farm) clients[i].data.strategies.farm = 0;
                var prod = biz.getBtcProd(clients[i]);
                clients[i].data.strategies.btcprod += prod.prod;
                clients[i].data.strategies.warm = prod.warm;
                clients[i].data.strategies.farm_next_cost = biz.getBtcFarmNextCost(clients[i]);
                clients[i].data.strategies.farm_next_cost100 = biz.getBtcFarmNextCost(clients[i]) * 100;
            }
            
            
            

            /* army */
            if (clients[i].data.strategies.army) {
                if (!clients[i].data.killed) {
                    clients[i].data.killed = 0;
                }
                if (!clients[i].data.strategies.army_p) {
                    clients[i].data.strategies.army_p = 0;
                }
                clients[i].data.strategies.army_p_nc = biz.getArmyProgNextCost(clients[i]);
                clients[i].data.killed += biz.getKilled(clients[i]);
            }

            /* bad buzz */
            if (clients[i].data.strategies.badbuzzcooldown && clients[i].data.strategies.badbuzzcooldown > 0) {
                clients[i].data.strategies.badbuzzcooldown--;
            }
            if (clients[i].data.strategies.badbuzzvictim && clients[i].data.strategies.badbuzzvictim > 0) {
                clients[i].data.strategies.badbuzzvictim--;
            }


            /*strike */
            if (clients[i].data.strategies.strikecooldown && clients[i].data.strategies.strikecooldown > 0) {
                clients[i].data.strategies.strikecooldown--;
            }
            if (clients[i].data.strategies.onstrike && clients[i].data.strategies.onstrike > 0) {
                clients[i].data.strategies.onstrike--;
            }

            /* end */

            if (clients[i].data.strategies.hole) {
                clients[i].data.end = true;
                clients[i].save();
            }


        } else {
            // console.log(clients[i].name + ' : not init');

        }




    }
    wss.massrefresh();
    save_clock++;
    if (save_clock === save_freq) {
        console.log('mass save');
        wss.masssave();
        save_clock = 0;
    }

    var mytick = setTimeout(function () {
        tick();

    }, biz.tickrate);
}
tick();

