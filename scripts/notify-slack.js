import { WebClient } from '@slack/web-api';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL_ID;

async function main() {
	if (!SLACK_TOKEN || !SLACK_CHANNEL) {
		console.error('SLACK_BOT_TOKEN 또는 SLACK_CHANNEL_ID가 설정되지 않았습니다.');
		process.exit(1);
	}

	const client = new WebClient(SLACK_TOKEN);

	const textFromArg = process.argv.slice(2).join(' ').trim();
	const defaultText = ':ballot_box_with_check: [FRONTEND] 배포가 완료되었습니다! :ballot_box_with_check:';
	const text = textFromArg.length > 0 ? textFromArg : defaultText;

	try {
		const res = await client.chat.postMessage({ channel: SLACK_CHANNEL, text });
		if (!res.ok) {
			console.error('❌ Slack API 전송 실패:', res.data?.error || 'unknown error');
			process.exit(1);
		}
		console.log('✅ Slack 알림 전송 완료');
	} catch (err) {
		console.error('❌ Slack 알림 전송 실패:', err?.message || err);
		process.exit(1);
	}
}

await main();
