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
    totalticks : 0,
};






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
    if(commande === 'save') {
        wss.masssave();
    }
});




console.log('Lancement serveur port '+port+'------------------------------------------------------');









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
                var name = urlinfo[1];
                var token = urlinfo[0];

                for (i = 0; i < clients.length; i++) {
                    if (clients[i].name === name) {
                        callback(false);
                    }
                }

                connection.query('SELECT id,name,password FROM players WHERE name=?', [name], function (err, rows, fields) {
                    if (rows[0] && rows[0].id)
                    {
                        if (rows[0].password === token) {
                            userRequestMap.set(info.req, rows[0]);
                            callback(true);
                        } else {
                            callback(false);
                        }


                    } else
                    {
                        console.log('-newplayer-');
                        var data = JSON.stringify(data_example);
                        connection.query('INSERT INTO players(name,password,data) VALUES (?,?,?)', [name, token, data], function (err) {
                            if (err)
                                console.log(err);
                            else{
                                var uzar = {
                                    'name' : name,
                                    'password' : token,
                                    'id' : 'new'
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

wss.masssave = function masssave(){
    console.log('mass save');
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
    var name = userinfo.name;
    var token = userinfo.password;
    var id = userinfo.id;
    console.log(name + ' connected');
    connection.query('SELECT data FROM players WHERE name=? AND password=?', [name, token], function (err, rows, fields) {
        var data = JSON.parse(rows[0].data);
        ws.data = data;
        ws.name = name;
        ws.data.console = [];
        ws.data.time = Date.now();
        ws.data.tooquick = 0;
        clients.push(ws);
        
        /*updateshit */
        if(!ws.data.totalticks) ws.data.totalticks = 0;
        
        
        
        
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
        try{
            ws.send(JSON.stringify({
                'product': ws.data.product,
                'money': ws.data.money,
                'workers': ws.data.workers,
                'worker_cost': biz.getWorkerCost(ws),
                'next_worker_cost': biz.getNextWorkerCost(ws),
                'actual_worker_cost': biz.getActualWorkerCost(ws),
                'score': ws.data.score,
                'unsold': ws.data.unsold,
                'demand': biz.getDemand(ws),
                'price': ws.data.price,
                'max': biz.getSpeed(ws), //max speed
                'lastvente': ws.data.lastvente,
                'refresh': info_clients(),
                'tick': tic,
                'totalticks': ws.data.totalticks,
                'console': ws.data.console
            }));
            ws.data.console = [];
        }catch(e){
            console.log(e);
        }
    };
    
    ws.save = function save() {
        connection.query('UPDATE players SET data=? WHERE name= ?', [ws.data, ws.name], function (err, rows, fields) {            
        });
    };


   


    /*read messages */
    ws.on('message', function incoming(message) {
        try
        {
          

            var json = JSON.parse(message); // reçu json message de ws.id
            

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
                ws.send(JSON.stringify({'init': 1,'user':ws.name}));
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
                ws.data.money-=cost;
                ws.data.workers--;
                ws.data.console.push('Worker fired, cost : '+cost);
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
        connection.query('UPDATE players SET data=? WHERE name= ?', [data, name], function (err, rows, fields) {
            console.log(ws.name + ' disconnected');
            var index = clients.indexOf(ws);
            clients.splice(index, 1);
        });
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
            /* sales */
            var demand = biz.getDemand(clients[i]);  
            var chance = getRandomInt(demand);
            var vendus = Math.floor(chance / 9);
            var restants = clients[i].data.unsold - vendus;
            clients[i].data.totalticks++;
            if (restants <= 0) {
                vendus = restants + vendus;
                restants = 0;                
            }
            clients[i].data.money += clients[i].data.price * vendus;
            clients[i].data.lastvente = vendus;
            clients[i].data.unsold = restants;
            
            
            /*workers*/
            if(clients[i].data.workers){
                var produced = clients[i].data.workers;
                var cost = biz.getActualWorkerCost(clients[i]);
                clients[i].data.score+=produced;
                clients[i].data.unsold+=produced;
                clients[i].data.money-=cost;
            }
           // console.log(clients[i].name + ' : demande ' + demand+', chance : '+chance+', restants : '+restants+', vendus : '+vendus);

           // clients[i].refresh();
            
        } else {
           // console.log(clients[i].name + ' : not init');

        }

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

