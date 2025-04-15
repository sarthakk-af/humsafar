import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Icon } from '@rneui/base';

export default function SeedDataSageAI({ navigation, route }) {
  const [category, setCategory] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationObj, setLocationObj] = useState('');
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const categories = [
    { label: "Historical Sites", value: "Historical Sites" },
    { label: "Beaches", value: "Beaches" },
    { label: "Mountains", value: "Mountains" },
    { label: "Cities", value: "Cities" },
    { label: "National Parks", value: "National Parks" },
    { label: "Deserts", value: "Deserts" },
    { label: "Islands", value: "Islands" },
    { label: "Forests", value: "Forests" },
    { label: "Lakes", value: "Lakes" },
    { label: "Villages", value: "Villages" },
    { label: "Archaeological Sites", value: "Archaeological Sites" },
    { label: "Cultural Landmarks", value: "Cultural Landmarks" },
    { label: "Temples", value: "Temples" },
    { label: "Monasteries", value: "Monasteries" },
    { label: "Museums", value: "Museums" },
    { label: "Wildlife Reserves", value: "Wildlife Reserves" },
    { label: "Gardens and Botanical Parks", value: "Gardens and Botanical Parks" },
    { label: "Waterfalls", value: "Waterfalls" },
    { label: "Caves", value: "Caves" },
    { label: "Castles and Palaces", value: "Castles and Palaces" },
    { label: "Hot Springs", value: "Hot Springs" },
    { label: "Rivers", value: "Rivers" },
    { label: "Savannas", value: "Savannas" }
  ];

  const handleSearchLocation = async (query) => {
    if (query.length < 3) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
      }}>
        <Text style={{
          fontFamily: 'Sansita-Bold',
          fontSize: 75,
          color: 'black'
        }}>Welcome to </Text>

        <Text style={{
          fontFamily: 'Sansita-Bold',
          fontSize: 100,
          color: 'black'
        }}>SageAI</Text>
      </View>
      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item enabled={false} label='Select Category' value='' />
          {categories.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          inverted
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              setLocationName(item.name);
              setLocationObj(item);
              setSearchResults([]);
            }}>
              <Text style={styles.searchResultTitle}>{item.name}</Text>
              <Text style={styles.searchResult}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
          style={styles.fullWidthList}
        />
      )}
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={locationName}
        placeholder='Location'
        multiline
        onChangeText={(text) => {
          setLocationName(text);
          handleSearchLocation(text);
        }}
      />
      {error !== '' ? <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text> : null}
      <View style={styles.containerButton}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('QnASageAI', { category, locationName })}
        >
          <Icon name="arrow-forward" color="white" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    paddingHorizontal: 10
  },
  input: {
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 25,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  searchResult: {
    fontFamily: 'Sansita-Regular',
    paddingVertical: 10,
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchResultTitle: {
    fontFamily: 'Sansita-Bold',
    fontSize: 20,
  },
  fullWidthList: {
    width: '100%',
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 15,
    backgroundColor: '#008080',
    borderRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#008080',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  floatingButton: {
    backgroundColor: '#008080',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  containerButton: {
    paddingVertical: 10,
    alignItems: 'flex-end',
  },
  floatingButton: {
    backgroundColor: '#008080',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});
