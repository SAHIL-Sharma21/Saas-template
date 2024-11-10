//admin routes
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {db} from '@/lib/drizzle';
import { todos, users } from "@/drizzle/schema";
import { count, desc, eq } from "drizzle-orm";


const ITEMS_PER_PAGE = 10;

//functio to check the user is admin or not
async function isAdmin(userId: string) {
  const user = await clerkClient.users.getUser(userId);
  return user.publicMetadata.role === "admin";
}

export async function GET(req: NextRequest) {
  const { userId } = auth();

  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const page = parseInt(searchParams.get("page") || "1");

  try {
    let userData;
    if (email) {
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

        if(userResult.length > 0){
          const userTodos = await db
            .select()
            .from(todos)
            .where(eq(todos.userId, userResult[0].id))
            .orderBy(desc(todos.createdAt))
            .limit(ITEMS_PER_PAGE)
            .offset((page -1) * ITEMS_PER_PAGE);

            userData = {
              ...userResult[0],
              todos: userTodos,
            }
        }
    }

    const totalItems: number = email ? 
      await db.select({count: count()})
        .from(users)
        .where(eq(users.email, email))
        .then((result) => result[0]?.count || 0)
      : 0;


    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return NextResponse.json(
      { user: userData, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
    const {userId} = auth();

    if(!userId || !(await isAdmin(userId))){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try {
        const {email, isSubscribed, todoId, todoCompleted, todoTitle} = await req.json();

        //if user is subscribed then updating
        if(isSubscribed !== undefined){
            await db
                .update(users)
                .set({
                  isSubscribed: isSubscribed,
                  subscriptionEnds: isSubscribed ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
                })
                .where(eq(users.email, email));
        }

        //if we have todo
        if(todoId){
          const updateData: any = {};
          if(todoCompleted !== undefined){
            updateData.completed = todoCompleted;
          }
          if(todoTitle) updateData.title = todoTitle;

          await db
            .update(todos)
            .set(updateData)
            .where(eq(todos.id, todoId));
        }

        return NextResponse.json({message: "Updated successfully"}, {status: 200});
    } catch (error: any) {
        return NextResponse.json({error: "Internal server Error."}, {status: 500});
    }
}   

export async function DELETE(req: NextRequest) {
    const {userId} = auth();

    if(!userId || !(await isAdmin(userId))){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try {
        const {todoId} = await req.json();

        if(!todoId){
            return NextResponse.json({error: "Todo Id is required"}, {status: 400});
        }

        await db
            .delete(todos)
            .where(eq(todos.id, todoId));

        return NextResponse.json({error: "Todo Deleted Successfully"}, {status: 200});
    } catch (error: any) {
        return NextResponse.json({error: "Internal server Error."}, {status: 500});
    }

}
