import React from "react";
import { useDrop } from "react-dnd";

function ListLeads({ leads, title, listId, fetchLeads }) {
  function handleDrop() {}
  const [, dropRef] = useDrop({
    accept: "CARD",

    hover(item, monitor) {},
    drop(item, monitor) {
      handleDrop(item.id, listId);
    },
  });
  return <div>ListLeads</div>;
}

export default ListLeads;
