const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Helper to create a user and return token
async function createUserAndGetToken(email = 'tuser@example.com') {
  const user = new User({ name: 'TUser', email, password: 'pass' });
  await user.save();
  const res = await request(app).post('/api/auth/login').send({ email, password: 'pass' });
  return { user, token: res.body.token };
}

describe('Transactions routes (beginner-friendly)', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Transaction.deleteMany({});
  });

  test('POST /api/transactions creates a credit and updates balance', async () => {
    const { user, token } = await createUserAndGetToken('tx1@example.com');

    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 50, type: 'credit', description: 'Paycheck' })
      .expect(201);

    expect(res.body.amount).toBe(50);
    expect(res.body.type).toBe('credit');

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.balance).toBe(50);
  });

  test('GET /api/transactions lists transactions with paging and type filter', async () => {
    const { token } = await createUserAndGetToken('tx2@example.com');

    // create some transactions
    await request(app).post('/api/transactions').set('Authorization', `Bearer ${token}`).send({ amount: 10, type: 'credit' });
    await request(app).post('/api/transactions').set('Authorization', `Bearer ${token}`).send({ amount: 5, type: 'debit' });

    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('transactions');
    expect(Array.isArray(res.body.transactions)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(2);

    // filter by type
    const creditRes = await request(app)
      .get('/api/transactions?type=credit')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(creditRes.body.transactions.every(t => t.type === 'credit')).toBe(true);
  });

  test('GET /api/transactions/:id returns single tx, PUT updates and DELETE removes', async () => {
    const { user, token } = await createUserAndGetToken('tx3@example.com');

    const create = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 20, type: 'credit' })
      .expect(201);

    const txId = create.body._id;

    const get = await request(app).get(`/api/transactions/${txId}`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(get.body._id).toBe(txId);

    // update amount and type
    const updated = await request(app)
      .put(`/api/transactions/${txId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 10, type: 'debit' })
      .expect(200);

    expect(updated.body.amount).toBe(10);
    expect(updated.body.type).toBe('debit');

    // delete
    const del = await request(app).delete(`/api/transactions/${txId}`).set('Authorization', `Bearer ${token}`).expect(200);
    expect(del.body.message).toBe('Deleted');

    const notFound = await request(app).get(`/api/transactions/${txId}`).set('Authorization', `Bearer ${token}`).expect(404);
  });
});
