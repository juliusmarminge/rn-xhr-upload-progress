const server = Bun.serve({
  async fetch(req) {
    if (req.method === "POST") {
      const blob = await req.blob();
      console.log(">>> POST", blob);
      return new Response(blob);
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log("Server running on port", server.port);
