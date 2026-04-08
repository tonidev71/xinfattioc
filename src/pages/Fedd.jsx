import PostCard from '../components/PostCard';

const DUMMY_POSTS = [
  { id: 1, user: "DevMaster", content: "Programando Xinfattioc con React, ¡esto vuela!", timestamp: "Hace 2 min", likes: 24 },
  { id: 2, user: "UX_Queen", content: "¿Qué les parece la nueva paleta de colores? 🎨 #Design", timestamp: "Hace 15 min", likes: 102 },
  { id: 3, user: "JuniorCoder", content: "Hoy aprendí que no debo borrar la carpeta node_modules por error. 💀", timestamp: "Hace 1 hora", likes: 56 },
];

const Feed = () => {
  return (
    <div className="max-w-xl mx-auto">
      {/* Caja para crear nuevo post */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
        <input 
          type="text" 
          placeholder="¿Qué hay de nuevo?" 
          className="bg-gray-100 rounded-full px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Lista de posts */}
      {DUMMY_POSTS.map(post => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Feed;