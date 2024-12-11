'use client'

import { FormEvent } from 'react'
import Link from 'next/link'


export default function Home() {
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const url = formData.get('git-url')
        const token = formData.get('github-pat')
        const body = JSON.stringify({ url, token })
        const response = await fetch('/api/submit-git-url', {
          method: 'POST',
          body,
        })
        const data = await response.json()

        console.log(`Attempted to look up the git URL ${url} (success: ${data.success})`, data)

        // Now how do I translate this into action...
        return { todo: true }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>README Header Adder</h1>

            <div>
                <form onSubmit={onSubmit}>
                    <label>GitHub repo URL</label>&nbsp;
                    <input name="git-url" placeholder="ex: https://github.com/octocat/Hello-World" />
                    <br />
                    <label>GitHub Token</label>&nbsp;
                    <input name="github-pat" placeholder="ex: github_pat_XYZ" />
                    <br />
                    <button type="submit">Submit</button>
                </form>
            </div>

            <Link href="#">Project Source</Link>
        </div>
    );
}
