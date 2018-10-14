/* file created by charles.torris@gmail.com */

module.exports = {
    operations : [],    
    initOp: function () {
        var ops = [];        
        ops.push({
            name: 'accountant',
            title: 'Accountant',
            price: 200,
            price_entity : 'money',
            'min': 'totalticks',
            'minv': 0, // apparition
            'mina' : 100, // availability
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
            'desc': 'Open a contract with low-morale countries that allows you to get low-cost 6 years-old workers (may impact your reputation)'
        });
        
        
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