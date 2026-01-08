import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image, ScrollView,
  StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookService } from '../api/bookService';

export default function BookDetailScreen({ route }) {
  const router = useRouter();
  const { bookData, isbn } = route.params;
  const book = JSON.parse(bookData);
  
  const [reviews, setReviews] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    if (isbn) {
      setFetching(true);
      // Silent catch handles network errors on device without red popups
      BookService.getBookReviews(isbn)
        .then(setReviews)
        .catch(() => setReviews(null))
        .finally(() => setFetching(false));
    } else {
      setFetching(false); 
    }
  }, [isbn]);

  const getRatingUI = () => {
    let score = null;
    let label = "No rating available";

    if (reviews && reviews.length > 0) {
      score = reviews[0].rank || 4;
      label = `${reviews.length} NYT Reviews`;
    } else if (book.volumeInfo.averageRating) {
      score = book.volumeInfo.averageRating;
      label = `${score} (${book.volumeInfo.ratingsCount || 0} reviews)`;
    }

    if (!score) return <Text style={styles.ratingText}>{label}</Text>;

    const stars = '★'.repeat(Math.round(score)) + '☆'.repeat(5 - Math.round(score));
    return (
      <>
        <Text style={styles.stars}>{stars}</Text>
        <Text style={styles.ratingText}>{label}</Text>
      </>
    );
  };

  if (fetching) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#55d4ae" />
      </SafeAreaView>
    );
  }


  const imageUrl = book.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
   
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconPadding}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push({ pathname: "/", params: { resetSearch: 'true' } })}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
       
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.coverImage} 
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.coverImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="book-outline" size={50} color="#ccc" />
          </View>
        )}
        
        <Text style={styles.title}>{book.volumeInfo.title}</Text>
        
        
        <View style={styles.metadataContainer}>
          <Text style={styles.authorSubtitle}>{book.volumeInfo.authors?.join(', ')}</Text>
          <Text style={styles.dateSubtitle}>
            Published in {book.volumeInfo.publishedDate ? new Date(book.volumeInfo.publishedDate).getFullYear() : 'N/A'}
          </Text>
        </View>

        <View style={styles.ratingRow}>{getRatingUI()}</View>

        <Text style={styles.sectionHeader}>About the author</Text>
        <Text style={styles.bodyText}>
          {book.volumeInfo.authors?.join(', ') || "Author information unavailable."}
        </Text>

        <Text style={styles.sectionHeader}>Overview</Text>
        <Text style={styles.bodyText}>
          {book.volumeInfo.description || "No overview available for this title."}
        </Text>

        <TouchableOpacity 
          onPress={() => setIsRead(!isRead)}
          style={[styles.bookReadButton, { backgroundColor: isRead ? '#45ad8e' : '#55d4ae' }]}
        >
          <Text style={styles.buttonText}>{isRead ? '✓ Book Read' : 'Mark as Read'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 },
  iconPadding: { padding: 5 },
  scrollContent: { padding: 25 },
  coverImage: { 
    width: 220, 
    height: 320, 
    alignSelf: 'center', 
    borderRadius: 12, 
    marginBottom: 20,
    backgroundColor: '#f9f9f9' 
  },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#111827' },
  metadataContainer: { alignItems: 'center', marginTop: 5 },
  authorSubtitle: { color: '#6B7280', fontSize: 16 },
  dateSubtitle: { color: '#9CA3AF', fontSize: 14, marginTop: 2 },
  ratingRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 15 },
  stars: { color: '#f1c40f', fontSize: 20, letterSpacing: 2 },
  ratingText: { marginLeft: 10, color: '#6B7280', fontSize: 14 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 25, color: '#111827' },
  bodyText: { color: '#4B5563', lineHeight: 22, marginTop: 8, fontSize: 15 },
  bookReadButton: { paddingVertical: 16, borderRadius: 12, marginTop: 40, marginBottom: 40, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
