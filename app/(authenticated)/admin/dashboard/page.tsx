// admin dashboard
'use client';


import { Todo, User } from '@prisma/client';
import { ok } from 'assert';
import React, { useCallback, useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts';


interface UserWithTodos extends User {
    todos: Todo[]
}

export default function AdminDashboard() {

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [user, setUser] = useState<UserWithTodos | null>(null);
    const [debouncedEmail, setDebouncedEmail] = useDebounceValue("", 3000);


    const fetchUserData = useCallback(async(page: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/?email=${debouncedEmail}&page=${page}`);

            if(!response.ok){
                throw new Error("Failed to fetch user data");
            }

            const data = await response.json();
            setUser(data.user);
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPage)

            //toast can be added here after succesfully fetching user data
        } catch (error: any) {
            console.error("Error fetching user data", error);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedEmail]);


    useEffect(() => {
        if(debouncedEmail){
            fetchUserData(1);
        }
    }, [fetchUserData, debouncedEmail]);


    const handleUpdateSubcription = async() => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: debouncedEmail,
                    isSubscribed: !user?.isSubscribed,
                }),
            });

            if(!response.ok){
                throw new Error("Failed to update subscription");
            }
            // const data = await response.json();
            fetchUserData(currentPage);
            // toast can be added here after succesfully updating subscription
        } catch (error) {
            console.error("Error updating subscription", error);
        } finally {
            setIsLoading(false);
        }
    }


    const handleUpdateTodo = async(id: string, completed: boolean) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: debouncedEmail,
                    todoId: id,
                    todoCompleted: completed,
                }),
            });

            if(!response.ok) throw new Error("Failed to update todo");

            fetchUserData(currentPage);
            // toast can be added here after succesfully updating todo
        } catch (error: any) {
            console.error("Error updating todo", error);
        } finally {
            setIsLoading(false);
        }
    }


    const handleDeleteTodo = async(id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    todoId: id,
                }),
            });

            if(!response.ok) throw new Error("Failed to delete todo");

            fetchUserData(currentPage);
            // toast can be added here after succesfully deleting todo
        } catch (error: any) {
            console.error("Error deleting todo", error);
        } finally {
            setIsLoading(false);
        }
    }


  return (
    <>
        <div>

        </div>
    </>
  )
}
