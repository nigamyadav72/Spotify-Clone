"use client";

import { Database } from "@/type_db";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import React, { useState } from "react";

interface SupabaseProviderProps{
    children: React.ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
    children

}) => {
    const [supabaseClient] = useState(()=>
        createClientComponentClient<Database>()
    )
    return(
        <SessionContextProvider supabaseClient={supabaseClient}>
            {children}
        </SessionContextProvider>
    )
}

export default SupabaseProvider 