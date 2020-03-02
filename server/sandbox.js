/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const restaurateurs = require('./restaurateurs');
const bibxmaitre = require('./bibxmaitre');

async function sandboxPost (page) {
  try {

    const restaurant = await restaurateurs.scrapeRestaurantPost(page);

    //console.log(restaurant);
    //console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function sandboxGet (searchLink = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/1') {
  try {

    const restaurant = await michelin.scrapeRestaurantGet(searchLink);
    /*
    console.log("Name:\t",restaurant['name']);
    console.log("Experience:\t", restaurant['experience']);
    console.log("Assise:\t", restaurant['assise']);
    console.log('done');*/
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function BibxMaitre (){
  try{
    const mixJson = await bibxmaitre.JsonMix();
  }
  catch(e){
    console.error(e);
  }
}

const [,, searchLink] = process.argv;

//sandboxGet(searchLink);
//sandboxPost(0);
BibxMaitre();

