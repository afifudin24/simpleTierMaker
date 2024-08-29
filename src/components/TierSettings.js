import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  IconButton,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { MinusIcon } from '@chakra-ui/icons';
import { EditIcon, CloseIcon } from '@chakra-ui/icons'; // Choose appropriate icons
import { AddIcon} from '@chakra-ui/icons';
import { ChromePicker } from 'react-color';

const TierSettings = ({ tiers, setTiers, tierOrder, setTierOrder }) => {
  const [newTierName, setNewTierName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3182CE');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const bg = useColorModeValue('gray.100', 'gray.700');

  const handleAddTier = () => {
    if (newTierName && !tiers[newTierName]) {
      const newTier = { name: newTierName, color: selectedColor };

      setTiers((prevTiers) => ({
        ...prevTiers,
        [newTierName]: { items: [], color: selectedColor },
      }));
      setTierOrder((prevOrder) => [...prevOrder, newTier]);
      setNewTierName('');
      setSelectedColor('#3182CE');
      setShowColorPicker(false);
    }
    console.log(tierOrder);
  };

  const handleRemoveTier = (tierName) => {
    const updatedTiers = { ...tiers };
    delete updatedTiers[tierName];
    setTiers(updatedTiers);
    setTierOrder((prevOrder) => prevOrder.filter((t) => t.name !== tierName));
  };

  return (
    <VStack align="flex-start" spacing={4}>
      <Text fontSize="xl" fontWeight="bold">
        Manage Tiers
      </Text>
      <InputGroup size="md">
        <Input
          placeholder="Enter tier name"
          value={newTierName}
          onChange={(e) => setNewTierName(e.target.value)}
        />
        <InputRightElement width="auto">
           <IconButton
      icon={showColorPicker ? <CloseIcon /> : <EditIcon />}  // Use EditIcon for 'Pick Color' and CloseIcon for 'Hide Color Picker'
      onClick={() => setShowColorPicker(!showColorPicker)}
      aria-label={showColorPicker ? 'Hide Color Picker' : 'Pick Color'}  // Accessibility
      variant="outline"  // Optional: Style the button with an outline
      size="md"  // Adjust size as needed (sm, md, lg)
    />
        </InputRightElement>
      </InputGroup>
      {showColorPicker && (
        <Box>
          <ChromePicker
            color={selectedColor}
            onChangeComplete={(color) => setSelectedColor(color.hex)}
          />
        </Box>
      )}
      <Button
        w={20}
        h={8}
       fontSize='xs'
        leftIcon={<AddIcon />}
        colorScheme="blue"
        onClick={handleAddTier}
        disabled={!newTierName}
      >
        Add Tier
      </Button>

      <VStack align="stretch" spacing={2} w="100%">
        {tierOrder.map((tier) => (
          <HStack key={tier.name} h={8} spacing={4} w="100%" justifyContent="space-between">
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={tier.color}
              display="flex"
              justifyContent="center"
              alignItems="center"
              border="1px solid"
              borderColor='gray.200'
              borderRadius="md"
              w="100%"
              h="100%"
              bg={bg}
            >
              {tier.name}
            </Text>
            <IconButton
              h="100%"
              icon={<MinusIcon />}
              fontSize="sm"
              colorScheme="red"
              onClick={() => handleRemoveTier(tier.name)}
              aria-label={`Remove ${tier.name} tier`}
            />
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

export default TierSettings;
