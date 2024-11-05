//todos route

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest){
    const {userId} = auth();

    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {searchParams} = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";

    try {
        const todos = await prisma.todo.findMany({
            where: {
                id: userId,
                title: {
                    contains: search,
                    mode: "insensitive",//case sensitive
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: ITEMS_PER_PAGE,
            skip: (page - 1) * ITEMS_PER_PAGE,
        });

        const totalItems = await prisma.todo.count({
            where: {
                id: userId,
                title: {
                    contains: search,
                    mode: "insensitive",
                }
            },
        });


        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        return NextResponse.json({
            todos,
            currentPage: page,
            totalPages
        });

    } catch (error: any) {
        console.error("Error fetching todos:", error);
        return NextResponse.json({error: "Internal server Error."}, {status: 500});
    }
}

//adding new todo
export async function POST(req: NextRequest){
    const {userId} = auth();

    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            todos: true,
        }
    });

    console.log(user); //for debugging

    if(!user){
        return NextResponse.json({error: "User not found"}, {status: 404});
    }


    //if user is not subcriber
    if(!user.isSubscribed && user.todos.length >= 3){
        //limit exhaustion
        return NextResponse.json({error: "Free Users can only have 3 todos, please subscribe"}, {status: 403});
    }

    const {title} = await req.json();

    const newTodo = await prisma.todo.create({
        data: {
            title,
            userId,
        }
    });

    return NextResponse.json(newTodo, {status: 201});
}