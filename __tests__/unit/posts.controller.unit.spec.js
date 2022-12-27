const PostsController = require('../../controllers/posts.controller.js');

// posts.service.js 에서는 아래 5개의 Method만을 사용합니다.
let mockPostService = {
    findAllPost: jest.fn(),
    findPostById: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
};

let mockRequest = {
    body: jest.fn(),
};

let mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
};

let postsController = new PostsController();
// postsController의 Service를 Mock Service로 변경합니다.
postsController.postService = mockPostService;

describe('Layered Architecture Pattern Posts Controller Unit Test', () => {
    // 각 test가 실행되기 전에 실행됩니다.
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

        // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
    });

    test('Posts Controller getPosts Method by Success', async () => {
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
        mockPostService.findAllPost = jest.fn(() => {
            return findAllPostReturnValue;
        });
        await postsController.getPosts(mockRequest, mockResponse);

        // findAllPost Method가 1번 호출되었는가
        expect(mockPostService.findAllPost).toHaveBeenCalledTimes(1);

        // Response.status가 200으로 정상 전달되었는가
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);

        // Response.json이 {data:posts}의 형태로 정상 전달 되었는
        expect(mockResponse.json).toHaveBeenCalledWith({
            data: findAllPostReturnValue,
        });
    });

    test('Posts Controller createPost Method by Success', async () => {
        const createPostBodyPararms = {
            nickname: 'Nickname_Success',
            password: 'Password_Success',
            title: 'Title_Success',
            content: 'Content_Success',
        };
        mockRequest.body = createPostBodyPararms;

        const createPostReturnValue = {
            postId: 1,
            nickname: 'Nicknae_1',
            title: 'Title_1',
            content: 'Content_1',
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
        };
        mockPostService.createPost = jest.fn(() => {
            return createPostReturnValue;
        });
        await postsController.createPost(mockRequest, mockResponse);

        // Requset에 있는 body데이터가 정상적으로 createPost에 정상적으로 전달되었는가
        expect(mockPostService.createPost).toHaveBeenCalledTimes(1);
        expect(mockPostService.createPost).toHaveBeenCalledWith(
            createPostBodyPararms.nickname,
            createPostBodyPararms.password,
            createPostBodyPararms.title,
            createPostBodyPararms.content
        );

        // mockResponse.json을 호출하는데, createPost의 ReturnValue가 맞는가
        // {data: createPostData}
        expect(mockResponse.json).toHaveBeenCalledTimes(1);
        expect(mockResponse.json).toHaveBeenCalledWith({
            data: createPostReturnValue,
        });

        // mockResponse.status는 201로 정상 전달되었는가
        expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    test('Posts Controller createPost Method by Invalid Params Error', async () => {
        mockRequest.body = {};

        await postsController.createPost(mockRequest, mockResponse);

        // mockResponse의 status가 400번
        expect(mockResponse.status).toHaveBeenCalledWith(400);

        // mockResponse.json이 {errorMessage: "InvalidParamsError"}
        expect(mockResponse.json).toHaveBeenCalledWith({
            errorMessage: 'InvalidParamsError',
        });
    });
});
