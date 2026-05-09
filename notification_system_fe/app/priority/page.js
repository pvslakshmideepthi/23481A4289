"use client";

import { useEffect, useState } from "react";

import {
    Container,
    Typography,
    CircularProgress
} from "@mui/material";

import Navbar from "../../components/Navbar";

import NotificationCard from "../../components/NotificationCard";

import API from "../../services/api";

export default function PriorityPage() {

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchPriorityNotifications();

    }, []);

    async function fetchPriorityNotifications() {

        try {

            const response =
                await API.get("/notifications");

            const data =
                response.data.notifications || [];

            const weights = {
                Placement: 3,
                Result: 2,
                Event: 1
            };

            const sorted = data.sort((a, b) => {

                return weights[b.Type]
                    - weights[a.Type];
            });

            setNotifications(sorted.slice(0, 10));

        } catch (error) {

            alert("Failed to fetch priority notifications");

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
                    Priority Inbox
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