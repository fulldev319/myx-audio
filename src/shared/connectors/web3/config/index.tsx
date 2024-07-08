// Using `require` as `import` does not support dynamic loading (yet).
const configEnv = require(`./${process.env.REACT_APP_ENV}.json`);
const config = { ...configEnv };
export default config;
