import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthService from '../AuthService/auth-service-test';
import User from '../Models/user.model';

jest.mock('../Models/user.model.ts');

describe('AuthService', () => {
    describe('signUp',() => {
        it('it should create a new user', async () => {
            const userData = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
            };
             // mock bcrypt.hash to return a hashed password
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');

            //mock user.create to simulate saving to database
            (User.create as jest.Mock).mockResolvedValueOnce(undefined);

            await AuthService.signUp(userData);

            expect(User.create).toHaveBeenCalledWith({
                username: 'testuser',
                email: 'tsholanang@gmail.com.com',
                password: 'hashedPassword',
            });
        });
    });
});

describe('login', () => {
    it('should return a JWT token for vadil credentials', async () => {
        const loginData = {
            usernameOrEmail: 'testuser',
            password: 'password'
        };

        const mockUser = {
            username: 'testuser',
            email: 'tsholanang@gmail.com',
            password: await bcrypt.hash('password', 10),
        };

        //mock user.findone to simulate findinf the user in database
        (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

        //mock jwt.sign to return a mock token
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        //mock jwt sin to return a mock token
        jest.spyOn(jwt, 'sign').mockReturnValue(mockToken);

        const token = await AuthService.login(loginData);

        expect(User.findOne).toHaveBeenCalledWith({
            where: { $or: [{ username: 'testuser' }, { email: 'tsholanang@gmail.com'}] },
        });

        expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
        expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id}, expect.any(String), { expiresIn: '1h',});

        expect(token).toBe('mockToken');
    });

    it('should throw an error for invalid credentials', async () => {
        const loginData = {
            id: 1,
            username: 'testuser',
            email: 'tsholanang@gmail.com',
            password: await bcrypt.hash('password', 10),
        };

        //mock userfindone to simulate finding user database
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        //mock bcrypt ,compare to return finding user in database
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

        await expect(AuthService.login(loginData)).rejects.toThrow('Invalid credentials');

    });

    it('should throw an error if user is not found', async () => {
        const loginData = {
            usernameOrEmail: 'nonexisitentuser',
            password: 'password',
        };

        //mock user finone to simulate user not found in database

        (User.findOne as jest.Mock).mockResolvedValue(null);

        await expect(AuthService.login(loginData)).rejects.toThrow('User not found');

    });
});

function async(arg0: { const: { username: string; email: string; password: string; }; }): jest.ProvidesCallback | undefined {
    throw new Error('Function not implemented.');
}
