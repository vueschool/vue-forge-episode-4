import { faker } from "@faker-js/faker";
import { categories } from "~/server/data/categories";
import { ProjectT } from "~/types";

export const projects: ProjectT[] = [];

for (const amount of new Array(150).fill(0)) {
  const description = faker.lorem.paragraph({ min: 30, max: 700 });
  const funded = faker.number.bigInt({ min: 1000, max: 100000 });
  const softCap = faker.number.bigInt({ min: 0, max: 75000 });
  const hardCap = faker.number.bigInt({ min: softCap.toString(), max: 100000 });

  const pledged =
    (parseInt(funded.toString()) / parseInt(softCap.toString())) * 100;

  projects.push({
    uuid: faker.string.uuid(),
    title: faker.lorem.words({ min: 3, max: 5 }),
    excerpt: `${description.substring(0, 130)} ...`,
    description,
    image: faker.image.urlPicsumPhotos(),
    category: faker.helpers.uniqueArray(categories, 1)[0],
    pledged,
    backers: faker.number.int({ min: 0, max: 10000 }),
    funded: funded.toString(),
    softCap: softCap.toString(),
    hardCap: hardCap.toString(),
    finishesAt: faker.date.future(),
    createdAt: faker.date.past(),
    lastUpdatedAt: faker.date.past(),
  });
}

export default projects;
