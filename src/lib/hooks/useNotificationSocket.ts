'use client';

import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useNotificationStore } from '../store/useNotificationStore';

export default function useNotificationSocket(userId: string | null) {
	useEffect(() => {
		if (!userId) return;

		const socket = new SockJS('https://kick-on.kr/ws');
		const client = new Client({
			webSocketFactory: () => socket,
			reconnectDelay: 5000,
			debug: (str) => console.log('%c[STOMP DEBUG]', 'color: gray', str), // 디버깅 로그
		});

		client.onConnect = () => {
			console.log('[STOMP] 연결 성공');
			client.subscribe(`/topic/notify/${userId}`, (message) => {
				const newNotification = JSON.parse(message.body);
				console.log('알림 수신', newNotification);
				useNotificationStore.getState().addNotification(newNotification);
			});
		};

		client.onStompError = (frame) => {
			console.error('[STOMP ERROR]', frame.headers['message'], frame.body);
		};

		client.onWebSocketError = (error) => {
			console.error('[WebSocket ERROR]', error);
		};

		client.onWebSocketClose = (event) => {
			console.warn('[WebSocket] 연결이 닫힘', event);
		};

		client.activate();

		return () => {
			client.deactivate(); // cleanup
		};
	}, [userId]);
}
