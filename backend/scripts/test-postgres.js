const { execSync } = require("child_process");

try {
  console.log("🧹 Suppression du conteneur pgtest s'il existe...");
  execSync("docker rm --force pgtest", { stdio: "inherit" });
} catch (err) {
  // Pas de souci si le conteneur n'existe pas
}

console.log("🐘 Lancement du conteneur PostgreSQL pour les tests...");
execSync(
  `docker run -d -p 5434:5432 --name pgtest \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_USER=user \
  -e POSTGRES_DB=db postgres`,
  { stdio: "inherit" }
);

console.log("✅ PostgreSQL prêt sur port 5434");
