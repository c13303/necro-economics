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

function fnum(x) {
    if (isNaN(x))
        return x;

    if (x < 0) {
        return x.toLocaleString();
    }

    if (x < 9999) {
        return x;
    }

    if (x < 1000000) {
        return x.toLocaleString();
    }
    if (x < 10000000) {
        return (x / 1000000).toFixed(2) + "M";
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
    marketing_level: 0,
    source_level: 0,
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



    function numbers_refresh() {
        $('.stat').each(function () {
            var stat = $(this).data('p');
            var strat = $(this).data('s');
            if(stat)
            $(this).html(p[stat]);
            if(strat && p.strategies)
                $(this).html(fnum(p.strategies[strat]));
        });
    }




    // WS //
    function connect() {
        clearTimeout(autoreco);
        token = $('#password').val();
        user = $('#username').val();
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


            var d = JSON.parse(event.data);
            console.log(d);
            p = d; /* looool*/

            /* format some values for display */
            if (p.r) {
                p.moneydisplay = Math.floor(p.money);
                p.moneydisplay = p.moneydisplay.toLocaleString();
                ntargets.money = Math.floor(p.money);
                p.annee = Math.floor(p.tick / 365);
                p.jrestant = p.tick - (p.annee * 365);
                p.nmcdisplay = fnum(p.nmc);
                p.dailybalance = p.daily.income - p.dailycost;
                p.dailysales = p.daily.sales;
                p.dailyincome = p.daily.income;
            }
            
            if(p.nmc > p.money){
                $('.comlaunch').attr('disabled','disabled');
            } else {
                $('.comlaunch').removeAttr('disabled');
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
                p.spydata.income = p.spydata.daily.income.toLocaleString() + '€';
                p.spydata.commercials = fnum(p.spydata.marketing_level) + '';
                p.spydata.strats = '';
                $.each(p.spydata.strategies, function (index, value) {
                     p.spydata.strats += '['+index+':'+value+']';
                }); 
              
                
                
                $('#spydata .field').each(function () {
                    $(this).html('<b>' + $(this).data('f') + '</b> : ' + p.spydata[$(this).data('f')]);
                });
            }

            if (d.opbible) {
                var html = '';
                for (i = 0; i < d.opbible.length; i++) {
                    var op = d.opbible[i];
                    html += '<div id="buy_' + op.name + '" class="operation disabled command" data-min="' + op.min + '" data-required_strat="' + op.required_strat + '" data-mina="' + op.price + '" data-minv="' + op.minv + '" data-c="buy" data-v="' + op.name + '" >';
                    html += '<b>' + op.title + '</b> (' + fnum(op.price) + ' ' + op.price_entity + ') <br/>' + op.desc + '</div>';
                }
                $('#tools .container').html(html);
            }

            if (d.banqueroute) {
                alert('Bankruptcy !!!!');
            }

            if (d.reset) {
                window.location.replace("/?" + isdev + "message=Account has been reset&disablereconnect=1");
            }

            if(d.modal){ 
                if ($("#infomodal").hasClass('in')) {
                     $('#infomodal_content').append('<br/>'+d.modal);
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



            if (d.refresh) {
                /* refresh competitors */
                var clients = d.refresh;
                var html = '<table>';
                for (i = 0; i < clients.length; i++) {
                    var data = clients[i];
                    var button = '';
                    if (data.name !== user) {
                        if (p.strategies.spy) {
                            button += '<button class="command" data-c="spy" data-v="' + data.name + '">spy (1K€)</but>';
                        }
                        if (p.strategies.defamation && !p.strategies.defamecooldown) {
                            button += '<button class="command" data-c="defame" data-v="' + data.name + '">defame (100K€)</but>';
                        }
                        if (p.strategies.badbuzz && !p.strategies.badbuzzcooldown) {
                            button += '<button class="command" data-c="badbuzz" data-v="' + data.name + '">bad buzz (1M€)</but>';
                        }
                    }
                    
                    
                    html+='<tr><td><b>' + data.name + '</b></td><td>' + fnum(data.money) + '€</td>\n\
<td>' + fnum(data.score) + '</td><td>' + data.product + '</td><td>' + button + '</td></tr>';
                }
                $('#clients').html(html+'</table>');
            }

            /* console display */
            if (p.console) {
                for (i = 0; i < p.console.length; i++) {
                    $('#console').append('<br/>' + p.tick + ' : ' + p.console[i]);
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
                $('.operation').each(function () {
                    var min = $(this).data('min');
                    var minv = $(this).data('minv');
                    var mina = $(this).data('mina');
                    var name = $(this).data('v');
                    var required_strat = $(this).data('required_strat');

                    //console.log(name+ ' : ' + min+ ': '+p[min] + ' vs '+minv);




                    if (p[min] >= minv && !p.strategies[name] && (!required_strat || p.strategies[required_strat])) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                    if (p[min] >= mina && !p.strategies[name]) {
                        $(this).removeClass('disabled');
                    } else {
                        $(this).addClass('disabled');
                    }
                });

                $('.strategic').each(function () {
                    var name = $(this).data('strat');
                    if (p.strategies[name]) {
                        $(this).show();
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




                if (p.strategies.marketing)
                {
                    p.commercials = p.strategies.marketing;

                }
                if (p.strategies.army){
                }


                if (p.strategies.accountant) {

                    p.sold = (p.score - p.unsold);
                    p.salesperday = Math.round(p.sold / p.totalticks, 2);
                    p.moneyperday = Math.floor(p.money / p.totalticks);
                    p.workeravg = fnum(Math.floor(p.actual_worker_cost / p.workers ));
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





            numbers_refresh();



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
            var command = JSON.stringify({command: 'make', value: 1});
            ws.send(command);
            $('#make').attr('disabled', 'disabled');
            setTimeout(function () {
                $('#make').removeAttr('disabled');
            }, p.max);
        });


        $(document).on('click', '.command', function () {
            console.log('command' + $(this).data('c'));
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



});