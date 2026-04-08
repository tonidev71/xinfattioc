import { useState } from 'react';
import { Heart, MessageCircle, Share2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { doc, deleteDoc } from "firebase/firestore";

export default function PostCard({ id, user, userId, content, timestamp, likes, imageUrl, currentUserUid }) {
  const [isLiked, setIsLiked] = useState(false);
  
  // TU LLAVE MAESTRA DE ADMINISTRADOR
  const ADMIN_UID = "aQRFSCDFZ3VSDMqk8j7z9t25iL"; 

  const handleDelete = async () => {
    if (window.confirm("¿Toni, estás seguro de que quieres eliminar este post?")) {
      try {
        await deleteDoc(doc(db, "posts", id));
      } catch (error) {
        alert("Error al intentar borrar el post: " + error.message);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-3xl border border-slate-800 mb-4 overflow-hidden shadow-lg"
    >
      {/* CABECERA DEL POST */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center font-bold text-white shadow-inner">
            {user ? user[0].toUpperCase() : "?"}
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">@{user}</h4>
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider">
              {timestamp}
            </span>
          </div>
        </div>

        {/* BOTÓN DE BORRAR: Solo para Toni (Admin) o el Autor */}
        {(currentUserUid === userId || currentUserUid === ADMIN_UID) && (
          <button 
            onClick={handleDelete} 
            className="text-slate-600 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-full"
            title="Eliminar publicación"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      
      {/* CONTENIDO DE TEXTO */}
      <div className="px-4 pb-3 text-sm text-slate-300 leading-relaxed text-left">
        {content}
      </div>

      {/* IMAGEN (Si existe) */}
      {imageUrl && (
        <div className="border-t border-slate-800 bg-black/20">
          <img 
            src={imageUrl} 
            alt="Contenido del post" 
            className="w-full h-auto max-h-[450px] object-contain mx-auto" 
          />
        </div>
      )}

      {/* BOTONES DE INTERACCIÓN */}
      <div className="p-3 border-t border-slate-800/50 flex gap-6">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> 
          {isLiked ? (likes || 0) + 1 : (likes || 0)}
        </button>
        
        <button className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-400 transition-colors">
          <MessageCircle size={18} /> Comentar
        </button>
        
        <button className="text-slate-500 hover:text-green-400 transition-colors ml-auto">
          <Share2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}