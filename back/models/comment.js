module.exports=(sequelize,DataTypes)=>{
    const Comment=sequelize.define()('Comment',{//
    //id가 기본적으로 들어있다. 
        content:{},
    },{
        charset:'utf8mb4',//한글도 쓸수있게
        collate:'utf8mb4_general_ci',//한글 저장
    
    });
    Comment.associate=(db)=>{};
    return Comment;
}