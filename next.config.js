/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")([
  "@ant-design/icons",
  "@ant-design/icons-svg",
  "rc-util",
  "rc-pagination",
  "rc-select",
  "rc-picker",
]);

const nextConfig = withTM({
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx"],
});

module.exports = nextConfig;
