const Sequelize=require("sequelize");
module.exports=class Comment extends Sequelize.Model{
    static init(sequelize){
        return super.init(
            {
                content:{
                    type:Sequelize.STRING(100),
                    allowNull:false,//필수
                },
            },
            {
                
                modelName:"Comment",
                tableName:"comments",
                charset:'utf8mb4',//한글도 쓸수있게
                collate:'utf8mb4_general_ci',//한글 저장
                sequelize,
            }
        );
    }
    static associate(db){
        
    }
}