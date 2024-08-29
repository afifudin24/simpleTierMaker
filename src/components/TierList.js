import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { HamburgerIcon, DownloadIcon } from '@chakra-ui/icons';
import {
  Box,
  Grid,
  Input,
  GridItem,
  Heading,
  Button,
  useColorMode,
  useColorModeValue,
  Flex,
  Switch,
  Text,
} from '@chakra-ui/react';
import { DragDropContext } from 'react-beautiful-dnd';
import TierRow from './TierRow';
import ImageUploader from './ImageUploader';
import ImagePool from './ImagePool';
import TierSettings from './TierSettings';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TierList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const pdfRef = useRef(null);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const positionStyle = useBreakpointValue({
    base: {
      position: 'fixed',
      bottom: 20,
      left: 4,
      zIndex: 10,
    },
    md: {
      position: 'static',
    },
  });

  const positionSave = {
    position: 'fixed',
    bottom: 30,
    left: 4,
    zIndex: 10,
  };

  const saveToPdf = () => {
    const input = pdfRef.current;
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const padding = 10;
        const imgWidth = 210 - 2 * padding;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', padding, padding, imgWidth, imgHeight);
        pdf.save('tierlist.pdf');
      })
      .catch((err) => console.error('Error saving to PDF', err));
  };

  const [imagePool, setImagePool] = useState([]);
  const [tiers, setTiers] = useState({});
  const [tierOrder, setTierOrder] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.100', 'gray.900');
  const footerBg = useColorModeValue('gray.700', 'gray.50');
  const color = useColorModeValue('black', 'white');
  const colorNot = useColorModeValue('white', 'black');

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const storedImagePool = localStorage.getItem('imagePool');
    const storedTiers = localStorage.getItem('tiers');
    const storedTierOrder = localStorage.getItem('tierOrder');

    if (storedImagePool) setImagePool(JSON.parse(storedImagePool));
    if (storedTiers) setTiers(JSON.parse(storedTiers));
    if (storedTierOrder) setTierOrder(JSON.parse(storedTierOrder));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('imagePool', JSON.stringify(imagePool));
  }, [imagePool]);

  useEffect(() => {
    localStorage.setItem('tiers', JSON.stringify(tiers));
  }, [tiers]);

  useEffect(() => {
    localStorage.setItem('tierOrder', JSON.stringify(tierOrder));
  }, [tierOrder]);

  const handleOnDragEnd = (result) => {
    console.log(result);
    if (!result.destination) {
      const { source, destination } = result;
      if (source.droppableId === 'imagePool') {
        const updatedPool = Array.from(imagePool);
        updatedPool.splice(source.index, 1);
        setImagePool(updatedPool);
      } else {
        const sourceTierItems = Array.from(tiers[source.droppableId].items);
        sourceTierItems.splice(source.index, 1);
        setTiers({
          ...tiers,
          [source.droppableId]: {
            ...tiers[source.droppableId],
            items: sourceTierItems,
          },
        });
      }
      return;
    }

    const { source, destination } = result;
    if (source.droppableId === 'imagePool' && destination.droppableId !== 'imagePool') {
      const movedImage = imagePool[source.index];
      const updatedPool = Array.from(imagePool);
      updatedPool.splice(source.index, 1);

      const targetTierItems = Array.from(tiers[destination.droppableId].items);
      targetTierItems.splice(destination.index, 0, movedImage);

      setTiers({
        ...tiers,
        [destination.droppableId]: {
          ...tiers[destination.droppableId],
          items: targetTierItems,
        },
      });
      setImagePool(updatedPool);
    } else if (destination.droppableId === 'imagePool' && source.droppableId !== 'imagePool') {
      const sourceTierItems = Array.from(tiers[source.droppableId].items);
      const [movedImage] = sourceTierItems.splice(source.index, 1);

      setTiers({
        ...tiers,
        [source.droppableId]: {
          ...tiers[source.droppableId],
          items: sourceTierItems,
        },
      });
      setImagePool([...imagePool, movedImage]);
    } else if (destination.droppableId === source.droppableId) {
      console.log("kocak");
    } else {
      const sourceTierItems = Array.from(tiers[source.droppableId].items);
      const destTierItems = Array.from(tiers[destination.droppableId].items);
      const [movedItem] = sourceTierItems.splice(source.index, 1);
      destTierItems.splice(destination.index, 0, movedItem);

      setTiers({
        ...tiers,
        [source.droppableId]: {
          ...tiers[source.droppableId],
          items: sourceTierItems,
        },
        [destination.droppableId]: {
          ...tiers[destination.droppableId],
          items: destTierItems,
        },
      });
    }
  };

  const handleUpload = (images) => {
    const newItems = images.map((src) => ({
      id: uuidv4(),
      src,
    }));
    setImagePool((prevPool) => [...prevPool, ...newItems]);
  };

  return (
    <Box bg={bg} paddingBottom={60}>
      <Box width={['100%', '90%']} marginX="auto" color={color} minHeight="100vh" p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading>TierMaker</Heading>
          <Flex alignItems="center">
            <Text mr={2}>{colorMode === 'light' ? 'Light Mode' : 'Dark Mode'}</Text>
            <Switch
              css={{
                transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
              }}
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
              colorScheme="teal"
            />
          </Flex>
        </Flex>
        <Grid templateColumns={isMobile ? 'auto' : '30% auto'} gap={6}>
          {!isMobile && (
            <GridItem>
              <TierSettings
                tiers={tiers}
                setTiers={setTiers}
                tierOrder={tierOrder}
                setTierOrder={setTierOrder}
              />
            </GridItem>
          )}

          <GridItem>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <ImageUploader onUpload={handleUpload} />
          
              {
                !isMobile && (
                   <Button marginX={2} onClick={saveToPdf} mb={4} colorScheme="teal">
                Save to PDF
              </Button>
                )
              }
             
              <ImagePool images={imagePool} />
              <Box ref={pdfRef}>
                {tierOrder.map((tier) => (
                  <TierRow
                    key={tier.name}
                    tierName={tier.name}
                    color={tier.color}
                    items={tiers[tier.name]?.items || []}
                    tierId={tier.name}
                  />
                ))}
              </Box>
            </DragDropContext>
            
          </GridItem>
        </Grid>
      </Box>
        <Box w={'100%'}
        h={10}
        padding={5}
        paddingBottom={10}
        position={'fixed'}
        bottom={0}
          bg={footerBg}

        >
        <Text align={'center'} href color={colorNot} fontWeight={'bold'}>
          <a href='https://ynzhiao.my.id'>
          Afif Waliyudin
          </a>
          </Text>
        </Box>
      {isMobile && (
        <>
          <IconButton
             
             onClick={saveToPdf}
              icon={<DownloadIcon />}  // Using a settings icon
              colorScheme="twitter"
              aria-label="save"
            {...positionSave}
          />
          <IconButton
              ref={btnRef}
              onClick={onOpen}
              icon={<HamburgerIcon />}  // Using a settings icon
              colorScheme="teal"
              aria-label="Open Settings"
            {...positionStyle}
          />
          <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Tiers</DrawerHeader>

              <DrawerBody>
                <TierSettings
                  tiers={tiers}
                  setTiers={setTiers}
                  tierOrder={tierOrder}
                  setTierOrder={setTierOrder}
                />
              </DrawerBody>

              {/* <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue">Save</Button>
              </DrawerFooter> */}
            </DrawerContent> 
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default TierList;
