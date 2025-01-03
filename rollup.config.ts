import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { RollupOptions } from "rollup";

const config: RollupOptions = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      extensions: [".js", ".ts"],
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist",
      exclude: ["**/__tests__/**"],
      include: ["src/**/*"],
    }),
  ],
};

export default config;
