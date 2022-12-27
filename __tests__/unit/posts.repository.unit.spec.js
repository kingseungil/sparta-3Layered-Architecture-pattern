const PostRepository = require('../../repositories/posts.repository.js');

// posts.repository.js 에서는 아래 5개의 Method만을 사용합니다.
let mockPostsModel = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
};

let postRepository = new PostRepository(mockPostsModel);

describe('Layered Architecture Pattern Posts Repository Unit Test', () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    test('Posts Repository findAllPost Method', async () => {
        // findAll Mock의 Return 값을 "findAll Result"으로 설정합니다.
        mockPostsModel.findAll = jest.fn(() => {
            return 'findAll Result';
        });

        // postRepository의 findAllPost Method를 호출합니다.
        const posts = await postRepository.findAllPost();

        // postsModel의 findAll은 1번만 호출 되었습니다.
        expect(postRepository.postsModel.findAll).toHaveBeenCalledTimes(1);

        // mockPostsModel의 Return과 출력된 findAll Method의 값이 일치하는지 비교합니다.
        expect(posts).toBe('findAll Result');
    });

    test('Posts Repository createPost Method', async () => {
        mockPostsModel.create = jest.fn(() => {
            return 'Hello Create Result';
        });
        const createPostParams = {
            nickname: 'createPostNickname',
            password: 'createPostPassword',
            title: 'createPostTitle',
            content: 'createPostContent',
        };

        const createPostData = await postRepository.createPost(
            createPostParams.nickname,
            createPostParams.password,
            createPostParams.title,
            createPostParams.content
        );

        // postsModel.create Method 결과값은 createPostData (method의 실행한 결과값) 변수와 일치
        expect(createPostData).toBe('Hello Create Result');

        // 1번 호출
        expect(mockPostsModel.create).toHaveBeenCalledTimes(1);

        // postsModel.create Method 호출할 때, {nickname, password, title, content}
        expect(mockPostsModel.create).toHaveBeenCalledWith({
            nickname: createPostParams.nickname,
            password: createPostParams.password,
            title: createPostParams.title,
            content: createPostParams.content,
        });
    });
});
