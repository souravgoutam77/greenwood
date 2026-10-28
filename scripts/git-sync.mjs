import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'node:fs';
import path from 'node:path';

const dir = process.cwd();

async function stageAndCommit() {
  console.log('[GIT] Scanning files...');
  await git.init({ fs, dir });

  // Update HEAD to point to main branch if not already
  try {
    await git.branch({ fs, dir, ref: 'main', checkout: true });
  } catch {
    // Already on main or first commit
  }

  const status = await git.statusMatrix({ fs, dir });
  const filesToAdd = [];

  for (const [filepath, head, workdir, stage] of status) {
    // If modified or untracked
    if (workdir !== stage || head !== workdir) {
      if (workdir === 0) {
        // Deleted file
        await git.remove({ fs, dir, filepath });
      } else {
        filesToAdd.push(filepath);
      }
    }
  }

  console.log(`[GIT] Staging ${filesToAdd.length} files...`);
  for (const filepath of filesToAdd) {
    await git.add({ fs, dir, filepath });
  }

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Greenwood Team',
      email: 'admin@greenwoodcafe.in',
    },
    message: 'Greenwood Café & Restaurant — Production Ready Release v1.0.0 (Pure Veg, SQLite Native Backend, Live Admin Sync)',
  });

  console.log(`[GIT] Successfully committed: ${sha}`);

  const commits = await git.log({ fs, dir, depth: 3 });
  console.log('\n[GIT] Recent Commit Log:');
  commits.forEach((c) => {
    console.log(`- ${c.oid.substring(0, 7)}: ${c.commit.message.split('\n')[0]} (${c.commit.author.name})`);
  });
}

stageAndCommit().catch((err) => {
  console.error('[GIT ERROR]', err);
  process.exit(1);
});
