const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');
const querystring = require('querystring');

module.exports.scrapeRestaurantPost = async page => {
    let payload={
      'page':page,
      'request_id':'a5b1626bfd9f24763244fcbc0027ea37'
    };
  
    let options={
      'url':'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult',
      'method':'POST',
      'headers':{'content-type':'application/x-www-form-urlencoded'},
      'data':querystring.stringify(payload)
    }
    
    let response = await axios(options);
    let {data,status}=response;
    
    if(status>=200 && status <300){
      const nb_res_page=parseNbRestoPage(data);
      const nb_res=parseNbRestoTot(data);
      const dict = [];
      dict.push(parseAnnuary(data));
      for (let i=2; i<=(nb_res/nb_res_page)+1;i++){
          console.log(i);
          payload={
            'page':i,
            'request_id':'a5b1626bfd9f24763244fcbc0027ea37'
          };
        
          options={
            'url':'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult',
            'method':'POST',
            'headers':{'content-type':'application/x-www-form-urlencoded'},
            'data':querystring.stringify(payload)
          }
           response = await axios(options);
           let {data,status} = response;
    
           if(status>=200 && status<300){
             results = parseAnnuary(data);
             for (let j=0; j<results.length;j++){
                dict.push(results[j]);
             }
           }
          }
          console.log(dict);
          dictstring = JSON.stringify(dict,null,3);
          fs.writeFileSync('restaurateurs.json',dictstring),(err)=>{
            if(err){
              console.log(err);
            }
            console.log('File created');
          };
          return null;

    }
    else{
        console.error(status);
    }

    return null;
  }
 
const parseNbRestoPage = data =>{
    const $ = cheerio.load(data);
    return $('.annuaire_single').length;
}

const parseNbRestoTot = data=>{
    const $ = cheerio.load(data);
    return parseInt($('#topbar_nb_persons').text().split('R')[0]);
}

const parseAnnuary = data =>{
    let $ = cheerio.load(data);
    var dict = [];
    try{
        $('div.single_desc').each((i,element)=>{
        $ = cheerio.load(element);
        let nom = $('div.single_libel > a ').text().replace(/\r?\n|\r/g,"");
        let adresse = $('div.single_info3 > div:nth-child(2)').text().replace(/\r?\n|\r|\t/g,"");
        let telephone = $('div.single_info3 > div:nth-child(3)').text().replace(/\s/g, "");

        dict.push({
          name:nom,
          adress:adresse,
          phone:telephone
        })
        });

    }
    catch(error){
        console.log(error);
        return null;
    }
  
    return dict;
  }
