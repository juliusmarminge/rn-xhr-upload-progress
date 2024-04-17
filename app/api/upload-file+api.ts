export const POST = async (req: Request) => {
    const blob = await req.blob();
    console.log(">>> POST", blob);
    return new Response(blob);
}