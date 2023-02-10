module.exports = {
  kind: "collectionType",
  collectionName: "project",
  info: {
    singularName: "project", // kebab-case mandatory
    pluralName: "projects", // kebab-case mandatory
    displayName: "Project",
    description: "A regular content-type",
  },
  options: {
    draftAndPublish: false,
  },

  attributes: {
    repositoryId: {
      type: "uid",
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
    },
    longDescription: {
      type: "richText",
    },
    coverImage: {
      type: "media",
      allowedTypes: ["images"],
      multiple: false,
    },
  },
};
