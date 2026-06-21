import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { CookieData } from "./cookie.data.type";

@Injectable()
export class CookieService{

  setCookie(_response: Response, cookieData: CookieData) {
    _response.cookie(cookieData.cookie_id, cookieData.value, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: cookieData.ttl
    })
  }

  getCookie(_request: Request, cookie_id: string){
    const token: string | null = _request.cookies?.[cookie_id] ?? null
    return token
  }

  deleteCookie(_response: Response ,cookie_id: string){
    _response.clearCookie(cookie_id)
  }
}