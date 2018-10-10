/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = {
    
     price_base : 10, // the price at demand = 100%
     sell_speed_base : 1000, // the speed(ms) at demand = 100%,
     worker_cost_basis : 1,
     worker_cost_coef : 1.1,
     tickrate : 1000,
     fire_cost_basis : 1,
    
     getDemand: function (ws) {
         var percent = Math.floor(200 / ws.data.price);
         return percent;
     },
     getSpeed : function (ws) {
         var speed = parseInt(this.sell_speed_base + ws.data.workers);
         return speed;
     },
     getWorkerCost : function (workers){
         return Math.floor((this.worker_cost_basis) + workers * this.worker_cost_coef * this.worker_cost_basis);
     },
      getActualWorkerCost : function (ws){
         return (ws.data.workers * this.getWorkerCost(ws.data.workers));
     },
      getNextWorkerCost : function (ws){
         return ((ws.data.workers+1) * this.getWorkerCost(ws.data.workers + 1));
     },
     getFireCost : function(workers){
         return Math.floor((this.fire_cost_basis) + workers * this.worker_cost_coef * this.fire_cost_basis);
     }
     
};