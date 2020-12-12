module.exports = ctx => ({
  map: ctx.env === "development" ? ctx.map : false,
  plugins: [
    require("postcss-import"),
    require("autoprefixer"),
    require("postcss-preset-env")({
      autoprefixer: true
    }),
    ctx.env === "production" ? require("cssnano")({
      preset: "default"
    }) : false
  ]
});

