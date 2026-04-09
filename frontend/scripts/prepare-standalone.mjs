import fs from 'node:fs/promises'
import path from 'node:path'

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true })
}

async function copyDir(src, dest) {
  await ensureDir(dest)
  await fs.cp(src, dest, { recursive: true, force: true })
}

async function main() {
  const projectRoot = process.cwd()

  const nextDir = path.join(projectRoot, '.next')
  const standaloneDir = path.join(nextDir, 'standalone')

  if (!(await exists(standaloneDir))) {
    throw new Error(
      `Missing ${standaloneDir}. Run "next build" first (output: 'standalone' must be enabled).`,
    )
  }

  const publicSrc = path.join(projectRoot, 'public')
  const publicDest = path.join(standaloneDir, 'public')
  if (await exists(publicSrc)) {
    await copyDir(publicSrc, publicDest)
  }

  const staticSrc = path.join(nextDir, 'static')
  const staticDest = path.join(standaloneDir, '.next', 'static')
  if (await exists(staticSrc)) {
    await copyDir(staticSrc, staticDest)
  }

  const packageJsonSrc = path.join(projectRoot, 'package.json')
  const packageJsonDest = path.join(standaloneDir, 'package.json')
  if (await exists(packageJsonSrc) && !(await exists(packageJsonDest))) {
    await fs.copyFile(packageJsonSrc, packageJsonDest)
  }
}

await main()
