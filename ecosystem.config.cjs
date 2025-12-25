const isProd = process.env.APPLICATION_NAME && process.env.APPLICATION_NAME.includes('prod');

module.exports = {
	apps: [
		{
			name: process.env.APPLICATION_NAME || 'my-front-app',
			cwd: '/home/ubuntu/web-nextjs-service',
			script: 'node_modules/next/dist/bin/next',
			args: 'start',
			env: {
				NODE_ENV: isProd ? 'production' : 'development',
				PORT: isProd ? 3000 : 3001,
			},
		},
	],
};
