import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Image } from '@chakra-ui/react';
import { useBreakpointValue } from "@chakra-ui/react";

const ImagePool = ({ images }) => {
  const columns = useBreakpointValue({ base: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' });
  return (
   <Droppable droppableId="imagePool" direction="horizontal">
  {(provided) => (
    <Box
      ref={provided.innerRef}
      {...provided.droppableProps}
      display="grid"
      p={4}
      border="1px solid"
      borderColor="gray.300"
      borderRadius="5px"
      minHeight="100px"
      mb={4}
          gridTemplateColumns={columns}
      gap={1} // Adjust the gap between images if necessary
    >
      {images.length > 0 ? (
        images.map((image, index) => (
          <Draggable key={image.id} draggableId={image.id} index={index}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <Image
                  src={image.src}
                  alt={`Uploaded ${index}`}
                  boxSize="100px"

                  objectFit="cover"
                />
              </Box>
            )}
          </Draggable>
        ))
      ) : (
        <p>No Images</p>
      )}
      {provided.placeholder}
    </Box>
  )}
</Droppable>
  );
};

export default ImagePool;
