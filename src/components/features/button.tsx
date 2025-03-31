'use client';

import { useState } from 'react';
import { JWT, SERVER_URL } from '@/services/config/constants';

const PrivacyAgreementButton = () => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);

	const handleAgree = async () => {
		setLoading(true);
		setError(null);

		const requestBody = {
			privacyAgreedAt: new Date().toISOString().split('.')[0] + 'Z',
			marketingAgreedAt: new Date().toISOString().split('.')[0] + 'Z',
		};

		console.log(requestBody);
		try {
			const response = await fetch(`${SERVER_URL}/api/user/privacy`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${JWT}`,
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				throw new Error('Failed to submit agreement');
			}

			setSuccess(true);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<button onClick={handleAgree} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded">
				{loading ? '동의 처리 중...' : '개인정보 및 마케팅 동의'}
			</button>
			{success && <p className="text-green-500 mt-2">동의 완료!</p>}
			{error && <p className="text-red-500 mt-2">오류 발생: {error}</p>}
		</div>
	);
};

export default PrivacyAgreementButton;
