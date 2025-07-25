# README Improver 🦆

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), and [NextUI](https://nextui.org/).

The application improves the README file of any git repository you have access to, all from your handy browser window.

![A single-input form with the tabs 'Repo', 'Authenticate', and 'Quack'](./public/example.png 'Landing page')

## Launching dev

After installing the NPM dependencies, run

```bash
npm run dev
```

Open [http://localhost:3434](http://localhost:3434) with your browser and follow the prompts on the form.

## Deploying

Build image

```bash
docker build -t readme-improver .
```

Lol "deploy" it (I just discovered you can pipe these directly and I'm abusing it)

```bash
docker save readme-improver:latest | gzip | ssh user@remote docker load

ssh user@remote docker run -d -p 3434:3434 -t readme-improver:latest
```

---

### Notes

Error feedback is almost non-existent, so you'll have to either look in your terminal or your browser's network tab if you encounter issues.

Currently only supports GitHub HTTPS URLs in the form of `https://github.com/jm-janzen/readme-improver`.

I also sincerely apologise that clicking the 'Quack' button does not actually produce a quacking sound. 😔


quack

quack
