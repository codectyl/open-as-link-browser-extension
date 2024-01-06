import {
  ClipboardIcon,
  DocumentDuplicateIcon,
  TrashIcon
} from "@heroicons/react/24/outline"
import {
  Card,
  CardBody,
  CardFooter
} from "@material-tailwind/react/components/Card"
import IconButton from "@material-tailwind/react/components/IconButton"
import { List, ListItem } from "@material-tailwind/react/components/List"
import Tooltip from "@material-tailwind/react/components/Tooltip"
import Typography from "@material-tailwind/react/components/Typography"
import React, { useEffect, useState, type MouseEventHandler } from "react"

import { LinkStore } from "~dao/link_store"
import { Link } from "~models/link"
import { copyToClipboard, readClipboardText } from "~utils"

const LinkList = () => {
  const [links, setLinks] = useState<null | Array<Link>>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>(undefined)

  const [clipboard, setClipboard] = useState<string | undefined>(undefined)

  const linkStore = LinkStore.getInstance()
  const loadLinks = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const fetchedLinks = await linkStore.getAllLinks()
      setLinks(fetchedLinks)
    } catch (er: any) {
      setError(er.toString())
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    readClipboardText().then((val) => {
      setClipboard(val)
    })
    loadLinks()
    linkStore.addListener(loadLinks)
    return () => {
      linkStore.removeListener(loadLinks)
    }
  }, [])

  if (isLoading) {
    return (
      <Typography
        variant="h6"
        className="h-48 flex items-center justify-center">
        Loading...
      </Typography>
    )
  }

  if (error) {
    return (
      <Typography
        variant="h6"
        className="h-48 flex items-center justify-center">
        Error: {error}
      </Typography>
    )
  }

  if (!links) {
    return (
      <Typography
        variant="h6"
        className="h-48 flex items-center justify-center">
        No Links Added
      </Typography>
    )
  }

  return (
    <div>
      <List>
        {links
          .sort((a, b) => b.sortOrder - a.sortOrder)
          .map((link, index) => (
            <ListItem key={index} className="p-1" selected={false}>
              <LinkInfo
                link={link}
                onPasteTap={
                  clipboard
                    ? () =>
                        chrome.tabs.create({ url: link.resolveLink(clipboard) })
                    : undefined
                }
                onCopyTap={() => copyToClipboard(link.url)}
                onDeleteTap={() => linkStore.removeLink(link.id)}
              />
            </ListItem>
          ))}
      </List>
    </div>
  )
}

const LinkInfo = (props: {
  link: Link
  onCopyTap: MouseEventHandler<HTMLButtonElement>
  onDeleteTap: MouseEventHandler<HTMLButtonElement>
  onPasteTap?: MouseEventHandler<HTMLButtonElement>
}) => {
  const { link, onCopyTap, onDeleteTap, onPasteTap } = props
  return (
    <>
      <Card className="flex w-full flex-row">
        <CardBody className="grow self-center break-all">
          <Typography variant="h6">{link.name}</Typography>
          <Typography variant="small">{link.url}</Typography>
        </CardBody>
        <CardFooter className="flex-none self-center">
          <div className="flex">
            {onPasteTap && (
              <Tooltip content="Paste">
                <IconButton size="sm" variant="text" onClick={onPasteTap}>
                  <ClipboardIcon className="h-6 w-6" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip content="Copy">
              <IconButton size="sm" variant="text" onClick={onCopyTap}>
                <DocumentDuplicateIcon className="h-6 w-6" />
              </IconButton>
            </Tooltip>
            <div className="mx-1" />
            <Tooltip content="Delete">
              <IconButton
                size="sm"
                variant="text"
                color="red"
                onClick={onDeleteTap}>
                <TrashIcon className="h-6 w-6" />
              </IconButton>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export default LinkList
