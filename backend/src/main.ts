import startServer from "./Server";

export default async function main(): Promise<void> {
  const { port } = await startServer();
  console.log(`Listening on PORT => ${port} 🚀`)
}
main();
