import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// User operations
export const createUserProfile = async (userId, userData) => {
  try {
    await addDoc(collection(db, 'users'), {
      uid: userId,
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Listing operations
export const createListing = async (listingData) => {
  try {
    const docRef = await addDoc(collection(db, 'listings'), {
      ...listingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active'
    });
    return { id: docRef.id, ...listingData };
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const getListing = async (listingId) => {
  try {
    const listingRef = doc(db, 'listings', listingId);
    const listingSnap = await getDoc(listingRef);
    
    if (listingSnap.exists()) {
      return { id: listingSnap.id, ...listingSnap.data() };
    } else {
      throw new Error('Listing not found');
    }
  } catch (error) {
    console.error('Error getting listing:', error);
    throw error;
  }
};

export const updateListing = async (listingId, listingData) => {
  try {
    const listingRef = doc(db, 'listings', listingId);
    await updateDoc(listingRef, {
      ...listingData,
      updatedAt: serverTimestamp()
    });
    return { id: listingId, ...listingData };
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

export const deleteListing = async (listingId) => {
  try {
    await deleteDoc(doc(db, 'listings', listingId));
    return listingId;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

export const getListings = async ({
  category = null,
  location = null,
  minPrice = null,
  maxPrice = null,
  startDate = null,
  endDate = null,
  ownerId = null,
  status = 'active',
  lastDoc = null,
  pageSize = 10
}) => {
  try {
    let q = collection(db, 'listings');
    let constraints = [];

    // Add filters
    if (category) {
      constraints.push(where('category', '==', category));
    }
    if (location) {
      constraints.push(where('location', '==', location));
    }
    if (minPrice !== null) {
      constraints.push(where('price', '>=', minPrice));
    }
    if (maxPrice !== null) {
      constraints.push(where('price', '<=', maxPrice));
    }
    if (startDate) {
      constraints.push(where('availability.startDate', '<=', startDate));
    }
    if (endDate) {
      constraints.push(where('availability.endDate', '>=', endDate));
    }
    if (ownerId) {
      constraints.push(where('ownerId', '==', ownerId));
    }
    if (status) {
      constraints.push(where('status', '==', status));
    }

    // Add ordering
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(pageSize));

    // Add pagination
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    // Create and execute query
    q = query(q, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const listings = [];
    querySnapshot.forEach((doc) => {
      listings.push({ id: doc.id, ...doc.data() });
    });

    return {
      listings,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
    };
  } catch (error) {
    console.error('Error getting listings:', error);
    throw error;
  }
};

export const getUserListings = async (userId, lastDoc = null, pageSize = 10) => {
  return getListings({
    ownerId: userId,
    lastDoc,
    pageSize
  });
};

export const searchListings = async (searchTerm, lastDoc = null, pageSize = 10) => {
  try {
    // Note: This is a simple implementation. For better search functionality,
    // consider using Algolia or Firebase Extensions for search
    let q = query(
      collection(db, 'listings'),
      where('status', '==', 'active'),
      orderBy('title'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const listings = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Simple client-side filtering
      if (
        data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.location.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        listings.push({ id: doc.id, ...data });
      }
    });

    return {
      listings,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
    };
  } catch (error) {
    console.error('Error searching listings:', error);
    throw error;
  }
};

// Booking operations
export const createBooking = async (bookingData) => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getBooking = async (bookingId) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      return null;
    }
    
    return {
      id: bookingSnap.id,
      ...bookingSnap.data()
    };
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const getUserBookings = async (userId, userType = 'renter') => {
  try {
    const field = userType === 'renter' ? 'renterId' : 'ownerId';
    const q = query(
      collection(db, 'bookings'),
      where(field, '==', userId),
      orderBy('startDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return bookings;
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
};

// Review operations
export const createReview = async (reviewData) => {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getListingReviews = async (listingId) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('listingId', '==', listingId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return reviews;
  } catch (error) {
    console.error('Error getting listing reviews:', error);
    throw error;
  }
};

// Message operations
export const sendMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      createdAt: serverTimestamp(),
      read: false
    });
    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getConversation = async (userId1, userId2) => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', userId1),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.participants.includes(userId2)) {
        messages.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    return messages;
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, {
      read: true
    });
    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}; 