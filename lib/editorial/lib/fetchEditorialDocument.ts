import { Query } from "appwrite";
import { editorial_database } from "#config/appwrite.client";

const APPWRITE_ROW_ID_REGEX = /^[a-f0-9]{20,24}$/i;

function isLikelyAppwriteRowId(value: string): boolean {
  return APPWRITE_ROW_ID_REGEX.test(value);
}

export function editorialNeedsRemoteFetch(article: {
  content?: string | null;
}): boolean {
  const c = typeof article.content === "string" ? article.content : "";
  return c.trim().length === 0;
}

export function canFetchFullEditorial(article: Record<string, unknown>): boolean {
  const id = article.$id;
  if (typeof id === "string" && id.length > 0) return true;
  const slug = article.slug;
  return typeof slug === "string" && slug.length > 0;
}

export function editorialRowToArticle(
  row: Record<string, unknown>,
): EditorialSchemaTypes & { $id?: string } {
  return {
    headline: typeof row.headline === "string" ? row.headline : "",
    summary: typeof row.summary === "string" ? row.summary : "",
    cover: typeof row.cover === "string" ? row.cover : "",
    date: (row.date as string | Date | undefined) ?? (typeof row.$createdAt === "string" ? row.$createdAt : ""),
    content: typeof row.content === "string" ? row.content : "",
    slug: typeof row.slug === "string" ? row.slug : "",
    ...(typeof row.$id === "string" ? { $id: row.$id } : {}),
  };
}

async function getEditorialByRowId(rowId: string) {
  try {
    const row = await editorial_database.getRow({
      databaseId: process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_DATABASE_ID!,
      tableId: process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_COLLECTION_ID!,
      rowId,
    });
    return { isOk: true as const, data: row as Record<string, unknown> };
  } catch {
    return { isOk: false as const, message: "Editorial lookup failed" };
  }
}

async function findEditorialBySlug(slug: string) {
  try {
    const res = await editorial_database.listRows({
      databaseId: process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_DATABASE_ID!,
      tableId: process.env.EXPO_PUBLIC_APPWRITE_EDITORIAL_COLLECTION_ID!,
      queries: [Query.equal("slug", slug), Query.limit(1)],
    });
    const row = res.rows?.[0] as Record<string, unknown> | undefined;
    if (!row) return { isOk: false as const, message: "Editorial not found" };
    return { isOk: true as const, data: row };
  } catch {
    return { isOk: false as const, message: "Editorial lookup failed" };
  }
}

/**
 * Loads a full editorial row from Appwrite: prefers $id (getRow), then slug if it
 * looks like a row id, then slug equality query for human-readable slugs.
 */
export async function fetchEditorialDocument(article: Record<string, unknown>) {
  const primaryId = typeof article.$id === "string" ? article.$id : null;
  if (primaryId) {
    const got = await getEditorialByRowId(primaryId);
    if (got.isOk) return got;
  }

  const slug = typeof article.slug === "string" ? article.slug : null;
  if (slug && isLikelyAppwriteRowId(slug) && slug !== primaryId) {
    const got = await getEditorialByRowId(slug);
    if (got.isOk) return got;
  }

  if (slug) {
    return findEditorialBySlug(slug);
  }

  return { isOk: false as const, message: "Editorial not found" };
}
