module.exports = {
  apps : [{
    name   : "Core",
    script : "./index.js",
		interpreter: "node_modules/.bin/node",
		interpreter_args: "--trace-warnings",
		max_memory_restart: "900M"
  }]
}
