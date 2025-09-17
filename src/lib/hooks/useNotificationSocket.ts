'use client';

import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useNotificationStore } from '../store/useNotificationStore';
import { SOCKET_URL } from '@/services/config/constants';

export default function useNotificationSocket(userId: string | null) {
	const clientRef = useRef<Client | null>(null);

	useEffect(() => {
		if (!userId) return;
		console.log(userId);
		// userId가 바뀌면 기존 연결 끊기
		if (clientRef.current) {
			clientRef.current.deactivate();
			clientRef.current = null;
		}

		const socket = new SockJS(SOCKET_URL);
		const client = new Client({
			webSocketFactory: () => socket,
			reconnectDelay: 5000,
			// debug: (str) => console.log('%c[STOMP DEBUG]', 'color: gray', str), // 디버깅 로그
		});

		client.onConnect = (frame) => {
			console.log('[STOMP] 연결 성공', frame);
			const subscription = client.subscribe(`/topic/notify/${userId}`, (message) => {
				// console.log('[STOMP] 메시지 수신 RAW:', message);
				try {
					const newNotification = JSON.parse(message.body);
					// console.log('[STOMP] 파싱된 알림:', newNotification);
					useNotificationStore.getState().addNotification(newNotification);
				} catch (e) {
					console.error('[STOMP] 메시지 파싱 실패', e);
				}
			});
			console.log('[STOMP] 구독 완료:', subscription.id);
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
