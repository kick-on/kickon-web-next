import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import PollComponent from '../../../common/poll/poll-component';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		pollComponent: {
			setPoll: () => ReturnType;
		};
	}
}

export default Node.create({
	name: 'pollComponent',
	group: 'block',
	atom: true,

	// HTML -> 에디터: 아래 태그를 만나면 PollComponent로 변환
	parseHTML() {
		return [
			{
				tag: 'div[data-type="poll-component"]',
			},
		];
	},

	// 에디터 -> HTML: portal만 남김
	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, {
				'data-type': 'poll-component', // tiptap 파싱용 식별자
				id: 'poll-wrapper', // portal 용 식별자
			}),
		];
	},

	// 에디터에 PollComponent 렌더링
	addNodeView() {
		return ReactNodeViewRenderer(PollComponent);
	},

	addCommands() {
		return {
			setPoll:
				() =>
				({ commands }) => {
					return commands.insertContent({
						type: 'pollComponent',
					});
				},
		};
	},
});
