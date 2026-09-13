import { defineRailway, project, service } from "railway/iac";

// Last resort for a per-service CaC repo. Prefer one .railway file for the
// project and drop this if you later combine services into that file.
export const partial = "portfolio";

export default defineRailway(() => {
  const portfolio = service("portfolio", {
    start: "npm start",
    healthcheck: "/healthz",
    healthcheckTimeout: 30,
  });
  return project("portfolio", {
    resources: [portfolio],
  });
});
