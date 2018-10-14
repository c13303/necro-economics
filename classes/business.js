/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = {

    price_base: 10, // the price at demand = 100%
    sell_speed_base: 1000, // the speed(ms) at demand = 100%,
    worker_cost_basis: 1,
    worker_cost_coef: 1.1,
    tickrate: 1000,
    fire_cost_basis: 100,
    marketing_basis: 500,
    marketing_coef: 1.7,
    ajo: 0.5,    
    

    getDemand: function (ws) {
        /* base on price attraction */
        var percent = 200 / (Math.pow(ws.data.price, 1.5));

        /*marketing */
        if (ws.data.strategies.marketing > 1) {
            percent = percent * ws.data.strategies.marketing;
        }

        return Math.floor(percent);
    },
    getRandomRange: function (ws) {

    },
    getSpeed: function (ws) {
        var speed = parseInt(this.sell_speed_base + ws.data.workers);
        return speed;
    },
    getWorkerCost: function (workers) {
        return Math.floor((this.worker_cost_basis) + workers * this.worker_cost_coef * this.worker_cost_basis);
    },
    getActualWorkerCost: function (ws) {
        return (ws.data.workers * this.getWorkerCost(ws.data.workers));
    },
    getNextWorkerCost: function (ws) {
        return ((ws.data.workers + 1) * this.getWorkerCost(ws.data.workers + 1));
    },
    getFireCost: function (workers) {
        return Math.floor(workers * this.worker_cost_coef * this.fire_cost_basis);
    },
    getNextMarketingCost: function (ws) {
        return Math.floor((this.marketing_basis) + ((ws.data.strategies.marketing - 1) * this.marketing_coef * this.marketing_basis));
    },

};