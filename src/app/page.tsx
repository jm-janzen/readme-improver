'use client'

import React from 'react';
import {Tabs, Tab, Input, Link, Button, Card, CardBody} from '@nextui-org/react';
import { FormEvent } from 'react'
// FIXME Make import nicer
import { supportedSources, supportedProtocols } from '@/utils/strategies/strategies'
import GitUrlParse from 'git-url-parse'
import { validateToken } from '@/utils/github.com/validate-token';


export default function App() {
  const [selected, setSelected] = React.useState('repo');
  const [disabled, setDisabled] = React.useState(['auth', 'quack'])
  const [formData, setFormData] = React.useState({})

    async function onSubmitUrl(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const form = new FormData(event.currentTarget)
        const url = form.get('git-url')
        console.debug({url})
        try {
            const {
                source,
                protocol,
            } = GitUrlParse(url)

            if (!supportedSources.includes(source)) {
                throw Error(`The source '${source}' is not currently supported`)
            }

            if (!supportedProtocols.includes(protocol)) {
                throw Error(`The protocol '${protocol}' is not currently supported`)
            }

            setFormData({...formData, ...{ url }})
            setSelected('auth')
            setDisabled(['quack'])

        } catch (e) {
            console.error(e)

            setDisabled(['auth', 'quack'])
        }

    }
    async function onSubmitToken(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        console.dir({formData})
        const { url } = formData
        const form = new FormData(event.currentTarget)
        const token = form.get('github-pat') as string
        try {

            await validateToken({ url, token })

            setFormData({...formData, ...{ token }})
            setSelected('quack')
            setDisabled([])
        } catch (e) {
            console.error(e)

            setSelected('repo')
            setDisabled(['auth', 'quack'])
        }
    }
    async function onSubmitQuack(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        console.dir({formData})
        const { url, token } = formData
        try {
            const body = JSON.stringify({ url, token })
            console.debug({body})
            const response = await fetch('/api/submit-git-url', {
                method: 'POST',
                body,
            })
        } catch (e) {
            console.error(e)

            setSelected('auth')
            setDisabled(['quack'])
        }
    }

    return (
        <div className="flex flex-col w-full">
            <Card className="max-w-full w-[50%] h-[50%]">
                <CardBody className="overflow-hidden">
                    <Tabs
                        fullWidth
                        aria-label="Tabs form"
                        selectedKey={selected}
                        size="lg"
                        onSelectionChange={setSelected}
                        disabledKeys={disabled}
                    >
                        <Tab key="repo" title="Repo">
                            <form onSubmit={onSubmitUrl} className="flex flex-col gap-4">
                                <Input isRequired label="Git URL" name="git-url" placeholder="Ex: https://github.com/jm-duck/quack-public" type="text" />
                                <div className="flex gap-2 justify-end">
                                    <Button fullWidth color="primary" type="submit">
                                        Quack...?
                                    </Button>
                                </div>
                            </form>
                        </Tab>
                        <Tab key="auth" title="Authenticate">
                            <form onSubmit={onSubmitToken} className="flex flex-col gap-4 h-[300px]">
                                <Input isRequired label="Token" name="github-pat" placeholder="Ex: github_pat_XYZ" type="text" />
                                <div className="flex gap-2 justify-end">
                                    <Button fullWidth color="primary" type="submit">
                                        Authenticate Token
                                    </Button>
                                </div>
                            </form>
                        </Tab>
                        <Tab key="quack" title="Quack">
                            <form onSubmit={onSubmitQuack} className="flex flex-col gap-4 h-[300px]">
                                <div className="flex gap-2 justify-end">
                                    <Button fullWidth color="primary" type="submit">
                                        Quack!
                                    </Button>
                                </div>
                            </form>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </div>
    );
}
