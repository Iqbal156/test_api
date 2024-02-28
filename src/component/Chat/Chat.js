import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";
const Chat = () => {

    const socket = useMemo(
        () =>
            io("http://localhost:5000", {
                withCredentials: true,
            }),
        []
    );

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [socketID, setSocketId] = useState("");
    const [roomName, setRoomName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("message", message);
        setMessage("");

    };



    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected", socket.id);
        });

        socket.on("receive-message", (data) => {
            console.log(data);
            setMessages((messages) => [...messages, data]);

        })

        socket.on("welcome", (s) => {
            console.log(s);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    console.log(messages);

    return (
        <Container maxWidth="sm">
            <Box sx={{ height: 500 }} />
            <Typography variant="h6" component="div" gutterBottom>
                {socketID}
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    id="outlined-basic"
                    label="Message"
                    variant="outlined"
                />
                <Button type="submit" variant="contained" color="primary">
                    Send
                </Button>
            </form>

            <Stack>
                {
                    messages?.map((m, i) => (
                        <Typography variant='p' key={i}> {m} </Typography>
                    ))
                }
            </Stack>
        </Container>
    );
};

export default Chat;