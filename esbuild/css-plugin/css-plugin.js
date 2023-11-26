const esbuild = require('esbuild');
const Path = require("path");
const { readFileSync } = require('fs');
const Sass = require('sass');

function cssPlugin() {
    return {
        name: 'css-plugin',

        setup(build) {
            build.onResolve({ filter: /\.(sass|scss|css)(\?.+)?$/ }, args => {
                return {
                    path: Path.isAbsolute(args.path) ? args.path :
                        Path.join(args.resolveDir, args.path),
                    namespace: "css-loader"
                };
            });

            build.onLoad({ filter: /\.(sass|scss|css)(\?.+)?$/, namespace: 'css-loader' }, async (args) => {
                let loader = 'css';
                let path = args.path;

                if (path.includes("?txt")) {
                    loader = 'text';
                    path = path.replace(/\?txt$/, '');
                }

                let contents = readFileSync(path).toString();

                if (path.includes(".css")) {
                    contents = (await esbuild.transform(contents, { minify: true, loader: 'css' })).code;
                } else if (path.includes(".scss")) {
                    contents = Sass.compileString(contents).css;
                }

                return { contents, loader, };
            });
        }
    };
}
