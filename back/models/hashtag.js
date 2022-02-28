module.exports=(sequelize,DataTypes)=>{
    const Hashtag=sequelize.define()('Hashtag',{//
    //id가 기본적으로 들어있다. 
        name:{},
    },{
        charset:'utf8mb4',//한글도 쓸수있게
        collate:'utf8mb4_general_ci',//한글 저장
    
    });
    Hashtag.associate=(db)=>{};
    return Hashtag;
}