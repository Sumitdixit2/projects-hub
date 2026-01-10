export default async function Home() {
  const res = await fetch("http://localhost:5000/check");
  const data = await res.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
