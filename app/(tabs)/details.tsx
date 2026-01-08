import { useLocalSearchParams } from 'expo-router';
import BookDetailScreen from '../../src/screens/BookDetailScreen';

export default function DetailsPage() {
  const params = useLocalSearchParams();
  
 
  return <BookDetailScreen route={{ params }} />;
}