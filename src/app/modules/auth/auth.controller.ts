/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthService.credentialsLogin(req.body);

  setAuthCookie(res, loginInfo);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Logged In Successfully",

    data: loginInfo,
  });
});

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(400, "No refresh token received from cookies");
    }
    const tokenInfo = await AuthService.getNewAccessToken(
      refreshToken as string
    );
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "New Access Token Retrieved Successfully",
      data: tokenInfo,
    });
  }
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User Logged Out Successfully",
      data: null,
    });
  }
);

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

  await AuthService.resetPassword(
    oldPassword,
    newPassword,
    decodedToken as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password Changed Successfully",
    data: null,
  });
};

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
      throw new AppError(404, "User Not Found");
    }
    const tokenInfo = createUserToken(user);
    setAuthCookie(res, tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
  logOut,
  googleCallbackController,
};
