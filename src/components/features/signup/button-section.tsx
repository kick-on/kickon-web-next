import BottomButton from '@/components/common/bottom-button';
import { updatePrivacy, updateUserInfo } from '@/services/apis/user';
import { UpdatePrivacyRequest, UpdateUserInfoRequest } from '@/services/apis/user/dto';
import { DOMAIN_URL, SERVER_URL } from '@/services/config/constants';
import { useRouter } from 'next/navigation';

export default function ButtonSection({ provider, nickname, teams, isDuplicated, setIsDuplicated, agreements }) {
	const router = useRouter();

	const isValidNickname = nickname && !isDuplicated;
	const isAllRequiredChecked = agreements.age && agreements.term && agreements.privacy;
	const isButtonDisabled = !(isValidNickname && isAllRequiredChecked && teams);

	const handleSignupButtonClick = async () => {
		// 유저 정보 수정(저장) -> 약관 동의 -> 재로그인
		callUpdateUserInfo();
	};

	const callUpdateUserInfo = async () => {
		const updateUserInfoRequest: UpdateUserInfoRequest = {
			nickname: nickname,
			teams: teams,
		};
		const updateUserInfoResponse = await updateUserInfo(updateUserInfoRequest);

		if (updateUserInfoResponse === 'DUPLICATED_NICKNAME') {
			if (isDuplicated === false) setIsDuplicated(true); // 닉네임 중복
		} else if (typeof updateUserInfoResponse === 'string') {
			if (isDuplicated === true) setIsDuplicated(false); // 기타 오류
			console.log(updateUserInfoResponse);
		} else {
			// 성공 시
			callUpdatePrivacy();
		}
	};

	const callUpdatePrivacy = async () => {
		const privacyRequest: UpdatePrivacyRequest = {
			privacyAgreedAt: agreements.privacy && new Date().toISOString().split('.')[0] + 'Z',
			marketingAgreedAt: agreements.marketing ? new Date().toISOString().split('.')[0] + 'Z' : undefined,
		};
		const privacyResponse = await updatePrivacy(privacyRequest);

		if (typeof privacyResponse === 'string') {
			console.log(privacyResponse);
			alert('회원가입 중 문제가 발생했습니다.');
		} else {
			// 성공 시
			updateAuthority();
		}
	};

	const updateAuthority = () => {
		// 재로그인 -> 권한 업데이트
		const redirectUrl = `${DOMAIN_URL || 'http://localhost:3000'}/api/auth/${provider}/callback`;
		router.push(`${SERVER_URL}/oauth2/authorization/${provider}?state=${redirectUrl}`);
	};

	const buttons = [{ text: '회원가입', onClick: handleSignupButtonClick, disabled: isButtonDisabled }];

	return (
		<div className="mt-20">
			<BottomButton buttons={buttons} />
		</div>
	);
}
