import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList,
  Platform,
  StatusBar, StyleSheet,
  Text, TextInput,
  TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookService } from '../api/bookService';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [term, setTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(term, 500);

  useFocusEffect(
    useCallback(() => {
      if (params.resetSearch === 'true') {
        setTerm('');
        setBooks([]);
        router.setParams({ resetSearch: undefined });
      }
    }, [params.resetSearch])
  );

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setBooks([]);
      return;
    }
    setLoading(true);
    
    BookService.searchBooks(debouncedSearch)
      .then(setBooks)
      .catch(() => setBooks([])) 
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/'); 
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.iconPadding}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Book</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchSection}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput 
            placeholder="Book title or author" 
            value={term} 
            onChangeText={setTerm}
            style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' }]}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      {loading && <ActivityIndicator color="#55d4ae" style={{ marginTop: 20 }} />}

      <FlatList
        data={books}
        contentContainerStyle={styles.listPadding}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bookItem}
            onPress={() => {
              const isbn = item.volumeInfo.industryIdentifiers?.[0]?.identifier;
              router.push({
                pathname: "/details",
                params: { bookData: JSON.stringify(item), isbn: isbn }
              });
            }}
          >
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
              <Text style={styles.bookAuthor}>by {item.volumeInfo.authors?.join(', ')}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 50 },
  headerTitle: { flex: 1, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginRight: 34 },
  iconPadding: { padding: 5 },
  searchContainer: { paddingHorizontal: 20, marginTop: 10 },
  searchSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F3F4F6', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 50 
  },
  input: { flex: 1, fontSize: 16, marginLeft: 10 },
  listPadding: { paddingHorizontal: 20, paddingBottom: 40 },
  bookItem: { marginVertical: 12 },
  bookTitle: { fontWeight: 'bold', color: '#10b981', fontSize: 16 },
  bookAuthor: { color: '#6B7280', marginTop: 2 }
});