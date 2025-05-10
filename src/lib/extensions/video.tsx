import { Node, mergeAttributes } from '@tiptap/core';

export const Video = Node.create({
	name: 'video',

	group: 'block',
	selectable: true,
	atom: true,

	addAttributes() {
		return {
			src: {
				default: 'responsive-youtube',
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'video',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ['video', mergeAttributes(HTMLAttributes, { controls: '', class: 'responsive-youtube' })];
	},
});
