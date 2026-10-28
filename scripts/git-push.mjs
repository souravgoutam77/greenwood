import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'node:fs';

const dir = process.cwd();

// Usage:
// node scripts/git-push.mjs <repo-url> [github-token]
// e.g.: node scripts/git-push.mjs https://github.com/YourUsername/greenwood.git ghp_xxxx
const repoUrl = process.argv[2] || process.env.GITHUB_REPO_URL;
const token = process.argv[3] || process.env.GITHUB_TOKEN;

if (!repoUrl) {
  console.log(`
======================================================
GREENWOOD CAFÉ & RESTAURANT — GITHUB PUSH UTILITY
======================================================

The local Git repository is completely committed on branch 'main'.
To push to your GitHub repository, run:

  node scripts/git-push.mjs <your-github-repo-url> [github-token]

Examples:
  1. With GitHub Personal Access Token (PAT):
     node scripts/git-push.mjs https://github.com/username/greenwood.git ghp_yourTokenHere

  2. Or set environment variables:
     $env:GITHUB_TOKEN="ghp_yourTokenHere"
     node scripts/git-push.mjs https://github.com/username/greenwood.git

  3. Or using GitHub CLI:
     gh repo create greenwood --public --source=. --push
======================================================
`);
  process.exit(0);
}

async function push() {
  console.log(`[GIT PUSH] Pushing 'main' branch to: ${repoUrl}`);

  // Set remote origin
  try {
    await git.addRemote({ fs, dir, remote: 'origin', url: repoUrl, force: true });
  } catch {
    // remote already exists or updated
  }

  const pushResult = await git.push({
    fs,
    http,
    dir,
    url: repoUrl,
    remote: 'origin',
    ref: 'main',
    force: false,
    onAuth: () => ({
      username: token || 'x-access-token',
      password: token || '',
    }),
  });

  console.log('[GIT PUSH] Push completed successfully!', pushResult);
}

push().catch((err) => {
  console.error('[GIT PUSH ERROR]', err.message || err);
  process.exit(1);
});
