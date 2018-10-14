/* fromage server */

var mysql = require('mysql');
var biz = require('./classes/business.js');
var port = 8080;
var clients = [];

var save_freq = 120;
var save_clock = 0;

var data_example = {
    name: '',
    score: 0,
    unsold: 0,
    product: '',
    time: 0,
    money: 0,
    marketing_level: 0,
    source_level: 0,
    workers: 0,
    price: 10,
    totalticks: 0,
    daily : {},
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
                var name = urlinfo[1].toLowerCase();
                var token = urlinfo[0];
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

wss.massrefresh = function broadcast(msg) {
    wss.clients.forEach(function each(client) {
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
                'score': Math.floor(clients[i].data.score),
                'money': Math.floor(clients[i].data.money)
            });
        }
    }
    return(infos);
}


wss.on('connection', function myconnection(ws, request) {
    /* recognize authentified player */
    console.log('---------------');
    var userinfo = userRequestMap.get(request);
    var name = userinfo.name;
    var token = userinfo.password;
    var id = userinfo.id;



    console.log(name + ' connected');
    connection.query('SELECT data FROM players WHERE name=? AND password=?', [name, token], function (err, rows, fields) {
        if(err)console.log(err);
        var data = JSON.parse(rows[0].data);
        ws.data = data;
        ws.name = name;
        ws.data.console = [];
        ws.data.time = Date.now();
        ws.data.tooquick = 0;
        clients.push(ws);
        /*updateshit */
        if (!ws.data.totalticks) ws.data.totalticks = 0;
        if (!ws.data.reputation) ws.data.reputation = 0;
        if (!ws.data.strategies) ws.data.strategies = {};
        if (!ws.data.tools) ws.data.tools = {};
        if (!ws.data.daily) ws.data.daily  = {};
        /* send upgrades to clients */        
        ws.send(JSON.stringify({'opbible': opbible.operations}));


        if (ws.data.product) { /* deja init */
            ws.data.init = 1;
            ws.send(JSON.stringify({'init': 1, 'user': ws.name}));
            ws.refresh();
        } else {
            /* initialisation */
            var max = biz.getSpeed(ws);
            ws.send(JSON.stringify({'chooseproduct': 1, 'updatescore': ws.data.score, 'updatemax': max}));
        }
    });


    ws.refresh = function refr() {
        try {
           
            ws.send(JSON.stringify({
                'r' : 1,
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
                'tick': tic,
                'totalticks': ws.data.totalticks,
                'console': ws.data.console,
                'strategies': ws.data.strategies,
                'nmc': biz.getNextMarketingCost(ws),
                'tools': ws.data.tools,
                'reputation' :  biz.getReputation(ws),
                'dailycost' : biz.getDailyCost(ws),
            }));
            ws.data.console = [];
        } catch (e) {
            console.log(e);
        }
    };

    ws.save = function save(callback) {
        connection.query('UPDATE players SET data=? WHERE name= ?', [JSON.stringify(ws.data), ws.name], function (err, rows, fields) {
            if(err) console.log(err);
            console.log(ws.name+' data saved');
            if(callback){
                callback();
            }
            
        });
        
    };

    ws.disconnect = function (){
        console.log(ws.name + ' disconnected');
        var index = clients.indexOf(ws);
        clients.splice(index, 1);
    };



    /*read messages */
    ws.on('message', function incoming(message) {
        try
        {


            var json = JSON.parse(message); // reçu json message de ws.id
            console.log(json);

            if (json.command === 'make') {
                var now = Date.now();
                var last = ws.data.time;
                var max = biz.getSpeed(ws);
                if (now - last > max) {
                    ws.data.score++;
                    ws.data.unsold++;
                    ws.data.time = now;
                    ws.refresh();
                } else {
                    console.log(ws.name + ' is tooquick' + now + ' ' + last + ' ' + max);
                    ws.data.tooquick++;
                    ws.send(JSON.stringify({'tooquick': 1}));
                }

            }


            if (json.command === 'submitproduct') {
                ws.data.init = 1;
                ws.data.product = json.value;
                ws.refresh();
                ws.send(JSON.stringify({'init': 1, 'user': ws.name}));
            }

            if (json.command === 'raise') {
                ws.data.price++;
                ws.refresh();
            }
            if (json.command === 'lower' && ws.data.price > 1) {
                ws.data.price--;
                ws.refresh();
            }
            

            if (json.command === 'hire') {
                ws.data.workers++;
                ws.refresh();
            }
            if (json.command === 'fire' && ws.data.workers > 0) {
                var cost = biz.getFireCost(ws.data.workers);
                ws.data.money -= cost;
                ws.data.workers--;
                ws.data.console.push('Worker fired, cost : ' + cost + '€');
                ws.refresh();
            }
            
            if (json.command === 'hirechildren') {
                ws.data.strategies.children++;
                ws.refresh();
            }
            if (json.command === 'firechildren') {
                ws.data.strategies.children--;
                ws.refresh();
            }

            if (json.command === 'reset') {
                ws.data = data_example;
                ws.send(JSON.stringify({'reset': 1}));
            }

            

            /* buy INIT operation */
            if (json.command === 'buy') {
                var op = opbible.findOp(json.value);
                if (ws.data[op.min] >= op.minv) { // requirements
                    var cost = op.price;
                    ws.data[op.price_entity] -= cost;
                    ws.data.strategies[op.name] = 1;
                    ws.data.console.push(op.title + ' acquired : ' + cost + '€');
                }
                ws.refresh();
            }
            
            
            
            if(json.command === 'commercialbuy'){
                var op = opbible.findOp('marketing');
                var cost = biz.getNextMarketingCost(ws);
                ws.data.money -= cost;
                ws.data.strategies.marketing++;   
                ws.refresh();
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
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function tick() {
    tic++;

    for (i = 0; i < clients.length; i++) {
        /* cb de vendus */
        if (clients[i].data.init) {
           

            /*workers*/
            
            var produced = biz.getDailyProduction(clients[i]);
            var cost = biz.getActualWorkerCost(clients[i]);
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
            var sale = {};
            sale.demand = biz.getDemand(clients[i]);      /* 10 */
            
            sale.vendus = Math.floor(Math.pow(sale.demand, 2) * Math.pow(10, -2));
            
            
            /* un zeste de random */
            sale.vendus -= getRandomInt(sale.vendus/10); 
            sale.vendus += getRandomInt(sale.vendus/10); 
            
            sale.wanted = sale.vendus;
            sale.unsold = clients[i].data.unsold;
            

            clients[i].data.totalticks++;
            if (sale.unsold <= sale.vendus) {
                sale.mank = sale.unsold - sale.vendus;
                sale.unsold = 0;
                sale.vendus += sale.mank;
            } else {
                sale.unsold -= sale.vendus;
            }
           
            
            
            clients[i].data.unsold = sale.unsold;
            clients[i].data.money += clients[i].data.price * sale.vendus;
            clients[i].data.daily = {'income' : sale.vendus * clients[i].data.price,'sales': sale.vendus};






            clients[i].data.tools.ajo = 0;
            if (clients[i].data.money < 0) {
                var ajo = Math.ceil(clients[i].data.money * biz.ajo);
                clients[i].data.money -= ajo;
                clients[i].data.tools.ajo = ajo;
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

