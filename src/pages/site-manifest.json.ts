import type { APIRoute } from 'astro';
import { getRoutes } from '../data/routes';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await getRoutes(), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
