const Sequelize=require("sequelize");
module.exports=class Image extends Sequelize.Model{
    static init(sequelize){
        return super.init(
            {
                src:{
                    type:Sequelize.STRING(100),
                    allowNull:false,//
                },//이미지가 저장될 경로 ./어디어디/
            },
            {
                
                modelName:"Image",
                tableName:"images",
                charset:'utf8mb4',//한글도 쓸수있게
                collate:'utf8mb4_general_ci',//한글 저장
                sequelize,
            }
        );
    }
    static associate(db){
        
    }
}