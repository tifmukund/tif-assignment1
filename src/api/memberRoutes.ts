import express from 'express';
let router = express.Router();
import createMember from "../createMember"
import deleteMember from '../deleteMember'
import cookieAuth from '../middleware/cookieJwtAuth';
import { Request } from 'express';
interface CustomRequest extends Request {
    user?: any; // change this to only include id, name, email
}

router.post('/',cookieAuth ,async (req:CustomRequest, res) => {
    try {
      //to check if he is owner
      const current_user_id = req.user.id;
      /*
      {
  "community": "7109613196056130181",
  "user": "7109613727069370839",
  "role": "7109612609366403189"
}
      */
        //7109612504807405286 - admin
        //7109612609366403189 - member
        //7109621411597153011 - moderator

        //7109613196056130181 -westworld (chotu2 -owner)
        //7109613283318079435 - westworld6

        
        //vGuFQ1nJSSrdMaYV1LiN3G1i
        //7109612844608002315 -chotu
        //7109613617232670940 - chotu3
        //7109613727069370839 - chotu4
        //7109530067186819030 - dlores
      const { community:communityId, user:userId,role: roleId } = req.body;

      console.log(current_user_id, "communityid:", communityId)

      const response = await createMember(current_user_id,communityId, userId, roleId )

      return res.json(response);
    } catch (error) {
        res.status(500).json({ status: false, message: 'Internal server error at adding member' });
    }
})

//del a member using his memberId if the signed user is owner/moderator
router.delete('/:id', cookieAuth,async (req:CustomRequest, res) => {
  try {
    const memberId = req.params.id;
    const current_userId = req.user.id;

    console.log("Delete memeber:",memberId," \nCurrent user", current_userId);
    
    const response = await deleteMember(current_userId, memberId);
    if(!response){
      return {
        status:false,
        error:"Not Auth"
      }
    }

    return res.json({status:true});
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error at removing member' });
  }
})

export default router;