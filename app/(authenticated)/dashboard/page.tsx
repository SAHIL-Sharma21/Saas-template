"use client";

import { useUser } from "@clerk/nextjs";
import { Todo } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {TodoForm} from '@/components/TodoForm';


function Dashboard() {
  const { user } = useUser();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [debounceSearchTerm] = useDebounceValue(searchTerm, 300);

  const fetchTodos = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/todos?page=${page}&search=${debounceSearchTerm}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data = await response.json();
        setTodos(data.todos);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching todos", error);
      }
    },
    [debounceSearchTerm]
  );

  useEffect(() => {
    fetchTodos(1);
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subscription`);

      if (!response.ok) {
        throw new Error("Failed to fetch subscription status");
      }

      const data = await response.json();
      setIsSubscribed(data.isSubscribed);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching subscription status", error);
    }
  };

  const handleAddTodo = async (title: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }
      const data = await response.json();
      await fetchTodos(currentPage);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error adding todo", error);
    }
  };

  const handleUpdateTodo = async (id: string, completed: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      const data = await response.json();
      await fetchTodos(currentPage);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error updating todo", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      await fetchTodos(currentPage);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting todo", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 max-w-3xl mb-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome, {user?.emailAddresses[0].emailAddress}
        </h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Todos</CardTitle>
          </CardHeader>
          <CardContent>
            <TodoForm onSubmit={handleAddTodo} />
          </CardContent>
        </Card>
        {!isSubscribed && todos.length >= 3 && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              You&apos;ve reached the maximum number of free todos.{" "}
              <Link href="/subscribe">Subnscribe Now</Link> To Add More.
            </AlertDescription>
          </Alert>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Your Todos</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Search Todos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            {loading ? (
              <p className="text-center text-muted-foreground">
                Loading your todos...
              </p>
            ) : (
              <>
                <ul className="space-y-4">{/* todoItem, component  */}</ul>
                {/* pagination component */}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Dashboard;
