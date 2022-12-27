const PostService = require('../../services/posts.service.js');

let mockPostsRepository = {
    findAllPost: jest.fn(),
    findPostById: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
};

let postService = new PostService();
// postService의 Repository를 Mock Repository로 변경합니다.
postService.postRepository = mockPostsRepository;

describe('Layered Architecture Pattern Posts Service Unit Test', () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    test('Posts Service findAllPost Method', async () => {
        const findAllPostReturnValue = [
            {
                postId: 1,
                nickname: 'Nickname_1',
                title: 'Title_1',
                createdAt: new Date('11 October 2022 00:00'),
                updatedAt: new Date('11 October 2022 00:00'),
            },
            {
                postId: 2,
                nickname: 'Nickname_2',
                title: 'Title_2',
                createdAt: new Date('12 October 2022 00:00'),
                updatedAt: new Date('12 October 2022 00:00'),
            },
        ];
        mockPostsRepository.findAllPost = jest.fn(() => {
            return findAllPostReturnValue;
        });

        const allPost = await postService.findAllPost();
        expect(allPost).toEqual(
            findAllPostReturnValue.sort((a, b) => {
                return b.createdAt - a.createdAt;
            })
        );

        expect(mockPostsRepository.findAllPost).toHaveBeenCalledTimes(1);
    });

    test('Posts Service deletePost Method By Success', async () => {
        const findPostByIdReturnValue = {
            postId: 1,
            nickname: 'Nickname_1',
            title: 'Title_1',
            content: 'Content_1',
            createdAt: new Date('11 October 2022 00:00'),
            updatedAt: new Date('11 October 2022 00:00'),
        };
        mockPostsRepository.findPostById = jest.fn(() => {
            return findPostByIdReturnValue;
        });
        const deletePost = await postService.deletePost(1, '0000');

        // findPostById Method를 1번 호출. 입력받는 인자는 postId이다
        expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
        expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(1);

        // postId, password deletePost Method가 호출된다
        expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
        expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(1, '0000');

        // Return된 결과값이, findPostById의 반환된 결과값과 일치한다.
        expect(deletePost).toMatchObject({
            postId: findPostByIdReturnValue.postId,
            nickname: findPostByIdReturnValue.nickname,
            title: findPostByIdReturnValue.title,
            content: findPostByIdReturnValue.content,
            createdAt: findPostByIdReturnValue.createdAt,
            updatedAt: findPostByIdReturnValue.updatedAt,
        });
    });

    test('Posts Service deletePost Method By Not Found Post Error', async () => {
        const findPostByIdReturnValue = null;
        mockPostsRepository.findPostById = jest.fn(() => {
            return findPostByIdReturnValue;
        });

        try {
            const deletePost = await postService.deletePost(99, '123123');
        } catch (error) {
            // 1. postId를 입력한 findPostById Method 실행, 1번 호출
            expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
            expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(99);

            // 2. return 된 findPostById의 결과가 존재하지 않을 때 에러 발생
            expect(error.message).toEqual("Post doesn't exist");
        }
    });
});
