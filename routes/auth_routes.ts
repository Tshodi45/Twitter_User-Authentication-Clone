//
import express, { Request, Response} from 'express';
import AuthService from '../services/auth-service';

const router = express.Router();
//user signup route
router.post('/signup', async (req: Request, res: Response) => {
    try{
        await AuthService.signUp(req.body);
        res.status(201).json({ message: 'user created successfully'});
    }catch(error) {
        res.status(500).json({ message: 'server error'});
    }
});
//user login route
router.post('/login', async (req: Request, res: Response) => {
    try {
        const token = await AuthService.login(req.body);
        res.status(200).json({token});
    }catch (error) {
        res.status(401).json({ message: error});
    }

});