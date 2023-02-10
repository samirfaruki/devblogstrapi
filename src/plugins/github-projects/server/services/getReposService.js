"use strict";

const { request } = require("@octokit/request");
// or: import { request } from "@octokit/request";
const axios = require("axios");

module.exports = ({ strapi }) => ({
  getProjectForRepo: async (repo) => {
    const { id } = repo;
    const matchingProjects = await strapi.entityService.findMany(
      "plugin::github-projects.project",
      {
        filters: {
          repositoryId: id,
        },
      }
    );
    if (matchingProjects.length == 1) return matchingProjects[0].id;
    return null;
  },
  getPublicRepos: async () => {
    const result = await request("GET /user/repos", {
      headers: {
        authorization: `token ${process.env.GITHUBTOKEN}`,
      },
      // org: "octokit",
      type: "public",
    });

    return Promise.all(
      result.data.map(async (item) => {
        const { id, name, description, html_url, owner, default_branch } = item;
        // console.log(item);
        const readMeUrl = `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/README.md`;
        const longDescription = await axios
          .get(readMeUrl)
          .then((response) => {
            // console.log(response.data);
            return response.data.toString();
          })
          .catch((err) => {
            console.log(err);
          });

        // console.log(longDescription);
        const repo = { id, name, url: html_url, longDescription };
        const relatedProjectId = await strapi
          .plugin("github-projects")
          // .service("githubReposService")
          // .getProjectForRepo(repo);
        return {
                     ...repo,
          projectId: relatedProjectId,
        };
      })
    );
    // // console.log(`${result.data.length} repos found.`);
    // console.log(id, name, description, html_url);s
    return result;
  },
});
