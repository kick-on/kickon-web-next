import { spawn } from 'child_process';
import axios from 'axios';

// Slack 정보 (환경 변수에서 가져오기 권장)
const DEPLOY_TYPE = process.env.DEPLOY_TYPE;
const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL_ID;

const nextProcess = spawn('node', ['node_modules/next/dist/bin/next', 'start'], {
	stdio: 'inherit',
	shell: true,
});

nextProcess.on('spawn', async () => {
	try {
		await axios.post(
			'https://slack.com/api/chat.postMessage',
			{
				channel: SLACK_CHANNEL,
				text: `:ballot_box_with_check: [${DEPLOY_TYPE}] 로그 알림! :ballot_box_with_check:\nmessage : 프론트 배포가 완료됐습니다!`,
			},
			{
				headers: {
					Authorization: `Bearer ${SLACK_TOKEN}`,
					'Content-Type': 'application/json',
				},
			},
		);
		console.log('✅ Slack 알림 전송 완료');
	} catch (err) {
		console.error('❌ Slack 알림 전송 실패', err.message);
	}
});
