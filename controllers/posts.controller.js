const PostService = require('../services/posts.service');

// Post 컨트롤러 역할을 하는 클래스
class PostsController {
    postService = new PostService(); // Post 서비스 클래스를 컨트롤러 클래스의 멤버 변수로 할당

    getPosts = async (req, res, next) => {
        // 서비스 계층에 구현된 findAllPost 로직을 실행
        const posts = await this.postService.findAllPost();

        res.status(200).json({ data: posts });
    };

    getPostById = async (req, res, next) => {
        const { postId } = req.params;
        const post = await this.postService.findPostById(postId);

        res.status(200).json({ data: post });
    };

    createPost = async (req, res, next) => {
        try {
            const { nickname, password, title, content } = req.body;

            if (!nickname || !password || !title)
                throw new Error('InvalidParamsError');

            // 서비스 계층에 구현된 createPost 로직 실행
            const createPostData = await this.postService.createPost(
                nickname,
                password,
                title,
                content
            );
            // res.status(201).json({ data: createPostData });
            res.status(201).json({ message: '작성완료' });
        } catch (error) {
            res.status(400).json({ errorMessage: error.message });
        }
    };
    updatePost = async (req, res, next) => {
        const { postId } = req.params;
        const { password, title, content } = req.body;

        const updatePost = await this.postService.updatePost(
            postId,
            password,
            title,
            content
        );

        res.status(200).json({ data: updatePost });
    };

    deletePost = async (req, res, next) => {
        const { postId } = req.params;
        const { password } = req.body;

        const deletePost = await this.postService.deletePost(postId, password);

        res.status(200).json({ data: deletePost });
    };
}

module.exports = PostsController;
