import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'powerplaza.net',
      },
      {
        protocol: 'http',
        hostname: 'powerplaza.net',
      },
      {
        protocol: 'https',
        hostname: 'www.powerplaza.net',
      },
      {
        protocol: 'http',
        hostname: 'www.powerplaza.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cloudbf.com',
      },
    ],
  },
};

export default withNextIntl(config);