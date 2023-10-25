import express from 'express';
let router = express.Router();
import RoleController from '../../controllers/v1/RoleController';

router.post('/', RoleController.createRole);
router.get('/',RoleController.getAllRoles);
  
  export default router;