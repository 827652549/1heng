import { NextResponse } from "next/server";

/**
 * 尝试访问：http://localhost:3000/api?name=tom
 * 获取 get 响应。
 * @param request 
 * @param context 
 * @returns 
 */
export async function GET(request?: any, context?: any) {
    //  访问 /home, pathname 的值为 /home
      const pathname = request.nextUrl.pathname
      // 访问 /home?name=lee, searchParams 的值为 { 'name': 'lee' }
      const searchParams = request.nextUrl.searchParams
      console.log(pathname,searchParams);
      return NextResponse.json({ id: 0,name:'mako' }, { status: 200 });

  }