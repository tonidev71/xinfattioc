import { useState, useRef, useEffect } from 'react';
import PostCard from './components/PostCard';
import { db, auth } from './firebase'; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { Image as ImageIcon, Home, LogOut, Bell, Search } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // 1. ESCUCHAR SI EL USUARIO ESTÁ LOGUEADO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. LEER POSTS EN TIEMPO REAL
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleString('es-ES', {
          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        }) || "Publicando..." 
      })));
    }, (error) => {
      console.error("Error en Firestore:", error);
    });
    return () => unsubscribe();
  }, [user]);

  // FUNCIONES DE ACCESO
  const handleRegister = async () => {
    if (!email || !password) return alert("Rellena todos los campos");
    try { 
      await createUserWithEmailAndPassword(auth, email, password); 
    } catch (err) { 
      alert("Error al registrar: " + err.message); 
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return alert("Rellena todos los campos");
    try { 
      await signInWithEmailAndPassword(auth, email, password); 
    } catch (err) { 
      alert("Error: " + err.message); 
    }
  };

  const handleLogout = () => signOut(auth).catch((err) => console.error(err));

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setSelectedImage(event.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreatePost = async () => {
    if (!inputValue.trim() && !selectedImage) return;
    try {
      await addDoc(collection(db, "posts"), {
        user: user.email.split('@')[0],
        userId: user.uid,
        content: inputValue,
        imageUrl: selectedImage,
        timestamp: serverTimestamp(),
        likes: 0
      });
      setInputValue("");
      setSelectedImage(null);
    } catch (err) {
      console.error("Error al publicar:", err);
    }
  };

  // VISTA LOGIN
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 w-full max-w-md shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-blue-500 italic tracking-tighter">XINFATTIOC</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Panel de Toni_Dev</p>
          </div>
          <div className="space-y-4">
            <input 
              type="email" placeholder="Email" 
              className="w-full p-4 bg-slate-800 rounded-2xl text-white outline-none border border-transparent focus:border-blue-500 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" placeholder="Password" 
              className="w-full p-4 bg-slate-800 rounded-2xl text-white outline-none border border-transparent focus:border-blue-500 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-3 pt-4">
              <button onClick={handleLogin} className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg">Entrar</button>
              <button onClick={handleRegister} className="flex-1 bg-slate-700 text-white p-4 rounded-2xl font-bold hover:bg-slate-600 active:scale-95 transition-all">Unirse</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VISTA APP PRINCIPAL
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-black text-blue-500 italic tracking-tighter">XINFATTIOC</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full hidden sm:block">{user.email}</span>
            <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-xl transition-all">
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 pt-8">
        <aside className="hidden md:block md:col-span-3 space-y-4">
          <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl mb-4 flex items-center justify-center text-3xl font-black shadow-xl">
                {user.email[0].toUpperCase()}
              </div>
              <h2 className="font-bold text-xl uppercase tracking-tight">{user.email.split('@')[0]}</h2>
              <p className="text-blue-500 text-xs font-bold mt-1 uppercase">Admin Supremo</p>
            </div>
            <nav className="mt-8 space-y-2">
              <div className="flex items-center gap-4 p-4 bg-blue-600/10 text-blue-500 rounded-2xl font-bold"><Home size={22}/> Inicio</div>
              <div className="flex items-center gap-4 p-4 text-slate-500 hover:bg-slate-800/50 rounded-2xl transition-all cursor-pointer"><Search size={22}/> Explorar</div>
              <div className="flex items-center gap-4 p-4 text-slate-500 hover:bg-slate-800/50 rounded-2xl transition-all cursor-pointer"><Bell size={22}/> Avisos</div>
            </nav>
          </div>
        </aside>

        <main className="md:col-span-6 pb-20">
          <div className="bg-slate-900 p-5 rounded-[2rem] border border-slate-800 mb-8 shadow-xl">
            <textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="¿Qué novedades hay, Toni?"
              className="w-full p-2 bg-transparent outline-none text-lg resize-none placeholder:text-slate-600"
              rows="3"
            />
            {selectedImage && (
              <div className="relative mb-4 mt-2">
                <img src={selectedImage} className="rounded-2xl max-h-72 w-full object-cover border border-slate-700 shadow-inner" alt="Preview" />
                <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-black/70 p-2 rounded-full hover:bg-red-600 transition-all text-white font-bold">✕</button>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-slate-800/50 pt-4">
              <button onClick={() => fileInputRef.current.click()} className="text-blue-500 hover:bg-blue-500/10 p-3 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm">
                <ImageIcon size={22} />
                <span className="hidden sm:inline">Foto</span>
                <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
              </button>
              <button 
                onClick={handleCreatePost} 
                disabled={!inputValue.trim() && !selectedImage}
                className="bg-blue-600 hover:bg-blue-700 px-10 py-3 rounded-2xl font-black text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-30"
              >
                PUBLICAR
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                {...post} 
                currentUserUid={user.uid} 
              />
            ))}
          </div>
        </main>

        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 sticky top-24">
            <h3 className="font-black text-slate-400 text-xs tracking-[0.2em] mb-6 uppercase italic">Trending</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-blue-500 uppercase">#ToniDev71</p>
                <p className="text-sm font-bold mt-0.5">Xinfattioc está online</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}