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
    blackmagiccorpsesprice: 1000,
    blackmagiccoef: 1.5,
    btcfarmprice: 100000000,
    btcfarmcoef: 1.2,
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
    getDemand: function (ws) {
        /* base on price attraction */
        //  var percent = 200 / (Math.pow(ws.data.price, this.price_evol_coef));

        var maximumfactor = ws.data.strategies.marketing ? Math.floor(20 + (ws.data.strategies.marketing / 2)) : 20;

        var percent = 25 - (Math.pow(150, ws.data.price / maximumfactor));

        /*marketing */
        if (ws.data.strategies.marketing > 1 && !ws.data.strategies.badbuzzvictim) {
            percent = percent * ws.data.strategies.marketing;
        }

        /* reputation */
        var reputationimpact = this.getReputation(ws);

        if (ws.data.strategies.unitedcolors) {
            reputationimpact = reputationimpact / 10;
        }

        percent += reputationimpact;

        /*
         if(ws.data.strategies.army){
         percent = percent * 1.1;
         }*/

        if (ws.data.strategies.cacao) {
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
    getWorkerCost: function (workers, ws) {
        /* price on 1 regular worker */
        var cost = (this.worker_cost_basis) + workers * this.worker_cost_coef * this.worker_cost_basis;
        if (ws.data.strategies.startup) {
            cost -= 1;
        }
        if (ws.data.strategies.suicidenets) {
            cost = cost * 0.75;
        }
        if (ws.data.strategies.migration) {
            cost = cost / 2;
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
    getFireCost: function (workers) {
        var cost = workers * this.worker_cost_coef * this.fire_cost_basis;
        return Math.floor(cost);
    },
    getNextMarketingCost: function (ws) {
        var cost = this.marketing_basis + Math.pow(ws.data.strategies.marketing, 4);
        if (ws.data.strategies.bigdata)
            cost = cost / 2;
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
            killed += ws.data.strategies.warm * 10000;

        return Math.floor(killed);
    },
    getReputation: function (ws) {
        var reputation = 0;
        /* children */
        if (ws.data.strategies.children) {
            reputation += -2 * ws.data.strategies.children * Math.pow(this.children_reput_coef, ws.data.strategies.children);
        }
        if (ws.data.strategies.army_p) {
            reputation -= ws.data.strategies.army_p * 10;
        }
        if (ws.data.strategies.bio) {
            reputation += 5;
        }
        if (ws.data.strategies.spaceweedtv) {
            reputation += 10;
        }
        if (ws.data.strategies.government) {
            reputation += 100;
        }
        if (ws.data.strategies.badbuzzvictim) {
            reputation -= ws.data.strategies.badbuzzvictim;
        }
        if (ws.data.strategies.ngo) {
            var moneybasis = Math.floor(ws.data.money / 1000000); //M
            if (!moneybasis)
                moneybasis = 1;
            reputation += ws.data.strategies.ngo / moneybasis;
        }
        
        if(ws.data.strategies.defamecooldown){
            reputation -=ws.data.strategies.defamecooldown;
        }
        

        return Math.floor(reputation);
    },
    getDailyProduction: function (ws) {
        var prod = 0;
        if (ws.data.workers)
            prod += ws.data.workers;

        if (ws.data.strategies.children)
            prod += ws.data.strategies.children;
        if (ws.data.strategies.remotework && ws.data.strategies.children)
            prod += ws.data.strategies.children;

        if (ws.data.strategies.crack)
            prod += ws.data.workers;
        if (ws.data.strategies.wc)
            prod += ws.data.workers;
        if (ws.data.strategies.torture)
            prod = prod * 2;
        if (ws.data.strategies.meat)
            prod += ws.data.killed / 2;

        if (ws.data.strategies.onstrike) {
            prod = 0;
        }


        return(Math.floor(prod));
    },
    getRandomInt: function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    },
    getIncome: function (ws) {

        var sale = {};
        sale.demand = this.getDemand(ws);     /* 10 */

        var de = this.getRandomInt(2);
        var factor = 9;

        sale.vendus = sale.demand / factor;

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

        if (ws.data.strategies.ngo) {
            sale.income -= ws.data.strategies.ngo;
        }


        return(sale);

    },
    getBlackMagicNextCost: function (ws) {
        var cost = (this.blackmagiccorpsesprice) + ((ws.data.magicpower) *
                Math.pow(this.blackmagiccorpsesprice, this.blackmagiccoef));

        return(Math.floor(cost));

    },
    getBtcProd: function (ws) {
        var prod = ws.data.strategies.farm * 0.02;
        var warm = ws.data.strategies.farm / 53;
        return({'prod': prod, 'warm': warm});
    },
    getBtcFarmNextCost: function (ws) {
        /*
         var cost = (this.btcfarmprice) + ((ws.data.strategies.farm) *
         Math.pow(this.btcfarmprice, this.btcfarmcoef));
         */
        return(Math.floor(this.btcfarmprice));
    }



};