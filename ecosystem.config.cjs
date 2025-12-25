module.exports = {
	apps: [
		{
			name: 'my-front-app',
			cwd: '/home/ubuntu/web-nextjs-service',
			script: 'node_modules/next/dist/bin/next',
			args: 'start -p 3000',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
