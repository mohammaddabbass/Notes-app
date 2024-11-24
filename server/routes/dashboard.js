import express from 'express';
import * as middleware from '../middleware/checkAuth.js';
const router= express.Router();
import * as controllers from '../controllers/dashboardController.js';

// Dashboard Routes
router.get('/dashboard', middleware.isLoggedIn, controllers.dashboard);
router.get('/dashboard/item/:id', middleware.isLoggedIn, controllers.dashboardViewNote);
router.put('/dashboard/item/:id', middleware.isLoggedIn, controllers.dashboardUpdateNote);
router.delete('/dashboard/item-delete/:id', middleware.isLoggedIn, controllers.dashboardDeleteNote);
router.get('/dashboard/add', middleware.isLoggedIn, controllers.dashboardAddNote);
router.post('/dashboard/add', middleware.isLoggedIn, controllers.dashboardAddNoteSubmit);
router.get('/dashboard/search', middleware.isLoggedIn, controllers.dashboardSearch);
router.post('/dashboard/search', middleware.isLoggedIn, controllers.dashboardSearchSubmit);


export default router;