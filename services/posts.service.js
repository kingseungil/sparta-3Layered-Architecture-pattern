const PostRepository = require('../repositories/posts.repository');
const { Posts } = require('../models/index');

class PostSerive {
    postRepository = new PostRepository(Posts);

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
                id: post.postId,
                nickname: post.nickname,
                title: post.title,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
        });
        return allPost;
    };

    findPostById = async (postId) => {
        const findPost = await this.postRepository.findPostById(postId);

        return {
            postId: findPost.postId,
            nickname: findPost.nickname,
            title: findPost.title,
            content: findPost.content,
            createdAt: findPost.createdAt,
            updatedAt: findPost.updatedAt,
        };
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
            postId: createPostData.postId,
            // postId: createPostData.null,q
            nickname: createPostData.nickname,
            title: createPostData.title,
            content: createPostData.content,
            createdAt: createPostData.createdAt,
            updatedAt: createPostData.updatedAt,
        };
    };
    updatePost = async (postId, password, title, content) => {
        const findPost = await this.postRepository.findPostById(postId);
        if (!findPost) throw new Error("Post doesn't exist");

        await this.postRepository.updatePost(postId, password, title, content);

        const updatePost = await this.postRepository.findPostById(postId);

        return {
            postId: updatePost.postId,
            nickname: updatePost.nickname,
            title: updatePost.title,
            content: updatePost.content,
            createdAt: updatePost.createdAt,
            updatedAt: updatePost.updatedAt,
        };
    };

    deletePost = async (postId, password) => {
        const findPost = await this.postRepository.findPostById(postId);
        if (!findPost) throw new Error("Post doesn't exist");

        await this.postRepository.deletePost(postId, password);

        return {
            postId: findPost.postId,
            nickname: findPost.nickname,
            title: findPost.title,
            content: findPost.content,
            createdAt: findPost.createdAt,
            updatedAt: findPost.updatedAt,
        };
    };
}

module.exports = PostSerive;
