"use client";

import Link from "next/link";

import {
    AppBar,
    Toolbar,
    Typography,
    Button
} from "@mui/material";

export default function Navbar() {

    return (

        <AppBar position="static">

            <Toolbar>

                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1 }}
                >
                    Campus Notifications
                </Typography>

                <Button color="inherit">

                    <Link
                        href="/notifications"
                        style={{
                            color: "white",
                            textDecoration: "none"
                        }}
                    >
                        Notifications
                    </Link>

                </Button>

                <Button color="inherit">

                    <Link
                        href="/priority"
                        style={{
                            color: "white",
                            textDecoration: "none"
                        }}
                    >
                        Priority Inbox
                    </Link>

                </Button>

            </Toolbar>

        </AppBar>
    );
}