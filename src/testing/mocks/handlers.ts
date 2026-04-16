import { http, HttpResponse } from 'msw';

import { db, initializeDb } from './db';

export const handlers = [
  http.get('*/api/names', async () => {
    await initializeDb();
    return HttpResponse.json({ data: db.name.getAll() });
  }),

  http.get('*/api/categories', async () => {
    await initializeDb();
    return HttpResponse.json({ data: db.category.getAll() });
  }),

  http.get('*/api/letters', async () => {
    await initializeDb();
    return HttpResponse.json({
      data: db.letter.getAll().map((l) => l.value),
    });
  }),
];
