import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useBreakpointValue } from "@chakra-ui/react";
import { Box, Image } from '@chakra-ui/react';
const TierRow = ({ tierName, items = [], tierId, color }) => {
   const columns = useBreakpointValue({ base: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' });
  return (
    <div>
      <h3 style={{ display: 'flex', alignItems : 'center', padding: 3, marginBottom: 5, marginTop : 5, borderRadius : 5 ,backgroundColor: color }}>{tierName}</h3>
    <Droppable droppableId={tierId} direction="horizontal">
  {(provided) => (
<Box
  ref={provided.innerRef}
  {...provided.droppableProps}
  style={{
    display: 'grid',
    gridTemplateColumns: columns, // No curly braces needed here
    gap: '1px',
    width: '100%',
    minHeight: '100px',
    border: '2px dashed #ccc',
    padding: '10px',
  }}
>
  {Array.isArray(items) && items.length > 0 ? (
    items.map((item, index) => (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
            }}
          >
            <img
              src={item.src}
              alt={`Item-${index}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          </div>
        )}
      </Draggable>
    ))
  ) : (
    <p>No items</p>
  )}
  {provided.placeholder}
</Box>
  )}
</Droppable>

    </div>
  );
};

export default TierRow;
