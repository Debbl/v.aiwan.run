// @ts-check
import { config } from "@debbl/eslint-config";

export default config({
  ignores: {
    files: ["public"],
  },
  typescript: true,
  react: true,
  tailwindcss: true,
});
