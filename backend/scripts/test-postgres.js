const { execSync } = require("child_process");

try {
  console.log("🧹 Suppression du conteneur pgtest s'il existe...");
  execSync("docker rm --force pgtest", { stdio: "inherit" });
} catch (err) {}

console.log("🐘 Lancement du conteneur Postgis pour les tests...");
execSync(
  `docker run -d -p 5434:5432 --name pgtest \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_USER=user \
  -e POSTGRES_DB=db \
  postgis/postgis`,
  { stdio: "inherit" }
);

// 👉 Ajoute ceci pour laisser PostgreSQL démarrer :
console.log("⏳ Attente 5s pour que PostgreSQL soit prêt...");
execSync("sleep 5"); // 5s = souvent suffisant, sinon mets 10
console.log("✅ PostgreSQL prêt !");
