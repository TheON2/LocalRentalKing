module.exports=(sequelize,DataTypes)=>{
    const Image=sequelize.define()('Image',{//
    //id가 기본적으로 들어있다. 
        src:{},//이미지가 저장될 경로 ./어디어디/
    },{
        charset:'utf8mb4',//한글도 쓸수있게
        collate:'utf8mb4_general_ci',//한글 저장
    
    });
    Image.associate=(db)=>{};
    return Image;
}