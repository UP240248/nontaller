import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests/e2e',workers:1,fullyParallel:false,retries:0,reporter:'list',
 use:{baseURL:'http://localhost:4201',headless:true,launchOptions:{executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']},trace:'retain-on-failure'},
 webServer:{command:'node scripts/e2e-server.mjs',url:'http://localhost:4201',reuseExistingServer:false,timeout:120000}
});
