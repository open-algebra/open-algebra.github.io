/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', typescript: {
        ignoreBuildErrors: true,
    }, async redirects() {
        return [{
            /*
            Oasis Web was originally a React Vite project called 'webapp' which had the GitHub pages route of `/webapp'
            this has now been replaced by the '/app' route in this repository.
             */
            source: '/webapp', destination: '/app', permanent: true,
        }]
    },
    images: { unoptimized: true }
};

export default nextConfig;
