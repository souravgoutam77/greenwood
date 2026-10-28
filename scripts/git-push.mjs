import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import fs from 'node:fs';

const dir = process.cwd();

const repoUrl = process.argv[2] || process.env.GITHUB_REPO_URL;
const token = process.argv[3] || process.env.GITHUB_TOKEN;

if (!repoUrl) {
  console.log('Usage: node scripts/git-push.mjs <repo-url> [github-token]');
  process.exit(1);
}

async function push() {
  console.log(`[GIT PUSH] Pushing 'main' branch to: ${repoUrl}`);

  try {
    await git.addRemote({ fs, dir, remote: 'origin', url: repoUrl, force: true });
  } catch {
    // remote already exists
  }

  const pushResult = await git.push({
    fs,
    http,
    dir,
    url: repoUrl,
    remote: 'origin',
    ref: 'main',
    force: true,
    onProgress: (progress) => {
      console.log(`[GIT PROGRESS] ${progress.phase}: ${progress.loaded} / ${progress.total || '?'}`);
    },
    onAuth: () => ({
      username: token,
      password: '',
    }),
  });

  console.log('[GIT PUSH] Push completed successfully!', JSON.stringify(pushResult));
}

push().catch((err) => {
  console.error('[GIT PUSH ERROR]', err.message || err);
  process.exit(1);
});
