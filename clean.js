let fs = require("fs"),
    path = require("path"),
    UglifyJS = require("uglify-js"),
    CleanCSS = require("clean-css"),
    htmlMinifier = require("html-minifier").minify,
    minifyJS = (i) => {
        var e = UglifyJS.minify(fs.readFileSync(i, "utf8"));
        if (e.error) throw e.error;
        fs.writeFileSync(i, e.code, "utf8");
    },
    minifyCSS = (i) => {
        var e = new CleanCSS().minify(fs.readFileSync(i, "utf8"));
        fs.writeFileSync(i, e.styles, "utf8");
    },
    minifyHTML = (i) => {
        var e = htmlMinifier(fs.readFileSync(i, "utf8"), {
            collapseWhitespace: !0,
            removeComments: !0,
            minifyJS: !0,
            minifyCSS: !0,
        });
        fs.writeFileSync(i, e, "utf8");
    },
    walkSync = (e, n = []) => (
        fs.readdirSync(e).forEach((i) => {
            n = fs.statSync(path.join(e, i)).isDirectory()
                ? walkSync(path.join(e, i), n)
                : n.concat(path.join(e, i));
        }),
        n
    ),
    minifyFiles = (i) => {
        walkSync(i).forEach((i) => {
            i.endsWith(".js") && minifyJS(i),
                i.endsWith(".css") && minifyCSS(i),
                i.endsWith(".html") && minifyHTML(i);
        });
    };
minifyFiles("./");
///