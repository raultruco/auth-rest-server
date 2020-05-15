import request from 'supertest';
import mongoose from 'mongoose';
import assert from 'assert';
import app from '../src/app.js';
import config from '../src/config.js';
import Member from '../src/models/member.model.js';

const getFixture = () => {
    let fixture = [], counterString = '0';
    for(let i = 0; i < 100; i++) {
        counterString = `${i}`.padStart(3, '0');
        fixture.push({
            email: `member.${counterString}@mailinator.com`,
            password: 'xxxxxxxx',
            fullName: counterString
        });
    }
    return fixture;
}

describe('routes', () => {
    beforeAll(async done => {
        try {
            await mongoose.connect(
                process.env.MONGO_URL,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                }
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

    describe('members', () => {
        let accessToken;
        let memberId;
        let memberEmail;
        beforeAll(async () => {
            await request(app)
                .post('/api0/auth/login')
                .send({ email: 'test2@gmail.com', password: '1234567890' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function(res) {
                     accessToken = res.body.accessToken;
                })
                .expect(200);
            await Member.deleteMany({});
            await Member.insertMany(getFixture());
        });
        it('should create a new member', async () => {
            await request(app)
                .post('/api0/members')
                .send({ email: 'test3@gmail.com', password: '1234567890', sex: 1 })
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    memberId = res.body.id;
                    memberEmail = res.body.email;
                })
                .expect(200);
        });
        it('should update an existing member', async () => {
            await request(app)
                .put(`/api0/members/${memberId}`)
                .send({ email: 'updated_test3@gmail.com', sex: 2 })
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    memberEmail = res.body.email;
                })
                .expect(200)
                .then(res => {
                    assert.equal(res.body.id, memberId);
                    assert.equal(res.body.email, memberEmail);
                    assert.equal(res.body.sex, 2);
                });
        });
        it('should get a member by id', async () => {
            await request(app)
                .get(`/api0/members/${memberId}`)
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    assert.equal(res.body.id, memberId);
                    assert.equal(res.body.email, memberEmail);
                    assert.equal(res.body.sex, 2);
                });
        });
        it('should get a member by email', async () => {
            await request(app)
                .get(`/api0/members/email/${memberEmail}`)
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    assert.equal(res.body.id, memberId);
                    assert.equal(res.body.email, memberEmail);
                    assert.equal(res.body.sex, 2);
                });
        });
        it('should delete an existing member', async () => {
            await request(app)
                .del(`/api0/members/${memberId}`)
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .expect('Content-Type', /json/)
                .expect(200);
        });
        it('should get the first page of members when no pagination supplied', async () => {
            await request(app)
                .get('/api0/members')
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    assert.ok(Array.isArray(res.body));
                    assert.equal(res.body.length, config.pageLimit);
                    assert.equal(res.body[0].email, `member.000@mailinator.com`);
                    assert.equal(res.body[49].email, `member.049@mailinator.com`);
                });
        });
        it('should get the second page of members when pagination supplied', async () => {
            await request(app)
                .get('/api0/members')
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .query({ page: 2 })
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    assert.ok(Array.isArray(res.body));
                    assert.equal(res.body.length, config.pageLimit);
                    assert.equal(res.body[0].email, `member.050@mailinator.com`);
                    assert.equal(res.body[49].email, `member.099@mailinator.com`);
                });
        });
        it('should get the first page of members when an invalid pagination is supplied', async () => {
            await request(app)
                .get('/api0/members')
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .query({ page: 'invalid' })
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    assert.ok(Array.isArray(res.body));
                    assert.equal(res.body.length, config.pageLimit);
                    assert.equal(res.body[0].email, `member.000@mailinator.com`);
                    assert.equal(res.body[49].email, `member.049@mailinator.com`);
                });
        });
        it('should sort the members ascending when sorting supplied', async () => {
            await request(app)
                .get('/api0/members')
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .query({ sort: '_id' })
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    assert.ok(Array.isArray(res.body));
                    assert.equal(res.body.length, config.pageLimit);
                    for (let i = 0; i < config.pageLimit - 1; i++) {
                        assert.ok(res.body[i].id < res.body[i + 1].id);
                    }
                });
        });
        it('should sort the members descending when sorting supplied', async () => {
            await request(app)
                .get('/api0/members')
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .query({ sort: '-_id' })
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    assert.ok(Array.isArray(res.body));
                    assert.equal(res.body.length, config.pageLimit);
                    for (let i = 0; i < config.pageLimit - 1; i++) {
                        assert.ok(res.body[i].id > res.body[i + 1].id);
                    }
                });
        });
        it('should sort by default the members when an invalid sorting is supplied', async () => {
            await request(app)
                .get('/api0/members')
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .query({ sort: 'invalid' })
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    assert.ok(Array.isArray(res.body));
                    assert.equal(res.body.length, config.pageLimit);
                    for (let i = 0; i < config.pageLimit - 1; i++) {
                        assert.ok(res.body[i].id < res.body[i + 1].id);
                    }
                });
        });
        it('should delete all the members', async () => {
            await request(app)
                .del('/api0/members/all')
                .set('Accept', 'application/json')
                .set('Authorization', accessToken)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    assert(res.body.deletedCount, 1);
                });
        });
    });

    describe('GET /404', () => {
        it('should return 404 for non-existent URLs', async () => {
            await request(app).get('/404').expect(404);
            await request(app).get('/notfound').expect(404);
        });
    });
});
