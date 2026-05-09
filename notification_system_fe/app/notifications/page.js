"use client";

import { useEffect, useState } from "react";

import {
    Container,
    Typography,
    CircularProgress
} from "@mui/material";

import API from "../../services/api";

import Navbar from "../../components/Navbar";

import NotificationCard from "../../components/NotificationCard";

export default function NotificationsPage() {

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchNotifications();

    }, []);

    async function fetchNotifications() {

        try {

            const response =
                await API.get("/notifications");

            setNotifications(
                response.data.notifications || []
            );

        } catch (error) {

            alert("Failed to fetch notifications");

        } finally {

            setLoading(false);
        }
    }

    return (

        <>
            <Navbar />

            <Container sx={{ marginTop: 4 }}>

                <Typography
                    variant="h4"
                    gutterBottom
                >
                    All Notifications
                </Typography>

                {
                    loading
                        ? <CircularProgress />
                        : notifications.map((notification) => (

                            <NotificationCard
                                key={notification.ID}
                                notification={notification}
                            />
                        ))
                }

            </Container>
        </>
    );
}