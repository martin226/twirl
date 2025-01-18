/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // No need for experimental.appDir anymore,
    webpack: function (config, options) {
      config.experiments = { asyncWebAssembly: true, ...config.experiments };
      return config;
    }
  };
  
  module.exports = nextConfig;
  