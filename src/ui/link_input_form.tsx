import { Card } from "@material-tailwind/react"
import Button from "@material-tailwind/react/components/Button"
import { Input } from "@material-tailwind/react/components/Input"
import Typography from "@material-tailwind/react/components/Typography"
import React, { useState, type FormEvent } from "react"

import { LinkStore } from "~dao/link_store"
import { Link } from "~models/link"

const LinkInputForm = () => {
  const linkStore: LinkStore = LinkStore.getInstance()
  const [link, setLink] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (isSubmitting || !link || !name) return
    setIsSubmitting(true)
    await linkStore.addLink(Link.urlWithProtocol(link), name)
    setLink("")
    setName("")
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-5 shadow-lg">
        <div className="flex items-center">
          <div className="w-1/6 flex-none">
            <Typography variant="h6">Name:</Typography>
          </div>
          <div className="flex-auto">
            <Input
              type="text"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              crossOrigin={undefined}
            />
          </div>
        </div>
        <div className="m-2" />
        <div className="flex items-center">
          <div className="w-1/6 flex-none">
            <Typography variant="h6">Link:</Typography>
          </div>
          <div className="flex-auto">
            <Input
              type="text"
              label="Add link with `[]` placeholder"
              value={link}
              placeholder='Eg: "github.com/username/[]"'
              onChange={(e) => setLink(e.target.value)}
              crossOrigin={undefined}
            />
          </div>
        </div>
        <div className="m-1" />
        <Button type="submit" className="my-2">
          Add
        </Button>
      </Card>
    </form>
  )
}
export default LinkInputForm
