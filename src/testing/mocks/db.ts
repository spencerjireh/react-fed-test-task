import { factory, primaryKey } from '@mswjs/data';

import categoriesJson from './data/categories.json';
import lettersJson from './data/letters.json';
import namesJson from './data/names.json';

const models = {
  name: {
    id: primaryKey(String),
    title: String,
    definition: String,
    gender: Array,
    categories: Array,
  },
  category: {
    id: primaryKey(String),
    name: String,
  },
  letter: {
    value: primaryKey(String),
  },
};

export const db = factory(models);

let initialized = false;

export const initializeDb = async () => {
  if (initialized) return;
  namesJson.data.forEach((n) => db.name.create(n));
  categoriesJson.data.forEach((c) => db.category.create(c));
  lettersJson.data.forEach((v: string) => db.letter.create({ value: v }));
  initialized = true;
};

export const resetDb = () => {
  db.name.deleteMany({ where: {} });
  db.category.deleteMany({ where: {} });
  db.letter.deleteMany({ where: {} });
  initialized = false;
};
