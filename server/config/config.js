const config={
   production:{
       SECRET:process.env.SECRET,
       DATABASE:process.env.DATABASE,
       PORT:process.env.PORT
   },
   default:{
      SECRET:'ABCD12345',
      DATABASE:'mongodb://localhost:27017/game_div_app',
      PORT:8000
   }
};

module.exports=function(env){
    
    return env === 'production' ? config.production : config.default;
}

