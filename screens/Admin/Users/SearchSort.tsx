import React from 'react';
import { HStack, Button, FormControl, Input } from 'native-base';

interface SearchSortProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSort: (by: "name" | "role") => void;
}

const SearchSort: React.FC<SearchSortProps> = ({ searchTerm, setSearchTerm, handleSort }) => {
  return (
    <>
      <FormControl mb={4}>
        <Input
          placeholder="Tìm kiếm người dùng"
          value={searchTerm}
          onChangeText={setSearchTerm}
          borderColor="blue.400"
          bg="white"
          borderRadius="md"
          _focus={{ borderColor: "blue.600" }}
        />
      </FormControl>

      <HStack space={4} mb={4}>
        <Button onPress={() => handleSort("name")} colorScheme="teal" flex={1}>
          Sắp xếp theo tên
        </Button>
        <Button onPress={() => handleSort("role")} colorScheme="teal" flex={1}>
          Sắp xếp theo vai trò
        </Button>
      </HStack>
    </>
  );
};

export default SearchSort;
