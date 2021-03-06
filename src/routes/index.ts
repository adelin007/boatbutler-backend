import express from 'express';
import * as userController from "../controllers/userController";
import passport from "passport";

export const router = express.Router();

// open
router.post('/createUser', userController.postNewUser);
router.post('/login', userController.postUserLoginDetails);
router.post('/createMock', userController.postCreateMockData);
// for testing
router.get('/users', userController.getUsers);
//

// protected
router.get('/user/details', passport.authenticate("jwt", {session: false}), userController.getUserDetails);
router.post('/company/new', passport.authenticate("jwt", {session: false}), userController.postNewUserCompany);
router.get('/company/jobs', passport.authenticate("jwt", {session: false}), userController.getJobsForCompanyUser);
router.post('/company/proposals/new', passport.authenticate("jwt", {session: false}), userController.postNewProposal);
router.get('/company/proposals', passport.authenticate("jwt", {session: false}), userController.getAllProposals);
///


