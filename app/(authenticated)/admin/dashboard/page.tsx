// admin dashboard
'use client';

import { Pagination } from '@/components/Pagination';
import { TodoItem } from '@/components/TodoItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Todo, User } from '@prisma/client';
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

    const handleSearchUser = (e: React.FormEvent) => {
        e.preventDefault();
        setDebouncedEmail(email);
    } 


  return (
    <>
        <div className='container mx-auto p-4 max-w-3xl mb-8'>
            <h1 className='text-3xl font-bold mb-8 text-center'>Admin Dashboard</h1>
            <Card className='mb-8'>
                <CardHeader>
                    <CardTitle>Search User</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearchUser} className='flex space-x-2'>
                        <Input 
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter User email'
                        required
                        />
                        <Button type='submit'>Search</Button>
                    </form>
                </CardContent>
            </Card>
            {isLoading ? (
                <>
                    <Card>
                        <CardContent className='text-center py-8'>
                            <p className='text-muted-foreground'>Loading user Data....</p>
                        </CardContent>
                    </Card>
                </>
            ) : user ? (
                <>
                    <Card className='mb-8'>
                        <CardHeader>
                            <CardTitle>
                                User Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Email: {user.email}</p>
                            <p>
                                Subscription Status:{" "}
                                {user.isSubscribed ? "Subscribed" : "Not Subscribed"}
                            </p>
                            {user.subscriptionEnds && (
                                <p>
                                    Subscription Ends:{" "}
                                    {new Date(user.subscriptionEnds).toLocaleDateString()}
                                </p>
                            )}
                            <Button className='mt-2' onClick={handleUpdateSubcription}>
                                {user.isSubscribed ? "Cancel subscription": "Subscribe"}
                            </Button>
                        </CardContent>
                    </Card>  

                    {user.todos.length > 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>user Todos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className='space-y-4'>
                                    {user.todos.map((todo) => (
                                        <TodoItem 
                                        key={todo.id}
                                        todo={todo}
                                        isAdmin={true}
                                        onUpdate={handleUpdateTodo}
                                        onDelete={handleDeleteTodo}
                                        />
                                    ))}
                                </ul>
                                <Pagination 
                                currentPage={currentPage}
                                totalPage={totalPages}
                                onPageChange={(page) => fetchUserData(page)}
                                />
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className='text-center py-8'>
                                <p className='text-muted-foreground'>This User has no todos.</p>
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : debouncedEmail ? (
                <Card>
                    <CardContent className='text-center py-8'>
                        <p className='text-muted-foreground'>No User found</p>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    </>
  );
}
