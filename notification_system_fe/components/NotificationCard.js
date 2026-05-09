"use client";

import {
    Card,
    CardContent,
    Typography,
    Chip
} from "@mui/material";

export default function NotificationCard({ notification }) {

    return (

        <Card
            sx={{
                marginBottom: 2,
                backgroundColor: "#e3f2fd"
            }}
        >

            <CardContent>

                <Chip
                    label={notification.Type}
                    sx={{ marginBottom: 1 }}
                />

                <Typography variant="h6">
                    {notification.Message}
                </Typography>

                <Typography variant="body2">
                    {notification.Timestamp}
                </Typography>

            </CardContent>

        </Card>
    );
}