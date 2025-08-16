const { execSync } = require("child_process");
const fs = require("fs");

function run(cmd) {
  try {
    console.log(`👉 Running: ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
  } catch (err) {
    console.error(`❌ Failed: ${cmd}`);
  }
}

// Xoá node_modules
if (fs.existsSync("node_modules")) {
  console.log("🗑 Removing node_modules...");
  fs.rmSync("node_modules", { recursive: true, force: true });
}

// Xoá package-lock.json
if (fs.existsSync("package-lock.json")) {
  console.log("🗑 Removing package-lock.json...");
  fs.unlinkSync("package-lock.json");
}

// Xoá cache Metro bundler
run("npx react-native start --reset-cache");

// Xoá cache Gradle (chỉ áp dụng Android)
if (fs.existsSync("android")) {
  run("cd android && gradlew clean || ./gradlew clean");
}

console.log("✅ Clean finished. Now run: npm install");
