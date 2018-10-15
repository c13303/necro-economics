/* file created by charles.torris@gmail.com */

module.exports = {
    operations : [],    
    initOp: function () {
        var ops = [];  
        ops.push({
            name: 'workers',
            title: 'Workers',
            price: 10,
            price_entity : 'money',
            'min': 'money',
            'minv': 1, // apparition
            'mina' : 1, // availability
            required_strat : null,
            'desc': 'Hire some workers to produce for you'
        });
        ops.push({
            name: 'accountant',
            title: 'Accountant',
            price: 200,
            price_entity : 'money',
            'min': 'money',
            'minv': 0, // apparition
            'mina' : 200, // availability
            required_strat : 'workers',
            'desc': 'Computer that displays some numbers that will make your business look smart.'
        });
        ops.push({
            name: 'marketing',
            title: 'Marketing Departement',
            price: 500,
            price_entity : 'money',
            'min': 'money',
            'minv': 100,
            'mina' : 500,
            required_strat : null,
            'desc': 'A fat guy with a suit and a phone that will convince people to buy your product'
        });
        
        ops.push({
            name: 'children',
            title: 'Low Cost Workers',
            price: 500,
            price_entity : 'money',
            'min': 'money',
            'minv': 200,
            'mina' : 500,
            required_strat : null,
            'desc': 'Open a contract with low-morale countries that allows you to get low-cost 6 years-old workers (may impact your reputation)'
        });
        ops.push({
            name: 'crack',
            title: 'Crack Supply',
            price: 100000,
            price_entity : 'money',
            required_strat : 'marketing',
            'min': 'money',
            'minv': 5000,
            'mina' : 25000,
            'desc': 'Makes workers more efficient'
        });
        ops.push({
            name: 'lobby',
            title: 'Lobbying',
            price: 10000,
            price_entity : 'money',
            required_strat : 'marketing',
            'min': 'money',
            'minv': 0,
            'mina' : 10000,
            'desc': 'Lobbying can help the world taking the right direction'
        });
       
        ops.push({
            name: 'spy',
            title: 'Industrial Spying',
            price: 10000,
            price_entity : 'money',
            required_strat : 'marketing',
            'min': 'money',
            'minv': 10000,
            'mina' : 10000,
            'desc': 'Hire a mole to watch into another company'
        });
        
        ops.push({
            name: 'defamation',
            title: 'Defamation',
            price: 20000,
            price_entity : 'money',
            required_strat : 'marketing',
            'min': 'money',
            'minv': 10000,
            'mina' : 20000,
            'desc': 'Defame another company on TV and make it pay for its bad reputation'
        });
        /*
        ops.push({
            name: 'partner',
            title: 'Partnership',
            price: 50000,
            price_entity : 'money',
            required_strat : 'marketing',
            'min': 'money',
            'minv': 20000,
            'mina' : 20000,
            'desc': 'Pay for a somehow win-win partnership with another company'
        });
         ops.push({
            name: 'union',
            title: 'Workers Union',
            price: 10000,
            price_entity : 'money',
            required_strat : 'marketing',
            'min': 'money',
            'minv': 10000,
            'mina' : 20000,
            'desc': 'Support a workers union and temporary double the price of workers of another company'
        });
        ops.push({
            name: 'strike',
            title: 'Strike',
            price: 10000,
            price_entity : 'money',
            required_strat : 'marketing',
            'min': 'money',
            'minv': 10000,
            'mina' : 20000,
            'desc': 'Trigger a strike into another company !'
        });
        
        
        */
       
        
        
        this.operations = ops;
    },
    findOp: function(name){
          for (i = 0; i < this.operations.length; i++) {
              if(this.operations[i].name === name){
                  return(this.operations[i]);
              }
          }
    }
}