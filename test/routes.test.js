import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

describe('routes', () => {
    beforeAll(async done => {
        try {
            await mongoose.connect(
                process.env.MONGO_URL,
                { useNewUrlParser: true }
            );
            done();
        } catch (err) {
            console.error(err);
            done(err);
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();  // https://github.com/facebook/jest/issues/7287#issuecomment-476824726
    });

    describe('status', () => {
        it('should get a response properly', async () => {
            await request(app).get('/api0/hi').expect(200);
        });
    });

    describe('auth', () => {
        it('should sign up', async () => {
            await request(app)
                .post('/api0/auth/signup')
                .send({ email: 'test2@gmail.com', password: '1234567890' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
        });
        it('should login', async () => {
            await request(app)
                .post('/api0/auth/login')
                .send({ email: 'test2@gmail.com', password: '1234567890' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                // .expect(function(res) {
                //   console.log(res.body);
                // })
                .expect(200);
        });
    });

    describe('GET /404', () => {
        it('should return 404 for non-existent URLs', async () => {
            await request(app).get('/404').expect(404);
            await request(app).get('/notfound').expect(404);
        });
    });
});
