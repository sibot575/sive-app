import React, { useState } from 'react';
import { Search, Bell, ThumbsUp, ThumbsDown, Share2, MoreHorizontal, Menu, User, Youtube } from 'lucide-react';

const VideoPlayer = ({ videoId, title, channelName, subscribers, views, likes, timestamp }) => (
  <div className="w-full">
    <div className="aspect-video bg-black">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/p2YA6-ades8`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
    <h1 className="text-xl font-bold mt-3 mb-2">{title}</h1>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h2 className="font-semibold">{channelName}</h2>
          <p className="text-sm text-gray-500">{subscribers} abonnés</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold">S'abonner</button>
      </div>
      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full">
          <ThumbsUp className="w-5 h-5" />
          <span>{likes}</span>
        </button>
        <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full">
          <ThumbsDown className="w-5 h-5" />
        </button>
        <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full">
          <Share2 className="w-5 h-5" />
          <span>Partager</span>
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
    <div className="bg-gray-100 p-3 rounded-lg text-sm">
      <p className="font-semibold">{views} vues • {timestamp}</p>
      <p className="mt-2 line-clamp-2">
        Israël vs. Palestine, ce conflit semble éternel. Pourtant, au début du XXème, Juifs et Arabes vivaient en
        paix depuis des siècles, dans une Palestine qui n'abritait que 0.3% des Juifs du monde. Cette vidéo
        explore l'invention de sionisme, la colonisation juive en Palestine avec les Anglais, jusqu'à ...
      </p>
      <button className="mt-1 text-blue-600 font-semibold">Afficher plus</button>
    </div>
  </div>
);

const CommentSection = ({ commentCount, topComment }) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-4">{commentCount} commentaires</h3>
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
        <User className="w-5 h-5 text-gray-600" />
      </div>
      <input 
        type="text" 
        placeholder="Ajouter un commentaire..." 
        className="flex-grow p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
      />
    </div>
    {topComment && (
      <div className="mt-6 flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-sm">{topComment.author}</h4>
            <span className="text-xs text-gray-500">{topComment.timestamp}</span>
          </div>
          <p className="mt-1 text-sm">{topComment.content}</p>
          <div className="flex items-center space-x-4 mt-2">
            <button className="flex items-center space-x-1 text-gray-500 text-sm">
              <ThumbsUp className="w-4 h-4" />
              <span>{topComment.likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 text-sm">
              <ThumbsDown className="w-4 h-4" />
            </button>
            <button className="text-gray-500 text-sm font-semibold">Répondre</button>
          </div>
        </div>
      </div>
    )}
  </div>
);

const VideoThumbnail = ({ videoId, title, channelName, views, timestamp }) => (
  <div className="flex space-x-2">
    <div className="w-40 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
    <div className="flex flex-col justify-between flex-grow">
      <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
      <p className="text-xs text-gray-500">{channelName}</p>
      <p className="text-xs text-gray-500">{views} vues • il y a {timestamp}</p>
    </div>
  </div>
);

export default function YouTubeLikePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredVideo = {
    id: 'p2YA6-ades8',
    title: "L'origine du conflit : de l'invention du sionisme à la création d'Israël",
    channelName: "Osons Causer",
    subscribers: "417k",
    views: "399k vues",
    likes: "11k",
    timestamp: "il y a 5 mois"
  };

  const recommendedVideos = [
    { id: 'p2YA6-ades8', title: "Comment Israël a dominé sa région ? (1948-1979)", channelName: "Osons Causer", views: "83k", timestamp: "2 mois" },
    { id: 'KGD4o87cm7E', title: "FASHION WEEK : Comment y survivre ? (Coperni à Disneyland)", channelName: "Sulivan Gwed", views: "12k", timestamp: "17 heures" },
    { id: 'kT5sFIdDZHE', title: "La véritable histoire de Netanyahou : d'Israël à criminel de guerre", channelName: "Gaspard G", views: "705k", timestamp: "10 jours" },
    { id: 'placeholder1', title: "Pourquoi l'avenir du Moyen-Orient dépend autant d'Israël", channelName: "Le Monde", views: "994k", timestamp: "9 mois" },
    { id: 'placeholder2', title: "KONGOSSA : LES GAYS M'ONT RENDU MALADE", channelName: "LAGOZZLE", views: "7.1k", timestamp: "14 heures" },
  ];

  const topComment = {
    author: "Osons Causer",
    content: "Merci beaucoup pour vos super retours pour cette vidéo, ça nous fait plaisir à lire, surtout vu le boulot que notre série historique sur le conflit nous a demandé. Si vous voulez voir la suite (et soutenir notre travail), vous pouvez le faire sur notre site :",
    timestamp: "il y a 5 mois",
    likes: 171
  };

  return (
    <div className="bg-white min-h-screen">
      <header className="sticky top-0 bg-white z-10 px-4 py-2 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Menu className="h-6 w-6 mr-4" />
          <Youtube className="h-6 w-6 text-red-600" />
        </div>
        <div className="flex-grow max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="h-6 w-6" />
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoPlayer {...featuredVideo} />
            <CommentSection commentCount={2469} topComment={topComment} />
          </div>
          <div className="space-y-3">
            {recommendedVideos.map((video) => (
              <VideoThumbnail key={video.id} {...video} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}