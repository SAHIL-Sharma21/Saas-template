//route for update and delete todo

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, {params}:{params: {id: string}}) {
    const {userId} = auth();

    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try {
        const todoId = params.id;

        const todo = await prisma.todo.findUnique({
            where: {
                id:  todoId,
            }
        });

        if(!todo){
            return NextResponse.json({error: "Todo not found"}, {status: 404});
        }

        //if the todo is not created by the logged in user
        if(todo.userId !== userId){
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        await prisma.todo.delete({
            where: {
                id: todoId,
            }
        });

        return NextResponse.json({message: "Todo deleted successfully"}, {status: 200});
    } catch (error: any) {
        console.error("Error deleting todo", error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}


export async function PUT(req: NextRequest, {params}: {params: {id: string}}) {
    const {userId} = auth();

    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try {
        const todoId = params.id;

        //finding the todo
        const todo = await prisma.todo.findUnique({
            where: {
                id: todoId,
            }
        });
        
        if(!todo){
            return NextResponse.json({error: "Todo not found"}, {status: 404});
        }

        //if the todo is not created by the logged in user
        if(todo.userId !== userId){
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        //updating the todo
        const body = await req.json();
        const {title, completed} = body;

        const updatedTodo = await prisma.todo.update({
            where: {
                id: todoId,
            },
            data: {
                title,
                completed,
            }
        });

        return NextResponse.json(updatedTodo, {status: 200});
    } catch (error: any) {
        console.error("Error updating todo", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}