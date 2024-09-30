import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import open from 'open'

import { extractOwnerAndRepoFromGitRemoteURL } from './src/modules/release/utils/index.mjs'
import { checkValidations } from './src/modules/release/validations/index.mjs'
import packageJSON from './package.json' assert { type: 'json' };
import { question, exec } from './src/utils/index.mjs'
import { COLORS } from './src/constants/index.mjs'

async function makeRelease(commitAndPush = true) {
    console.clear()

    const { version } = packageJSON

    const newVersion = await question(
        `Enter a new version: ${COLORS.SOFT_GRAY}(current is ${version})${COLORS.RESET} `
    )

    if (checkValidations({ version, newVersion })) {
        return
    }

    packageJSON.version = newVersion

    try {
        console.log(
            `${COLORS.CYAN}> Updating package.json version...${COLORS.RESET}`
        )

        await writeFile(
            resolve('package.json'),
            JSON.stringify(packageJSON, null, 2)
        )

        if (commitAndPush) {
            console.log(`${COLORS.CYAN}> Trying to release it...${COLORS.RESET}`)
            exec(
                [
                    `git commit -am v${newVersion}`,
                    `git tag v${newVersion}`,
                    `git push`,
                    `git push --tags`,
                ],
                { inherit: true }
            )

        } else {
            console.log(`\n${COLORS.BLUE}Commit and push skipped!${COLORS.RESET}\n`);
        }

        const [repository] = exec([`git remote get-url --push origin`])
        const ownerAndRepo = extractOwnerAndRepoFromGitRemoteURL(repository)

        console.log(`${COLORS.CYAN}> Opening the repository releases page...${COLORS.RESET}`)
        await open(`https://github.com/${ownerAndRepo}/releases`)

        console.log(`${COLORS.CYAN}> Opening the repository actions page...${COLORS.RESET}`)
        await open(`https://github.com/${ownerAndRepo}/actions`)

        console.log(`\n${COLORS.GREEN}Done!${COLORS.RESET}\n`)
    } catch ({ message }) {
        console.log(`
    🛑 Something went wrong!\n
      👀 Error: ${message}
    `)
    }
}

const args = process.argv.slice(2)
const commitAndPush = args.length === 0 || !(args[0] === '--test' || args[0] === '-t')
makeRelease(commitAndPush);