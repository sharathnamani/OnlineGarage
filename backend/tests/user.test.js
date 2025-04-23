import request from 'supertest';
import { app } from '../index.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Mock the generateAnsSetCookie function
jest.mock('../utils/generateAndSetCookie.js', () => ({
  generateAnsSetCookie: jest.fn()
}));

describe('User Authentication Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/garage_test');
  });

  beforeEach(async () => {
    // Clear the users collection before each test
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect after all tests
    await mongoose.connection.close();
  });

  describe('Signup Tests', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        phone: '1234567890',
        email: 'test@example.com',
        password: 'password123',
        birthday: '1990-01-01',
        gender: 'male'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.userId).toBeDefined();

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.username).toBe(userData.username);
      
      // Verify password was hashed
      const isPasswordValid = await bcrypt.compare(userData.password, user.password);
      expect(isPasswordValid).toBe(true);
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteUserData = {
        username: 'testuser',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(incompleteUserData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });

    it('should return 409 if user already exists', async () => {
      const userData = {
        username: 'testuser',
        phone: '1234567890',
        email: 'test@example.com',
        password: 'password123',
        birthday: '1990-01-01',
        gender: 'male'
      };

      // Create user first time
      await request(app)
        .post('/api/auth/signup')
        .send(userData);

      // Try to create user with same email
      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('User already exists with this email');
    });
  });

  describe('Login Tests', () => {
    const testUser = {
      username: 'testuser',
      phone: '1234567890',
      email: 'test@example.com',
      password: 'password123',
      birthday: '1990-01-01',
      gender: 'male'
    };

    beforeEach(async () => {
      // Create a test user before each login test
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testUser.password, salt);
      await User.create({
        ...testUser,
        password: hashedPassword
      });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should return 400 if email or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 401 with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
}); 