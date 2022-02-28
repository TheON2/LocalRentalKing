const Sequelize=require("sequelize");
module.exports=class User extends Sequelize.Model{
    static init(sequelize){
        return super.init(
            {
                email:{//이메일,이걸로 로그인할거임
                    type:Sequelize.STRING(100),
                    allowNull:false,//필수
                    unique:true,//고유한값
                },
                nickname:{//닉네임
                    type:Sequelize.STRING(30),
                    allowNull:false,//필수 
                },
                password:{//비번
                    type:Sequelize.STRING(100),//암호화를 해야하는데 암호화하면 길이가 길어짐 그래서 100
                    allowNull:false,//필수
                },
                location:{//사는곳
                    type:Sequelize.STRING(100),
                    allowNull:false,//필수
                },
                greeting:{//자기소개말
                    type:Sequelize.STRING(100),
                    allowNull:true,//널가능
                },
                grade:{//이거는 회원등급 근데 가입하면 처음에 일반회원임//수정필요---------------------------------------------
                    type:Sequelize.STRING(20),
                    allowNull:false,//
                },
                // joinDate:{//가입일,데이터 하는거 있지 않을까?자동으로 등록?
                //     type:DataTypes.STRING(20),
                //     allowNull:false,//
                // },알아서 생긴다 
                profileImgSrc:{
                    type:Sequelize.STRING(100),
                    allowNull:true,//
                },
            },
            {
                
                modelName:"User",
                tableName:"users",
                charset:'utf8',//한글도 쓸수있게
                collate:'utf8_general_ci',//한글 저장
                sequelize,
            }
        );
    }
    static associate(db){
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post,{through:'Like'});//유저가 여러개의 게시글에 좋아요를 누를 수 있다.
       // db.User.belongsToMany(db.User,{through:''});
    }
}