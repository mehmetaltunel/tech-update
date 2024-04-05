import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
interface User {
  name: string;
  age: number;
  city: string;
}


@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent {
  users$: Observable<any[]>;

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    this.users$ = this.firestore.collection<User>('users').snapshotChanges().pipe(
      map((actions: any[]) => {
        return actions.map(action => {
          const data = action.payload.doc.data() as User;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  addUser() {
    const data: User = {
      name: 'Jane Doe',
      age: 25,
      city: 'Los Angeles'
    };

    this.firestore.collection('users').add(data);
  }

  deleteUser(userId: string) {
    this.firestore.collection('users').doc(userId).delete();
  }

  updateUser(userId: string) {
    const data: Partial<User> = {
      age: 35,
      city: 'San Francisco'
    };
    this.firestore.collection('users').doc(userId).update(data);
  }

  register() {
    this.afAuth.createUserWithEmailAndPassword("mmt.altnll@gmail.com", "password")
      .then((userCredential) => {
        // Kayıt başarılı
        console.log('User registered:', userCredential.user);
      })
      .catch((error) => {
        // Hata
        console.error('Registration failed:', error);
      });
  }

  signIn() {
    this.afAuth.signInWithEmailAndPassword("mmt.altnll@gmail.com", "password")
      .then((userCredential) => {
        // Oturum açma başarılı
        console.log('User signed in:', userCredential.user);
      })
      .catch((error) => {
        // Hata
        console.error('Sign in failed:', error);
      });
  }
}
