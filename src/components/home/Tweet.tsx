import React from "react";

interface TweetProps {
  id: string;
  text: string;
  created: Date;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

const Tweet: React.FC<TweetProps> = ({ text, created, user }) => {
  function formatDateTime(dateString: string): {
    formattedDate: string;
    formattedTime: string;
  } {
    // Convertir la chaîne en objet Date
    const date = new Date(dateString);

    // Obtenir les éléments de la date
    const day = date.getDate().toString().padStart(2, "0"); // Jour
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Mois
    const year = date.getFullYear(); // Année

    // Obtenir les éléments de l'heure
    const hours = date.getHours().toString().padStart(2, "0"); // Heures
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Minutes
    const seconds = date.getSeconds().toString().padStart(2, "0"); // Secondes

    // Formater la date
    const formattedDate = `${day}/${month}/${year}`;

    // Formater l'heure
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // Retourner la date et l'heure formatées
    return { formattedDate, formattedTime };
  }
  const { formattedDate, formattedTime } = formatDateTime(
    created.toISOString()
  );

  console.log(formattedDate);
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex items-start space-x-4 max-w-2xl border border-gray-200">
      <div className="flex-shrink-0">
        <img
          src={
            user?.avatar
              ? `REDACTEDapi/files/_pb_users_auth_/${user.id}/${user.avatar}`
              : `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${user.username}`
          }
          alt={`${user.username}'s avatar`}
          className="w-12 h-12 rounded-full"
        />
      </div>
      <div className="flex-grow">
        <div className="flex items-center space-x-1">
          <p className="font-semibold text-gray-900">{user.username}</p>
          <span className="text-gray-500">@{user.username}</span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-500">{`Le ${formattedDate} à ${formattedTime}`}</span>
        </div>
        <p className="text-gray-800 mt-2 text-sm">{text}</p>
      </div>
    </div>
  );
};

export default Tweet;
