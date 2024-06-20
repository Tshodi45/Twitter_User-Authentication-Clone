// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.models';
import sequelize from '../config/db.config';

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  usernameOrEmail: string;
  password: string;
}
//user creating or signing up 
class AuthService {
  public async signUp(userData: SignUpData): Promise<void> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await User.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    });
  }
 //user logingin with username or email and password
  public async login(loginData: LoginData): Promise<string> {
    const { usernameOrEmail, password } = loginData;
    const user = await User.findOne({
      where: {
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      throw new Error('User not found'); // if user not found throw error
    }

    const isMatch = await bcrypt.compare(password, user.password); //compare user login details

    if (!isMatch) {
      throw new Error('Invalid credentials'); //if not a match throw an error again
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || '', {
      expiresIn: '1h',
    }); //if user valid return token

    return token;
  }
}

export default new AuthService();
