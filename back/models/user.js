module.exports=(sequelize,DataTypes)=>{
    const User=sequelize.define()('User',{//마이에스큐엘에는 users테이블 생성 mysql2->노드랑 mysql이랑 연결
    //id가 기본적으로 들어있다. 
        email:{//이메일,이걸로 로그인할거임
            type:DataTypes.STRING(100),
            allowNull:false,//필수
            unique:true,//고유한값
        },
        nickname:{//닉네임
            type:DataTypes.STRING(30),
            allowNull:false,//필수 
        },
        password:{//비번
            type:DataTypes.STRING(100),//암호화를 해야하는데 암호화하면 길이가 길어짐 그래서 100
            allowNull:false,//필수
        },
        location:{//사는곳
            type:DataTypes.STRING(100),
            allowNull:false,//필수
        },
        greeting:{//자기소개말
            type:DataTypes.STRING(100),
            allowNull:true,//널가능
        },
        grade:{//이거는 회원등급 근데 가입하면 처음에 일반회원임//수정필요---------------------------------------------
            type:DataTypes.STRING(20),
            allowNull:false,//
        },
        joinDate:{//가입일,데이터 하는거 있지 않을까?자동으로 등록?
            type:DataTypes.STRING(20),
            allowNull:false,//
        },
        profileImgSrc:{
            type:DataTypes.STRING(100),
            allowNull:true,//
        }
        //추천 비추천 
    },{
        charset:'utf8',
        collate:'utf8+general_ci',//한글 저장
    
    });
    User.associate=(db)=>{};
    return User;
}