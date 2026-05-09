"use client";

import * as React from "react";

import { AppRouterCacheProvider }
from "@mui/material-nextjs/v15-appRouter";

export default function ThemeRegistry({ children }) {

    return (

        <AppRouterCacheProvider>
            {children}
        </AppRouterCacheProvider>
    );
}