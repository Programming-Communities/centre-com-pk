import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { postReactions } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// GET - Get reaction counts for a post
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });

    // Get counts per reaction type
    const counts = await db.select({
      reaction: postReactions.reaction,
      count: sql<number>`count(*)`.mapWith(Number),
    }).from(postReactions)
      .where(eq(postReactions.postId, parseInt(postId)))
      .groupBy(postReactions.reaction);

    const countMap: Record<string, number> = {};
    counts.forEach((c: any) => { countMap[c.reaction] = c.count; });

    return NextResponse.json({ counts: countMap });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add/Update/Remove reaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, reaction, sessionId } = body;

    if (!postId || !sessionId) {
      return NextResponse.json({ error: 'postId and sessionId required' }, { status: 400 });
    }

    // Remove existing reaction for this user/session on this post
    await db.delete(postReactions)
      .where(and(
        eq(postReactions.postId, parseInt(postId)),
        eq(postReactions.sessionId, sessionId)
      ));

    // If reaction is provided (not null), insert new one
    if (reaction) {
      await db.insert(postReactions).values({
        postId: parseInt(postId),
        sessionId,
        reaction,
      });
    }

    // Return updated counts
    const counts = await db.select({
      reaction: postReactions.reaction,
      count: sql<number>`count(*)`.mapWith(Number),
    }).from(postReactions)
      .where(eq(postReactions.postId, parseInt(postId)))
      .groupBy(postReactions.reaction);

    const countMap: Record<string, number> = {};
    counts.forEach((c: any) => { countMap[c.reaction] = c.count; });

    return NextResponse.json({ success: true, counts: countMap, userReaction: reaction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
