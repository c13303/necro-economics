/* file created by charles.torris@gmail.com */

module.exports = {
    operations: [],
    initOp: function () {
        var ops = [];
        var global_price_tuning = 1.5;
        /* productivity */
        ops.push({
            name: 'workers',
            title: 'Workers',
            price: global_price_tuning * 10,
            price_entity: 'money',
            'min': 'money',
            'minv': 1, // apparition
            required_strat: null,
            'desc': 'Hire some workers to produce for you.'
        });
        ops.push({
            name: 'accountant',
            title: 'Accountant',
            price: global_price_tuning * 200,
            price_entity: 'money',
            'min': 'money',
            'minv': 0, // apparition
            required_strat: 'workers',
            'desc': 'Computer that displays some numbers that will make your business look smart.'
        });
        ops.push({
            name: 'marketing',
            title: 'Marketing Departement',
            price: global_price_tuning * 500,
            price_entity: 'money',
            'min': 'money',
            'minv': 0,
            required_strat: 'workers',
            'desc': 'A fat guy with a suit and a phone that will convince people to buy your product.',
            'buf': '++public demand'
        });

        ops.push({
            name: 'children',
            title: 'Low Cost Workers',
            price: global_price_tuning * 1000,
            price_entity: 'money',
            'min': 'money',
            'minv': 200,
            required_strat: null,
            'desc': 'Open a contract with low-morale countries that allows you to get low-cost 6 years-old workers',
            'buf': 'you pay the migration fees, then they just cost 1€ per day, --reputation'
        });
        
          ops.push({
            name: 'bio',
            title: 'Bio Label',
            price: global_price_tuning * 5000,
            price_entity: 'money',
            required_strat: 'children',
            'min': 'money',
            'minv': 200,
            'desc': 'Create a nice attractive packaging that will raise your reputation',
            'buf': 'reputation++; public demand++'
        });
        
             
        
        
        
        
        
        ops.push({
            name: 'startup',
            title: 'Startup Human Resources',
            price: global_price_tuning * 25000,
            price_entity: 'money',
            required_strat: 'bio',
            'min': 'money',
            'minv': 0,
            'desc': 'Overtime is just an elementary thing when you work in a startup.',
            'buf': 'worker cost--; production++;'
        });

        ops.push({
            name: 'wc',
            title: 'More Toilets',
            price: global_price_tuning * 50000,
            price_entity: 'money',
            required_strat: 'startup',
            'min': 'money',
            'minv': 0,
            'desc': 'More toilets means more shit done. Doubles the workers production',
            'buf': 'regular workers production x 2'
        });
        
        /* CTA */
        ops.push({
            name: 'lobby',
            title: 'Lobbying',
            price: global_price_tuning * 50000,
            price_entity: 'money',
            required_strat: 'startup',
            'min': 'money',
            'minv': 0,
            'desc': 'Lobbying can help the world taking the right direction',
            'buf': 'catch the lobbyist before other players : income x 3'
        });


        ops.push({
            name: 'remotework',
            title: 'Remote Work',
            price: global_price_tuning * 100000,
            price_entity: 'money',
            required_strat: 'wc',
            'min': 'money',
            'minv': 0,
            'desc': 'Send computers to your foreign young workers. Doubles the low-cost workers production',
            'buf': 'low-cost workers production x 2'
        });
        
        
        
        
        ops.push({
            name: 'freeclips',
            title: 'Humble Blundle',
            price: global_price_tuning * 10000,
            price_entity: 'unsold',
            required_strat: 'wc',
            'min': 'money',
            'minv': 0,
            'desc': 'Give away free production and make people crave for some more',
            'buf': 'public demand * 2'
        });
        
        
        
        
        ops.push({
            name: 'crack',
            title: 'Cocaïne Supply',
            price: global_price_tuning * 250000,
            price_entity: 'money',
            required_strat: 'remotework',
            'min': 'score',
            'minv': 0,
            'desc': 'Makes workers more efficient',
            'buf': 'regular workers production x 2'
        });
        
        
        
        
        ops.push({
            name: 'suicidenets',
            title: 'Anti-Suicide Nets',
            price: global_price_tuning * 500000,
            price_entity: 'money',
            required_strat: 'crack',
            'min': 'money',
            'minv': 0,
            'desc': 'Helps to stay happy at work, while salaries are lowered',
            'buf': 'workers cost / 2'
        });
        



        /* MARKETING */

        ops.push({
            name: 'bigdata',
            title: 'Big Data',
            price: global_price_tuning * 500000,
            price_entity: 'money',
            required_strat: 'remotework',
            'min': 'score',
            'minv': 0,
            'desc': 'Private data on your employees can help them to accept lower salaries. Divides the marketing cost',
            'buf': 'marketing next cost / 2'
        });


        /* MARKETING */

        ops.push({
            name: 'penguins',
            title: 'Save the penguins',
            price: global_price_tuning * 25000,
            price_entity: 'unsold',
            required_strat: 'bigdata',
            'min': 'score',
            'minv': 0,
            'desc': 'Drop your products on Antarctica to save the penguins, so the world will know how good you are',
            'buf': 'pubic demand * 2'
        });

        /* REPUTATION */

      

        ops.push({
            name: 'spaceweedtv',
            title: 'Space Weed TV Reality',
            price: global_price_tuning * 1000000,
            price_entity: 'money',
            required_strat: 'bigdata',
            'min': 'money',
            'minv': 0,
            'desc': 'Send a nice car floating into space, with rastas smoking weed inside. Increase reputation.',
            'buf': 'reputation++'
        });


        ops.push({
            name: 'greenwashing',
            title: 'Greenwashing',
            price: global_price_tuning * 1000000,
            price_entity: 'money',
            required_strat: 'bigdata',
            'min': 'money',
            'minv': 0,
            'desc': 'Wash your reputation by giving money to children care associations.',
            'buf': 'reputation++'
        });





        /* 200K */

        ops.push({
            name: 'openspace',
            title: 'Open Space Village 2.0',
            price: global_price_tuning * 5000000,
            price_entity: 'money',
            required_strat: 'greenwashing',
            'min': 'money',
            'minv': 0,
            'desc': 'Now your workers will live in the company, and they will buy and consume your own products',
            'buf': 'sales++'
        });



       
        ops.push({
            name: 'government',
            title: 'Government ',
            price: global_price_tuning * 10000000,
            price_entity: 'money',
            required_strat: 'openspace',
            'min': 'money',
            'minv': 0,
            'desc': 'Why not doing the laws by yourself ?',
            'buf': 'reputation++',
        });

      
        ops.push({
            name: 'liberty',
            title: 'United Colors of Liberty',
            price: global_price_tuning * 10000000,
            price_entity: 'money',
            required_strat: 'government',
            'min': 'money',
            'minv': 0,
            'desc': 'A heart-breaking commercial campaign that convince the world that childrens are the future of workforce',
            'buf': 'low-cost workers prod++'
        });
        
        ops.push({
            name: 'easyjet',
            title: 'Easy Jet Set',
            price: global_price_tuning * 10000000,
            price_entity: 'money',
            required_strat: 'government',
            'min': 'money',
            'minv': 0,
            'desc': 'With nice contracts with airplane companies, you can reduce fees attached to Low-Cost Workers',
            'buf': 'low-cost workers hire price--'
        });
        
        

        
        
        
        ops.push({
            name: 'heroin',
            title: 'Heroin',
            price: global_price_tuning * 10000000,
            price_entity: 'money',
            required_strat: 'easyjet',
            'min': 'money',
            'minv': 0,
            'desc': 'Thanks to the planes, you can import cheap medecine from Afghanistan that can help your marketing service to stay relax despite humiliation',
            'buf': 'next commercial cost --'
        });
        
         ops.push({
            name: 'btc',
            title: 'Bitcoin mining',
            price: global_price_tuning * 10000000,
            price_entity: 'money',
            required_strat: 'liberty',
            'min': 'money',
            'minv': 0,
            'desc': 'Get virtually rich and truly warm the planet',
            'buf': 'BTC++, warmth++'
        });
        
        
        ops.push({
            name: 'brains',
            title: 'Automated Brains',
            price: global_price_tuning * 20000000,
            price_entity: 'money',
            required_strat: 'heroin',
            'min': 'money',
            'minv': 0,
            'desc': 'Authentic workers assistants designed by Jeff Bezos, makes them work 10x faster !!',
            'buf': 'regular workers production++',
        });


        ops.push({
            name: 'subliminal',
            title: 'Subliminal Advertising',
            price: global_price_tuning * 20000000,
            price_entity: 'money',
            required_strat: 'brains',
            'min': 'money',
            'minv': 0,
            'desc': 'Technology that controls consumer will. Marketing is therefore much more efficient !',
            'buf': 'sales ++',
        });
        
        

        ops.push({
            name: 'torture',
            title: 'Pyramide Torture Management',
            price: global_price_tuning * 25000000,
            price_entity: 'money',
            required_strat: 'liberty',
            'min': 'money',
            'minv': 0,
            'desc': 'Power is such a motivator. This revolutionnary method makes everyone the boss of someone else. Makes the full workforce (regular and low-cost) much, much, much more agressive.',
            'buf': 'production++',
        });

        
       

        ops.push({
            name: 'corruption',
            title: 'Corruption',
            price: global_price_tuning * 50000000,
            price_entity: 'money',
            required_strat: 'btc',
            'min': 'money',
            'minv': 0,
            'desc': 'Well, this is not really corruption, you know.',
            'buf': 'lobbyism power++'
        });
       

        ops.push({
            name: 'robots',
            title: 'Robots',
            price: global_price_tuning * 250000000,
            price_entity: 'money',
            required_strat: 'darkweb',
            'min': 'money',
            'minv': 0,
            'desc': 'Humans are becoming useless... Achieve to robotize your workers. They will cost more expensive, but will be so much more productive !',
            'buf': 'workers cost++, production++'
        });
        



        ops.push({
            name: 'darkweb',
            title: 'Dark Web Designer Drugs',
            price: global_price_tuning * 1000,
            price_entity: 'btc',
            required_strat: 'btc',
            'min': 'money',
            'minv': 0,
            'desc': 'The dark web is always the best when its about designer drugs. These uncharted (therefore legal) molecules can make your products powerfully addictive. ',
            'buf': 'public demand++'
        });
       
       
       ops.push({
            name: 'bicycle',
            title: 'Bicycle Generators',
            price: global_price_tuning * 50000000,
            price_entity: 'money',
            required_strat: 'darkweb',
            'min': 'money',
            'minv': 0,
            'desc': 'People are starting to think about global warming. Offer them some ecological bicycle generators that secretly mine bitcoins for you. ',
            'buf': 'btc++'
        });
       
        
        
        
       





        /* KILLS operations */

        ops.push({
            name: 'army',
            title: 'Deal with the Army',
            price: global_price_tuning * 100000000,
            price_entity: 'money',
            required_strat: 'government',
            'min': 'money',
            'minv': 0,
            'desc': 'Make a deal the army and reach new territories.',
            'buf': 'kills++'
        });
        
        
         ops.push({
            name: 'toys',
            title: 'War Games',
            price: global_price_tuning * 250000000,
            price_entity: 'money',
            required_strat: 'army',
            'min': 'killed',
            'minv': 0,
            'desc': 'Drones remotely controlled by professionnal gamers. Add 10 kills per day per worker.',
            'buf': 'kills++ per worker'
        });

        
        
        ops.push({
            name: 'weapons',
            title: 'AK47 Mark XI',
            price: global_price_tuning * 500000000,
            price_entity: 'money',
            required_strat: 'toys',
            'min': 'killed',
            'minv': 0,
            'desc': 'This is a simple revision of the classical AK47, but with real videogames skins paint on it. So cool ! Will improve army operations efficiency',
            'buf': 'kills++ per military op.',
        });
        
        
        ops.push({
            name: 'malware',
            title: 'Malware Intelligence',
            price: global_price_tuning * 50000,
            price_entity: 'btc',
            required_strat: 'robots',
            'min': 'killed',
            'minv': 0,
            'desc': 'Use every user experience of the internet to improve your robots intelligence and productivity',
            'buf': 'production++ per robot'
        });

        
        
        ops.push({
            name: 'meat',
            title: 'Soylent Green',
            price: global_price_tuning * 1000000000,
            price_entity: 'money',
            required_strat: 'army',
            'min': 'killed',
            'minv': 0,
            'desc': 'Extract nutrients from war victims. Improves productivity.',
            'buf': 'production++ per kill'
        });
        
       
        ops.push({
            name: 'supremacy',
            title: 'Supremacy',
            price: global_price_tuning * 2000000000,
            price_entity: 'money',
            required_strat: 'meat',
            'min': 'money',
            'minv': 0,
            'desc': 'Take control of the planet resources. Your product is becoming vital for survival.',
            'buf': 'public demand ++'
        });

        
        ops.push({
            name: 'planet',
            title: 'Orbital Delivery',
            price: global_price_tuning * 4000000000,
            price_entity: 'unsold',
            required_strat: 'btc',
            'min': 'money',
            'minv': 0,
            'desc': 'Constantly drop your products on all the planet surface',
            'buf': 'every 100B unsold makes warm++'
        });
        
        
        

        
         ops.push({
            name: 'autocorpse',
            title: 'Corporate Rituals',
            price: global_price_tuning * 5000000000,
            price_entity: 'money',
            required_strat: 'magic',
            'min': 'magicpower',
            'minv': 2,
            'desc': 'Rituals are now replacing after hours drinks. Healthier.',
            'buf': 'Autoconsume corpses into black energy'
        });

        
        
        
        
        
        
        /* KILLED BASE BUY */
        
        

        ops.push({
            name: 'cacao',
            title: 'Cacao',
            price: global_price_tuning * 10000,
            price_entity: 'killed',
            required_strat: 'army',
            'min': 'killed',
            'minv': 0,
            'desc': 'Put some cacao in your products. So Delicious !!',
            'buf': 'public demand +100%'
        });

        ops.push({
            name: 'education',
            title: 'International Education',
            price: global_price_tuning * 1000000,
            price_entity: 'killed',
            required_strat: 'cacao',
            'min': 'killed',
            'minv': 0,
            'desc': 'Children are citizen of the world, and are therefore soldiers. Low-cost workers will generate kills.',
            'buf': 'kills++ per low cost workers'
        });

        ops.push({
            name: 'smartphones',
            title: 'Smartphones',
            price: global_price_tuning * 50000000,
            price_entity: 'killed',
            required_strat: 'education',
            'min': 'killed',
            'minv': 0,
            'desc': 'People are addicted to smartphones. They need cobalt. They are ready to accept intensified military operations for it.',
            'buf': 'kills++ per military op.'
        });

        ops.push({
            name: 'justice',
            title: 'Online Justice',
            price: global_price_tuning * 50000000,
            price_entity: 'killed',
            required_strat: 'smartphones',
            'min': 'killed',
            'minv': 0,
            'desc': 'International justice is now based on online polls. Converts a part of public demand into kills. ',
            'buf': 'kills++ per public demand'
        });


        



        




        /* BLACK MAGIC */



        ops.push({
            name: 'magic',
            title: 'Research & Development',
            price: global_price_tuning * 2000000000,
            price_entity: 'money',
            required_strat: 'cacao',
            'min': 'money',
            'minv': 0,
            'desc': 'Invest into the cutting-edge mystical technologie',
            'buf': 'opens the black energy cult'
        });
        
        ops.push({
            name: 'holocaust',
            title: 'Holocaust',
            price: global_price_tuning * 10,
            price_entity: 'magicpower',
            required_strat: 'magic',
            'min': 'magicpower',
            'minv': 10,
            'desc': 'Let some ridiculous ideology madness drive a one-shot death mega production production',
            'buf': '1B killed'
        });
        


        ops.push({
            name: 'hole',
            title: 'Black Hole Plan',
            price: global_price_tuning * 360,
            price_entity: 'magicpower',
            required_strat: 'magic',
            'min': 'magicpower',
            'minv': 1,
            'desc': 'Sell souls to Satan for the Ultimate Cash Reward',
            'buf': 'win the freaking game'
        });

       




        /* multiplayer */

        ops.push({
            cat : 'mp',
            name: 'spy',
            title: 'Industrial Spying',
            price: global_price_tuning * 10000,
            price_entity: 'money',
            required_strat: 'marketing',
            'min': 'money',
            'minv': 5000,
            'desc': 'Hire a mole to watch into another company',
            'buf': 'See all data from another player',
            'actionprice': 1000
        });

        ops.push({
            cat : 'mp',
            name: 'defamation',
            title: 'Defamation',
            price: global_price_tuning * 20000,
            price_entity: 'money',
            required_strat: 'marketing',
            'min': 'money',
            'minv': 10000,
            'desc': 'Rob massive amounts of money from another player while sending him a lawyer that will defame him publicly ! Be aware of your own reputation and fake news about your opponent...',
            'buf': 'When a defame event is triggered, the player with the biggest reputation will get the cash from the other',
            'actionprice': 100000
        });

        ops.push({
            cat : 'mp',
            name: 'badbuzz',
            title: 'Bad Buzz',
            price: global_price_tuning * 1000000,
            price_entity: 'money',
            required_strat: 'children',
            'min': 'money',
            'minv': 50000,
            'desc': 'Hire a community manager to make fun of opponents commercial campaigns',
            'buf': 'temporary reputation-- for the opponent',
            'actionprice': 1000000
        });

        ops.push({
            cat : 'mp',
            name: 'strike',
            title: 'Worker\'s union',
            price: global_price_tuning * 500000,
            price_entity: 'money',
            required_strat: 'defamation',
            'min': 'money',
            'minv': 2000000,
            'desc': 'Support the workers union to organize a 60 days strike in another company',
            'actionprice': 10000000,
            'duration': 30,
            'cooldown': 360,
            'buf': 'opponents production will temporary go to zero'
        });


        ops.push({
            cat : 'mp',
            name: 'lawyers',
            title: 'Lawyers',
            price: global_price_tuning * 30000,
            price_entity: 'money',
            required_strat: 'defamation',
            'min': 'money',
            'minv': 0,
            'desc': 'Justice is a subjective thing, and a lawyer will protect you from a wrong use of information by one other jealous company ',
            'actionprice': 10,
            'duration': 30,
            'cooldown': 360,
            'buf': 'A lawyer blocks one defamation attempt from an ennemy (and is consumed by it)'
        });






        /* free rewards */
            ops.push({
           
            name: 'chrono',
            title: 'Micro-Trading Computers',
            price: global_price_tuning * 10000,
            price_entity: 'money',
            required_strat: '',
            'min': 'score',
            'minv': 20000,
            'desc': 'This an accountant tool that gives you an average time before you can reach an objective ',
            'buf': 'Display time before being able to buy an operation'
        });
        
        ops.push({
           
            name: 'shout',
            title: 'TV Channel',
            price: global_price_tuning * 5000000,
            price_entity: 'money',
            required_strat: '',
            'min': 'score',
            'minv': 3000000,
            'desc': 'You created 3M products, you deserves your own media channel !',
            'buf': 'You can shout messages in the console for all players'
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