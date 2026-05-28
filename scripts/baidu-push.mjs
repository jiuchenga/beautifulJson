#!/usr/bin/env node
// 百度链接主动推送脚本
// 用法: node scripts/baidu-push.mjs
// 每次运行会推送一批待推送的 URL 到百度

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROGRESS_FILE = resolve(__dirname, 'baidu-push-progress.json');
const URLS_FILE = resolve(__dirname, 'baidu-urls.txt');

function loadProgress() {
  if (!existsSync(PROGRESS_FILE)) {
    return { pushed: [], log: [] };
  }
  return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
}

function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf-8');
}

function loadAllUrls() {
  return readFileSync(URLS_FILE, 'utf-8')
    .split('\n')
    .map(u => u.trim())
    .filter(u => u.length > 0);
}

async function pushUrls(urls, site, token) {
  const endpoint = `http://data.zz.baidu.com/urls?site=${site}&token=${token}`;
  const body = urls.join('\n');

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body,
  });

  return await res.json();
}

function main() {
  const progress = loadProgress();
  const allUrls = loadAllUrls();
  const pushedSet = new Set(progress.pushed);
  const pending = allUrls.filter(u => !pushedSet.has(u));

  const site = progress.site || 'formatbeautifuljson.com';
  const token = progress.token;
  const batchSize = progress.batchSize || 2000;

  console.log(`总计: ${allUrls.length} 个 URL`);
  console.log(`已推送: ${pushedSet.size} 个`);
  console.log(`待推送: ${pending.length} 个`);

  if (pending.length === 0) {
    console.log('所有 URL 已推送完毕!');
    return;
  }

  const batch = pending.slice(0, batchSize);
  console.log(`\n本次推送 ${batch.length} 个 URL...\n`);

  pushUrls(batch, site, token).then(result => {
    const today = new Date().toISOString().slice(0, 10);

    if (result.error) {
      console.log(`推送失败: ${result.message}`);
      progress.log.push({
        date: today,
        success: 0,
        error: result.message,
        note: `尝试推送 ${batch.length} 条失败`,
      });
    } else {
      console.log(`成功: ${result.success} 条`);
      console.log(`剩余配额: ${result.remain} 条`);

      if (result.not_valid && result.not_valid.length > 0) {
        console.log(`无效: ${result.not_valid.length} 条`);
      }

      // 记录成功推送的 URL
      const successCount = result.success || 0;
      const successUrls = batch.slice(0, successCount);
      progress.pushed.push(...successUrls);

      progress.log.push({
        date: today,
        success: successCount,
        remain: result.remain,
        note: `推送 ${batch.length} 条, 成功 ${successCount} 条`,
      });
    }

    progress.total = allUrls.length;
    progress.pending = pending.length - (result.success || 0);
    saveProgress(progress);
    console.log(`\n进度已保存。剩余待推送: ${progress.pending} 个`);
  });
}

main();
