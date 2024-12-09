import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>README Header Adder</h1>


      <div>
        <label>GitHub repo URL</label>&nbsp;
        <input placeholder='ex: https://github.com/octocat/Hello-World'></input>
        <hr />
        <button>Submit</button>
      </div>

      <Link href="#">Project Source</Link>
    </div>
  );
}
