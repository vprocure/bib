const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');
const querystring = require('querystring');


module.exports.JsonMix  = () => {
    var restaurateurs;
    var bibg;
    var bibgxrestau=[];

    fs.readFile('restaurateurs.json', 'utf8', function (err, data) {
        if (err) throw err;
        try {
          restaurateurs = JSON.parse(data);
          phones = [];
          names = [];
          for(var i =0; i<=restaurateurs.length-1;i++){
              if(restaurateurs[i]['phone']!=''){
                    phones.push(restaurateurs[i]['phone']);
              }
              else{
                    names.push(restaurateurs[i]['name'].split(' (')[0].replace(/ /g, '').toUpperCase());
              }
            
          }          
        } catch (e) {
          console.error( e );
        }

    fs.readFile('bib_gourmand.json', 'utf8', function (err, data) {
        if (err) throw err;
        try {
            bibg= JSON.parse(data);
            for (var j=0; j<=bibg.length-1;j++){
                var index = phones.indexOf(bibg[j]['phone'].replace('+33 ','0').replace( / /g,'',));
                if(index >=0){
                    bibgxrestau.push(bibg[j]);
                }
                else if (names.indexOf(bibg[j]['name'].toUpperCase())>=0){
                    bibgxrestau.push(bibg[j]);
                }
            }
            console.log(bibgxrestau.length);
			dictstring = JSON.stringify(bibgxrestau,null,3);
			fs.writeFileSync('bibgxrestau.json',dictstring),(err)=>{
			  if(err){
				console.log(err);
			  }
			  console.log('File created');
        };
        }
         catch (e) {
          console.error( e );
        }
      });

    
    });

    
    
}