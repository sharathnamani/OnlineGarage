import bcrypt from 'bcryptjs';
import User from '../models/user.model.js'
import { generateAnsSetCookie } from '../utils/generateAndSetCookie.js';

export const signup = async (req, res) => {
    try {
      const { username, phone, email, password, birthday, gender } = req.body;
  
      // Check if all required fields are provided
      if (!username || !phone || !email || !password || !birthday || !gender) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists with this email' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create and save user
      const newUser = new User({
        username,
        phone,
        email,
        password: hashedPassword,
        birthday: new Date(birthday), // ensure it's stored as a Date
        gender
      });

      await newUser.save();
      generateAnsSetCookie(res, newUser._id);
  
      // Send response with user object (excluding password)
      const userResponse = {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        birthday: newUser.birthday,
        gender: newUser.gender
      };

      res.status(201).json({ 
        message: 'User registered successfully', 
        user: userResponse 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

export const login = async (req, res) => {
    try {
        console.log('Login attempt with:', { email: req.body.email });
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log('Password verified for user:', email);

        // Generate and set cookie
        generateAnsSetCookie(res, user._id);
        console.log('Cookie generated for user:', email);

        // Return user data (excluding password)
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            birthday: user.birthday,
            gender: user.gender
        };

        console.log('Login successful for user:', email);
        res.status(200).json({ 
            message: 'Login successful',
            user: userData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'An error occurred during login. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const logout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

