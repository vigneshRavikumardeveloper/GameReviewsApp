const config={
   production:{
       SECRET:process.env.SECRET,
       DATABASE:'mongodb://vignesh:viki123@ds263436.mlab.com:63436/game_div_reviews',
       PORT:process.env.PORT
   },
   default:{
      SECRET:'ABCD12345',
      DATABASE:'mongodb://vignesh:viki123@ds263436.mlab.com:63436/game_div_reviews',
      PORT:8000
   }
};

module.exports=function(env){
    
    return env === 'production' ? config.production : config.default;
}