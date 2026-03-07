import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) return;

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('https://toolswap-1.onrender.com/ws'),

            connectHeaders: {
                Authorization: `Bearer ${authToken}`
            },
            reconnectDelay: 5000,

            onConnect: () => {
                console.log('✅ Connected to Real-Time Notification Server');
                stompClient.subscribe('/user/queue/notifications', (message) => {
                    const notificationText = message.body;

                    toast.success(notificationText, {
                        position: "top-right",
                        autoClose: 5000,
                    });

                    setNotifications((prev) => [notificationText, ...prev]);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
            },
        });
        stompClient.activate();

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, []); // Empty dependency array ensures it runs once on mount

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};