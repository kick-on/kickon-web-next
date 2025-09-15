import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
	const MAX_SIZE_MB = 1; // 1MB 기준
	const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // 바이트로 변환

	console.log('압축 전 파일 크기:', (file.size / 1024).toFixed(2), 'KB');

	// 파일이 이미 충분히 작다면 압축하지 않고 반환
	if (file.size <= MAX_SIZE_BYTES) {
		return file;
	}

	const options = {
		maxSizeMB: MAX_SIZE_MB,
		maxWidthOrHeight: 1920,
		useWebWorker: true,
		initialQuality: 0.9,
	};

	const compressedFile = await imageCompression(file, options);

	console.log('압축 후 파일 크기:', (compressedFile.size / 1024).toFixed(2), 'KB');

	return compressedFile;
};
