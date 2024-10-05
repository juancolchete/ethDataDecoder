"use client"

import { useState, KeyboardEvent, useRef, useEffect, FormEvent } from 'react'
import { X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ethers } from 'ethers'

export function FormWithDataAndTypes() {
  const [data, setData] = useState('')
  const [types, setTypes] = useState<string[]>([])
  const [typeInputValue, setTypeInputValue] = useState('')
  const typeInputRef = useRef<HTMLInputElement>(null)

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(e.target.value)
  }

  const handleTypeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeInputValue(e.target.value)
  }

  const handleTypeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && typeInputValue.trim() !== '') {
      e.preventDefault()
      setTypes([...types, typeInputValue.trim()])
      setTypeInputValue('')
    } else if (e.key === 'Backspace' && typeInputValue === '' && types.length > 0) {
      setTypes(types.slice(0, -1))
    }
  }

  const removeType = (index: number) => {
    setTypes(types.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (typeInputRef.current) {
      typeInputRef.current.focus()
    }
  }, [types])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with:', { data, types })
    console.log(ethers.AbiCoder.defaultAbiCoder().decode(types,data))
    // Here you can handle the form submission, e.g., send data to an API
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <Label htmlFor="dataInput">Data</Label>
        <Input
          id="dataInput"
          type="text"
          value={data}
          onChange={handleDataChange}
          placeholder="Enter your data"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="typeInput">Types</Label>
        <div className="flex flex-wrap items-center p-2 border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {types.map((type, index) => (
            <Badge key={index} variant="secondary" className="mr-1 mb-1">
              {type}
              <button
                type="button"
                onClick={() => removeType(index)}
                className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
          <Input
            id="typeInput"
            ref={typeInputRef}
            type="text"
            className="flex-grow border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            placeholder={types.length === 0 ? "Type and press Enter" : ""}
            value={typeInputValue}
            onChange={handleTypeInputChange}
            onKeyDown={handleTypeKeyDown}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  )
}
