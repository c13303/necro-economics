/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = {
    random: null,
    price_base: 7, // the price at demand = 100%
    price_evol_coef: 1.4, // influence factor of price on demand
    sell_speed_base: 1000, // the speed(ms) at demand = 100%,
    worker_cost_basis: 1,
    worker_cost_coef: 1.05,
    tickrate: 1000,
    fire_cost_basis: 10,
    marketing_basis: 500,
    marketing_coef: 2,
    ajo: 0.0,
    children_reput_coef: 1.1,
    banqueroute: -1000000,
    hobby_freq: 180,
    hobby_window: 30,
    hobbybribemin: 10000,
    lobby_multiplicator: 3,
    spycost: 1000,
    defamecost: 100000,
    defame_ratio: 100,
    defamecooldown: 900,
    armyprogbasis: 1000000,
    armyprog_coef: 1.2,
    badbuzzduration: 30,
    badbuzzcooldown: 450,
  
    lc_worker_basis : 50,
    lc_worker_coef : 1.1,
    avocat_basis : 500000,
    avocat_coef : 5,
    
    
    fnum: function (x) {
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

    },
    formatEntity : function(ent){
      if(ent==='money')
        return '€';
      if(ent==='btc')
        return 'BTC';
    
        return(ent);
    },
    getDemand: function (ws) {
        /* base on price attraction */
        //  var percent = 200 / (Math.pow(ws.data.price, this.price_evol_coef));

        var maximumfactor = ws.data.strategies.marketing ? Math.floor(20 + (ws.data.strategies.marketing / 2)) : 20;

        var percent = 25 - (Math.pow(150, ws.data.price / maximumfactor));

        /*marketing */
        if (ws.data.strategies.marketing > 1 && !ws.data.strategies.badbuzzvictim) {
            percent = percent * (ws.data.strategies.marketing - 1);
        }
        
        if(ws.data.strategies.bio) percent += 100;

        /* reputation */
        var reputationimpact = this.getReputation(ws);
      //  if(reputationimpact > 0) reputationimpact = reputationimpact * 0.5;
        if (ws.data.strategies.unitedcolors && reputationimpact <0) reputationimpact = reputationimpact / 10;
        
        if(ws.data.strategies.freeclips) percent = percent * 2;
        if(ws.data.strategies.penguins) percent = percent * 3;

        if(ws.data.strategies.darkweb) 
            percent = percent * 10;
        
        percent += reputationimpact;

        if (ws.data.strategies.cacao) {
            percent = percent * 2;
        }
        if(ws.data.strategies.supremacy)
            percent = percent * 10;


        /* security keep it last */
        if (percent < 0)
            percent = 0;   

        return Math.floor(percent);
    },
    getRandomRange: function (ws) {

    },
    getSpeed: function (ws) {
        var speed = parseInt(this.sell_speed_base + ws.data.workers);
        return speed;
    },
    getWorkerCost: function (workers, ws) {
        /* price on 1 regular worker */
        var cost = (this.worker_cost_basis) + workers * this.worker_cost_coef * this.worker_cost_basis;
        if (ws.data.strategies.startup) {
            cost = cost * 0.25;
        }
        if (ws.data.strategies.suicidenets) {
            cost = cost * 0.25;
        }
        if (ws.data.strategies.migration) {
            cost = cost * 0.25;
        }
        
        if(ws.data.strategies.robots){
            cost = cost * 10;
        }
        
        return cost;
    },
    getActualWorkerCost: function (ws) {
        /* regular workers */
        var cost = ws.data.workers * this.getWorkerCost(ws.data.workers, ws);
        if (ws.data.strategies.onstrike) {
            cost = 0;
        }
        return (cost);
    },
    getNextWorkerCost: function (ws) {
        return ((ws.data.workers + 1) * this.getWorkerCost(ws.data.workers + 1, ws));
    },
    getDailyCost: function (ws) {
        var cost = this.getActualWorkerCost(ws);
        if (ws.data.strategies.children) {
            cost += ws.data.strategies.children;
        }
        return cost;
    },
    getFireCost: function (workers,ws) {
        var cost = workers * this.worker_cost_coef * this.fire_cost_basis;
        
        if(ws.data.strategies.robots) cost = 0;
        return Math.floor(cost);
    },
    getNextMarketingCost: function (ws) {
        var cost = this.marketing_basis + Math.pow(ws.data.strategies.marketing, 4);
        if (ws.data.strategies.bigdata)
            cost = cost / 5;
        
        if(ws.data.strategies.heroin)
            cost = cost / 4;
        
        return Math.floor(cost);
    },
    getArmyProgNextCost: function (ws) {
        return Math.floor((this.armyprogbasis) + ((ws.data.strategies.army_p) * Math.pow(this.armyprogbasis, this.armyprog_coef)));
    },
    getKilled: function (ws) {
        var killed = 0;
        killed = ws.data.strategies.army_p;
        if (ws.data.strategies.weapons)
            killed += killed;
        if (ws.data.strategies.education)
            killed += ws.data.strategies.children;
        if (ws.data.strategies.smartphones)
            killed += ws.data.strategies.army_p;
        if (ws.data.strategies.justice)
            killed += this.getDemand(ws);
        if (ws.data.strategies.toys)
            killed += ws.data.workers * 10;
        if (ws.data.strategies.warm > 1.5)
            killed += ws.data.strategies.warm  * Math.pow(ws.data.strategies.warm,5);

        return Math.floor(killed);
    },
    getReputation: function (ws) {
        var reputation = 0;
        /* children */
        //if (ws.data.workers) { reputation += ws.data.workers / 5;  }
        
        if (ws.data.strategies.children) {
            reputation += -1 * ws.data.strategies.children - ((ws.data.strategies.children-1) * 0.5);
        }
        
        if (ws.data.strategies.bio) {
            reputation += 25;
        }
        if (ws.data.strategies.spaceweedtv) {
            reputation += 75;
        }
        if (ws.data.strategies.government) {
            reputation += 250;
        }
        if (ws.data.strategies.badbuzzvictim) {
            reputation -= ws.data.strategies.badbuzzvictim;
        }
       
        
        if(ws.data.strategies.defamecooldown){
            reputation -=ws.data.strategies.defamecooldown/ 10;
        }
        
        /* ngo en dernier ! */
         if (ws.data.strategies.ngo && reputation < 0) {
            var moneybasis = Math.floor(ws.data.money / 1000000); //M
            if (moneybasis<1)
                moneybasis = 1;
            reputation += ws.data.strategies.ngo / moneybasis;
            if(reputation > 0){
                reputation = reputation * 0.005;
            }
        }

        return Math.floor(reputation);
    },
    getDailyProduction: function (ws) {
        var prod = 0;
        
        if (ws.data.workers)
            prod += ws.data.workers;
        
        if (ws.data.strategies.startup)
            prod += ws.data.workers / 2;
        
        if (ws.data.strategies.children)
            prod += ws.data.strategies.children;
        
        if (ws.data.strategies.remotework && ws.data.strategies.children)
            prod += ws.data.strategies.children;
        
        if (ws.data.strategies.liberty && ws.data.strategies.children)
            prod += ws.data.strategies.children;
        
        if (ws.data.strategies.crack)
            prod += ws.data.workers;
        
        if (ws.data.strategies.wc)
            prod += ws.data.workers;
        
        if (ws.data.strategies.brains)
            prod += ws.data.workers * 10;
        
        if (ws.data.strategies.torture)
            prod = prod * 20;
        
        if (ws.data.strategies.meat)
            prod += ws.data.killed / 2;
        
        if (ws.data.strategies.onstrike)
            prod = 0;      
        
        if(ws.data.strategies.robots)
            prod += ws.data.workers * 100;
        
        if(ws.data.strategies.robots && ws.data.strategies.malware)
            prod += ws.data.workers * 100;

        return(Math.floor(prod));
    },
    getRandomInt: function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    },
    getTaxCoef : function(ws){
        var coef = 3;
         if(ws.data.strategies.corruption) coef = 5;
         return (coef);
        
    },
    
    
    /* SALES / PRODUCTIONS / INCOME */
    getIncome: function (ws) {

        var sale = {};
        sale.demand = this.getDemand(ws);    

       // var de = this.getRandomInt(2);
        var factor = 9;

        sale.vendus = sale.demand / ws.data.price;
        
        if (ws.data.strategies.openspace) {
            sale.vendus += ws.data.workers / 2;
            if (ws.data.strategies.children)
                sale.vendus += ws.data.strategies.children / 2;
        }

        sale.vendus = Math.floor(sale.vendus);

        /* un zeste de random */
        if (this.random) {
            sale.vendus -= this.getRandomInt(sale.vendus / 10);
            sale.vendus += this.getRandomInt(sale.vendus / 10);
        }
        
        if(ws.data.strategies.subliminal){
            sale.vendus = sale.vendus * 2;
        }
        
        
        sale.wanted = sale.vendus;
        sale.unsold = ws.data.unsold;
        ws.data.totalticks++;
        if (sale.unsold <= sale.vendus) {
            sale.mank = sale.unsold - sale.vendus;
            sale.unsold = 0;
            sale.vendus += sale.mank;
        } else {
            sale.unsold -= sale.vendus;
        }
        sale.income = ws.data.price * sale.vendus;

        if (ws.data.strategies.tax_dogde) {
            var coef = this.getTaxCoef(ws);
           
            sale.income = sale.income * coef;
        }

        if (ws.data.strategies.ngo) {
            sale.income -= ws.data.strategies.ngo;
        }
        
        


        return(sale);

    },
    getBlackMagicNextCost: function (ws) {
        var cost = (1000) +  Math.pow(ws.data.magicpower,2.7);

        return(Math.floor(cost));

    },
    getBtcProd: function (ws) {
        var prod = ws.data.strategies.farm * 0.2;
        var warm = ws.data.strategies.farm / 53;
        
        if(ws.data.strategies.bicycle)
            prod = prod * 2;
        if(ws.data.strategies.planet)
            warm = warm + ws.data.unsold / 100000000000;
        
        return({'prod': prod, 'warm': warm});
    },
    getBtcFarmNextCost: function (ws) {
        
         var cost = 10000000 + ((ws.data.strategies.farm) *
         Math.pow(10000000, 1.1));
         
        return(Math.floor(cost));
    },
    getNextLcWorkerCost : function(ws){
        var cost =this.lc_worker_basis + Math.pow(ws.data.strategies.children-1, 2.5);
        
        if(ws.data.strategies.easyjet)
            cost = cost / 2;
        
        return Math.floor(cost);
        
    },
    getAvocatNextCost : function(ws){
        var cost =this.avocat_basis + (ws.data.strategies.avocats) * this.avocat_basis * this.avocat_coef;
        return Math.floor(cost);
        
    },
    getLobbyCoolDown : function(ws){
        var cool = 1800;
        return(cool);
    }



};