const { Posts } = require('../models');

class PostRepository {
    findAllPost = async () => {
        // Sequelize에서 Posts 모델의 findAll 메소드를 사용해 데이터 요청
        const posts = await Posts.findAllPost();

        return posts;
    };

    createPost = async (nickname, password, title, content) => {
        // Sequelize에서 Posts 모델의 create 메소드를 사용해 데이터 요청
        const createdPostData = await Posts.create({
            nickname,
            password,
            title,
            content,
        });
        return createdPostData;
    };
}

module.exports = PostRepository;
