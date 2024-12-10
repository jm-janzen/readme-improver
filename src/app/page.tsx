import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>README Header Adder</h1>


      <div>
        <label>GitHub repo URL</label>&nbsp;
        <input placeholder="ex: https://github.com/octocat/Hello-World"></input>
        <hr />
        <button>Submit</button>
      </div>

      <Link href="#">Project Source</Link>
    </div>
  );
}
