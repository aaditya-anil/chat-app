import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (userName) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!userName) return;

        socketRef.current = io('http://localhost:5000');

        socketRef.current.emit('register_user', userName);

        return () => {
            socketRef.current.disconnect();
        };
    }, [userName]);

    return socketRef;
};

export default useSocket;