import { WebClient } from '@slack/web-api';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL_ID;

const client = new WebClient(SLACK_TOKEN);

// Slack 알림 함수
async function sendSlackMessage(text) {
	try {
		const res = await client.chat.postMessage({
			channel: SLACK_CHANNEL,
			text,
		});

		if (!res.ok) {
			console.error('❌ Slack API 전송 실패:', res.data.error);
		} else {
			console.log('✅ Slack 알림 전송 완료');
		}
	} catch (err) {
		console.error('❌ Slack 알림 전송 실패:', err.message);
	}
}

// Next.js 서버 실행
console.log('🚀 Next.js 서버를 시작합니다...');
const nextProcess = spawn('node', ['node_modules/next/dist/bin/next', 'start'], {
	shell: true,
});

// 서버 로그 실시간 수신
nextProcess.stdout.on('data', async (data) => {
	const message = data.toString();
	process.stdout.write(message); // 서버 로그 그대로 출력

	// 서버가 완전히 준비됐다는 로그 패턴 감지
	if (message.includes('Ready')) {
		console.log('✅ Next.js 서버 준비 완료');
		await sendSlackMessage(`:ballot_box_with_check: [FRONTEND] 배포가 완료되었습니다! :ballot_box_with_check:`);
	}
});

// 서버 에러 로그 출력
nextProcess.stderr.on('data', (data) => {
	const errorMessage = data.toString();
	process.stderr.write(errorMessage);
});

// 서버 실행 자체가 실패한 경우
nextProcess.on('error', async (err) => {
	console.error('❌ Next.js 서버 실행 실패:', err.message);
	// await sendSlackMessage(
	//   `:x: [FRONTEND] Next.js 서버 실행 실패!\n에러: ${err.message}`
	// );
});

// 프로세스 종료 감지
nextProcess.on('close', async (code) => {
	if (code !== 0) {
		console.error(`❌ Next.js 서버 비정상 종료 (code: ${code})`);
		// await sendSlackMessage(
		//   `:x: [FRONTEND] Next.js 서버가 비정상 종료되었습니다. (code: ${code})`
		// );
	}
});
