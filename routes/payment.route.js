import { Router } from "express";
import { defaultMaxListeners } from "nodemailer/lib/xoauth2";
const router = Router();
router
  .route('/razorpay-key')
  .get(getRazorPayApIKey);

router
  .route("/subscribe")
  .post(buySubscription)

router
  .route('/verify')
  .post(verifySubscription);

router
  .route('unsubscribe')
  .post(cancelSubscription)

export default router;