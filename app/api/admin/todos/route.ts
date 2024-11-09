//admin routes

import { NextRequest, NextResponse } from "next/server";
import { clerkClient, auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const ITEMS_PER_PAGE = 10;

async function isAdmin(userId: string) {
  const user = await clerkClient.users.getUser(userId);
  return user.publicMetadata.role === "admin";
}

export async function GET(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } 

  if(!(await isAdmin(userId))){
    return NextResponse.json({error: "Forbidden"}, {status: 403});
  }

  
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const page = parseInt(searchParams.get("page") || "1");

  try {
    const user = await prisma.user.findUnique({
        where: {
            email: email || "",
        },
        include: {
            todos: {
                orderBy: {createdAt: "desc"},
                take: ITEMS_PER_PAGE,
                skip: (page - 1) * ITEMS_PER_PAGE
            },
        },
    });

    if(!user){
        return NextResponse.json({user: null, totalPage: 0, currentPage : 1}, {status: 200});
    }

    const totalTodos = await prisma.todo.count({
        where: {
            userId: user.id,
        }
    });

    const totalPage = Math.ceil(totalTodos / ITEMS_PER_PAGE);

    return NextResponse.json({user, totalPage, currentPage : page}, {status: 200});
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server Error." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
    const {userId} = auth();


    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    if(!(await isAdmin(userId))){
        return NextResponse.json({error: "Forbidden"}, {status: 403});
    }

    try {
        const {email, isSubscribed, todoId, todoCompleted} = await req.json();

        if(todoId !== undefined && todoCompleted !== undefined){
            const updatedTodo = await prisma.todo.update({
                where: {
                    id: todoId,
                },
                data: {
                    completed: todoCompleted,
                }
            });
            return NextResponse.json({todo: updatedTodo, message : "Todo Updated Successfully"}, {status: 200});
        } else if(isSubscribed !== undefined){
            const updatedUser = await prisma.user.update({
                where: {
                    email,
                },
                data: {
                    isSubscribed,
                    subscriptionEnds : isSubscribed ? new Date(Date.now() + 30 * 34 * 60 * 60 * 1000) : null
                }
            });
            return NextResponse.json({updatedUser, message: "Subscription Updated Successfully"},  {status: 200});
        } else {
            return NextResponse.json({error: "Invalid request"}, {status: 400});
        }
    } catch (error: any) {
        return NextResponse.json({error: "Internal server Error."}, {status: 500});
    }

}

export async function DELETE(req: NextRequest) {
    const {userId} = auth();

    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    if(!(await isAdmin(userId))){
        return NextResponse.json({error: "Forbidden"}, {status: 403});
    }

    try {
        const {todoId} = await req.json();

        if(!todoId){
            return NextResponse.json({error: "Todo Id is required"}, {status: 400});
        }

        await prisma.todo.delete({
            where: {
                id: todoId,
            }
        });

        return NextResponse.json({message: "Todo Deleted Successfully"}, {status: 200});
    } catch (error: any) {
        return NextResponse.json({error: "Internal server Error."}, {status: 500});
    }
}
