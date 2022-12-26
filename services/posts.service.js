const PostRepository = require('../repositories/posts.repository');

class PostSerive {
    postRepository = new PostRepository();

    findAllPost = async () => {
        // Repository에게 데이터 요청
        const allPost = await this.postRepository.findAllPost();

        // 호출한 Post들을 가장 최신 게시글부터 정렬
        allPost.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터 가공
        return allPost.map((post) => {
            return {
                postId: post.postId,
                nickname: post.nickname,
                title: post.title,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
        });
    };
    createPost = async (nickname, password, title, content) => {
        // Repository에게 데이터 요청
        const createPostData = await this.postRepository.createPost(
            nickname,
            password,
            title,
            content
        );

        // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터 가공
        return {
            postId: createPostData.null,
            nickname: createPostData.nickname,
            title: createPostData.title,
            content: createPostData.content,
            createdAt: createPostData.createdAt,
            updatedAt: createPostData.updatedAt,
        };
    };
}

module.exports = PostSerive;
