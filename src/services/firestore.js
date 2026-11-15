import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const DOC_ID = 'wedding-data-main';

// Busca os dados do casamento no Firestore
export async function getWeddingData() {
  try {
    const docRef = doc(db, 'wedding', DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null; // Retorna null se não existir (o AppLayout usará os dados iniciais)
  } catch (error) {
    console.error('Erro ao carregar dados do Firestore:', error);
    return null;
  }
}

// Salva/atualiza os dados do casamento no Firestore
// Usamos { merge: true } para não apagar campos que não foram enviados
export async function saveWeddingData(data) {
  try {
    const docRef = doc(db, 'wedding', DOC_ID);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Erro ao salvar dados no Firestore:', error);
  }
}