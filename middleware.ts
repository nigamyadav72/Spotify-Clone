import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({
        req,
        res
    })
    
    // Use getUser() instead of getSession() for better security
    await supabase.auth.getUser()
    
    return res
}