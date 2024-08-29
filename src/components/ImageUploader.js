import React from 'react';
import { Input, Box, Icon, useBreakpointValue } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const ImageUploader = ({ onUpload }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(images).then((imageData) => {
      onUpload(imageData); // Send all images to the parent component
    });
  };

  const positionStyle = useBreakpointValue({
    base: {
      position: 'fixed',
      bottom: 40,
      right: 4,
      zIndex: 10,
    },
    md: {
      position: 'static',
      marginBottom: 3,
      zIndex: 1
    },
  });

  return (
    <>
      {
        isMobile ? (
          <Box
            as="label"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg="gray.200"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "gray.300" }}  // Hover effect
            position="fixed"
            bottom={30}
            right={4}
            zIndex={10}
          >
            <Icon as={AddIcon} w={6} h={6} color="gray.600" />
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              opacity={0}
              cursor="pointer"
            />
          </Box>
        ) : (
          <Box
            as="label"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={12}
              h={12}
              overflow={'hidden'}
            bg="gray.200"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "gray.300" }}  // Hover effect
            {...positionStyle}  // Apply the responsive style
          >
            <Icon as={AddIcon} w={6} h={6} color="gray.600" />
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
                position="absolute"
             
              top={0}
                left={0}
                zIndex={-1}
              width="100%"
              height="100%"
              opacity={0}
              cursor="pointer"
            />
          </Box>
        )
      }
    </>

  )
}
  export default ImageUploader;