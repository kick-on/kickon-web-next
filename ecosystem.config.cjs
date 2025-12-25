module.exports = {
	apps: [
		// Production
		{
			name: 'my-front-app-prod',
			cwd: '/home/ubuntu/web-nextjs-service',
			script: 'node_modules/next/dist/bin/next',
			args: 'start -p 3000',
			env: {
				NODE_ENV: 'production',
			},
		},
		// Development
		{
			name: 'my-front-app-dev',
			cwd: '/home/ubuntu/web-nextjs-service',
			script: 'node_modules/next/dist/bin/next',
			args: 'start -p 3001',
			env: {
				NODE_ENV: 'development',
			},
		},
	],
};
