import dts from 'bun-plugin-dts'

Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    plugins: [dts({
        output: { noBanner: true },
        libraries: { inlinedLibraries: ["mitt"] },
    })],
    minify: true,
    target: "browser",
    sourcemap: "linked",
})