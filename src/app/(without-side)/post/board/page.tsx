import PostEditor from '@/components/layouts/without-side/postEditor';

export default function Page() {
	return (
		<div className="flex flex-col mx-auto">
			<p>게시글 작성 페이지</p>
			<PostEditor />
		</div>
	);
}
