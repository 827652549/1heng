/** @type {import('next').NextConfig} */

import withMDX from '@next/mdx'

const nextConfig = {
    async redirects(){
        return [
            // Basic redirect
            {
              source: '/redirect',
              destination: '/',
              permanent: true,
            },
            // // Wildcard path matching
            // {
            //   source: '/blog/:slug',
            //   destination: '/news/:slug',
            //   permanent: true,
            // },
          ]
    },
    pageExtensions:['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

export default withMDX()(nextConfig);
