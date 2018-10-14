/* file created by charles.torris@gmail.com */

module.exports = {
    operations : [],    
    initOp: function () {
        var ops = [];        
        ops.push({
            name: 'accountant',
            title: 'Accountant',
            price: 100,
            price_entity : 'money',
            'min': 'totalticks',
            'minv': 100,
            'desc': 'Computer that displays some numbers that will make your business look smart.'
        });
        ops.push({
            name: 'marketing',
            title: 'Marketing Departement',
            price: 500,
            price_entity : 'money',
            'min': 'money',
            'minv': 500,
            'desc': 'A fat guy with a suit and a phone that will convince people to buy your product'
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