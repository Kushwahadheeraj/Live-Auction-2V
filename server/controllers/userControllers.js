import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateToken, isAuth, isAdmin, errorHandler } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';


export const getUsers = (
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {

        const users = await User.find({});
        res.send(users);
    })
);

export const getUser = (
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);

export const updateAdminUser = (
isAuth,
isAdmin,
expressAsyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
        user.isSeller = Boolean(req.body.isSeller);

        // Check if the user is a seller before updating seller information
        if (user.isSeller && user.seller) {
            user.seller.name = req.body.sellerName || user.seller.name;
            user.seller.logo = req.body.sellerLogo || user.seller.logo;
            user.seller.description =
                req.body.sellerDescription || user.seller.description;
        }

        const updatedUser = await user.save();
        res.send({ message: 'User Updated Successfully', user: updatedUser });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
})
);

export const deleteUser = (
isAuth,
isAdmin,
expressAsyncHandler(async (req, res) => {
    if (!req.user.isAuth) {
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.email === 'admin@example.com') {
            res.status(400).send({ message: 'Can Not Delete Admin User' });
            return;
        }
        await User.findByIdAndDelete(req.params.id);
        res.send({ message: 'User Deleted' });
    } else {
        res.status(404).send({ message: 'User Not Found' });
    }
})
);

export const updateUser = (
isAuth,
isAdmin,
expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.profilePicture = req.body.profilePicture || user.profilePicture;
        if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
        }
        if (user.isSeller) {
            user.seller.name = req.body.sellerName || user.seller.name;
            user.seller.logo = req.body.sellerLogo || user.seller.logo;
            user.seller.description =
                req.body.sellerDescription || user.seller.description;
        }

        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
            isAdmin: updatedUser.isAdmin,
            isSeller: updatedUser.isSeller,
            token: generateToken(updatedUser),
        });
    } else {
        res.status(404).send({ message: 'User not found' });
    }
})
);
