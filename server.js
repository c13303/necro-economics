/* fromage server */
var params = require('./params.js');

var httpsenabled = true;
var port = 8080;

dev = false;
process.argv.forEach(function (val, index, array) {
    if (val === '-flush') { //flush all sessions
        flush();
    }

    if (val === '-dev') { //flush all sessions
        dev = true;
        port = 8081;
    }
});
var express = require('express');
var app = express();

var fs = require('fs');


if (httpsenabled) {
    const https = require("https");
    const options = {
        key: fs.readFileSync(params.key),
        cert: fs.readFileSync(params.cert)
    };
    var credentials = { key: options.key, cert: options.cert };

    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(port);
} else {
    http = require('http');
    var httpsServer = http.createServer();
    httpsServer.listen(port);
}



var realBTC = true;

if (realBTC) {
    var CoinMarketCap = require("node-coinmarketcap");
    var coinmarketcap = new CoinMarketCap();
}

var BTCprice = 0;


var mysql = require('mysql');
var biz = require('./classes/business.js');



var save_freq = 120;
var save_clock = 0;
var hobby_clock = 0;
var hobby_window = false;
var hobby_price = 0;


var rand_news = {};
rand_news.tick = 0;
rand_news.triggerTick = 1800;
rand_news.stock = [];
rand_news.stock.push('Selling bottled air is definitely a legitimate business. It will be the next bottled water.');


rand_news.check = function () {
    try {
        if (this.tick >= this.triggerTick) {
            var n = biz.getRandomInt(this.stock.length);
            var daNew = this.stock[n];
            if (daNew)
                wss.consoleAll('<b class="news">' + daNew + '</b>');
            this.tick = 0;
        } else {
            this.tick++;
        }
    } catch (e) {
        report('catch error in rand_news');
        report(e);
    }

};


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
    humans_left: biz.maxHumans,
    btc: 0,
    daily: {},
    strategies: {
        worlds: 0,
        shout: 0,
    },
    tools: {},
};


var opbible = require('./classes/operations.js');
opbible.initOp();


var connection;


function handleDisconnect() {
    connection = mysql.createConnection({
        host: params.host,
        user: params.user,
        password: params.password,
        database: params.database
    });

    connection.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}


handleDisconnect();
















var sha256 = require('js-sha256');
var Filter = require('bad-words');
var myFilter = new Filter({ placeHolder: 'x' });


/* command line args */
function flush() {
    var empty = JSON.stringify(data_example);
    var flushsessionquery = "UPDATE players SET data = ? ";
    connection.query(flushsessionquery, [empty], function (err, rows, fields) {
        report('sessions FLUSHED!');
    });
}



function quit() {
    process.exit();
}


var stdin = process.openStdin();

stdin.addListener("data", function (d) {
    try {
        if (!d || d === 'undefined') {
            return null;
        }
        var commande = d.toString().trim();
        var com = commande.split(":");
        var commande = com[0];
        var arg = com[1];
        var arg2 = com[2];
        var arg3 = com[3];


        console.log("command received: [" +
            commande + "]");
        if (arg) {
            console.log("arg : [" + arg + ']');
        }

        if (commande === 'flush') {
            flush();
        }
        if (commande === 'clients') {
            wss.clients.forEach(function each(client) {
                if (client.data)
                    console.log(client.data.name + ":" + client.data.init);
                else {
                    console.log('unknown client!');
                }
            });
        }

        if (commande === 'data' && arg) {
            wss.clients.forEach(function each(client) {
                if (client.data && client.name === arg)
                    console.log(client.data);
            });
        }

        if (commande === 'setstrat' && arg && arg2 && arg3) {
            wss.clients.forEach(function each(client) {
                if (client.data && client.name === arg) {
                    client.data.strategies[arg2] = arg3;
                    console.log(arg + ' strat ' + arg2 + ' set to ' + arg3);
                }
            });
        }

        if (commande === 'save') {
            wss.masssave();
        }

        if (commande === 'say' && arg) {
            wss.consoleAll('<b>@server : ' + arg + '</b>');
        }

        if (commande === 'lobby') {
            hobby_clock = biz.hobby_freq - 1;
        }

        if (commande === 'quit') {
            wss.masssave(quit);
        }

        if (commande === 'terminate') {
            console.log('terminating ' + arg);
            wss.clients.forEach(function each(client) {
                if (client.data && client.name === arg) {
                    client.terminate();
                }
            });
        }

    } catch (e) {
        report('catch error in console command');
        report(e);
    }

});




report('Lancement serveur port ' + port + '------------------------------------------------------');







function report(e) {
    var currentdate = new Date();
    var day = currentdate.getDate() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getFullYear();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    var note = datetime + ' : ' + e;
    try {
        var version = port === 8080 ? 'prod' : 'dev';
        fs.appendFile("/home/charles/idler_pro/logs/log_" + version + "_" + day + ".log", note + "\n", function (err) {
            if (err) {
                console.log(err);
            }
            console.log(note);
        });
    } catch (er) {
        console.log(er);
    }
}

function erreur(ws, what) {
    try {
        report('ERREUR : ' + ws.name + ':' + what);

        ws.terminate();

    } catch (e) {
        report('catch error in erreur()');
        report(e);
    }

}
const userRequestMap = new WeakMap();
try {
    var WebSocketServer = require('ws').Server, wss = new WebSocketServer(
        {
            server: httpsServer,
            verifyClient: function (info, callback) {     /* AUTHENTIFICATION */

                if (!info || !info.req || !info.req.url) {
                    return null;
                }

                var urlinfo = info.req.url;



                const ip = info.req.connection.remoteAddress;
                urlinfo = urlinfo.replace('/', '');
                urlinfo = urlinfo.split('-');

                if (!Array.isArray(urlinfo)) {
                    callback(false);
                }

                var regex = /^([a-zA-Z0-9_-]+)$/;

                var name = urlinfo[1].toLowerCase();
                var token = urlinfo[0];

                if (name !== myFilter.clean(name)) {
                    callback(false);
                }

                if (!regex.test(name)) {
                    callback(false);
                }

                if (!regex.test(token)) {
                    callback(false);
                }

                if (!name || !token || !urlinfo[1] || !urlinfo[0]) {
                    callback(false);
                }

                if (urlinfo[1].toLowerCase() !== name || urlinfo[0] !== token) {
                    report('illegal name');
                    callback(false);
                }


                wss.clients.forEach(function each(client) {
                    if (client.name === name) {
                        callback(false);
                    }
                });

                var token = sha256(token);

                connection.query('SELECT id,name,password FROM players WHERE name=?', [name], function (err, rows, fields) {
                    if (rows[0] && rows[0].id) {
                        if (rows[0].password === token) {
                            userRequestMap.set(info.req, rows[0]);
                            callback(true);
                        } else {
                            report(name + ' rejected');
                            callback(false);
                        }
                    } else {
                        var dataclone = JSON.parse(JSON.stringify(data_example));
                        var data = JSON.stringify(dataclone);
                        connection.query('INSERT INTO players(name,password,data) VALUES (?,?,?)', [name, token, data], function (err) {
                            if (err)
                                report(err);
                            else {
                                report(' - New PLayer Creation : ' + name);
                                var uzar = {
                                    'name': name,
                                    'password': token,
                                    'id': 'new'
                                };
                                userRequestMap.set(info.req, uzar);
                                console.log(data_example);
                                console.log(data);
                                callback(true);
                            }
                        });

                    }
                });

            }
        }
    );
} catch (e) {
    report('catch error in log in player');
    report(e);
}

wss.broadcast = function broadcast(msg) {
    try {
        wss.clients.forEach(function each(client) {
            client.send(msg);
        });
    } catch (e) {
        report('catch error in broadcast');
        report(e);
    }
};

wss.setAllStrategyBuffer = function setAllStrategyBuffer(what, value = null) {
    try {
        wss.clients.forEach(function each(client) {
            client.data.strategies[what] = value;
        });
    } catch (e) {
        report('catch error in setAllStrategyBuffer');
        report(e);
    }
};

wss.consoleAll = function consoleAll(msg) {
    // report('broadcast : ' + msg);
    try {
        wss.clients.forEach(function each(client) {
            client.data.console.push(msg);
        });
    } catch (e) {
        report('catch error in consoleAll');

        report(e);
    }
};

function getOneClient(name) {
    var clientFound = null;
    wss.clients.forEach(function each(client) {
        if (client.name.toString() === name.toString()) {
            clientFound = client;
            return client;
        }
    });
    return clientFound;
}


wss.massrefresh = function broadcast(msg) {
    wss.clients.forEach(function each(client) {
        if (client.data && !client.data.end)
            client.refresh();
    });
};

wss.masssave = function masssave(callback = null) {
    var itemsProcessed = 0;
    wss.clients.forEach(function each(client) {
        itemsProcessed++;
        client.save();
        if (itemsProcessed === wss.clients.size && callback) {
            setTimeout(callback, 100);
        }
    });
};

function info_clients() {
    var infos = [];
    wss.clients.forEach(function each(client) {
        if (client.data && client.data.init && !client.data.end) {
            infos.push({
                'name': client.name,
                'product': client.data.product,
                'score': client.data.score,
                'money': client.data.money,
                'worlds': (client.data.strategies && client.data.strategies.worlds) ? client.data.strategies.worlds : 0,
            });
        }
    });
    return (infos);
}


wss.on('connection', function myconnection(ws, request) {
    /* recognize authentified player */

    var userinfo = userRequestMap.get(request);
    var name = userinfo.name.replace(/\W/g, '');
    var token = userinfo.password.replace(/\W/g, '');


    var id = userinfo.id;
    report(name + ' connected');
    connection.query('SELECT id,name,data FROM players WHERE name=? AND password=?', [name, token], function (err, rows, fields) {
        if (err)
            report(err);
        try {
            var data = JSON.parse(rows[0].data);
            ws.data = data;
            ws.name = rows[0].name;
            ws.data.name = ws.name;
            ws.id = rows[0].id;
            ws.data.console = [];
            ws.data.time = Date.now();
            ws.data.tooquick = 0;
            /*updateshit */
            if (!ws.data.totalticks)
                ws.data.totalticks = 0;
            if (!ws.data.totalticks)
                ws.data.killed = 0;
            if (!ws.data.btc)
                ws.data.btc = 0;

            if (!ws.data.strategies)
                ws.data.strategies = {};
            if (!ws.data.tools)
                ws.data.tools = {};
            if (!ws.data.daily)
                ws.data.daily = {};
            /* send upgrades to clients */
            ws.send(JSON.stringify({ 'opbible': opbible.operations }));


            if (ws.data.product) { /* already init, just load the player */
                ws.data.init = 1;
                ws.send(JSON.stringify({
                    'init': 1,
                    'user': ws.name,
                    'btcprice': BTCprice
                }));
                ws.refresh(false);
            } else {
                /* initialisation */
                var max = biz.getSpeed(ws);
                ws.send(JSON.stringify({ 'chooseproduct': 1, 'updatescore': ws.data.score, 'updatemax': max }));
            }
        } catch (e) {
            report('catch error in connection query');
            report(e);
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
                    'hw': (ws.data.strategies.lobby && !ws.data.strategies.lobbycooldown) ? hobby_window : null,
                    'killed': ws.data.killed,
                    'dp': biz.getDailyProduction(ws),
                    'magicpower': ws.data.magicpower ? ws.data.magicpower : 0,
                    'btc': ws.data.btc ? ws.data.btc : 0,
                    'ct': ws.data.strategies.autocorpse ? 1 : 0,
                    'humans_left': biz.humans_on_earth
                }));
                ws.data.console = [];
            }

        } catch (e) {

            report('ghost client removed ' + ws.name);
            ws.terminate();
            report(e);
        }
    };

    ws.save = function save(callback) {
        try {
            connection.query('UPDATE players SET data=? WHERE name= ?', [JSON.stringify(ws.data), ws.name], function (err, rows, fields) {
                if (err)
                    report(err);
                if (callback) {
                    callback();
                }

            });
        } catch (e) {
            report('catch error in save');
            report(e);
        }

    };

    ws.notice = function notice(n) {
        ws.send(JSON.stringify({ 'modal': n }));
    };

    ws.reset = function () {
        try {
            ws.data = JSON.parse(JSON.stringify(data_example));
            ws.save();
            ws.send(JSON.stringify({ 'reset': 1 }));
        } catch (e) {
            report('catch error in reset');
            report(e);
        }
    };

    ws.banqueroute = function () {

        ws.send(JSON.stringify({ 'banqueroute': 1 }));
        wss.consoleAll(ws.name + ' banqueroute !!!! ');
        ws.reset();
        ws.terminate();

    };

    /*read messages from the client */
    ws.on('message', function incoming(message) {
        try {
            var now = Date.now();
            var last = ws.data.time;
            if (dev)
                console.log(ws.name + ' : ' + message);

            var json = JSON.parse(message);
            if (json.command === 'reset') {
                ws.reset();
            }
            if (ws.data && ws.data.end) {
                return null;
            }

            if (json.command === 'make') {

                var max = biz.getSpeed(ws);
                if (now - last > max) {
                    ws.data.score++;
                    ws.data.unsold++;
                    ws.data.time = now;

                } else {
                    //report(ws.name + ' is tooquick' + now + ' ' + last + ' ' + max);
                    ws.data.tooquick++;
                    ws.send(JSON.stringify({ 'tooquick': 1 }));
                }
            }

            if (json.command === 'shout' && ws.data.strategies.shout) {
                var say = json.value.replace(/<.*?>/g, '');
                wss.consoleAll(ws.name + ' : <b>' + say + '</b>');
                report(ws.name + ' : ' + say);
            }


            if (json.command === 'submitproduct') {
                ws.data.init = 1;
                ws.data.product = myFilter.clean(json.value);

                ws.send(JSON.stringify({ 'init': 1, 'user': ws.name }));
            }

            if (json.command === 'ngo') {
                ws.data.strategies.ngo = json.value;
                if (ws.data.strategies.ngo < 0) {
                    ws.data.strategies.ngo = 0;
                }
                if (ws.data.strategies.ngo > 100) {
                    ws.data.strategies.ngo = 100;
                }
            }

            if (json.command === 'raise') {
                ws.data.price += json.value;
            }
            if (json.command === 'lower' && ws.data.price > json.value && ws.data.price > 0.01) {
                ws.data.price -= json.value;
            }

            if (json.command === 'consume' && ws.data.killed >= biz.getBlackMagicNextCost(ws)) {
                ws.data.killed -= biz.getBlackMagicNextCost(ws);
                ws.data.magicpower++;

            }


            if (json.command === 'buildfarm' && ws.data.money >= (biz.getBtcFarmNextCost(ws) * json.value)) {
                ws.data.money -= biz.getBtcFarmNextCost(ws);
                ws.data.strategies.farm += json.value;

            }

            if (json.command === 'sellbtc' && ws.data.btc > 0) {
                var amount = ws.data.btc * BTCprice;
                wss.consoleAll(ws.name + ' sold ' + biz.fnum(ws.data.btc) + ' BTC for ' + biz.fnum(amount) + '€');
                ws.data.money += amount;
                ws.data.btc = 0;
            }



            if (json.command === 'spy' && json.value) {
                var spydata = getOneClient(json.value);
                var op = opbible.findOp('spy');
                var cost = op.actionprice;
                if (ws.data.money > cost) {
                    if (spydata) {
                        ws.data.money -= cost;
                        spydata.data.reputation = biz.getReputation(spydata);
                        ws.send(JSON.stringify({ 'spydata': spydata.data, 'tick': tic }));
                        wss.consoleAll(ws.name + ' watches ' + spydata.name);
                    } else {
                        report(ws.name + ' : spy target not found ' + json.value);

                    }
                }
            }

            if (json.command === 'defame' && !ws.data.strategies.defamecooldown && ws.data.strategies.defamation) {
                var target = getOneClient(json.value);
                var op = opbible.findOp('defamation');
                var cost = op.actionprice;

                if (target && ws.data.money >= cost && !ws.data.strategies.defamecooldown) {

                    if (target.data.strategies.lawyers && target.data.strategies.avocats > 0) {
                        target.data.strategies.avocats--;
                        ws.send(JSON.stringify({ 'modal': 'You tried to defame ' + target.name + ' but it had a good lawyer and youve been sued.' }));
                        wss.consoleAll(ws.name + ' failed to defame ' + target.name + ' because it had a good lawyer ');
                        target.send(JSON.stringify({ 'modal': ws.name + ' failed to defame you thanks to your lawyer. The lawyer is now retired.' }));
                    } else {

                        var reputDiff = biz.getReputation(ws) - biz.getReputation(target);
                        var ratio = parseInt((reputDiff / biz.defame_ratio));

                        if (ratio > 0.9) {
                            ratio = 0.9;
                        }
                        var steal = 0;
                        if (reputDiff > 0) {
                            var steal = target.data.money * ratio;
                            wss.consoleAll(ws.name + ' defames ' + target.name + '(' + reputDiff + ' rep. pts.) for ' + steal.toLocaleString() + '€');
                            var notice = 'You have been defamed by ' + ws.name + '(' + reputDiff + ' rep. pts.) and lost ' + steal.toLocaleString() + '€';
                            target.data.console.push(notice);
                            target.send(JSON.stringify({ 'modal': notice }));
                            ws.send(JSON.stringify({ 'modal': 'You defamed ' + target.name + ' (' + reputDiff + ' rep. pts.) and won ' + steal.toLocaleString() + '€' }));
                            ws.data.money += steal;
                            target.data.money -= steal;
                        }
                        if (reputDiff < 0) {
                            var steal = ws.data.money * ratio * -1;
                            ws.data.money -= steal;
                            target.data.money += steal;
                            wss.consoleAll(ws.name + ' failed to defame ' + target.name + ' (' + reputDiff + ' rep. pts.) and must pay ' + steal.toLocaleString() + '€');
                            ws.send(JSON.stringify({ 'modal': 'You failed to defame ' + target.name + ' (' + reputDiff + ' rep. pts.) and must pay ' + steal.toLocaleString() + '€' }));
                        }
                        if (reputDiff === 0) {
                            wss.consoleAll(ws.name + ' failed to defame ' + target.name + ' (' + reputDiff + ' rep. pts.) ');
                            ws.send(JSON.stringify({ 'modal': 'You failed to defame ' + target.name + ' (' + reputDiff + ' rep. pts.) ' }));
                        }
                        report('defame report : action debt : '
                            + biz.fnum(steal) + ' from ' + ws.name + ' (rep' + biz.getReputation(ws) + ') (' + biz.fnum(ws.data.money) + '€) to '
                            + target.name + ' (rep' + biz.getReputation(target) + ') (' + biz.fnum(target.data.money) + '€) [ratio ->' + ratio + '%]');


                    }
                    ws.data.money -= cost;
                    ws.data.strategies.defamecooldown = biz.getDefameCoolDownPrice(ws);
                } else
                    report('defame target not found');

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
                    target.send(JSON.stringify({ 'modal': notice }));
                    target.data.strategies.badbuzzvictim = biz.badbuzzduration;
                    ws.data.strategies.badbuzzcooldown = biz.badbuzzcooldown;
                    var notice = 'You successfully created a bad buzz around ' + target.name;
                    ws.send(JSON.stringify({ 'modal': notice }));
                } else {
                    report('refused bad buzz ' + ws.data.money + ' on ' + target);
                    report(op);
                }
            }


            if (json.command === 'strike' && !ws.data.strategies.strikecooldown && ws.data.strategies.strike) {
                var target = getOneClient(json.value);
                var op = opbible.findOp('strike');
                var cost = op.actionprice;
                if (target && ws.data.money >= cost) {
                    ws.data.money -= cost;
                    var notice = 'Your workers are on strike !! They stop working for ' + op.duration + ' days. ' + ws.name + ' seems behind that ...';
                    target.send(JSON.stringify({ 'modal': notice }));
                    wss.consoleAll(ws.name + ' triggers a strike at ' + target.name + '');
                    target.data.strategies.onstrike = op.duration;
                    ws.data.strategies.strikecooldown = op.cooldown;
                    var notice = 'You successfully created a strike at ' + target.name;
                    ws.send(JSON.stringify({ 'modal': notice }));
                }
            }


            if (json.command === 'hire') {
                ws.data.workers++;
            }



            if (json.command === 'fire' && ws.data.workers > 0) {
                var cost = biz.getFireCost(ws.data.workers, ws);
                ws.data.money -= cost;
                ws.data.workers--;
                ws.data.console.push('Worker fired, cost : ' + cost + '€');

            }

            if (json.command === 'hirechildren' && ws.data.money >= biz.getNextLcWorkerCost(ws)) {
                ws.data.strategies.children++;
                ws.data.money -= biz.getNextLcWorkerCost(ws);

            }
            if (json.command === 'firechildren' && ws.data.strategies.children > 0) {
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
                report('HACK ' + json.what + ' : ' + json.value);
                ws.data[json.what] = parseInt(json.value);

            }

            if (json.command === 'getlob' && hobby_window && ws.data.strategies.lobby && !ws.data.strategies.lobbycooldown) {
                hobby_window = false;

                wss.consoleAll(ws.name + ' catches the Tax Dodge ! Income x ' + biz.getTaxCoef(ws));
                ws.data.money -= hobby_price;
                ws.data.strategies.tax_dogde = 2;
                ws.data.strategies.lobbycooldown = biz.getLobbyCoolDown(ws);
            }


            if (json.command === "avocatbuy" && ws.data.money >= biz.getAvocatNextCost(ws)) {
                ws.data.money -= biz.getAvocatNextCost(ws);
                ws.data.strategies.avocats++;
                wss.consoleAll(ws.name + ' took a lawyer');
            }

            if (json.command === "tradeask") {
                var target = getOneClient(json.value);
                var obj = {
                    tradepop: true,
                    name: target.name,
                    prod: target.data.product,
                    unsold: target.data.unsold,
                    price: target.data.price
                };
                ws.send(JSON.stringify(obj));
                json.command = null;
                var publicnotice = ws.data.name + ' considers trading with ' + target.name + ' ... ';
                wss.consoleAll(publicnotice);
            }

            if (json.command === "trade") {

                if (ws.data.money < 1) {
                    ws.notice('You were not able to buy anything from this stock');
                } else {
                    var target = getOneClient(json.value);
                    var q = json.q;

                    var buyq = Math.floor(target.data.unsold * q / 100);
                    var bill = buyq * target.data.price;
                    if (ws.data.money < bill) {
                        var bill = ws.data.money;
                        var buyq = Math.floor(bill / target.data.price);
                    }

                    bill = Math.floor(bill);

                    ws.data.money -= bill;
                    target.data.money += bill;
                    ws.data.unsold += buyq;
                    target.data.unsold -= buyq;
                    var obj = {
                        tradecomplete: true,
                        name: target.name,
                        prod: target.data.product,
                        unsold: target.data.unsold,
                        price: target.data.price,
                        buyq: buyq,
                        bill: bill,
                    };
                    ws.send(JSON.stringify(obj));
                    json.command = null;

                    var notice = ws.data.name + ' bought ' + buyq + ' units from your unsold stock for a price of ' + bill + '€';
                    target.notice(notice);
                    ws.notice('You bought ' + buyq + ' units from ' + target.name + ' unsold stock for a price of ' + bill + '€');


                    var publicnotice = ws.data.name + ' bought ' + buyq + ' units from ' + target.name + ' unsold stock for a price of ' + bill + '€';
                    wss.consoleAll(publicnotice);
                    report(publicnotice);
                }



            }



            /* buy INIT operation */
            if (json.command === 'buy') {
                var op = opbible.findOp(json.value);
                if (ws.data[op.min] >= op.minv) { // requirements
                    var cost = op.price;
                    ws.data[op.price_entity] -= cost;
                    ws.data.strategies[op.name] = 1;
                    /*ws.data.console.push(op.title + ' acquired : ' + cost + '€');*/
                    wss.consoleAll(ws.name + ' acquired ' + op.title + ' for ' + cost.toLocaleString() + ' ' + biz.formatEntity(op.price_entity));
                }

            }



            if (json.command === 'commercialbuy') {
                var op = opbible.findOp('marketing');
                var cost = biz.getNextMarketingCost(ws);
                ws.data.money -= cost;
                ws.data.strategies.marketing++;

            }



            if (json.command === 'rebirth' && ws.data.strategies.recycle) {
                if (!ws.data.strategies.worlds)
                    ws.data.strategies.worlds = 0;
                ws.data.strategies.worlds++;
                var oldData = ws.data;
                ws.data = JSON.parse(JSON.stringify(data_example));
                ws.data.name = ws.name;
                ws.data.init = 1;
                ws.data.product = oldData.product;
                ws.data.strategies.worlds = oldData.strategies.worlds;

                if (oldData.strategies.shout) {
                    ws.data.strategies.shout = oldData.strategies.shout;
                }

                report(ws.name + ' rebirth level ' + ws.data.strategies.worlds);
                ws.save();


            }







            if (json.command) {
                ws.refresh(false);
            }


        } catch (e) {
            report('invalid json : ');
            report(e);

        }
    });







    ws.on('close', function (message) {
        report(ws.name + ' is closing');
        try {
            wss.broadcast(JSON.stringify({ 'gone': ws.name }));
            ws.save(null);
            wss.clients.delete(ws);
            //  console.log(wss.clients.size + ' remaining');

        } catch (e) {
            report('ws.on close');
            report(e);
        }

    });
});


/* tick operations */
var tic = 0;

var btctick = 0;
var btctickmax = 60;


function btc_callback() {
    wss.broadcast(JSON.stringify({ 'btcprice': BTCprice }));
}

function tick() {
    tic++;


    /* BTC TICK */
    if (btctick === 0) {
        try {
            if (realBTC) {
                coinmarketcap.get("bitcoin", coin => {
                    //    report(coin.price_usd); // Prints the price in USD of BTC at the moment.
                    BTCprice = coin.price_usd;
                    btc_callback();
                });
            } else {
                BTCprice = 500 + biz.getRandomInt(15000);
                btc_callback();
            }
        } catch (e) {
            report('catch error in btctick');
            report(e);
        }

    }
    if (btctick === btctickmax) {
        btctick = 0;
    } else {
        btctick++;
    }

    hobby_clock++;
    /* hobbying */

    if (hobby_clock === biz.hobby_freq) {
        wss.setAllStrategyBuffer('tax_dogde', null);
        hobby_price = biz.getRandomInt(10000) + biz.hobbybribemin;
        hobby_window = { 'hw': true, 'price': hobby_price };
    }
    if (hobby_clock >= (biz.hobby_freq + biz.hobby_window)) {
        hobby_window = false;
        hobby_clock = 0;
    }

    rand_news.check();





    /* PLAYER TICK */

    wss.clients.forEach(function each(client) {
        /* cb de vendus */
        try {

            /* BLACK HOLE END */
            if (client.data && client.data.init && client.data.end) {

                if (!client.data.endr) {
                    client.data.endr = 1;
                    var overall = client.data.score + client.data.humans_left;
                    client.data.overallscore = overall;
                    report('ending ' + client.name);


                }

                var end = {};

                if (!client.data.endreason) {
                    end.txt = "Magic power has been given to the hole. You consumed everything on earth for cash.<br/>";

                    try {
                        client.send(JSON.stringify({ 'endoftimes': end, "data": client.data }));
                    } catch (e) {
                        report('catch error in endreason');
                        report(e);
                    }
                }

                if (client.data.endreason === 'nomorehumans') {
                    end.txt = "7B humans died and no one is there to buy your products any more. Game over !<br/>";

                    try {
                        client.send(JSON.stringify({ 'endoftimes': end, "data": client.data }));
                    } catch (e) {
                        report('catch error in nomorehumans');
                        report(e);
                    }

                }

            }





            if (client.data && client.data.init && !client.data.end) {

                if (client.readyState === client.CLOSING) {
                    erreur(client, '!!! closed client detected ' + client.name);
                    return (null);
                }


                if (isNaN(client.data.score)) {
                    report('ERRRREUUUR SCORE ');
                    client.data.score = 0;
                }


                /* maximum money */


                /*workers*/

                var produced = biz.getDailyProduction(client);
                var cost = biz.getActualWorkerCost(client);

                if (isNaN(produced)) {
                    report('ERRRREUUUR PRODUCTION');
                    report(produced);
                }

                client.data.score += produced;
                client.data.unsold += produced;
                client.data.money -= cost;

                if (!client.data.strategies.children) {
                    client.data.strategies.children = 0;
                }
                client.data.strategies.children_next_cost = biz.getNextLcWorkerCost(client);

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
                var sale = biz.getIncome(client);
                client.data.unsold = sale.unsold;
                client.data.money += sale.income;
                client.data.daily = { 'income': sale.income, 'sales': sale.vendus };

                /* agios */
                client.data.tools.ajo = 0;
                if (client.data.money < 0) {
                    var ajo = Math.ceil(client.data.money * biz.ajo * -1);
                    client.data.money -= ajo;
                    client.data.tools.ajo = ajo;
                }
                if (client.data.money < biz.banqueroute) {
                    client.banqueroute();
                }




                /* cooldowns */
                if (client.data.strategies.defamecooldown > 0) {
                    client.data.strategies.defamecooldown--;
                }

                if (!client.data.strategies.lobbycooldown)
                    client.data.strategies.lobbycooldown = 0;
                if (client.data.strategies.lobbycooldown > 0) {
                    client.data.strategies.lobbycooldown--;
                }

                /* black magic */
                if (client.data.strategies.magic) {
                    if (!client.data.magicpower)
                        client.data.magicpower = 0;
                    if (client.data.magicpower > biz.black_energy_limit) {
                        client.data.magicpower = biz.black_energy_limit;
                    }
                    client.data.strategies.magicnextcost = biz.getBlackMagicNextCost(client);

                }

                /* btc */
                if (client.data.strategies.btc) {
                    if (!client.data.strategies.farm)
                        client.data.strategies.farm = 0;
                    var prod = biz.getBtcProd(client);

                    if (isNaN(prod.warm)) {
                        console.log(prod);
                        throw new Error('An Warm NaN occurred');
                    }
                    client.data.btc += prod.prod;

                    client.data.strategies.warm = prod.warm;
                    client.data.strategies.farm_next_cost = biz.getBtcFarmNextCost(client);
                    client.data.strategies.farm_next_cost100 = biz.getBtcFarmNextCost(client) * 100;
                }

                /* greenwashing */
                if (client.data.strategies.greenwashing) {
                    if (!client.data.strategies.ngo)
                        client.data.strategies.ngo = 0;

                }

                /* greenwashing */
                if (client.data.strategies.lawyers) {
                    if (!client.data.strategies.avocats)
                        client.data.strategies.avocats = 0;

                    client.data.strategies.avocat_next_cost = biz.getAvocatNextCost(client);
                }



                /* army */
                if (client.data.strategies.army) {
                    if (!client.data.killed) {
                        client.data.killed = 0;
                    }
                    if (!client.data.strategies.army_p) {
                        client.data.strategies.army_p = 0;
                    }
                    if (!client.data.strategies.dailykilled)
                        client.data.strategies.dailykilled = 0;
                    client.data.strategies.army_p_nc = biz.getArmyProgNextCost(client);
                    client.data.strategies.dailykilled = biz.getKilled(client);
                    client.data.killed += biz.getKilled(client);

                }

                /* bad buzz */
                if (client.data.strategies.badbuzzcooldown && client.data.strategies.badbuzzcooldown > 0) {
                    client.data.strategies.badbuzzcooldown--;
                }
                if (client.data.strategies.badbuzzvictim && client.data.strategies.badbuzzvictim > 0) {
                    client.data.strategies.badbuzzvictim--;
                }


                /*strike */
                if (client.data.strategies.strikecooldown && client.data.strategies.strikecooldown > 0) {
                    client.data.strategies.strikecooldown--;
                }
                if (client.data.strategies.onstrike && client.data.strategies.onstrike > 0) {
                    client.data.strategies.onstrike--;
                }
                /* death */

                if (client.data.strategies.holocaust && !client.data.strategies.holocaustdone) {
                    client.data.strategies.holocaustdone = true;
                    client.data.killed += biz.holocaust;
                    client.data.humans_left -= biz.holocaust;
                }

                /* recycle */

                if (client.data.strategies.recycle) {
                    if (!client.data.strategies.worlds) {
                        client.data.strategies.worlds = 0;
                    }

                }

                /* global killing */
                if (biz.getKilled(client)) {
                    biz.humans_on_earth -= biz.getKilled(client) / 2;
                    client.data.humans_left -= biz.getKilled(client);
                    if (client.data.humans_left <= 1) {
                        client.data.humans_left = 0;
                        client.data.end = true;
                        client.data.endreason = "nomorehumans";
                    }
                }

                /*small fix*/
                if (!client.data.strategies.army && client.data.humans_left <= 1) {
                    client.data.humans_left = biz.maxHumans;
                }



                /* end */

                if (client.data.strategies.hole) {
                    client.data.end = true;
                    client.save();
                }




            }
        } catch (e) {
            report('catch error in  PLAYER TICK');
            report(e);
        }




    });
    if (!wss.clients.size) {
        //report('nobodyshere ?');
    }
    wss.massrefresh();
    save_clock++;
    if (save_clock === save_freq) {
        wss.masssave();
        save_clock = 0;
    }

    var mytick = setTimeout(function () {
        tick();
    }, biz.tickrate);
}
tick();

