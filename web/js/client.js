/* file created by charles.torris@gmail.com */

var port = 8080;


var autoclickFreq = 1000;
var lagCompensation = 100;
var refreshRate = 10000;
var autoTimeout = null;
var statdays = [];
var statd = 0;
var statrange = 10;

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

    // UI //


    $('#connect').submit(function (e) {
        e.preventDefault();
        connect();
    });



    function numbers_refresh() {
        $('.stat').each(function () {
            var stat = $(this).data('p');
            $(this).html(p[stat]);
        });
    }




    // WS //
    function connect() {
        var token = $('#password').val();
        var user = $('#username').val();
        var port = $('#porc').val();
        try {
            var ws = new WebSocket('ws://51.15.181.30:' + port + '/' + token + '-' + user);
        } catch (e) {
            alert(e);
        }

       

        ws.onerror = function (e) {
            alert('Unacceptable login [possible reasons : double login, wrong password, server closed]');
            window.location.reload();
        };

        ws.onmessage = function (event) {           
            
            
            var d = JSON.parse(event.data);
            console.log(d);
            p = d; /* looool*/

            /* format some values for display */
            p.money = Math.floor(p.money);
            p.annee = Math.floor(p.tick / 365);
            p.jrestant = p.tick - (p.annee * 365);

            if (d.chooseproduct) {
                /* product selection if not selected */
                $('#connect').hide();
                $('#productname').show();
            }

            if (d.init) {
                /* start UI */
                $('#console').html(d.user + ' connected');
                $('#top').hide();
                $('#productname').hide();
                $('#game').show();
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
                $('#clients').html('');
                for (i = 0; i < clients.length; i++) {
                    var data = clients[i];
                    $('#clients').append('<li>' + data.name + ' ' + data.money + '€, ' + data.score + ' ' + data.product + '(s) </li>');
                }
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
                $('#stats').removeClass("hidden");
                p.sold = (p.score - p.unsold);
                p.salesperday = Math.round(p.sold / p.totalticks, 2);
                p.moneyperday = Math.floor(p.money / p.totalticks);
                

                statdays[statd] = {
                    'sales': p.lastvente,
                    'price': p.price,
                    'cost': p.actual_worker_cost
                };

                statd++;
                if (statd > statrange)
                    statd = 0;
                var total_sales = 0;
                var total_money = 0;
                var total_cost = 0;

                if (statdays.length >= statrange) {
                    for (i = 0; i < statrange; i++) {
                        total_sales += statdays[i].sales;
                        total_cost += statdays[i].cost;
                        total_money += statdays[i].sales * statdays[i].price - total_cost;
                        
                    }
                   p.statrange = statrange;
                   p.period_sales = total_sales;
                   p.period_salesperday = Math.floor(total_sales/statdays.length);
                   p.period_moneyperday = Math.floor(total_money/statdays.length);
                } else {
                    p.period_sales = 'Gathering data ...' + statdays.length +' days';
                }



            }





            numbers_refresh();
            


        };

        function ping() {
            setTimeout(function () {
                if (ws.readyState === ws.CLOSED) {
                    alert('Server update ! Please relog');
                    window.location.reload();
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


        /* send make */
        $('#make').click(function () {
            $('#make').attr('disabled', 'disabled');
            setTimeout(function () {
                $('#make').removeAttr('disabled');
            }, p.max);
        });


        $('.command').click(function () {
            var c = $(this).data('c');
            var v = $(this).data('v');
            try {
                ws.send(JSON.stringify({command: c, value: v}));
               
            } catch (e) {
                alert('Server disconnected, please relog');
                window.location.reload();
            }

        });




    }



});