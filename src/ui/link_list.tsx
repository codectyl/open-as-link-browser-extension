import React, {MouseEventHandler, useEffect, useState} from "react";
import {Link} from "../models/link";
import {LinkStore} from "../dao/link_store";

const LinkList = () => {
  const [links, setLinks] = useState<null | Array<Link>>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const linkStore = LinkStore.getInstance();
  const loadLinks = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const fetchedLinks = await linkStore.getAllLinks();
      setLinks(fetchedLinks);
    } catch (er: any) {
      setError(er.toString());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLinks().then();
    linkStore.addListener(loadLinks);
    return () => {
      linkStore.removeListener(loadLinks);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!links) {
    return <div>No Links Added</div>;
  }

  return (
      <div>
        <ul>
          {links.map((link, index) => (
              <li key={index}>
                <LinkButton
                    link={link}
                    onCopyTap={() => {
                    }}
                    onDeleteTap={() => {
                      linkStore.removeLink(link.id).then();
                    }}
                />
              </li>
          ))}
        </ul>
      </div>
  );
};

const LinkButton = (props: {
  link: Link;
  onCopyTap: MouseEventHandler<HTMLButtonElement>;
  onDeleteTap: MouseEventHandler<HTMLButtonElement>;
}) => {
  const {link, onCopyTap, onDeleteTap} = props;
  return (
      <>
        <div>{link.name}</div>
        <div>{link.url}</div>
        <div>
          <button onClick={onCopyTap}>Copy</button>
        </div>
        <div>
          <button onClick={onDeleteTap}>Delete</button>
        </div>
      </>
  );
};

export default LinkList;
