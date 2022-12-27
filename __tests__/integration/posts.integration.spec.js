const supertest = require('supertest');
const app = require('../../app.js');
const { sequelize } = require('../../models/index.js');

// 통합 테스트(Integration Test)를 진행하기에 앞서 Sequelize에 연결된 모든 테이블의 데이터를 삭제합니다.
//  단, NODE_ENV가 test 환경으로 설정되어있는 경우에만 데이터를 삭제합니다.
beforeAll(async () => {
    if (process.env.NODE_ENV === 'test') await sequelize.sync();
    else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});

describe('Layered Architecture Pattern, Posts Domain Integration Test', () => {
    test('GET /api/posts API (getPosts) Integration Test Success Case, Not Found Posts Data', async () => {
        const response = await supertest(app).get(`/api/posts`); // API의 HTTP Method & URL

        // 1. API 의 Status code = 200
        expect(response.status).toEqual(200);

        // 2. API의 Response 데이터는 {data:[]}
        expect(response.body).toEqual({ data: [] });
    });

    test('POST /api/posts API (createPost) Integration Test Success Case', async () => {
        // {nickname, password, title, content}
        const createPostBodyPararms = {
            nickname: 'Nickname_Success',
            password: 'Password_Success',
            title: 'Title_Success',
            content: 'Content_Success',
        };
        const response = await supertest(app)
            .post('/api/posts')
            .send(createPostBodyPararms);

        // 1. 201로 전달되는가
        expect(response.status).toEqual(201);

        // 2. 원하는 형태로 전달되는가 {~~~}
        expect(response.body).toMatchObject({
            data: {
                postId: 1,
                nickname: createPostBodyPararms.nickname,
                title: createPostBodyPararms.title,
                content: createPostBodyPararms.content,
                createdAt: expect.anything(),
                updatedAt: expect.anything(),
            },
        });
    });

    test('POST /api/posts API (createPost) Integration Test Error Case, Invalid Params Error', async () => {
        const response = await supertest(app).post('/api/posts').send(); // send => 빈 객체 전달

        // 1. 400으로 전달
        expect(response.status).toEqual(400);

        // 2. {errerMessage: error.message} 의 형태로 전달
        expect(response.body).toEqual({ errorMessage: 'InvalidParamsError' });
    });

    test('GET /api/posts API (getPosts) Integration Test Success Case, is Exist Posts Data', async () => {
        const createPostBodyPararms = {
            nickname: 'Nickname_Success',
            password: 'Password_Success',
            title: 'Title_Success',
            content: 'Content_Success',
        };
        const response = await supertest(app).get('/api/posts');

        // 200번 잘 오는가
        expect(response.status).toEqual(200);

        // 게시글 생성 API에서 만든 데이터가 정상적으로 조회되는가
        expect(response.body).toMatchObject({
            data: [
                {
                    postId: 1,
                    nickname: createPostBodyPararms.nickname,
                    title: createPostBodyPararms.title,
                    createdAt: expect.anything(),
                    updatedAt: expect.anything(),
                },
            ],
        });
    });
});

afterAll(async () => {
    // 통합 테스트가 완료되었을 경우 sequelize의 연결된 테이블들의 정보를 초기화합니다.
    if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: true });
    else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});
