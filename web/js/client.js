/* file created by charles.torris@gmail.com */

var port = 8080;

var autoreco;
var autoclickFreq = 1000;
var lagCompensation = 100;
var refreshRate = 10000;
var autoTimeout = null;
var statdays = [];
var statd = 0;
var statrange = 10;
var user = '';
var ntargets = {};
var token = '';
var actions = {};
var opbible = {};
var people = [];
var dev = null;



var vizu_activated = false;
var ctx;
var selfMoneyChart;
var multiChart;
var comChart = null;
var datastorage = []; // for vizualisation

var piston;

function findOp(name) {
    for (i = 0; i < this.opbible.length; i++) {
        if (this.opbible[i].name === name) {
            return(this.opbible[i]);
        }
    }
    return null;
}


function formatEntity(ent) {
    if (ent === 'money')
        return '€';
    if (ent === 'btc')
        return ' BTC';

    return(' '+ent);
}

function fnum(x) {

    if (!x) {
        return 0;
    }

    if (isNaN(x))
        return x;

    if (x < 0) {
        return (Math.round(x * 100) / 100).toLocaleString();
    }

    if (x < 9999) {
        return (Math.round(x * 100) / 100).toLocaleString();
    }

    if (x < 1000000) {
        return (Math.round(x * 100) / 100).toLocaleString();
    }
    if (x < 10000000) {
        return ((Math.round(x * 100) / 100) / 1000000).toFixed(2) + "M";
    }

    if (x < 1000000000) {
        return Math.round((x / 1000000)) + "M";
    }

    if (x < 1000000000000) {
        return Math.round((x / 1000000000)) + "B";
    }

    return "1T+";
}



var p = {
    name: '',
    score: 0,
    unsold: 0,
    product: '',
    time: 0,
    money: 0,
    workers: 0,
};
p.max = 1000;


$(document).ready(function () {

    console.log('poutrelle');
    var isdev = "dev=" + $('#isdev').val() + "&";
   
    // UI //


    $('#connect').submit(function (e) {
        e.preventDefault();
        connect();
    });

    $('.stat').each(function () {
        $(this).attr('data-ballon-pos','right');
    });


    function numbers_refresh() {
        $('.stat').each(function () {
            var stat = $(this).data('p');
            var strat = $(this).data('s');
            if (stat){
                $(this).html(fnum(p[stat]));
                $(this).attr("data-value",p[stat]);
                //$(this).attr('data-balloon', p[stat]);
            }
            if (strat && p.strategies){
                $(this).html(fnum(p.strategies[strat]));
                $(this).attr("data-value",p.strategies[strat]);
                //$(this).attr('data-balloon', p.strategies[strat]);
            }
        });
    }
    

    // WS //
    function connect() {
        clearTimeout(autoreco);
        token = $('#password').val();
        user = $('#username').val();
        

        var regex = /^([a-zA-Z0-9_-]+)$/;
        if (!regex.test(user) || !regex.test(token)) {
            alert('Please use only alphanumeric characters and underscores for user and pass');
            return false;
        }

        
        
        var port = $('#porc').val();

        Cookies.set('user', user);
        Cookies.set('token', token);

        try {
            var ws = new WebSocket('ws://51.15.181.30:' + port + '/' + token + '-' + user);
        } catch (e) {
            alert(e);
        }



        ws.onerror = function (e) {
            window.location.replace("/?" + isdev + "message=Login Failed : double login, wrong password or server down&disablereconnect=1");

        };

        ws.onmessage = function (event) {
            
            var norefresh = false;
            var dev = $('#isdev').val() ? true : false;
            var d = JSON.parse(event.data);
            if(dev)console.log(d);
            p = d; /* looool*/

            /* format some values for display */
            if (p.r) {
                p.moneydisplay = p.money.toLocaleString();
                ntargets.money = Math.floor(p.money);

                if (p.tick) {
                    var annee = Math.floor(p.tick / 365);
                    p.jrestant = p.tick - (annee * 365);

                    $('.annee').html(annee);
                    $('.jrestant').html(p.jrestant);
                }
                p.dailybalance = fnum(p.daily.income - p.dailycost);
                if (p.hw)
                    p.lobbyprice = p.hw.price;
                p.dailysales = p.daily.sales;
                //  p.demand = p.demand / 10;

                if (p.dp && p.tick) {
                    piston(p.dp);
                }
                


            }

           

            if (p.btcprice) {
                $('.btcprice').html(Math.round(p.btcprice * 100) / 100);
                norefresh = true;
            }

            if (p.endoftimes) {
                $('#game').hide();
                $('#satan').removeClass("hidden");
                $('#satan .inner').html(p.endoftimes.txt);
                $('#satan .inner').append("<br/>SCORE : " + p.data.score.toLocaleString());
                $('#satan .inner').append("<br/>MONEY : " + p.data.money.toLocaleString() + '€');
                $('#satan .inner').append('<br/><br/>');

            }

            if (p.tools && p.tools.ajo) {
                $('.ajo').show();
                p.ajo = p.tools.ajo;
            } else
                $('.ajo').hide();

            if (d.chooseproduct) {
                /* product selection if not selected */
                $('#connect').hide();
                $('.autoreconnect').hide();
                $('#productname').show();
            }

            if (d.init) {
                /* start UI */
                $('#console').html(d.user + ' connected');
                $('#top').hide();
                $('#productname').hide();
                $('#game').show();
            }

            if (p.spydata) {
                $('#spymodal').modal('show');
                p.annee = Math.floor(p.tick / 365);
                p.jrestant = p.tick - (p.annee * 365);
                p.spydata.day = 'year ' + p.annee + ', day ' + p.jrestant;
                p.spydata.money = p.spydata.money.toLocaleString() + '€';
                p.spydata.price = p.spydata.price.toLocaleString() + '€';
                p.spydata.income = p.spydata.daily.income.toLocaleString() + '€';
                p.spydata.strats = '';
                $.each(p.spydata.strategies, function (index, value) {
                    var opname = findOp(index);
                    if (opname) {
                        p.spydata.strats += '<p><b>' + opname.title + '</b> : x <b>' + value + '</b>, ' + opname.desc + '</p>';
                    }
                });

                $('#spydata .field').each(function () {
                    $(this).html('<b>' + $(this).data('f') + '</b> : ' + p.spydata[$(this).data('f')]);
                });
            }

            /* operations bible */
            if (d.opbible) {
                opbible = d.opbible;

                var html = '';
                var balloon;
                for (i = 0; i < d.opbible.length; i++) {
                    var op = d.opbible[i];
                    if(op.buf){
                        balloon = 'data-balloon="'+op.buf+'" data-balloon-pos="right"';
                    } else 
                    {
                        balloon = '';
                    }
                    html += '<div '+balloon+' id="buy_' + op.name + '" class="operation disabled command" data-price_entity="' + op.price_entity + '" data-min="' + op.min + '" data-required_strat="' + op.required_strat + '" data-mina="' + op.price + '" data-minv="' + op.minv + '" data-c="buy" data-v="' + op.name + '" >';
                    html += '<b>' + op.title + '</b> (' + fnum(op.price) +  formatEntity(op.price_entity) + ') <span class="chrono"></span><br/>' + op.desc + ' </div>';
                    if (op.actionprice) {
                        actions[op.name] = {};
                        actions[op.name].price = op.actionprice;
                    }
                }
                $('#tools .container').html(html);
                /* tooltips JS */
                /*
                for (i = 0; i < d.opbible.length; i++) {
                    var op = d.opbible[i];
                    if (op.buf) {
                        var id = "buy_" + op.name;
                        var referenceElement = $(document).find('#' + id);
                        new Tooltip(referenceElement, {
                            placement: 'top', // or bottom, left, right, and variations
                            title: op.buf
                        });
                    }

                }
                */
            }

            if (d.banqueroute) {
                alert('Bankruptcy !!!!');
            }

            if (d.reset) {
                window.location.replace("/?" + isdev + "message=Account has been reset&disablereconnect=1");
            }

            if (d.modal) {
                if ($("#infomodal").hasClass('in')) {
                    $('#infomodal_content').append('<br/>' + d.modal);
                } else {
                    $('#infomodal_content').html(d.modal);
                    $('#infomodal').modal('show');
                }
            }


            if (d.updatescore) {

                if (p.score > 10) {
                    $('#factory').show();
                }
                if (p.money > $('.worker_cost').html()) {
                    $('.hcommand').removeAttr('disabled');
                } else {
                    $('.hcommand').attr('disabled', 'disabled');
                }
            }

            if (d.gone) {
                $('.player-' + d.gone).remove();
            }

            if (d.refresh) {
                /* refresh competitors */
                var clients = d.refresh;
                var html = '<table>';

                for (i = 0; i < clients.length; i++) {
                    var data = clients[i];
                    if (people.indexOf(data.name) < 0) {  /* new people */
                        console.log(data.name + ' entered the tekken');
                        people.push(data.name);
                        var html = $('#clientsmodele table').clone();
                        html.find('tr').addClass('player-' + data.name);
                        html.find('.command').attr('data-v', data.name);
                        html.find('.mp-spy').html('spy (' + fnum(actions.spy.price) + '€)');
                        html.find('.mp-defame').html('defame (' + fnum(actions.defamation.price) + '€)');
                        html.find('.mp-badbuzz').html('badbuzz (' + fnum(actions.badbuzz.price) + '€)');
                        html.find('.mp-strike').html('strike (' + fnum(actions.spy.price) + '€)');

                        if (data.name === user) {
                            html.find('table').addClass('selfplayer');
                            html.find('.mp-spy').html('audit (' + fnum(actions.spy.price) + '€)');
                            html.find('.noself').remove();
                        }
                        html.find('.name').html('<b class="playaname">' + data.name + '<b>');

                        $('#clients2').append(html.html());


                    }
                    var html = $('.player-' + data.name);
                    html.find('.money').html(fnum(data.money) + '€');
                    html.find('.score').html(fnum(data.score));
                    html.find('.product').html(data.product);

                    if (data.name !== user && actions) {

                        if (p.strategies.spy && p.money >= actions.spy.price) {
                            html.find('.mp-spy').removeAttr('disabled');
                        } else {
                            html.find('.mp-spy').attr('disabled', 'disabled');
                        }
                        if (p.strategies.defamation && p.money >= actions.defamation.price && !p.strategies.defamecooldown) {
                            html.find('.mp-defame').removeAttr('disabled');
                        } else {
                            html.find('.mp-defame').attr('disabled', 'disabled');
                        }
                        if (p.strategies.badbuzz && p.money >= actions.badbuzz.price && !p.strategies.badbuzzcooldown) {
                            html.find('.mp-badbuzz').removeAttr('disabled');
                        } else {
                            html.find('.mp-badbuzz').attr('disabled', 'disabled');
                        }
                        if (p.strategies.strike && p.money >= actions.strike.price && !p.strategies.strikecooldown) {
                            html.find('.mp-strike').removeAttr('disabled');
                        } else {
                            html.find('.mp-strike').attr('disabled', 'disabled');
                        }
                    }




                }
                $('#clients').html(html + '</table>');
            } /* end refresh competitors */


            if (vizu_activated && p.r) {
                //datastorage.push(p);
                vizu_update(p);
            }




            /* console display */
            if (p.console && p.console.length > 0) {
                for (i = 0; i < p.console.length; i++) {
                    $('#console').append('<br/>' + p.console[i]);
                }
                var wtf = $('#console');
                var height = wtf[0].scrollHeight;
                wtf.scrollTop(height);
            }

            /* 
             * 
             * make some stats for fun 
             * 
             * */

            if (p.totalticks > 100) {
                $('#tools').removeClass("hidden");
            }




            if (p.strategies) {
                /* 
                 * GLOBAL
                 * display or hide the ops 
                 * */
                
                if (p.strategies.robots && $('.workertype').html() === 'worker') {
                    $('.workertype').html('robot');
                }
                
                $('.operation').each(function () {
                    var min = $(this).data('min');
                    var minv = $(this).data('minv');
                    var mina = $(this).data('mina'); // price
                    var name = $(this).data('v');
                    var price_entity = $(this).data('price_entity');
                    var required_strat = $(this).data('required_strat');
                    
                   
                    //console.log(name+ ' : ' + min+ ': '+p[min] + ' vs '+minv);


                    if (p[min] >= minv && !p.strategies[name] && (!required_strat || p.strategies[required_strat])) {
                        $(this).show();
                        
                        var chrono = 0;
                        if (p.strategies.chrono && price_entity === 'money') {
                            var chrono = Math.floor((mina - p.money) / p.daily.income);                           
                            $(this).attr('data-chrono', chrono);
                        }
                        if (chrono > 0){
                            var mins = Math.floor(chrono/60);
                            var restant = chrono - (mins * 60);                            
                            var chronodisplay = mins ? mins+' min, ' : '';
                            chronodisplay+= restant+'s';
                            $(this).find('.chrono').html(chronodisplay);
                        }
                            
                    } else {
                        $(this).hide();
                    }
                    if (p[price_entity] >= mina && !p.strategies[name]) {
                        $(this).removeClass('disabled');
                    } else {
                        $(this).addClass('disabled');
                    }
                });

                $('.strategic').each(function () {
                    var name = $(this).data('strat');
                    if (p.strategies[name]) {
                        $(this).show().removeClass('hidden');
                    } else {
                        $(this).hide();
                    }
                });




                /* 
                 * 
                 * specific operations 
                 * 
                 * */


                if (p.reputation) {
                    $('.reputation').removeClass('hidden');
                }



                if (p.strategies.children) {
                    p.children = p.strategies.children;
                }
                if(p.strategies.autocorpse && $('#autoconsume').is(':checked') && p.tick){
                    $('.consume').trigger('click');
                    
                }


                if (p.strategies.marketing)
                {
                    p.commercials = p.strategies.marketing;

                }
                if (p.strategies.army) {
                }


                if (p.strategies.accountant) {

                    p.sold = (p.score - p.unsold);
                    p.salesperday = Math.round(p.sold / p.totalticks, 2);
                    p.moneyperday = Math.floor(p.money / p.totalticks);
                    p.workeravg = fnum(Math.floor(p.actual_worker_cost / p.workers));
                    statdays[statd] = {
                        'dailyincome': p.daily.income,
                        'sales': p.daily.sales,
                        'dailycost': p.dailycost
                    };

                    statd++;
                    if (statd > statrange)
                        statd = 0;
                    var total_income = 0;
                    var total_balance = 0;
                    var total_sales = 0;

                    if (statdays.length >= statrange) {
                        for (i = 0; i < statrange; i++) {
                            total_income += statdays[i].dailyincome;
                            total_balance += statdays[i].dailyincome - statdays[i].dailycost;
                            total_sales += statdays[i].sales;
                        }
                        p.statrange = statrange;
                        p.period_sales = total_sales;
                        p.period_dailyincome = Math.ceil(total_income / statdays.length);
                    } else {
                        p.period_sales = 'Gathering data ...' + statdays.length + ' days';
                    }



                }

                if (p.hw) { /*hobby window*/
                    $('#hobby_window').removeClass('hidden');
                    p.hobbyprice = fnum(p.hw.price) + '€';
                } else {
                    $('#hobby_window').addClass('hidden');
                }


                if (p.strategies && p.strategies.warm) {
                    var value = Math.floor(255 * p.strategies.warm / 2);
                    if (value > 255)
                        value = 255;
                    var r = 255;
                    var g = 255 - value;
                    var b = 255 - value;

                    $('.warming').css('background', 'rgb(' + r + ',' + g + ',' + b + ')');
                }

            }
            /* update requirements */
            $('.requirement').each(function () {
                var min = $(this).data('min');
                var value = $(this).data('minv');
                if (min === 'money') {
                    if (value >= p.money) {
                        $(this).removeAttr('disabled');
                    } else {
                        $(this).attr('disabled', 'disabled');
                    }
                }
            });




            if(!norefresh)
            numbers_refresh();

            /* update securities */
            if (p.strategies) {
                $('.security').each(function () {
                    var ref = $(this).data('security');
                    if (!ref) {
                        ref = $(this).data('nostratsecurity');
                        ref = p[ref];
                    } else {
                        ref = p.strategies[ref];
                    }

                    if (!$(this).data('security-entity')) {
                        var entity = p.money;
                    } else {
                        var entity = p[$(this).data('security-entity')];
                    }
                    if (ref >= entity) {
                        $(this).attr('disabled', 'disabled');
                    } else {
                        $(this).removeAttr('disabled');
                    }
                });
            }

            /*htmlsecurituy */
            $('.htmlsecurity').each(function () {
                var ref = $(this).data('security');
                var limitvalue = $(this).data('securityvalue');
                var refvalue = parseInt($('.' + ref).html());

                if (refvalue > parseInt(limitvalue)) {
                    $(this).removeAttr('disabled');
                } else {
                    $(this).attr('disabled', 'disabled');
                }
            });


        };

        function ping() {
            setTimeout(function () {
                if (ws.readyState === ws.CLOSED) {
                    window.location.replace("/?" + isdev + "reconnect=1&message=Serveur has updated ! Please Relog !");
                } else {

                    ping();
                }
            }, 1000);
        }

        ping();




        /* login */
        $('#pname').submit(function (e) {
            e.preventDefault();
            ws.send(JSON.stringify({command: 'submitproduct', value: $('#prod').val()}));
        });

        $('#hacksubmit').click(function () {
            ws.send(JSON.stringify({command: 'hack', what: $('#hack').val(), value: $('#hackvalue').val()}));
        });

        /* send make */
        $('#make').click(function () {
            piston();
            var command = JSON.stringify({command: 'make', value: 1});
            ws.send(command);
            $('#make').attr('disabled', 'disabled');
            setTimeout(function () {
                $('#make').removeAttr('disabled');
            }, p.max);
        });
        
        $('.shoutax').submit(function (e) {
            e.preventDefault();
            var msg = $('#shout').val();
            if (msg) {
                ws.send(JSON.stringify({command: 'shout', value: msg}));
                $('#shout').val('');
            }
        });


        $(document).on('click', '.command', function () {
            if(dev) console.log('command' + $(this).data('c'));
            
            if (!$(this).hasClass('disabled')) {
                var c = $(this).data('c');
                var v = $(this).data('v');
                var command = JSON.stringify({command: c, value: v});
                console.log(command);
                ws.send(command);
            }



        });




    }

    if ($('#reconnect').val()) {
        var user = Cookies.get('user');
        var token = Cookies.get('token');
        console.log('Try to reco ' + user);
        $('#reconnect').val(0);
        if (user && token) {
            $('#password').val(token);
            $('#username').val(user);
            $('#connect').hide();
            $('.autoreconnect').removeClass('hidden');
            autoreco = setTimeout(function () {
                connect();
            }, 3000);

        }
    }






    /*
     * visu
     * 
     */
    if (1) {
        vizu_activated = true;
        console.log('start vizu');
        function addData(chart, label, readydata) {
            chart.data.labels.push(label);
            chart.data.datasets.forEach((dataset) => {
                if (dataset.label === 'CA$HMON€Y') {
                    dataset.data.push(readydata.money);
                }
                if (dataset.data.length > 10) {
                    chart.data.labels.shift();
                    dataset.data.shift();
                }
            });
            chart.update();
        }

        function removeData(chart) {
            console.log('clearing');
            chart.data.labels.pop();
            chart.data.datasets.forEach((dataset) => {
                dataset.data = [];
            });
            chart.update();
        }

        $('.clear_vizu').click(function () {
            removeData(selfMoneyChart);
        });


        /* refreshing charts */
        function vizu_update(p) {

            if (selfMoneyChart && p.tick && p.money) {
                var label = p.jrestant;
                var readydata = {
                    'money': Math.floor(p.money),
                    //'income' :Math.floor(parseInt(p.dailybalance))
                }
                addData(selfMoneyChart, label, readydata);
            }

            if (multiChart && p.refresh) {
                var udata = [];
                var ulabels = [];
                var ubg = [];
                var alt = 0;
                for (i = 0; i < p.refresh.length; i++) {
                    var man = p.refresh[i];
                    udata.push(Math.floor(man.money));
                    ulabels.push(man.name);
                    if (alt === 0) {
                        ubg.push('rgb(0, 0, 0)');
                        alt = 1;
                    } else {
                        ubg.push('rgb(240, 240, 240)');
                        alt = 0;
                    }
                }
                var chart = multiChart;
                chart.data.labels = ulabels;
                chart.data.datasets.forEach((dataset) => {
                    dataset.data = udata;
                    dataset.backgroundColor = ubg;
                });
                chart.update();
            }

        }

        var ctxcash = document.getElementById("cash").getContext('2d');
        $('.visurow').removeClass('hidden');
        var vdata = {};
        vdata.labels = [];
        vdata.datasets = [{
                label: 'CA$HMON€Y',
                backgroundColor: 'rgb(0, 0, 0)',
                borderColor: 'rgb(0, 0, 0)',
                data: [],
                fill: false,
            }
        ];
        var voptions = [];
        selfMoneyChart = new Chart(ctxcash, {
            type: 'line',
            data: vdata,
            options: voptions
        });

        var ctxmulti = document.getElementById("multi").getContext('2d');
        var config = {
            type: 'pie',
            data: {
                datasets: [{
                        data: [],
                        backgroundColor: [],
                        label: 'multi' // for legend
                    }],
                labels: []
            },
            options : {
                legend: {
                    display: false,
                }
            }
        };
        multiChart = new Chart(ctxmulti, config);



        if (!Date.now) {
            Date.now = function () {
                return new Date().getTime();
            }
        }

        function piston(nb = 1) {
            
            
            $('#piston .inner').css('height','100px');
            setTimeout(function(){
                $('#piston .inner').css('height','0px');
            },500);
        }
        


        /*
         if ($('#isdev').val()) {
         var ctxradar = document.getElementById("comchart").getContext('2d');
         var config = {
         type: 'radar',
         data: {
         datasets: [{
         data: [],
         backgroundColor: [],
         label: 'radar' // for legend
         }],
         labels: []
         },
         };
         comChart = new Chart(ctxradar,config);
         }*/
    }



});