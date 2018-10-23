/* file created by charles.torris@gmail.com */

module.exports = {
    operations: [],
    initOp: function () {
        var ops = [];

        /* productivity */
        ops.push({
            name: 'workers',
            title: 'Workers',
            price: 10,
            price_entity: 'money',
            'min': 'money',
            'minv': 1, // apparition
            required_strat: null,
            'desc': 'Hire some workers to produce for you.'
        });
        ops.push({
            name: 'accountant',
            title: 'Accountant',
            price: 200,
            price_entity: 'money',
            'min': 'money',
            'minv': 0, // apparition
            required_strat: 'workers',
            'desc': 'Computer that displays some numbers that will make your business look smart.'
        });
        ops.push({
            name: 'marketing',
            title: 'Marketing Departement',
            price: 500,
            price_entity: 'money',
            'min': 'money',
            'minv': 100,
            required_strat: null,
            'desc': 'A fat guy with a suit and a phone that will convince people to buy your product.',
            'buf' : '++public demand'
        });

        ops.push({
            name: 'children',
            title: 'Low Cost Workers',
            price: 500,
            price_entity: 'money',
            'min': 'money',
            'minv': 200,
            required_strat: null,
            'desc': 'Open a contract with low-morale countries that allows you to get low-cost 6 years-old workers',
            'buf' : '1€ workers, --reputation'
        });
              
              
              

        ops.push({
            name: 'startup',
            title: 'Startup Human Resources',
            price: 30000,
            price_entity: 'money',
            required_strat: 'marketing',
            'min': 'money',
            'minv': 0,
            'desc': 'Overtime is just an elementary thing when you work in a startup. Makes workers salaries a little bit cheaper',
            'buf' : 'cost -1€ per worker'
        });

         ops.push({
            name: 'wc',
            title: 'More Toilets',
            price: 50000,
            price_entity: 'money',
            required_strat: 'startup',
            'min': 'money',
            'minv': 0,
            'desc': 'More toilets means more shit done. Doubles the workers production',
            'buf' : 'regular workers production x 2'
        });
        
        ops.push({
            name: 'remotework',
            title: 'Remote Work',
            price: 50000,
            price_entity: 'money',
            required_strat: 'startup',
            'min': 'money',
            'minv': 0,
            'desc': 'Send computers to your foreign young workers. Doubles the low-cost workers production',
            'buf' : 'low-cost workers production x 2'
        });
        
        ops.push({
            name: 'crack',
            title: 'Cocaïne Supply',
            price: 100000,
            price_entity: 'money',
            required_strat: 'marketing',
            'min': 'score',
            'minv': 10000,
            'desc': 'Makes workers more efficient',
            'buf' : 'regular workers production x 2'
        });
        ops.push({
            name: 'suicidenets',
            title: 'Anti-Suicide Nets',
            price: 400000,
            price_entity: 'money',
            required_strat: 'crack',
            'min': 'money',
            'minv': 100000,
            'desc': 'Helps to stay happy at work, while salaries are lowered',
            'buf' : 'workers cost / 2'
        });
        
        
        /* MARKETING */
        
        ops.push({
            name: 'bigdata',
            title: 'Big Data',
            price: 400000,
            price_entity: 'money',
            required_strat: 'marketing',
            'min': 'score',
            'minv': 100000,
            'desc': 'Private data on your employees can help them to accept lower salaries. Divides the marketing cost',
            'buf' : 'marketing next cost / 2'
        });


        /* REPUTATION */

          ops.push({
            name: 'bio',
            title: 'Bio Label',
            price: 5000,
            price_entity: 'money',
            required_strat: 'marketing',
            'min': 'money',
            'minv': 1000,
            'desc': 'Create a nice attractive packaging that will raise your reputation',
            'buf' : 'reputation++'
        });

        ops.push({
            name: 'spaceweedtv',
            title: 'Space Weed TV Reality',
            price: 50000,
            price_entity: 'money',
            required_strat: 'children',
            'min': 'money',
            'minv': 10000,
            'desc': 'Send a nice car floating into space, with rastas smoking weed inside. Increase reputation.',
            'buf' : 'reputation++'
        });
        
        
        ops.push({
            name: 'greenwashing',
            title: 'Greenwashing',
            price: 75000,
            price_entity: 'money',
            required_strat: 'children',
            'min': 'money',
            'minv': 30000,
            'desc': 'Wash your reputation by giving money to children care associations.',
            'buf': 'reputation++'
        });
        
        
        
        
        
       /* 200K */
       
       ops.push({
            name: 'openspace',
            title: 'Open Space Village 2.0',
            price: 500000,
            price_entity: 'money',
            required_strat: 'marketing',
            'min': 'money',
            'minv': 100000,
            'desc': 'Now your workers will live in the company, and they will buy and consume your own products',
            'buf' : 'sales++'
        });
       
       
       
       /* 500 K*/
        ops.push({
            name: 'government',
            title: 'Government ',
            price: 1000000,
            price_entity: 'money',
            required_strat: 'spaceweedtv',
            'min': 'money',
            'minv': 500000,
            'desc': 'Get a better reputation while working at the Government',
            'buf' : 'reputation++',
        });
        
        /*1M*/
         ops.push({
            name: 'unitedcolors',
            title: 'United Colors of Liberty',
            price: 10000000,
            price_entity: 'money',
            required_strat: 'children',
            'min': 'money',
            'minv': 2000000,
            'desc': 'A heart-breaking commercial campaign that helps people to enjoy children inclusion in the real world',
            'buf' : 'reputation++'
        });

        /*2M*/
        ops.push({
            name: 'torture',
            title: 'Pyramidical Torture Management',
            price: 2000000,
            price_entity: 'money',
            required_strat: 'suicidenets',
            'min': 'money',
            'minv': 1000000,
            'desc': 'Everyone can enjoy power abuse on someone else. Doubles the production of your full workforce !',
            'buf' : 'production++',
        });
        
         /*5M*/
        ops.push({
            name: 'btc',
            title: 'Bitcoin mining',
            price: 5000000,
            price_entity: 'money',
            required_strat: 'army',
            'min': 'money',
            'minv': 2000000,
            'desc': 'Get virtually rich and truly warm the planet',
            'buf' : 'BTC++, warmth++'
        });




        /* CTA */
        ops.push({
            name: 'lobby',
            title: 'Lobbying',
            price: 10000,
            price_entity: 'money',
            required_strat: 'marketing',
            'min': 'money',
            'minv': 0,
            'desc': 'Lobbying can help the world taking the right direction',
            'buf' : 'catch the lobbyist before other players : income x 3'
        });


        /* war operations */

        ops.push({
            name: 'army',
            title: 'Deal with the Army',
            price: 4000000,
            price_entity: 'money',
            required_strat: 'marketing',
            'min': 'money',
            'minv': 500000,
            'desc': 'Make a deal the army and reach new territories.',
            'buf' : 'kills++'
        });        

        ops.push({
            name: 'cacao',
            title: 'Cacao',
            price: 10000,
            price_entity: 'killed',
            required_strat: 'army',
            'min': 'killed',
            'minv': 0,
            'desc': 'Put some cacao in your products. So Delicious !!',
            'buf' : 'public demand +100%'
        });
        
        ops.push({
            name: 'education',
            title: 'International Education',
            price: 10000,
            price_entity: 'killed',
            required_strat: 'army',
            'min': 'killed',
            'minv': 0,
            'desc': 'Children are citizen of the world, and are therefore soldiers. Low-cost workers will generate kills.',
            'buf' : 'kills++ per low cost workers'
        });
        
        ops.push({
            name: 'smartphones',
            title: 'Smartphones',
            price: 20000,
            price_entity: 'killed',
            required_strat: 'army',
            'min': 'killed',
            'minv': 0,
            'desc': 'People are addicted to smartphones. They need cobalt. They are ready to accept intensified military operations for it.',
            'buf' : 'kills++ per military op.'
        });
        
         ops.push({
            name: 'justice',
            title: 'Online Justice',
            price: 30000,
            price_entity: 'killed',
            required_strat: 'army',
            'min': 'killed',
            'minv': 0,
            'desc': 'International justice is now based on online polls. Converts a part of public demand into kills. ',
            'buf' : 'kills++ per public demand'
        });
        
        
        ops.push({
            name: 'migration',
            title: 'Migration Waves',
            price: 500000,
            price_entity: 'killed',
            required_strat: 'torture',
            'min': 'killed',
            'minv': 1000,
            'desc': 'Migrants are motivated people. Divide by 2 the workers salaries. ',
            'buf' : 'worker cost--'
        });
        
        
        ops.push({
            name: 'toys',
            title: 'War Games',
            price: 10000,
            price_entity: 'money',
            required_strat: 'army',
            'min': 'killed',
            'minv': 100,
            'desc': 'Drones remotely controlled by professionnal gamers. Add 10 kills per day per worker.',
            'buf' : 'kills++ per worker'
        });
        
        

        ops.push({
            name: 'weapons',
            title: 'AK47 Mark XI',
            price: 1000000000,
            price_entity: 'money',
            required_strat: 'army',
            'min': 'killed',
            'minv': 100,
            'desc': 'This is a simple revision of the classical AK47, but with real videogames skins paint on it. So cool ! Will improve army operations efficiency',
            'buf' : 'kills++ per military op.',
        });
        
        ops.push({
            name: 'meat',
            title: 'Soylent Green',
            price: 2000000000,
            price_entity: 'money',
            required_strat: 'army',
            'min': 'killed',
            'minv': 1000,
            'desc': 'Extract nutrients from war victims. Improves productivity.',
            'buf' : 'production++ per kill'
        });




        /* BLACK MAGIC */



        ops.push({
            name: 'magic',
            title: 'Research & Development',
            price: 5000000,
            price_entity: 'money',
            required_strat: 'army',
            'min': 'money',
            'minv': 1000000,
            'desc': 'Invest into the cutting-edge mystical technologie',
            'buf' : 'opens the black energy cult'
        });


         ops.push({
            name: 'hole',
            title: 'Black Hole Plan',
            price: 10000,
            price_entity: 'magicpower',
            required_strat: 'magic',
            'min': 'magicpower',
            'minv': 1,
            'desc': 'Sell souls to Satan for the ultimate cash reward',
            'buf' : 'win the freaking game'
        });
        
        ops.push({
            name: 'autocorpse',
            title: 'Corporate Rituals',
            price: 10000000,
            price_entity: 'magicpower',
            required_strat: 'magic',
            'min': 'magicpower',
            'minv': 2,
            'desc' : 'Rituals are now replacing after hours drinks. Healthier.',
            'buf': 'Autoconsume corpses into black energy'
        });
        
        
       


        /* multiplayer */

        ops.push({
            name: 'spy',
            title: 'Industrial Spying',
            price: 10000,
            price_entity: 'money',
            required_strat: 'marketing',
            'min': 'money',
            'minv': 5000,
            'desc': 'Hire a mole to watch into another company',
            'buf' : 'See all data from another player',
            'actionprice': 1000
        });

        ops.push({
            name: 'defamation',
            title: 'Defamation',
            price: 20000,
            price_entity: 'money',
            required_strat: 'marketing',
            'min': 'money',
            'minv': 10000,
            'desc': 'Rob massive amounts of money from another player while sending him a lawyer that will defame him publicly ! Be aware of your own reputation and fake news about your opponent...',
            'buf' : 'When a defame event is triggered, the player with the biggest reputation will get the cash from the other',
            'actionprice': 100000
        });

        ops.push({
            name: 'badbuzz',
            title: 'Bad Buzz',
            price: 1000000,
            price_entity: 'money',
            required_strat: 'children',
            'min': 'money',
            'minv': 50000,
            'desc': 'Hire a community manager to make fun of opponents commercial campaigns',
            'buf' : 'temporary reputation-- for the opponent',
            'actionprice': 1000000
        });

        ops.push({
            name: 'strike',
            title: 'Worker\'s union',
            price: 500000,
            price_entity: 'money',
            required_strat: 'defamation',
            'min': 'money',
            'minv': 2000000,
            'desc': 'Support the workers union to organize a 60 days strike in another company',
            'actionprice': 10000000,
            'duration': 30,
            'cooldown': 360,
            'buf' : 'opponents production will temporary go to zero'
        });








        this.operations = ops;
    },
    findOp: function (name) {
        for (i = 0; i < this.operations.length; i++) {
            if (this.operations[i].name === name) {
                return(this.operations[i]);
            }
        }
    }
}