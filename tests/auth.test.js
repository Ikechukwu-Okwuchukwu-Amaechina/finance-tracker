const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Auth routes (beginner-friendly)', () => {
  beforeEach(async () => {
    // clear users between tests
    await User.deleteMany({});
  });

  test('signup creates a user and returns token + user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' })
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toMatchObject({ name: 'Alice', email: 'alice@example.com' });

    const userInDb = await User.findOne({ email: 'alice@example.com' });
    expect(userInDb).not.toBeNull();
  });

  test('login with correct credentials returns token', async () => {
    // create the user first
    const user = new User({ name: 'Bob', email: 'bob@example.com', password: 'secret' });
    await user.save();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'secret' })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('bob@example.com');
  });

  test('GET /api/auth/me requires auth and returns user', async () => {
    const user = new User({ name: 'Carol', email: 'carol@example.com', password: 'pw' });
    await user.save();

    // login to get token
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'carol@example.com', password: 'pw' })
      .expect(200);

    const token = login.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.email).toBe('carol@example.com');
  });
});
