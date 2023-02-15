"use strict"

const projectSchema=require("./project-schema");

module.exports={
    kind: "collectionType",
    collectionName: "projects",
    info: {
        singularName: "project",
        pluralName: "projects",
        displayName: "Project"
    },
    options: {
        draftAndPublish: false
    },
    attributes: {
        repositoryId: {
            type: "uid",
            unique: true,
        },
        title: {
            type: "string",
            required: true,
            unique: true,
        },
        shortDescription: {
            type: "string",
        },
        repositoryUrl: {
            type: "string",
        }
    }
}