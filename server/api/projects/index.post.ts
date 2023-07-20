import { randomUUID } from "crypto";
import { categories } from "~/server/data/categories";
import { projects } from "~/server/data/projects";
import { ProjectT } from "~/types";

export default defineEventHandler(async (event): { data: ProjectT } => {
  const uuid = randomUUID();
  const {
    categoryUuid,
    title,
    description,
    image,
    softCap,
    hardCap,
    finishesAt,
  } = await readBody(event);

  if (!categoryUuid) {
    throw createError({
      statusCode: 400,
      statusMessage: `Category is required`,
    });
  }

  if (!title) {
    throw createError({
      statusCode: 400,
      statusMessage: `Title is required`,
    });
  }

  if (!description) {
    throw createError({
      statusCode: 400,
      statusMessage: `Description is required`,
    });
  }

  if (!image) {
    throw createError({
      statusCode: 400,
      statusMessage: `Image is required`,
    });
  }

  if (!softCap) {
    throw createError({
      statusCode: 400,
      statusMessage: `Soft cap is required`,
    });
  }

  if (!hardCap) {
    throw createError({
      statusCode: 400,
      statusMessage: `Hard cap is required`,
    });
  }

  if (!finishesAt) {
    throw createError({
      statusCode: 400,
      statusMessage: `Finished at is required`,
    });
  }

  const category = categories.find((c) => c.uuid === categoryUuid);

  if (!category) {
    throw createError({
      statusCode: 400,
      statusMessage: `Category with ID ${categoryUuid} not found`,
    });
  }

  const project: ProjectT = {
    uuid,
    title,
    excerpt: `${description.substring(0, 130)} ...`,
    description,
    image,
    category,
    pledged: 0,
    backers: 0,
    funded: "0",
    softCap: `${softCap}00`,
    hardCap: `${hardCap}00`,
    finishesAt: new Date(finishesAt),
    createdAt: new Date(),
    lastUpdatedAt: new Date(),
  };

  projects.push(project);

  return {
    data: project,
  };
});
