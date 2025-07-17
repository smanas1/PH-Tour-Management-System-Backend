import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthService.credentialsLogin(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Logged In Successfully",

    data: loginInfo,
  });
});

export const AuthController = {
  credentialsLogin,
};
