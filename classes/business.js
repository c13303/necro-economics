/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = {

    price_base: 7, // the price at demand = 100%
    price_evol_coef : 1.4, // influence factor of price on demand
    sell_speed_base: 1000, // the speed(ms) at demand = 100%,
    worker_cost_basis: 1,
    worker_cost_coef: 1.1,
    tickrate: 1000,
    fire_cost_basis: 100,
    marketing_basis: 500,
    marketing_coef: 1.2,
    ajo: 0.01,
    children_reput_coef: 1.1,
    banqueroute: -1000000,
    hobby_freq: 180,
    hobby_window: 30,
    hobbybribemin: 10000,
    lobby_multiplicator : 3,
    spycost : 1000,
    defamecost : 100000,
    defame_ratio : 100,
    defamecooldown : 900,
    armyprogbasis : 1000000,
    armyprog_coef : 1.2,
    badbuzzduration : 30,
    badbuzzcooldown : 450,

    getDemand: function (ws) {
        /* base on price attraction */
        var percent = 200 / (Math.pow(ws.data.price, this.price_evol_coef));

        /*marketing */
        if (ws.data.strategies.marketing > 1 &&  !ws.data.strategies.badbuzzvictim) {
            percent = percent * ws.data.strategies.marketing;
        }

        /* reputation */
        var reputationimpact = this.getReputation(ws);
        
        if (ws.data.strategies.unitedcolors) {
            reputationimpact = reputationimpact / 10;
        }
        
        percent +=reputationimpact;
        
        if(ws.data.strategies.army){
            percent = percent * 1.1;
        }
        
        if(ws.data.strategies.cacao){
            percent = percent * 2;
        }

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
    getWorkerCost: function (workers) {
        /* price on 1 regular worker */
        var cost = (this.worker_cost_basis) + workers * this.worker_cost_coef * this.worker_cost_basis;
        return Math.floor(cost);
    },
    getActualWorkerCost: function (ws) {
        /* regular workers */
        var cost = ws.data.workers * this.getWorkerCost(ws.data.workers);
        return (cost);
    },
    getNextWorkerCost: function (ws) {
        return ((ws.data.workers + 1) * this.getWorkerCost(ws.data.workers + 1));
    },
    getDailyCost: function (ws) {
        var cost = this.getActualWorkerCost(ws);
        if (ws.data.strategies.children) {
            cost += ws.data.strategies.children;
        }
        return cost;
    },
    getFireCost: function (workers) {
        return Math.floor(workers * this.worker_cost_coef * this.fire_cost_basis);
    },
    getNextMarketingCost: function (ws) {
        return Math.floor((this.marketing_basis) + ((ws.data.strategies.marketing - 1) * Math.pow(this.marketing_basis, this.marketing_coef)));
    },
    getArmyProgNextCost: function (ws) {
        return Math.floor((this.armyprogbasis) + ((ws.data.strategies.army_p) * Math.pow(this.armyprogbasis, this.armyprog_coef)));
    },
    getKilled : function (ws) {
        var killed = 0;
        killed = ws.data.strategies.army_p; 
        if(ws.data.strategies.weapons) killed += killed;
        return Math.floor(killed);
    },
    getReputation: function (ws) {
        var reputation = 0;
        /* children */
        if (ws.data.strategies.children) {
            reputation += -1 * ws.data.strategies.children * Math.pow(this.children_reput_coef, ws.data.strategies.children);

        }
        if (ws.data.strategies.army_p) {
            reputation -= ws.data.strategies.army_p * 10;
        }
        if(ws.data.strategies.greenwash){ reputation += 10; }
        if(ws.data.strategies.fuckmonkey){ reputation += 100; }

        if(ws.data.strategies.badbuzzvictim){ reputation -= ws.data.strategies.badbuzzvictim; }
        
        return Math.floor(reputation);
    },
    getDailyProduction: function (ws) {
        var prod = 0;
        if (ws.data.workers)
            prod += ws.data.workers;
        if (ws.data.strategies.crack)
            prod += ws.data.workers;
        if (ws.data.strategies.suicidenets)
            prod += ws.data.workers * 2;
        
        if (ws.data.strategies.children)
            prod += ws.data.strategies.children;
        
        if (ws.data.strategies.torture) prod = prod * 2;
        
        if (ws.data.strategies.meat) prod += ws.data.strategies.killed /2;
        
        return(Math.floor(prod));
    },
    getRandomInt : function(max){
          return Math.floor(Math.random() * Math.floor(max));  
    },
    getIncome: function (ws) {

        var sale = {};
        sale.demand = this.getDemand(ws);      /* 10 */
        sale.vendus = Math.floor(Math.pow(sale.demand, 2) * Math.pow(10, -2));

        /* un zeste de random */
        sale.vendus -= this.getRandomInt(sale.vendus / 10);
        sale.vendus += this.getRandomInt(sale.vendus / 10);
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
            sale.income = sale.income * this.lobby_multiplicator;
        }
        
        return(sale);

    }

};