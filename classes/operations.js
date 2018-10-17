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
            'desc': 'Makes workers more efficient'
        });
        ops.push({
            name: 'suicidenets',
            title: 'Anti-Suicide Nets',
            price: 400000,
            price_entity : 'money',
            required_strat : 'crack',
            'min': 'money',
            'minv': 100000,
            'desc': 'Helps being happy at work. Doubles the production of regular workers'
        });
        
        ops.push({
            name: 'torture',
            title: 'Pyramidical Torture Management',
            price: 2000000,
            price_entity : 'money',
            required_strat : 'suicidenets',
            'min': 'money',
            'minv': 2000000,
            'desc': 'Everyone can enjoy power abuse on someone else. Doubles the production of your full workforce'
        });
        ops.push({
            name: 'badbuzz',
            title: 'Bad Buzz',
            price: 1000000,
            price_entity : 'money',
            required_strat : 'children',
            'min': 'money',
            'minv': 50000,
            'desc': 'Hire a community manager to make fun of opponents commercial campaigns'
        });
        
        ops.push({
            name: 'unitedcolors',
            title: 'United Colors of Liberty',
            price: 10000000,
            price_entity : 'money',
            required_strat : 'children',
            'min': 'money',
            'minv': 2000000,
            'desc': 'A heart-breaking commercial campaign that will reduce the negative impact of reputation on the public demand'
        });
        ops.push({
            name: 'greenwash',
            title: 'Green Generation TV Reality',
            price: 50000,
            price_entity : 'money',
            required_strat : 'children',
            'min': 'money',
            'minv': 10000,
            'desc': 'Send some potheads listening to reggae into space, earn some reputation'
        });
        ops.push({
            name: 'fuckmonkey',
            title: 'TV Show',
            price: 1000000,
            price_entity : 'money',
            required_strat : 'greenwash',
            'min': 'money',
            'minv': 500000,
            'desc': 'Just go on TV and get popular'
        });
        
        ops.push({
            name: 'cacao',
            title: 'Cacao',
            price: 10000,
            price_entity : 'killed',
            required_strat : 'marketing',
            'min': 'killed',
            'minv': 0,
            'desc': 'Put some cacao in your products. So Delicious !! Raise the public demand by 100%'
        });
        
        ops.push({
            name: 'meat',
            title: 'Soylent Green',
            price: 2000000000,
            price_entity : 'money',
            required_strat : 'army',
            'min': 'killed',
            'minv': 1000,
            'desc': 'Recycle war victims into nutrients. Improves productivity.'
        });
        
        
        ops.push({
            name: 'lobby',
            title: 'Lobbying',
            price: 10000,
            price_entity : 'money',
            required_strat : 'marketing',
            'min': 'money',
            'minv': 0,
            'desc': 'Lobbying can help the world taking the right direction'
        });
       
        ops.push({
            name: 'spy',
            title: 'Industrial Spying',
            price: 10000,
            price_entity : 'money',
            required_strat : 'marketing',
            'min': 'money',
            'minv': 5000,
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
            'desc': 'A lawyer that can defame another company on TV, and make it pay for its bad reputation'
        });
        
        
        ops.push({
            name: 'army',
            title: 'Deal with the Army',
            price: 4000000,
            price_entity : 'money',
            required_strat : 'marketing',
            'min': 'money',
            'minv': 500000,
            'desc': 'Make a deal the army and reach new territories.'
        });
        
        
        ops.push({
            name: 'weapons',
            title: 'AK47 Mark XI',
            price: 1000000000,
            price_entity : 'money',
            required_strat : 'army',
            'min': 'money',
            'minv': 500000000,
            'desc': 'This is a simple revision of the classical AK47, but with real counter strike skins paint on it. So cool ! Will improve army operations efficiency'
        });
        
        
        ops.push({
            name: 'magic',
            title: 'Business Rituals',
            price: 5000000,
            price_entity : 'money',
            required_strat : 'army',
            'min': 'money',
            'minv': 1000000,
            'desc': 'Train your executives to cutting edge management methods'
        });
        
               
        ops.push({
            name: 'strike',
            title: 'Worker\'s union',
            price: 500000,
            price_entity : 'money',
            required_strat : 'union',
            'min': 'money',
            'minv': 200000,
            'desc': 'Support the workers union to organize a 60 days strike in another company'
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