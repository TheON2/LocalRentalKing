module.exports=(sequelize,DataTypes)=>{
    const Post=sequelize.define()('Post',{//
    //id가 기본적으로 들어있다. 
        content:{//내용
            type:DataTypes.STRING(500),
            allowNull:false,//필수
        },
        title:{//제목
            type:DataTypes.STRING(50),
            allowNull:false,//필수
        },
        price:{//렌탈비용 
            type:DataTypes.STRING(100),
            allowNull:true,//
        },
        makeDate:{//게시글 생성 날짜
            type:DataTypes.STRING(100),
            allowNull:false,//필수
        },
        whatCummunity:{//물건빌려줘 물건빌려줄게 같이하자 동네놀이터.. 선택
            type:DataTypes.STRING(50),
            allowNull:false,//필수임
        },
        Category:{//질문게시판?자유게시판?그 카테고리 필수아님 이거 쓰는곳은 동네 놀이터 뿐임
            type:DataTypes.STRING(50),
            allowNull:true,//필수아님
        },


    },{
        charset:'utf8mb4',//한글도 쓸수있게
        collate:'utf8mb4_general_ci',//한글 저장
    
    });
    Post.associate=(db)=>{};
    return Post;
}