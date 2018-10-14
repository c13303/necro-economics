/* file created by charles.torris@gmail.com */

var port = 8080;


var autoclickFreq = 1000;
var lagCompensation = 100;
var refreshRate = 10000;
var autoTimeout = null;
var statdays = [];
var statd = 0;
var statrange = 10;




function fnum(x) {
	if(isNaN(x)) return x;

	if(x < 9999) {
		return x;
	}

	if(x < 1000000) {
		return x.toLocaleString();
	}
	if( x < 10000000) {
		return (x/1000000).toFixed(2) + "M";
	}

	if(x < 1000000000) {
		return Math.round((x/1000000)) + "M";
	}

	if(x < 1000000000000) {
		return Math.round((x/1000000000)) + "B";
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
       var isdev = "dev="+$('#isdev').val()+"&";
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
            window.location.replace("/?"+isdev+"message=Login Failed : double login, wrong password or server down");

        };

        ws.onmessage = function (event) {


            var d = JSON.parse(event.data);
            console.log(d);
            p = d; /* looool*/

            /* format some values for display */
            if (p.money) {
                p.money = Math.floor(p.money);
                p.money = p.money.toLocaleString();
                p.annee = Math.floor(p.tick / 365);
                p.jrestant = p.tick - (p.annee * 365);
                p.nmc = fnum(p.nmc);
            }
            
            
            if(p.tools && p.tools.ajo){ 
                $('.ajo').show();
                p.ajo = p.tools.ajo;
            } else $('.ajo').hide();

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
            
            
            if(d.opbible){                
                var html = '';
                for(i=0;i<d.opbible.length;i++){
                    var op = d.opbible[i];
                    html+= '<div id="buy_'+op.name+'" class="operation command" data-min="'+op.min+'" data-minv="'+op.minv+'" data-c="buy" data-v="'+op.name+'" >';
                    html+= '<b>'+op.title+'</b> ('+op.price+' '+op.price_entity+') <br/>'+op.desc+'</div>';                    
                }
                $('#tools .container').html(html);                
            }
            
            

            if(d.reset){
                 window.location.replace("/?"+isdev+"message=Account has been reset");
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
                $('#clients').html('<table>');
                for (i = 0; i < clients.length; i++) {
                    var data = clients[i];
                    $('#clients').append('<tr><td><b>' + data.name + '</b></td><td>' + fnum(data.money) + '€</td><td>' + fnum(data.score) + '</td><td>' + data.product + '</td></tr>');
                }
                $('#clients').append('</table>');
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
               
               /* display or hide the ops */
               $('.operation').each(function(){
                  var min = $(this).data('min');
                  var minv = $(this).data('minv');
                  var name = $(this).data('v');
                //  console.log(p[min] + ' vs '+minv);
                  if(p[min] >= minv && !p.strategies[name]){
                      $(this).show();
                  } else {
                      $(this).hide();
                  }
               });
               
               
               /* specific operations */

                if (p.strategies.marketing)
                {
                    p.commercials = p.strategies.marketing;
                    $('.marketing').show();

                } else
                    $('.marketing').hide();


              
                if (p.strategies.accountant) {
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
                            total_money += statdays[i].sales * statdays[i].price - statdays[i].cost;

                        }
                        p.statrange = statrange;
                        p.period_sales = total_sales;
                        p.period_salesperday = Math.ceil(total_sales / statdays.length);
                        p.period_moneyperday = Math.ceil(total_money / statdays.length);
                    } else {
                        p.period_sales = 'Gathering data ...' + statdays.length + ' days';
                    }



                }
            }
            /* update requirements */
            $('.requirement').each(function(){
                var min = $(this).data('min');
                var value = $(this).data('minv');
                if(min==='money'){
                    if(value >= p.money){
                        $(this).removeAttr('disabled');
                    } else {
                        $(this).attr('disabled','disabled');
                    }
                }
            });





            numbers_refresh();



        };

        function ping() {
            setTimeout(function () {
                if (ws.readyState === ws.CLOSED) {
                    
                    window.location.replace("/?"+isdev+"message=Serveur has updated ! Please Relog !");
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


        $('body').on('click','.command',function () {
            var c = $(this).data('c');
            var v = $(this).data('v');

            ws.send(JSON.stringify({command: c, value: v}));


        });




    }



});