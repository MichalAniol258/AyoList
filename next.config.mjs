/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/graphql", // Lokalny endpoint
                destination: "https://graphql.anilist.co", // Faktyczne API AniList
            },
        ];
    },




};

export default nextConfig;
