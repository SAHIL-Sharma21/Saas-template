'use client'

import React, { useState } from 'react'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';


interface TodoFormProps {
    onSubmit: (title: string) => void;
}

export function TodoForm({onSubmit}: TodoFormProps) {

    const [title, setTitle] = useState("");
    const handleSubmit = (e : React.FormEvent) =>{
        e.preventDefault();
        if(title.trim()){
            onSubmit(title);
            setTitle("");
        }
    }

  return (
    <form onSubmit={handleSubmit} className='flex space-x-2 mb-4'>
        <div>
            <Label htmlFor='title' className='text-base'>Enter the Title</Label>
            <div className='flex space-x-2'>
                <Input
                type='text'
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter the New Todo'
                className='flex-grow'
                required
                />
                <Button type='submit' variant="outline" className='bg-primary text-white'>
                    Add Todo
                </Button>
            </div>
        </div>
    </form>
  )
}
