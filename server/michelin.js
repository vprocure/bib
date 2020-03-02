const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */

const nbrestot = data=>{
  const $ = cheerio.load(data);
  return $('div.d-flex:nth-child(2) > div:nth-child(1) > h1:nth-child(1)').text();
}


const parseMosaicPage = data=>{
  const $ = cheerio.load(data);
  let links = [];
  try{
    $('div.js-restaurant__list_item > a').each((i,element)=>{
    const link = $(element).attr('href');
    links.push(link);
    });
  }
  catch(error){
    return null;
  }
 
  return links;
}

const parseRestoPage = data=>{
  const $ = cheerio.load(data);
  const name = $('div.d-none:nth-child(1) > h2:nth-child(2)').text();
  //console.log(name);
  const adress = $('div.d-none:nth-child(1) > ul:nth-child(3) > li:nth-child(1)').text();
  //console.log(adresse);
  let phone='';
  try {
  phone = $('div.d-flex > a.link').attr('href').split(':')[1];
  }
  catch(error){
  phone='';
  }
  return {name,adress,phone};
  
  /*fs.writeFile('datalog_details.txt',data,function(err){
    if(err){
      console.log(err);
    }
  });*/
}
/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
module.exports.scrapeRestaurantGet = async url => {
  const response_homepage = await axios (url);
  const {data, status} = response_homepage;
  let noms=[];
  let liens=[];
  let nb_res_page = 0;
  if (status >= 200 && status < 300) {
    const nb_res = nbrestot(data).split('sur ')[1].split(' ')[0];
    nb_res_page = nbrestot(data).split(' sur')[0].split('-')[1];
    for (let i=1; i<=(nb_res/nb_res_page)+1;i++){
     url = url.split('page/')[0].concat('page/').concat(i);
     const response_mosaic_page = await axios(url);
     const {data, status}= response_mosaic_page;
     if (status>=200 && status<300){
        const links = parseMosaicPage(data);
        liens.push(links);
     }
    }
     
  }
  var dict =[];
  for (let i=0;i<liens.length;i++){
    for(let j=0;j<liens[i].length;j++)
    {
      url = 'https://guide.michelin.com'.concat(liens[i][j]);
      //console.log(url); // returns the 563 links to the bib gourmand restaurants
      const response_data_page = await axios(url);
      const {data,status} = response_data_page;
      if (status>=200 && status<300){
        const details = parseRestoPage(data);
        dict.push({
          name:details['name'],
          phone:details['phone'],
          adress:details['adress']
        });
      }
      console.log(String(i*nb_res_page+j));
    }
  }
  dictstring = JSON.stringify(dict,null,3);
  console.log(dictstring);
  
  fs.writeFileSync('bib_gourmand.json',dictstring),(err)=>{
    if(err){
      console.log(err);
    }
    console.log('File created');
  };
  return null;
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
  return [];
};
